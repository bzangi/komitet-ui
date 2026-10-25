import { Children, useState, type ComponentProps, type CSSProperties, type ReactNode } from 'react'
import { Slider } from '../Slider/Slider.js'
import { cx } from '../../utils/cx.js'

/** Propriedades de uma entidade em pares rótulo/valor. Figma 24:3601. */
export function DescriptionList({ className, ...props }: ComponentProps<'dl'>) {
  return <dl className={cx('k-dl', className)} {...props} />
}

export type DescriptionItemProps = Omit<ComponentProps<'div'>, 'children'> & { label: ReactNode; children: ReactNode }

export function DescriptionItem({ label, children, className, ...props }: DescriptionItemProps) {
  return (
    <div className={cx('k-dl__row', className)} {...props}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export type ItemProps = Omit<ComponentProps<'div'>, 'title'> & {
  media?: ReactNode
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
}

/** Linha com identidade, resumo e ação. Figma 17:3419. */
export function Item({ media, title, description, action, className, ...props }: ItemProps) {
  return (
    <div className={cx('k-item', className)} {...props}>
      {media}
      <div className="k-item__summary">
        <div className="k-item__title">{title}</div>
        {description && <div className="k-item__description">{description}</div>}
      </div>
      {action && <div className="k-item__action">{action}</div>}
    </div>
  )
}

export type AspectRatioProps = ComponentProps<'div'> & { ratio?: number }

/** Reserva uma proporção fixa para mapas, imagens e esquemas. Figma 17:3644. */
export function AspectRatio({ ratio = 4 / 3, className, style, ...props }: AspectRatioProps) {
  return <div className={cx('k-aspect', className)} style={{ aspectRatio: ratio, ...style } as CSSProperties} {...props} />
}

export type ResizableProps = Omit<ComponentProps<'div'>, 'children' | 'defaultValue'> & {
  first: ReactNode
  second: ReactNode
  /** Rótulo do controle de divisão. */
  label?: string
  /** Largura do primeiro compartimento, em %. */
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
}

/** Compartimentos ajustáveis por trilho mecânico (o Figma usa um Slider, não uma alça). Figma 17:3470. */
export function Resizable({ first, second, label = 'Largura do índice', value, defaultValue = 50, onValueChange, min = 20, max = 80, className, ...props }: ResizableProps) {
  const [inner, setInner] = useState(defaultValue)
  const v = value ?? inner
  return (
    <div className={cx('k-panel', 'k-resizable', className)} data-tone="neutral" {...props}>
      <div className="k-panel__face">
        <div className="k-resizable__panes" style={{ gridTemplateColumns: `minmax(0, ${v}fr) minmax(0, ${100 - v}fr)` }}>
          <div className="k-resizable__pane">{first}</div>
          <div className="k-resizable__pane">{second}</div>
        </div>
        <Slider label={label} value={v} min={min} max={max} unit="%" onValueChange={n => (setInner(n), onValueChange?.(n))} />
      </div>
    </div>
  )
}

export type CarouselProps = Omit<ComponentProps<'section'>, 'children'> & {
  /** Nome do conjunto de fichas. */
  'aria-label': string
  children: ReactNode
  previousLabel?: string
  nextLabel?: string
}

/** Sequência manual de fichas; nunca avança sozinha. Figma 17:3561. */
export function Carousel({ children, previousLabel = 'Anterior', nextLabel = 'Próximo', className, ...props }: CarouselProps) {
  const slides = Children.toArray(children)
  const [i, setI] = useState(0)
  return (
    <section aria-roledescription="carrossel" className={cx('k-panel', 'k-carousel', className)} data-tone="neutral" {...props}>
      <div className="k-panel__face">
        <div role="group" aria-roledescription="ficha" aria-label={`${i + 1} de ${slides.length}`} className="k-carousel__slide">
          {slides[i]}
        </div>
        <div className="k-carousel__controls">
          <button type="button" disabled={i === 0} onClick={() => setI(i - 1)}>
            <span aria-hidden>‹ </span>
            {previousLabel}
          </button>
          <span aria-live="polite">
            {i + 1} / {slides.length}
          </span>
          <button type="button" disabled={i === slides.length - 1} onClick={() => setI(i + 1)}>
            {nextLabel}
            <span aria-hidden> ›</span>
          </button>
        </div>
      </div>
    </section>
  )
}
