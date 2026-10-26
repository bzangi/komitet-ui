import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play.js'
import { Avatar } from '../Basics/Basics.js'
import { Button } from '../Button/Button.js'
import { Card, CardContent } from '../Card/Card.js'
import { AspectRatio, Carousel, DescriptionItem, DescriptionList, Item, Resizable } from './Content.js'

const meta = {
  title: 'Estrutura/Conteúdo',
  component: Item,
  subcomponents: { DescriptionList, DescriptionItem, AspectRatio, Resizable, Carousel },
  parameters: figma(
    { DescriptionList: '24:3601', Item: '17:3419', AspectRatio: '17:3644', Resizable: '17:3470', Carousel: '17:3561' },
    'DescriptionList, Item e AspectRatio aparecem no Figma sobre uma placa (aqui, `Card material="plate"`). Resizable é ajustado por um Slider, como no Figma. Carousel nunca avança sozinho.',
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

export const Compartimentos: Story = {
  name: 'Resizable',
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Resizable
        first={
          <>
            <p style={{ font: 'var(--k-text-heading-m)' }}>Índice</p>
            <p style={{ font: 'var(--k-text-body-small)' }}>Fichas e registros</p>
          </>
        }
        second={
          <>
            <p style={{ font: 'var(--k-text-heading-m)' }}>Documento</p>
            <p style={{ font: 'var(--k-text-body-small)' }}>Conteúdo selecionado</p>
          </>
        }
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const slider = canvas!.getByRole('slider', { name: 'Largura do índice' })
    slider.focus()
    await userEvent.keyboard('{End}')
    await expect(slider).toHaveAttribute('aria-valuenow', '80')
    await expect(slider).toHaveAttribute('aria-valuetext', '80%')
  },
}

const fichas = [
  ['Ficha de inspeção', 'Histórico e procedimentos da unidade.'],
  ['Placa de inventário', 'Equipamentos, peças e responsáveis.'],
  ['Módulo de operação', 'Leituras e comandos da estação.'],
]

export const Fichas: Story = {
  name: 'Carousel',
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Carousel aria-label="Fichas da unidade">
        {fichas.map(([t, d]) => (
          <div key={t}>
            <p style={{ font: 'var(--k-text-heading-m)', margin: 0 }}>{t}</p>
            <p style={{ margin: '8px 0 0' }}>{d}</p>
          </div>
        ))}
      </Carousel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const prev = canvas!.getByRole('button', { name: /Anterior/ })
    await expect(prev).toBeDisabled()
    await userEvent.click(canvas!.getByRole('button', { name: /Próximo/ }))
    await expect(canvas!.getByRole('group', { name: '2 de 3' })).toHaveTextContent('Placa de inventário')
    await expect(canvas!.getByText('2 / 3')).toBeVisible()
  },
}
