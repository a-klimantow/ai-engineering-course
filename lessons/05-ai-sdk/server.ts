// Тот же сервер из урока 4, но на Vercel AI SDK.
// Ollama умеет притворяться OpenAI (адрес /v1), поэтому подключаем её как «OpenAI-совместимую».
import http from "node:http"
import { readFile } from "node:fs/promises"
import { streamText, toTextStream, pipeTextStreamToResponse } from "ai"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"

const PORT = 3001

const ollama = createOpenAICompatible({
  name: "ollama",
  baseURL: "http://localhost:11434/v1",
  includeUsage: true,
})

const server = http.createServer(async (req, res) => {
  // 1. Отдаём ту же страницу из урока 4
  if (req.method === "GET" && req.url === "/") {
    const html = await readFile(
      new URL("../04-chat-ui/index.html", import.meta.url),
    )
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
    res.end(html)
    return
  }

  // 2. Весь ручной разбор стрима заменяется на streamText
  if (req.method === "POST" && req.url === "/api/chat") {
    let body = ""
    for await (const chunk of req) body += chunk
    const { messages } = JSON.parse(body)

    // AI SDK не принимает system внутри messages: его передают отдельно в instructions
    type Msg = { role: string; content: string }
    const system = messages.filter((m: Msg) => m.role === "system")
    const dialog = messages.filter((m: Msg) => m.role !== "system")

    // Браузер нажал «Стоп» и отключился → отменяем и генерацию
    const controller = new AbortController()
    res.on("close", () => controller.abort())

    const result = streamText({
      model: ollama("qwen2.5:3b"),
      instructions: system,
      messages: dialog,
      abortSignal: controller.signal,
      onEnd: ({ usage }) => {
        console.log(
          `Токены: вход ${usage.inputTokens}, выход ${usage.outputTokens}`,
        )
      },
    })
    // result.stream — все события модели; toTextStream оставляет только текст
    pipeTextStreamToResponse({
      response: res,
      stream: toTextStream({ stream: result.stream }),
    })
    return
  }

  res.writeHead(404).end()
})

server.listen(PORT, () => console.log(`Открой http://localhost:${PORT}`))
