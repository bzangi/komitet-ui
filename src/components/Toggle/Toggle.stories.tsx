import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play.js'
import { ButtonGroup, ButtonGroupItem, Toggle, ToggleGroup, ToggleGroupItem } from './Toggle.js'

const meta = {
  title: 'Ações/Toggle e grupos',
  component: Toggle,
  subcomponents: { ButtonGroup, ButtonGroupItem, ToggleGroup, ToggleGroupItem },
  parameters: figma(
    { Toggle: '11:578', SignalButton: '11:519', ButtonGroup: '11:635', ToggleGroup: '11:702' },
    'SignalButton = `<Toggle variant="signal">`. Em ButtonGroup, o item destacado (`primary`) é ênfase de comando; em ToggleGroup, é seleção.',
  ),
  args: { children: 'Fixar painel' },
} satisfies Meta<typeof Toggle>
export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 } as const

export const Teclas: Story = {
  render: () => (
    <>
      <div style={row}>
        <Toggle>Fixar painel</Toggle>
        <Toggle defaultPressed>Fixar painel</Toggle>
        <Toggle disabled>Bloqueado</Toggle>
      </div>
      <div style={row}>
        <Toggle variant="signal">Reserva</Toggle>
        <Toggle variant="signal" defaultPressed>
          Reserva
        </Toggle>
        <Toggle variant="signal" disabled>
          Bloqueado
        </Toggle>
      </div>
    </>
  ),
}

export const Grupos: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <ButtonGroup aria-label="Comandos do registro">
        <ButtonGroupItem primary>Manual</ButtonGroupItem>
        <ButtonGroupItem>Automático</ButtonGroupItem>
      </ButtonGroup>
      <ToggleGroup type="single" defaultValue="manual" aria-label="Regime">
        <ToggleGroupItem value="manual">Manual</ToggleGroupItem>
        <ToggleGroupItem value="auto">Automático</ToggleGroupItem>
        <ToggleGroupItem value="off" disabled>
          Desligado
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
}

export const TesteToggle: Story = {
  name: 'Teste: Toggle mantém o rótulo e alterna aria-pressed',
  args: { onPressedChange: fn() },
  play: async ({ args, canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const t = canvas!.getByRole('button', { name: 'Fixar painel' })
    await expect(t).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(t)
    await expect(t).toHaveAttribute('aria-pressed', 'true')
    t.focus()
    await userEvent.keyboard(' ')
    await expect(t).toHaveAttribute('aria-pressed', 'false')
    await expect(args.onPressedChange).toHaveBeenCalledTimes(2)
  },
}

export const TesteToggleGroup: Story = {
  name: 'Teste: ToggleGroup com setas',
  render: Grupos.render,
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const manual = canvas!.getByRole('radio', { name: 'Manual' })
    await expect(manual).toBeChecked()
    manual.focus()
    await userEvent.keyboard('{ArrowRight}')
    const auto = canvas!.getByRole('radio', { name: 'Automático' })
    await expect(auto).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(auto).toBeChecked()
    await expect(manual).not.toBeChecked()
  },
}
