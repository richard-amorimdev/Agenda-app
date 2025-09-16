// Middleware de autenticação para rotas privadas
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Middleware que protege rotas privadas lendo o cookie de sessão.
 * Se não houver cookie válido, redireciona para /login.
 * Ajuste o matcher conforme as rotas privadas do seu app.
 */
export function middleware(req: NextRequest) {
  // Lê o cookie de sessão
  const token = req.cookies.get("session_token")?.value

  // Verifica se a rota é protegida
  const { pathname } = req.nextUrl
  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/scheduled-tasks")

  // Se não autenticado e rota protegida, redireciona para login
  if (!token && isProtected) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  // Caso contrário, segue normalmente
  return NextResponse.next()
}

// Configuração do matcher: protege apenas rotas privadas
export const config = {
  // NÃO inclua /login ou /register aqui para evitar loops
  matcher: ["/dashboard/:path*", "/scheduled-tasks/:path*"],
}
