import type { Meta, StoryObj } from '@storybook/react-vite'
import { figma } from '../../../.storybook/play.js'
import { Badge } from './Badge.js'

const meta = {
  title: 'Elementos básicos/Badge',
  component: Badge,
  parameters: figma({ Badge: '10:54' }),
  args: { children: 'Rascunho' },
} satisfies Meta<typeof Badge>
export default meta
type Story = StoryObj<typeof meta>

export const Estados: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <Badge>Rascunho</Badge>
      <Badge tone="success">Disponível</Badge>
      <Badge tone="warning">Atenção</Badge>
      <Badge tone="error">Falha</Badge>
    </div>
  ),
}

export const TextoLongo: Story = {
  name: 'Texto longo e largura estreita',
  render: () => (
    <div style={{ width: 160 }}>
      <Badge tone="warning">Manutenção programada para o próximo turno</Badge>
    </div>
  ),
}
