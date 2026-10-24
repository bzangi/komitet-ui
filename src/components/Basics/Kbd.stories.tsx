import type { Meta, StoryObj } from '@storybook/react-vite'
import { figma } from '../../../.storybook/play.js'
import { Kbd } from './Basics.js'

const meta = {
  title: 'Elementos básicos/Kbd',
  component: Kbd,
  parameters: figma({ Kbd: '10:203' }),
  args: { children: 'Ctrl' },
} satisfies Meta<typeof Kbd>
export default meta
type Story = StoryObj<typeof meta>

export const Teclas: Story = {
  render: () => (
    <p style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', margin: 0 }}>
      <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd> confirma · <Kbd>Esc</Kbd> cancela
    </p>
  ),
}
