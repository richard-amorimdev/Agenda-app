import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Verificar se há sessão no localStorage (será verificado no cliente)
  // Para rotas protegidas, deixar o componente verificar a autenticação

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}
