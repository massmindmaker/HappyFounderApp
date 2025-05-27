import { createClient } from "@supabase/supabase-js"
import { OpenAIService } from "./openai-service"
import type { Project } from "./project-service"

// Инициализация клиента Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const VectorService = {
  // Сохранение эмбеддинга для проекта
  async saveEmbedding(projectId: string, contentType: string, content: string): Promise<void> {
    try {
      // Генерация эмбеддинга с помощью OpenAI
      const embedding = await OpenAIService.generateEmbedding(content)

      // Сохранение эмбеддинга в Supabase
      const { error } = await supabase.from("project_embeddings").insert({
        project_id: projectId,
        content_type: contentType,
        content: content,
        embedding: embedding,
      })

      if (error) throw error
    } catch (error) {
      console.error("Error saving embedding:", error)
      throw new Error("Failed to save embedding")
    }
  },

  // Поиск похожих проектов
  async searchSimilarProjects(query: string, limit = 5): Promise<any[]> {
    try {
      // Генерация эмбеддинга для запроса
      const embedding = await OpenAIService.generateEmbedding(query)

      // Поиск похожих проектов в Supabase
      const { data, error } = await supabase.rpc("match_documents", {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: limit,
      })

      if (error) throw error

      return data || []
    } catch (error) {
      console.error("Error searching similar projects:", error)
      return []
    }
  },

  // Индексация проекта для векторного поиска
  async indexProject(project: Project): Promise<void> {
    try {
      // Создаем эмбеддинги для различных частей проекта
      await this.saveEmbedding(project.id.toString(), "description", `${project.title} - ${project.description}`)

      if (project.business_idea) {
        await this.saveEmbedding(project.id.toString(), "business_idea", project.business_idea)
      }

      if (project.ai_analysis?.summary) {
        await this.saveEmbedding(project.id.toString(), "ai_analysis", project.ai_analysis.summary)
      }

      // Можно добавить индексацию других частей проекта по мере необходимости
    } catch (error) {
      console.error("Error indexing project:", error)
      throw new Error("Failed to index project")
    }
  },
}
