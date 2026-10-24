import { useSyncExternalStore, type ComponentProps, type ReactNode } from 'react'
import { Toast as ToastPrimitive } from 'radix-ui'
import { cx } from '../../utils/cx.js'

type Tone = 'default' | 'warning' | 'error'

export type AlertProps = Omit<ComponentProps<'div'>, 'title'> & {
  /** Default usa a moldura `good`; o título nomeia a situação. */
  tone?: Tone
  title: ReactNode
}

/** Aviso persistente e contextual. Erro é anunciado como `alert`; os demais, como `status`. Figma 14:2337. */
export function Alert({ tone = 'default', title, className, children, ...props }: AlertProps) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cx('k-panel', className)} data-tone={tone} {...props}>
      <div className="k-panel__face">
        <p className="k-panel__title">{title}</p>
        {children && <div className="k-panel__body">{children}</div>}
      </div>
    </div>
  )
}

export type EmptyProps = Omit<ComponentProps<'div'>, 'title'> & { title: ReactNode; action?: ReactNode }

/** Ausência de conteúdo com uma ação para começar. Figma 14:2461. */
export function Empty({ title, action, className, children, ...props }: EmptyProps) {
  return (
    <div className={cx('k-panel', className)} data-tone="neutral" {...props}>
      <div className="k-panel__face">
        <p className="k-panel__title">{title}</p>
        {children && <div className="k-panel__body">{children}</div>}
        {action && <div className="k-panel__action">{action}</div>}
      </div>
    </div>
  )
}

/* Toast — store mínima para o `toast()` imperativo. */
type ToastItem = { id: number; title: ReactNode; description?: ReactNode; tone: Exclude<Tone, 'warning'>; duration?: number }
let items: ToastItem[] = []
let nextId = 0
const listeners = new Set<() => void>()
const emit = () => listeners.forEach(l => l())
const subscribe = (l: () => void) => (listeners.add(l), () => listeners.delete(l))

/** Confirmação breve. Mensagens importantes também precisam de um local persistente. */
export function toast(item: Omit<ToastItem, 'id' | 'tone'> & { tone?: ToastItem['tone'] }) {
  const id = nextId++
  items = [...items, { tone: 'default', ...item, id }]
  emit()
  return id
}

const dismiss = (id: number) => {
  items = items.filter(t => t.id !== id)
  emit()
}

export type ToasterProps = Omit<ComponentProps<typeof ToastPrimitive.Provider>, 'children'> & { label?: string }

/** Renderize uma vez, dentro do `<Theme>`. Figma 14:2410. */
export function Toaster({ label = 'Notificações', duration = 6000, ...props }: ToasterProps) {
  const list = useSyncExternalStore(subscribe, () => items, () => items)
  return (
    <ToastPrimitive.Provider label={label} duration={duration} {...props}>
      {list.map(t => (
        <ToastPrimitive.Root
          key={t.id}
          className="k-panel k-toast"
          data-tone={t.tone}
          type={t.tone === 'error' ? 'foreground' : 'background'}
          duration={t.duration}
          onOpenChange={open => !open && dismiss(t.id)}
        >
          <div className="k-panel__face">
            <ToastPrimitive.Title className="k-panel__title">{t.title}</ToastPrimitive.Title>
            {t.description && <ToastPrimitive.Description className="k-panel__body">{t.description}</ToastPrimitive.Description>}
          </div>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="k-toast-viewport" label={`${label} ({hotkey})`} />
    </ToastPrimitive.Provider>
  )
}
