"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Layers,
  Zap,
  Shield,
  Download,
  History,
  Bookmark,
  Database,
  Moon,
  Sun,
} from "lucide-react"

const features = [
  {
    icon: Layers,
    title: "Visual Query Builder",
    description: "Compose complex AND/OR logic trees without writing a single line of SQL.",
  },
  {
    icon: Zap,
    title: "Live Preview",
    description: "See your query update in real time as you build, with syntax-highlighted output.",
  },
  {
    icon: Database,
    title: "Schema Awareness",
    description: "Select from pre-loaded schemas — fields, types, and operators auto-populate.",
  },
  {
    icon: History,
    title: "Execution History",
    description: "Every query you run is saved. Restore any previous state in one click.",
  },
  {
    icon: Bookmark,
    title: "Saved Presets",
    description: "Bookmark your most-used queries and reload them instantly across sessions.",
  },
  {
    icon: Download,
    title: "Import & Export",
    description: "Share queries as JSON or import them from external sources effortlessly.",
  },
  {
    icon: Shield,
    title: "Undo / Redo",
    description: "Full history stack — experiment freely, knowing every change is reversible.",
  },
]

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border/60 px-6 py-3 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">QueryCraft</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} />}
            </Button>
            <Link
              href="/builder"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
            >
              Open Builder <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 md:py-36 overflow-hidden">
          {/* Glow blob */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="h-[480px] w-[480px] rounded-full bg-brand-primary/10 blur-3xl animate-in fade-in duration-1000" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">


            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              Build SQL queries
              <br />
              <span className="text-brand-primary">without the syntax</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300">
              QueryCraft lets you visually compose, preview, and execute database queries using
              a drag-and-drop logic tree — no SQL knowledge required.
            </p>

            <Link
              href="/builder"
              className="mt-2 inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-foreground text-background text-sm font-bold shadow-lg hover:opacity-90 transition-opacity glowing-active animate-in fade-in zoom-in-95 duration-500 delay-500"
            >
              Start Building <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Everything you need</h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              A complete query workbench — from first condition to final result.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className="glass-panel rounded-xl p-5 flex flex-col gap-3 hover:border-brand-primary/30 hover:-translate-y-0.5 transition-all duration-200 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDuration: "500ms", animationDelay: `${i * 70}ms` }}
              >
                <div className="h-9 w-9 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                  <Icon size={16} className="text-brand-primary" />
                </div>
                <h3 className="text-sm font-bold">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="px-6 py-16">
          <div className="max-w-2xl mx-auto glass-panel rounded-2xl p-10 text-center flex flex-col items-center gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold tracking-tight">Ready to query smarter?</h2>
            <p className="text-muted-foreground text-sm max-w-md">
              Open the builder and start composing in seconds — no sign-up, no setup.
            </p>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-foreground text-background text-sm font-bold shadow-lg hover:opacity-90 transition-opacity"
            >
              Launch QueryCraft <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 px-6 py-5 text-center text-sm text-muted-foreground animate-in fade-in duration-700">
        © {new Date().getFullYear()} QueryCraft
      </footer>
    </div>
  )
}
