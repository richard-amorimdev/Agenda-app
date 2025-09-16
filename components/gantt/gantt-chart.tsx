"use client"

import { useMemo } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, isWithinInterval } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Edit, Trash2, Plus, Clock } from "lucide-react"

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
  consultant_name?: string
}

interface GanttChartProps {
  tasks: Task[]
  currentMonth: Date
  onMonthChange: (date: Date) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onCreateTask: () => void
  onDayClick?: (date: Date) => void
  userRole: "admin" | "consultor"
}

export default function GanttChart({
  tasks,
  currentMonth,
  onMonthChange,
  onEditTask,
  onDeleteTask,
  onCreateTask,
  onDayClick,
  userRole,
}: GanttChartProps) {
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (task.data) {
        const taskDate = parseISO(task.data)
        return isWithinInterval(taskDate, { start: monthStart, end: monthEnd })
      } else if (task.start_date && task.end_date) {
        const taskStart = parseISO(task.start_date)
        const taskEnd = parseISO(task.end_date)
        return (
          isWithinInterval(taskStart, { start: monthStart, end: monthEnd }) ||
          isWithinInterval(taskEnd, { start: monthStart, end: monthEnd }) ||
          (taskStart <= monthStart && taskEnd >= monthEnd)
        )
      }
      return false
    })
  }, [tasks, monthStart, monthEnd])

  const getTasksForDay = (day: Date) => {
    return filteredTasks
      .filter((task) => {
        if (task.data) {
          const taskDate = parseISO(task.data)
          return isSameDay(taskDate, day)
        } else if (task.start_date && task.end_date) {
          const taskStart = parseISO(task.start_date)
          const taskEnd = parseISO(task.end_date)
          return isSameDay(taskStart, day) || isSameDay(taskEnd, day) || (day > taskStart && day < taskEnd)
        }
        return false
      })
      .sort((a, b) => {
        if (a.horario_inicio && b.horario_inicio) {
          return a.horario_inicio.localeCompare(b.horario_inicio)
        }
        const order = { integral: 1, manha: 2, tarde: 3 }
        const aSlot = a.time_slot || "integral"
        const bSlot = b.time_slot || "integral"
        return order[aSlot] - order[bSlot]
      })
  }

  const getTaskPosition = (task: Task, day: Date) => {
    if (task.data) {
      return "single"
    }
    if (task.start_date && task.end_date) {
      const taskStart = parseISO(task.start_date)
      const taskEnd = parseISO(task.end_date)
      if (isSameDay(taskStart, day) && isSameDay(taskEnd, day)) return "single"
      if (isSameDay(taskStart, day)) return "start"
      if (isSameDay(taskEnd, day)) return "end"
      return "middle"
    }
    return "single"
  }

  const previousMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() - 1)
    onMonthChange(newDate)
  }

  const nextMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + 1)
    onMonthChange(newDate)
  }

  const getTimeSlotLabel = (task: Task) => {
    if (task.horario_inicio && task.horario_fim) {
      return `${task.horario_inicio} - ${task.horario_fim}`
    }
    if (task.time_slot) {
      switch (task.time_slot) {
        case "manha":
          return "Manhã"
        case "tarde":
          return "Tarde"
        case "integral":
          return "Integral"
        default:
          return ""
      }
    }
    return ""
  }

  return (
    <Card className="w-full border-black">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Agenda - {format(currentMonth, "MMMM yyyy", { locale: ptBR })}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm" onClick={onCreateTask} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div key={day} className="p-2 text-center font-semibold text-sm rounded border-black bg-cyan-700">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const dayTasks = getTasksForDay(day)
                const isToday = isSameDay(day, new Date())

                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-colors ${
                      isToday
                        ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => onDayClick?.(day)}
                  >
                    <div className={`text-sm font-medium mb-2 ${isToday ? "text-blue-600" : "text-gray-700"}`}>
                      {format(day, "d")}
                    </div>

                    <div className="space-y-1">
                      {dayTasks.map((task) => {
                        const position = getTaskPosition(task, day)

                        return (
                          <div
                            key={`${task.id}-${day.toISOString()}`}
                            className={`group relative p-2 text-xs rounded cursor-pointer transition-all hover:shadow-md 
                              ${position === "start" ? "rounded-l" : ""}
                              ${position === "end" ? "rounded-r" : ""}
                              ${position === "single" ? "rounded" : ""}
                              ${position === "middle" ? "rounded-none" : ""}
                              bg-blue-500 text-white
                            `}
                            title={`${task.title} - ${task.client_name} (${getTimeSlotLabel(task)})`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{task.title}</div>
                                <div className="text-blue-100 truncate">{task.client_name}</div>
                                <div className="text-blue-200 text-xs flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {getTimeSlotLabel(task)}
                                </div>
                              </div>

                              {(position === "start" || position === "single") && (
                                <div className="opacity-0 group-hover:opacity-100 flex gap-1 ml-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-white hover:bg-blue-600"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onEditTask(task)
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-white hover:bg-red-600"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onDeleteTask(task.id)
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
