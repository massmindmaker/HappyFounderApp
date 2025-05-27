import type React from "react"
// Сервис для работы с изображениями
export const ImageService = {
  // Получение URL для placeholder изображения
  getPlaceholderUrl(width: number, height: number, text?: string): string {
    // Используем сервис, который точно работает в Telegram Mini App
    const baseUrl = "https://placehold.co"
    const textParam = text ? `&text=${encodeURIComponent(text)}` : ""
    return `${baseUrl}/${width}x${height}?text=${encodeURIComponent(text || "")}`
  },

  // Получение URL для превью проекта
  getProjectPreviewUrl(projectId: number, title: string): string {
    // Используем сервис, который генерирует изображения по тексту
    return this.getPlaceholderUrl(320, 180, title)
  },

  // Получение URL для превью Pitch Deck
  getPitchDeckPreviewUrl(projectId: number): string {
    return this.getPlaceholderUrl(320, 180, "Pitch Deck Preview")
  },

  // Получение URL для превью NFT
  getNFTPreviewUrl(nftId: number): string {
    return this.getPlaceholderUrl(320, 320, "NFT Preview")
  },

  // Обработчик ошибок загрузки изображений
  handleImageError(event: React.SyntheticEvent<HTMLImageElement>): void {
    const target = event.target as HTMLImageElement
    // Устанавливаем запасное изображение при ошибке загрузки
    target.src = this.getPlaceholderUrl(target.width || 100, target.height || 100, "Image Error")
  },
}
