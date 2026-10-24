import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play'
import { Slider } from './Slider'

const meta = {
  title: 'Formulários/Slider',
  component: Slider,
  parameters: figma({ Slider: '12:1087' }, 'O valor e a unidade ficam visíveis no rótulo e são anunciados via `aria-valuetext`.'),
  args: { label: 'Nível de operação', defaultValue: 60, unit: '%' },
} satisfies Meta<typeof Slider>
export default meta
type Story = StoryObj<typeof meta>

export const Estados: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 292 }}>
      <Slider label="Nível de operação" defaultValue={60} unit="%" />
      <Slider label="Nível bloqueado" defaultValue={40} unit="%" disabled />
    </div>
  ),
}

export const TesteTeclado: Story = {
  name: 'Teste: teclado e valor anunciado',
  play: async ({ canvasElement }) => {
    for (const canvas of eachTheme(canvasElement)) {
      const thumb = canvas.getByRole('slider', { name: 'Nível de operação' })
      await expect(thumb).toHaveAttribute('aria-valuetext', '60%')
      thumb.focus()
      await userEvent.keyboard('{ArrowRight}{ArrowRight}')
      await expect(thumb).toHaveAttribute('aria-valuenow', '62')
      await expect(canvas.getByText(/62%/)).toBeVisible()
    }
  },
}
