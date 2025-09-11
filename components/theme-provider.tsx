"use client"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

/**
 * Provedor de Tema da Aplicação
 *
 * Este componente encapsula o ThemeProvider do next-themes para fornecer
 * funcionalidade de alternância entre modo claro e escuro em toda a aplicação.
 *
 * Funcionalidades:
 * - Gerencia o estado global do tema (claro/escuro/sistema)
 * - Persiste a preferência do usuário no localStorage
 * - Detecta automaticamente a preferência do sistema operacional
 * - Evita problemas de hidratação entre servidor e cliente
 */
export function ProvedorDeTema({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Mantém compatibilidade com importações existentes
export { ProvedorDeTema as ThemeProvider }
