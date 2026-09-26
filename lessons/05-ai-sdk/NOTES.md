# Урок 5. Чат на Vercel AI SDK (конспект)

Цель: заменить ручную работу со стримом на библиотеку и понять, что она берёт на себя.

- **`streamText`** заменяет ~20 строк из урока 4: fetch в модель, getReader, буфер, разбор JSON-строк.
- **`createOpenAICompatible`**: Ollama отвечает как OpenAI (адрес `/v1`). Чтобы сменить модель или провайдера, меняешь только строку `model`.
- **system-сообщения** передаются отдельно в `instructions`, а не внутри `messages` (иначе ошибка `InvalidPromptError`).
- **Отправка в браузер**: `pipeTextStreamToResponse({ response, stream: toTextStream({ stream: result.stream }) })`. `result.stream` — все события модели, `toTextStream` оставляет только текст.
- **Кнопка «Стоп» на сервере**: `res.on("close", () => controller.abort())` + `abortSignal` в `streamText`.
- **Токены**: `onEnd: ({ usage }) => ...`, а при стриминге нужен `includeUsage: true` в провайдере, иначе `undefined`.
- **Вход растёт с каждым сообщением**: вся история (и прошлые ответы модели) каждый раз уходит заново. Прошлый ответ оплачивается дважды: сначала как выход, потом как вход.
- **Даже «Привет» ≈ 28 токенов**: system-промпт и служебная разметка чата (`<|im_start|>...`) тоже считаются.
- **SDK быстро меняется**: `onFinish` → `onEnd`, `result.pipeTextStreamToResponse` устарел. Сверяться с установленной версией, а не со старыми примерами.
