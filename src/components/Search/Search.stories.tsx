import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play.js'
import { Field } from '../Field/Field.js'
import { Combobox, Command, CommandItem, InputOTP } from './Search.js'

const meta = {
  title: 'Busca e datas/Command, Combobox e InputOTP',
  component: Command,
  subcomponents: { Combobox, InputOTP },
  parameters: figma(
    { Command: '16:2847', Combobox: '16:2988', InputOTP: '16:3097' },
    'Command usa cmdk. Combobox segue o padrão combobox da WAI-ARIA sobre o Popover do Radix: digite para filtrar, setas para navegar, Enter para escolher, Esc para fechar.',
    'CommandItem (cmdk: `onSelect`, `value`, `disabled`).',
  ),
} satisfies Meta<typeof Command>
export default meta
type Story = StoryObj<typeof meta>

const units = [
  { value: 'aurora', label: 'Unidade Aurora' },
  { value: 'volga', label: 'Unidade Volga' },
  { value: 'zarya', label: 'Unidade Zarya' },
]

export const Comandos: Story = {
  name: 'Command',
  args: { onSelect: fn() } as never,
  render: args => (
    <div style={{ maxWidth: 360 }}>
      <Command title="CENTRAL DE COMANDOS">
        {['Criar ficha', 'Abrir arquivo', 'Buscar documento'].map(c => (
          <CommandItem key={c} onSelect={(args as unknown as { onSelect: (v: string) => void }).onSelect}>
            {c}
          </CommandItem>
        ))}
      </Command>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const input = canvas!.getByPlaceholderText('Buscar comando…')
    await userEvent.type(input, 'arq')
    await expect(canvas!.getAllByRole('option')).toHaveLength(1)
    await userEvent.keyboard('{Enter}')
    await expect((args as unknown as { onSelect: () => void }).onSelect).toHaveBeenCalledTimes(1)
    await userEvent.clear(input)
    await userEvent.type(input, 'xyz')
    await expect(canvas!.getByText('Nenhum resultado. Tente outro termo.')).toBeVisible()
  },
}

export const Selecao: Story = {
  name: 'Combobox',
  render: () => {
    const [v, setV] = useState<string | null>('aurora')
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 300 }}>
        <Field label="Unidade de operação">
          <Combobox options={units} value={v} onValueChange={setV} />
        </Field>
        <Field label="Unidade de operação" error="Escolha uma unidade disponível.">
          <Combobox options={units} placeholder="Selecione uma unidade" />
        </Field>
        <Field label="Unidade de operação" description="Edição indisponível.">
          <Combobox options={units} defaultValue="aurora" disabled />
        </Field>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const [box] = canvas!.getAllByRole('combobox', { name: 'Unidade de operação' })
    await expect(box).toHaveAttribute('aria-expanded', 'false')
    await expect(box).toHaveValue('Unidade Aurora')
    box!.focus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(box).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('zar')
    await expect(await screen.findAllByRole('option')).toHaveLength(1)
    await userEvent.keyboard('{Enter}')
    await expect(box).toHaveValue('Unidade Zarya')
    await waitFor(() => expect(box).toHaveAttribute('aria-expanded', 'false'))
  },
}

export const Codigo: Story = {
  name: 'InputOTP',
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 300 }}>
      <Field label="Código de acesso">
        <InputOTP />
      </Field>
      <Field label="Código de acesso" error="Use apenas números.">
        <InputOTP defaultValue="12" />
      </Field>
      <Field label="Código de acesso" description="Edição indisponível.">
        <InputOTP disabled />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const [input] = canvas!.getAllByLabelText('Código de acesso')
    await userEvent.click(input!)
    await userEvent.keyboard('12ab34')
    await expect(input).toHaveValue('1234')
  },
}

export const ComboboxAberto: Story = {
  name: 'Teste: Combobox aberto (a11y)',
  tags: ['!autodocs'],
  render: () => (
    <div style={{ maxWidth: 300, height: 220 }}>
      <Field label="Unidade de operação">
        <Combobox options={units} defaultValue="aurora" />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const box = canvas!.getByRole('combobox', { name: 'Unidade de operação' })
    box.focus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(await screen.findByRole('listbox')).toBeVisible()
    await expect(box).toHaveAttribute('aria-activedescendant')
  },
}
