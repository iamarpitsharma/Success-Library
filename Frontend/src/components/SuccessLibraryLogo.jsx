import React from "react"
import { BookOpen, Crown } from "lucide-react"

export default function SuccessLibraryLogo({ size = "default" }) {
  const sizes = {
    small: { container: "h-10 w-10", text: "text-lg", icon: "h-6 w-6", badge: "h-4 w-4" },
    default: { container: "h-14 w-14", text: "text-2xl", icon: "h-8 w-8", badge: "h-5 w-5" },
    large: { container: "h-20 w-20", text: "text-4xl", icon: "h-12 w-12", badge: "h-6 w-6" },
  }

  const currentSize = sizes[size]

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        {/* Main logo container with gradient */}
        <div
          className={`${currentSize.container} bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden transform hover:scale-105 transition-transform duration-300`}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-transparent to-blue-800/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-2 right-2 w-1 h-1 bg-blue-200 rounded-full"></div>
            <div className="absolute top-3 right-1 w-1.5 h-1.5 bg-white/40 rounded-full"></div>
          </div>

          {/* Main book icon with glow effect */}
          <div className="relative z-10 flex items-center justify-center">
            <BookOpen className={`${currentSize.icon} text-white drop-shadow-lg`} />
          </div>

          {/* Success crown/badge */}
          <div className="absolute -top-1 -right-1 transform">
            <div
              className={`${currentSize.badge} bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white`}
            >
              <Crown className="h-2.5 w-2.5 text-yellow-800 fill-current" />
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
        </div>

        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-300/30 ring-offset-2 ring-offset-transparent"></div>
      </div>

      <div className="flex flex-col">
        <span
          className={`${currentSize.text} font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent tracking-tight`}
        >
          Success
        </span>
        <span className="text-sm text-gray-600 font-semibold -mt-1 tracking-wide">LIBRARY</span>
        <span className="text-xs text-blue-500 font-medium -mt-0.5">Est. 2023</span>
      </div>
    </div>
  )
}
