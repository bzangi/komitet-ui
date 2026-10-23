import type { ComponentProps } from 'react'
import { useFieldControl } from '../Field/Field'
import { cx } from '../../utils/cx'

export type InputProps = ComponentProps<'input'>

/** Campo de texto. Rótulo e mensagens vêm do `Field`. Figma 12:251. */
export function Input({ className, ...props }: InputProps) {
  return <input className={cx('k-input', className)} {...useFieldControl(props)} />
}
