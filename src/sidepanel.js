const $ = (id) => document.getElementById(id);
const els = {
  uiLang: $("uiLang"),
  status: $("status"),
  sessionsTitle: $("sessionsTitle"),
  inputTitle: $("inputTitle"),
  langLabel: $("langLabel"),
  outputDeviceLabel: $("outputDeviceLabel"),
  lang: $("lang"),
  start: $("start"),
  stop: $("stop"),
  output: $("output"),
  partial: $("partial"),
  copy: $("copy"),
  exportTxt: $("exportTxt"),
  clear: $("clear"),
  storageUsage: $("storageUsage"),
  grantAccess: $("grantAccess"),
  toggleSessions: $("toggleSessions"),
  sessionsBody: $("sessionsBody"),
  sessionTabs: $("sessionTabs"),
  newSession: $("newSession"),
  deleteSession: $("deleteSession"),
  toggleControls: $("toggleControls"),
  controlsBody: $("controlsBody"),
  outputDevice: $("outputDevice"),
  applyOutputDevice: $("applyOutputDevice"),
  refreshDevices: $("refreshDevices"),
};

const SpeechRecognitionCtor =
  globalThis.webkitSpeechRecognition || globalThis.SpeechRecognition;
const TARGET_TAB_ID = getTargetTabIdFromUrl();

const STORAGE_KEY = "trans_criptirator_state_v2";
const LAYOUT_VERSION = 2;
const RECOGNITION_IDLE_RESTART_MS = 6000;
const SILENT_RESTART_DELAY_MS = 100;
const LOCAL_STORAGE_CAP_MB = 5;
const BYTES_IN_MB = 1024 * 1024;
const STORAGE_STOP_MB = 4.99;
const STORAGE_STOP_BYTES = STORAGE_STOP_MB * BYTES_IN_MB;
const STORAGE_OVERFLOW_ALERT_TEXT = "Память Transcriptor переполнена!";

const UI_TEXT = {
  ru: {
    ready: "Готово",
    start: "Старт",
    stop: "Стоп",
    allowMicrophoneAccess: "Разрешить доступ к микрофону",
    sessions: "Сессии",
    input: "Динамик-микрофон",
    show: "Показать",
    hide: "Скрыть",
    newSession: "Новая сессия",
    deleteSession: "Удалить сессию",
    language: "Язык",
    langRu: "Русский (ru-RU)",
    langEn: "English (en-US)",
    outputDevice: "Выходное устройство",
    sessionBase: "Сессия",
    applyToCurrentTab: "Применить к текущей вкладке",
    refreshDevices: "Обновить устройства",
    copy: "Копировать",
    exportTxt: "Экспорт .txt",
    clear: "Очистить",
    defaultOutputDevice: "Устройство вывода по умолчанию",
    outputPrefix: "Выход",
    listeningToMic: "Слушаю микрофон...",
    speechDetected: "Речь обнаружена...",
    micAccessBlocked:
      "Доступ к микрофону заблокирован. Нажмите 'Разрешить доступ к микрофону' и разрешите его на открытой вкладке.",
    stopped: "Остановлено",
    webSpeechUnavailable: "Web Speech API недоступен в этом браузере.",
    startingRecognition: "Запускаю распознавание речи...",
    cannotApplyOutputDevice: "Не удалось применить выходное устройство: {error}",
    cannotRefreshOutputDevices: "Не удалось обновить выходные устройства: {error}",
    switchingLanguage: "Переключаю язык распознавания на {lang}...",
    failedReadOutputDevices: "Не удалось получить список выходных устройств.",
    outputDevicesLimitedByPermission:
      "Список выходов ограничен: {error}. Разрешите микрофон для этой вкладки и обновите список.",
    outputDevicesLimitedNoPermission:
      "Список выходов ограничен. Разрешите микрофон для этой вкладки и нажмите Обновить устройства.",
    speakerSelectionBlocked:
      "Сайт блокирует speaker-selection. На этой вкладке нельзя принудительно переключить динамик.",
    selectedDevice: "выбранное устройство",
    defaultDevice: "устройство по умолчанию",
    outputSwitched: "Вывод переключен на {label}{details}.",
    outputDeviceNotApplied: "Выходное устройство не применено на этой вкладке.{error}",
    noPlayableMedia:
      "Не найдено воспроизводимых аудио/видео элементов. Запустите медиа на вкладке и нажмите Применить снова.",
    failedApplyOutputDevice: "Не удалось применить выходное устройство.",
    speechPermissionDenied:
      "Доступ к распознаванию речи запрещен. Нажмите 'Разрешить доступ к микрофону' и разрешите его на открытой вкладке.",
    cannotStartRecognition: "Не удалось запустить распознавание речи: {error}",
    failedOpenPermissionPage: "Не удалось открыть страницу разрешений.",
    permissionPageOpened: "Страница разрешений открыта. Разрешите микрофон и вернитесь.",
    cannotOpenPermissionPage: "Не удалось открыть страницу разрешений: {error}",
    reconnectingMic: "Переподключаю микрофон...",
    reconnectFailed: "Переподключение не удалось: {error}",
    noMicrophoneDetected: "Микрофон не найден.",
    speechServiceNetworkError: "Сетевая ошибка сервиса распознавания.",
    microphonePermissionDenied: "Доступ к микрофону запрещен.",
    speechServiceBlocked: "Сервис распознавания речи заблокирован.",
    noSpeechDetected: "Речь не обнаружена.",
    recognitionAborted: "Распознавание прервано.",
    speechRecognitionError: "Ошибка распознавания речи: {code}",
    appliedAndFailedDetails: " ({applied} применено, {failed} с ошибкой)",
    appliedElementsDetails: " ({applied} элементов)",
    copiedSession: "Сессия скопирована в буфер обмена.",
    storageUsage: "занято памяти {used}/{total}mb",
    initializationFailed: "Ошибка инициализации: {error}",
  },
  en: {
    ready: "Ready",
    start: "Start",
    stop: "Stop",
    allowMicrophoneAccess: "Allow microphone access",
    sessions: "Sessions",
    input: "Mic-Speaker",
    show: "Show",
    hide: "Hide",
    newSession: "New session",
    deleteSession: "Delete session",
    language: "Language",
    langRu: "Russian (ru-RU)",
    langEn: "English (en-US)",
    outputDevice: "Output device",
    sessionBase: "Session",
    applyToCurrentTab: "Apply to current tab",
    refreshDevices: "Refresh devices",
    copy: "Copy",
    exportTxt: "Export .txt",
    clear: "Clear",
    defaultOutputDevice: "Default output device",
    outputPrefix: "Output",
    listeningToMic: "Listening to microphone...",
    speechDetected: "Speech detected...",
    micAccessBlocked:
      "Microphone access is blocked. Click 'Allow microphone access' and allow in the opened tab.",
    stopped: "Stopped",
    webSpeechUnavailable: "Web Speech API is not available in this browser.",
    startingRecognition: "Starting speech recognition...",
    cannotApplyOutputDevice: "Cannot apply output device: {error}",
    cannotRefreshOutputDevices: "Cannot refresh output devices: {error}",
    switchingLanguage: "Switching language to {lang}...",
    failedReadOutputDevices: "Failed to read output devices.",
    outputDevicesLimitedByPermission:
      "Output list is limited: {error}. Allow microphone for this tab and refresh devices.",
    outputDevicesLimitedNoPermission:
      "Output list is limited. Allow microphone for this tab and click Refresh devices.",
    speakerSelectionBlocked:
      "This site blocks speaker-selection, so forcing output device on this tab is not possible.",
    selectedDevice: "selected device",
    defaultDevice: "default device",
    outputSwitched: "Output switched to {label}{details}.",
    outputDeviceNotApplied: "Output device was not applied on this tab.{error}",
    noPlayableMedia:
      "No playable audio/video elements found. Start media on the tab, then click Apply again.",
    failedApplyOutputDevice: "Failed to apply output device.",
    speechPermissionDenied:
      "Speech recognition permission denied. Click 'Allow microphone access' and allow in the opened tab.",
    cannotStartRecognition: "Cannot start speech recognition: {error}",
    failedOpenPermissionPage: "Failed to open permission page.",
    permissionPageOpened: "Permission page opened. Allow microphone there, then return.",
    cannotOpenPermissionPage: "Cannot open permission page: {error}",
    reconnectingMic: "Reconnecting microphone...",
    reconnectFailed: "Reconnect failed: {error}",
    noMicrophoneDetected: "No microphone detected.",
    speechServiceNetworkError: "Speech service network error.",
    microphonePermissionDenied: "Microphone permission denied.",
    speechServiceBlocked: "Speech recognition service is blocked.",
    noSpeechDetected: "No speech detected.",
    recognitionAborted: "Recognition aborted.",
    speechRecognitionError: "Speech recognition error: {code}",
    appliedAndFailedDetails: " ({applied} applied, {failed} failed)",
    appliedElementsDetails: " ({applied} elements)",
    copiedSession: "Session was copied to clipboard.",
    storageUsage: "storage used {used}/{total}mb",
    initializationFailed: "Initialization failed: {error}",
  },
};

let recognition = null;
let wantListening = false;
let listening = false;
let starting = false;
let showGrantButton = false;
let outputDevices = [];
let applyingTabSink = false;
let recognitionIdleTimer = null;
let lastRecognitionTextAt = 0;
let silentRestartPending = false;
let showingStorageOverflowAlert = false;

let interimText = "";

let state = loadState();
ensureStateShape();

function formatMessage(template, params = {}) {
  if (typeof template !== "string") return String(template ?? "");
  return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ""));
}

function t(key, params) {
  const lang = state?.uiLang === "en" ? "en" : "ru";
  const template = UI_TEXT[lang]?.[key] ?? UI_TEXT.en?.[key] ?? key;
  return formatMessage(template, params);
}

function applyInterfaceLanguage() {
  document.documentElement.lang = state.uiLang === "en" ? "en" : "ru";

  els.start.textContent = t("start");
  els.stop.textContent = t("stop");
  els.grantAccess.textContent = t("allowMicrophoneAccess");
  els.sessionsTitle.textContent = t("sessions");
  els.inputTitle.textContent = t("input");
  els.newSession.textContent = t("newSession");
  els.deleteSession.textContent = t("deleteSession");
  els.langLabel.textContent = t("language");
  els.outputDeviceLabel.textContent = t("outputDevice");
  els.applyOutputDevice.textContent = t("applyToCurrentTab");
  els.refreshDevices.textContent = t("refreshDevices");
  els.copy.textContent = t("copy");
  els.exportTxt.textContent = t("exportTxt");
  els.clear.textContent = t("clear");

  const ruOpt = els.lang.querySelector('option[value="ru-RU"]');
  const enOpt = els.lang.querySelector('option[value="en-US"]');
  if (ruOpt) ruOpt.textContent = t("langRu");
  if (enOpt) enOpt.textContent = t("langEn");

  updateSessionsVisibility();
  updateControlsVisibility();
  renderOutputDevices();
  updateStorageUsage();
}

els.uiLang.addEventListener("change", () => {
  const next = els.uiLang.value === "en" ? "en" : "ru";
  if (state.uiLang === next) return;
  state.uiLang = next;
  persistState();
  applyInterfaceLanguage();
  if (!listening && !starting && !wantListening) {
    setStatus("idle", t("ready"));
  }
});

els.start.addEventListener("click", () => {
  startListening();
});
els.stop.addEventListener("click", () => {
  stopListening();
});
els.clear.addEventListener("click", () => {
  const session = getActiveSession();
  if (!session) return;
  session.lines = [];
  interimText = "";
  persistState();
  renderTranscript();
});
els.copy.addEventListener("click", () => {
  navigator.clipboard.writeText(asText());
  setStatus("active", t("copiedSession"));
});
els.exportTxt.addEventListener("click", () => {
  const blob = new Blob([asText()], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${getActiveSessionName()}-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});
els.grantAccess.addEventListener("click", () => {
  openPermissionPage();
});
els.lang.addEventListener("change", () => {
  setLanguage(els.lang.value);
});
els.newSession.addEventListener("click", () => {
  createSession();
});
els.deleteSession.addEventListener("click", () => {
  deleteActiveSession();
});
els.toggleSessions.addEventListener("click", () => {
  state.sessionsVisible = !state.sessionsVisible;
  persistState();
  updateSessionsVisibility();
});
els.toggleControls.addEventListener("click", () => {
  state.controlsVisible = !state.controlsVisible;
  persistState();
  updateControlsVisibility();
});
els.outputDevice.addEventListener("change", () => {
  state.outputSinkId = els.outputDevice.value;
  const selectedOption = els.outputDevice.selectedOptions[0];
  state.outputSinkLabel = state.outputSinkId ? selectedOption?.textContent || "" : "";
  persistState();
  applyOutputDeviceToCurrentTab().catch((err) => {
    setStatus("error", t("cannotApplyOutputDevice", { error: err?.message || String(err) }));
  });
});
els.applyOutputDevice.addEventListener("click", () => {
  applyOutputDeviceToCurrentTab().catch((err) => {
    setStatus("error", t("cannotApplyOutputDevice", { error: err?.message || String(err) }));
  });
});
els.refreshDevices.addEventListener("click", () => {
  refreshOutputDevices({ requestPermission: true }).catch((err) => {
    setStatus("error", t("cannotRefreshOutputDevices", { error: err?.message || String(err) }));
  });
});

navigator.mediaDevices?.addEventListener?.("devicechange", () => {
  refreshOutputDevices({ requestPermission: false }).catch(() => {});
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

function ensureStateShape() {
  const hadLayoutVersion = typeof state.layoutVersion === "number";
  if (!hadLayoutVersion) {
    state.sessionsVisible = true;
    state.controlsVisible = true;
    state.layoutVersion = LAYOUT_VERSION;
  } else if (state.layoutVersion < LAYOUT_VERSION) {
    state.layoutVersion = LAYOUT_VERSION;
  }

  state.sessions = Array.isArray(state.sessions) ? state.sessions : [];
  state.uiLang = state.uiLang === "en" ? "en" : "ru";
  state.lang = state.lang === "en-US" ? "en-US" : "ru-RU";
  state.outputSinkId = typeof state.outputSinkId === "string" ? state.outputSinkId : "";
  state.outputSinkLabel = typeof state.outputSinkLabel === "string" ? state.outputSinkLabel : "";
  delete state.settingsVisible;
  delete state.llmEndpoint;
  delete state.llmModel;
  delete state.llmPrompt;
  delete state.llmVisible;
  delete state.llmSettingsVisible;
  delete state.llmResponseVisible;
  delete state.altHotkeysEnabled;
  state.sessionsVisible =
    typeof state.sessionsVisible === "boolean" ? state.sessionsVisible : true;
  state.controlsVisible =
    typeof state.controlsVisible === "boolean" ? state.controlsVisible : true;

  if (!state.sessions.length) {
    state.sessions.push(makeSession(`${t("sessionBase")} 1`));
  } else {
    for (const s of state.sessions) {
      s.id = typeof s.id === "string" ? s.id : makeId();
      s.name = typeof s.name === "string" && s.name.trim() ? s.name.trim() : t("sessionBase");
      s.createdAt = typeof s.createdAt === "number" ? s.createdAt : Date.now();
      s.lines = Array.isArray(s.lines) ? s.lines : [];
    }
  }

  if (!state.activeSessionId || !state.sessions.some((s) => s.id === state.activeSessionId)) {
    state.activeSessionId = state.sessions[0].id;
  }
  persistState();
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } finally {
    updateStorageUsage();
  }
}

function getLocalStorageUsedBytes() {
  let bytes = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (typeof key !== "string") continue;
      const value = localStorage.getItem(key) || "";
      bytes += (key.length + value.length) * 2;
    }
  } catch {
    return 0;
  }
  return bytes;
}

function formatMegaBytes(bytes) {
  return (bytes / BYTES_IN_MB).toFixed(2);
}

function isStorageOverflowed() {
  return getLocalStorageUsedBytes() >= STORAGE_STOP_BYTES;
}

function showStorageOverflowAlert() {
  if (showingStorageOverflowAlert) return;
  showingStorageOverflowAlert = true;
  try {
    alert(STORAGE_OVERFLOW_ALERT_TEXT);
  } finally {
    showingStorageOverflowAlert = false;
  }
}

function stopForStorageOverflow() {
  stopListening();
  setStatus("error", STORAGE_OVERFLOW_ALERT_TEXT);
  showStorageOverflowAlert();
}

function updateStorageUsage() {
  if (!els.storageUsage) return;
  const usedMb = formatMegaBytes(getLocalStorageUsedBytes());
  els.storageUsage.textContent = t("storageUsage", {
    used: usedMb,
    total: String(LOCAL_STORAGE_CAP_MB),
  });
}

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function makeSession(name) {
  return {
    id: makeId(),
    name,
    createdAt: Date.now(),
    lines: [],
  };
}

function getActiveSession() {
  return state.sessions.find((s) => s.id === state.activeSessionId) || null;
}

function getActiveSessionName() {
  const s = getActiveSession();
  return s?.name?.replace(/[^\p{L}\p{N}_-]+/gu, "_") || "session";
}

function createSession() {
  interimText = "";
  const num = state.sessions.length + 1;
  const session = makeSession(`${t("sessionBase")} ${num}`);
  state.sessions.push(session);
  state.activeSessionId = session.id;
  persistState();
  renderSessions();
  renderTranscript();
}

function deleteActiveSession() {
  const active = getActiveSession();
  if (!active) return;

  interimText = "";
  state.sessions = state.sessions.filter((s) => s.id !== active.id);
  if (!state.sessions.length) state.sessions.push(makeSession(`${t("sessionBase")} 1`));
  state.activeSessionId = state.sessions[0].id;
  persistState();
  renderSessions();
  renderTranscript();
}

function switchSession(sessionId) {
  if (state.activeSessionId === sessionId) return;
  interimText = "";
  state.activeSessionId = sessionId;
  persistState();
  renderSessions();
  renderTranscript();
}

function renderSessions() {
  els.sessionTabs.innerHTML = "";
  for (const session of state.sessions) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "session-tab" + (session.id === state.activeSessionId ? " is-active" : "");
    btn.textContent = session.name;
    btn.title = session.name;
    btn.addEventListener("click", () => switchSession(session.id));
    els.sessionTabs.append(btn);
  }
}

function createRecognition() {
  const rec = new SpeechRecognitionCtor();
  rec.lang = state.lang;
  rec.continuous = true;
  rec.interimResults = true;
  rec.maxAlternatives = 1;

  rec.onstart = () => {
    starting = false;
    listening = true;
    hideGrantAccessButton();
    markRecognitionTextActivity();
    setStatus("active", t("listeningToMic"));
    syncButtons();
  };

  rec.onaudiostart = () => {};

  rec.onspeechstart = () => {
    setStatus("active", t("speechDetected"));
  };

  rec.onresult = (event) => {
    const session = getActiveSession();
    if (!session) return;
    if (isStorageOverflowed()) {
      stopForStorageOverflow();
      return;
    }

    let changed = false;
    let interim = "";
    const previousInterim = interimText;

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const text = (result[0]?.transcript || "").trim();
      if (!text) continue;

      if (result.isFinal) {
        session.lines.push({ time: nowTime(), text });
        changed = true;
        if (isStorageOverflowed()) {
          persistState();
          renderTranscript();
          stopForStorageOverflow();
          return;
        }
      } else {
        interim += (interim ? " " : "") + text;
      }
    }

    interimText = interim;
    if (changed || interimText !== previousInterim) {
      markRecognitionTextActivity();
    }
    if (changed) {
      persistState();
      if (isStorageOverflowed()) {
        renderTranscript();
        stopForStorageOverflow();
        return;
      }
    }
    renderTranscript();
  };

  rec.onerror = (event) => {
    if (
      silentRestartPending &&
      (event.error === "aborted" || event.error === "no-speech")
    ) {
      return;
    }

    if (event.error === "no-speech") {
      setStatus("active", t("listeningToMic"));
      return;
    }

    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      wantListening = false;
      starting = false;
      listening = false;
      showGrantAccessButton();
      setStatus("error", t("micAccessBlocked"));
    } else {
      setStatus("error", speechErrorMessage(event.error));
    }
    syncButtons();
  };

  rec.onend = () => {
    const wasSilentRestart = silentRestartPending;
    silentRestartPending = false;
    stopRecognitionIdleWatchdog();
    listening = false;
    starting = false;
    if (!wasSilentRestart) {
      interimText = "";
      renderTranscript();
    }
    syncButtons();
    if (wantListening) {
      restartRecognitionSoon(wasSilentRestart ? SILENT_RESTART_DELAY_MS : undefined, {
        silent: wasSilentRestart,
      });
    } else {
      setStatus("idle", t("stopped"));
    }
  };

  return rec;
}

async function startListening() {
  if (isStorageOverflowed()) {
    stopForStorageOverflow();
    return;
  }
  if (!SpeechRecognitionCtor) {
    setStatus("error", t("webSpeechUnavailable"));
    return;
  }
  if (listening || starting) return;

  wantListening = true;
  starting = true;
  markRecognitionTextActivity();
  syncButtons();
  setStatus("loading", t("startingRecognition"));

  try {
    if (!wantListening) {
      starting = false;
      syncButtons();
      return;
    }
    if (!recognition) recognition = createRecognition();
    recognition.lang = state.lang;
    recognition.start();
    await refreshOutputDevices({ requestPermission: false }).catch(() => {});
  } catch (err) {
    starting = false;
    wantListening = false;
    handleRecognitionStartError(err);
    syncButtons();
  }
}

function stopListening() {
  wantListening = false;
  starting = false;
  silentRestartPending = false;
  stopRecognitionIdleWatchdog();
  interimText = "";
  if (recognition && (listening || starting)) {
    try {
      recognition.stop();
    } catch {
      // no-op
    }
  }
  if (!listening) setStatus("idle", t("stopped"));
  syncButtons();
}

async function refreshOutputDevices({ requestPermission }) {
  const res = await chrome.runtime.sendMessage({
    type: "GET_TAB_OUTPUT_DEVICES",
    requestPermission: Boolean(requestPermission),
    tabId: TARGET_TAB_ID,
  });
  if (!res?.ok) throw new Error(res?.error || t("failedReadOutputDevices"));
  outputDevices = Array.isArray(res.devices) ? res.devices : [];
  renderOutputDevices();

  if (requestPermission) {
    if (res.speakerSelectionAllowed === false) {
      setStatus("error", t("speakerSelectionBlocked"));
      return;
    }
    const permissionError = String(res.permissionError || "").trim();
    if (permissionError) {
      setStatus("error", t("outputDevicesLimitedByPermission", { error: permissionError }));
      return;
    }
    if (outputDevices.length <= 1) {
      setStatus("error", t("outputDevicesLimitedNoPermission"));
    }
  }
}

function renderOutputDevices() {
  let selected = state.outputSinkId || "";
  els.outputDevice.innerHTML = "";

  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = t("defaultOutputDevice");
  els.outputDevice.append(defaultOpt);

  for (const device of outputDevices) {
    const opt = document.createElement("option");
    opt.value = device.deviceId;
    opt.textContent = device.label || `${t("outputPrefix")} ${device.deviceId.slice(0, 8)}`;
    els.outputDevice.append(opt);
  }

  if (selected) {
    let match = outputDevices.find((device) => device.deviceId === selected);
    // Device ids can rotate between sessions; fall back to matching by label.
    if (!match && state.outputSinkLabel) {
      match = outputDevices.find((device) => device.label === state.outputSinkLabel);
      if (match) {
        selected = match.deviceId;
        state.outputSinkId = match.deviceId;
        persistState();
      }
    }
    // The remembered device may not be enumerated yet (devices not loaded or
    // microphone permission not granted). Keep the selection instead of wiping it.
    if (!match) {
      const opt = document.createElement("option");
      opt.value = selected;
      opt.textContent = state.outputSinkLabel || t("selectedDevice");
      els.outputDevice.append(opt);
    }
  }

  els.outputDevice.value = selected;
}

async function applyOutputDeviceToCurrentTab() {
  if (applyingTabSink) return;
  applyingTabSink = true;
  syncButtons();
  try {
    const sinkId = state.outputSinkId || "";
    const res = await chrome.runtime.sendMessage({
      type: "APPLY_TAB_OUTPUT_DEVICE",
      sinkId,
      tabId: TARGET_TAB_ID,
    });
    if (!res?.ok) throw new Error(res?.error || t("failedApplyOutputDevice"));

    const label = sinkId ? t("selectedDevice") : t("defaultDevice");
    const applied = Number(res.applied || 0);
    const failed = Number(res.failed || 0);
    if (applied > 0) {
      const details =
        failed > 0
          ? t("appliedAndFailedDetails", { applied, failed })
          : t("appliedElementsDetails", { applied });
      setStatus("active", t("outputSwitched", { label, details }));
    } else if (failed > 0) {
      const err = res.firstError ? ` ${res.firstError}.` : "";
      if (isSpeakerSelectionBlocked(res.firstError)) {
        setStatus("error", t("speakerSelectionBlocked"));
      } else {
        setStatus("error", t("outputDeviceNotApplied", { error: err }));
      }
    } else {
      setStatus("error", t("noPlayableMedia"));
    }
  } finally {
    applyingTabSink = false;
    syncButtons();
  }
}

function isSpeakerSelectionBlocked(errorText) {
  const txt = String(errorText || "").toLowerCase();
  if (!txt) return false;
  return (
    txt.includes("notallowederror") ||
    txt.includes("speaker-selection") ||
    txt.includes("permissions policy") ||
    txt.includes("permission policy")
  );
}

function getTargetTabIdFromUrl() {
  try {
    const tabId = Number(new URLSearchParams(location.search).get("tabId"));
    return Number.isInteger(tabId) && tabId > 0 ? tabId : null;
  } catch {
    return null;
  }
}

function handleRecognitionStartError(err) {
  const msg = String(err?.message || err || "");
  const lower = msg.toLowerCase();
  if (lower.includes("no-speech")) {
    setStatus("active", t("listeningToMic"));
    return;
  }
  if (lower.includes("not-allowed") || lower.includes("permission")) {
    showGrantAccessButton();
    setStatus("error", t("speechPermissionDenied"));
    return;
  }
  setStatus("error", t("cannotStartRecognition", { error: msg }));
}

async function openPermissionPage() {
  try {
    const res = await chrome.runtime.sendMessage({ type: "OPEN_MIC_PERMISSION_PAGE" });
    if (!res?.ok) throw new Error(res?.error || t("failedOpenPermissionPage"));
    setStatus("loading", t("permissionPageOpened"));
  } catch (err) {
    setStatus("error", t("cannotOpenPermissionPage", { error: err?.message || String(err) }));
  }
}

function markRecognitionTextActivity() {
  lastRecognitionTextAt = Date.now();
  scheduleRecognitionIdleWatchdog();
}

function scheduleRecognitionIdleWatchdog() {
  stopRecognitionIdleWatchdog();
  if (!wantListening || (!listening && !starting)) return;
  recognitionIdleTimer = setTimeout(checkRecognitionIdle, RECOGNITION_IDLE_RESTART_MS);
}

function stopRecognitionIdleWatchdog() {
  if (recognitionIdleTimer === null) return;
  clearTimeout(recognitionIdleTimer);
  recognitionIdleTimer = null;
}

function checkRecognitionIdle() {
  recognitionIdleTimer = null;
  if (!wantListening || (!listening && !starting) || !recognition) return;

  const idleFor = Date.now() - lastRecognitionTextAt;
  if (idleFor < RECOGNITION_IDLE_RESTART_MS) {
    recognitionIdleTimer = setTimeout(
      checkRecognitionIdle,
      RECOGNITION_IDLE_RESTART_MS - idleFor
    );
    return;
  }

  silentRestartRecognition();
}

function silentRestartRecognition() {
  if (!wantListening || (!listening && !starting) || !recognition) return;
  silentRestartPending = true;
  stopRecognitionIdleWatchdog();
  try {
    recognition.stop();
  } catch (err) {
    silentRestartPending = false;
    setStatus("error", t("reconnectFailed", { error: err?.message || String(err) }));
    syncButtons();
  }
}

function restartRecognitionSoon(delayMs = 250, { silent = false } = {}) {
  if (!silent) setStatus("loading", t("reconnectingMic"));
  setTimeout(() => {
    if (!wantListening || listening || starting || !recognition) return;
    try {
      starting = true;
      if (silent) markRecognitionTextActivity();
      recognition.lang = state.lang;
      recognition.start();
    } catch (err) {
      starting = false;
      setStatus("error", t("reconnectFailed", { error: err?.message || String(err) }));
    }
    syncButtons();
  }, delayMs);
}

function speechErrorMessage(code) {
  switch (code) {
    case "audio-capture":
      return t("noMicrophoneDetected");
    case "network":
      return t("speechServiceNetworkError");
    case "not-allowed":
      return t("microphonePermissionDenied");
    case "service-not-allowed":
      return t("speechServiceBlocked");
    case "no-speech":
      return t("noSpeechDetected");
    case "aborted":
      return t("recognitionAborted");
    default:
      return t("speechRecognitionError", { code });
  }
}

function showGrantAccessButton() {
  showGrantButton = true;
  syncButtons();
}

function hideGrantAccessButton() {
  showGrantButton = false;
  syncButtons();
}

function setStatus(stateName, text) {
  els.status.textContent = text;
  els.status.className = "status status--" + (stateName || "idle");
}

function syncButtons() {
  const active = listening || starting || wantListening;
  els.start.disabled = active;
  els.stop.disabled = !active;
  els.lang.disabled = starting;
  els.outputDevice.disabled = applyingTabSink;
  els.applyOutputDevice.disabled = applyingTabSink;
  els.grantAccess.hidden = !showGrantButton;
}

function updateSessionsVisibility() {
  const visible = Boolean(state.sessionsVisible);
  els.sessionsBody.hidden = !visible;
  els.toggleSessions.textContent = visible ? t("hide") : t("show");
}

function updateControlsVisibility() {
  const visible = Boolean(state.controlsVisible);
  els.controlsBody.hidden = !visible;
  els.toggleControls.textContent = visible ? t("hide") : t("show");
}

function nowTime() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function renderTranscript() {
  const session = getActiveSession();
  const lines = session?.lines || [];
  els.output.innerHTML = "";
  for (const line of lines) {
    const div = document.createElement("div");
    div.className = "line";
    const ts = document.createElement("span");
    ts.className = "ts";
    ts.textContent = line.time;
    div.append(ts, document.createTextNode(line.text));
    els.output.append(div);
  }

  els.partial.textContent = interimText;
  els.output.scrollTop = els.output.scrollHeight;
}

function asText() {
  const session = getActiveSession();
  if (!session) return "";
  return session.lines.map((l) => `[${l.time}] ${l.text}`).join("\n");
}

function setLanguage(lang) {
  if (lang !== "ru-RU" && lang !== "en-US") return;
  state.lang = lang;
  persistState();
  if (recognition) recognition.lang = state.lang;

  if (listening && recognition) {
    interimText = "";
    renderTranscript();
    setStatus("loading", t("switchingLanguage", { lang }));
    wantListening = true;
    try {
      recognition.stop();
    } catch {
      // no-op
    }
  }
}

async function boot() {
  els.uiLang.value = state.uiLang;
  els.lang.value = state.lang;
  applyInterfaceLanguage();
  renderSessions();
  renderTranscript();
  await refreshOutputDevices({ requestPermission: false }).catch(() => {});
  syncButtons();

  if (!SpeechRecognitionCtor) {
    setStatus("error", t("webSpeechUnavailable"));
  } else {
    setStatus("idle", t("ready"));
  }
}

boot().catch((err) => {
  setStatus("error", t("initializationFailed", { error: err?.message || String(err) }));
});
