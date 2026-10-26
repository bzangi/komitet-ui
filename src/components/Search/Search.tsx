import { useId, useState, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react'
import { Command as CommandPrimitive, useCommandState } from 'cmdk'
import { OTPInput, REGEXP_ONLY_DIGITS } from 'input-otp'
import { Popover as PO } from 'radix-ui'
import { useFieldControl } from '../Field/Field.js'
import { ThemeScope } from '../../theme/Theme.js'
import { cx } from '../../utils/cx.js'

/* Command — central de ações pesquisáveis. Figma 16:2847. */
export type CommandProps = Omit<ComponentProps<typeof CommandPrimitive>, 'title'> & {
  title?: ReactNode
  /** Nome acessível (padrão: o título, quando é texto). */
  label?: string
  placeholder?: string
  emptyText?: ReactNode
}

export function Command({ title, label, placeholder = 'Buscar comando…', emptyText = 'Nenhum resultado. Tente outro termo.', className, children, ...props }: CommandProps) {
  return (
    <CommandPrimitive label={label ?? (typeof title === 'string' ? title : undefined)} className={cx('k-command', className)} {...props}>
      <div className="k-command__face">
        {title && <p className="k-popup__title">{title}</p>}
        <div className="k-command__search">
          <CommandPrimitive.Input placeholder={placeholder} />
        </div>
        <Results>{children}</Results>
        <CommandPrimitive.Empty className="k-command__empty">{emptyText}</CommandPrimitive.Empty>
      </div>
    </CommandPrimitive>
  )
}

/** Sem resultados, a lista fica oculta: um `listbox` vazio é inválido para tecnologias assistivas. */
function Results({ children }: { children: ReactNode }) {
  const count = useCommandState(state => state.filtered.count)
  return (
    <CommandPrimitive.List label="Resultados" hidden={count === 0}>
      {children}
    </CommandPrimitive.List>
  )
}

export function CommandItem({ className, ...props }: ComponentProps<typeof CommandPrimitive.Item>) {
  return <CommandPrimitive.Item className={cx('k-menu__item', className)} {...props} />
}

/* Combobox — busca e seleção assistida (padrão combobox da WAI-ARIA). Figma 16:2988. */
export type ComboboxOption = { value: string; label: string; disabled?: boolean }

export type ComboboxProps = Omit<ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange'> & {
  options: ComboboxOption[]
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  emptyText?: ReactNode
}

export function Combobox({ options, value: valueProp, defaultValue = null, onValueChange, emptyText = 'Nenhuma opção encontrada.', className, disabled, ...props }: ComboboxProps) {
  const [inner, setInner] = useState(defaultValue)
  const value = valueProp === undefined ? inner : valueProp
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState<string | null>(null) // null = ainda não digitou desde que abriu
  const [active, setActive] = useState(0)
  const listId = useId()
  const current = options.find(o => o.value === value)
  const q = (query ?? '').trim().toLowerCase()
  const shown = open && q ? options.filter(o => o.label.toLowerCase().includes(q)) : options
  const optionId = (i: number) => `${listId}-${i}`

  const choose = (o: ComboboxOption) => {
    if (o.disabled) return
    setInner(o.value)
    onValueChange?.(o.value)
    setOpen(false)
    setQuery(null)
  }
  const show = (input: HTMLInputElement) => {
    setActive(Math.max(0, options.findIndex(o => o.value === value)))
    setOpen(true)
    input.select()
  }
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) return show(e.currentTarget)
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActive(a => (a + step + shown.length) % Math.max(shown.length, 1))
    } else if (e.key === 'Enter' && open && shown[active]) {
      e.preventDefault()
      choose(shown[active]!)
    } else if (e.key === 'Escape' && open) {
      e.preventDefault()
      setOpen(false)
      setQuery(null)
    }
  }

  return (
    <PO.Root open={open} onOpenChange={o => (setOpen(o), o || setQuery(null))}>
      <PO.Anchor asChild>
        <span className={cx('k-select', 'k-combobox', className)}>
          <input
            className="k-input"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && shown[active] ? optionId(active) : undefined}
            autoComplete="off"
            disabled={disabled}
            {...useFieldControl(props)}
            value={open && query !== null ? query : (current?.label ?? '')}
            onChange={e => {
              setQuery(e.target.value)
              setActive(0)
              setOpen(true)
            }}
            onKeyDown={onKeyDown}
            onClick={e => (open ? setOpen(false) : show(e.currentTarget))}
          />
        </span>
      </PO.Anchor>
      <PO.Portal>
        <ThemeScope>
          <PO.Content
            className="k-combobox__list"
            aria-label="Opções"
            align="start"
            sideOffset={8}
            onOpenAutoFocus={e => e.preventDefault()}
            onInteractOutside={e => (e.target as Element).closest?.('.k-combobox') && e.preventDefault()}
          >
            <ul id={listId} role="listbox">
              {shown.map((o, i) => (
                <li
                  key={o.value}
                  id={optionId(i)}
                  role="option"
                  aria-selected={o.value === value}
                  aria-disabled={o.disabled || undefined}
                  data-highlighted={i === active || undefined}
                  className="k-menu__item"
                  onPointerMove={() => setActive(i)}
                  onPointerDown={e => e.preventDefault()}
                  onClick={() => choose(o)}
                >
                  {o.label}
                </li>
              ))}
              {shown.length === 0 && <li className="k-command__empty">{emptyText}</li>}
            </ul>
          </PO.Content>
        </ThemeScope>
      </PO.Portal>
    </PO.Root>
  )
}

/* InputOTP — código de 6 dígitos em encaixes. Figma 16:3097. */
export type InputOTPProps = Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'maxLength' | 'children'> & {
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  length?: number
}

export function InputOTP({ length = 6, className, ...props }: InputOTPProps) {
  const field = useFieldControl(props)
  return (
    <OTPInput
      maxLength={length}
      pattern={REGEXP_ONLY_DIGITS}
      inputMode="numeric"
      autoComplete="one-time-code"
      containerClassName={cx('k-otp', className)}
      {...field}
      render={({ slots }) => (
        <div className="k-otp__slots" aria-hidden>
          {slots.map((slot, i) => (
            <span key={i} className="k-otp__slot" data-active={slot.isActive || undefined}>
              {slot.char ?? '·'}
            </span>
          ))}
        </div>
      )}
    />
  )
}
