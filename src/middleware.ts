import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
    const isLoginPage = req.nextUrl.pathname === "/admin/login"

    // Если пользователь авторизован и пытается зайти на страницу логина
    if (token && isLoginPage) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isLoginPage = req.nextUrl.pathname === "/admin/login"
        
        // Страница логина доступна всем
        if (isLoginPage) {
          return true
        }
        
        // Для остальных админ-страниц нужен токен
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"],
}
