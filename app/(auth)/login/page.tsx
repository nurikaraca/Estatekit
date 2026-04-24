import { AuthForm } from "./AuthForm"

const Login = async ({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; mode?: string }>
}) => {
  const { error, message, mode } = await searchParams

  return (
    <section className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 py-16 dark:bg-neutral-950">
      <AuthForm
        error={error}
        message={message}
        initialMode={mode === "signup" ? "signup" : "signin"}
      />
    </section>
  )
}

export default Login
