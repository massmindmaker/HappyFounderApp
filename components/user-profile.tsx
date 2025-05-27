"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Wallet, Copy, ExternalLink, User, Settings, LogOut } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

interface UserProfileProps {
  onBack: () => void
}

export default function UserProfile({ onBack }: UserProfileProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("info")
  const supabase = useSupabaseClient()
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [referralLink, setReferralLink] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user) {
          const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          if (error) throw error

          setProfile(data)
          if (data.referral_code) {
            setReferralLink(`https://t.me/happy_founder_bot?start=${data.referral_code}`)
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [supabase, toast])

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Скопировано!",
      description: "Реферальная ссылка скопирована в буфер обмена",
      duration: 2000,
    })
  }

  const userProjects = [
    { id: 1, name: "Маркетплейс для фрилансеров", category: "Web3" },
    { id: 2, name: "AI-ассистент для HR", category: "SaaS" },
  ]

  const userInvestments = [
    { id: 1, name: "DeFi платформа", type: "Токены", amount: "500 $DFI", value: "$1,250" },
    { id: 2, name: "NFT маркетплейс", type: "NFT", amount: "2 NFT", value: "$750" },
  ]

  const handleCopyWallet = () => {
    navigator.clipboard.writeText("0x1a2b3c4d5e6f7g8h9i0j")
    toast({
      title: "Скопировано!",
      description: "Адрес кошелька скопирован в буфер обмена",
      duration: 2000,
    })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col">
      <header className="py-4 px-4 border-b flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Профиль</h1>
        <div className="ml-auto">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 bg-primary/5 border-b">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg">@alex_web3</h2>
              <p className="text-sm text-gray-600">Присоединился: Март 2024</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Подключенный кошелек</h3>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={handleCopyWallet}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center">
              <Wallet className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-xs text-gray-600 font-mono">0x1a2b...0j</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg shadow-sm p-3">
              <div className="text-xs text-gray-500 mb-1">Баланс</div>
              <div className="font-bold text-lg">{profile?.token_balance || 0} $HFC</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3">
              <div className="text-xs text-gray-500 mb-1">Приглашено</div>
              <div className="font-bold text-lg">{profile?.referrals_count || 0}</div>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium mb-2">Реферальная ссылка</h3>
            <div className="flex">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 text-xs p-2 border rounded-l-lg bg-gray-50"
              />
              <Button variant="default" size="sm" className="rounded-l-none text-xs" onClick={handleCopyReferralLink}>
                Копировать
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid grid-cols-2 p-0 h-12">
            <TabsTrigger value="projects" className="text-xs">
              Мои проекты
            </TabsTrigger>
            <TabsTrigger value="investments" className="text-xs">
              Мои инвестиции
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="p-4 mt-0">
            <div className="space-y-3">
              {userProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{project.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{project.category}</span>
                  </div>
                  <div className="flex justify-between mt-3 pt-3 border-t">
                    <Button variant="outline" size="sm" className="text-xs">
                      Редактировать
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Открыть
                    </Button>
                  </div>
                </motion.div>
              ))}

              <Button variant="outline" className="w-full mt-4">
                Создать новый проект
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="investments" className="p-4 mt-0">
            <div className="space-y-3">
              {userInvestments.map((investment) => (
                <motion.div
                  key={investment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{investment.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        investment.type === "Токены" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {investment.type}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Количество:</span>
                    <span className="font-medium">{investment.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Стоимость:</span>
                    <span className="font-medium">{investment.value}</span>
                  </div>
                  <div className="flex justify-between mt-3 pt-3 border-t">
                    <Button variant="outline" size="sm" className="text-xs">
                      История
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      Продать
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Выйти
        </Button>
      </div>
    </div>
  )
}
