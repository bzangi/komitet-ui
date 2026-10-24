import type { ComponentProps, ReactNode } from 'react'
import { Switch as SwitchPrimitive } from 'radix-ui'
import { cx } from '../../utils/cx.js'

export type SwitchProps = Omit<ComponentProps<typeof SwitchPrimitive.Root>, 'children'> & {
  /** Rótulo visível. Sem ele, informe `aria-label`. */
  children?: ReactNode
}

/** Chave de efeito imediato; a posição da alavanca reforça o estado. Figma 12:916. */
export function Switch({ className, children, ...props }: SwitchProps) {
  return (
    <label className={cx('k-check', 'k-switch', className)}>
      <SwitchPrimitive.Root className="k-switch__track" {...props}>
        <SwitchPrimitive.Thumb className="k-switch__thumb" />
      </SwitchPrimitive.Root>
      {children && <span className="k-check__label">{children}</span>}
    </label>
  )
}
