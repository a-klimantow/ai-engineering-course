const res = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  body: JSON.stringify({
    model: "qwen2.5:3b",
    stream: false,
    system: "Отвечай по-русски, коротко.",
    prompt: "Объясни, что такое React, в двух предложениях.",
  }),
})

const data = await res.json()
console.log(data.response)
