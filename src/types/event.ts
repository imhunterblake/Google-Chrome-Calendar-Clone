export const EVENT_COLORS = ["red", "green", "blue"] as const

export type EventColor = (typeof EVENT_COLORS)[number]

type BaseCalendarEvent = {
  id: string
  name: string
  color: EventColor
  date: Date
}

export type AllDayCalendarEvent = BaseCalendarEvent & {
  allDay: true
}

export type TimedCalendarEvent = BaseCalendarEvent & {
  allDay: false
  /** 24 hour time in the format HH:mm */
  startTime: string
  /** 24 hour time in the format HH:mm */
  endTime: string
}

export type CalendarEvent = AllDayCalendarEvent | TimedCalendarEvent

/** Omit that distributes over each member of a union instead of merging them */
type UnionOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never

export type CalendarEventInput = UnionOmit<CalendarEvent, "id">
