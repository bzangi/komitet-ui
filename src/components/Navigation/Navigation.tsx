import { Children, type ComponentProps, type ReactNode } from 'react'
import { Accordion as AccordionPrimitive, Collapsible as CollapsiblePrimitive, Slot, Tabs as TabsPrimitive } from 'radix-ui'
import { cx } from '../../utils/cx'

/* Tabs — Figma 14:2021 (mesmos segmentos do ToggleGroup). */
export const Tabs = TabsPrimitive.Root

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cx('k-segments', className)} {...props} />
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return <TabsPrimitive.Trigger className={cx('k-segment', className)} {...props} />
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cx('k-tabs__content', className)} {...props} />
}

/* Breadcrumb — Figma 14:2104. O último item é a localização atual. */
export type BreadcrumbProps = ComponentProps<'nav'> & { children: ReactNode }

export function Breadcrumb({ className, children, 'aria-label': label = 'Trilha de navegação', ...props }: BreadcrumbProps) {
  const items = Children.toArray(children)
  return (
    <nav aria-label={label} className={cx('k-breadcrumb', className)} {...props}>
      <ol>
        {items.map((item, i) => (
          <li key={i} aria-current={i === items.length - 1 ? 'page' : undefined}>
            {item}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/* Accordion (14:2129) e Collapsible (14:2178) — cabeçalho emoldurado com + / −. */
export type AccordionProps = ComponentProps<typeof AccordionPrimitive.Root>

export function Accordion({ className, ...props }: AccordionProps) {
  return <AccordionPrimitive.Root className={cx('k-accordion', className)} {...props} />
}

export type AccordionItemProps = Omit<ComponentProps<typeof AccordionPrimitive.Item>, 'title'> & { title: ReactNode }

export function AccordionItem({ title, className, children, ...props }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item className={cx('k-disclosure', className)} {...props}>
      <AccordionPrimitive.Header asChild>
        <h3 className="k-disclosure__heading">
          <AccordionPrimitive.Trigger className="k-disclosure__trigger">{title}</AccordionPrimitive.Trigger>
        </h3>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="k-disclosure__content">{children}</AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

export type CollapsibleProps = Omit<ComponentProps<typeof CollapsiblePrimitive.Root>, 'title'> & { title: ReactNode }

export function Collapsible({ title, className, children, ...props }: CollapsibleProps) {
  return (
    <CollapsiblePrimitive.Root className={cx('k-disclosure', className)} {...props}>
      <CollapsiblePrimitive.Trigger className="k-disclosure__trigger">{title}</CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content className="k-disclosure__content">{children}</CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  )
}

/* Sidebar — índice da unidade numa placa. Figma 14:2227. */
export type SidebarProps = Omit<ComponentProps<'nav'>, 'title'> & { title?: ReactNode }

export function Sidebar({ title, className, children, ...props }: SidebarProps) {
  return (
    <nav className={cx('k-sidebar', className)} {...props}>
      <div className="k-sidebar__face">
        {title && <p className="k-sidebar__title">{title}</p>}
        <ul>{Children.map(children, child => child && <li>{child}</li>)}</ul>
      </div>
    </nav>
  )
}

export type SidebarItemProps = ComponentProps<'a'> & { current?: boolean; asChild?: boolean }

/** Link do índice. `asChild` aceita o `Link` do seu router. */
export function SidebarItem({ current, asChild, className, ...props }: SidebarItemProps) {
  const Root = asChild ? Slot.Root : 'a'
  return <Root className={cx('k-sidebar__item', className)} aria-current={current ? 'page' : undefined} {...props} />
}
