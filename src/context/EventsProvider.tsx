import { useMemo, type ReactNode } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"
import type { CalendarEvent } from "../types/event"
import { parseEvents } from "../utils/events"
import {
  EventActionsContext,
  EventsContext,
  type EventActions,
} from "./events"

const STORAGE_KEY = "calendar.events"
const NO_EVENTS: CalendarEvent[] = []

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useLocalStorage(
    STORAGE_KEY,
    NO_EVENTS,
    parseEvents,
  )

  const actions = useMemo<EventActions>(
    () => ({
      addEvent: event => {
        setEvents(current => [...current, { ...event, id: crypto.randomUUID() }])
      },
      updateEvent: (id, event) => {
        setEvents(current =>
          current.map(existing =>
            existing.id === id ? { ...event, id } : existing,
          ),
        )
      },
      deleteEvent: id => {
        setEvents(current => current.filter(event => event.id !== id))
      },
    }),
    [setEvents],
  )

  return (
    <EventsContext value={events}>
      <EventActionsContext value={actions}>{children}</EventActionsContext>
    </EventsContext>
  )
}
