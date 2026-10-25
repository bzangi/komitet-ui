import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play.js'
import { Field } from '../Field/Field.js'
import { Calendar, DatePicker, DateRange, isValidRange, parseDate, type DateRangeValue } from './Dates.js'

const meta = {
  title: 'Busca e datas/Calendário e datas',
  component: Calendar,
  parameters: figma(
    { Calendar: '16:3364', DatePicker: '16:3713', DateRange: '16:3812' },
    'Calendário com react-day-picker: setas, PageUp/PageDown e Home/End navegam pela grade. Dias indisponíveis em `soft`/`muted`; semana começa na segunda, como no Figma. Datas digitadas em dd/mm/aaaa.',
  ),
} satisfies Meta<typeof Calendar>
export default meta
type Story = StoryObj<typeof meta>

const oct = new Date(2026, 9, 1)
const today = new Date(2026, 9, 22)

export const Calendario: Story = {
  name: 'Calendar',
  render: () => {
    const [d, setD] = useState<Date | undefined>(new Date(2026, 9, 24))
    return <Calendar mode="single" selected={d} onSelect={setD} defaultMonth={oct} disabled={{ before: today }} />
  },
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    await expect(canvas!.getByText('outubro 2026')).toBeVisible()
    const day = canvas!.getByRole('button', { name: /26 de outubro/ })
    await userEvent.click(day)
    await expect(day.closest('td')).toHaveAttribute('aria-selected', 'true')
    await expect(canvas!.getByRole('button', { name: /10 de outubro/ })).toBeDisabled()
  },
}

export const Datas: Story = {
  name: 'DatePicker e DateRange',
  render: () => {
    const [range, setRange] = useState<DateRangeValue>({ from: new Date(2026, 9, 24), to: new Date(2026, 9, 28) })
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 360 }}>
        <Field label="Próxima inspeção">
          <DatePicker defaultValue={new Date(2026, 9, 24)} disabledDays={{ before: today }} />
        </Field>
        <Field label="Próxima inspeção" error="Escolha uma data ou intervalo válido.">
          <DatePicker defaultValue={new Date(2026, 9, 10)} />
        </Field>
        <Field label="Período de inspeção" error={isValidRange(range) ? undefined : 'A data final deve ser igual ou posterior à inicial.'}>
          <DateRange value={range} onValueChange={setRange} />
        </Field>
        <Field label="Próxima inspeção" description="Edição indisponível.">
          <DatePicker defaultValue={new Date(2026, 9, 24)} disabled />
        </Field>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    // Digitação.
    const [input] = canvas!.getAllByLabelText('Próxima inspeção')
    await userEvent.clear(input!)
    await userEvent.type(input!, '30/10/2026')
    // Calendário pelo botão.
    const [open] = canvas!.getAllByRole('button', { name: 'Abrir calendário' })
    await userEvent.click(open!)
    const grid = await screen.findByRole('grid')
    await expect(grid).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: /31 de outubro/ }))
    await waitFor(() => expect(input).toHaveValue('31/10/2026'))
    // Período invertido → erro.
    const fim = canvas!.getByRole('textbox', { name: 'Data final' })
    await userEvent.clear(fim)
    await userEvent.type(fim, '20/10/2026')
    await expect(canvas!.getByRole('group', { name: 'Período de inspeção' })).toBeInTheDocument()
    await expect(fim).toHaveAttribute('aria-invalid', 'true')
    await expect(fim).toHaveAccessibleDescription('A data final deve ser igual ou posterior à inicial.')
  },
}

export const TesteParse: Story = {
  name: 'Teste: leitura de datas',
  render: () => <p>Funções puras: parseDate e isValidRange.</p>,
  play: async () => {
    await expect(parseDate('24/10/2026')?.getDate()).toBe(24)
    await expect(parseDate('31/02/2026')).toBeNull()
    await expect(parseDate('2026-10-24')).toBeNull()
    await expect(isValidRange({ from: new Date(2026, 9, 28), to: new Date(2026, 9, 24) })).toBe(false)
    await expect(isValidRange({ from: new Date(2026, 9, 24), to: new Date(2026, 9, 24) })).toBe(true)
  },
}
