import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play.js'
import { Checkbox } from './Checkbox.js'

const meta = {
  title: 'Formulários/Checkbox',
  component: Checkbox,
  parameters: figma({ Checkbox: '12:692' }),
  args: { children: 'Selecionar opção' },
} satisfies Meta<typeof Checkbox>
export default meta
type Story = StoryObj<typeof meta>

const col = { display: 'grid', gap: 8, justifyItems: 'start' } as const

export const Estados: Story = {
  render: () => (
    <div style={col}>
      <Checkbox>Selecionar opção</Checkbox>
      <Checkbox defaultChecked>Selecionado</Checkbox>
      <Checkbox checked="indeterminate">Parcial</Checkbox>
      <Checkbox disabled>Bloqueado</Checkbox>
      <Checkbox disabled defaultChecked>
        Bloqueado e selecionado
      </Checkbox>
      <div style={{ width: 200 }}>
        <Checkbox>Aceito receber o relatório consolidado de todas as estações da região norte</Checkbox>
      </div>
    </div>
  ),
}

/** Mixed representa um grupo com escolhas diferentes. */
export const GrupoComParcial: Story = {
  name: 'Composição: grupo com estado parcial',
  render: () => {
    const [items, setItems] = useState({ norte: true, sul: false, leste: false })
    const values = Object.values(items)
    const all = values.every(Boolean) ? true : values.some(Boolean) ? 'indeterminate' : false
    return (
      <fieldset style={{ ...col, border: 0, padding: 0, margin: 0 }}>
        <legend className="k-label">Estações</legend>
        <Checkbox checked={all} onCheckedChange={v => setItems({ norte: !!v, sul: !!v, leste: !!v })}>
          Todas
        </Checkbox>
        {(Object.keys(items) as (keyof typeof items)[]).map(k => (
          <Checkbox key={k} checked={items[k]} onCheckedChange={v => setItems({ ...items, [k]: !!v })} style={{ marginLeft: 24 }}>
            {k[0]!.toUpperCase() + k.slice(1)}
          </Checkbox>
        ))}
      </fieldset>
    )
  },
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const all = canvas!.getByRole('checkbox', { name: 'Todas' })
    await expect(all).toHaveAttribute('aria-checked', 'mixed')
    await userEvent.click(all)
    await expect(all).toHaveAttribute('aria-checked', 'true')
    await expect(canvas!.getByRole('checkbox', { name: 'Sul' })).toBeChecked()
  },
}

export const TesteInteracao: Story = {
  name: 'Teste: clique no rótulo, teclado e bloqueio',
  tags: ['!autodocs'],
  render: () => (
    <div style={col}>
      <Checkbox>Selecionar opção</Checkbox>
      <Checkbox disabled>Bloqueado</Checkbox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const canvas of eachTheme(canvasElement)) {
      const box = canvas.getByRole('checkbox', { name: 'Selecionar opção' })
      await userEvent.click(canvas.getByText('Selecionar opção'))
      await expect(box).toBeChecked()
      box.focus()
      await userEvent.keyboard(' ')
      await expect(box).not.toBeChecked()
      const blocked = canvas.getByRole('checkbox', { name: 'Bloqueado' })
      await userEvent.click(blocked)
      await expect(blocked).not.toBeChecked()
    }
  },
}
