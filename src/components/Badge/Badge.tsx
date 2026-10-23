import type { ComponentProps } from 'react'
import { cx } from '../../utils/cx'

export type BadgeProps = ComponentProps<'span'> & {
  /** A cor reforça; o texto precisa nomear a situação. */
  tone?: 'neutral' | 'success' | 'warning' | 'error'
}

/** Indicador com lente de sinalização. Figma 10:54. */
export function Badge({ tone = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span className={cx('k-badge', className)} data-tone={tone} {...props}>
      <span className="k-badge__lens" aria-hidden />
      {children}
    </span>
  )
}
