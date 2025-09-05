"use client"

import * as React from "react"
import { Sun, Moon } from 'lucide-react'
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

/**
 * Botão Alternador de Tema
 *
 * Componente responsável por alternar entre os modos claro e escuro da aplicação.
 * Utiliza o hook useTheme do next-themes para garantir sincronização adequada
 * com o sistema de temas global.
 *
 * Funcionalidades:
 * - Alterna entre modo claro e escuro
 * - Exibe ícone apropriado para o tema atual
 * - Acessibilidade com aria-label
 * - Estados de hover e focus bem definidos
 * - Integração completa com next-themes
 */
function AlternadorDeTema() {
  const { theme: tema, setTheme: definirTema } = useTheme()
  const [montado, setMontado] = React.useState(false)

  // Garante que o componente só renderize após a hidratação
  // para evitar incompatibilidades entre servidor e cliente
  React.useEffect(() => {
    setMontado(true)
  }, [])

  /**
   * Função para alternar entre os temas
   * Alterna entre 'light' e 'dark', mantendo a lógica simples
   */
  const alternarTema = () => {
    definirTema(tema === "dark" ? "light" : "dark")
  }

  // Renderiza botão desabilitado durante a hidratação
  if (!montado) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "inline-flex items-center justify-center rounded-md p-2 transition",
          "opacity-50 cursor-not-allowed",
        )}
      >
        <Sun className="h-4 w-4" />
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-label={`Alternar para modo ${tema === "dark" ? "claro" : "escuro"}`}
      onClick={alternarTema}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 transition-all duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "border border-input bg-background text-foreground",
        "shadow-sm hover:shadow-md",
      )}
    >
      {tema === "dark" ? (
        <Sun className="h-4 w-4 transition-transform hover:rotate-12" />
      ) : (
        <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
      )}
    </button>
  )
}

// Exporta com nome em português e mantém compatibilidade
export { AlternadorDeTema }
export { AlternadorDeTema as ThemeToggle }
