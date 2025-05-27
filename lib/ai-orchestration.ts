import { type Project, ProjectService } from "./project-service"

export interface AIOrchestrationResult {
  success: boolean
  projectId: number
  message: string
  project?: Project
}

export const AIOrchestration = {
  async analyzeBusinessIdea(businessIdea: string, userId?: string): Promise<AIOrchestrationResult> {
    try {
      // Создаем новый проект
      const newProject = await ProjectService.saveProject({
        title: extractTitle(businessIdea),
        description: businessIdea.substring(0, 200),
        business_idea: businessIdea,
        user_id: userId,
        status: "draft",
      })

      // Запускаем анализ проекта
      const analyzedProject = await ProjectService.analyzeProject(newProject.id)

      return {
        success: true,
        projectId: analyzedProject.id,
        message: "Анализ бизнес-идеи успешно завершен",
        project: analyzedProject,
      }
    } catch (error) {
      console.error("AI Orchestration Error:", error)
      return {
        success: false,
        projectId: -1,
        message: "Не удалось проанализировать бизнес-идею",
      }
    }
  },
}

// Вспомогательная функция для извлечения заголовка из бизнес-идеи
function extractTitle(businessIdea: string): string {
  // Берем первые несколько слов или первое предложение
  const firstSentence = businessIdea.split(/[.!?]/, 1)[0].trim()
  if (firstSentence.length <= 50) {
    return firstSentence
  }

  // Если первое предложение слишком длинное, берем первые несколько слов
  const words = firstSentence.split(/\s+/)
  return words.slice(0, 5).join(" ") + (words.length > 5 ? "..." : "")
}
