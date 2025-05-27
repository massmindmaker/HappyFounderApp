import OpenAI from "openai"
import type { Project } from "./project-service"

// Проверяем наличие API ключа и создаем клиент OpenAI только если он есть
const apiKey = process.env.OPENAI_API_KEY || ""
let openai: OpenAI | null = null

// Флаг для определения, доступен ли OpenAI API
const isOpenAIAvailable = !!apiKey

try {
  if (isOpenAIAvailable) {
    openai = new OpenAI({ apiKey })
    console.log("OpenAI client initialized successfully")
  } else {
    console.warn("OPENAI_API_KEY is missing or empty. Using mock data for OpenAI services.")
  }
} catch (error) {
  console.error("Failed to initialize OpenAI client:", error)
}

// Добавим функцию для генерации мок-данных
function generateMockData(type: string) {
  switch (type) {
    case "analysis":
      return {
        summary: "Это демо-анализ проекта. Для получения реального анализа необходим API ключ OpenAI.",
        strengths: ["Инновационная идея", "Потенциально большой рынок", "Низкие барьеры входа"],
        weaknesses: ["Требуется значительное финансирование", "Высокая конкуренция"],
        opportunities: ["Расширение на международные рынки", "Партнерство с крупными компаниями"],
        threats: ["Изменение регуляторной среды", "Появление новых конкурентов"],
      }
    case "market":
      return {
        marketSize: {
          global: { value: 100, unit: "млрд $" },
          target: { value: 10, unit: "млрд $" },
          cagr: 15,
        },
        targetAudience: {
          demographics: "Мужчины и женщины 25-45 лет с высоким доходом",
          psychographics: "Технологически подкованные, ценят удобство и инновации",
          behaviors: "Активные пользователи мобильных приложений и онлайн-сервисов",
        },
        trends: ["Рост мобильных платежей", "Увеличение спроса на персонализацию", "Фокус на безопасность данных"],
      }
    case "financial":
      return {
        revenue: [100000, 500000, 2000000, 5000000, 10000000],
        expenses: [200000, 400000, 1000000, 2000000, 4000000],
        profit: [-100000, 100000, 1000000, 3000000, 6000000],
        breakEvenPoint: { months: 18, revenue: 600000 },
        initialInvestment: 300000,
        roi: { year1: -0.3, year3: 2.5, year5: 10 },
      }
    case "competitive":
      return {
        competitors: [
          {
            name: "Конкурент A",
            marketShare: 30,
            strengths: ["Сильный бренд", "Большая клиентская база"],
            weaknesses: ["Устаревшие технологии", "Высокие цены"],
          },
          {
            name: "Конкурент B",
            marketShare: 25,
            strengths: ["Инновационные решения", "Низкие цены"],
            weaknesses: ["Ограниченное географическое присутствие", "Слабый маркетинг"],
          },
          {
            name: "Конкурент C",
            marketShare: 15,
            strengths: ["Качественный сервис", "Лояльные клиенты"],
            weaknesses: ["Ограниченный ассортимент", "Медленный рост"],
          },
        ],
        projectAdvantages: [
          "Уникальная технология",
          "Лучшее соотношение цена/качество",
          "Инновационный подход",
          "Сильная команда",
        ],
        marketSharePotential: 20,
        entryBarriers: ["Высокие затраты на разработку", "Патенты конкурентов", "Регуляторные требования"],
      }
    case "tokenomics":
      return {
        tokenBasics: {
          name: "Demo Token",
          symbol: "DEMO",
          totalSupply: 100000000,
          decimals: 18,
          initialPrice: "0.05",
        },
        distribution: {
          publicSale: {
            percentage: 40,
            amount: 40000000,
            priceTiers: [
              { tier: "Early", percentage: 10, price: "0.03", bonus: "30%" },
              { tier: "Main", percentage: 30, price: "0.05", bonus: "10%" },
            ],
          },
          team: {
            percentage: 20,
            amount: 20000000,
            vesting: "2 года с 6-месячным клиффом",
          },
          development: {
            percentage: 15,
            amount: 15000000,
            purpose: "Разработка продукта и технологическое развитие",
          },
          marketing: {
            percentage: 10,
            amount: 10000000,
            purpose: "Маркетинг и привлечение пользователей",
          },
          treasury: {
            percentage: 10,
            amount: 10000000,
            purpose: "Резервный фонд для будущих инвестиций",
          },
          liquidity: {
            percentage: 5,
            amount: 5000000,
            purpose: "Обеспечение ликвидности на биржах",
          },
        },
        utilityMechanisms: [
          {
            type: "Стейкинг",
            description: "Пользователи могут стейкать токены для получения дополнительных преимуществ",
            tiers: [
              { level: "Basic", requirement: 1000, benefits: ["Скидка 5%", "Доступ к базовым функциям"] },
              {
                level: "Pro",
                requirement: 10000,
                benefits: ["Скидка 15%", "Приоритетная поддержка", "Доступ к PRO функциям"],
              },
              {
                level: "Business",
                requirement: 100000,
                benefits: ["Скидка 30%", "Выделенный менеджер", "Полный доступ ко всем функциям"],
              },
            ],
          },
          {
            type: "Governance",
            description: "Держатели токенов могут голосовать за изменения в протоколе",
            votingPower: "1 токен = 1 голос",
            minimumStake: 1000,
          },
        ],
        growthIncentives: {
          userAcquisition: {
            referralRewards: "50 DEMO за каждого приглашенного пользователя",
            earlyAdopter: "1000 DEMO бонус для первых 10,000 пользователей",
            socialTasks: "5-25 DEMO за активность в социальных сетях",
          },
        },
      }
    case "pitchDeck":
      return {
        slides: [
          { title: "Проблема", content: "Описание проблемы, которую решает проект" },
          { title: "Решение", content: "Описание решения, которое предлагает проект" },
          { title: "Рынок", content: "Анализ рынка и целевой аудитории" },
          { title: "Бизнес-модель", content: "Описание бизнес-модели проекта" },
          { title: "Конкуренты", content: "Анализ конкурентов и конкурентных преимуществ" },
          { title: "Команда", content: "Информация о команде проекта" },
          { title: "Финансы", content: "Финансовые прогнозы и инвестиционные потребности" },
          { title: "Дорожная карта", content: "План развития проекта" },
        ],
        downloadUrl: "#",
      }
    case "mvpPlan":
      return {
        features: [
          {
            name: "Регистрация и авторизация",
            description: "Система регистрации и авторизации пользователей",
            priority: "Высокий",
          },
          { name: "Основной функционал", description: "Ключевая функциональность продукта", priority: "Высокий" },
          { name: "Профиль пользователя", description: "Страница профиля с настройками", priority: "Средний" },
          { name: "Уведомления", description: "Система уведомлений пользователей", priority: "Низкий" },
        ],
        timeline: {
          design: "2 недели",
          development: "8 недель",
          testing: "2 недели",
          launch: "1 неделя",
        },
        budget: 50000,
        resources: {
          developers: 3,
          designers: 1,
          projectManagers: 1,
        },
        kpis: ["Количество регистраций", "Активные пользователи", "Время на сайте", "Конверсия"],
      }
    default:
      return { message: "Демо-данные. Для получения реальных данных необходим API ключ OpenAI." }
  }
}

export const OpenAIService = {
  // Анализ бизнес-идеи с помощью GPT-4o mini
  async analyzeBusinessIdea(project: Project): Promise<any> {
    try {
      // Если OpenAI недоступен, возвращаем мок-данные
      if (!isOpenAIAvailable || !openai) {
        console.log("Using mock data for business idea analysis")
        return generateMockData("analysis")
      }

      const prompt = `
Проанализируй следующую бизнес-идею и предоставь структурированный анализ:

Название проекта: ${project.title}
Описание: ${project.description}
Бизнес-идея: ${project.business_idea}
Индустрия: ${project.industry || "Не указана"}
Целевая аудитория: ${project.target_audience || "Не указана"}

Предоставь анализ в следующем формате JSON:
{
  "summary": "Краткое резюме анализа проекта",
  "strengths": ["Сильная сторона 1", "Сильная сторона 2", ...],
  "weaknesses": ["Слабая сторона 1", "Слабая сторона 2", ...],
  "opportunities": ["Возможность 1", "Возможность 2", ...],
  "threats": ["Угроза 1", "Угроза 2", ...]
}
`

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Ты - эксперт по анализу бизнес-идей и стартапов. Твоя задача - предоставить структурированный анализ бизнес-идеи в формате JSON.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      })

      const content = response.choices[0].message.content
      return content ? JSON.parse(content) : null
    } catch (error) {
      console.error("Error analyzing business idea with OpenAI:", error)
      // В случае ошибки возвращаем мок-данные
      return generateMockData("analysis")
    }
  },

  // Генерация исследования рынка
  async generateMarketResearch(project: Project): Promise<any> {
    try {
      if (!isOpenAIAvailable || !openai) {
        console.log("Using mock data for market research")
        return generateMockData("market")
      }

      // Оставшаяся часть метода без изменений
      const prompt = `
Проведи исследование рынка для следующего проекта:

Название проекта: ${project.title}
Описание: ${project.description}
Бизнес-идея: ${project.business_idea}
Индустрия: ${project.industry || "Не указана"}
Целевая аудитория: ${project.target_audience || "Не указана"}

Предоставь анализ в следующем формате JSON:
{
  "marketSize": {
    "global": {
      "value": число,
      "unit": "млрд $"
    },
    "target": {
      "value": число,
      "unit": "млрд $"
    },
    "cagr": число
  },
  "targetAudience": {
    "demographics": "Описание демографии",
    "psychographics": "Описание психографии",
    "behaviors": "Описание поведения"
  },
  "trends": ["Тренд 1", "Тренд 2", "Тренд 3"]
}
`

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Ты - эксперт по маркетинговым исследованиям. Твоя задача - предоставить структурированный анализ рынка в формате JSON.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      })

      const content = response.choices[0].message.content
      return content ? JSON.parse(content) : null
    } catch (error) {
      console.error("Error generating market research with OpenAI:", error)
      return generateMockData("market")
    }
  },

  // Генерация финансовых прогнозов
  async generateFinancialProjections(project: Project): Promise<any> {
    try {
      if (!isOpenAIAvailable || !openai) {
        console.log("Using mock data for financial projections")
        return generateMockData("financial")
      }

      // Оставшаяся часть метода без изменений
      const prompt = `
Создай финансовые прогнозы для следующего проекта:

Название проекта: ${project.title}
Описание: ${project.description}
Бизнес-идея: ${project.business_idea}
Индустрия: ${project.industry || "Не указана"}
Бюджет: ${project.budget || "Не указан"}
Модель монетизации: ${project.monetization || "Не указана"}

Предоставь прогнозы в следующем формате JSON:
{
  "revenue": [число1, число2, число3, число4, число5],
  "expenses": [число1, число2, число3, число4, число5],
  "profit": [число1, число2, число3, число4, число5],
  "breakEvenPoint": {
    "months": число,
    "revenue": число
  },
  "initialInvestment": число,
  "roi": {
    "year1": число,
    "year3": число,
    "year5": число
  }
}

Где числа в массивах revenue, expenses и profit - это прогнозы на 5 лет.
`

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Ты - финансовый аналитик. Твоя задача - предоставить структурированные финансовые прогнозы в формате JSON.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      })

      const content = response.choices[0].message.content
      return content ? JSON.parse(content) : null
    } catch (error) {
      console.error("Error generating financial projections with OpenAI:", error)
      return generateMockData("financial")
    }
  },

  // Генерация конкурентного анализа
  async generateCompetitiveAnalysis(project: Project): Promise<any> {
    try {
      if (!isOpenAIAvailable || !openai) {
        console.log("Using mock data for competitive analysis")
        return generateMockData("competitive")
      }

      // Оставшаяся часть метода без изменений
      const prompt = `
Проведи конкурентный анализ для следующего проекта:

Название проекта: ${project.title}
Описание: ${project.description}
Бизнес-идея: ${project.business_idea}
Индустрия: ${project.industry || "Не указана"}

Предоставь анализ в следующем формате JSON:
{
  "competitors": [
    {
      "name": "Название конкурента 1",
      "marketShare": число,
      "strengths": ["Сильная сторона 1", "Сильная сторона 2"],
      "weaknesses": ["Слабая сторона 1", "Слабая сторона 2"]
    },
    {
      "name": "Название конкурента 2",
      "marketShare": число,
      "strengths": ["Сильная сторона 1", "Сильная сторона 2"],
      "weaknesses": ["Слабая сторона 1", "Слабая сторона 2"]
    },
    {
      "name": "Название конкурента 3",
      "marketShare": число,
      "strengths": ["Сильная сторона 1", "Сильная сторона 2"],
      "weaknesses": ["Слабая сторона 1", "Слабая сторона 2"]
    }
  ],
  "projectAdvantages": ["Преимущество 1", "Преимущество 2", "Преимущество 3", "Преимущество 4"],
  "marketSharePotential": число,
  "entryBarriers": ["Барьер 1", "Барьер 2", "Барьер 3"]
}
`

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Ты - эксперт по конкурентному анализу. Твоя задача - предоставить структурированный конкурентный анализ в формате JSON.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      })

      const content = response.choices[0].message.content
      return content ? JSON.parse(content) : null
    } catch (error) {
      console.error("Error generating competitive analysis with OpenAI:", error)
      return generateMockData("competitive")
    }
  },

  // Генерация токеномики
  async generateTokenomics(project: Project): Promise<any> {
    try {
      if (!isOpenAIAvailable || !openai) {
        console.log("Using mock data for tokenomics")
        return generateMockData("tokenomics")
      }

      // Оставшаяся часть метода без изменений
      const tokenSymbol = project.token_symbol || generateTokenSymbol(project.title)
      const prompt = `
Создай токеномику для следующего проекта:

Название проекта: ${project.title}
Описание: ${project.description}
Бизнес-идея: ${project.business_idea}
Индустрия: ${project.industry || "Не указана"}
Символ токена: ${tokenSymbol}

Предоставь токеномику в следующем формате JSON:
{
  "tokenBasics": {
    "name": "Название токена",
    "symbol": "${tokenSymbol}",
    "totalSupply": число,
    "decimals": 18,
    "initialPrice": "0.xxx"
  },
  "distribution": {
    "publicSale": {
      "percentage": число,
      "amount": число,
      "priceTiers": [
        { "tier": "Early", "percentage": число, "price": "0.xxx", "bonus": "xx%" },
        { "tier": "Main", "percentage": число, "price": "0.xxx", "bonus": "xx%" }
      ]
    },
    "team": {
      "percentage": число,
      "amount": число,
      "vesting": "описание вестинга"
    },
    "development": {
      "percentage": число,
      "amount": число,
      "purpose": "описание назначения"
    },
    "marketing": {
      "percentage": число,
      "amount": число,
      "purpose": "описание назначения"
    },
    "treasury": {
      "percentage": число,
      "amount": число,
      "purpose": "описание назначения"
    },
    "liquidity": {
      "percentage": число,
      "amount": число,
      "purpose": "описание назначения"
    }
  },
  "utilityMechanisms": [
    {
      "type": "Тип механизма",
      "description": "Описание механизма",
      "tiers": [
        { "level": "Basic", "requirement": число, "benefits": ["Бенефит 1", "Бенефит 2"] },
        { "level": "Pro", "requirement": число, "benefits": ["Бенефит 1", "Бенефит 2", "Бенефит 3"] },
        { "level": "Business", "requirement": число, "benefits": ["Бенефит 1", "Бенефит 2", "Бенефит 3"] }
      ]
    },
    {
      "type": "Governance",
      "description": "Описание механизма управления",
      "votingPower": "описание силы голоса",
      "minimumStake": число
    }
  ],
  "growthIncentives": {
    "userAcquisition": {
      "referralRewards": "описание наград за рефералов",
      "earlyAdopter": "описание бонусов для ранних пользователей",
      "socialTasks": "описание наград за социальные задания"
    }
  }
}
`

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Ты - эксперт по токеномике и криптоэкономике. Твоя задача - предоставить структурированную токеномику в формате JSON.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      })

      const content = response.choices[0].message.content
      return content ? JSON.parse(content) : null
    } catch (error) {
      console.error("Error generating tokenomics with OpenAI:", error)
      return generateMockData("tokenomics")
    }
  },

  // Генерация данных для Pitch Deck
  async generatePitchDeckData(project: Project): Promise<any> {
    try {
      if (!isOpenAIAvailable || !openai) {
        console.log("Using mock data for pitch deck")
        return generateMockData("pitchDeck")
      }

      // Оставшаяся часть метода без изменений
      const prompt = `
Создай структуру Pitch Deck для следующего проекта:

Название проекта: ${project.title}
Описание: ${project.description}
Бизнес-идея: ${project.business_idea}
Индустрия: ${project.industry || "Не указана"}
Целевая аудитория: ${project.target_audience || "Не указана"}

Предоставь структуру в следующем формате JSON:
{
  "slides": [
    {
      "title": "Название слайда",
      "content": "Содержание слайда"
    },
    ...
  ],
  "downloadUrl": "#"
}
`

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Ты - эксперт по созданию презентаций для стартапов. Твоя задача - предоставить структурированный Pitch Deck в формате JSON.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      })

      const content = response.choices[0].message.content
      return content ? JSON.parse(content) : null
    } catch (error) {
      console.error("Error generating pitch deck data with OpenAI:", error)
      return generateMockData("pitchDeck")
    }
  },

  // Генерация плана MVP
  async generateMVPPlan(project: Project): Promise<any> {
    try {
      if (!isOpenAIAvailable || !openai) {
        console.log("Using mock data for MVP plan")
        return generateMockData("mvpPlan")
      }

      // Оставшаяся часть метода без изменений
      const prompt = `
Создай план MVP для следующего проекта:

Название проекта: ${project.title}
Описание: ${project.description}
Бизнес-идея: ${project.business_idea}
Индустрия: ${project.industry || "Не указана"}
Стадия: ${project.stage || "idea"}

Предоставь план в следующем формате JSON:
{
  "features": [
    {
      "name": "Название функции",
      "description": "Описание функции",
      "priority": "Высокий/Средний/Низкий"
    },
    ...
  ],
  "timeline": {
    "design": "x недель",
    "development": "x недель",
    "testing": "x недель",
    "launch": "x недель"
  },
  "budget": число,
  "resources": {
    "developers": число,
    "designers": число,
    "projectManagers": число
  },
  "kpis": ["KPI 1", "KPI 2", "KPI 3", "KPI 4"]
}
`

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Ты - эксперт по разработке MVP для стартапов. Твоя задача - предоставить структурированный план MVP в формате JSON.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      })

      const content = response.choices[0].message.content
      return content ? JSON.parse(content) : null
    } catch (error) {
      console.error("Error generating MVP plan with OpenAI:", error)
      return generateMockData("mvpPlan")
    }
  },

  // Генерация оценки проекта
  async generateAIScore(project: Project): Promise<number> {
    try {
      if (!isOpenAIAvailable || !openai) {
        console.log("Using mock data for AI score")
        return 7.5 // Возвращаем фиксированную оценку для демо
      }

      // Оставшаяся часть метода без изменений
      const prompt = `
Оцени следующий проект по шкале от 1 до 10 (с одним десятичным знаком):

Название проекта: ${project.title}
Описание: ${project.description}
Бизнес-идея: ${project.business_idea}
Индустрия: ${project.industry || "Не указана"}
Целевая аудитория: ${project.target_audience || "Не указана"}

Предоставь оценку в формате JSON:
{
  "score": число
}
`

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Ты - эксперт по оценке стартапов. Твоя задача - предоставить объективную оценку проекта по шкале от 1 до 10 с одним десятичным знаком.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      })

      const content = response.choices[0].message.content
      const result = content ? JSON.parse(content) : { score: 5.0 }
      return result.score
    } catch (error) {
      console.error("Error generating AI score with OpenAI:", error)
      // В случае ошибки возвращаем среднюю оценку
      return 5.0
    }
  },

  // Генерация эмбеддингов для векторного поиска
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      if (!isOpenAIAvailable || !openai) {
        console.log("Using mock embedding")
        // Возвращаем массив из 1536 случайных чисел от -1 до 1 (типичный размер эмбеддинга)
        return Array.from({ length: 1536 }, () => Math.random() * 2 - 1)
      }

      // Оставшаяся часть метода без изменений
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
      })

      return response.data[0].embedding
    } catch (error) {
      console.error("Error generating embedding with OpenAI:", error)
      // В случае ошибки возвращаем массив из 1536 случайных чисел
      return Array.from({ length: 1536 }, () => Math.random() * 2 - 1)
    }
  },
}

// Вспомогательная функция для генерации символа токена
function generateTokenSymbol(projectName: string): string {
  if (!projectName) return "TKN"

  // Генерация 3-4 буквенного символа токена на основе названия проекта
  const words = projectName.split(/\s+/)
  if (words.length >= 3) {
    return (words[0][0] + words[1][0] + words[2][0]).toUpperCase()
  } else if (words.length === 2) {
    return (words[0][0] + words[1][0] + words[1][1]).toUpperCase()
  } else {
    const word = words[0]
    return word.substring(0, Math.min(3, word.length)).toUpperCase()
  }
}
