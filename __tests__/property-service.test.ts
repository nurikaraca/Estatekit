import { buyProperty, rentalApartmentProperty } from "@/tests/mocks/properties"

const mockCreateSupabaseServerClient = jest.fn()
const mockTryCreateSupabaseAdminClient = jest.fn()

jest.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: () => mockCreateSupabaseServerClient(),
}))

jest.mock("@/lib/supabase/admin", () => ({
  tryCreateSupabaseAdminClient: () => mockTryCreateSupabaseAdminClient(),
}))

describe("property service", () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it("fetches and maps approved property listings", async () => {
    const propertyRow = {
      id: 1,
      slug: "williamsburg-riverview-apartment",
      title: rentalApartmentProperty.title,
      location: rentalApartmentProperty.location,
      neighborhood_name: rentalApartmentProperty.neighborhoodName,
      type: rentalApartmentProperty.type,
      listing_type: rentalApartmentProperty.listingType,
      home_type: rentalApartmentProperty.homeType,
      price: rentalApartmentProperty.price,
      beds: rentalApartmentProperty.beds,
      baths: rentalApartmentProperty.baths,
      sqft: rentalApartmentProperty.sqft,
      status_label: rentalApartmentProperty.statusLabel,
      availability_label: rentalApartmentProperty.availabilityLabel,
      broker_name: rentalApartmentProperty.brokerName,
      agent_name: rentalApartmentProperty.agentName,
      image_url: rentalApartmentProperty.image.src,
      description: rentalApartmentProperty.description,
      highlights: rentalApartmentProperty.highlights,
      neighborhood: rentalApartmentProperty.neighborhood,
      year_built: rentalApartmentProperty.yearBuilt,
      lot_size: rentalApartmentProperty.lotSize,
      latitude: rentalApartmentProperty.coordinates.lat,
      longitude: rentalApartmentProperty.coordinates.lng,
      property_images: [
        {
          image_url: rentalApartmentProperty.image.src,
          alt: rentalApartmentProperty.image.alt,
          sort_order: 0,
        },
      ],
    }

    mockCreateSupabaseServerClient.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() =>
              Promise.resolve({
                data: [propertyRow],
                error: null,
              })
            ),
          })),
        })),
      })),
    })

    const { getProperties } = await import("@/features/property/services/property-service")
    const result = await getProperties()

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      title: rentalApartmentProperty.title,
      listingType: "rent",
      homeType: "apartment",
    })
  })

  it("fetches one property with its related sections and storage images", async () => {
    const detailBuilder = {
      eq: jest.fn(() => detailBuilder),
      or: jest.fn(() => detailBuilder),
      maybeSingle: jest.fn(() =>
        Promise.resolve({
          data: {
            id: 1,
            slug: "williamsburg-riverview-apartment",
            title: rentalApartmentProperty.title,
            location: rentalApartmentProperty.location,
            neighborhood_name: rentalApartmentProperty.neighborhoodName,
            type: rentalApartmentProperty.type,
            listing_type: rentalApartmentProperty.listingType,
            home_type: rentalApartmentProperty.homeType,
            price: rentalApartmentProperty.price,
            beds: rentalApartmentProperty.beds,
            baths: rentalApartmentProperty.baths,
            sqft: rentalApartmentProperty.sqft,
            status_label: rentalApartmentProperty.statusLabel,
            availability_label: rentalApartmentProperty.availabilityLabel,
            broker_name: rentalApartmentProperty.brokerName,
            agent_name: rentalApartmentProperty.agentName,
            image_url: rentalApartmentProperty.image.src,
            description: rentalApartmentProperty.description,
            highlights: rentalApartmentProperty.highlights,
            neighborhood: rentalApartmentProperty.neighborhood,
            year_built: rentalApartmentProperty.yearBuilt,
            lot_size: rentalApartmentProperty.lotSize,
            latitude: rentalApartmentProperty.coordinates.lat,
            longitude: rentalApartmentProperty.coordinates.lng,
            property_images: [
              {
                public_url: rentalApartmentProperty.image.src,
                alt: rentalApartmentProperty.image.alt,
                sort_order: 0,
              },
            ],
          },
          error: null,
        })
      ),
      neq: jest.fn(() => detailBuilder),
      gte: jest.fn(() => detailBuilder),
      lte: jest.fn(() => detailBuilder),
      limit: jest.fn(() =>
        Promise.resolve({
          data: [
            {
              id: 2,
              title: buyProperty.title,
              location: buyProperty.location,
              type: "buy",
              listing_type: "sale",
              home_type: "house",
              price: buyProperty.price,
              beds: buyProperty.beds,
              baths: buyProperty.baths,
              sqft: buyProperty.sqft,
              property_images: [],
            },
          ],
        })
      ),
    }

    const from = jest.fn((table: string) => {
      if (table === "properties") {
        return {
          select: jest.fn(() => detailBuilder),
        }
      }

      const relationData: Record<string, unknown[]> = {
        property_amenities: [
          { label: "Fitness center", category: "building" },
          { label: "In-unit laundry", category: "unit" },
          { label: "Water", category: "services" },
        ],
        property_fees: [{ label: "Parking fee", amount: 250, cadence: "monthly" }],
        property_pet_policies: [{ label: "Cats allowed", amount: 300 }],
        property_schools: [
          { school_name: "PS 84 Jose De Diego", rating: 8, distance: "0.4 mi", level: "elementary", students_count: 560 },
        ],
        property_nearby_places: [
          { place_name: "McCarren Park", category: "park", distance: "0.3 mi" },
        ],
      }

      return {
        select: jest.fn(() => ({
          eq: jest.fn(() =>
            Promise.resolve({
              data: relationData[table] ?? [],
              error: null,
            })
          ),
        })),
      }
    })

    mockCreateSupabaseServerClient.mockResolvedValue({ from })
    mockTryCreateSupabaseAdminClient.mockReturnValue({
      supabase: {
        storage: {
          from: jest.fn(() => ({
            list: jest.fn(() =>
              Promise.resolve({
                data: [{ name: "gallery.jpg", metadata: { size: 1 } }],
                error: null,
              })
            ),
            getPublicUrl: jest.fn(() => ({
              data: { publicUrl: "https://cdn.example.com/1/gallery.jpg" },
            })),
          })),
        },
      },
    })

    const { getProperty } = await import("@/features/property/services/property-service")
    const result = await getProperty("1")

    expect(result).not.toBeNull()
    expect(result?.petPolicies[0]?.label).toBe("Cats allowed")
    expect(result?.schools[0]?.name).toBe("PS 84 Jose De Diego")
    expect(result?.nearbyPlaces[0]?.name).toBe("McCarren Park")
    expect(result?.images[0]?.src).toContain("river-apartment")
  })

  it("throws when property fetching returns an error", async () => {
    mockCreateSupabaseServerClient.mockResolvedValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() =>
              Promise.resolve({
                data: null,
                error: { message: "broken query" },
              })
            ),
          })),
        })),
      })),
    })

    const { getProperties } = await import("@/features/property/services/property-service")

    await expect(getProperties()).rejects.toThrow("broken query")
  })
})
