import type { Review } from "./schema.ts"

// Уже размеченные отзывы — как будто они лежат в базе после урока 8
export type StoredReview = { id: number; text: string } & Pick<Review, "category" | "urgent">

export const STORED_REVIEWS: StoredReview[] = [
  { id: 1, text: "Кнопка «Оплатить» не реагирует на айфоне", category: "bug", urgent: true },
  { id: 2, text: "Было бы круто добавить тёмную тему", category: "feature", urgent: false },
  { id: 3, text: "Лучшее приложение, пользуюсь каждый день!", category: "praise", urgent: false },
  { id: 4, text: "А можно ли экспортировать данные в CSV?", category: "question", urgent: false },
  { id: 5, text: "Обожаю вас, но после обновления всё тормозит", category: "bug", urgent: false },
  { id: 6, text: "Не приходит письмо для сброса пароля, не могу войти", category: "bug", urgent: true },
  { id: 7, text: "Добавьте, пожалуйста, вход через Google", category: "feature", urgent: false },
  { id: 8, text: "Как поменять почту в профиле?", category: "question", urgent: false },
]
