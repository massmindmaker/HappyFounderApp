import { OpenAIService } from "./openai-service"
import { VectorService } from "./vector-service"
import { createClient } from "@supabase/supabase-js"

// Инициализация клиента Supabase с проверкой наличия необходимых параметров
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
let supabase: ReturnType<typeof createClient> | null = null

// Инициализируем клиент только если есть URL и ключ
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log("Supabase client initialized successfully")
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
    supabase = null
  }
} else {
  console.warn("Supabase URL or Anon Key is missing, using localStorage only")
}

// Функция для проверки доступности Supabase
const isSupabaseAvailable = async (): Promise<boolean> => {
  if (!supabase) return false

  try {
    // Простой запрос для проверки соединения
    const { error } = await supabase.from("projects").select("id").limit(1)
    return !error
  } catch (e) {
    console.error("Supabase connection test failed:", e)
    return false
  }
}

export interface Project {
  id: number
  user_id?: string

  // Basic Info
  title: string
  description: string
  business_idea: string
  industry?: string
  target_audience?: string
  stage?: "idea" | "mvp" | "growth" | "scaling"
  status: "draft" | "active" | "funded" | "completed" | "cancelled"

  // AI Analysis Results
  ai_analysis?: any
  market_research?: any
  financial_projections?: any
  competitive_analysis?: any
  tokenomics?: any
  pitch_deck_data?: any
  mvp_plan?: any

  // Investment Data
  investment_enabled?: boolean
  funding_goal_ton?: number
  funding_raised_ton?: number
  token_symbol?: string
  token_price_ton?: number
  nft_collection_id?: string

  // Metadata
  view_count?: number
  like_count?: number
  investment_count?: number
  ai_score?: number
  tags?: string[]

  // File URLs
  pitch_deck_url?: string
  demo_url?: string
  website_url?: string

  created_at: string
  updated_at?: string
}

export const ProjectService = {
  // Получить все проекты
  async getProjects(): Promise<Project[]> {
    try {
      // Проверяем доступность Supabase
      const supabaseAvailable = await isSupabaseAvailable().catch(() => false)

      if (supabaseAvailable && supabase) {
        try {
          console.log("Attempting to get projects from Supabase...")
          const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

          if (error) {
            console.error("Supabase select error:", error)
            throw error
          }

          if (data && data.length > 0) {
            console.log(`Retrieved ${data.length} projects from Supabase`)
            // Синхронизируем с localStorage для резервного копирования
            localStorage.setItem("projects", JSON.stringify(data))
            return data as Project[]
          }
        } catch (supabaseError) {
          console.error("Failed to get projects from Supabase, falling back to localStorage:", supabaseError)
          // Продолжаем выполнение и получаем из localStorage
        }
      } else {
        console.log("Supabase unavailable, using localStorage only")
      }

      // Получаем из localStorage
      console.log("Getting projects from localStorage")
      return JSON.parse(localStorage.getItem("projects") || "[]")
    } catch (error) {
      console.error("Error getting projects:", error)
      // В случае любой ошибки, используем localStorage
      return JSON.parse(localStorage.getItem("projects") || "[]")
    }
  },

  // Получить проект по ID
  async getProject(id: number): Promise<Project | null> {
    try {
      // Проверяем доступность Supabase
      const supabaseAvailable = await isSupabaseAvailable().catch(() => false)

      if (supabaseAvailable && supabase) {
        try {
          console.log(`Attempting to get project ${id} from Supabase...`)
          const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

          if (error && error.code !== "PGRST116") {
            // PGRST116 - запись не найдена
            console.error("Supabase select error:", error)
            throw error
          }

          if (data) {
            console.log(`Retrieved project ${id} from Supabase`)
            return data as Project
          }
        } catch (supabaseError) {
          console.error("Failed to get project from Supabase, falling back to localStorage:", supabaseError)
          // Продолжаем выполнение и получаем из localStorage
        }
      } else {
        console.log("Supabase unavailable, using localStorage only")
      }

      // Получаем из localStorage
      console.log(`Getting project ${id} from localStorage`)
      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      return projects.find((p: Project) => p.id === id) || null
    } catch (error) {
      console.error("Error getting project:", error)
      // В случае любой ошибки, используем localStorage
      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      return projects.find((p: Project) => p.id === id) || null
    }
  },

  // Сохранить проект
  async saveProject(projectData: Partial<Project>): Promise<Project> {
    try {
      const now = new Date().toISOString()
      const newProject: Project = {
        id: Date.now(),
        title: projectData.title || "",
        description: projectData.description || "",
        business_idea: projectData.business_idea || "",
        industry: projectData.industry || "",
        target_audience: projectData.target_audience || "",
        stage: projectData.stage || "idea",
        status: "draft",
        created_at: now,
        updated_at: now,
        view_count: 0,
        like_count: 0,
        investment_count: 0,
        tags: [],
        ...projectData,
      }

      // Проверяем доступность Supabase перед попыткой сохранения
      const supabaseAvailable = await isSupabaseAvailable().catch(() => false)

      if (supabaseAvailable && supabase) {
        try {
          console.log("Attempting to save project to Supabase...")
          const { data, error } = await supabase.from("projects").insert(newProject).select().single()

          if (error) {
            console.error("Supabase insert error:", error)
            throw error
          }

          if (data) {
            console.log("Project saved to Supabase successfully")
            // Также сохраняем в localStorage для резервного копирования
            const projects = JSON.parse(localStorage.getItem("projects") || "[]")
            projects.push(data)
            localStorage.setItem("projects", JSON.stringify(projects))
            return data as Project
          }
        } catch (supabaseError) {
          console.error("Failed to save to Supabase, falling back to localStorage:", supabaseError)
          // Продолжаем выполнение и сохраняем в localStorage
        }
      } else {
        console.log("Supabase unavailable, using localStorage only")
      }

      // Сохраняем в localStorage
      console.log("Saving project to localStorage")
      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      projects.push(newProject)
      localStorage.setItem("projects", JSON.stringify(projects))

      return newProject
    } catch (error) {
      console.error("Error saving project:", error)
      // В случае любой ошибки, используем localStorage как последнее средство
      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      const newProject: Project = {
        id: Date.now(),
        title: projectData.title || "",
        description: projectData.description || "",
        business_idea: projectData.business_idea || "",
        industry: projectData.industry || "",
        target_audience: projectData.target_audience || "",
        stage: projectData.stage || "idea",
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        view_count: 0,
        like_count: 0,
        investment_count: 0,
        tags: [],
        ...projectData,
      }
      projects.push(newProject)
      localStorage.setItem("projects", JSON.stringify(projects))

      return newProject
    }
  },

  // Обновить проект
  async updateProject(project: Project): Promise<Project> {
    try {
      project.updated_at = new Date().toISOString()

      // Проверяем доступность Supabase перед попыткой обновления
      const supabaseAvailable = await isSupabaseAvailable().catch(() => false)

      if (supabaseAvailable && supabase) {
        try {
          console.log("Attempting to update project in Supabase...")
          const { data, error } = await supabase.from("projects").update(project).eq("id", project.id).select().single()

          if (error) {
            console.error("Supabase update error:", error)
            throw error
          }

          if (data) {
            console.log("Project updated in Supabase successfully")
            // Также обновляем в localStorage для резервного копирования
            const projects = JSON.parse(localStorage.getItem("projects") || "[]")
            const index = projects.findIndex((p: Project) => p.id === project.id)
            if (index !== -1) {
              projects[index] = data
              localStorage.setItem("projects", JSON.stringify(projects))
            }
            return data as Project
          }
        } catch (supabaseError) {
          console.error("Failed to update in Supabase, falling back to localStorage:", supabaseError)
          // Продолжаем выполнение и обновляем в localStorage
        }
      } else {
        console.log("Supabase unavailable, using localStorage only")
      }

      // Обновляем в localStorage
      console.log("Updating project in localStorage")
      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      const index = projects.findIndex((p: Project) => p.id === project.id)

      if (index === -1) {
        // Если проект не найден, добавляем его
        projects.push(project)
      } else {
        projects[index] = project
      }

      localStorage.setItem("projects", JSON.stringify(projects))
      return project
    } catch (error) {
      console.error("Error updating project:", error)
      // В случае любой ошибки, используем localStorage как последнее средство
      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      const index = projects.findIndex((p: Project) => p.id === project.id)

      if (index === -1) {
        // Если проект не найден, добавляем его
        projects.push(project)
      } else {
        projects[index] = project
      }

      localStorage.setItem("projects", JSON.stringify(projects))
      return project
    }
  },

  // Удалить проект
  async deleteProject(id: number): Promise<boolean> {
    try {
      // Проверяем, есть ли доступ к Supabase
      if (supabase) {
        // Пытаемся удалить проект из Supabase
        const { error } = await supabase.from("projects").delete().eq("id", id)

        if (error) throw error
      }

      // В любом случае удаляем проект из localStorage
      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      const filteredProjects = projects.filter((p: Project) => p.id !== id)
      localStorage.setItem("projects", JSON.stringify(filteredProjects))

      return true
    } catch (error) {
      console.error("Error deleting project:", error)
      // В случае ошибки, используем localStorage
      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      const filteredProjects = projects.filter((p: Project) => p.id !== id)
      localStorage.setItem("projects", JSON.stringify(filteredProjects))

      return true
    }
  },

  // Анализировать проект с помощью AI
  async analyzeProject(projectId: number): Promise<Project> {
    try {
      const project = await this.getProject(projectId)
      if (!project) {
        throw new Error("Project not found")
      }

      // Используем OpenAI для анализа проекта
      const [
        ai_analysis,
        market_research,
        financial_projections,
        competitive_analysis,
        tokenomics,
        pitch_deck_data,
        mvp_plan,
        ai_score,
      ] = await Promise.all([
        OpenAIService.analyzeBusinessIdea(project),
        OpenAIService.generateMarketResearch(project),
        OpenAIService.generateFinancialProjections(project),
        OpenAIService.generateCompetitiveAnalysis(project),
        OpenAIService.generateTokenomics(project),
        OpenAIService.generatePitchDeckData(project),
        project.stage === "idea" ? OpenAIService.generateMVPPlan(project) : Promise.resolve(undefined),
        OpenAIService.generateAIScore(project),
      ])

      // Обновляем проект с результатами анализа
      const updatedProject: Project = {
        ...project,
        status: "active",
        ai_analysis,
        market_research,
        financial_projections,
        competitive_analysis,
        tokenomics,
        pitch_deck_data,
        mvp_plan,
        ai_score,
        updated_at: new Date().toISOString(),
      }

      // Сохраняем обновленный проект
      await this.updateProject(updatedProject)

      // Индексируем проект для векторного поиска
      try {
        await VectorService.indexProject(updatedProject)
      } catch (error) {
        console.error("Error indexing project:", error)
        // Продолжаем выполнение даже если индексация не удалась
      }

      return updatedProject
    } catch (error) {
      console.error("Error analyzing project:", error)
      throw new Error("Failed to analyze project")
    }
  },

  // Миграция данных из localStorage в Supabase
  async migrateLocalStorageToSupabase(): Promise<boolean> {
    try {
      // Проверяем, есть ли доступ к Supabase
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      // Получаем проекты из localStorage
      const localProjects = JSON.parse(localStorage.getItem("projects") || "[]")
      if (localProjects.length === 0) {
        return true // Нет проектов для миграции
      }

      // Для каждого проекта в localStorage
      for (const project of localProjects) {
        // Проверяем, существует ли проект в Supabase
        const { data, error } = await supabase.from("projects").select("id").eq("id", project.id).single()

        if (error && error.code !== "PGRST116") {
          // PGRST116 - запись не найдена
          console.error("Error checking project existence:", error)
          continue
        }

        // Если проект не существует в Supabase, добавляем его
        if (!data) {
          const { error: insertError } = await supabase.from("projects").insert(project)

          if (insertError) {
            console.error("Error inserting project:", insertError)
            continue
          }

          // Индексируем проект для векторного поиска
          try {
            await VectorService.indexProject(project)
          } catch (error) {
            console.error("Error indexing project:", error)
            // Продолжаем выполнение даже если индексация не удалась
          }
        }
      }

      return true
    } catch (error) {
      console.error("Error migrating localStorage to Supabase:", error)
      return false
    }
  },

  // Поиск проектов
  async searchProjects(query: string): Promise<Project[]> {
    try {
      // Проверяем, есть ли доступ к Supabase
      if (supabase) {
        // Пытаемся найти проекты в Supabase по текстовому запросу
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .or(`title.ilike.%${query}%,description.ilike.%${query}%,business_idea.ilike.%${query}%`)
          .order("created_at", { ascending: false })

        if (error) throw error

        // Если есть данные в Supabase, возвращаем их
        if (data && data.length > 0) {
          return data as Project[]
        }

        // Если нет результатов по текстовому поиску, пробуем векторный поиск
        try {
          const similarProjects = await VectorService.searchSimilarProjects(query)
          if (similarProjects.length > 0) {
            // Получаем полные данные проектов
            const projectIds = similarProjects.map((p) => p.id)
            const { data: projectsData, error: projectsError } = await supabase
              .from("projects")
              .select("*")
              .in("id", projectIds)

            if (projectsError) throw projectsError
            if (projectsData && projectsData.length > 0) {
              return projectsData as Project[]
            }
          }
        } catch (vectorError) {
          console.error("Error in vector search:", vectorError)
          // Продолжаем выполнение даже если векторный поиск не удался
        }
      }

      // Если нет доступа к Supabase или данных в Supabase, используем localStorage
      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      return projects.filter(
        (p: Project) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          (p.business_idea && p.business_idea.toLowerCase().includes(query.toLowerCase())),
      )
    } catch (error) {
      console.error("Error searching projects:", error)
      // В случае ошибки, используем localStorage
      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      return projects.filter(
        (p: Project) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          (p.business_idea && p.business_idea.toLowerCase().includes(query.toLowerCase())),
      )
    }
  },
}
