import type * as React from "react"
import "@testing-library/jest-dom"
import { TextDecoder, TextEncoder } from "util"

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
})

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: jest.fn(),
})

Object.defineProperty(window, "open", {
  writable: true,
  value: jest.fn(),
})

Object.defineProperty(global, "TextEncoder", {
  writable: true,
  value: TextEncoder,
})

Object.defineProperty(global, "TextDecoder", {
  writable: true,
  value: TextDecoder,
})

Object.defineProperty(global, "ResizeObserver", {
  writable: true,
  value: class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
})

Object.defineProperty(window, "PointerEvent", {
  writable: true,
  value: MouseEvent,
})

Object.defineProperty(global, "DataTransfer", {
  writable: true,
  value: class DataTransfer {
    items = {
      add: jest.fn((file: File) => {
        this.files = [file]
      }),
    }

    files: File[] = []
  },
})

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  writable: true,
  value: jest.fn(),
})

Object.defineProperty(HTMLInputElement.prototype, "files", {
  configurable: true,
  get() {
    return (this as HTMLInputElement & { __files?: File[] }).__files ?? []
  },
  set(value) {
    ;(this as HTMLInputElement & { __files?: File[] }).__files = Array.isArray(value)
      ? value
      : Array.from(value ?? [])
  },
})

URL.createObjectURL = jest.fn(() => "blob:mock-preview")
URL.revokeObjectURL = jest.fn()

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => {
    const sanitizedProps = { ...props }
    delete sanitizedProps.unoptimized
    delete sanitizedProps.priority

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={sanitizedProps.alt} src={sanitizedProps.src} {...sanitizedProps} />
    )
  },
}))

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

jest.mock("motion/react", () => ({
  __esModule: true,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) => {
      const sanitizedProps = { ...props }
      delete sanitizedProps.animate
      delete sanitizedProps.exit
      delete sanitizedProps.initial
      delete sanitizedProps.transition
      delete sanitizedProps.viewport
      delete sanitizedProps.whileHover
      delete sanitizedProps.whileInView
      delete sanitizedProps.whileTap

      return <div {...sanitizedProps}>{sanitizedProps.children}</div>
    },
    create:
      <T extends React.ElementType>(Component: T) =>
      (props: React.ComponentProps<T> & Record<string, unknown>) => {
        const sanitizedProps = { ...props }
        delete sanitizedProps.animate
        delete sanitizedProps.exit
        delete sanitizedProps.initial
        delete sanitizedProps.transition
        delete sanitizedProps.viewport
        delete sanitizedProps.whileHover
        delete sanitizedProps.whileInView
        delete sanitizedProps.whileTap

        return <Component {...sanitizedProps}>{sanitizedProps.children}</Component>
      },
  },
  useReducedMotion: () => true,
}))
