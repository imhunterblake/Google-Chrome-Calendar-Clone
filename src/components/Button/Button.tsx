import type { ComponentProps } from "react"
import { cc } from "../../utils/cc"
import styles from "./Button.module.css"

type ButtonProps = ComponentProps<"button"> & {
  variant?: "default" | "success" | "delete"
}

export function Button({
  variant = "default",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cc(styles.btn, styles[variant], className)}
      {...props}
    />
  )
}
