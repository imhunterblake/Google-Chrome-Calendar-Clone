import { createContext, useContext } from "react"
import type { CalendarEvent, CalendarEventInput } from "../types/event"

export type EventActions = {
  addEvent: (event: CalendarEventInput) => void
  updateEvent: (id: string, event: CalendarEventInput) => void
  deleteEvent: (id: string) => void
}

// The events and the actions are split into separate contexts so components
// that only modify events do not re-render every time the events change.
export const EventsContext = createContext<CalendarEvent[] | null>(null)
export const EventActionsContext = createContext<EventActions | null>(null)

export function useEvents() {
  const events = useContext(EventsContext)
  if (events == null) {
    throw new Error("useEvents must be used within an EventsProvider")
  }
  return events
}

export function useEventActions() {
  const actions = useContext(EventActionsContext)
  if (actions == null) {
    throw new Error("useEventActions must be used within an EventsProvider")
  }
  return actions
}
