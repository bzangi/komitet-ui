import type { ComponentProps, ReactNode } from 'react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import { cx } from '../../utils/cx.js'

export type CheckboxProps = Omit<ComponentProps<typeof CheckboxPrimitive.Root>, 'children'> & {
  /** Rótulo visível. Sem ele, informe `aria-label`. */
  children?: ReactNode
}

/** Seleção independente; `checked="indeterminate"` = estado Mixed. Figma 12:692. */
export function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <label className={cx('k-check', className)}>
      <CheckboxPrimitive.Root className="k-check__box" {...props}>
        <CheckboxPrimitive.Indicator className="k-check__mark" aria-hidden />
      </CheckboxPrimitive.Root>
      {children && <span className="k-check__label">{children}</span>}
    </label>
  )
}
