import { useState } from "react"
import { useChat } from "@ai-sdk/react"

export function App() {
  // useChat хранит историю, шлёт запросы на /api/chat и читает стрим
  const { messages, sendMessage, status, stop } = useChat()
  const [input, setInput] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage({ text: input })
    setInput("")
  }

  return (
    <>
      <h1>Мой чат на React</h1>

      <div className="messages">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`msg ${m.role}`}
          >
            {/* Сообщение состоит из частей (parts): текст, картинки, вызовы инструментов... */}
            {m.parts.map((part, i) =>
              part.type === "text" ? <span key={i}>{part.text}</span> : null,
            )}
          </div>
        ))}
      </div>
      {status === "submitted" ? <p>Думаю...</p> : null}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Напиши сообщение..."
          autoComplete="off"
        />
        <button>Отправить</button>
        {status === "streaming" || status === "submitted" ? (
          <button type="button" onClick={stop}>Стоп</button>
        ) : null}
      </form>
    </>
  )
}
