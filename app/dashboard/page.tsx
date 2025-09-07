"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"
import type { User } from "@/lib/auth"
import Header from "@/components/layout/header"
import GanttChart from "@/components/gantt/gantt-chart"
import CreateTaskForm from "@/components/tasks/create-task-form"
import { DayView } from "@/components/agenda/day-view"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { isSameDay, parseISO } from "date-fns"

interface Task {
  id: string
  title: string
  description: string | null
  client_name: string
  consultant_id: string
  start_date?: string
  end_date?: string
  data?: string
  horario_inicio?: string
  horario_fim?: string
  periodo_tipo?: string
  time_slot?: "manha" | "tarde" | "integral"
}

interface Profile extends User {}

export default function DashboardPage() {
  const [user, setUser] = useState<Profile | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showDayView, setShowDayView] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [user, currentMonth])

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }

      setUser(currentUser)
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const loadTasks = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("tasks").select("*").order("start_date", { ascending: true })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error)
      setError("Erro ao carregar tarefas")
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId)

      if (error) throw error

      setTasks((prev) => prev.filter((task) => task.id !== taskId))
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error)
      setError("Erro ao excluir tarefa")
    }
  }

  const handleCreateTask = async (taskData: {
    title: string
    client_name: string
    description: string
    consultant_id: string
    data?: Date
    horario_inicio?: string
    horario_fim?: string
    periodo_tipo?: string
  }) => {
    try {
      const insertData = {
        title: taskData.title,
        client_name: taskData.client_name,
        description: taskData.description,
        consultant_id: user!.id,
        data: taskData.data?.toISOString(),
        horario_inicio: taskData.horario_inicio,
        horario_fim: taskData.horario_fim,
        periodo_tipo: taskData.periodo_tipo,
        start_date: taskData.data?.toISOString() || new Date().toISOString(),
        end_date: taskData.data?.toISOString() || new Date().toISOString(),
        time_slot:
          taskData.periodo_tipo === "integral"
            ? "integral"
            : taskData.periodo_tipo === "manha"
              ? "manha"
              : taskData.periodo_tipo === "tarde"
                ? "tarde"
                : "integral",
      }

      const { data, error } = await supabase.from("tasks").insert([insertData]).select().single()

      if (error) throw error

      setTasks((prev) => [...prev, data])
      setError("")
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
      setError("Erro ao criar tarefa")
      throw error
    }
  }

  const handleDayClick = (date: Date) => {
    console.log("Dia clicado:", date)
    setSelectedDate(date)
    setShowDayView(true)
  }

  const getTasksForSelectedDay = () => {
    if (!selectedDate) return []

    return tasks.filter((task) => {
      if (task.data) {
        const taskDate = parseISO(task.data)
        return isSameDay(taskDate, selectedDate)
      } else if (task.start_date) {
        const taskStart = parseISO(task.start_date)
        return isSameDay(taskStart, selectedDate)
      }
      return false
    })
  }

  const handleEditTask = (task: Task) => {
    console.log("Editando tarefa:", task)
    alert("Funcionalidade de edição será implementada em breve")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Header 
       userName={user.name}
       userRole={user.role}
       currentUser={user}
       consultants={[]} // ou uma lista real de consultores
       selectedConsultant={null} // ou o consultor selecionado
       onConsultantChange={() => {}} // ou uma função real de callback

       />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <GanttChart
          tasks={tasks}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onCreateTask={() => setShowCreateForm(true)}
          onDayClick={handleDayClick}
          userRole={user.role}
        />

        <CreateTaskForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateTask}
          userRole={user.role}
          currentUserId={user.id}
        />

        <DayView
          isOpen={showDayView}
          onClose={() => setShowDayView(false)}
          selectedDate={selectedDate}
          tasks={getTasksForSelectedDay()}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          userRole={user.role}
        />
      </main>
    </div>
  )
}
