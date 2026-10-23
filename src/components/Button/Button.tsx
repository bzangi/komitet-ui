import type { ComponentProps, MouseEvent, ReactNode } from 'react'
import { Slot } from 'radix-ui'
import { cx } from '../../utils/cx'

export type ButtonProps = ComponentProps<'button'> & {
  /** Figma: Button/Primary, Secondary, Destructive, Quiet. */
  variant?: 'primary' | 'secondary' | 'destructive' | 'quiet'
  /** Figma: Button/Size — 32, 42 e 52 px. */
  size?: 'sm' | 'md' | 'lg'
  /** Mantém o foco, bloqueia a ação e troca o rótulo por `loadingLabel`. */
  loading?: boolean
  loadingLabel?: ReactNode
  /** Renderiza o filho (ex.: `<a>`) com o material da tecla. */
  asChild?: boolean
}

/** Tecla com aro de metal e face. Figma 11:89 · 11:198 · 11:307 · 11:416 · 18:3525. */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingLabel = 'Aguarde…',
  asChild = false,
  className,
  children,
  onClick,
  type,
  ...props
}: ButtonProps) {
  const Root = asChild ? Slot.Root : 'button'
  const busy = loading || undefined
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) return event.preventDefault()
    onClick?.(event)
  }
  return (
    <Root
      className={cx('k-button', className)}
      data-variant={variant}
      data-size={size}
      aria-busy={busy}
      aria-disabled={busy}
      type={asChild ? type : (type ?? 'button')}
      onClick={handleClick}
      {...props}
    >
      <Slot.Slottable child={children}>
        {content => <span className="k-button__face">{loading ? loadingLabel : content}</span>}
      </Slot.Slottable>
    </Root>
  )
}
