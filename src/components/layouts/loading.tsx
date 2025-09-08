"use client"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SimpleHRLoadingProps {
  className?: string
}

export function SimpleHRLoading({ className }: SimpleHRLoadingProps) {
    const [dots, setDots] = useState("")

    useEffect(() => {
       const timer = setInterval(() => {
         setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
       }, 500)

       return () => clearInterval(timer)
    }, [])

    return (
        <div className={cn("min-h-screen flex items-center justify-center", className)}>
            <div className="text-center space-y-6">
                {/* Simple animated spinner with ERP styling */}
                <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-4 border-border rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>

                {/* Small data icon in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
                    <div className="bg-primary rounded-sm opacity-60"></div>
                    <div className="bg-primary rounded-sm opacity-80"></div>
                    <div className="bg-primary rounded-sm opacity-40"></div>
                    <div className="bg-primary rounded-sm opacity-90"></div>
                    </div>
                </div>
                </div>

                {/* Simple text with animated dots */}
                <div className="space-y-2">
                <h2 className="text-xl font-semibold text-primary">HR System</h2>
                <p className="text-muted-foreground">Loading your business data{dots}</p>
                </div>

                {/* Simple data flow indicators */}
                <div className="flex items-center justify-center space-x-2">
                {["Data", "Process", "Ready"].map((step, i) => (
                    <div key={step} className="flex items-center">
                    <div
                        className="w-2 h-2 bg-primary rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.3}s` }}
                    ></div>
                    {i < 2 && <div className="w-8 h-px bg-border mx-2"></div>}
                    </div>
                ))}
                </div>
            </div>
        </div>
    )
}