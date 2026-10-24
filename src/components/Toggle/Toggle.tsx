import type { ComponentProps } from 'react'
import { Toggle as TogglePrimitive, ToggleGroup as ToggleGroupPrimitive } from 'radix-ui'
import { cx } from '../../utils/cx'

export type ToggleProps = ComponentProps<typeof TogglePrimitive.Root> & {
  /** Figma: Toggle (face vira `brand`) e SignalButton (tecla luminosa que afunda). */
  variant?: 'standard' | 'signal'
}

/** Tecla de retenção com seleção persistente (`aria-pressed`). Figma 11:578 · 11:519. */
export function Toggle({ variant = 'standard', className, children, ...props }: ToggleProps) {
  return (
    <TogglePrimitive.Root className={cx('k-button', className)} data-variant={variant === 'signal' ? 'signal' : 'toggle'} {...props}>
      <span className="k-button__face">{children}</span>
    </TogglePrimitive.Root>
  )
}

/** Comandos relacionados lado a lado; `primary` destaca o principal. Figma 11:635. */
export function ButtonGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div role="group" className={cx('k-segments', className)} {...props} />
}

export type ButtonGroupItemProps = ComponentProps<'button'> & { primary?: boolean }

export function ButtonGroupItem({ primary, className, type = 'button', ...props }: ButtonGroupItemProps) {
  return <button type={type} className={cx('k-segment', className)} data-active={primary || undefined} {...props} />
}

export type ToggleGroupProps = ComponentProps<typeof ToggleGroupPrimitive.Root>

/** Escolha entre regimes com seleção visível. Figma 11:702. */
export function ToggleGroup({ className, ...props }: ToggleGroupProps) {
  return <ToggleGroupPrimitive.Root className={cx('k-segments', className)} {...props} />
}

export function ToggleGroupItem({ className, ...props }: ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return <ToggleGroupPrimitive.Item className={cx('k-segment', className)} {...props} />
}
