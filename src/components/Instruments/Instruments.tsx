import { useId, type ComponentProps, type ReactNode } from 'react'
import { Badge, type BadgeProps } from '../Badge/Badge'
import { cx } from '../../utils/cx'

/** Placa de instrumento: aro + face, com moldura de erro opcional. */
function Plate({ error, className, children, ...props }: ComponentProps<'div'> & { error?: boolean }) {
  return (
    <div className={cx('k-panel', 'k-instrument', className)} data-tone="neutral" {...props}>
      <div className="k-panel__face" data-error={error || undefined}>
        {children}
      </div>
    </div>
  )
}

export type GaugeProps = Omit<ComponentProps<'div'>, 'children'> & {
  label: ReactNode
  value: number
  min?: number
  max?: number
  /** Unidade exibida com o valor (padrão: %). */
  unit?: string
  /** Texto do valor; padrão `${value} ${unit}`. */
  format?: (value: number) => string
}

const SWEEP = 120 // graus para cada lado do topo, como as marcas do Figma.

/** Leitura analógica com escala e agulha; o valor também em texto e como `meter`. Figma 16:3896. */
export function Gauge({ label, value, min = 0, max = 100, unit = '%', format = v => `${v} ${unit}`, className, ...props }: GaugeProps) {
  const clamped = Math.min(Math.max(value, min), max)
  const angle = -SWEEP + ((clamped - min) / (max - min)) * SWEEP * 2
  const text = format(value)
  const labelId = useId()
  return (
    <Plate className={cx('k-gauge', className)} {...props}>
      <div role="meter" aria-valuemin={min} aria-valuemax={max} aria-valuenow={clamped} aria-valuetext={text} aria-labelledby={labelId} className="k-gauge__dial">
        <svg viewBox="0 0 170 170" aria-hidden>
          {Array.from({ length: 11 }, (_, i) => (
            <rect key={i} className="k-gauge__tick" x="84.5" y="25" width="1" height="9" transform={`rotate(${-SWEEP + i * 24} 85 85)`} />
          ))}
          <line className="k-gauge__needle" x1="85" y1="85" x2="85" y2="27" style={{ rotate: `${angle}deg` }} />
          <circle className="k-gauge__axis" cx="85" cy="85" r="6.5" />
        </svg>
        <span className="k-gauge__value" aria-hidden>
          {text}
        </span>
      </div>
      <span id={labelId} className="k-instrument__label">
        {label}
      </span>
    </Plate>
  )
}

export type ReadoutProps = Omit<ComponentProps<'div'>, 'children'> & {
  label: ReactNode
  /** `null` = falha de leitura (Figma Error: "---"). */
  value: number | null
  /** Casas inteiras com zeros à esquerda (Figma: "024"). */
  digits?: number
  /** Anunciado junto do valor; inclua também no rótulo para quem lê a tela. */
  unit?: string
  errorLabel?: string
}

/** Leitura numérica em visor âmbar. Figma 16:4161. */
export function Readout({ label, value, digits = 3, unit, errorLabel = 'Falha de leitura', className, ...props }: ReadoutProps) {
  const failed = value === null
  const shown = failed ? '-'.repeat(digits) : String(value).padStart(digits, '0')
  return (
    <Plate error={failed} className={cx('k-readout', className)} {...props}>
      <div className="k-readout__screen">
        <span className="k-readout__value" aria-hidden>
          {shown}
        </span>
        <span className="k-sr-only">{failed ? errorLabel : [value, unit].filter(Boolean).join(' ')}</span>
      </div>
      <span className="k-instrument__label">{label}</span>
    </Plate>
  )
}

export type TerminalProps = ComponentProps<'div'> & { error?: boolean }

/** Registro operacional em tela de monitor; novas linhas são anunciadas (`role="log"`). Figma 16:4244. */
export function Terminal({ error, className, children, ...props }: TerminalProps) {
  return (
    <Plate error={error} className={className}>
      <div role="log" tabIndex={0} className="k-terminal" {...props}>
        {children}
      </div>
    </Plate>
  )
}

export type AnnunciatorProps = Omit<ComponentProps<'div'>, 'children'> & {
  tone?: 'success' | 'warning' | 'error'
  children: ReactNode
}

/** Lente de sinalização com texto: operação, atenção ou bloqueio. Figma 16:4299. */
export function Annunciator({ tone = 'success', className, children, ...props }: AnnunciatorProps) {
  return (
    <Plate role="status" error={tone === 'error'} className={className} {...props}>
      <Badge tone={tone as BadgeProps['tone']}>{children}</Badge>
    </Plate>
  )
}
