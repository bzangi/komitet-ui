import type { Meta, StoryObj } from '@storybook/react-vite'
import { figma } from '../../../.storybook/play.js'
import { Separator } from './Basics.js'

const meta = {
  title: 'Elementos básicos/Separator',
  component: Separator,
  parameters: figma({ Separator: '10:258' }),
} satisfies Meta<typeof Separator>
export default meta
type Story = StoryObj<typeof meta>

export const Orientacoes: Story = {
  name: 'Orientações',
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 300 }}>
      <p style={{ margin: 0 }}>Procedimentos da unidade</p>
      <Separator />
      <div style={{ display: 'flex', gap: 12, height: 24, alignItems: 'center' }}>
        <span>Norte</span>
        <Separator orientation="vertical" />
        <span>Sul</span>
      </div>
    </div>
  ),
}
