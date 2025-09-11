"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { signIn, signUp, signOut, getCurrentUser, validateUsername, validatePassword } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { CheckCircle, XCircle, AlertCircle, Play, Database, RefreshCw } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
  details?: string
}

export default function SystemTest() {
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)
  const [setupMode, setSetupMode] = useState(false)

  const addResult = (result: TestResult) => {
    setResults((prev) => [...prev, result])
  }

  const clearResults = () => {
    setResults([])
  }

  const checkDatabaseSetup = async () => {
    setSetupMode(true)
    clearResults()

    // Verificar conexão com Supabase
    try {
      const { data, error } = await supabase.from("users").select("count").limit(1)
      if (error) {
        if (error.message.includes('relation "public.users" does not exist')) {
          addResult({
            name: "Verificação do Banco",
            status: "error",
            message: "Tabelas não encontradas",
            details: "Execute os scripts SQL na ordem: 01-create-tables.sql, depois 02-seed-data.sql",
          })
        } else {
          addResult({
            name: "Verificação do Banco",
            status: "error",
            message: "Erro de conexão",
            details: error.message,
          })
        }
      } else {
        addResult({
          name: "Verificação do Banco",
          status: "success",
          message: "Tabelas encontradas",
          details: "Banco configurado corretamente",
        })
      }
    } catch (error) {
      addResult({
        name: "Verificação do Banco",
        status: "error",
        message: "Erro na verificação",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      })
    }

    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      addResult({
        name: "Variáveis de Ambiente",
        status: "error",
        message: "Variáveis não configuradas",
        details: "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY",
      })
    } else {
      addResult({
        name: "Variáveis de Ambiente",
        status: "success",
        message: "Configuradas corretamente",
      })
    }

    setSetupMode(false)
  }

  const runAllTests = async () => {
    setTesting(true)
    clearResults()

    // Primeiro verificar se as tabelas existem
    try {
      const { data, error } = await supabase.from("users").select("count").limit(1)
      if (error) {
        if (error.message.includes('relation "public.users" does not exist')) {
          addResult({
            name: "Pré-requisito: Tabelas",
            status: "error",
            message: "Tabelas não encontradas",
            details: "Execute primeiro os scripts SQL: 01-create-tables.sql e 02-seed-data.sql",
          })
          setTesting(false)
          return
        }
      }
    } catch (error) {
      addResult({
        name: "Pré-requisito: Conexão",
        status: "error",
        message: "Falha na conexão",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      })
      setTesting(false)
      return
    }

    // Teste 1: Conexão com Supabase
    try {
      const { data: users } = await supabase.from("users").select("*").limit(5)
      const { data: tasks } = await supabase.from("tasks").select("*").limit(5)

      addResult({
        name: "Conexão Supabase",
        status: "success",
        message: "Conectado com sucesso",
        details: `Usuários: ${users?.length || 0}, Tarefas: ${tasks?.length || 0}`,
      })
    } catch (error) {
      addResult({
        name: "Conexão Supabase",
        status: "error",
        message: "Falha na conexão",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      })
    }

    // Teste 2: Validação de Username
    const usernameTests = [
      { input: "admin", expected: false, reason: "palavra reservada" },
      { input: "test.user", expected: true, reason: "formato válido" },
      { input: "ab", expected: false, reason: "muito curto" },
      { input: "user@invalid", expected: false, reason: "caractere inválido" },
      { input: "valid_user123", expected: true, reason: "formato válido" },
    ]

    for (const test of usernameTests) {
      const result = validateUsername(test.input)
      const success = result.isValid === test.expected
      addResult({
        name: `Username: "${test.input}"`,
        status: success ? "success" : "error",
        message: success ? `✓ ${test.reason}` : `✗ Esperado: ${test.reason}`,
        details: result.message,
      })
    }

    // Teste 3: Validação de Senha
    const passwordTests = [
      { input: "123", expected: false, reason: "muito curta" },
      { input: "senha123", expected: false, reason: "sem caractere especial" },
      { input: "senha@123", expected: true, reason: "formato válido" },
      { input: "admin!", expected: true, reason: "formato válido" },
      { input: "MySecurePass@1", expected: true, reason: "formato válido" },
    ]

    for (const test of passwordTests) {
      const result = validatePassword(test.input)
      const success = result.isValid === test.expected
      addResult({
        name: `Senha: "${test.input}"`,
        status: success ? "success" : "error",
        message: success ? `✓ ${test.reason}` : `✗ Esperado: ${test.reason}`,
        details: result.message,
      })
    }

    // Teste 4: Login com credenciais válidas (novo admin)
    try {
      const loginResult = await signIn("myadmin", "MySecurePass@1")
      if (loginResult.user) {
        addResult({
          name: "Login Admin (Novo)",
          status: "success",
          message: "Login realizado com sucesso",
          details: `Usuário: ${loginResult.user.name} (${loginResult.user.role})`,
        })
        signOut() // Limpar sessão
      } else {
        addResult({
          name: "Login Admin (Novo)",
          status: "error",
          message: "Falha no login",
          details: loginResult.error,
        })
      }
    } catch (error) {
      addResult({
        name: "Login Admin (Novo)",
        status: "error",
        message: "Erro no login",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      })
    }

    // Teste 5: Login com credenciais inválidas
    try {
      const loginResult = await signIn("myadmin", "senha_errada")
      if (loginResult.error) {
        addResult({
          name: "Login Inválido",
          status: "success",
          message: "Erro detectado corretamente",
          details: loginResult.error,
        })
      } else {
        addResult({
          name: "Login Inválido",
          status: "error",
          message: "Deveria ter falhado",
        })
      }
    } catch (error) {
      addResult({
        name: "Login Inválido",
        status: "warning",
        message: "Erro inesperado",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      })
    }

    // Teste 6: Login do consultor
    try {
      const loginResult = await signIn("richard", "Central@26")
      if (loginResult.user) {
        addResult({
          name: "Login Consultor",
          status: "success",
          message: "Login realizado com sucesso",
          details: `Usuário: ${loginResult.user.name} (${loginResult.user.role})`,
        })
        signOut()
      } else {
        addResult({
          name: "Login Consultor",
          status: "error",
          message: "Falha no login",
          details: loginResult.error,
        })
      }
    } catch (error) {
      addResult({
        name: "Login Consultor",
        status: "error",
        message: "Erro no login",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      })
    }

    // Teste 7: Cadastro de usuário
    const testUsername = `test_user_${Date.now()}`
    try {
      const signupResult = await signUp({
        username: testUsername,
        password: "test@123",
        name: "Usuário de Teste",
        role: "consultor",
      })

      if (signupResult.user) {
        addResult({
          name: "Cadastro de Usuário",
          status: "success",
          message: "Usuário criado com sucesso",
          details: `Username: ${signupResult.user.username}`,
        })

        // Limpar usuário de teste
        try {
          await supabase.from("users").delete().eq("username", testUsername)
        } catch (cleanupError) {
          console.warn("Erro ao limpar usuário de teste:", cleanupError)
        }
      } else {
        addResult({
          name: "Cadastro de Usuário",
          status: "error",
          message: "Falha no cadastro",
          details: signupResult.error,
        })
      }
    } catch (error) {
      addResult({
        name: "Cadastro de Usuário",
        status: "error",
        message: "Erro no cadastro",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      })
    }

    // Teste 8: Gerenciamento de sessão
    try {
      const loginResult = await signIn("myadmin", "MySecurePass@1") // Usar o novo admin para testar sessão
      if (loginResult.user) {
        const currentUser = getCurrentUser()
        if (currentUser && currentUser.id === loginResult.user.id) {
          addResult({
            name: "Gerenciamento de Sessão",
            status: "success",
            message: "Sessão funcionando corretamente",
          })
        } else {
          addResult({
            name: "Gerenciamento de Sessão",
            status: "error",
            message: "Problema na sessão",
          })
        }
        signOut()
      } else {
        addResult({
          name: "Gerenciamento de Sessão",
          status: "error",
          message: "Falha no login para teste de sessão",
          details: loginResult.error,
        })
      }
    } catch (error) {
      addResult({
        name: "Gerenciamento de Sessão",
        status: "error",
        message: "Erro no teste de sessão",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      })
    }

    setTesting(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Sucesso</Badge>
      case "error":
        return <Badge variant="destructive">Erro</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Aviso</Badge>
    }
  }

  const successCount = results.filter((r) => r.status === "success").length
  const errorCount = results.filter((r) => r.status === "error").length
  const warningCount = results.filter((r) => r.status === "warning").length

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Teste do Sistema de Agendamento
          </CardTitle>
          <CardDescription>Execute testes completos para validar todas as funcionalidades do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Pré-requisitos:</strong> Certifique-se de que executou os scripts SQL na ordem correta:
                <br />
                1. <code>scripts/01-create-tables.sql</code>
                <br />
                2. <code>scripts/02-seed-data.sql</code>
              </AlertDescription>
            </Alert>

            <div className="flex gap-4 flex-wrap">
              <Button onClick={checkDatabaseSetup} disabled={setupMode || testing} variant="outline">
                {setupMode ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Verificando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Verificar Configuração
                  </div>
                )}
              </Button>

              <Button onClick={runAllTests} disabled={testing || setupMode} className="flex items-center gap-2">
                {testing ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Executando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Executar Todos os Testes
                  </div>
                )}
              </Button>

              <Button variant="outline" onClick={clearResults} disabled={testing || setupMode}>
                Limpar Resultados
              </Button>
            </div>

            {results.length > 0 && (
              <div className="flex gap-4 flex-wrap">
                <Badge className="bg-green-100 text-green-800">Sucessos: {successCount}</Badge>
                <Badge variant="destructive">Erros: {errorCount}</Badge>
                <Badge className="bg-yellow-100 text-yellow-800">Avisos: {warningCount}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados dos Testes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <Alert key={index} className={result.status === "error" ? "border-red-200" : ""}>
                  <div className="flex items-start gap-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{result.name}</h4>
                        {getStatusBadge(result.status)}
                      </div>
                      <AlertDescription className="text-sm">{result.message}</AlertDescription>
                      {result.details && (
                        <AlertDescription className="text-xs text-gray-600 mt-1 font-mono bg-gray-50 p-2 rounded">
                          {result.details}
                        </AlertDescription>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Instruções de Configuração</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">1. Configurar Supabase:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Crie um projeto no Supabase</li>
                <li>Configure as variáveis de ambiente (.env.local)</li>
                <li>Execute os scripts SQL na ordem correta</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Contas de Teste:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>
                  Admin: username=<code>myadmin</code> / senha=<code>MySecurePass@1</code>
                </li>
                <li>
                  Consultor: username=<code>richard</code> / senha=<code>Central@26</code>
                </li> 
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Funcionalidades:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Login/Logout com validação</li>
                <li>Cadastro de novos usuários</li>
                <li>Dashboard com visualização Gantt</li>
                <li>CRUD de tarefas</li>
                <li>Alteração de senhas (admin)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
