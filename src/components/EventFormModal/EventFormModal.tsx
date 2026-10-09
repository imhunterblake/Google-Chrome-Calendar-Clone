import { useId, useState, type FormEvent } from "react"
import { useEventActions } from "../../context/events"
import {
  EVENT_COLORS,
  type CalendarEvent,
  type CalendarEventInput,
  type EventColor,
} from "../../types/event"
import { Button } from "../Button/Button"
import { Modal } from "../Modal/Modal"
import styles from "./EventFormModal.module.css"

const COLOR_LABELS: Record<EventColor, string> = {
  red: "Red",
  green: "Green",
  blue: "Blue",
}

type EventFormModalProps = {
  isOpen: boolean
  onClose: () => void
  date: Date
  /** The event to edit. When omitted the form adds a new event instead. */
  event?: CalendarEvent
}

export function EventFormModal({
  isOpen,
  onClose,
  date,
  event,
}: EventFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event == null ? "Add Event" : "Edit Event"}
      date={date}
    >
      <EventForm date={date} event={event} onDone={onClose} />
    </Modal>
  )
}

type EventFormProps = {
  date: Date
  event?: CalendarEvent
  onDone: () => void
}

function EventForm({ date, event, onDone }: EventFormProps) {
  const { addEvent, updateEvent, deleteEvent } = useEventActions()
  const [name, setName] = useState(event?.name ?? "")
  const [allDay, setAllDay] = useState(event?.allDay ?? false)
  const [startTime, setStartTime] = useState(
    event?.allDay === false ? event.startTime : "",
  )
  const [endTime, setEndTime] = useState(
    event?.allDay === false ? event.endTime : "",
  )
  const [color, setColor] = useState<EventColor>(event?.color ?? EVENT_COLORS[0])
  const formId = useId()
  const timeErrorId = `${formId}-time-error`

  // HH:mm strings compare correctly as plain strings
  const timeError =
    !allDay && startTime !== "" && endTime !== "" && startTime >= endTime
      ? "Start time must be before end time"
      : undefined

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (timeError != null) return

    const trimmedName = name.trim()
    const values: CalendarEventInput = allDay
      ? { name: trimmedName, color, date, allDay: true }
      : { name: trimmedName, color, date, allDay: false, startTime, endTime }

    if (event == null) addEvent(values)
    else updateEvent(event.id, values)
    onDone()
  }

  function handleDelete() {
    if (event == null) return
    deleteEvent(event.id)
    onDone()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor={`${formId}-name`}>Name</label>
        <input
          id={`${formId}-name`}
          type="text"
          required
          pattern={String.raw`.*\S.*`}
          title="Name cannot be blank"
          autoComplete="off"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className={styles.checkboxGroup}>
        <input
          id={`${formId}-all-day`}
          type="checkbox"
          checked={allDay}
          onChange={e => setAllDay(e.target.checked)}
        />
        <label htmlFor={`${formId}-all-day`}>All Day?</label>
      </div>

      <div>
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor={`${formId}-start-time`}>Start Time</label>
            <input
              id={`${formId}-start-time`}
              type="time"
              required={!allDay}
              disabled={allDay}
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor={`${formId}-end-time`}>End Time</label>
            <input
              id={`${formId}-end-time`}
              type="time"
              required={!allDay}
              disabled={allDay}
              aria-invalid={timeError != null}
              aria-describedby={timeError == null ? undefined : timeErrorId}
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </div>
        </div>
        {timeError != null && (
          <p id={timeErrorId} className={styles.error} role="alert">
            {timeError}
          </p>
        )}
      </div>

      <fieldset className={styles.formGroup}>
        <legend>Color</legend>
        <div className={styles.colors}>
          {EVENT_COLORS.map(eventColor => (
            <input
              key={eventColor}
              type="radio"
              name={`${formId}-color`}
              className={styles.colorSwatch}
              data-color={eventColor}
              aria-label={COLOR_LABELS[eventColor]}
              value={eventColor}
              checked={color === eventColor}
              onChange={() => setColor(eventColor)}
            />
          ))}
        </div>
      </fieldset>

      <div className={styles.row}>
        <Button type="submit" variant="success" className={styles.actionBtn}>
          {event == null ? "Add" : "Save"}
        </Button>
        {event != null && (
          <Button
            variant="delete"
            className={styles.actionBtn}
            onClick={handleDelete}
          >
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
