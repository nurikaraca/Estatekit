import { render, screen } from "@testing-library/react"

import PropertyDetailPage, { generateMetadata } from "@/app/(client)/properties/[id]/page"
import { rentalApartmentProperty } from "@/tests/mocks/properties"

const mockGetProperty = jest.fn()
const mockNotFound = jest.fn()

jest.mock("@/features/property/services/property-service", () => ({
  getProperty: (...args: unknown[]) => mockGetProperty(...args),
}))

jest.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
}))

jest.mock("@/features/property/components/detail/PropertyDetail", () => ({
  PropertyDetail: ({ property }: { property: { title: string } }) => (
    <div>Detail page for {property.title}</div>
  ),
}))

describe("Property detail page", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("loads the requested property by id or slug", async () => {
    mockGetProperty.mockResolvedValue(rentalApartmentProperty)

    const element = await PropertyDetailPage({
      params: Promise.resolve({ id: "brooklyn-rental-1" }),
    })

    render(element)

    expect(mockGetProperty).toHaveBeenCalledWith("brooklyn-rental-1")
    expect(screen.getByText("Detail page for Williamsburg Riverview Apartment")).toBeInTheDocument()
  })

  it("returns friendly metadata for a known property", async () => {
    mockGetProperty.mockResolvedValue(rentalApartmentProperty)

    await expect(
      generateMetadata({ params: Promise.resolve({ id: "brooklyn-rental-1" }) })
    ).resolves.toEqual({
      title: "Williamsburg Riverview Apartment | EstateKit",
      description: rentalApartmentProperty.description,
    })
  })

  it("uses notFound when the property does not exist", async () => {
    mockGetProperty.mockResolvedValue(null)

    await PropertyDetailPage({
      params: Promise.resolve({ id: "missing" }),
    })

    expect(mockNotFound).toHaveBeenCalled()
  })
})
