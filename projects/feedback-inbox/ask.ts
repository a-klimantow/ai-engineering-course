// Вопрос к отзывам. Модель сама решает, вызвать ли инструмент поиска
import { generateText, tool, isStepCount } from "ai"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"
import { z } from "zod"
import { Review } from "./schema.ts"
import { STORED_REVIEWS } from "./data.ts"

const ollama = createOpenAICompatible({
  name: "ollama",
  baseURL: "http://localhost:11434/v1",
})

const searchReviews = tool({
  description:
    "Ищет отзывы пользователей в базе по категории: bug — ошибки, feature — просьбы о новых функциях, praise — похвала, question — вопросы пользователей, other — остальное",
  inputSchema: z.object({ category: Review.shape.category }), // те же пять категорий, что в схеме Review
  execute: async ({ category }) => {
    console.log(`🔧 модель вызвала searchReviews("${category}")`)
    return STORED_REVIEWS.filter((i) => i.category === category)
  },
})

const { text, steps } = await generateText({
  model: ollama("qwen2.5:3b"),
  instructions: "Ты помощник службы поддержки. Отвечай по-русски, коротко.",
  prompt: "Какие баги нам прислали пользователи?",
  temperature: 0,
  tools: { searchReviews },
  stopWhen: isStepCount(3),
})

console.log(`Шагов: ${steps.length}`)
console.log(text)
