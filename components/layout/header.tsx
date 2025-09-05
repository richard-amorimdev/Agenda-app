"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, Calendar, ListTodo } from "lucide-react"
import { signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import type { User } from "@/lib/auth"
import Link from "next/link"
import { AlternadorDeTema } from "@/components/ui/theme-toggle"
import type { Consultant } from  "@/components/consultant/consultant.ts"// <- Importe o tipo Consultant
 // ou o caminho correto no seu projeto



/**
 * Componente de Cabeçalho da Aplicação
 *
 * Responsável por renderizar a barra superior da aplicação com:
 * - Logo e título da empresa
 * - Badge indicando o tipo de usuário (Admin apenas)
 * - Botão de Tarefas Agendadas
 * - Alternador de tema (claro/escuro)
 * - Informações do usuário e botão de logout
 */
interface PropriedadesCabecalho {
  userName: string
  userRole: "admin" | "consultor"; // já corrigindo erro 2
  consultants: Consultant[];       // <- Adicione esta linha
  selectedConsultant: Consultant | null;
  onConsultantChange: () => void;
  currentUser: any;
}

export default function Cabecalho({
  userName: nomeUsuario,
  userRole: tipoUsuario,
  currentUser: usuarioAtual,
}: PropriedadesCabecalho) {
  const router = useRouter()
  const [montado, setMontado] = useState(false)

  // Garante renderização apenas após hidratação
  useEffect(() => {
    setMontado(true)
  }, [])

  /**
   * Função para realizar logout do usuário
   * Remove a sessão e redireciona para a página de login
   */
  const realizarLogout = async () => {
    await signOut()
    router.push("/login")
  }

  // Estado de carregamento durante a hidratação
  if (!montado) {
    return (
      <header className="bg-background shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-foreground">Un. Meltec</h1>
              </div>
              <Badge variant="default">Administrador</Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Carregando...</span>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="shadow-sm border-b border-border bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Seção do Logo e Título */}
          <Link href="/dashboard" passHref>
            <div className="flex items-center gap-4 cursor-pointer">
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-foreground">Un. Meltec</h1>
              </div>
              <Badge variant="default">Administrador</Badge>
            </div>
          </Link>

          {/* Seção de Controles e Ações */}
          <div className="flex items-center gap-4">
            {/* Botão Tarefas Agendadas */}
            <Link href="/scheduled-tasks" passHref>
              <Button variant="outline" className="flex items-center gap-2 flex-row bg-transparent">
                <ListTodo className="h-4 w-4" />
                Tarefas Agendadas
              </Button>
            </Link>

            {/* Alternador de Tema */}
            <AlternadorDeTema />

            {/* Seção do Usuário e Logout */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Olá, {nomeUsuario}</span>
              <Button variant="outline" size="sm" onClick={realizarLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
