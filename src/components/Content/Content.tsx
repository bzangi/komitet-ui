import type { ComponentProps, CSSProperties, ReactNode } from 'react'
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
