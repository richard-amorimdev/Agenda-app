// Helpers de sessão via cookie (lado do cliente)
function setSessionCookie(user: User) {
  if (typeof document === "undefined") return
  const value = encodeURIComponent(JSON.stringify(user))
  // 7 dias; ajuste conforme sua política
  document.cookie = `session_token=${value}; Path=/; Max-Age=604800; SameSite=Lax`
}

function getSessionFromCookie(): User | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/(?:^|;)\s*session_token=([^;]+)/)
  if (!match) return null
  try {
    return JSON.parse(decodeURIComponent(match[1])) as User
  } catch {
    return null
  }
}

function clearSessionCookie() {
  if (typeof document === "undefined") return
  document.cookie = "session_token=; Path=/; Max-Age=0; SameSite=Lax"
}
import { supabase } from "./supabase"

export interface User {
  id: string
  username: string
  name: string
  role: "admin" | "consultor"
}

export interface AuthResponse {
  user?: User
  error?: string
}

// Hash simples para desenvolvimento (substitua por bcrypt em produção)
async function simpleHash(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "salt_key_2024")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// Verificar senha com hash simples
async function verifySimpleHash(password: string, hash: string): Promise<boolean> {
  const passwordHash = await simpleHash(password)
  return passwordHash === hash
}

// Validar nome de usuário
export function validateUsername(username: string): { isValid: boolean; message?: string } {
  if (!username || username.trim().length === 0) {
    return { isValid: false, message: "Nome de usuário é obrigatório" }
  }

  const cleanUsername = username.trim().toLowerCase()

  if (cleanUsername.length < 3) {
    return { isValid: false, message: "Nome de usuário deve ter pelo menos 3 caracteres" }
  }

  if (cleanUsername.length > 20) {
    return { isValid: false, message: "Nome de usuário deve ter no máximo 20 caracteres" }
  }

  const validUsernameRegex = /^[a-zA-Z0-9._]+$/
  if (!validUsernameRegex.test(cleanUsername)) {
    return { isValid: false, message: "Nome de usuário pode conter apenas letras, números, pontos e underscores" }
  }

  if (cleanUsername.startsWith(".") || cleanUsername.endsWith(".")) {
    return { isValid: false, message: "Nome de usuário não pode começar ou terminar com ponto" }
  }

  if (cleanUsername.includes("..")) {
    return { isValid: false, message: "Nome de usuário não pode conter pontos consecutivos" }
  }

  // Verificar palavras reservadas
  const reservedWords = ["admin", "administrator", "administrador", "root", "system", "null", "undefined"]
  if (reservedWords.includes(cleanUsername)) {
    return { isValid: false, message: "Este nome de usuário não está disponível" }
  }

  return { isValid: true }
}

// Validar força da senha
export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (!password || password.length === 0) {
    return { isValid: false, message: "Senha é obrigatória" }
  }

  if (password.length < 5) {
    return { isValid: false, message: "A senha deve ter pelo menos 5 caracteres" }
  }

  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  if (!hasSpecialChar) {
    return { isValid: false, message: "A senha deve conter pelo menos um caractere especial" }
  }

  return { isValid: true }
}

// Login customizado
export async function signIn(username: string, password: string): Promise<AuthResponse> {
  try {
    if (!username || !password) {
      return { error: "Nome de usuário e senha são obrigatórios" }
    }

    console.log("Tentando login para:", username)

    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username.trim().toLowerCase())

    if (error) {
      console.error("Erro ao buscar usuário:", error)
      return { error: "Erro ao conectar com o banco de dados" }
    }

    if (!users || users.length === 0) {
      console.log("Usuário não encontrado:", username)
      return { error: "Usuário não encontrado" }
    }

    const user = users[0]

    const isValidPassword = await verifySimpleHash(password, user.password_hash)
    if (!isValidPassword) {
      console.log("Senha incorreta para usuário:", username)
      return { error: "Senha incorreta" }
    }

    const sessionUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    }

    // Guarda sessão em cookie (origem de verdade para o middleware)
    setSessionCookie(sessionUser)

    // (Opcional) manter no localStorage para leituras client-side legadas
    localStorage.setItem("user_session", JSON.stringify(sessionUser))

    console.log("Login realizado com sucesso:", sessionUser)
    return { user: sessionUser }
  } catch (error) {
    console.error("Erro no login:", error)
    return { error: "Erro interno do servidor" }
  }
}

// Registrar novo usuário
export async function signUp(userData: {
  username: string
  password: string
  name: string
  role?: "admin" | "consultor"
}): Promise<AuthResponse> {
  try {
    console.log("Iniciando cadastro para:", userData.username)

    if (!userData.name || userData.name.trim().length === 0) {
      return { error: "Nome completo é obrigatório" }
    }

    if (userData.name.trim().length < 2) {
      return { error: "Nome deve ter pelo menos 2 caracteres" }
    }

    const usernameValidation = validateUsername(userData.username)
    if (!usernameValidation.isValid) {
      return { error: usernameValidation.message }
    }

    const passwordValidation = validatePassword(userData.password)
    if (!passwordValidation.isValid) {
      return { error: passwordValidation.message }
    }

    const cleanUsername = userData.username.trim().toLowerCase()

    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("username")
      .eq("username", cleanUsername)

    if (checkError) {
      console.error("Erro ao verificar usuário existente:", checkError)
      return { error: "Erro ao verificar disponibilidade do usuário" }
    }

    if (existingUsers && existingUsers.length > 0) {
      return { error: "Nome de usuário já existe" }
    }

    const passwordHash = await simpleHash(userData.password)

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          username: cleanUsername,
          password_hash: passwordHash,
          name: userData.name.trim(),
          role: userData.role || "consultor",
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error("Erro ao inserir usuário:", insertError)
      return { error: "Erro ao criar usuário. Tente novamente." }
    }

    const sessionUser = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      role: newUser.role,
    }

    console.log("Usuário criado com sucesso:", sessionUser)
    return { user: sessionUser }
  } catch (error) {
    console.error("Erro no cadastro:", error)
    return { error: "Erro interno do servidor" }
  }
}

// Logout
export function signOut(): void {
  clearSessionCookie()
  localStorage.removeItem("user_session")
  console.log("Logout realizado")
}

// Obter usuário atual
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  // Cookie é a fonte de verdade
  const cookieUser = getSessionFromCookie()
  if (cookieUser) return cookieUser

  // Fallback antigo
  const sessionData = localStorage.getItem("user_session")
  if (!sessionData) return null
  try {
    return JSON.parse(sessionData) as User
  } catch {
    return null
  }
}

// Alterar senha (apenas admin)
export async function changeUserPassword(
  userId: string,
  newPassword: string,
  currentUser: User,
): Promise<{ success: boolean; error?: string }> {
  if (currentUser.role !== "admin") {
    return { success: false, error: "Apenas administradores podem alterar senhas" }
  }

  const passwordValidation = validatePassword(newPassword)
  if (!passwordValidation.isValid) {
    return { success: false, error: passwordValidation.message }
  }

  try {
    const passwordHash = await simpleHash(newPassword)

    const { error } = await supabase
      .from("users")
      .update({
        password_hash: passwordHash,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Erro ao alterar senha:", error)
      return { success: false, error: "Erro ao alterar senha" }
    }

    console.log("Senha alterada com sucesso para usuário:", userId)
    return { success: true }
  } catch (error) {
    console.error("Erro ao alterar senha:", error)
    return { success: false, error: "Erro interno do servidor" }
  }
}
