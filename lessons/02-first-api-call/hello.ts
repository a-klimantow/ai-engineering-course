// Урок 2: первый вызов локальной модели через Ollama
const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:7b";

type Message = { role: "system" | "user" | "assistant"; content: string };

async function chat(messages: Message[]): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    body: JSON.stringify({ model: MODEL, stream: false, messages }),
  });
  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = await res.json();
  return data.message.content;
}

const answer = await chat([{ role: "user", content: "Привет! Кто ты?" }]);
console.log(answer);
