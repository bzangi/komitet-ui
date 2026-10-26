import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play.js'
import { Switch } from './Switch.js'

const meta = {
  title: 'Formulários/Switch',
  component: Switch,
  parameters: figma({ Switch: '12:916' }),
  args: { children: 'Alimentação' },
} satisfies Meta<typeof Switch>
export default meta
type Story = StoryObj<typeof meta>

const col = { display: 'grid', gap: 8, justifyItems: 'start' } as const

export const Estados: Story = {
  render: () => (
    <div style={col}>
      <Switch>Alimentação desligada</Switch>
      <Switch defaultChecked>Alimentação ligada</Switch>
      <Switch disabled>Bloqueado</Switch>
      <Switch disabled defaultChecked>
        Bloqueado e ligado
      </Switch>
    </div>
  ),
}

/** O Figma troca o texto junto com a posição: o rótulo também descreve o estado. */
export const RotuloDoEstado: Story = {
  name: 'Composição: rótulo acompanha o estado',
  render: () => {
    const [on, setOn] = useState(false)
    return (
      <Switch checked={on} onCheckedChange={setOn}>
        Alimentação {on ? 'ligada' : 'desligada'}
      </Switch>
    )
  },
}

export const TesteInteracao: Story = {
  name: 'Teste: clique, teclado e bloqueio',
  tags: ['!autodocs'],
  render: () => (
    <div style={col}>
      <Switch>Alimentação</Switch>
      <Switch disabled>Bloqueado</Switch>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const canvas of eachTheme(canvasElement)) {
      const sw = canvas.getByRole('switch', { name: 'Alimentação' })
      await userEvent.click(canvas.getByText('Alimentação'))
      await expect(sw).toBeChecked()
      sw.focus()
      await userEvent.keyboard(' ')
      await expect(sw).not.toBeChecked()
      const blocked = canvas.getByRole('switch', { name: 'Bloqueado' })
      await userEvent.click(blocked)
      await expect(blocked).not.toBeChecked()
    }
  },
}
