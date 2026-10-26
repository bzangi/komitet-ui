import { useId, useMemo, useState, type ComponentProps, type ReactNode } from 'react'
import { Checkbox } from '../Checkbox/Checkbox.js'
import { Skeleton } from '../Basics/Basics.js'
import { cx } from '../../utils/cx.js'

type Tone = 'success' | 'warning' | 'error'

export type TableProps = ComponentProps<'table'> & {
  /** Nome acessível da tabela (fica oculto; o Figma não tem legenda visível). */
  caption: string
  /** Figma: Table/Standard (linhas de 44 px) e Table/Compact (36 px). */
  density?: 'standard' | 'compact'
  /** Figma: Table/Zebra. */
  striped?: boolean
}

/** Registros em placa, com cabeçalho e alinhamento consistentes. Figma 13:2422 · 13:2587 · 13:2752. */
export function Table({ caption, density = 'standard', striped, className, children, ...props }: TableProps) {
  const id = useId()
  return (
    <div className={cx('k-table', className)} data-density={density} data-striped={striped || undefined}>
      <div className="k-table__face">
        {/* Rolagem horizontal em larguras estreitas; focável para rolar pelo teclado. */}
        <div className="k-table__scroll" role="region" aria-labelledby={id} tabIndex={0}>
          <table {...props}>
            <caption id={id} className="k-sr-only">
              {caption}
            </caption>
            {children}
          </table>
        </div>
      </div>
    </div>
  )
}

export const TableHeader = (props: ComponentProps<'thead'>) => <thead {...props} />
export const TableBody = (props: ComponentProps<'tbody'>) => <tbody {...props} />

export function TableRow({ selected, ...props }: ComponentProps<'tr'> & { selected?: boolean }) {
  return <tr data-selected={selected || undefined} aria-selected={selected} {...props} />
}

export function TableHead({ numeric, ...props }: ComponentProps<'th'> & { numeric?: boolean }) {
  return <th scope="col" data-numeric={numeric || undefined} {...props} />
}

export type TableCellProps = ComponentProps<'td'> & {
  numeric?: boolean
  /** Cor de status no texto da célula (vira `ink` em linhas destacadas, como no Figma). */
  tone?: Tone
}

export function TableCell({ numeric, tone, ...props }: TableCellProps) {
  return <td data-numeric={numeric || undefined} data-tone={tone} {...props} />
}

/* Pagination — Figma 13:3436. A página atual é o segmento em `brand`. */

/** Páginas visíveis: todas até 7; acima disso, primeira, última e vizinhas da atual. */
export function pageItems(page: number, count: number): (number | '…')[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  const near = [1, page - 1, page, page + 1, count].filter((p, i, a) => p >= 1 && p <= count && a.indexOf(p) === i).sort((a, b) => a - b)
  return near.flatMap((p, i) => (i > 0 && p - near[i - 1]! > 1 ? ['…' as const, p] : [p]))
}

export type PaginationProps = Omit<ComponentProps<'nav'>, 'onChange'> & {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageCount, onPageChange, className, 'aria-label': label = 'Paginação', ...props }: PaginationProps) {
  return (
    <nav aria-label={label} className={cx('k-pagination', className)} {...props}>
      <ul className="k-segments">
        <li>
          <button type="button" className="k-segment" aria-label="Página anterior" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            ‹
          </button>
        </li>
        {pageItems(page, pageCount).map((p, i) => (
          <li key={i}>
            {p === '…' ? (
              <span className="k-pagination__gap">…</span>
            ) : (
              <button
                type="button"
                className="k-segment"
                data-active={p === page || undefined}
                aria-current={p === page ? 'page' : undefined}
                aria-label={`Página ${p}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )}
          </li>
        ))}
        <li>
          <button type="button" className="k-segment" aria-label="Próxima página" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
            ›
          </button>
        </li>
      </ul>
    </nav>
  )
}

/* DataTable — Figma 13:2923. Busca, ordenação, seleção e estados independentes dos dados. */

export type DataTableColumn<T> = {
  key: keyof T & string
  header: string
  numeric?: boolean
  sortable?: boolean
  render?: (row: T) => ReactNode
  tone?: (row: T) => Tone | undefined
}

export type DataTableProps<T> = {
  caption: string
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string
  /** Coluna usada para nomear cada linha (ex.: no rótulo do checkbox). Padrão: a primeira. */
  rowLabel?: (row: T) => string
  /** Ordenação inicial (Figma: “Documento ↑”). */
  defaultSort?: { key: keyof T & string; dir: 'ascending' | 'descending' }
  selectable?: boolean
  selected?: string[]
  onSelectedChange?: (ids: string[]) => void
  searchLabel?: string
  loading?: boolean
  loadingLabel?: ReactNode
  error?: ReactNode
  errorAction?: ReactNode
  emptyLabel?: ReactNode
  /** Rodapé (resumo, Pagination). */
  footer?: ReactNode
  density?: TableProps['density']
  className?: string
}

export function DataTable<T>({
  caption,
  columns,
  rows,
  getRowId,
  rowLabel = row => String(row[columns[0]!.key]),
  defaultSort,
  selectable,
  selected: selectedProp,
  onSelectedChange,
  searchLabel = 'Buscar documento…',
  loading,
  loadingLabel = 'Carregando registros…',
  error,
  errorAction,
  emptyLabel = 'Nenhum registro encontrado.',
  footer,
  density,
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<{ key: string; dir: 'ascending' | 'descending' } | null>(defaultSort ?? null)
  const [innerSelected, setInnerSelected] = useState<string[]>([])
  const selected = selectedProp ?? innerSelected
  const setSelected = (ids: string[]) => (setInnerSelected(ids), onSelectedChange?.(ids))

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q ? rows.filter(r => columns.some(c => String(r[c.key]).toLowerCase().includes(q))) : rows
    if (!sort) return filtered
    const dir = sort.dir === 'ascending' ? 1 : -1
    return [...filtered].sort((a, b) => String(a[sort.key as keyof T]).localeCompare(String(b[sort.key as keyof T]), 'pt-BR', { numeric: true }) * dir)
  }, [rows, columns, query, sort])

  const ids = visible.map(getRowId)
  const chosen = ids.filter(id => selected.includes(id)).length
  const allState = chosen === 0 ? false : chosen === ids.length ? true : 'indeterminate'
  const status = loading ? 'loading' : error ? 'error' : visible.length === 0 ? 'empty' : undefined
  const span = columns.length + (selectable ? 1 : 0)

  return (
    <div className={cx('k-table', 'k-datatable', className)} data-density={density}>
      <div className="k-table__face" data-error={error ? '' : undefined}>
        <div className="k-datatable__tools">
          <input type="search" className="k-datatable__search" aria-label={searchLabel} placeholder={searchLabel} value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="k-table__scroll" role="region" aria-label={caption} tabIndex={0}>
          <table aria-busy={loading || undefined}>
            <caption className="k-sr-only">{caption}</caption>
            <thead>
              <tr>
                {selectable && (
                  <th scope="col" className="k-datatable__check">
                    <Checkbox
                      aria-label="Selecionar todos"
                      checked={allState}
                      disabled={!!status}
                      onCheckedChange={v => setSelected(v === true ? [...new Set([...selected, ...ids])] : selected.filter(id => !ids.includes(id)))}
                    />
                  </th>
                )}
                {columns.map(c => {
                  const dir = sort?.key === c.key ? sort.dir : undefined
                  return (
                    <th key={c.key} scope="col" data-numeric={c.numeric || undefined} aria-sort={dir}>
                      {c.sortable ? (
                        <button
                          type="button"
                          className="k-datatable__sort"
                          onClick={() => setSort({ key: c.key, dir: dir === 'ascending' ? 'descending' : 'ascending' })}
                        >
                          {c.header}
                          <span aria-hidden>{dir === 'ascending' ? ' ↑' : dir === 'descending' ? ' ↓' : ''}</span>
                        </button>
                      ) : (
                        c.header
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {status ? (
                <tr>
                  <td colSpan={span} className="k-datatable__state" role={status === 'error' ? 'alert' : 'status'}>
                    {status === 'loading' && (
                      <>
                        <p>{loadingLabel}</p>
                        <Skeleton />
                        <Skeleton width="64%" />
                      </>
                    )}
                    {status === 'empty' && <p>{emptyLabel}</p>}
                    {status === 'error' && (
                      <>
                        <p>{error}</p>
                        {errorAction}
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                visible.map(row => {
                  const id = getRowId(row)
                  const isSelected = selected.includes(id)
                  return (
                    <tr key={id} data-selected={isSelected || undefined} aria-selected={selectable ? isSelected : undefined}>
                      {selectable && (
                        <td className="k-datatable__check">
                          <Checkbox
                            aria-label={`Selecionar ${rowLabel(row)}`}
                            checked={isSelected}
                            onCheckedChange={v => setSelected(v ? [...selected, id] : selected.filter(s => s !== id))}
                          />
                        </td>
                      )}
                      {columns.map(c => (
                        <td key={c.key} data-numeric={c.numeric || undefined} data-tone={c.tone?.(row)}>
                          {c.render ? c.render(row) : String(row[c.key])}
                        </td>
                      ))}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        {footer && <div className="k-datatable__footer">{footer}</div>}
      </div>
    </div>
  )
}
