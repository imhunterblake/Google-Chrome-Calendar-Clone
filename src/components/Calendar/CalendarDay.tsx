import { useState } from "react"
import { format, isBefore, isToday, startOfToday } from "date-fns"
import type { CalendarEvent } from "../../types/event"
import { cc } from "../../utils/cc"
import { EventFormModal } from "../EventFormModal/EventFormModal"
import { ViewMoreEventsModal } from "../ViewMoreEventsModal/ViewMoreEventsModal"
import { CalendarDayEvents } from "./CalendarDayEvents"
import styles from "./CalendarDay.module.css"

type CalendarDayProps = {
  day: Date
  /** The day's events, already sorted */
  events: CalendarEvent[]
  isInVisibleMonth: boolean
  showWeekName: boolean
}

type OpenModal = "add" | "edit" | "viewMore"

export function CalendarDay({
  day,
  events,
  isInVisibleMonth,
  showWeekName,
}: CalendarDayProps) {
  const [openModal, setOpenModal] = useState<OpenModal>()
  // Kept after the edit modal closes so it can still render while animating out
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>()

  const isCurrentDay = isToday(day)
  const isPastDay = isBefore(day, startOfToday())
  const closeModal = () => setOpenModal(undefined)

  function editEvent(event: CalendarEvent) {
    setSelectedEvent(event)
    setOpenModal("edit")
  }

  return (
    <div
      role="group"
      aria-label={format(day, "EEEE, MMMM d, yyyy")}
      aria-current={isCurrentDay ? "date" : undefined}
      className={cc(
        styles.day,
        !isInVisibleMonth && styles.nonMonthDay,
        isPastDay && styles.pastDay,
      )}
    >
      <button
        type="button"
        className={styles.addEventBtn}
        aria-label={`Add event on ${format(day, "MMMM d")}`}
        aria-haspopup="dialog"
        onClick={() => setOpenModal("add")}
      >
        +
      </button>
      <div className={styles.content}>
        {/* The group's label already announces the full date */}
        <div className={styles.header} aria-hidden="true">
          {showWeekName && (
            <div className={styles.weekName}>{format(day, "EEE")}</div>
          )}
          <div className={cc(styles.dayNumber, isCurrentDay && styles.today)}>
            {format(day, "d")}
          </div>
        </div>
        {events.length > 0 && (
          <CalendarDayEvents
            events={events}
            onEventClick={editEvent}
            onViewMoreClick={() => setOpenModal("viewMore")}
          />
        )}
      </div>

      <EventFormModal
        isOpen={openModal === "add"}
        onClose={closeModal}
        date={day}
      />
      {selectedEvent != null && (
        <EventFormModal
          isOpen={openModal === "edit"}
          onClose={closeModal}
          date={day}
          event={selectedEvent}
        />
      )}
      <ViewMoreEventsModal
        isOpen={openModal === "viewMore"}
        onClose={closeModal}
        date={day}
        events={events}
        onEventClick={editEvent}
      />
    </div>
  )
}
