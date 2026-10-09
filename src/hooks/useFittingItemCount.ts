import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"

/**
 * Works out how many items of a vertical list fit inside a container whose
 * size is fixed by its layout (it must not grow with its content).
 *
 * Measuring happens in two passes that both finish before the browser paints:
 * 1. Every item (plus the overflow indicator) is rendered so their real sizes
 *    can be read from the DOM.
 * 2. The count of items that fit is stored, so only those are rendered and the
 *    rest are removed from the DOM.
 *
 * It re-measures whenever `items` changes or the container is resized.
 */
export function useFittingItemCount<
  TContainer extends HTMLElement,
  TList extends HTMLElement,
  TIndicator extends HTMLElement,
>(items: readonly unknown[]) {
  const containerRef = useRef<TContainer>(null)
  const listRef = useRef<TList>(null)
  const overflowIndicatorRef = useRef<TIndicator>(null)
  // undefined means the next render is a measuring render
  const [fittingCount, setFittingCount] = useState<number>()
  const [measuredItems, setMeasuredItems] = useState(items)

  if (measuredItems !== items) {
    setMeasuredItems(items)
    setFittingCount(undefined)
  }

  useLayoutEffect(() => {
    if (fittingCount !== undefined) return
    const container = containerRef.current
    const list = listRef.current
    if (container == null || list == null) return

    setFittingCount(
      countFittingItems(container, list, overflowIndicatorRef.current),
    )
  }, [fittingCount])

  useEffect(() => {
    const container = containerRef.current
    if (container == null) return

    let previousSize: { width: number; height: number } | undefined
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (previousSize?.width === width && previousSize.height === height) {
        return
      }
      const isFirstObservation = previousSize == null
      previousSize = { width, height }
      // The initial size was already measured by the layout effect
      if (isFirstObservation) return

      // flushSync makes both measuring passes run before the next paint so the
      // overflowing items never flash on screen while resizing
      flushSync(() => setFittingCount(undefined))
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const isMeasuring = fittingCount === undefined
  return {
    containerRef,
    listRef,
    overflowIndicatorRef,
    isMeasuring,
    visibleCount: fittingCount ?? items.length,
  }
}

function countFittingItems(
  container: HTMLElement,
  list: HTMLElement,
  overflowIndicator: HTMLElement | null,
) {
  const containerBottom = container.getBoundingClientRect().bottom
  const itemBottoms = Array.from(
    list.children,
    item => item.getBoundingClientRect().bottom,
  )

  const lastItemBottom = itemBottoms.at(-1)
  if (lastItemBottom == null || lastItemBottom <= containerBottom) {
    return itemBottoms.length
  }

  // Not everything fits, so leave room for the overflow indicator
  const indicatorSpace =
    overflowIndicator == null
      ? 0
      : overflowIndicator.getBoundingClientRect().height +
        (parseFloat(getComputedStyle(container).rowGap) || 0)
  const availableBottom = containerBottom - indicatorSpace

  return itemBottoms.filter(bottom => bottom <= availableBottom).length
}
