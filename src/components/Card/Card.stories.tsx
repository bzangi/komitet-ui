import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play.js'
import { Badge } from '../Badge/Badge.js'
import { Skeleton } from '../Basics/Basics.js'
import { Button } from '../Button/Button.js'
import { Card, CardActions, CardContent, CardHeader, CardMeta, CardTitle, type CardProps } from './Card.js'

const meta = {
  title: 'Cards/Card',
  component: Card,
  parameters: figma(
    { 'Card/Paper': '13:639', 'Card/Plate': '13:1080', 'Card/Module': '13:1549', 'Card/Compact': '13:2018' },
    'Card/Module é idêntico a Card/Plate no Figma; use `material="plate"`. `selected` é visual: num card interativo, informe também `aria-pressed` ou `aria-current`.',
  ),
} satisfies Meta<typeof Card>
export default meta
type Story = StoryObj<typeof meta>

const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24, alignItems: 'start' } as const

const Manual = ({ action = 'Abrir documento', children, ...props }: CardProps & { action?: string }) => (
  <Card {...props}>
    <CardHeader>
      <CardMeta>ARQUIVO / AUR-04</CardMeta>
      <CardTitle>Manual de operação</CardTitle>
    </CardHeader>
    <CardContent>{children ?? <p>Procedimentos, responsáveis e registros da unidade.</p>}</CardContent>
    <CardActions>
      <Button variant="secondary" disabled={props.disabled}>
        {action}
      </Button>
    </CardActions>
  </Card>
)

const states = (material: CardProps['material']) => (
  <div style={grid}>
    <Manual material={material} />
    <Manual material={material} selected>
      <p>Procedimentos, responsáveis e registros da unidade.</p>
      <Badge tone="success">Selecionado</Badge>
    </Manual>
    <Card material={material} aria-busy>
      <CardHeader>
        <CardMeta>ARQUIVO / AUR-04</CardMeta>
        <CardTitle>Manual de operação</CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ font: 'var(--k-text-body-small)', color: 'var(--k-muted)' }}>Carregando conteúdo…</p>
        <Skeleton height={12} />
        <Skeleton height={12} width="67%" />
      </CardContent>
      <CardActions>
        <Button variant="secondary" loading>
          Abrir documento
        </Button>
      </CardActions>
    </Card>
    <Manual material={material} action="Criar ficha">
      <p>Nenhuma ficha. Adicione o primeiro registro.</p>
    </Manual>
    <Manual material={material} error action="Tentar novamente">
      <p>Não foi possível ler a ficha. Tente novamente.</p>
      <Badge tone="error">Falha de leitura</Badge>
    </Manual>
    <Manual material={material} disabled action="Bloqueado">
      <p>Consulta disponível. Edição bloqueada.</p>
    </Manual>
  </div>
)

export const Papel: Story = { render: () => states('paper') }
export const Placa: Story = { render: () => states('plate') }
export const Compacto: Story = { render: () => states('compact') }

export const TextoLongo: Story = {
  name: 'Texto longo e largura estreita',
  render: () => (
    <div style={{ width: 240 }}>
      <Card material="plate">
        <CardHeader>
          <CardMeta>ARQUIVO / AUR-04 / SETOR NORTE / BLOCO ADMINISTRATIVO</CardMeta>
          <CardTitle>Manual de operação e manutenção preventiva das bombas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Procedimentos, responsáveis e registros da unidade, incluindo inspeções semanais.</p>
        </CardContent>
        <CardActions>
          <Button variant="secondary">Abrir documento</Button>
          <Button variant="quiet">Detalhes</Button>
        </CardActions>
      </Card>
    </div>
  ),
}

/** Card inteiro como link: recebe foco e o traço tracejado do estado Focus. */
export const Interativo: Story = {
  name: 'Composição: card como link',
  render: () => (
    <div style={grid}>
      <Card material="plate" asChild>
        <a href="#manual">
          <CardHeader>
            <CardMeta>ARQUIVO / AUR-04</CardMeta>
            <CardTitle>Manual de operação</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Procedimentos, responsáveis e registros da unidade.</p>
          </CardContent>
        </a>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    await userEvent.tab()
    await expect(canvas!.getByRole('link', { name: /Manual de operação/ })).toHaveFocus()
  },
}
