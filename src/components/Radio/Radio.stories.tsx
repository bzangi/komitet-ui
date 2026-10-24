import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play'
import { RadioGroup, RadioGroupItem } from './Radio'

const meta = {
  title: 'Formulários/RadioGroup',
  component: RadioGroup,
  parameters: figma({ RadioGroup: '12:813' }),
} satisfies Meta<typeof RadioGroup>
export default meta
type Story = StoryObj<typeof meta>

export const Estados: Story = {
  render: () => (
    <RadioGroup defaultValue="norte" aria-label="Setor">
      <RadioGroupItem value="norte">Setor norte</RadioGroupItem>
      <RadioGroupItem value="sul">Setor sul</RadioGroupItem>
      <RadioGroupItem value="leste" disabled>
        Bloqueado
      </RadioGroupItem>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    for (const canvas of eachTheme(canvasElement)) {
      const norte = canvas.getByRole('radio', { name: 'Setor norte' })
      await expect(norte).toBeChecked()
      await userEvent.click(canvas.getByText('Setor sul'))
      const sul = canvas.getByRole('radio', { name: 'Setor sul' })
      await expect(sul).toBeChecked()
      sul.focus()
      // Radix move o foco num setTimeout: a tecla precisa estar pressionada quando o foco chega.
      await userEvent.keyboard('{ArrowUp>}')
      await waitFor(() => expect(norte).toBeChecked())
      await userEvent.keyboard('{/ArrowUp}')
    }
  },
}

export const Bloqueados: Story = {
  render: () => (
    <RadioGroup defaultValue="a" disabled aria-label="Bloqueado">
      <RadioGroupItem value="a">Bloqueado e selecionado</RadioGroupItem>
      <RadioGroupItem value="b">Bloqueado</RadioGroupItem>
    </RadioGroup>
  ),
}
