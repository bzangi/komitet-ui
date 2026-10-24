import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play.js'
import { Avatar } from './Basics.js'

const meta = {
  title: 'Elementos básicos/Avatar',
  component: Avatar,
  parameters: figma({ Avatar: '10:7' }),
  args: { name: 'Ana Martins' },
} satisfies Meta<typeof Avatar>
export default meta
type Story = StoryObj<typeof meta>

export const Estados: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Avatar name="Ana Martins" />
      <Avatar name="Iuri Pavlovich Sokolov" />
      <Avatar />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const canvas of eachTheme(canvasElement)) {
      await expect(canvas.getByRole('img', { name: 'Ana Martins' })).toHaveTextContent('AM')
      await expect(canvas.getByRole('img', { name: 'Iuri Pavlovich Sokolov' })).toHaveTextContent('IS')
      await expect(canvas.getByRole('img', { name: 'Identidade indisponível' })).toHaveTextContent('?')
    }
  },
}
