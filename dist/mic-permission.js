// src/mic-permission.js
var grant = document.getElementById("grant");
var statusEl = document.getElementById("status");
grant.addEventListener("click", () => {
  requestPermission();
});
async function requestPermission() {
  grant.disabled = true;
  setStatus("Requesting microphone access...", "");
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("getUserMedia is not supported in this browser.");
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    setStatus("Microphone access granted. You can close this tab.", "ok");
  } catch (err) {
    const text = mapError(err);
    setStatus(text, "error");
  } finally {
    grant.disabled = false;
  }
}
function mapError(err) {
  const name = String(err?.name || "");
  const message = String(err?.message || "");
  const lower = message.toLowerCase();
  if (name === "NotAllowedError" && lower.includes("dismissed")) {
    return "Permission dismissed. Click the button again and choose Allow.";
  }
  if (name === "NotAllowedError") {
    return "Permission denied. Enable microphone for this extension and try again.";
  }
  if (name === "NotFoundError") {
    return "No microphone found.";
  }
  if (name === "NotReadableError") {
    return "Microphone is busy in another application.";
  }
  return `Microphone request failed: ${message || name || "unknown error"}`;
}
function setStatus(text, cls) {
  statusEl.textContent = text;
  statusEl.className = cls;
}
