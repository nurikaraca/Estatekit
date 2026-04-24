import { render, screen } from "@testing-library/react"

import AdminPropertiesPage from "@/app/(admin)/dashboard/properties/page"

const mockTryCreateSupabaseAdminClient = jest.fn()

jest.mock("@/app/(admin)/dashboard/properties/actions", () => ({
  deletePropertyAction: jest.fn(),
  updatePropertyApprovalAction: jest.fn(),
}))

jest.mock("@/lib/supabase/admin", () => ({
  tryCreateSupabaseAdminClient: () => mockTryCreateSupabaseAdminClient(),
}))

describe("Admin properties page", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders admin listings", async () => {
    const propertyQuery = {
      select: jest.fn(() => ({
        order: jest.fn(() =>
          Promise.resolve({
            data: [
              {
                id: 1,
                title: "Williamsburg Riverview Apartment",
                type: "rent",
                price: 4200,
                location: "Williamsburg, Brooklyn",
                status_label: "For rent",
                approval_status: "approved",
                owner_id: "user-1",
                created_at: "2026-04-24T00:00:00.000Z",
              },
            ],
            error: null,
          })
        ),
      })),
    }

    const profilesQuery = {
      select: jest.fn(() =>
        Promise.resolve({
          data: [{ id: "user-1", email: "owner@example.com" }],
          error: null,
        })
      ),
    }

    mockTryCreateSupabaseAdminClient.mockReturnValue({
      supabase: {
        from: jest.fn((table: string) =>
          table === "properties" ? propertyQuery : profilesQuery
        ),
      },
      error: null,
    })

    const element = await AdminPropertiesPage()
    render(element)

    expect(screen.getByRole("heading", { name: "Properties" })).toBeInTheDocument()
    expect(screen.getByText("Williamsburg Riverview Apartment")).toBeInTheDocument()
    expect(screen.getByText("owner@example.com")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "New property" })).toHaveAttribute(
      "href",
      "/dashboard/properties/new"
    )
  })

  it("shows a config notice when the admin client is unavailable", async () => {
    mockTryCreateSupabaseAdminClient.mockReturnValue({
      supabase: null,
      error: "Missing SUPABASE_SERVICE_ROLE_KEY",
    })

    const element = await AdminPropertiesPage()
    render(element)

    expect(screen.getByText("Supabase admin key is required")).toBeInTheDocument()
    expect(screen.getByText(/Missing SUPABASE_SERVICE_ROLE_KEY/)).toBeInTheDocument()
  })
})
