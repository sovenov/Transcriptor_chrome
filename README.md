# trans_criptirator

Chrome/Edge Manifest V3 extension for microphone speech-to-text in the browser side panel.

This version uses the browser Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).

## What it does

- Opens a side panel from the extension action button.
- Captures speech from the microphone.
- Creates transcript lines by pause segmentation (1.5s silence threshold).
- Shows live interim text and finalized transcript lines.
- Stores sessions and settings in `localStorage`.
- Supports multiple sessions (create/delete and switch with tabs).
- Lets you pick an output device and apply it to media playback in the current tab.
- Supports copy and `.txt` export.

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

- Web Speech API support depends on browser/version.
- In Chrome, speech recognition may use a cloud service and may require network access.
