import type { CalendarEvent } from "../../types/event"
import { cc } from "../../utils/cc"
import { formatEventTime } from "../../utils/events"
import styles from "./CalendarEventButton.module.css"

type CalendarEventButtonProps = {
  event: CalendarEvent
  onClick: () => void
}

export function CalendarEventButton({
  event,
  onClick,
}: CalendarEventButtonProps) {
  return (
    <button
      type="button"
      data-color={event.color}
      className={cc(styles.event, event.allDay ? styles.allDay : styles.timed)}
      aria-haspopup="dialog"
      onClick={onClick}
    >
      {event.allDay ? (
        <span className={styles.name}>
          {event.name}
          <span className="sr-only">, all day</span>
        </span>
      ) : (
        <>
          <span className={styles.dot} />
          <span className={styles.time}>
            {formatEventTime(event.startTime)}
          </span>
          <span className={styles.name}>{event.name}</span>
        </>
      )}
    </button>
  )
}
