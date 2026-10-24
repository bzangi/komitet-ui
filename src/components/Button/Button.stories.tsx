import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play.js'
import { Button } from './Button.js'
import { IconButton } from './IconButton.js'

const meta = {
  title: 'Ações/Button',
  component: Button,
  parameters: figma({ 'Button/Primary': '11:89', 'Button/Secondary': '11:198', 'Button/Destructive': '11:307', 'Button/Quiet': '11:416', 'Button/Size': '18:3525', IconButton: '18:3588' }),
  args: { children: 'Confirmar', onClick: fn() },
} satisfies Meta<typeof Button>
export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 16 } as const

/** Material Symbols “add” — o mesmo ícone do Material 3 Design Kit usado no Figma. */
const AddIcon = () => (
  <svg viewBox="0 -960 960 960" aria-hidden>
    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
  </svg>
)

export const Playground: Story = {}

export const Variantes: Story = {
  render: args => (
    <>
      {(['primary', 'secondary', 'destructive', 'quiet'] as const).map(variant => (
        <div key={variant} style={row}>
          <Button {...args} variant={variant}>
            {{ primary: 'Confirmar', secondary: 'Rearmar', destructive: 'Excluir', quiet: 'Detalhes' }[variant]}
          </Button>
          <Button {...args} variant={variant} disabled>
            Bloqueado
          </Button>
          <Button {...args} variant={variant} loading>
            Confirmar
          </Button>
        </div>
      ))}
    </>
  ),
}

export const Tamanhos: Story = {
  render: args => (
    <div style={row}>
      <Button {...args} variant="secondary" size="sm" />
      <Button {...args} variant="secondary" size="md" />
      <Button {...args} variant="secondary" size="lg" />
    </div>
  ),
}

export const IconButtons: Story = {
  render: () => (
    <div style={row}>
      <IconButton icon={<AddIcon />} aria-label="Adicionar registro" />
      <IconButton icon={<AddIcon />} aria-label="Adicionar registro" disabled />
      <IconButton icon={<AddIcon />} aria-label="Adicionar registro" size="sm" />
      <IconButton icon={<AddIcon />} aria-label="Adicionar registro" size="lg" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const canvas of eachTheme(canvasElement)) {
      await expect(canvas.getAllByRole('button', { name: 'Adicionar registro' })).toHaveLength(4)
    }
  },
}

export const RotuloLongo: Story = {
  name: 'Rótulo longo e largura estreita',
  render: args => (
    <div style={{ width: 200, display: 'grid', gap: 12 }}>
      <Button {...args}>Confirmar envio do relatório de manutenção trimestral</Button>
      <Button {...args} variant="secondary">
        Rearmar
      </Button>
    </div>
  ),
}

export const ComoLink: Story = {
  name: 'Como link (asChild)',
  render: () => (
    <Button asChild variant="secondary">
      <a href="#manual">Abrir documento</a>
    </Button>
  ),
  play: async ({ canvasElement }) => {
    for (const canvas of eachTheme(canvasElement)) {
      const link = canvas.getByRole('link', { name: 'Abrir documento' })
      await expect(link).toHaveClass('k-button')
      await expect(link.querySelector('.k-button__face')).not.toBeNull()
    }
  },
}

export const Interacao: Story = {
  name: 'Teste: clique e teclado',
  play: async ({ args, canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const button = canvas!.getByRole('button', { name: 'Confirmar' })
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledTimes(1)
    button.focus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    await expect(args.onClick).toHaveBeenCalledTimes(3)
  },
}

export const TesteBloqueado: Story = {
  name: 'Teste: desabilitado e aguardando',
  render: args => (
    <div style={row}>
      <Button {...args} disabled>
        Bloqueado
      </Button>
      <Button {...args} loading>
        Confirmar
      </Button>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const loading = canvas!.getByRole('button', { name: 'Aguarde…' })
    await expect(loading).toHaveAttribute('aria-busy', 'true')
    await expect(loading).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(loading)
    await expect(canvas!.getByRole('button', { name: 'Bloqueado' })).toBeDisabled()
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}
