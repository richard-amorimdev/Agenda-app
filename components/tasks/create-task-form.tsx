"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DateTimeSelector } from "./date-time-selector"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface DateTimeData {
  data: Date
  horarioInicio: string
  horarioFim: string
  periodoTipo: "personalizado" | "integral" | "manha" | "tarde"
}

interface CreateTaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: {
    title: string
    client_name: string
    description: string
    consultant_id: string
    data?: Date
    horario_inicio?: string
    horario_fim?: string
    periodo_tipo?: string
  }) => void
  userRole: "admin" | "consultor"
  currentUserId: string
}

export default function CreateTaskForm({ isOpen, onClose, onSubmit, userRole, currentUserId }: CreateTaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    client_name: "",
    description: "",
    consultant_id: currentUserId, // Sempre usa o usuário atual
  })
  const [loading, setLoading] = useState(false)

  const [isDateTimeSelectorOpen, setIsDateTimeSelectorOpen] = useState(false)
  const [selectedDateTime, setSelectedDateTime] = useState<DateTimeData | null>(null)

  const handleDateTimeConfirm = (dateTime: DateTimeData) => {
    console.log("Data/período confirmado:", dateTime)
    setSelectedDateTime(dateTime)
    setIsDateTimeSelectorOpen(false)
  }

  const handleRemoveDateTime = () => {
    setSelectedDateTime(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.client_name) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setLoading(true)

    try {
      await onSubmit({
        ...formData,
        data: selectedDateTime?.data,
        horario_inicio: selectedDateTime?.horarioInicio,
        horario_fim: selectedDateTime?.horarioFim,
        periodo_tipo: selectedDateTime?.periodoTipo,
      })

      // Limpa o formulário após sucesso
      setFormData({
        title: "",
        client_name: "",
        description: "",
        consultant_id: currentUserId,
      })
      setSelectedDateTime(null)
      onClose()
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Tarefa</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo de título */}
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Consultoria técnica"
                required
              />
            </div>

            {/* Campo de cliente */}
            <div>
              <Label htmlFor="client_name">Cliente *</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="Nome do cliente"
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Data e Período</Label>

              {!selectedDateTime ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-transparent"
                  onClick={() => setIsDateTimeSelectorOpen(true)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Definir Data e Período
                </Button>
              ) : (
                <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="font-medium">
                        {format(selectedDateTime.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {selectedDateTime.horarioInicio} - {selectedDateTime.horarioFim}
                        {selectedDateTime.periodoTipo !== "personalizado" && ` (${selectedDateTime.periodoTipo})`}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsDateTimeSelectorOpen(true)}>
                      Alterar
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={handleRemoveDateTime}>
                      Remover
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Campo de descrição */}
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes da tarefa..."
                rows={3}
              />
            </div>

            {/* Botões de ação */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Criando..." : "Criar Tarefa"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DateTimeSelector
        isOpen={isDateTimeSelectorOpen}
        onClose={() => setIsDateTimeSelectorOpen(false)}
        onConfirm={handleDateTimeConfirm}
      />
    </>
  )
}
