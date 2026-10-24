import type { Meta, StoryObj } from '@storybook/react-vite'
import { figma } from '../../../.storybook/play'
import { Avatar } from '../Basics/Basics'
import { Button } from '../Button/Button'
import { Card, CardContent } from '../Card/Card'
import { AspectRatio, DescriptionItem, DescriptionList, Item } from './Content'

const meta = {
  title: 'Estrutura/Conteúdo',
  component: Item,
  parameters: figma(
    { DescriptionList: '24:3601', Item: '17:3419', AspectRatio: '17:3644' },
    'No Figma esses conjuntos aparecem sobre uma placa; aqui a placa é um `Card material="plate"`.',
  ),
  args: { title: 'Manual de referência' },
} satisfies Meta<typeof Item>
export default meta
type Story = StoryObj<typeof meta>

const plate = (children: React.ReactNode) => (
  <div style={{ maxWidth: 420 }}>
    <Card material="plate">
      <CardContent>{children}</CardContent>
    </Card>
  </div>
)

export const ListaDeDescricao: Story = {
  name: 'DescriptionList',
  render: () =>
    plate(
      <DescriptionList style={{ alignSelf: 'stretch' }}>
        <DescriptionItem label="Identificador">PRJ-004</DescriptionItem>
        <DescriptionItem label="Visibilidade">Equipe</DescriptionItem>
        <DescriptionItem label="Situação">Ativo</DescriptionItem>
      </DescriptionList>,
    ),
}

export const Itens: Story = {
  name: 'Item',
  render: () =>
    plate(
      <div style={{ display: 'grid', gap: 16, alignSelf: 'stretch' }}>
        <Item media={<Avatar name="Ana Martins" />} title="Manual de referência" description="Documento / Unidade Aurora" />
        <Item
          media={<Avatar name="Iuri Sokolov" />}
          title="Relatório trimestral de manutenção preventiva das bombas"
          description="Documento / Unidade Boreal / Setor norte"
          action={<Button variant="secondary" size="sm">Abrir</Button>}
        />
      </div>,
    ),
}

export const Proporcao: Story = {
  name: 'AspectRatio',
  render: () =>
    plate(
      <AspectRatio ratio={4 / 3} style={{ background: 'var(--k-soft)', padding: 24, boxSizing: 'border-box', alignSelf: 'stretch' }}>
        <p style={{ font: 'var(--k-text-heading-m)', margin: '0 0 12px' }}>PRANCHA TÉCNICA</p>
        <p style={{ margin: 0 }}>
          Formato 4 : 3
          <br />
          Mapas, imagens e esquemas.
        </p>
      </AspectRatio>,
    ),
}
