import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play'
import { Button } from '../Button/Button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HoverCard,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from './Menus'

const meta = {
  title: 'Menus/Menus e fichas',
  component: DropdownMenuContent,
  parameters: figma(
    { DropdownMenu: '15:3086', ContextMenu: '15:3261', Menubar: '15:3416', Popover: '15:3499', HoverCard: '15:3530', Tooltip: '15:3561' },
    'O estado Selected dos menus é o item realçado (teclado ou ponteiro). ContextMenu deve ter as mesmas ações num controle visível. HoverCard abre com hover, foco por teclado e clique (alternativa pedida no Figma).',
  ),
} satisfies Meta<typeof DropdownMenuContent>
export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } as const
const actions = ['Abrir documento', 'Renomear', 'Duplicar ficha', 'Arquivar']

export const Menu: Story = {
  name: 'DropdownMenu',
  args: { onSelect: fn() } as never,
  render: args => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Abrir opções ▾</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent title="AÇÕES DO DOCUMENTO">
        {actions.map(a => (
          <DropdownMenuItem key={a} disabled={a === 'Arquivar'} onSelect={(args as { onSelect: () => void }).onSelect}>
            {a}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ args, canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const trigger = canvas!.getByRole('button', { name: 'Abrir opções ▾' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const menu = await screen.findByRole('menu')
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Abrir documento' })).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    await expect(screen.getByRole('menuitem', { name: 'Renomear' })).toHaveAttribute('data-highlighted')
    await expect(screen.getByRole('menuitem', { name: 'Arquivar' })).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('{Enter}')
    await expect((args as unknown as { onSelect: () => void }).onSelect).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(menu).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
  },
}

export const Contexto: Story = {
  name: 'ContextMenu',
  render: () => (
    <div style={row}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div tabIndex={0} style={{ padding: 24, border: '2px dashed var(--k-line)' }}>
            Clique com o botão direito (ou Shift+F10) na ficha
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent title="AÇÕES DO DOCUMENTO">
          {actions.map(a => (
            <ContextMenuItem key={a}>{a}</ContextMenuItem>
          ))}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    await userEvent.pointer({ keys: '[MouseRight]', target: canvas!.getByText(/Clique com o botão direito/) })
    await screen.findByRole('menu')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const Barra: Story = {
  name: 'Menubar',
  render: () => (
    <Menubar aria-label="Comandos">
      {['Arquivo', 'Exibir', 'Ajuda'].map(m => (
        <MenubarMenu key={m}>
          <MenubarTrigger>{m}</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Novo registro</MenubarItem>
            <MenubarItem>Exportar</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const arquivo = canvas!.getByRole('menuitem', { name: 'Arquivo' })
    arquivo.focus()
    await userEvent.keyboard('{ArrowDown}')
    await screen.findByRole('menu')
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(canvas!.getByRole('menuitem', { name: 'Exibir' })).toHaveAttribute('data-state', 'open'))
    await userEvent.keyboard('{Escape}')
  },
}

export const Fichas: Story = {
  name: 'Popover, HoverCard e Tooltip',
  render: () => (
    <div style={row}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Acesso</Button>
        </PopoverTrigger>
        <PopoverContent title="Acesso restrito">O registro pode ser restaurado após o arquivamento.</PopoverContent>
      </Popover>
      <HoverCard title="Ana Morais" content="Responsável pela operação e manutenção.">
        <Button variant="quiet">Ana Morais</Button>
      </HoverCard>
      <Tooltip title="Informação do registro" content="O registro pode ser restaurado após o arquivamento.">
        <Button variant="quiet">Informação</Button>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    await userEvent.click(canvas!.getByRole('button', { name: 'Acesso' }))
    await screen.findByRole('dialog')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    // HoverCard: alternativa por clique.
    await userEvent.click(canvas!.getByRole('button', { name: 'Ana Morais' }))
    await expect(await screen.findByText('Responsável pela operação e manutenção.')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    // Tooltip por foco de teclado (o Esc devolveu o foco para “Ana Morais”).
    await userEvent.tab()
    await expect(canvas!.getByRole('button', { name: 'Informação' })).toHaveFocus()
    await expect(await screen.findByRole('tooltip')).toHaveTextContent('O registro pode ser restaurado')
  },
}

/** Aberto para revisão visual e checagem de acessibilidade do painel (use a barra para ver um tema por vez). */
export const Aberto: Story = {
  render: () => (
    <div style={{ height: 320 }}>
      <DropdownMenu defaultOpen modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Abrir opções ▾</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent title="AÇÕES DO DOCUMENTO" align="start">
          {actions.map(a => (
            <DropdownMenuItem key={a}>{a}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
}
