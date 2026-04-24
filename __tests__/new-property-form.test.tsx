import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { NewPropertyForm } from "@/app/(admin)/dashboard/properties/new/NewPropertyForm"

const mockCreatePropertyAction = jest.fn()

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: () =>
    function MockLocationPickerMap({
      onChange,
    }: {
      onChange: (coords: { latitude: number; longitude: number }) => void
    }) {
      return (
        <button
          type="button"
          onClick={() => onChange({ latitude: 41.01, longitude: 29.01 })}
        >
          Mock location picker
        </button>
      )
    },
}))

jest.mock("@/app/(admin)/dashboard/properties/actions", () => ({
  createPropertyAction: (...args: unknown[]) => mockCreatePropertyAction(...args),
}))

describe("NewPropertyForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the create property form", () => {
    render(<NewPropertyForm />)

    expect(screen.getByText("Basic Info")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Create property" })).toBeInTheDocument()
    expect(screen.getByText("Drop images here or click to browse")).toBeInTheDocument()
  })

  it("shows validation feedback when required fields are cleared", async () => {
    const user = userEvent.setup()
    render(<NewPropertyForm />)

    await user.clear(screen.getByLabelText("Title"))
    await user.clear(screen.getByLabelText("Location"))
    await user.clear(screen.getByLabelText("Price"))
    await user.clear(screen.getByLabelText("Square feet"))
    await user.clear(screen.getByLabelText("Description"))
    await user.click(screen.getByRole("button", { name: "Create property" }))

    expect(await screen.findByText("Title is required.")).toBeInTheDocument()
    expect(screen.getByText("Location is required.")).toBeInTheDocument()
    expect(screen.getByText("Please check the highlighted fields before saving.")).toBeInTheDocument()
  })

  it("previews uploaded images and submits form data", async () => {
    const user = userEvent.setup()
    mockCreatePropertyAction.mockResolvedValue(undefined)

    render(<NewPropertyForm />)

    const imageInput = screen.getByLabelText(/Drop images here or click to browse/i)
    const file = new File(["image"], "listing.jpg", { type: "image/jpeg" })
    Object.defineProperty(imageInput, "files", {
      configurable: true,
      writable: true,
      value: [],
    })

    await user.upload(imageInput, file)
    expect(await screen.findByRole("img", { name: "Property preview 1" })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Create property" }))

    await waitFor(() => expect(mockCreatePropertyAction).toHaveBeenCalledTimes(1))
    const submittedFormData = mockCreatePropertyAction.mock.calls[0][0] as FormData
    expect(submittedFormData.get("title")).toBe("Williamsburg Riverview Apartment")
    expect(submittedFormData.getAll("images")).toHaveLength(1)
  })

  it("shows submit errors returned by the action", async () => {
    const user = userEvent.setup()
    mockCreatePropertyAction.mockRejectedValue(new Error("Upload failed"))

    render(<NewPropertyForm />)
    await user.click(screen.getByRole("button", { name: "Create property" }))

    expect(await screen.findByText("Upload failed")).toBeInTheDocument()
  })
})
