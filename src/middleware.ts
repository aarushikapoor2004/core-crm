export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|public|api/auth|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
