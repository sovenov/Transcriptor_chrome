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

## Описание для магазина

Преобразование речи с аудиоисточника в текст, в боковой панели через Web Speech API.
Полностью бесплатно, без регистраций и смс!

Расширение распознаёт речь и показывает расшифровку прямо в боковой панели браузера. Поддерживаются несколько сессий, живой текст, копирование и экспорт в .txt, а также (по желанию) отправка расшифровки во внешний LLM-сервис.

КАК РАСПОЗНАВАТЬ ЗВУК ИЗ ПРИЛОЖЕНИЙ И ВКЛАДОК (через виртуальный кабель VB-CABLE)

Web Speech API распознаёт звук с микрофона. Чтобы распознавать звук из звонка, видео или вкладки, его нужно "завернуть" в виртуальный микрофон с помощью бесплатной программы для виртуального кабеля по типу - VB-CABLE (или подобной). Делается это один раз:

1. Скачайте и установите VB-CABLE (VB-Audio Virtual Cable). После установки в системе появятся виртуальные устройства "CABLE Input" (динамик) и "CABLE Output" (микрофон). Перезагрузите компьютер, если установщик попросит.

2. Включите прослушивание микрофона VB-CABLE. Откройте "Параметры звука" → "Панель управления звуком" → вкладка "Запись" → выберите "CABLE Output" → "Свойства" → вкладка "Прослушать" → поставьте галочку "Прослушивать с данного устройства" и выберите свои реальные наушники/динамики. Так вы будете слышать звук, который идёт в виртуальный кабель.

3. Выберите виртуальный динамик VB-CABLE в расширении. Откройте боковую панель расширения, разверните блок "Динамик-микрофон" и в списке выходных устройств выберите "CABLE Input (VB-Audio Virtual Cable)". Расширение направит звук текущей вкладки в виртуальный кабель.

4. Нажмите "Старт" и разрешите доступ к микрофону. Расширение начнёт распознавать звук, поступающий через виртуальный кабель, и выводить текст в панель.

Итог: звук вкладки → виртуальный динамик VB-CABLE → виртуальный микрофон → распознавание речи → текст в панели. При этом вы продолжаете слышать звук благодаря включённому прослушиванию (из шага 2).

ОСОБЕННОСТИ ZOOM, КОНТУР.ТОЛК, ЯНДЕКС.ТЕЛЕМОСТ, GOOGLE MEET

В таких сервисах выбор устройства вывода звука через расширение может не сработать - эти приложения и сайты сами управляют тем, на какой динамик выводить звук. В этом случае выберите виртуальный динамик "CABLE Input (VB-Audio Virtual Cable)" вручную в настройках самого приложения или сайта (раздел "Звук" / "Динамик"). После этого расширение продолжает корректно работать и распознаёт речь - нужно лишь, чтобы звук выводился именно в виртуальный динамик VB-CABLE, а каким способом он туда направлен (через расширение или через само приложение/сайт), значения не имеет.

Конфиденциальность: расшифровки и настройки хранятся локально в браузере.
Как бы пафасно не звучало, но это единственное расширение для live-транскрипции, не требующее регистрации и оплату.
