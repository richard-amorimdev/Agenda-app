"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser, User } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Header from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Loader2, CalendarIcon, Clock, ListTodo } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Task {
  id: string
  title: string
  description: string | null
  client_name: string
  consultant_id: string
  start_date: string
  end_date: string
  time_slot: "manha" | "tarde" | "integral"
  consultant_name?: string
}

interface Consultant {
  id: string
  name: string
  username: string
}

type TaskWithConsultant = Task & {
    consultants: {
        name: string;
    } | null;
};

export default function ScheduledTasksPage() {
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterConsultant, setFilterConsultant] = useState<string | null>(null)
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false)
  const [currentTaskDescription, setCurrentTaskDescription] = useState("")
  const router = useRouter()

  const loadConsultants = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, username")
        .eq("role", "consultor")
        .order("name")

      if (error) throw error
      setConsultants(data || [])
    } catch (error) {
      console.error("Erro ao carregar consultores:", error)
    }
  }, []);

  const loadTasks = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError("")
    try {
      let query = supabase
        .from("tasks")
        .select(`*,consultants:users(name)`)
        .order("start_date", { ascending: true })

      if (user.role === "consultor") {
        query = query.eq("consultant_id", user.id)
      } else if (filterConsultant) {
        query = query.eq("consultant_id", filterConsultant)
      }

      const { data, error } = await query

      if (error) throw error

      const tasksWithConsultantName: Task[] = data.map((task: TaskWithConsultant) => ({
        ...task,
        consultant_name: task.consultants?.name || "Desconhecido",
      }))
      setTasks(tasksWithConsultantName)
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error)
      setError("Erro ao carregar tarefas agendadas.")
    } finally {
      setLoading(false)
    }
  }, [user, filterConsultant]);

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
  }, [router])

  useEffect(() => {
    if (user) {
      loadTasks()
      if (user.role === "admin") {
        loadConsultants()
      }
    }
  }, [user, filterConsultant, loadTasks, loadConsultants])

  const getFormattedTimeSlot = (slot: Task["time_slot"]) => {
    switch (slot) {
      case "manha":
        return "Manhã (08:00 - 12:00)"
      case "tarde":
        return "Tarde (13:30 - 18:00)"
      case "integral":
        return "Integral (08:00 - 18:00)"
      default:
        return ""
    }
  }

  const handleViewDescription = (description: string | null) => {
    setCurrentTaskDescription(description || "Nenhuma descrição fornecida.")
    setIsDescriptionDialogOpen(true)
  }

  const filteredAndSearchedTasks = tasks.filter((task) => {
    const matchesSearch =
      searchTerm === "" ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.consultant_name && task.consultant_name.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null // Redirecionado pelo useEffect
  }

  return (
    <div className="flex-1 border-slate-100">
      <Header
        userName={user.name}
        userRole={user.role}
        consultants={consultants}
        selectedConsultant={null} // Não usado nesta página para filtro global
        onConsultantChange={() => {}}
        currentUser={user}
      />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-6 w-6" />
              Tarefas Agendadas
            </CardTitle>
            <CardDescription>Visualize todas as tarefas agendadas no sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                placeholder="Buscar por título, cliente ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border-slate-600"
              />
              {user.role === "admin" && (
                <Select
                  value={filterConsultant || "all"}
                  onValueChange={(value) => setFilterConsultant(value === "all" ? null : value)}
                >
                  <SelectTrigger className="w-full sm:w-[200px] border-black">
                    <SelectValue placeholder="Filtrar por consultor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Consultores</SelectItem>
                    {consultants.map((consultant) => (
                      <SelectItem key={consultant.id} value={consultant.id}>
                        {consultant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {filteredAndSearchedTasks.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma tarefa encontrada.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Consultor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Período</TableHead>
                      {/* Removido max-w-[200px] da TableHead para permitir mais flexibilidade */}
                      <TableHead className="min-w-[150px]">Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSearchedTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.client_name}</TableCell>
                        <TableCell>{task.consultant_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                            {format(parseISO(task.start_date), "dd/MM/yyyy", { locale: ptBR })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            {getFormattedTimeSlot(task.time_slot)}
                          </div>
                        </TableCell>
                        {/* Removido max-w-[200px] da TableCell para permitir mais espaço */}
                        <TableCell className="min-w-[150px]">
                          {task.description && task.description.length > 50 ? (
                            <div className="flex flex-col">
                              <span className="truncate">{task.description}</span>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto justify-start text-blue-600 hover:text-blue-800"
                                onClick={() => handleViewDescription(task.description)}
                              >
                                Visualizar Completa
                              </Button>
                            </div>
                          ) : (
                            task.description || "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      {/* Dialog para Visualizar Descrição Completa */}
      <Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Descrição Completa da Tarefa</DialogTitle>
            <DialogDescription>{currentTaskDescription}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
