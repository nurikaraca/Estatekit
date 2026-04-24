import { createPropertyAction, deletePropertyAction, updatePropertyApprovalAction } from "@/app/(admin)/dashboard/properties/actions"
import { updateUserRoleAction } from "@/app/(admin)/dashboard/users/actions"

const mockRequireAdmin = jest.fn()
const mockCreateSupabaseAdminClient = jest.fn()
const mockRedirect = jest.fn()
const mockRevalidatePath = jest.fn()

jest.mock("crypto", () => ({
  randomUUID: () => "mock-uuid",
}))

jest.mock("@/lib/supabase/auth", () => ({
  requireAdmin: () => mockRequireAdmin(),
}))

jest.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => mockCreateSupabaseAdminClient(),
}))

jest.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}))

jest.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

describe("property and admin actions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRequireAdmin.mockResolvedValue({ id: "admin-1" })
  })

  it("creates a property, uploads images, and redirects back to the admin list", async () => {
    const updateEq = jest.fn(() => Promise.resolve({ error: null }))
    const supabase = {
      from: jest.fn((table: string) => {
        if (table === "properties") {
          return {
            insert: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: { id: 42 },
                    error: null,
                  })
                ),
              })),
            })),
            update: jest.fn(() => ({
              eq: updateEq,
            })),
          }
        }

        if (table === "property_images") {
          return {
            insert: jest.fn(() => Promise.resolve({ error: null })),
          }
        }

        return {
          insert: jest.fn(() => Promise.resolve({ error: null })),
        }
      }),
      storage: {
        from: jest.fn(() => ({
          upload: jest.fn(() => Promise.resolve({ error: null })),
          getPublicUrl: jest.fn((path: string) => ({
            data: { publicUrl: `https://cdn.example.com/${path}` },
          })),
        })),
      },
    }

    mockCreateSupabaseAdminClient.mockReturnValue(supabase)

    const formData = new FormData()
    formData.set("title", "Skyline Loft")
    formData.set("slug", "")
    formData.set("location", "Brooklyn")
    formData.set("neighborhoodName", "Williamsburg")
    formData.set("listingType", "rent")
    formData.set("type", "rent")
    formData.set("homeType", "apartment")
    formData.set("price", "4200")
    formData.set("beds", "2")
    formData.set("baths", "2")
    formData.set("sqft", "1180")
    formData.set("statusLabel", "For rent")
    formData.set("availabilityLabel", "Available now")
    formData.set("description", "A complete listing description for tests.")
    formData.set("latitude", "40.7211")
    formData.set("longitude", "-73.9572")
    formData.append("images", new File(["image"], "hero.jpg", { type: "image/jpeg" }))

    await createPropertyAction(formData)

    expect(mockCreateSupabaseAdminClient).toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/properties")
    expect(mockRedirect).toHaveBeenCalledWith("/dashboard/properties")
  })

  it("deletes property images from storage before deleting the property", async () => {
    const remove = jest.fn(() => Promise.resolve({ error: null }))
    const deleteEq = jest.fn(() => Promise.resolve({ error: null }))

    mockCreateSupabaseAdminClient.mockReturnValue({
      from: jest.fn((table: string) => {
        if (table === "property_images") {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() =>
                Promise.resolve({
                  data: [{ file_path: "1/hero.jpg", storage_path: null }],
                  error: null,
                })
              ),
            })),
          }
        }

        return {
          delete: jest.fn(() => ({
            eq: deleteEq,
          })),
        }
      }),
      storage: {
        from: jest.fn(() => ({
          remove,
        })),
      },
    })

    const formData = new FormData()
    formData.set("propertyId", "42")

    await deletePropertyAction(formData)

    expect(remove).toHaveBeenCalledWith(["1/hero.jpg"])
    expect(deleteEq).toHaveBeenCalledWith("id", "42")
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard")
  })

  it("rejects invalid approval statuses", async () => {
    const formData = new FormData()
    formData.set("propertyId", "42")
    formData.set("approvalStatus", "published")

    await expect(updatePropertyApprovalAction(formData)).rejects.toThrow(
      "Invalid approval status."
    )
  })

  it("updates user roles through the admin action", async () => {
    const eq = jest.fn(() => Promise.resolve({ error: null }))
    mockCreateSupabaseAdminClient.mockReturnValue({
      from: jest.fn(() => ({
        update: jest.fn(() => ({
          eq,
        })),
      })),
    })

    const formData = new FormData()
    formData.set("userId", "user-1")
    formData.set("role", "admin")

    await updateUserRoleAction(formData)

    expect(eq).toHaveBeenCalledWith("id", "user-1")
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/users")
  })
})
