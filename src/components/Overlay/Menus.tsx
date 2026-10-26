import { useId, useRef, useState, type ComponentProps, type PointerEvent, type ReactNode } from 'react'
import { ContextMenu as CM, DropdownMenu as DM, Menubar as MB, Popover as PO, Tooltip as TT } from 'radix-ui'
import { ThemeScope } from '../../theme/Theme.js'
import { cx } from '../../utils/cx.js'

type PanelProps = { title?: ReactNode }

/* Menus — DropdownMenu 15:3086, ContextMenu 15:3261, Menubar 15:3416. Item realçado = estado Selected do Figma. */
export const DropdownMenu = DM.Root
export const DropdownMenuTrigger = DM.Trigger

export function DropdownMenuContent({ title, className, children, sideOffset = 4, ...props }: Omit<ComponentProps<typeof DM.Content>, 'title'> & PanelProps) {
  return (
    <DM.Portal>
      <ThemeScope>
        <DM.Content className={cx('k-popup', className)} sideOffset={sideOffset} {...props}>
          {title && <DM.Label className="k-popup__title">{title}</DM.Label>}
          {children}
        </DM.Content>
      </ThemeScope>
    </DM.Portal>
  )
}

export function DropdownMenuItem({ className, ...props }: ComponentProps<typeof DM.Item>) {
  return <DM.Item className={cx('k-menu__item', className)} {...props} />
}

/** Ofereça as mesmas ações num controle visível (ex.: DropdownMenu): o clique direito não é descobrível. */
export const ContextMenu = CM.Root
export const ContextMenuTrigger = CM.Trigger

export function ContextMenuContent({ title, className, children, ...props }: Omit<ComponentProps<typeof CM.Content>, 'title'> & PanelProps) {
  return (
    <CM.Portal>
      <ThemeScope>
        <CM.Content className={cx('k-popup', className)} {...props}>
          {title && <CM.Label className="k-popup__title">{title}</CM.Label>}
          {children}
        </CM.Content>
      </ThemeScope>
    </CM.Portal>
  )
}

export function ContextMenuItem({ className, ...props }: ComponentProps<typeof CM.Item>) {
  return <CM.Item className={cx('k-menu__item', className)} {...props} />
}

export function Menubar({ className, ...props }: ComponentProps<typeof MB.Root>) {
  return <MB.Root className={cx('k-segments', className)} {...props} />
}

export const MenubarMenu = MB.Menu

export function MenubarTrigger({ className, ...props }: ComponentProps<typeof MB.Trigger>) {
  return <MB.Trigger className={cx('k-segment', className)} {...props} />
}

export function MenubarContent({ title, className, children, sideOffset = 4, align = 'start', ...props }: Omit<ComponentProps<typeof MB.Content>, 'title'> & PanelProps) {
  return (
    <MB.Portal>
      <ThemeScope>
        <MB.Content className={cx('k-popup', className)} sideOffset={sideOffset} align={align} {...props}>
          {title && <MB.Label className="k-popup__title">{title}</MB.Label>}
          {children}
        </MB.Content>
      </ThemeScope>
    </MB.Portal>
  )
}

export function MenubarItem({ className, ...props }: ComponentProps<typeof MB.Item>) {
  return <MB.Item className={cx('k-menu__item', className)} {...props} />
}

/* Popover — ficha aberta por ação explícita. Figma 15:3499. */
export const Popover = PO.Root
export const PopoverTrigger = PO.Trigger
export const PopoverClose = PO.Close

/** A camada é um `dialog`: o título vira o nome acessível; sem título, informe `aria-label`. */
export function PopoverContent({ title, className, children, sideOffset = 4, ...props }: Omit<ComponentProps<typeof PO.Content>, 'title'> & PanelProps) {
  const titleId = useId()
  return (
    <PO.Portal>
      <ThemeScope>
        <PO.Content className={cx('k-popup', className)} sideOffset={sideOffset} aria-labelledby={title ? titleId : undefined} {...props}>
          {title && (
            <p id={titleId} className="k-popup__title">
              {title}
            </p>
          )}
          <div className="k-popup__body">{children}</div>
        </PO.Content>
      </ThemeScope>
    </PO.Portal>
  )
}

/* Tooltip — ajuda curta; abre com hover e foco, fecha com Esc. Figma 15:3561. */
export type TooltipProps = Omit<ComponentProps<typeof TT.Content>, 'content' | 'title'> &
  PanelProps & { content: ReactNode; children: ReactNode; delayDuration?: number }

export function Tooltip({ title, content, children, className, sideOffset = 4, delayDuration = 300, ...props }: TooltipProps) {
  return (
    <TT.Provider delayDuration={delayDuration}>
      <TT.Root>
        <TT.Trigger asChild>{children}</TT.Trigger>
        <TT.Portal>
          <ThemeScope>
            <TT.Content className={cx('k-popup', 'k-tooltip', className)} sideOffset={sideOffset} {...props}>
              {title && <p className="k-popup__title">{title}</p>}
              <div className="k-popup__body">{content}</div>
            </TT.Content>
          </ThemeScope>
        </TT.Portal>
      </TT.Root>
    </TT.Provider>
  )
}

/* HoverCard — complemento sobre pessoa/entidade; hover, foco por teclado ou clique. Figma 15:3530. */
export type HoverCardProps = Omit<ComponentProps<typeof PO.Content>, 'content' | 'title'> &
  PanelProps & { content: ReactNode; children: ReactNode; openDelay?: number; closeDelay?: number }

export function HoverCard({ title, content, children, openDelay = 400, closeDelay = 200, ...props }: HoverCardProps) {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const later = (value: boolean, ms: number) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(value), ms)
  }
  const hover = {
    onPointerEnter: (e: PointerEvent) => e.pointerType === 'mouse' && later(true, openDelay),
    onPointerLeave: (e: PointerEvent) => e.pointerType === 'mouse' && later(false, closeDelay),
  }
  return (
    <PO.Root open={open} onOpenChange={setOpen}>
      <PO.Trigger asChild {...hover} onFocus={e => e.currentTarget.matches(':focus-visible') && setOpen(true)}>
        {children}
      </PO.Trigger>
      <PopoverContent title={title} onOpenAutoFocus={e => e.preventDefault()} {...hover} {...props}>
        {content}
      </PopoverContent>
    </PO.Root>
  )
}
