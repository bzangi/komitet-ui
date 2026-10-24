import type { ReactNode } from 'react'
import { Button, type ButtonProps } from './Button.js'

export type IconButtonProps = Omit<ButtonProps, 'children' | 'loadingLabel'> & {
  icon: ReactNode
  /** Obrigatório: o ícone não nomeia a ação. */
  'aria-label': string
}

/** Tecla compacta com ícone. Figma 18:3588. */
export function IconButton({ icon, variant = 'secondary', ...props }: IconButtonProps) {
  return (
    <Button variant={variant} data-icon="" loadingLabel={icon} {...props}>
      {icon}
    </Button>
  )
}
