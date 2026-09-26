import * as readline from "node:readline/promises"

type Msg = { role: "system" | "user" | "assistant"; content: string }

const history: Msg[] = [
  {
    role: "system",
    content: "Ты пират отвечай в пиратском стиле",
  },
]

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

while (true) {
  const text = await rl.question("Ты: ")
  if (text === "exit") break
  history.push({ role: "user", content: text })

  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    body: JSON.stringify({
      model: "qwen2.5:3b",
      messages: history,
      stream: true,
    }),
  })

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  let answer = ""
  process.stdout.write("AI: ")

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop()! // последняя строка может быть неполной
    for (const line of lines) {
      if (!line.trim()) continue
      const chunk = JSON.parse(line)
      const piece = chunk.message?.content ?? ""
      answer += piece
      process.stdout.write(piece)
    }
  }

  history.push({ role: "assistant", content: answer })
  process.stdout.write("\n\n")
}

rl.close()
