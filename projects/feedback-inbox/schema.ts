import { z } from "zod"

// Одна схема на весь проект: сервер отдаёт её модели, браузер проверяет ею ответ сервера
export const Review = z.object({
  category: z.enum(["bug", "feature", "praise", "question", "other"]),
  sentiment: z.enum(["positive", "neutral", "negative"]),
  urgent: z.boolean().describe("true, если пользователь не может пользоваться продуктом"),
  summary: z.string().describe("Суть отзыва, не больше 8 слов, по-русски"),
})
export type Review = z.infer<typeof Review>
