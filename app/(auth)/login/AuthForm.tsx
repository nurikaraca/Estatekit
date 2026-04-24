"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"

import { signInAction, signUpAction } from "./actions"

type AuthMode = "signin" | "signup"

type AuthFormProps = {
  error?: string
  message?: string
  initialMode?: AuthMode
}

export function AuthForm({
  error,
  message,
  initialMode = "signin",
}: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const isSignUp = mode === "signup"

  return (
    <div className="w-full max-w-md rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
          EstateKit
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-neutral-950 dark:text-white">
          {isSignUp ? "Create account" : "Sign in"}
        </h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-300">
          {isSignUp
            ? "Create a user account to save favorites and submit listings for review."
            : "Sign in to save favorites, submit listings, or manage the admin dashboard."}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 rounded-xl bg-neutral-100 p-1 dark:bg-white/10">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`h-10 rounded-lg text-sm font-semibold transition-colors ${
            !isSignUp
              ? "bg-white text-neutral-950 shadow-sm dark:bg-neutral-950 dark:text-white"
              : "text-neutral-500 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`h-10 rounded-lg text-sm font-semibold transition-colors ${
            isSignUp
              ? "bg-white text-neutral-950 shadow-sm dark:bg-neutral-950 dark:text-white"
              : "text-neutral-500 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
          }`}
        >
          Sign up
        </button>
      </div>

      {error ? (
        <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
          {message}
        </p>
      ) : null}

      {isSignUp ? <SignUpForm /> : <SignInForm />}
    </div>
  )
}

function SignInForm() {
  return (
    <form action={signInAction} className="mt-6">
      <AuthFields passwordAutoComplete="current-password" />
      <SubmitButton label="Sign in" pendingLabel="Signing in..." />
    </form>
  )
}

function SignUpForm() {
  return (
    <form action={signUpAction} className="mt-6">
      <div className="mb-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            Full name
          </span>
          <input
            required
            type="text"
            name="fullName"
            autoComplete="name"
            className="h-12 rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-neutral-950 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:focus:border-white"
          />
        </label>
      </div>
      <AuthFields passwordAutoComplete="new-password" />
      <p className="mt-4 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
        New accounts are created with the user role. Admin access is assigned
        only from the backend or database.
      </p>
      <SubmitButton label="Create account" pendingLabel="Creating account..." />
    </form>
  )
}

function AuthFields({
  passwordAutoComplete,
}: {
  passwordAutoComplete: "current-password" | "new-password"
}) {
  return (
    <div className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
          Email
        </span>
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          className="h-12 rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-neutral-950 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:focus:border-white"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
          Password
        </span>
        <input
          required
          type="password"
          name="password"
          autoComplete={passwordAutoComplete}
          minLength={8}
          className="h-12 rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-neutral-950 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:focus:border-white"
        />
      </label>
    </div>
  )
}

function SubmitButton({
  label,
  pendingLabel,
}: {
  label: string
  pendingLabel: string
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 h-12 w-full rounded-xl bg-neutral-950 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
