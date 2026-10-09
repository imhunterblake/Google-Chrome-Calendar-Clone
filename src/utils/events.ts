import { format, isValid, parse } from "date-fns"
import {
  EVENT_COLORS,
  type CalendarEvent,
  type EventColor,
} from "../types/event"

/** All day events first, then timed events ordered by when they start */
export function compareEvents(a: CalendarEvent, b: CalendarEvent) {
  if (a.allDay && b.allDay) return 0
  if (a.allDay) return -1
  if (b.allDay) return 1
  return a.startTime.localeCompare(b.startTime)
}

/** Formats a 24 hour HH:mm time as a 12 hour time (e.g. 3:43 PM) */
export function formatEventTime(time: string) {
  return format(parse(time, "HH:mm", new Date()), "h:mm a")
}

export function isEventColor(value: unknown): value is EventColor {
  return EVENT_COLORS.some(color => color === value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseEvent(value: unknown): CalendarEvent | undefined {
  if (!isRecord(value)) return undefined

  const { id, name, color, date, allDay, startTime, endTime } = value
  if (typeof id !== "string" || typeof name !== "string") return undefined
  if (!isEventColor(color) || typeof date !== "string") return undefined

  const parsedDate = new Date(date)
  if (!isValid(parsedDate)) return undefined

  const base = { id, name, color, date: parsedDate }
  if (allDay === true) return { ...base, allDay: true }
  if (
    allDay === false &&
    typeof startTime === "string" &&
    typeof endTime === "string"
  ) {
    return { ...base, allDay: false, startTime, endTime }
  }
  return undefined
}

/** Safely converts untrusted JSON (e.g. from localStorage) into events */
export function parseEvents(value: unknown): CalendarEvent[] | undefined {
  if (!Array.isArray(value)) return undefined

  return value.flatMap(item => {
    const event = parseEvent(item)
    return event == null ? [] : [event]
  })
}
