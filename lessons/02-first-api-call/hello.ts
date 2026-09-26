const res = await fetch("http://localhost:11434/api/chat", {
  method: "POST",
  body: JSON.stringify({
    model: "qwen2.5:3b",
    stream: false,
    options: { temperature: 0.7 },
    messages: [
      {
        role: "system",
        content: "Ты дружелюбный помощник. Отвечай по-русски, коротко.",
      },
      {
        role: "user",
        content: "Объясни, что такое React, в двух предложениях.",
      },
    ],
  }),
})

const data = await res.json()
console.log(data.message.content)
