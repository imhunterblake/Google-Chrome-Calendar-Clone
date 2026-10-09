import {
  useEffect,
  useId,
  useRef,
  useState,
  type AnimationEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react"
import { format } from "date-fns"
import { cc } from "../../utils/cc"
import styles from "./Modal.module.css"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  /** Rendered as the modal heading, in front of the date */
  title?: string
  date: Date
  children: ReactNode
}

/**
 * Animated modal dialog. It stays mounted while its closing animation plays
 * and is only removed from the DOM once that animation has finished.
 */
export function Modal({ isOpen, ...props }: ModalProps) {
  const [isMounted, setIsMounted] = useState(isOpen)

  if (isOpen && !isMounted) setIsMounted(true)
  if (!isMounted) return null

  return (
    <ModalDialog
      {...props}
      isClosing={!isOpen}
      onClosed={() => setIsMounted(false)}
    />
  )
}

type ModalDialogProps = Omit<ModalProps, "isOpen"> & {
  isClosing: boolean
  onClosed: () => void
}

function ModalDialog({
  isClosing,
  onClose,
  onClosed,
  title,
  date,
  children,
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const dateId = useId()
  const pointerDownTarget = useRef<EventTarget | null>(null)

  // showModal gives us focus trapping, inert page content and focus
  // restoration for free, which a plain div cannot do on its own
  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  function handleAnimationEnd(e: AnimationEvent<HTMLDialogElement>) {
    if (!isClosing || e.target !== e.currentTarget) return
    // Closing while still attached lets the browser restore focus to the
    // element that opened the modal
    dialogRef.current?.close()
    onClosed()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDialogElement>) {
    if (e.key !== "Escape") return
    // Stop the browser from closing the dialog instantly so it can animate out
    e.preventDefault()
    onClose()
  }

  function handleCancel(e: SyntheticEvent<HTMLDialogElement>) {
    e.preventDefault()
    onClose()
  }

  function handleClick(e: MouseEvent<HTMLDialogElement>) {
    // The dialog has no padding, so a click that targets it directly can only
    // have come from the backdrop. Checking where the press started stops a
    // text selection that is dragged onto the backdrop from closing the modal.
    if (
      e.target === e.currentTarget &&
      pointerDownTarget.current === e.currentTarget
    ) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={cc(styles.modal, isClosing && styles.closing)}
      aria-labelledby={title == null ? dateId : `${titleId} ${dateId}`}
      onAnimationEnd={handleAnimationEnd}
      onKeyDown={handleKeyDown}
      onCancel={handleCancel}
      onPointerDown={e => {
        pointerDownTarget.current = e.target
      }}
      onClick={handleClick}
    >
      {/* inert stops a second submit/click while the modal animates out */}
      <div className={styles.body} inert={isClosing}>
        <div className={styles.header}>
          {title != null && (
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
          )}
          <time
            id={dateId}
            className={styles.date}
            dateTime={format(date, "yyyy-MM-dd")}
          >
            {format(date, "M/d/yy")}
          </time>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
