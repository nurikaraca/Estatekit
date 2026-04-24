import Header from "@/components/layout/header/Header"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main className="pt-20">{children}</main>
    </>
  )
}
