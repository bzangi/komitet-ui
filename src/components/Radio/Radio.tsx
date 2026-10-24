import type { ComponentProps, ReactNode } from 'react'
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { cx } from '../../utils/cx.js'

export type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive.Root>

/** Seleção exclusiva; nomeie o grupo com `aria-label` ou `aria-labelledby`. Figma 12:813. */
export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return <RadioGroupPrimitive.Root className={cx('k-radio-group', className)} {...props} />
}

export type RadioGroupItemProps = Omit<ComponentProps<typeof RadioGroupPrimitive.Item>, 'children'> & { children?: ReactNode }

export function RadioGroupItem({ className, children, ...props }: RadioGroupItemProps) {
  return (
    <label className={cx('k-check', className)}>
      <RadioGroupPrimitive.Item className="k-check__box k-radio" {...props}>
        <RadioGroupPrimitive.Indicator className="k-radio__dot" />
      </RadioGroupPrimitive.Item>
      {children && <span className="k-check__label">{children}</span>}
    </label>
  )
}
