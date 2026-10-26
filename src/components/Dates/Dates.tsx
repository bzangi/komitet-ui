import { useId, useState, type ComponentProps, type ReactNode } from 'react'
import { DayPicker, type DateRange as Range, type Matcher } from 'react-day-picker'
import { ptBR } from 'react-day-picker/locale'
import { Popover as PO } from 'radix-ui'
import { useField } from '../Field/Field.js'
import { Input, InputGroup } from '../Input/Input.js'
import { ThemeScope } from '../../theme/Theme.js'
import { cx } from '../../utils/cx.js'

export type { Range as DateRangeValue }

/* Calendar — grade mensal; dias indisponíveis em `soft`. Figma 16:3364. */
export type CalendarProps = ComponentProps<typeof DayPicker>

const Chevron = ({ orientation }: { orientation?: 'up' | 'down' | 'left' | 'right' }) => <span aria-hidden>{orientation === 'left' ? '‹' : '›'}</span>

export function Calendar({ className, ...props }: CalendarProps) {
  return (
    <div className={cx('k-calendar', className)}>
      <DayPicker
        locale={ptBR}
        // Figma: semana começa na segunda (o locale pt-BR começa no domingo).
        weekStartsOn={1}
        navLayout="around"
        formatters={{ formatWeekdayName: d => d.toLocaleDateString('pt-BR', { weekday: 'narrow' }) }}
        components={{ Chevron }}
        {...props}
      />
    </div>
  )
}

/* Datas em texto dd/mm/aaaa — sem dependência de biblioteca de datas. */
const pad = (n: number) => String(n).padStart(2, '0')
export const formatDate = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`

/** dd/mm/aaaa → Date; `null` se incompleta ou inexistente (ex.: 31/02). */
export function parseDate(text: string): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text.trim())
  if (!m) return null
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const date = new Date(y, mo - 1, d)
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d ? date : null
}

function useDateText(value: Date | null | undefined) {
  const [text, setText] = useState(value ? formatDate(value) : '')
  const [last, setLast] = useState(value)
  // Sincroniza o texto quando o valor muda por fora (ex.: escolha no calendário).
  if (value !== last) {
    setLast(value)
    if (value && formatDate(value) !== text) setText(formatDate(value))
  }
  return [text, setText] as const
}

function CalendarPopover({ label, disabled, children }: { label: string; disabled?: boolean; children: ReactNode }) {
  return (
    <>
      <PO.Trigger className="k-input-group__action" aria-label={label} disabled={disabled}>
        ▾
      </PO.Trigger>
      <PO.Portal>
        <ThemeScope>
          <PO.Content className="k-date__popover" aria-label="Calendário" align="end" sideOffset={8}>
            {children}
          </PO.Content>
        </ThemeScope>
      </PO.Portal>
    </>
  )
}

/* DatePicker — data digitada (dd/mm/aaaa) ou escolhida no calendário. Figma 16:3713. */
export type DatePickerProps = Omit<ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange'> & {
  value?: Date | null
  defaultValue?: Date | null
  onValueChange?: (value: Date | null) => void
  /** Dias indisponíveis no calendário (sintaxe de `Matcher` da react-day-picker). */
  disabledDays?: Matcher | Matcher[]
}

export function DatePicker({ value: valueProp, defaultValue = null, onValueChange, disabledDays, disabled, ...props }: DatePickerProps) {
  const [inner, setInner] = useState(defaultValue)
  const value = valueProp === undefined ? inner : valueProp
  const [text, setText] = useDateText(value)
  const [open, setOpen] = useState(false)
  const commit = (d: Date | null) => (setInner(d), onValueChange?.(d))
  return (
    <PO.Root open={open} onOpenChange={setOpen}>
      <PO.Anchor asChild>
        <InputGroup className="k-date">
          <Input
            inputMode="numeric"
            placeholder="dd/mm/aaaa"
            disabled={disabled}
            {...props}
            value={text}
            onChange={e => {
              setText(e.target.value)
              commit(e.target.value ? parseDate(e.target.value) : null)
            }}
          />
          <CalendarPopover label="Abrir calendário" disabled={disabled}>
            <Calendar
              mode="single"
              selected={value ?? undefined}
              defaultMonth={value ?? undefined}
              disabled={disabledDays}
              autoFocus
              onSelect={d => {
                commit(d ?? null)
                setText(d ? formatDate(d) : '')
                setOpen(false)
              }}
            />
          </CalendarPopover>
        </InputGroup>
      </PO.Anchor>
    </PO.Root>
  )
}

/* DateRange — período com início e fim. Figma 16:3812. */
export type DateRangeProps = {
  value?: Range
  defaultValue?: Range
  onValueChange?: (value: Range) => void
  disabledDays?: Matcher | Matcher[]
  disabled?: boolean
  className?: string
}

/** `true` se o fim é igual ou posterior ao início (ou se falta uma das pontas). */
export const isValidRange = (r: Range) => !r.from || !r.to || r.to >= r.from

export function DateRange({ value: valueProp, defaultValue = { from: undefined }, onValueChange, disabledDays, disabled, className }: DateRangeProps) {
  const [inner, setInner] = useState<Range>(defaultValue)
  const value = valueProp ?? inner
  const [fromText, setFromText] = useDateText(value.from)
  const [toText, setToText] = useDateText(value.to)
  const [open, setOpen] = useState(false)
  const field = useField()
  const toId = useId()
  const commit = (r: Range) => (setInner(r), onValueChange?.(r))
  return (
    <PO.Root open={open} onOpenChange={setOpen}>
      <PO.Anchor asChild>
        <InputGroup role="group" aria-labelledby={field?.labelId} className={cx('k-date', className)}>
          <Input
            aria-label="Data inicial"
            inputMode="numeric"
            placeholder="dd/mm/aaaa"
            disabled={disabled}
            value={fromText}
            onChange={e => (setFromText(e.target.value), commit({ ...value, from: parseDate(e.target.value) ?? undefined }))}
          />
          <span className="k-input-group__addon" aria-hidden>
            —
          </span>
          <Input
            id={toId}
            aria-label="Data final"
            inputMode="numeric"
            placeholder="dd/mm/aaaa"
            disabled={disabled}
            value={toText}
            onChange={e => (setToText(e.target.value), commit({ ...value, to: parseDate(e.target.value) ?? undefined }))}
          />
          <CalendarPopover label="Abrir calendário do período" disabled={disabled}>
            <Calendar
              mode="range"
              selected={value}
              defaultMonth={value.from}
              disabled={disabledDays}
              autoFocus
              onSelect={r => {
                const next = r ?? { from: undefined }
                commit(next)
                setFromText(next.from ? formatDate(next.from) : '')
                setToText(next.to ? formatDate(next.to) : '')
                if (next.from && next.to) setOpen(false)
              }}
            />
          </CalendarPopover>
        </InputGroup>
      </PO.Anchor>
    </PO.Root>
  )
}
