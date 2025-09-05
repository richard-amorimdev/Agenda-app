"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signUp, validatePassword, validateUsername } from "@/lib/auth"
import Link from "next/link"
import { Eye, EyeOff, User, Lock, Mail, Calendar } from "lucide-react"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("register")
  const router = useRouter()

  const validateForm = () => {
    const errors: string[] = []

    if (!formData.name.trim()) {
      errors.push("Nome completo é obrigatório")
    }

    const usernameValidation = validateUsername(formData.username)
    if (!usernameValidation.isValid && usernameValidation.message) {
      errors.push(usernameValidation.message)
    }

    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid && passwordValidation.message) {
      errors.push(passwordValidation.message)
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push("As senhas não coincidem")
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setPasswordErrors([])

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setPasswordErrors(validationErrors)
      setLoading(false)
      return
    }

    const { user, error: signUpError } = await signUp({
      username: formData.username.toLowerCase().trim(),
      password: formData.password,
      name: formData.name.trim(),
      role: "consultor",
    })

    if (signUpError) {
      setError(signUpError)
      setLoading(false)
      return
    }

    if (user) {
      router.push("/dashboard")
    }

    setLoading(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Limpar erros quando o usuário começar a digitar
    if (passwordErrors.length > 0) {
      setPasswordErrors([])
    }
    if (error) {
      setError("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Un. Meltec</h1>
          <p className="text-emerald-200 text-sm">Sistema de Agendamentos</p>
        </div>

        {/* Card Principal */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-white">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-slate-300">Entre com sua conta ou crie uma nova</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Toggle Buttons */}
            <div className="flex bg-slate-700/50 rounded-lg p-1">
              <Link href="/login" className="flex-1">
                <button
                  type="button"
                  className="w-full py-2 px-4 rounded-md text-sm font-medium text-slate-300 hover:text-white transition-all"
                >
                  Entrar
                </button>
              </Link>
              <button
                type="button"
                onClick={() => setActiveTab("register")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === "register" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
                }`}
              >
                Cadastrar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-900/50 border-red-700 text-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {passwordErrors.length > 0 && (
                <Alert variant="destructive" className="bg-red-900/50 border-red-700 text-red-200">
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {passwordErrors.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-200">
                  Nome Completo *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="João Silva Santos"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-slate-200">
                  Nome de Usuário *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="joao.silva"
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
                <p className="text-xs text-slate-400">3-20 caracteres, apenas letras, números, pontos e underscores</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-200">
                  Senha *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite uma senha segura"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-400">Mínimo 5 caracteres com pelo menos 1 caractere especial</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-200">
                  Confirmar Senha *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Criando conta...
                  </div>
                ) : (
                  "Criar Conta"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-xs text-slate-400">Ao criar uma conta, você concorda com nossos termos de uso.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
