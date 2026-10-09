import { useEffect, useState } from "react"

/**
 * useState that is persisted to localStorage. `parse` validates the stored
 * JSON and returns undefined when it is unusable, in which case
 * `initialValue` is used instead.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  parse: (value: unknown) => T | undefined,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const json = localStorage.getItem(key)
      if (json == null) return initialValue
      return parse(JSON.parse(json)) ?? initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can be full or unavailable (e.g. private mode); the app still
      // works for the current session in that case.
    }
  }, [key, value])

  return [value, setValue] as const
}
