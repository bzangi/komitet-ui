import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play.js'
import { Button } from '../Button/Button.js'
import { Field } from '../Field/Field.js'
import { Input } from '../Input/Input.js'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DrawerContent,
  SheetContent,
} from './Modal.js'

const meta = {
  title: 'Modais/Dialog, Sheet e Drawer',
  component: DialogContent,
  parameters: figma(
    { Dialog: '15:2163', AlertDialog: '15:2474', Sheet: '15:2657', Drawer: '15:2888' },
    'O Figma não desenha fundo nem botão de fechar: o fundo usa `ink` a 40% e o fechamento é por Esc, clique fora ou ação explícita (AlertDialog só fecha pelas ações). Form/Loading/Error/Success são composições com `status` e `Button loading`.',
  ),
  args: { title: 'Arquivar esta ficha?' },
} satisfies Meta<typeof DialogContent>
export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', flexWrap: 'wrap', gap: 12 } as const

const cancel = (
  <DialogClose asChild>
    <Button variant="secondary">Cancelar</Button>
  </DialogClose>
)

export const Dialogos: Story = {
  name: 'Dialog',
  render: () => {
    const [saving, setSaving] = useState(false)
    return (
      <div style={row}>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Arquivar</Button>
          </DialogTrigger>
          <DialogContent
            title="Arquivar esta ficha?"
            description="O registro sai da lista principal e pode ser restaurado depois."
            actions={
              <>
                {cancel}
                <DialogClose asChild>
                  <Button>Arquivar</Button>
                </DialogClose>
              </>
            }
          />
        </Dialog>
        <Dialog onOpenChange={() => setSaving(false)}>
          <DialogTrigger asChild>
            <Button variant="secondary">Editar identificação</Button>
          </DialogTrigger>
          <DialogContent
            title="Editar identificação"
            description="Atualize os dados da ficha."
            actions={
              <>
                {cancel}
                <Button loading={saving} onClick={() => setSaving(true)}>
                  Salvar
                </Button>
              </>
            }
          >
            <Field label="Identificação">
              <Input defaultValue="Estação Aurora" />
            </Field>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Falha ao registrar</Button>
          </DialogTrigger>
          <DialogContent status="error" title="Não foi possível registrar" description="Os dados foram preservados. Tente novamente." actions={cancel} />
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Registro concluído</Button>
          </DialogTrigger>
          <DialogContent status="success" title="Registro concluído" description="A ficha está atualizada e disponível." actions={cancel} />
        </Dialog>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    for (const [i, canvas] of eachTheme(canvasElement).entries()) {
      const trigger = canvas.getByRole('button', { name: 'Arquivar' })
      await userEvent.click(trigger)
      const dialog = await screen.findByRole('dialog', { name: 'Arquivar esta ficha?' })
      await expect(dialog).toHaveAccessibleDescription('O registro sai da lista principal e pode ser restaurado depois.')
      await expect(dialog.closest('[data-k-theme]')).toHaveAttribute('data-k-theme', ['construtivista', 'industrial'][i])
      await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))
      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
      await expect(trigger).toHaveFocus()
    }
  },
}

export const Confirmacao: Story = {
  name: 'AlertDialog',
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Excluir cópia local</Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        title="Excluir cópia local?"
        description="A cópia local será excluída. Esta ação não pode ser desfeita."
        actions={
          <>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive">Excluir cópia</Button>
            </AlertDialogAction>
          </>
        }
      />
    </AlertDialog>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    await userEvent.click(canvas!.getByRole('button', { name: 'Excluir cópia local' }))
    const dialog = await screen.findByRole('alertdialog', { name: 'Excluir cópia local?' })
    await expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus()
    await userEvent.click(screen.getByRole('button', { name: 'Excluir cópia' }))
    await waitFor(() => expect(dialog).not.toBeInTheDocument())
  },
}

export const Laterais: Story = {
  name: 'Sheet e Drawer',
  render: () => (
    <div style={row}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Detalhes da ficha</Button>
        </DialogTrigger>
        <SheetContent title="Detalhes da ficha" description="Edite os dados da ficha neste compartimento lateral." actions={cancel}>
          <Field label="Identificação">
            <Input defaultValue="Estação Aurora" />
          </Field>
        </SheetContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Ações do arquivo</Button>
        </DialogTrigger>
        <DrawerContent title="Ações do arquivo" description="Escolha um comando para o arquivo selecionado." actions={cancel}>
          <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
            <Button variant="quiet">Exportar relatório</Button>
            <Button variant="quiet">Duplicar ficha</Button>
            <Button variant="quiet">Arquivar documento</Button>
          </div>
        </DrawerContent>
      </Dialog>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    await userEvent.click(canvas!.getByRole('button', { name: 'Ações do arquivo' }))
    await screen.findByRole('dialog', { name: 'Ações do arquivo' })
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

/** Aberto para revisão visual e verificação de acessibilidade da camada (use a barra para ver um tema por vez). */
export const Aberto: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent
        title="Excluir cópia local?"
        description="A cópia local será excluída. Esta ação não pode ser desfeita."
        actions={
          <>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive">Excluir</Button>
            </AlertDialogAction>
          </>
        }
      />
    </AlertDialog>
  ),
}
