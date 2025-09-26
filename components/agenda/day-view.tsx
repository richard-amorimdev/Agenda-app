"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Edit, Trash2 } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string | null
  client_name: string
  consultant_id: string
  data?: string
  horario_inicio?: string
  horario_fim?: string
  periodo_tipo?: string
  consultant_name?: string
}

interface DayViewProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date | null
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

export function DayView({ isOpen, onClose, selectedDate, tasks, onEditTask, onDeleteTask }: DayViewProps) {
  if (!selectedDate) return null

  const formatTaskPeriod = (task: Task) => {
    if (task.horario_inicio && task.horario_fim) {
      return `${task.horario_inicio} - ${task.horario_fim}`
    }
    return "Horário não definido"
  }

  const getPeriodBadgeVariant = (task: Task) => {
    if (!task.horario_inicio) return "secondary"

    const hora = Number.parseInt(task.horario_inicio.split(":")[0])
    if (hora < 12) return "default"
    if (hora < 18) return "secondary"
    return "outline"
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.horario_inicio && b.horario_inicio) {
      return a.horario_inicio.localeCompare(b.horario_inicio)
    }
    return 0
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              Agenda do dia {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">
                {sortedTasks.length} {sortedTasks.length === 1 ? "tarefa agendada" : "tarefas agendadas"}
              </span>
            </div>
            <Badge variant="outline">{format(selectedDate, "EEEE", { locale: ptBR })}</Badge>
          </div>

          {sortedTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhuma tarefa agendada</p>
              <p className="text-sm">Este dia está livre na agenda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-semibold text-lg">{task.title}</h3>
                          <p className="text-muted-foreground">Cliente: {task.client_name}</p>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Badge variant={getPeriodBadgeVariant(task)}>{formatTaskPeriod(task)}</Badge>
                          </div>
                        </div>

                        {task.description && (
                          <div className="flex items-start gap-1">
                            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1 ml-4">
                        <Button variant="ghost" size="sm" onClick={() => onEditTask(task)} className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
                              onDeleteTask(task.id)
                            }
                          }}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {sortedTasks.length > 0 && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Primeira tarefa: {sortedTasks[0]?.horario_inicio || "Não definido"}</span>
                <span>Última tarefa: {sortedTasks[sortedTasks.length - 1]?.horario_fim || "Não definido"}</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
