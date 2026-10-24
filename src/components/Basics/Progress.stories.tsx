import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play'
import { Progress } from './Basics'

const meta = {
  title: 'Elementos básicos/Progress',
  component: Progress,
  parameters: figma({ Progress: '10:285' }, 'Loading = `value={null}` (indeterminado: sem valor anunciado e com um segmento que percorre o trilho; estático com movimento reduzido). Complete = `value === max`.'),
  args: { label: 'Inspeção da unidade', value: 64 },
} satisfies Meta<typeof Progress>
export default meta
type Story = StoryObj<typeof meta>

export const Estados: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 300 }}>
      <Progress label="Inspeção da unidade" value={64} />
      <Progress label="Em andamento…" value={null} />
      <Progress label="Inspeção concluída" value={100} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const canvas of eachTheme(canvasElement)) {
      const [partial, indeterminate, complete] = canvas.getAllByRole('progressbar')
      await expect(partial).toHaveAttribute('aria-valuenow', '64')
      await expect(partial).toHaveAccessibleName('Inspeção da unidade · 64%')
      await expect(indeterminate).not.toHaveAttribute('aria-valuenow')
      await expect(complete).toHaveAttribute('data-state', 'complete')
    }
  },
}
