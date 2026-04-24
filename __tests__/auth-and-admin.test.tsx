import type { ReactNode } from "react"
import { render, screen } from "@testing-library/react"

import AdminLayout from "@/app/(admin)/layout"
import { getPostLoginRedirect } from "@/lib/supabase/auth"

const mockRequireAdmin = jest.fn()

jest.mock("@/lib/supabase/auth", () => ({
  getPostLoginRedirect: jest.requireActual("@/lib/supabase/auth").getPostLoginRedirect,
  requireAdmin: () => mockRequireAdmin(),
}))

jest.mock("@/app/(admin)/dashboard/AdminSidebar", () => ({
  AdminSidebar: () => <nav>Admin sidebar</nav>,
}))

jest.mock("@/app/(admin)/dashboard/AdminTopbar", () => ({
  AdminTopbar: ({ profile }: { profile: { email: string } }) => (
    <div>Admin topbar for {profile.email}</div>
  ),
}))

jest.mock("@/app/(admin)/dashboard/AdminQueryProvider", () => ({
  AdminQueryProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

describe("auth and protected admin routes", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("redirect helpers send admins to the dashboard and users to properties", () => {
    expect(
      getPostLoginRedirect({
        id: "1",
        email: "admin@example.com",
        full_name: null,
        avatar_url: null,
        role: "admin",
        created_at: "2026-04-24",
      })
    ).toBe("/dashboard")

    expect(
      getPostLoginRedirect({
        id: "2",
        email: "user@example.com",
        full_name: null,
        avatar_url: null,
        role: "user",
        created_at: "2026-04-24",
      })
    ).toBe("/properties")
  })

  it("allows logged-in admins to access the dashboard layout", async () => {
    mockRequireAdmin.mockResolvedValue({
      id: "1",
      email: "admin@example.com",
      full_name: "Admin",
      avatar_url: null,
      role: "admin",
      created_at: "2026-04-24",
    })

    const layoutElement = AdminLayout({
      children: <div>Dashboard content</div>,
    })
    const element = await layoutElement.type(layoutElement.props)

    render(element)

    expect(screen.getByText("Admin sidebar")).toBeInTheDocument()
    expect(screen.getByText("Admin topbar for admin@example.com")).toBeInTheDocument()
    expect(screen.getByText("Dashboard content")).toBeInTheDocument()
  })

  it("blocks dashboard access when requireAdmin rejects", async () => {
    mockRequireAdmin.mockRejectedValue(new Error("NEXT_REDIRECT"))

    const layoutElement = AdminLayout({
      children: <div>Dashboard content</div>,
    })

    await expect(
      layoutElement.type(layoutElement.props)
    ).rejects.toThrow("NEXT_REDIRECT")
  })
})
