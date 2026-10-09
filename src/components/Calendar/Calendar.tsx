import { useState } from "react"
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { useEvents } from "../../context/events"
import type { CalendarEvent } from "../../types/event"
import { compareEvents } from "../../utils/events"
import { Button } from "../Button/Button"
import { CalendarDay } from "./CalendarDay"
import styles from "./Calendar.module.css"

const DAYS_IN_WEEK = 7
const NO_EVENTS: CalendarEvent[] = []

function toDayKey(date: Date) {
  return format(date, "yyyy-MM-dd")
}

function groupEventsByDay(events: CalendarEvent[]) {
  const eventsByDay = new Map<string, CalendarEvent[]>()
  for (const event of events) {
    const key = toDayKey(event.date)
    eventsByDay.set(key, [...(eventsByDay.get(key) ?? []), event])
  }
  for (const dayEvents of eventsByDay.values()) dayEvents.sort(compareEvents)
  return eventsByDay
}

export function Calendar() {
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(new Date()),
  )
  const events = useEvents()

  const eventsByDay = groupEventsByDay(events)
  const days = eachDayOfInterval({
    start: startOfWeek(visibleMonth),
    end: endOfWeek(endOfMonth(visibleMonth)),
  })

  return (
    <div className={styles.calendar}>
      <header className={styles.header}>
        <Button onClick={() => setVisibleMonth(startOfMonth(new Date()))}>
          Today
        </Button>
        <div className={styles.monthChangeBtns}>
          <button
            type="button"
            className={styles.monthChangeBtn}
            aria-label="Previous month"
            onClick={() => setVisibleMonth(month => subMonths(month, 1))}
          >
            &lt;
          </button>
          <button
            type="button"
            className={styles.monthChangeBtn}
            aria-label="Next month"
            onClick={() => setVisibleMonth(month => addMonths(month, 1))}
          >
            &gt;
          </button>
        </div>
        <h1 className={styles.monthTitle} aria-live="polite">
          {format(visibleMonth, "MMMM yyyy")}
        </h1>
      </header>
      <div className={styles.days}>
        {days.map((day, index) => (
          <CalendarDay
            key={day.getTime()}
            day={day}
            events={eventsByDay.get(toDayKey(day)) ?? NO_EVENTS}
            isInVisibleMonth={isSameMonth(day, visibleMonth)}
            showWeekName={index < DAYS_IN_WEEK}
          />
        ))}
      </div>
    </div>
  )
}
