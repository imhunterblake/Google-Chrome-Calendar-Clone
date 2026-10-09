import { useFittingItemCount } from "../../hooks/useFittingItemCount"
import type { CalendarEvent } from "../../types/event"
import { CalendarEventButton } from "./CalendarEventButton"
import styles from "./CalendarDay.module.css"

type CalendarDayEventsProps = {
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
  onViewMoreClick: () => void
}

/**
 * Renders as many of the day's events as fit and replaces the rest with a
 * "+X More" button. Overflowing events are not rendered at all.
 */
export function CalendarDayEvents({
  events,
  onEventClick,
  onViewMoreClick,
}: CalendarDayEventsProps) {
  const {
    containerRef,
    listRef,
    overflowIndicatorRef,
    isMeasuring,
    visibleCount,
  } = useFittingItemCount<HTMLDivElement, HTMLUListElement, HTMLButtonElement>(
    events,
  )
  const hiddenCount = events.length - visibleCount

  return (
    <div ref={containerRef} className={styles.events}>
      <ul ref={listRef} className={styles.eventList}>
        {events.slice(0, visibleCount).map(event => (
          <li key={event.id}>
            <CalendarEventButton
              event={event}
              onClick={() => onEventClick(event)}
            />
          </li>
        ))}
      </ul>
      {/* Always rendered while measuring so its height can be reserved */}
      {(isMeasuring || hiddenCount > 0) && (
        <button
          ref={overflowIndicatorRef}
          type="button"
          className={styles.viewMoreBtn}
          aria-haspopup="dialog"
          onClick={onViewMoreClick}
        >
          +{isMeasuring ? events.length : hiddenCount} More
          <span className="sr-only"> events</span>
        </button>
      )}
    </div>
  )
}
