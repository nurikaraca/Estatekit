import { render, screen } from "@testing-library/react"

import { PropertyDetail } from "@/features/property/components/detail/PropertyDetail"
import { minimalProperty, rentalApartmentProperty } from "@/tests/mocks/properties"

describe("PropertyDetail", () => {
  it("renders a strong rent apartment detail experience with related sections", () => {
    render(<PropertyDetail property={rentalApartmentProperty} />)

    expect(screen.getByRole("heading", { level: 1, name: "Williamsburg Riverview Apartment" })).toBeInTheDocument()
    expect(screen.getByText("Rental features and policies")).toBeInTheDocument()
    expect(screen.getByText("Parking fee")).toBeInTheDocument()
    expect(screen.getByText("Cats allowed - $300")).toBeInTheDocument()
    expect(screen.getByText("PS 84 Jose De Diego")).toBeInTheDocument()
    expect(screen.getByText("McCarren Park")).toBeInTheDocument()
    expect(screen.getByText("Northside Loft")).toBeInTheDocument()
    expect(screen.getAllByRole("img", { name: /Riverview exterior|Living room/i })).not.toHaveLength(0)
  })

  it("shows calm empty states when optional detail sections are missing", () => {
    render(<PropertyDetail property={minimalProperty} />)

    expect(screen.getByText("Highlights have not been added for this listing yet.")).toBeInTheDocument()
    expect(screen.getByText("No overview has been added for this listing yet.")).toBeInTheDocument()
    expect(screen.getByText("Pet policy has not been added for this listing.")).toBeInTheDocument()
    expect(screen.getByText("Nearby places have not been added for this listing yet.")).toBeInTheDocument()
    expect(screen.getByText("School data has not been added for this listing yet.")).toBeInTheDocument()
    expect(screen.getByText("No similar listings are available for this property yet.")).toBeInTheDocument()
  })
})
