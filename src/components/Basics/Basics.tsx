import { useId, type ComponentProps, type ReactNode } from 'react'
import { Progress as ProgressPrimitive, Separator as SeparatorPrimitive } from 'radix-ui'
import { cx } from '../../utils/cx.js'

export type SkeletonProps = ComponentProps<'span'> & { width?: string | number; height?: string | number }

/** Reserva a forma do conteúdo durante a carga; decorativo e estático. Figma 10:168. */
export function Skeleton({ width = '100%', height = 14, className, style, ...props }: SkeletonProps) {
  return <span aria-hidden className={cx('k-skeleton', className)} style={{ width, height, ...style }} {...props} />
}

export type AvatarProps = Omit<ComponentProps<'span'>, 'children'> & {
  /** Nome da pessoa; as iniciais são derivadas dele. Sem nome = estado Empty. */
  name?: string
  /** Nome acessível quando `name` está ausente. */
  emptyLabel?: string
}

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter((_, i, all) => i === 0 || i === all.length - 1)
    .map(part => part[0]!.toUpperCase())
    .join('')

/** Identidade por iniciais. Figma 10:7. */
export function Avatar({ name, emptyLabel = 'Identidade indisponível', className, ...props }: AvatarProps) {
  return (
    <span role="img" aria-label={name || emptyLabel} className={cx('k-avatar', className)} data-empty={!name || undefined} {...props}>
      <span aria-hidden>{name ? initials(name) : '?'}</span>
    </span>
  )
}

export type SpinnerProps = ComponentProps<'span'> & { label?: ReactNode }

/** Espera de duração desconhecida; o rótulo é anunciado. Figma 10:141. */
export function Spinner({ label = 'Carregando…', className, ...props }: SpinnerProps) {
  return (
    <span role="status" className={cx('k-spinner', className)} {...props}>
      <span className="k-spinner__ring" aria-hidden />
      <span className="k-spinner__label">{label}</span>
    </span>
  )
}

/** Tecla de atalho. O atalho precisa existir na implementação. Figma 10:203. */
export function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return <kbd className={cx('k-kbd', className)} {...props} />
}

export type SeparatorProps = ComponentProps<typeof SeparatorPrimitive.Root>

/** Divisória de 2 px. Figma 10:258. */
export function Separator({ className, ...props }: SeparatorProps) {
  return <SeparatorPrimitive.Root className={cx('k-separator', className)} {...props} />
}

export type ProgressProps = Omit<ComponentProps<typeof ProgressPrimitive.Root>, 'children'> & {
  label: ReactNode
  /** `null` = andamento indeterminado (Figma Loading). */
  value: number | null
  /** Texto do valor; padrão: porcentagem. */
  valueLabel?: (value: number, max: number) => ReactNode
}

/** Avanço com rótulo e valor. Figma 10:285. */
export function Progress({ label, value, max = 100, valueLabel = (v, m) => `${Math.round((v / m) * 100)}%`, className, ...props }: ProgressProps) {
  const labelId = useId()
  return (
    <div className={cx('k-progress', className)}>
      <span id={labelId} className="k-progress__label">
        {label}
        {value !== null && <> · {valueLabel(value, max)}</>}
      </span>
      <ProgressPrimitive.Root className="k-progress__track" value={value} max={max} aria-labelledby={labelId} {...props}>
        <ProgressPrimitive.Indicator
          className="k-progress__fill"
          style={value === null ? undefined : { width: `${(Math.min(Math.max(value, 0), max) / max) * 100}%` }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
}
