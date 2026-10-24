import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor } from 'storybook/test'
import { eachTheme } from '../../.storybook/play.js'
import {
  Annunciator,
  Breadcrumb,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMeta,
  CardTitle,
  DescriptionItem,
  DescriptionList,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  Field,
  Gauge,
  Input,
  Readout,
  Sidebar,
  SidebarItem,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  toast,
} from '../index.js'

const meta: Meta = {
  title: 'Exemplos/Painel de operação',
  parameters: {
    docs: {
      description: {
        component:
          'Composição de uma tela real com a biblioteca: índice, trilha, abas, instrumentos ligados a controles, formulário com validação, confirmação em Dialog e notificação. Os mesmos componentes nos dois temas.',
      },
    },
  },
}
export default meta

function Painel() {
  const [nivel, setNivel] = useState(64)
  const [ligado, setLigado] = useState(true)
  const [nome, setNome] = useState('Estação Aurora')
  const erro = nome.trim().length < 4 ? 'Use pelo menos 4 caracteres.' : undefined
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
      <div style={{ flex: '0 1 220px', minWidth: 180 }}>
        <Sidebar title="UNIDADE AURORA" aria-label="Unidade Aurora">
          <SidebarItem href="#visao" current>
            Visão geral
          </SidebarItem>
          <SidebarItem href="#documentos">Documentos</SidebarItem>
          <SidebarItem href="#equipe">Equipe</SidebarItem>
        </Sidebar>
      </div>
      <section aria-label="Estação Aurora" style={{ flex: '1 1 360px', minWidth: 0, display: 'grid', gap: 16 }}>
        <Breadcrumb>
          <a href="#equipe">Equipe</a>
          <a href="#projetos">Projetos</a>
          <span>Aurora</span>
        </Breadcrumb>
        <Tabs defaultValue="operacao">
          <TabsList aria-label="Seções da estação">
            <TabsTrigger value="operacao">Operação</TabsTrigger>
            <TabsTrigger value="ficha">Ficha</TabsTrigger>
          </TabsList>
          <TabsContent value="operacao">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
              <Gauge label="NÍVEL DE OPERAÇÃO" value={ligado ? nivel : 0} />
              <div style={{ display: 'grid', gap: 16, flex: '1 1 220px', minWidth: 0 }}>
                <Readout label="LEITURA AUXILIAR · BAR" value={ligado ? Math.round(nivel * 1.6) : null} />
                <Annunciator tone={ligado ? 'success' : 'error'}>{ligado ? 'Rede ativa' : 'Bloqueio'}</Annunciator>
                <Switch checked={ligado} onCheckedChange={setLigado}>
                  Alimentação {ligado ? 'ligada' : 'desligada'}
                </Switch>
                <Slider label="Nível" value={nivel} onValueChange={setNivel} unit="%" disabled={!ligado} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="ficha">
            <Card material="plate">
              <CardHeader>
                <CardMeta>ARQUIVO / AUR-04</CardMeta>
                <CardTitle>Identificação da estação</CardTitle>
              </CardHeader>
              <CardContent>
                <Field label="Identificação" error={erro}>
                  <Input value={nome} onChange={e => setNome(e.target.value)} />
                </Field>
                <DescriptionList style={{ alignSelf: 'stretch' }}>
                  <DescriptionItem label="Identificador">PRJ-004</DescriptionItem>
                  <DescriptionItem label="Situação">{ligado ? 'Ativo' : 'Bloqueado'}</DescriptionItem>
                </DescriptionList>
              </CardContent>
              <CardActions>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button disabled={!!erro}>Salvar ficha</Button>
                  </DialogTrigger>
                  <DialogContent
                    title="Salvar alterações?"
                    description={`A ficha será registrada como “${nome}”.`}
                    actions={
                      <>
                        <DialogClose asChild>
                          <Button variant="secondary">Cancelar</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button onClick={() => toast({ title: 'Registro salvo', description: 'A ficha está disponível para a equipe.' })}>Salvar</Button>
                        </DialogClose>
                      </>
                    }
                  />
                </Dialog>
              </CardActions>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
      <Toaster />
    </div>
  )
}

export const Painel_: StoryObj = {
  name: 'Painel',
  render: () => <Painel />,
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    await userEvent.click(canvas!.getByRole('switch', { name: /Alimentação/ }))
    await expect(canvas!.getByText('Bloqueio')).toBeVisible()
    await userEvent.click(canvas!.getByRole('tab', { name: 'Ficha' }))
    const input = canvas!.getByLabelText('Identificação')
    await userEvent.clear(input)
    await userEvent.type(input, 'Aur')
    await expect(canvas!.getByRole('button', { name: 'Salvar ficha' })).toBeDisabled()
    await userEvent.type(input, 'ora Norte')
    await userEvent.click(canvas!.getByRole('button', { name: 'Salvar ficha' }))
    await screen.findByRole('dialog', { name: 'Salvar alterações?' })
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    await waitFor(() => expect(screen.getAllByText('Registro salvo').length).toBeGreaterThan(0))
  },
}
