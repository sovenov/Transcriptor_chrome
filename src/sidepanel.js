const $ = (id) => document.getElementById(id);
const els = {
  uiLang: $("uiLang"),
  status: $("status"),
  sessionsTitle: $("sessionsTitle"),
  inputTitle: $("inputTitle"),
  llmTitle: $("llmTitle"),
  langLabel: $("langLabel"),
  outputDeviceLabel: $("outputDeviceLabel"),
  llmEndpointLabel: $("llmEndpointLabel"),
  llmModelLabel: $("llmModelLabel"),
  promptLabel: $("promptLabel"),
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
  toggleLlm: $("toggleLlm"),
  llmBody: $("llmBody"),
  outputDevice: $("outputDevice"),
  applyOutputDevice: $("applyOutputDevice"),
  refreshDevices: $("refreshDevices"),
  endpointWrap: $("endpointWrap"),
  modelWrap: $("modelWrap"),
  llmEndpoint: $("llmEndpoint"),
  llmModel: $("llmModel"),
  sendToLlmWrap: $("sendToLlmWrap"),
  sendToLlm: $("sendToLlm"),
  llmHotkeyHint: $("llmHotkeyHint"),
  altHotkeysToggle: $("altHotkeysToggle"),
  altHotkeysLabel: $("altHotkeysLabel"),
  toggleLlmResponse: $("toggleLlmResponse"),
  llmResponse: $("llmResponse"),
  togglePrompt: $("togglePrompt"),
  promptWrap: $("promptWrap"),
  llmPrompt: $("llmPrompt"),
};

const SpeechRecognitionCtor =
  globalThis.webkitSpeechRecognition || globalThis.SpeechRecognition;

const STORAGE_KEY = "trans_criptirator_state_v2";
const LAYOUT_VERSION = 2;
const LEGACY_EN_PROMPT = `Create a concise, structured meeting summary from the transcript.

Output sections:
1) Meeting topic (1-2 sentences).
2) Key questions raised (bullet list).
3) Decisions made / agreements (bullet list).
4) Open questions and risks (if any).
5) Next steps (who / what / when, if available).
6) End with your own improvement ideas (3-5 bullets).

Keep it short and practical. If data is missing, explicitly say what is missing.
If the transcript is mostly Russian, answer in Russian. If mostly English, answer in English.`;

const LEGACY_RU_PROMPT =
  "\u0421\u0434\u0435\u043b\u0430\u0439\u0020\u043a\u0440\u0430\u0442\u043a\u0438\u0439\u0020\u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439\u0020\u043f\u0435\u0440\u0435\u0441\u043a\u0430\u0437\u0020\u0432\u0441\u0442\u0440\u0435\u0447\u0438\u0020\u043f\u043e\u0020\u044d\u0442\u043e\u043c\u0443\u0020\u0442\u0440\u0430\u043d\u0441\u043a\u0440\u0438\u043f\u0442\u0443\u002e\n\n\u0422\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u044f\u0020\u043a\u0020\u043e\u0442\u0432\u0435\u0442\u0443\u003a\n\u0031\u0029\u0020\u0422\u0435\u043c\u0430\u0020\u0432\u0441\u0442\u0440\u0435\u0447\u0438\u0020\u0028\u0031\u002d\u0032\u0020\u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f\u0029\u002e\n\u0032\u0029\u0020\u041a\u043b\u044e\u0447\u0435\u0432\u044b\u0435\u0020\u0432\u043e\u043f\u0440\u043e\u0441\u044b\u002c\u0020\u043a\u043e\u0442\u043e\u0440\u044b\u0435\u0020\u043f\u043e\u0434\u043d\u0438\u043c\u0430\u043b\u0438\u0441\u044c\u0020\u0028\u043c\u0430\u0440\u043a\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439\u0020\u0441\u043f\u0438\u0441\u043e\u043a\u0029\u002e\n\u0033\u0029\u0020\u0427\u0442\u043e\u0020\u0440\u0435\u0448\u0438\u043b\u0438\u0020\u002f\u0020\u0434\u043e\u0433\u043e\u0432\u043e\u0440\u0438\u043b\u0438\u0441\u044c\u0020\u0028\u043c\u0430\u0440\u043a\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439\u0020\u0441\u043f\u0438\u0441\u043e\u043a\u0029\u002e\n\u0034\u0029\u0020\u041e\u0442\u043a\u0440\u044b\u0442\u044b\u0435\u0020\u0432\u043e\u043f\u0440\u043e\u0441\u044b\u0020\u0438\u0020\u0440\u0438\u0441\u043a\u0438\u0020\u0028\u0435\u0441\u043b\u0438\u0020\u0435\u0441\u0442\u044c\u0029\u002e\n\u0035\u0029\u0020\u041a\u043e\u043d\u043a\u0440\u0435\u0442\u043d\u044b\u0435\u0020\u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0435\u0020\u0448\u0430\u0433\u0438\u0020\u0028\u043a\u0442\u043e\u002f\u0447\u0442\u043e\u002f\u043a\u043e\u0433\u0434\u0430\u002c\u0020\u0435\u0441\u043b\u0438\u0020\u044d\u0442\u043e\u0020\u043c\u043e\u0436\u043d\u043e\u0020\u0432\u044b\u0432\u0435\u0441\u0442\u0438\u0020\u0438\u0437\u0020\u0442\u0435\u043a\u0441\u0442\u0430\u0029\u002e\n\u0036\u0029\u0020\u0412\u0020\u043a\u043e\u043d\u0446\u0435\u0020\u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0438\u0020\u0441\u0432\u043e\u0438\u0020\u0438\u0434\u0435\u0438\u0020\u043f\u043e\u0020\u0443\u043b\u0443\u0447\u0448\u0435\u043d\u0438\u044e\u0020\u043e\u0431\u0441\u0443\u0436\u0434\u0430\u0435\u043c\u043e\u0433\u043e\u0020\u0440\u0435\u0448\u0435\u043d\u0438\u044f\u0020\u0028\u0033\u002d\u0035\u0020\u043f\u0443\u043d\u043a\u0442\u043e\u0432\u0029\u002e\n\n\u041f\u0438\u0448\u0438\u0020\u043a\u0440\u0430\u0442\u043a\u043e\u002c\u0020\u043f\u043e\u0020\u0434\u0435\u043b\u0443\u002c\u0020\u0431\u0435\u0437\u0020\u0432\u043e\u0434\u044b\u002e\u0020\u0415\u0441\u043b\u0438\u0020\u0432\u0020\u0442\u0440\u0430\u043d\u0441\u043a\u0440\u0438\u043f\u0442\u0435\u0020\u043d\u0435\u0020\u0445\u0432\u0430\u0442\u0430\u0435\u0442\u0020\u0434\u0430\u043d\u043d\u044b\u0445\u002c\u0020\u044f\u0432\u043d\u043e\u0020\u0443\u043a\u0430\u0436\u0438\u0020\u044d\u0442\u043e\u002e";

const DEFAULT_LLM_PROMPT =
  "\u0421\u0434\u0435\u043b\u0430\u0439\u0020\u043a\u0440\u0430\u0442\u043a\u0438\u0439\u0020\u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439\u0020\u043f\u0435\u0440\u0435\u0441\u043a\u0430\u0437\u0020\u0432\u0441\u0442\u0440\u0435\u0447\u0438\u0020\u043f\u043e\u0020\u044d\u0442\u043e\u043c\u0443\u0020\u0442\u0440\u0430\u043d\u0441\u043a\u0440\u0438\u043f\u0442\u0443\u002e\n\n\u0422\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u044f\u0020\u043a\u0020\u043e\u0442\u0432\u0435\u0442\u0443\u003a\n\u0031\u0029\u0020\u0422\u0435\u043c\u0430\u0020\u0432\u0441\u0442\u0440\u0435\u0447\u0438\u0020\u0028\u0031\u002d\u0032\u0020\u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f\u0029\u002e\n\u0032\u0029\u0020\u041a\u043b\u044e\u0447\u0435\u0432\u044b\u0435\u0020\u0432\u043e\u043f\u0440\u043e\u0441\u044b\u002c\u0020\u043a\u043e\u0442\u043e\u0440\u044b\u0435\u0020\u043f\u043e\u0434\u043d\u0438\u043c\u0430\u043b\u0438\u0441\u044c\u0020\u0028\u043c\u0430\u0440\u043a\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439\u0020\u0441\u043f\u0438\u0441\u043e\u043a\u0029\u002e\n\u0033\u0029\u0020\u0427\u0442\u043e\u0020\u0440\u0435\u0448\u0438\u043b\u0438\u0020\u002f\u0020\u0434\u043e\u0433\u043e\u0432\u043e\u0440\u0438\u043b\u0438\u0441\u044c\u0020\u0028\u043c\u0430\u0440\u043a\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439\u0020\u0441\u043f\u0438\u0441\u043e\u043a\u0029\u002e\n\u0034\u0029\u0020\u041e\u0442\u043a\u0440\u044b\u0442\u044b\u0435\u0020\u0432\u043e\u043f\u0440\u043e\u0441\u044b\u0020\u0438\u0020\u0440\u0438\u0441\u043a\u0438\u0020\u0028\u0435\u0441\u043b\u0438\u0020\u0435\u0441\u0442\u044c\u0029\u002e\n\u0035\u0029\u0020\u041a\u043e\u043d\u043a\u0440\u0435\u0442\u043d\u044b\u0435\u0020\u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0435\u0020\u0448\u0430\u0433\u0438\u0020\u0028\u043a\u0442\u043e\u002f\u0447\u0442\u043e\u002f\u043a\u043e\u0433\u0434\u0430\u002c\u0020\u0435\u0441\u043b\u0438\u0020\u044d\u0442\u043e\u0020\u043c\u043e\u0436\u043d\u043e\u0020\u0432\u044b\u0432\u0435\u0441\u0442\u0438\u0020\u0438\u0437\u0020\u0442\u0435\u043a\u0441\u0442\u0430\u0029\u002e\n\u0036\u0029\u0020\u0412\u0020\u043a\u043e\u043d\u0446\u0435\u0020\u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0438\u0020\u0441\u0432\u043e\u0438\u0020\u0438\u0434\u0435\u0438\u0020\u043f\u043e\u0020\u0443\u043b\u0443\u0447\u0448\u0435\u043d\u0438\u044e\u0020\u043e\u0431\u0441\u0443\u0436\u0434\u0430\u0435\u043c\u043e\u0433\u043e\u0020\u0440\u0435\u0448\u0435\u043d\u0438\u044f\u0020\u0028\u0033\u002d\u0035\u0020\u043f\u0443\u043d\u043a\u0442\u043e\u0432\u0029\u002e\n\n\u041f\u0438\u0448\u0438\u0020\u043a\u0440\u0430\u0442\u043a\u043e\u002c\u0020\u043f\u043e\u0020\u0434\u0435\u043b\u0443\u002c\u0020\u0431\u0435\u0437\u0020\u0432\u043e\u0434\u044b\u002e\u0020\u0415\u0441\u043b\u0438\u0020\u0432\u0020\u0442\u0440\u0430\u043d\u0441\u043a\u0440\u0438\u043f\u0442\u0435\u0020\u043d\u0435\u0020\u0445\u0432\u0430\u0442\u0430\u0435\u0442\u0020\u0434\u0430\u043d\u043d\u044b\u0445\u002c\u0020\u044f\u0432\u043d\u043e\u0020\u0443\u043a\u0430\u0436\u0438\u0020\u044d\u0442\u043e\u002e\n\n\u0412\u0020\u0441\u0430\u043c\u043e\u043c\u0020\u043d\u0430\u0447\u0430\u043b\u0435\u0020\u0441\u0440\u0430\u0437\u0443\u0020\u043d\u0430\u043f\u0438\u0448\u0438\u0020\u043f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0439\u0020\u0432\u043e\u043f\u0440\u043e\u0441\u0020\u0438\u043b\u0438\u0020\u043f\u043e\u0441\u043b\u0435\u0434\u043d\u0435\u0435\u0020\u043f\u0440\u0438\u043d\u044f\u0442\u043e\u0435\u0020\u0440\u0435\u0448\u0435\u043d\u0438\u0435\u002e\u0020\u041a\u0440\u0430\u0442\u043a\u043e\u002e";
const LEGACY_RU_PROMPT_NO_FINAL_DOT = DEFAULT_LLM_PROMPT.replace(/\.$/, "");
const LLM_HOTKEY_CODES = new Set([
  "KeyZ",
  "KeyX",
  "KeyC",
  "KeyV",
  "KeyB",
  "KeyN",
  "KeyM",
  "Comma",
  "Period",
  "Slash",
]);
const LLM_HOTKEY_HINT_DELAY_MS = 3000;
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
    input: "Ввод",
    llm: "LLM",
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
    llmEndpoint: "LLM REST endpoint",
    llmModel: "LLM model",
    showLlmSettings: "Показать LLM настройки",
    hideLlmSettings: "Скрыть LLM настройки",
    showLlmResponse: "Показать ответ LLM",
    hideLlmResponse: "Скрыть ответ LLM",
    sendSessionToLlm: "Отправить сессию в LLM",
    altHotkeys: "ALT hotkeys",
    llmHotkeyHint:
      "Можно отправлять и горячими клавишами: Alt+Z, Alt+X, Alt+C, Alt+V, Alt+B, Alt+N, Alt+M, Alt+<, Alt+>, Alt+?. Работают левый и правый Alt. Для этого включите ALT hotkeys.",
    promptTemplate: "Шаблон промпта",
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
    llmRequestFailed: "LLM запрос не удался: {error}",
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
    setLlmEndpointFirst: "Сначала укажите LLM endpoint.",
    setLlmModelFirst: "Сначала укажите LLM model.",
    sessionTranscriptEmpty: "Транскрипт сессии пустой.",
    sendingTranscriptToLlm: "Отправляю транскрипт в LLM...",
    transcriptSentToLlm: "Транскрипт отправлен в LLM.",
    emptyResponse: "(пустой ответ)",
    appliedAndFailedDetails: " ({applied} применено, {failed} с ошибкой)",
    appliedElementsDetails: " ({applied} элементов)",
    meetingTranscriptPrefix: "Meeting transcript",
    copiedPromptAndSession: "Промпт + сессия скопированы в буфер обмена.",
    storageUsage: "занято памяти {used}/{total}mb",
    initializationFailed: "Ошибка инициализации: {error}",
  },
  en: {
    ready: "Ready",
    start: "Start",
    stop: "Stop",
    allowMicrophoneAccess: "Allow microphone access",
    sessions: "Sessions",
    input: "Input",
    llm: "LLM",
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
    llmEndpoint: "LLM REST endpoint",
    llmModel: "LLM model",
    showLlmSettings: "Show LLM settings",
    hideLlmSettings: "Hide LLM settings",
    showLlmResponse: "Show LLM response",
    hideLlmResponse: "Hide LLM response",
    sendSessionToLlm: "Send session to LLM",
    altHotkeys: "ALT hotkeys",
    llmHotkeyHint:
      "You can also send using hotkeys: Alt+Z, Alt+X, Alt+C, Alt+V, Alt+B, Alt+N, Alt+M, Alt+<, Alt+>, Alt+?. Both left and right Alt work. Enable ALT hotkeys first.",
    promptTemplate: "Prompt template",
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
    llmRequestFailed: "LLM request failed: {error}",
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
    setLlmEndpointFirst: "Set LLM endpoint first.",
    setLlmModelFirst: "Set LLM model first.",
    sessionTranscriptEmpty: "Session transcript is empty.",
    sendingTranscriptToLlm: "Sending transcript to LLM...",
    transcriptSentToLlm: "Transcript sent to LLM.",
    emptyResponse: "(empty response)",
    appliedAndFailedDetails: " ({applied} applied, {failed} failed)",
    appliedElementsDetails: " ({applied} elements)",
    meetingTranscriptPrefix: "Meeting transcript",
    copiedPromptAndSession: "Prompt and session were copied to clipboard.",
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
let sendingToLlm = false;
let llmHotkeyHintTimer = null;
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
  els.llmTitle.textContent = t("llm");
  els.newSession.textContent = t("newSession");
  els.deleteSession.textContent = t("deleteSession");
  els.langLabel.textContent = t("language");
  els.outputDeviceLabel.textContent = t("outputDevice");
  els.applyOutputDevice.textContent = t("applyToCurrentTab");
  els.refreshDevices.textContent = t("refreshDevices");
  els.llmEndpointLabel.textContent = t("llmEndpoint");
  els.llmModelLabel.textContent = t("llmModel");
  els.promptLabel.textContent = t("promptTemplate");
  els.sendToLlm.textContent = t("sendSessionToLlm");
  els.altHotkeysLabel.textContent = t("altHotkeys");
  els.llmHotkeyHint.textContent = t("llmHotkeyHint");
  els.copy.textContent = t("copy");
  els.exportTxt.textContent = t("exportTxt");
  els.clear.textContent = t("clear");

  const ruOpt = els.lang.querySelector('option[value="ru-RU"]');
  const enOpt = els.lang.querySelector('option[value="en-US"]');
  if (ruOpt) ruOpt.textContent = t("langRu");
  if (enOpt) enOpt.textContent = t("langEn");

  updateSessionsVisibility();
  updateControlsVisibility();
  updateLlmVisibility();
  updateLlmSettingsVisibility();
  updateLlmResponseVisibility();
  renderOutputDevices();
  updateStorageUsage();
}

function clearLlmHotkeyHintTimer() {
  if (llmHotkeyHintTimer === null) return;
  clearTimeout(llmHotkeyHintTimer);
  llmHotkeyHintTimer = null;
}

function hideLlmHotkeyHint() {
  clearLlmHotkeyHintTimer();
  els.llmHotkeyHint.hidden = true;
}

function scheduleLlmHotkeyHint() {
  clearLlmHotkeyHintTimer();
  llmHotkeyHintTimer = setTimeout(() => {
    llmHotkeyHintTimer = null;
    els.llmHotkeyHint.hidden = false;
  }, LLM_HOTKEY_HINT_DELAY_MS);
}

function isSendToLlmHotkey(event) {
  if (!state.altHotkeysEnabled) return false;
  if (!event.altKey || event.metaKey || event.repeat) return false;
  if (event.ctrlKey && !event.getModifierState?.("AltGraph")) return false;
  return LLM_HOTKEY_CODES.has(event.code);
}

function handleSendToLlmHotkey(event) {
  if (!isSendToLlmHotkey(event)) return;
  event.preventDefault();
  event.stopPropagation();
  hideLlmHotkeyHint();
  if (sendingToLlm) return;
  sendSessionToLlm().catch((err) => {
    setStatus("error", t("llmRequestFailed", { error: err?.message || String(err) }));
  });
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
document.addEventListener("keydown", handleSendToLlmHotkey);

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
  navigator.clipboard.writeText(asPromptAndTranscriptText());
  setStatus("active", t("copiedPromptAndSession"));
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
els.toggleLlm.addEventListener("click", () => {
  state.llmVisible = !state.llmVisible;
  persistState();
  updateLlmVisibility();
});
els.outputDevice.addEventListener("change", () => {
  state.outputSinkId = els.outputDevice.value;
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
els.llmEndpoint.addEventListener("change", () => {
  state.llmEndpoint = els.llmEndpoint.value.trim();
  persistState();
});
els.llmModel.addEventListener("change", () => {
  state.llmModel = els.llmModel.value.trim();
  persistState();
});
els.togglePrompt.addEventListener("click", () => {
  state.llmSettingsVisible = !state.llmSettingsVisible;
  persistState();
  updateLlmSettingsVisibility();
});
els.toggleLlmResponse.addEventListener("click", () => {
  state.llmResponseVisible = !state.llmResponseVisible;
  persistState();
  updateLlmResponseVisibility();
});
els.altHotkeysToggle.addEventListener("change", () => {
  state.altHotkeysEnabled = Boolean(els.altHotkeysToggle.checked);
  persistState();
});
els.llmPrompt.addEventListener("change", () => {
  state.llmPrompt = els.llmPrompt.value;
  persistState();
});
els.sendToLlm.addEventListener("mouseenter", () => {
  scheduleLlmHotkeyHint();
});
els.sendToLlm.addEventListener("mouseleave", () => {
  hideLlmHotkeyHint();
});
els.sendToLlm.addEventListener("mousedown", () => {
  hideLlmHotkeyHint();
});
els.sendToLlm.addEventListener("click", () => {
  hideLlmHotkeyHint();
  sendSessionToLlm().catch((err) => {
    setStatus("error", t("llmRequestFailed", { error: err?.message || String(err) }));
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
    state.sessionsVisible = false;
    state.controlsVisible = false;
    state.llmVisible = false;
    state.llmSettingsVisible = false;
    state.llmResponseVisible = false;
    state.layoutVersion = LAYOUT_VERSION;
  } else if (state.layoutVersion < LAYOUT_VERSION) {
    state.layoutVersion = LAYOUT_VERSION;
  }

  state.sessions = Array.isArray(state.sessions) ? state.sessions : [];
  state.uiLang = state.uiLang === "en" ? "en" : "ru";
  state.lang = state.lang === "en-US" ? "en-US" : "ru-RU";
  state.outputSinkId = typeof state.outputSinkId === "string" ? state.outputSinkId : "";
  state.llmEndpoint =
    typeof state.llmEndpoint === "string" && state.llmEndpoint.trim()
      ? state.llmEndpoint.trim()
      : "http://localhost:1234/api/v1/chat";
  state.llmModel = typeof state.llmModel === "string" ? state.llmModel.trim() : "";
  state.llmPrompt =
    typeof state.llmPrompt === "string" && state.llmPrompt.trim()
      ? state.llmPrompt
      : DEFAULT_LLM_PROMPT;
  if (
    state.llmPrompt.trim() === LEGACY_EN_PROMPT.trim() ||
    state.llmPrompt.trim() === LEGACY_RU_PROMPT.trim() ||
    state.llmPrompt.trim() === LEGACY_RU_PROMPT_NO_FINAL_DOT.trim()
  ) {
    state.llmPrompt = DEFAULT_LLM_PROMPT;
  }
  state.sessionsVisible =
    typeof state.sessionsVisible === "boolean" ? state.sessionsVisible : false;
  state.controlsVisible =
    typeof state.controlsVisible === "boolean" ? state.controlsVisible : false;
  state.llmVisible = typeof state.llmVisible === "boolean" ? state.llmVisible : false;
  state.llmSettingsVisible =
    typeof state.llmSettingsVisible === "boolean" ? state.llmSettingsVisible : false;
  state.llmResponseVisible =
    typeof state.llmResponseVisible === "boolean" ? state.llmResponseVisible : false;
  state.altHotkeysEnabled =
    typeof state.altHotkeysEnabled === "boolean" ? state.altHotkeysEnabled : false;
  if (isLikelyMojibake(state.llmPrompt)) {
    state.llmPrompt = DEFAULT_LLM_PROMPT;
  }

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

function isLikelyMojibake(text) {
  if (typeof text !== "string" || !text) return false;
  const markers = ["РЎР", "РџС", "РєР", "С‚С", "СЏ", "Р°", "Рµ"];
  let hitCount = 0;
  for (const marker of markers) {
    if (text.includes(marker)) hitCount += 1;
  }
  return hitCount >= 3;
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
    listening = false;
    starting = false;
    interimText = "";
    renderTranscript();
    syncButtons();
    if (wantListening) {
      restartRecognitionSoon();
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
  const selected = state.outputSinkId || "";
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

  const hasSelected =
    selected === "" || outputDevices.some((device) => device.deviceId === selected);
  els.outputDevice.value = hasSelected ? selected : "";
  if (!hasSelected) {
    state.outputSinkId = "";
    persistState();
  }
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

function restartRecognitionSoon(delayMs = 250) {
  setStatus("loading", t("reconnectingMic"));
  setTimeout(() => {
    if (!wantListening || listening || starting || !recognition) return;
    try {
      starting = true;
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
  els.llmEndpoint.disabled = sendingToLlm;
  els.llmModel.disabled = sendingToLlm;
  els.sendToLlm.disabled = sendingToLlm;
  els.llmPrompt.disabled = sendingToLlm;
  els.togglePrompt.disabled = sendingToLlm;
  els.toggleLlmResponse.disabled = sendingToLlm;
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

function updateLlmVisibility() {
  const visible = Boolean(state.llmVisible);
  els.llmBody.hidden = !visible;
  els.toggleLlm.textContent = visible ? t("hide") : t("show");
}

function updateLlmSettingsVisibility() {
  const visible = Boolean(state.llmSettingsVisible);
  els.endpointWrap.hidden = !visible;
  els.modelWrap.hidden = !visible;
  els.promptWrap.hidden = !visible;
  els.togglePrompt.textContent = visible ? t("hideLlmSettings") : t("showLlmSettings");
}

function updateLlmResponseVisibility() {
  const visible = Boolean(state.llmResponseVisible);
  els.llmResponse.hidden = !visible;
  els.toggleLlmResponse.textContent = visible ? t("hideLlmResponse") : t("showLlmResponse");
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

function asPromptAndTranscriptText() {
  const prompt = (state.llmPrompt || DEFAULT_LLM_PROMPT).trim();
  const transcript = asText().trim();
  if (prompt && transcript) return `${prompt}\n\n${transcript}`;
  return prompt || transcript;
}

async function sendSessionToLlm() {
  const endpoint = (state.llmEndpoint || "").trim();
  if (!endpoint) throw new Error(t("setLlmEndpointFirst"));
  const model = (state.llmModel || "").trim();
  if (!model) throw new Error(t("setLlmModelFirst"));

  const transcript = asText().trim();
  if (!transcript) throw new Error(t("sessionTranscriptEmpty"));
  const prompt = (state.llmPrompt || DEFAULT_LLM_PROMPT).trim();
  const input = `${t("meetingTranscriptPrefix")}:\n${transcript}`;

  const payload = {
    model,
    system_prompt: prompt,
    input,
    store: false,
  };

  sendingToLlm = true;
  syncButtons();
  setStatus("loading", t("sendingTranscriptToLlm"));

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const msg = isJson ? JSON.stringify(body) : String(body);
      throw new Error(`HTTP ${res.status}: ${msg.slice(0, 300)}`);
    }

    const text = isJson ? extractLlmText(body) : String(body);
    els.llmResponse.textContent = text || t("emptyResponse");
    setStatus("active", t("transcriptSentToLlm"));
  } finally {
    sendingToLlm = false;
    syncButtons();
  }
}

function extractLlmText(body) {
  if (typeof body === "string") return body;
  if (!body || typeof body !== "object") return String(body ?? "");

  if (Array.isArray(body.output)) {
    const messages = body.output
      .filter((item) => item && item.type === "message" && typeof item.content === "string")
      .map((item) => item.content.trim())
      .filter(Boolean);
    if (messages.length) return messages.join("\n\n");
  }

  if (typeof body.reply === "string") return body.reply;
  if (typeof body.text === "string") return body.text;
  if (typeof body.response === "string") return body.response;
  if (typeof body.output_text === "string") return body.output_text;
  const chat = body?.choices?.[0]?.message?.content;
  if (typeof chat === "string") return chat;
  return JSON.stringify(body, null, 2);
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
  els.altHotkeysToggle.checked = Boolean(state.altHotkeysEnabled);
  els.llmEndpoint.value = state.llmEndpoint || "";
  els.llmModel.value = state.llmModel || "";
  els.llmPrompt.value = state.llmPrompt || DEFAULT_LLM_PROMPT;
  els.llmResponse.textContent = "";
  hideLlmHotkeyHint();
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

