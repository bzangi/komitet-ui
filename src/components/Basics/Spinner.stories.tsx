import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play'
import { Spinner } from './Basics'

const meta = {
  title: 'Elementos básicos/Spinner',
  component: Spinner,
  parameters: figma({ Spinner: '10:141' }, 'O anel gira para indicar atividade (interpretação: o Figma é estático) e para com `prefers-reduced-motion`.'),
  args: { label: 'Conferindo…' },
} satisfies Meta<typeof Spinner>
export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: 'Padrão',
  play: async ({ canvasElement }) => {
    for (const canvas of eachTheme(canvasElement)) await expect(canvas.getByRole('status')).toHaveTextContent('Conferindo…')
  },
}
