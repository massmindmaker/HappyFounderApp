"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface ToastProps {
  title?: string
  description?: string
  duration?: number
  variant?: "default" | "destructive" | "success"
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({ title, description, duration = 3000, variant = "default", onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const variants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return "bg-red-500 text-white"
      case "success":
        return "bg-green-500 text-white"
      default:
        return "bg-white text-gray-900 border border-gray-200"
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed bottom-4 right-4 max-w-sm rounded-lg shadow-lg ${getVariantStyles()} p-4`}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
        >
          <div className="flex justify-between items-start">
            <div>
              {title && <h3 className="font-semibold">{title}</h3>}
              {description && <p className="text-sm mt-1">{description}</p>}
            </div>
            <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}

