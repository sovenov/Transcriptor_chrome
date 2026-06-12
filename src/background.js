chrome.action.onClicked.addListener((tab) => {
  if (!tab?.id) return;
  chrome.sidePanel.open({ tabId: tab.id }).catch((err) => {
    console.warn("sidePanel.open failed:", err);
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "OPEN_MIC_PERMISSION_PAGE") {
    chrome.tabs
      .create({ url: chrome.runtime.getURL("mic-permission.html") })
      .then(() => sendResponse?.({ ok: true }))
      .catch((err) => sendResponse?.({ ok: false, error: err?.message || String(err) }));
    return true;
  }

  if (message?.type === "APPLY_TAB_OUTPUT_DEVICE") {
    applyOutputDeviceToActiveTab(message.sinkId || "")
      .then((res) => sendResponse?.({ ok: true, ...res }))
      .catch((err) => sendResponse?.({ ok: false, error: err?.message || String(err) }));
    return true;
  }

  if (message?.type === "GET_TAB_OUTPUT_DEVICES") {
    getOutputDevicesFromActiveTab(Boolean(message.requestPermission))
      .then((res) => sendResponse?.({ ok: true, ...res }))
      .catch((err) => sendResponse?.({ ok: false, error: err?.message || String(err) }));
    return true;
  }

  return false;
});

async function getOutputDevicesFromActiveTab(requestPermission) {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab?.id) throw new Error("No active tab.");
  if (!tab.url || !/^https?:\/\//i.test(tab.url)) {
    throw new Error("Only http/https pages are supported.");
  }

  const [{ result } = {}] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    world: "MAIN",
    func: collectOutputDevicesInPage,
    args: [requestPermission],
  });

  return result || { devices: [] };
}

async function applyOutputDeviceToActiveTab(sinkId) {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab?.id) throw new Error("No active tab.");
  if (!tab.url || !/^https?:\/\//i.test(tab.url)) {
    throw new Error("Only http/https pages are supported.");
  }

  // Run on top frame first (most players live there). This avoids hard failures
  // on some subframes while still allowing output switching.
  let applied = 0;
  let failed = 0;
  let firstError = "";
  const collectStats = (result) => {
    if (!result || typeof result !== "object") return;
    applied += Number(result.applied || 0);
    failed += Number(result.failed || 0);
    if (!firstError && result.firstError) firstError = String(result.firstError);
  };

  const topFrameResult = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    world: "MAIN",
    func: injectAndSetSink,
    args: [sinkId],
  });
  for (const r of topFrameResult || []) collectStats(r?.result);

  // Best-effort for subframes. Ignore subframe injection failures.
  try {
    const subframeResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      world: "MAIN",
      func: injectAndSetSink,
      args: [sinkId],
    });
    for (const r of subframeResults || []) {
      if (r?.frameId === 0) continue;
      collectStats(r?.result);
    }
  } catch {
    // ignore subframe failures
  }

  return { applied, failed, firstError };
}

function injectAndSetSink(sinkId) {
  const key = "__transcriptiratorSinkRouter__";

  function makeRouter() {
    const router = {
      sinkId: "",
      seenMedia: new WeakSet(),
      media: new Set(),
      observedRoots: new WeakSet(),
      observers: [],
      patchedPlay: false,
      patchedAttachShadow: false,
      seenContexts: new WeakSet(),
      contexts: new Set(),
      patchedAudioContextCtor: false,

      rememberMedia(el) {
        if (!(el instanceof HTMLMediaElement)) return;
        if (this.seenMedia.has(el)) return;
        this.seenMedia.add(el);
        this.media.add(el);
      },

      rememberContext(ctx) {
        if (!ctx || typeof ctx !== "object") return;
        if (this.seenContexts.has(ctx)) return;
        this.seenContexts.add(ctx);
        this.contexts.add(ctx);
      },

      sweepMedia() {
        for (const el of this.media) {
          if (!el || !el.isConnected) this.media.delete(el);
        }
      },

      scan(root) {
        const base = root || document;
        if (
          !(base instanceof Document) &&
          !(base instanceof DocumentFragment) &&
          !(base instanceof Element)
        ) {
          return;
        }

        if (base instanceof HTMLMediaElement) this.rememberMedia(base);
        if (base instanceof Element && base.shadowRoot) this.observeRoot(base.shadowRoot);

        const doc = base.ownerDocument || document;
        const walker = doc.createTreeWalker(base, NodeFilter.SHOW_ELEMENT);
        let node = walker.currentNode;
        while (node) {
          if (node instanceof HTMLMediaElement) this.rememberMedia(node);
          if (node instanceof Element && node.shadowRoot) this.observeRoot(node.shadowRoot);
          node = walker.nextNode();
        }
      },

      observeRoot(root) {
        if (!(root instanceof Document || root instanceof ShadowRoot)) return;
        if (this.observedRoots.has(root)) return;
        this.observedRoots.add(root);

        this.scan(root);

        const observer = new MutationObserver((mutations) => {
          for (const m of mutations) {
            for (const node of m.addedNodes) this.scan(node);
          }
        });
        observer.observe(root, { childList: true, subtree: true });
        this.observers.push(observer);
      },

      patchAttachShadow() {
        if (this.patchedAttachShadow) return;
        this.patchedAttachShadow = true;

        const nativeAttachShadow = Element.prototype.attachShadow;
        if (typeof nativeAttachShadow !== "function") return;

        const self = this;
        Element.prototype.attachShadow = function patchedAttachShadow(init) {
          const shadow = nativeAttachShadow.call(this, init);
          try {
            self.observeRoot(shadow);
          } catch {
            // ignore
          }
          return shadow;
        };
      },

      patchAudioContextConstructor() {
        if (this.patchedAudioContextCtor) return;
        this.patchedAudioContextCtor = true;

        const self = this;
        const patchCtor = (name) => {
          const NativeCtor = window[name];
          if (typeof NativeCtor !== "function") return;
          if (NativeCtor.__transcriptorPatchedCtor__) return;

          const WrappedCtor = function patchedAudioContextCtor(...args) {
            const ctx = Reflect.construct(NativeCtor, args, new.target || WrappedCtor);
            self.rememberContext(ctx);
            self.applyToContext(ctx).catch(() => {});
            return ctx;
          };

          WrappedCtor.prototype = NativeCtor.prototype;
          Object.setPrototypeOf(WrappedCtor, NativeCtor);
          WrappedCtor.__transcriptorPatchedCtor__ = true;
          try {
            window[name] = WrappedCtor;
          } catch {
            // ignore if browser treats constructor as read-only
          }
        };

        patchCtor("AudioContext");
        patchCtor("webkitAudioContext");
      },

      async apply(targetSinkId) {
        this.sinkId = targetSinkId || "";
        this.scan(document);
        this.sweepMedia();
        let applied = 0;
        let failed = 0;
        let firstError = "";

        for (const el of this.media) {
          if (typeof el.setSinkId !== "function") continue;
          try {
            await el.setSinkId(this.sinkId);
            // Some live WebRTC players apply sink change only after a playback state transition.
            const isPlaying =
              !!el &&
              typeof el.paused === "boolean" &&
              !el.paused &&
              !el.ended &&
              Number(el.readyState || 0) > 1;
            if (isPlaying) {
              try {
                el.pause();
              } catch {
                // ignore
              }
              try {
                await el.play();
              } catch {
                // ignore autoplay/promise errors
              }
            }
            applied++;
          } catch (err) {
            failed++;
            if (!firstError) firstError = String(err?.name || err?.message || err);
          }
        }

        for (const ctx of this.contexts) {
          if (typeof ctx?.setSinkId !== "function") continue;
          try {
            await ctx.setSinkId(this.sinkId);
            applied++;
          } catch (err) {
            failed++;
            if (!firstError) firstError = String(err?.name || err?.message || err);
          }
        }

        return { applied, failed, firstError };
      },

      async applyToElement(el) {
        if (!(el instanceof HTMLMediaElement)) return;
        this.rememberMedia(el);
        if (typeof el.setSinkId !== "function") return;
        try {
          await el.setSinkId(this.sinkId || "");
        } catch {
          // ignore
        }
      },

      async applyToContext(ctx) {
        if (!ctx || typeof ctx.setSinkId !== "function") return;
        try {
          await ctx.setSinkId(this.sinkId || "");
        } catch {
          // ignore
        }
      },

      patchPlay() {
        if (this.patchedPlay) return;
        this.patchedPlay = true;
        const nativePlay = HTMLMediaElement.prototype.play;
        const self = this;

        HTMLMediaElement.prototype.play = async function patchedPlay() {
          await self.applyToElement(this);
          return nativePlay.apply(this, arguments);
        };
      },

      watchDom() {
        this.observeRoot(document);
      },
    };

    router.patchPlay();
    router.patchAttachShadow();
    router.patchAudioContextConstructor();
    router.scan(document);
    router.watchDom();
    return router;
  }

  if (!window[key]) window[key] = makeRouter();

  return window[key].apply(sinkId || "");
}

async function collectOutputDevicesInPage(requestPermission) {
  if (!navigator.mediaDevices?.enumerateDevices) return { devices: [] };
  const speakerSelectionAllowed = getSpeakerSelectionAllowed();
  let permissionError = "";
  if (requestPermission && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch (err) {
      permissionError = String(err?.name || err?.message || err || "getUserMedia failed");
    }
  }

  const list = await navigator.mediaDevices.enumerateDevices();
  const devices = list
    .filter((d) => d.kind === "audiooutput")
    .map((d) => ({ deviceId: d.deviceId, label: d.label || "" }));
  return { devices, permissionError, speakerSelectionAllowed };

  function getSpeakerSelectionAllowed() {
    try {
      const policy = document.permissionsPolicy || document.featurePolicy;
      if (!policy || typeof policy.allowsFeature !== "function") return null;
      return Boolean(policy.allowsFeature("speaker-selection"));
    } catch {
      return null;
    }
  }
}
