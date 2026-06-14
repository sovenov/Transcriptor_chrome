# Transcriptor_chrome

Chrome/Edge Manifest V3 extension for speech-to-text in the browser side panel, powered by the Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).

**🧩 Chrome Web Store:** https://chromewebstore.google.com/detail/transcriptor/fpgdnlmjjocgihdlfkamjogknmbpaoma

**Languages / Языки:** English · [Русский](README.ru.md)

---

Speech-to-text from an audio source, in the browser side panel, via the Web Speech API.
Completely free, no sign-up, no SMS!

The extension recognizes speech and shows the transcript right in the browser side panel. It supports multiple sessions, live interim text, copy and `.txt` export, and (optionally) sending the transcript to an external LLM service.

## What it does

- Opens a side panel from the extension action button.
- Captures speech from the microphone.
- Creates transcript lines by pause segmentation (1.5s silence threshold).
- Shows live interim text and finalized transcript lines.
- Stores sessions and settings in `localStorage`.
- Supports multiple sessions (create/delete and switch with tabs).
- Lets you pick an output device and apply it to media playback in the current tab.
- Supports copy and `.txt` export.

## How to transcribe audio from apps and tabs (via the VB-CABLE virtual cable)

The Web Speech API recognizes audio coming from a microphone. To transcribe audio from a call, a video, or a tab, you need to "wrap" it into a virtual microphone using a free virtual-cable program such as VB-CABLE (or a similar one). This is a one-time setup:

1. Download and install VB-CABLE (VB-Audio Virtual Cable). After installation, virtual devices "CABLE Input" (speaker) and "CABLE Output" (microphone) will appear in the system. Restart your computer if prompted.

2. Enable monitoring of the VB-CABLE microphone. Open "Sound Settings" → "Sound Control Panel" → "Recording" tab → select "CABLE Output" → "Properties" → "Listen to" tab → check "Listen to this device" and select your actual headphones or speakers. This way, you will hear the sound coming through the virtual cable.

3. Select the VB-CABLE virtual speaker in the extension. Open the extension's sidebar, expand the "Speaker-Microphone" section, and select "CABLE Input (VB-Audio Virtual Cable)" from the list of output devices. The extension will route the current tab's audio to the virtual cable.

4. In a Chrome browser, open Settings → "Privacy & Security" → Microphone. Select your virtual cable (CABLE Output or Virtual Audio Cable, etc.) as the primary microphone.
You can directly access this section of the settings by following this link:
chrome://settings/content/microphone

5. Click "Start" and allow access to the microphone. The extension will begin recognizing audio coming through the virtual cable and displaying text in the panel.

Result: tab audio → VB-CABLE virtual speaker → virtual microphone → speech recognition → text in the panel. Meanwhile you keep hearing the audio thanks to the listening option enabled in step 2.

## Zoom, Kontur Talk, Yandex Telemost, Google Meet

In these services, selecting the output device through the extension may not work — these apps and sites manage which speaker the audio is sent to themselves. In that case, select the virtual speaker "CABLE Input (VB-Audio Virtual Cable)" manually in the settings of the app or site ("Sound" / "Speaker" section). After that the extension keeps working correctly and recognizes speech — the only requirement is that the audio is sent to the VB-CABLE virtual speaker; how it gets there (through the extension or through the app/site itself) does not matter.

## Privacy

Transcripts and settings are stored locally in the browser. As fancy as it may sound, this is the only live-transcription extension that requires neither registration nor payment.

## Build

```powershell
npm install
npm run build
```

Build output is written to `dist`.

## Load unpacked extension

1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable Developer mode.
3. Click "Load unpacked" and select `dist`.
4. Click the extension action button to open the panel.
5. Press `Start` and allow microphone access.

## Notes

- Web Speech API support depends on the browser/version.
- In Chrome, speech recognition may use a cloud service and may require network access.
