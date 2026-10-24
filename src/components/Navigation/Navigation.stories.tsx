import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play'
import { Accordion, AccordionItem, Breadcrumb, Collapsible, Sidebar, SidebarItem, Tabs, TabsContent, TabsList, TabsTrigger } from './Navigation'

const meta = {
  title: 'Navegação/Navegação',
  component: Tabs,
  parameters: figma(
    { Tabs: '14:2021', Breadcrumb: '14:2104', Accordion: '14:2129', Collapsible: '14:2178', Sidebar: '14:2227' },
    'Default/Second nas Tabs é a aba ativa. Accordion e Collapsible têm o mesmo desenho; Accordion agrupa seções, Collapsible é uma seção isolada.',
  ),
} satisfies Meta<typeof Tabs>
export default meta
type Story = StoryObj<typeof meta>

const box = { maxWidth: 360 } as const

export const Abas: Story = {
  name: 'Tabs',
  render: () => (
    <Tabs defaultValue="resumo" style={box}>
      <TabsList aria-label="Seções do projeto">
        <TabsTrigger value="resumo">Resumo</TabsTrigger>
        <TabsTrigger value="atividade">Atividade</TabsTrigger>
        <TabsTrigger value="arquivos">Arquivos</TabsTrigger>
      </TabsList>
      <TabsContent value="resumo">Procedimentos, responsáveis e registros da unidade.</TabsContent>
      <TabsContent value="atividade">Última inspeção: 12/10.</TabsContent>
      <TabsContent value="arquivos">Três documentos anexados.</TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    for (const canvas of eachTheme(canvasElement)) {
      const resumo = canvas.getByRole('tab', { name: 'Resumo' })
      resumo.focus()
      await userEvent.keyboard('{ArrowRight}')
      const atividade = canvas.getByRole('tab', { name: 'Atividade' })
      await expect(atividade).toHaveAttribute('aria-selected', 'true')
      await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Última inspeção')
    }
  },
}

export const Trilha: Story = {
  name: 'Breadcrumb',
  render: () => (
    <Breadcrumb>
      <a href="#equipe">Equipe</a>
      <a href="#projetos">Projetos</a>
      <span>Aurora</span>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    await expect(canvas!.getByRole('navigation', { name: 'Trilha de navegação' })).toBeInTheDocument()
    await expect(canvas!.getByText('Aurora').closest('li')).toHaveAttribute('aria-current', 'page')
  },
}

export const Secoes: Story = {
  name: 'Accordion e Collapsible',
  render: () => (
    <div style={{ ...box, display: 'grid', gap: 24 }}>
      <Accordion type="single" collapsible defaultValue="a">
        <AccordionItem value="a" title="Registros complementares">
          <p>Inspeção de cabos, conferência de peças e revisão de etiquetas.</p>
        </AccordionItem>
        <AccordionItem value="b" title="Histórico de manutenção">
          <p>Última revisão completa em março.</p>
        </AccordionItem>
      </Accordion>
      <Collapsible title="Detalhes técnicos">
        <p>Tensão nominal de 220 V, frequência de 60 Hz.</p>
      </Collapsible>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const canvas of eachTheme(canvasElement)) {
      const hist = canvas.getByRole('button', { name: 'Histórico de manutenção' })
      await expect(hist).toHaveAttribute('aria-expanded', 'false')
      await userEvent.click(hist)
      await expect(hist).toHaveAttribute('aria-expanded', 'true')
      await expect(canvas.getByRole('button', { name: 'Registros complementares' })).toHaveAttribute('aria-expanded', 'false')
      const det = canvas.getByRole('button', { name: 'Detalhes técnicos' })
      det.focus()
      await userEvent.keyboard('{Enter}')
      await expect(canvas.getByText(/Tensão nominal/)).toBeVisible()
    }
  },
}

export const Indice: Story = {
  name: 'Sidebar',
  render: () => (
    <div style={{ maxWidth: 220 }}>
      <Sidebar title="UNIDADE AURORA" aria-label="Unidade Aurora">
        <SidebarItem href="#visao" current>
          Visão geral
        </SidebarItem>
        <SidebarItem href="#documentos">Documentos</SidebarItem>
        <SidebarItem href="#equipe">Equipe</SidebarItem>
        <SidebarItem href="#config">Configurações</SidebarItem>
      </Sidebar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    await expect(canvas!.getByRole('link', { name: 'Visão geral' })).toHaveAttribute('aria-current', 'page')
  },
}
