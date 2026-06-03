"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useQueryStore } from "@/store/query-store"
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

function DotsLoader({ size = 7 }: { size?: number }) {
  const colors = ["bg-indigo-500", "bg-amber-400", "bg-emerald-400"]
  return (
    <span className="flex items-center gap-1">
      {colors.map((color, i) => (
        <motion.span
          key={i}
          className={`rounded-sm ${color} shrink-0`}
          style={{ width: size, height: size }}
          animate={{ y: [0, -(size * 1.4), 0] }}
          transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.13, ease: "easeInOut" }}
        />
      ))}
    </span>
  )
}

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
    description: "Select from pre-loaded schemas, fields, types, and operators auto-populate.",
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
    description: "Full history stack, experiment freely, knowing every change is reversible.",
  },
]

export default function LandingPage() {
  const darkMode = useQueryStore((s) => s.darkMode)
  const toggleDarkMode = useQueryStore((s) => s.toggleDarkMode)
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()

  const handleLaunch = () => {
    setIsNavigating(true)
    setTimeout(() => router.push("/builder"), 2500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border/60 px-6 py-3 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">
            <a href="/">
              QueryCraft</a>
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} />}
            </Button>
            <AnimatePresence>
              <motion.span
                onClick={handleLaunch}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors cursor-pointer"
                key={isNavigating ? "loading" : "idle"}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 4 }}
                transition={{ duration: 0.25 }}
              >

                Open Builder <ArrowRight size={14} />

              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className="flex-1">

        <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 md:py-36 overflow-hidden">

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="h-[480px] w-[480px] rounded-full bg-brand-primary/10 blur-3xl animate-in fade-in duration-1000" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">


            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              Build SQL queries
              <br />
              <span className="text-brand-primary">without the syntax</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300">
              QueryCraft lets you visually compose, preview, and execute database queries using
              a drag-and-drop logic tree, and no SQL knowledge required.
            </p>

            <motion.button
              onClick={handleLaunch}
              disabled={isNavigating}
              className="mt-2 inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-foreground text-background text-sm font-bold shadow-lg glowing-active animate-in fade-in zoom-in-95 duration-500 delay-500 overflow-hidden disabled:cursor-wait"
              whileHover={!isNavigating ? { scale: 1.04 } : {}}
              whileTap={!isNavigating ? { scale: 0.97 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isNavigating ? (
                  <motion.span
                    key="loading"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <DotsLoader size={7} />
                    Launching…
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    Start Building <ArrowRight size={15} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </section>


        <section className="px-6 py-7 max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Everything you need</h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              A complete query workbench, from first condition to final result.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {features.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                className="glass-panel rounded-xl p-5 flex flex-col gap-3"
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
                }}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
              >
                <motion.div
                  className="h-9 w-9 rounded-lg bg-brand-primary/10 flex items-center justify-center"
                  whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
                >
                  <Icon size={16} className="text-brand-primary" />
                </motion.div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>


        <section className="px-6 py-16">
          <div className="max-w-2xl mx-auto glass-panel rounded-2xl p-10 text-center flex flex-col items-center gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-medium tracking-tight">Ready to query smarter?</h2>
            <p className="text-muted-foreground text-sm max-w-md">
              Open the builder and start composing in seconds, no sign-up, no setup.
            </p>
            <motion.button
              onClick={handleLaunch}
              disabled={isNavigating}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-foreground text-background text-sm font-bold shadow-lg hover:opacity-90 transition-opacity disabled:cursor-wait"
              whileTap={!isNavigating ? { scale: 0.97 } : {}}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isNavigating ? (
                  <motion.span key="loading" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <DotsLoader size={7} /> Launching…
                  </motion.span>
                ) : (
                  <motion.span key="idle" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Launch QueryCraft <ArrowRight size={15} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 px-6 py-5 text-center text-sm text-muted-foreground animate-in fade-in duration-700">
        © {new Date().getFullYear()} QueryCraft by Donvictory ✌️
      </footer>

      <AnimatePresence>
        {isNavigating && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <motion.span
              className="text-3xl font-bold tracking-tight mb-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.5 }}
            >
              QueryCraft
            </motion.span>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <DotsLoader size={14} />
            </motion.div>
            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Ready inna bit 😉
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
