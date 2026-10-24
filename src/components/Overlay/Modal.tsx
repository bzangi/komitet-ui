import type { ComponentProps, ElementType, ReactNode } from 'react'
import { AlertDialog as AlertPrimitive, Dialog as DialogPrimitive } from 'radix-ui'
import { ThemeScope } from '../../theme/Theme.js'
import { cx } from '../../utils/cx.js'

type FrameProps = {
  title: ReactNode
  /** Texto principal; vira a descrição acessível. */
  description?: ReactNode
  /** Botões do rodapé (use `DialogClose asChild` para fechar). */
  actions?: ReactNode
  /** Moldura da face: falha (`bad`) ou conclusão (`good`). */
  status?: 'error' | 'success'
  children?: ReactNode
}

type Parts = { Title: ElementType; Description: ElementType }

function Frame({ title, description, actions, status, children, parts, alert }: FrameProps & { parts: Parts; alert?: boolean }) {
  return (
    <div className="k-modal__face" data-status={status}>
      <div className="k-modal__header" data-alert={alert || undefined}>
        <parts.Title className="k-modal__title">{title}</parts.Title>
      </div>
      <div className="k-modal__body">
        {description && <parts.Description className="k-modal__description">{description}</parts.Description>}
        {children}
      </div>
      {actions && <div className="k-modal__actions">{actions}</div>}
    </div>
  )
}

export type DialogContentProps = Omit<ComponentProps<typeof DialogPrimitive.Content>, 'title'> & FrameProps

function content(placement: 'center' | 'right' | 'bottom') {
  return function Content({ title, description, actions, status, children, className, ...props }: DialogContentProps) {
    return (
      <DialogPrimitive.Portal>
        <ThemeScope>
          <DialogPrimitive.Overlay className="k-modal__overlay" />
          <DialogPrimitive.Content
            className={cx('k-modal', className)}
            data-placement={placement}
            // Sem descrição, desliga o aviso do Radix e não aponta para um id inexistente.
            {...(description ? {} : { 'aria-describedby': undefined })}
            {...props}
          >
            <Frame title={title} description={description} actions={actions} status={status} parts={DialogPrimitive}>
              {children}
            </Frame>
          </DialogPrimitive.Content>
        </ThemeScope>
      </DialogPrimitive.Portal>
    )
  }
}

/** Camada para decisão ou edição curta. Figma 15:2163. */
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogContent = content('center')

/** Compartimento lateral para detalhes e ajustes. Figma 15:2657. Use com `Dialog` + `DialogTrigger`. */
export const SheetContent = content('right')

/** Gaveta de comandos presa à base da tela. Figma 15:2888. Use com `Dialog` + `DialogTrigger`. */
export const DrawerContent = content('bottom')

/** Confirmação de ação destrutiva: só fecha pelas ações. Figma 15:2474. */
export const AlertDialog = AlertPrimitive.Root
export const AlertDialogTrigger = AlertPrimitive.Trigger
export const AlertDialogAction = AlertPrimitive.Action
export const AlertDialogCancel = AlertPrimitive.Cancel

export type AlertDialogContentProps = Omit<ComponentProps<typeof AlertPrimitive.Content>, 'title'> & FrameProps & { description: ReactNode }

export function AlertDialogContent({ title, description, actions, status, children, className, ...props }: AlertDialogContentProps) {
  return (
    <AlertPrimitive.Portal>
      <ThemeScope>
        <AlertPrimitive.Overlay className="k-modal__overlay" />
        <AlertPrimitive.Content className={cx('k-modal', className)} data-placement="center" {...props}>
          <Frame title={title} description={description} actions={actions} status={status} parts={AlertPrimitive} alert>
            {children}
          </Frame>
        </AlertPrimitive.Content>
      </ThemeScope>
    </AlertPrimitive.Portal>
  )
}
