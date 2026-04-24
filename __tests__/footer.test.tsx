import { render, screen } from "@testing-library/react"

import Footer from "@/components/layout/footer/Footer"

describe("Footer", () => {
  it("renders brand and key navigation groups", () => {
    render(<Footer />)

    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "RealEstate" })).toBeInTheDocument()
    expect(screen.getByText("Modern platform to buy, sell and rent properties.")).toBeInTheDocument()
    expect(screen.getByText("Company")).toBeInTheDocument()
    expect(screen.getByText("Product")).toBeInTheDocument()
    expect(screen.getByText("Legal")).toBeInTheDocument()
  })
})
