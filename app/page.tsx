"use client"

import { useState } from "react"
import WelcomeScreen from "@/components/welcome-screen"
import WalletConnection from "@/components/wallet-connection"
import DemoAnimation from "@/components/demo-animation"
import MainScreen from "@/components/main-screen"
import ProjectForm from "@/components/project-form"
import ProjectCard from "@/components/project-card"
import UserProfile from "@/components/user-profile"
import NFTCollection from "@/components/nft-collection"
import { Toaster } from "@/components/toaster"
import { TelegramWebAppHandler } from "@/components/telegram-web-app-handler"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState("welcome")
  const [walletConnected, setWalletConnected] = useState(false)
  const [currentProject, setCurrentProject] = useState(null)

  const handleStartApp = () => {
    setCurrentScreen("wallet")
  }

  const handleWalletConnection = (success: boolean) => {
    setWalletConnected(success)
    if (success) {
      setCurrentScreen("demo")
    }
  }

  const handleDemoComplete = () => {
    setCurrentScreen("main")
  }

  const handleCreateProject = () => {
    setCurrentScreen("projectForm")
  }

  const handleProjectSubmit = (projectData: any) => {
    setCurrentProject(projectData)
    setCurrentScreen("projectCard")
  }

  const handleBackToMain = () => {
    setCurrentScreen("main")
  }

  const handleOpenProfile = () => {
    setCurrentScreen("profile")
  }

  const handleCreateNFT = () => {
    setCurrentScreen("nftCollection")
  }

  const handleNFTComplete = () => {
    setCurrentScreen("projectCard")
  }

  const handleOpenProject = (project: any) => {
    setCurrentProject(project)
    setCurrentScreen("projectCard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gray-50">
      <TelegramWebAppHandler />
      {currentScreen === "welcome" && <WelcomeScreen onStart={handleStartApp} />}

      {currentScreen === "wallet" && <WalletConnection onConnection={handleWalletConnection} />}

      {currentScreen === "demo" && <DemoAnimation onComplete={handleDemoComplete} />}

      {currentScreen === "main" && (
        <MainScreen
          onCreateProject={handleCreateProject}
          walletConnected={walletConnected}
          onOpenProfile={handleOpenProfile}
          onOpenProject={handleOpenProject}
        />
      )}

      {currentScreen === "projectForm" && <ProjectForm onSubmit={handleProjectSubmit} onCancel={handleBackToMain} />}

      {currentScreen === "projectCard" && (
        <ProjectCard project={currentProject} onBack={handleBackToMain} onCreateNFT={handleCreateNFT} />
      )}

      {currentScreen === "profile" && <UserProfile onBack={handleBackToMain} />}

      {currentScreen === "nftCollection" && (
        <NFTCollection
          projectId={currentProject?.id || 1}
          onBack={() => setCurrentScreen("projectCard")}
          onComplete={handleNFTComplete}
        />
      )}

      <Toaster />
    </main>
  )
}

