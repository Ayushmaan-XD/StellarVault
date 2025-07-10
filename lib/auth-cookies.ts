import { cookies } from "next/headers"

export const authCookies = {
  setToken: (token: string) => {
    // Set in client-side
    document.cookie = `sb-access-token=${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax; Secure`
  },

  removeToken: () => {
    // Remove in client-side
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure"
  },

  // Server-side functions
  getToken: () => {
    return cookies().get("sb-access-token")?.value
  },

  setServerToken: (token: string) => {
    cookies().set("sb-access-token", token, {
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    })
  },

  removeServerToken: () => {
    cookies().delete("sb-access-token")
  },
}
