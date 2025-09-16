"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Interface para definir os dados de data e período selecionados
interface DateTimeData {
  data: Date
  horarioInicio: string
  horarioFim: string
  periodoTipo: "personalizado" | "integral" | "manha" | "tarde"
}

// Props do componente de seleção de data/período
interface DateTimeSelectorProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (dateTime: DateTimeData) => void
}

// Opções pré-definidas de períodos
const PERIODOS_PREDEFINIDOS = {
  integral: { inicio: "08:00", fim: "18:00", label: "Integral (08:00 - 18:00)" },
  manha: { inicio: "08:00", fim: "12:00", label: "Manhã (08:00 - 12:00)" },
  tarde: { inicio: "13:00", fim: "18:00", label: "Tarde (13:00 - 18:00)" },
}

export function DateTimeSelector({ isOpen, onClose, onConfirm }: DateTimeSelectorProps) {
  // Estados para controlar o fluxo sequencial
  const [etapaAtual, setEtapaAtual] = useState<"data" | "periodo">("data")

  // Estados para armazenar os dados selecionados
  const [dataSelecionada, setDataSelecionada] = useState<Date>()
  const [periodoTipo, setPeriodoTipo] = useState<"personalizado" | "integral" | "manha" | "tarde">("integral")
  const [horarioInicio, setHorarioInicio] = useState("08:00")
  const [horarioFim, setHorarioFim] = useState("18:00")

  // Função para lidar com a seleção de data
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      console.log("Data selecionada:", date)
      setDataSelecionada(date)
      setEtapaAtual("periodo")
    }
  }

  // Função para lidar com a mudança de tipo de período
  const handlePeriodoChange = (tipo: "personalizado" | "integral" | "manha" | "tarde") => {
    console.log("Período selecionado:", tipo)
    setPeriodoTipo(tipo)

    if (tipo !== "personalizado") {
      const periodo = PERIODOS_PREDEFINIDOS[tipo]
      setHorarioInicio(periodo.inicio)
      setHorarioFim(periodo.fim)
    }
  }

  // Função para confirmar a seleção completa
  const handleConfirm = () => {
    if (!dataSelecionada) return

    const dateTimeData: DateTimeData = {
      data: dataSelecionada,
      horarioInicio,
      horarioFim,
      periodoTipo,
    }

    console.log("Confirmando data/período:", dateTimeData)
    onConfirm(dateTimeData)
    handleClose()
  }

  // Função para fechar e resetar o componente
  const handleClose = () => {
    setEtapaAtual("data")
    setDataSelecionada(undefined)
    setPeriodoTipo("integral")
    setHorarioInicio("08:00")
    setHorarioFim("18:00")
    onClose()
  }

  // Função para voltar à etapa anterior
  const handleVoltar = () => {
    if (etapaAtual === "periodo") {
      setEtapaAtual("data")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {etapaAtual === "data" ? (
              <>
                <CalendarIcon className="h-5 w-5" />
                Selecionar Data
              </>
            ) : (
              <>
                <Clock className="h-5 w-5" />
                Definir Período
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Etapa 1: Seleção de Data */}
          {etapaAtual === "data" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Escolha a data para a tarefa:</p>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={dataSelecionada}
                  onSelect={handleDateSelect}
                  locale={ptBR}
                  className="rounded-md border"
                />
              </div>
            </div>
          )}

          {/* Etapa 2: Seleção de Período */}
          {etapaAtual === "periodo" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Data selecionada:{" "}
                  <strong>
                    {dataSelecionada && format(dataSelecionada, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </strong>
                </p>
                <Button variant="outline" size="sm" onClick={handleVoltar}>
                  Alterar Data
                </Button>
              </div>

              <div className="space-y-3">
                <Label>Tipo de Período</Label>
                <Select value={periodoTipo} onValueChange={handlePeriodoChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="integral">Integral (08:00 - 18:00)</SelectItem>
                    <SelectItem value="manha">Manhã (08:00 - 12:00)</SelectItem>
                    <SelectItem value="tarde">Tarde (13:30 - 18:00)</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Campos de horário personalizado */}
              {periodoTipo === "personalizado" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horario-inicio">Horário Início</Label>
                    <Input
                      id="horario-inicio"
                      type="time"
                      value={horarioInicio}
                      onChange={(e) => setHorarioInicio(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horario-fim">Horário Fim</Label>
                    <Input
                      id="horario-fim"
                      type="time"
                      value={horarioFim}
                      onChange={(e) => setHorarioFim(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirm}>Confirmar Data/Período</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
