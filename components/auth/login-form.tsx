"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { signIn } from "@/lib/auth"
import Link from "next/link"
import { toast } from "sonner"
import { User, Lock, Eye, EyeOff, Calendar } from "lucide-react"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberLogin, setRememberLogin] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const router = useRouter()

  useEffect(() => {
    const savedCredentials = localStorage.getItem("loginCredentials")
    if (savedCredentials) {
      const { username: savedUsername, password: savedPassword } = JSON.parse(savedCredentials)
      setUsername(savedUsername || "")
      setPassword(savedPassword || "")
      setRememberLogin(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("Tentando login para:", username)

    const { user, error: signInError } = await signIn(username, password)

    if (signInError) {
      console.log("Erro no login:", signInError)
      setError(signInError)
      setLoading(false)
      return
    }


    if (user) {
      console.log("Login bem-sucedido para:", user.username)

      if (rememberLogin) {
        localStorage.setItem(
          "loginCredentials",
          JSON.stringify({
            username,
            password,
          }),
        )
      } else {
        localStorage.removeItem("loginCredentials")
      }

      // Redireciona para a origem, se houver, ou para o dashboard
      const from = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("from") : null
      router.push(from || "/dashboard")
      // Exibe uma notificação de sucesso após o login.
      toast.success("Login efetuado com sucesso")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Un. Meltec</h1>
          <p className="text-blue-200 text-sm">Sistema de Agendamentos</p>
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
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === "login" ? "bg-blue-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
                }`}
              >
                Entrar
              </button>
              <Link href="/register" className="flex-1">
                <button
                  type="button"
                  className="w-full py-2 px-4 rounded-md text-sm font-medium text-slate-300 hover:text-white transition-all"
                >
                  Cadastrar
                </button>
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-900/50 border-red-700 text-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-slate-200">
                  Nome de Usuário
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ex: Richard"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-200">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
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
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberLogin}
                  onCheckedChange={(checked) => setRememberLogin(checked as boolean)}
                  className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="remember" className="text-sm text-slate-300 cursor-pointer">
                  Lembrar meus dados de login
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-xs text-slate-400">
                Esqueceu sua senha? Entre em contato com o administrador do sistema.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}