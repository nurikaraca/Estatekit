import { render, screen } from "@testing-library/react"

import PropertyExplorer from "@/features/property/components/explorer/PropertyExplorer"
import { mockProperties } from "@/tests/mocks/properties"

jest.mock("@/features/property/components/explorer/PropertyMapPanel", () => ({
  PropertyMapPanel: ({ properties }: { properties: Array<{ title: string }> }) => (
    <div data-testid="property-map-panel">Map for {properties.length} properties</div>
  ),
}))

jest.mock("@/features/property/components/search/PropertySearchForm", () => ({
  PropertySearchForm: () => <div>Property Search Form</div>,
}))

describe("PropertyExplorer", () => {
  it("renders property cards for the properties page", () => {
    render(<PropertyExplorer properties={mockProperties} searchParams={{}} />)

    expect(screen.getByText("Townhouse on Berry Street")).toBeInTheDocument()
    expect(screen.getByText("Williamsburg Riverview Apartment")).toBeInTheDocument()
    expect(screen.getByText("Sold Condo in Greenpoint")).toBeInTheDocument()
    expect(screen.getByTestId("property-map-panel")).toHaveTextContent("3 properties")
  })

  it.each([
    ["buy", "Townhouse on Berry Street"],
    ["rent", "Williamsburg Riverview Apartment"],
    ["sold", "Sold Condo in Greenpoint"],
  ])("filters results by type=%s", (type, expectedTitle) => {
    render(<PropertyExplorer properties={mockProperties} searchParams={{ type }} />)

    expect(screen.getByText(expectedTitle)).toBeInTheDocument()
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1)
  })

  it("filters results by search query", () => {
    render(
      <PropertyExplorer
        properties={mockProperties}
        searchParams={{ search: "greenpoint" }}
      />
    )

    expect(screen.getByText("Sold Condo in Greenpoint")).toBeInTheDocument()
    expect(screen.queryByText("Williamsburg Riverview Apartment")).not.toBeInTheDocument()
  })

  it("shows an empty state when there are no properties", () => {
    render(<PropertyExplorer properties={[]} searchParams={{}} />)

    expect(screen.getByText("No matches for these filters yet.")).toBeInTheDocument()
  })

  it("shows an empty state when filters remove every property", () => {
    render(
      <PropertyExplorer
        properties={mockProperties}
        searchParams={{ type: "rent", minPrice: "5000" }}
      />
    )

    expect(screen.getByText("No matches for these filters yet.")).toBeInTheDocument()
  })
})
