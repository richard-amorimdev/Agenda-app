import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Agendamento App",
  description: "Sistema de Agendamento de Tarefas",
  generator: "Richard.Dev",
}

/**
 * RootLayout é o layout principal da aplicação.
 * Ele envolve todas as páginas e fornece um contexto de tema e notificações.
 * @param {object} props - As propriedades do componente.
 * @param {React.ReactNode} props.children - Os componentes filhos a serem renderizados dentro do layout.
 * @returns {JSX.Element} O layout principal da aplicação.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
      </head>

      <body className="flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex-grow">{children}</main>
          {/* Renderiza o componente Toaster para exibir notificações em toda a aplicação */}
          <Toaster />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
