import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play'
import { Button } from '../Button/Button'
import { Alert, Empty, Toaster, toast } from './Feedback'

const meta = {
  title: 'Feedback/Alert, Toast e Empty',
  component: Alert,
  parameters: figma(
    { Alert: '14:2337', Toast: '14:2410', Empty: '14:2461' },
    'A cor da moldura reforça o tom; o título precisa nomear a situação. Toast não tem botão de fechar no Figma: some sozinho (pausa com hover/foco), com Esc (F8 leva o foco à área de notificações) ou arrastando.',
  ),
  args: { title: 'Atualização recebida' },
} satisfies Meta<typeof Alert>
export default meta
type Story = StoryObj<typeof meta>

const col = { display: 'grid', gap: 16, maxWidth: 360 } as const

export const Alertas: Story = {
  render: () => (
    <div style={col}>
      <Alert title="Atualização recebida">A informação está disponível para a equipe.</Alert>
      <Alert tone="warning" title="Revisão necessária">
        A informação está disponível para a equipe.
      </Alert>
      <Alert tone="error" title="Não foi possível salvar">
        Verifique a conexão e tente novamente.
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const canvas of eachTheme(canvasElement)) {
      await expect(canvas.getByRole('alert')).toHaveTextContent('Não foi possível salvar')
      await expect(canvas.getAllByRole('status')).toHaveLength(2)
    }
  },
}

export const Vazio: Story = {
  name: 'Empty',
  render: () => (
    <div style={col}>
      <Empty title="Nenhum documento" action={<Button>Adicionar arquivo</Button>}>
        Adicione o primeiro arquivo ao projeto.
      </Empty>
    </div>
  ),
}

export const Notificacoes: Story = {
  name: 'Toast',
  // Um Toaster por tema só porque o catálogo mostra os dois lado a lado; num app há um único.
  parameters: { a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } } },
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Button onClick={() => toast({ title: 'Registro salvo', description: 'A informação está disponível para a equipe.' })}>Salvar</Button>
      <Button
        variant="destructive"
        onClick={() => toast({ tone: 'error', title: 'Registro não salvo', description: 'Verifique a conexão e tente novamente.' })}
      >
        Simular falha
      </Button>
      <Toaster />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    await userEvent.click(canvas!.getByRole('button', { name: 'Salvar' }))
    const region = canvasElement.querySelector('[data-k-theme] .k-toast-viewport') as HTMLElement
    await waitFor(() => expect(within(region).getByText('Registro salvo')).toBeVisible())
  },
}
