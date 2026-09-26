// Сервер-посредник: браузер → наш сервер → Ollama.
// Браузер не ходит в модель напрямую: в реальном проекте здесь хранится API-ключ (урок 1).
import http from "node:http"
import { readFile } from "node:fs/promises"

const PORT = 3000

const server = http.createServer(async (req, res) => {
  // 1. Отдаём страницу
  if (req.method === "GET" && req.url === "/") {
    const html = await readFile(new URL("./index.html", import.meta.url))
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
    res.end(html)
    return
  }

  // 2. Принимаем историю сообщений и стримим ответ модели
  if (req.method === "POST" && req.url === "/api/chat") {
    let body = ""
    for await (const chunk of req) body += chunk
    const { messages } = JSON.parse(body)

    const ollama = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      body: JSON.stringify({ model: "qwen2.5:3b", messages, stream: true }),
    })

    // Ollama шлёт строки JSON (как в chat.ts), а браузеру отдаём уже чистый текст
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" })
    const reader = ollama.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ""
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop()!
      for (const line of lines) {
        if (!line.trim()) continue
        res.write(JSON.parse(line).message?.content ?? "")
      }
    }
    res.end()
    return
  }

  res.writeHead(404).end()
})

server.listen(PORT, () => console.log(`Открой http://localhost:${PORT}`))
