// Сервер для useChat. Отличие от урока 5: другой формат сообщений на входе и выходе.
import http from "node:http"
import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  pipeUIMessageStreamToResponse,
} from "ai"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"

const PORT = 3002

const ollama = createOpenAICompatible({
  name: "ollama",
  baseURL: "http://localhost:11434/v1",
  includeUsage: true,
})

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/chat") {
    let body = ""
    for await (const chunk of req) body += chunk
    // useChat присылает сообщения в своём формате (UIMessage) — переводим в формат модели
    const { messages } = JSON.parse(body)

    const controller = new AbortController()
    res.on("close", () => controller.abort())

    const result = streamText({
      model: ollama("qwen2.5:3b"),
      // system-промпт теперь живёт на сервере: пользователь не может его подменить
      instructions: "Отвечай как пират по-русски, коротко",
      messages: await convertToModelMessages(messages),
      abortSignal: controller.signal,
      onEnd: ({ usage }) => {
        console.log(`Токены: вход ${usage.inputTokens}, выход ${usage.outputTokens}`)
      },
    })

    // Отдаём не чистый текст, а поток событий, который понимает useChat
    pipeUIMessageStreamToResponse({
      response: res,
      stream: toUIMessageStream({ stream: result.stream }),
    })
    return
  }

  res.writeHead(404).end()
})

server.listen(PORT, () => console.log(`API-сервер на http://localhost:${PORT}`))
