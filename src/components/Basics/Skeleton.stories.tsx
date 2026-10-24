import type { Meta, StoryObj } from '@storybook/react-vite'
import { figma } from '../../../.storybook/play'
import { Skeleton } from './Basics'

const meta = {
  title: 'Elementos básicos/Skeleton',
  component: Skeleton,
  parameters: figma({ Skeleton: '10:168' }, 'Estático por decisão do Figma (“sem animações contínuas para ornamentação”). Fica oculto para tecnologias assistivas: anuncie a carga no contêiner (`aria-busy`) ou com um texto.'),
} satisfies Meta<typeof Skeleton>
export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: 'Padrão',
  render: () => (
    <div aria-busy style={{ display: 'grid', gap: 8, width: 264 }}>
      <Skeleton width={140} />
      <Skeleton />
      <Skeleton width={196} />
    </div>
  ),
}
