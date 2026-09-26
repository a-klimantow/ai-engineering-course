// Маленький помощник, чтобы не повторять fetch в каждом эксперименте
export type Msg = { role: "system" | "user" | "assistant"; content: string }

export async function ask(
  messages: Msg[],
  { model = "qwen2.5:3b", temperature = 0 } = {},
): Promise<string> {
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: { temperature },
    }),
  })
  const data = await res.json()
  return data.message.content
}
