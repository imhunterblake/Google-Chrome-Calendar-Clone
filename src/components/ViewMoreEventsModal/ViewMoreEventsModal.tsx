import type { CalendarEvent } from "../../types/event"
import { CalendarEventButton } from "../Calendar/CalendarEventButton"
import { Modal } from "../Modal/Modal"
import styles from "./ViewMoreEventsModal.module.css"

type ViewMoreEventsModalProps = {
  isOpen: boolean
  onClose: () => void
  date: Date
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

export function ViewMoreEventsModal({
  isOpen,
  onClose,
  date,
  events,
  onEventClick,
}: ViewMoreEventsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} date={date}>
      <ul className={styles.eventList}>
        {events.map(event => (
          <li key={event.id}>
            <CalendarEventButton
              event={event}
              onClick={() => onEventClick(event)}
            />
          </li>
        ))}
      </ul>
    </Modal>
  )
}
