/** Joins the truthy class names together */
export function cc(...classNames: (string | false | null | undefined)[]) {
  return classNames.filter(Boolean).join(" ")
}
