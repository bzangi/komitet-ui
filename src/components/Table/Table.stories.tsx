import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play.js'
import { Button } from '../Button/Button.js'
import { DataTable, Pagination, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, pageItems, type DataTableColumn } from './Table.js'

const meta = {
  title: 'Tabelas/Tabelas e registros',
  component: Table,
  parameters: figma(
    { 'Table/Standard': '13:2422', 'Table/Compact': '13:2587', 'Table/Zebra': '13:2752', DataTable: '13:2923', Pagination: '13:3436' },
    'Selected destaca a linha (`soft` + moldura `brand`). Em linhas destacadas o texto de status volta a `ink`, como no Figma. Na Pagination, o segmento em `brand` é a página atual.',
  ),
  args: { caption: 'Documentos da unidade' },
} satisfies Meta<typeof Table>
export default meta
type Story = StoryObj<typeof meta>

type Doc = { id: string; documento: string; situacao: string; kb: number }
const docs: Doc[] = [
  { id: 'a', documento: 'Manual de operação', situacao: 'Ativo', kb: 128 },
  { id: 'b', documento: 'Inventário de peças', situacao: 'Revisão', kb: 64 },
  { id: 'c', documento: 'Relatório de inspeção', situacao: 'Rascunho', kb: 32 },
]
const tone = (s: string) => (s === 'Ativo' ? 'success' : s === 'Revisão' ? 'warning' : undefined)

const Basic = ({ selected, ...props }: Partial<React.ComponentProps<typeof Table>> & { selected?: string }) => (
  <Table caption="Documentos da unidade" {...props}>
    <TableHeader>
      <TableRow>
        <TableHead>Documento</TableHead>
        <TableHead>Situação</TableHead>
        <TableHead numeric>KB</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {docs.map(d => (
        <TableRow key={d.id} selected={d.id === selected}>
          <TableCell>{d.documento}</TableCell>
          <TableCell tone={tone(d.situacao)}>{d.situacao}</TableCell>
          <TableCell numeric>{d.kb}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

const col = { display: 'grid', gap: 24, maxWidth: 600 } as const

export const Tabelas: Story = {
  render: () => (
    <div style={col}>
      <Basic />
      <Basic selected="a" />
      <Basic density="compact" />
      <Basic striped />
    </div>
  ),
}

const columns: DataTableColumn<Doc>[] = [
  { key: 'documento', header: 'Documento', sortable: true },
  { key: 'situacao', header: 'Situação', tone: d => tone(d.situacao) },
  { key: 'kb', header: 'KB', numeric: true, sortable: true },
]

export const Registros: Story = {
  name: 'DataTable',
  render: () => {
    const [page, setPage] = useState(1)
    return (
      <div style={col}>
        <DataTable
          caption="Documentos"
          columns={columns}
          rows={docs}
          getRowId={d => d.id}
          selectable
          defaultSort={{ key: 'documento', dir: 'ascending' }}
          footer={`3 registros / página ${page} de 3`}
        />
        <DataTable caption="Documentos (carregando)" columns={columns} rows={[]} getRowId={d => d.id} selectable loading />
        <DataTable caption="Documentos (vazio)" columns={columns} rows={[]} getRowId={d => d.id} selectable />
        <DataTable
          caption="Documentos (falha)"
          columns={columns}
          rows={docs}
          getRowId={d => d.id}
          selectable
          error="Falha de leitura. Tente novamente."
          errorAction={<Button variant="secondary">Tentar novamente</Button>}
        />
        <Pagination page={page} pageCount={3} onPageChange={setPage} />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const [table] = canvas!.getAllByRole('region', { name: 'Documentos' })
    const t = within(table!)
    // Seleção: todos → parcial.
    const all = t.getByRole('checkbox', { name: 'Selecionar todos' })
    await userEvent.click(all)
    await expect(t.getByRole('checkbox', { name: 'Selecionar Manual de operação' })).toBeChecked()
    await userEvent.click(t.getByRole('checkbox', { name: 'Selecionar Inventário de peças' }))
    await expect(all).toHaveAttribute('aria-checked', 'mixed')
    // Ordenação.
    await userEvent.click(t.getByRole('button', { name: /KB/ }))
    await expect(t.getByRole('columnheader', { name: /KB/ })).toHaveAttribute('aria-sort', 'ascending')
    await expect(t.getAllByRole('row')[1]).toHaveTextContent('Relatório de inspeção')
    // Busca.
    await userEvent.type(canvas!.getAllByRole('searchbox')[0]!, 'xyz')
    await expect(t.getByRole('status')).toHaveTextContent('Nenhum registro encontrado.')
    // Paginação.
    const nav = canvas!.getByRole('navigation', { name: 'Paginação' })
    await expect(within(nav).getByRole('button', { name: 'Página anterior' })).toBeDisabled()
    await userEvent.click(within(nav).getByRole('button', { name: 'Página 2' }))
    await expect(within(nav).getByRole('button', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page')
  },
}

export const TesteJanelaDePaginas: Story = {
  name: 'Teste: janela de páginas',
  render: () => <Pagination page={6} pageCount={12} onPageChange={() => {}} />,
  play: async () => {
    await expect(pageItems(1, 5)).toEqual([1, 2, 3, 4, 5])
    await expect(pageItems(6, 12)).toEqual([1, '…', 5, 6, 7, '…', 12])
    await expect(pageItems(1, 12)).toEqual([1, 2, '…', 12])
    await expect(pageItems(12, 12)).toEqual([1, '…', 11, 12])
  },
}
