import type { ComponentProps } from 'react'
import { Slot } from 'radix-ui'
import { cx } from '../../utils/cx.js'

export type CardProps = ComponentProps<'div'> & {
  /** Figma: Card/Paper, Card/Plate (= Card/Module), Card/Compact. */
  material?: 'paper' | 'plate' | 'compact'
  selected?: boolean
  /** Falha ao obter o conteúdo: moldura de erro na face. */
  error?: boolean
  disabled?: boolean
  /** Card interativo (ex.: `<a>`): recebe foco e o traço de foco do Figma. */
  asChild?: boolean
}

/** Ficha com cabeçalho, corpo e ações. Figma 13:639 · 13:1080 · 13:1549 · 13:2018. */
export function Card({ material = 'paper', selected, error, disabled, asChild, className, children, ...props }: CardProps) {
  const Root = asChild ? Slot.Root : 'div'
  return (
    <Root
      className={cx('k-card', className)}
      data-material={material}
      data-selected={selected || undefined}
      data-error={error || undefined}
      data-disabled={disabled || undefined}
      aria-disabled={(asChild && disabled) || undefined}
      {...props}
    >
      <Slot.Slottable child={children}>{content => <div className="k-card__face">{content}</div>}</Slot.Slottable>
    </Root>
  )
}

export function CardHeader({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cx('k-card__header', className)} {...props}>
      <div className="k-card__id">{children}</div>
    </div>
  )
}

/** Etiqueta de arquivo acima do título (Label/Small). */
export function CardMeta({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cx('k-card__meta', className)} {...props} />
}

export function CardTitle({ className, ...props }: ComponentProps<'h3'>) {
  return <h3 className={cx('k-card__title', className)} {...props} />
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx('k-card__content', className)} {...props} />
}

export function CardActions({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx('k-card__actions', className)} {...props} />
}
