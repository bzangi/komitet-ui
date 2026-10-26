import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play.js'
import { Field } from '../Field/Field.js'
import { FileInput, InputAddon, InputGroup, PasswordInput, Select, Textarea, Input } from './Input.js'

const meta = {
  title: 'Formulários/Campos',
  component: Select,
  subcomponents: { PasswordInput, FileInput },
  parameters: figma(
    { Textarea: '12:422', Select: '12:567', SearchInput: '12:1299', PasswordInput: '12:1396', InputGroup: '12:1493', FileInput: '12:1220' },
    'SearchInput = `<Input type="search">`. Select é o `<select>` nativo: o Figma não desenha a lista aberta.',
    'Textarea (`<textarea>`), InputGroup (`<div>`), InputAddon (`<span>`).',
  ),
} satisfies Meta<typeof Select>
export default meta
type Story = StoryObj<typeof meta>

const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 } as const

const options = (
  <>
    <option value="aurora">Unidade Aurora</option>
    <option value="boreal">Unidade Boreal</option>
  </>
)

export const Textarea_: Story = {
  name: 'Textarea',
  render: () => (
    <div style={grid}>
      <Field label="Observações">
        <Textarea placeholder="Registre uma observação…" />
      </Field>
      <Field label="Observações" error="Use pelo menos 4 caracteres.">
        <Textarea defaultValue="Registro incompleto" />
      </Field>
      <Field label="Observações" description="Somente leitura. Pode ser copiado.">
        <Textarea defaultValue="Inspeção de rotina concluída." readOnly />
      </Field>
      <Field label="Observações" description="Edição indisponível.">
        <Textarea defaultValue="Gerenciado pela equipe" disabled />
      </Field>
    </div>
  ),
}

export const Select_: Story = {
  name: 'Select',
  render: () => (
    <div style={grid}>
      <Field label="Unidade de operação">
        <Select placeholder="Selecione uma unidade">{options}</Select>
      </Field>
      <Field label="Unidade de operação">
        <Select defaultValue="aurora">{options}</Select>
      </Field>
      <Field label="Unidade de operação" error="Selecione uma unidade para continuar.">
        <Select placeholder="Selecione uma unidade">{options}</Select>
      </Field>
      <Field label="Unidade de operação" description="Edição indisponível.">
        <Select defaultValue="aurora" disabled>
          {options}
        </Select>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const [select] = canvas!.getAllByLabelText('Unidade de operação')
    await userEvent.selectOptions(select!, 'boreal')
    await expect(select).toHaveValue('boreal')
  },
}

export const Busca: Story = {
  name: 'SearchInput',
  render: () => (
    <div style={grid}>
      <Field label="Buscar documento">
        <Input type="search" placeholder="Buscar documento…" />
      </Field>
      <Field label="Buscar documento" description="Edição indisponível.">
        <Input type="search" defaultValue="Manual de operação" disabled />
      </Field>
    </div>
  ),
}

export const Senha: Story = {
  name: 'PasswordInput',
  render: () => (
    <div style={grid}>
      <Field label="Senha">
        <PasswordInput placeholder="Digite sua senha" />
      </Field>
      <Field label="Senha" description="Edição indisponível.">
        <PasswordInput defaultValue="fictícia" disabled />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const [input] = canvas!.getAllByLabelText('Senha')
    await userEvent.type(input!, 'segredo')
    await expect(input).toHaveAttribute('type', 'password')
    const [reveal] = canvas!.getAllByRole('button', { name: 'Mostrar senha' })
    await userEvent.click(reveal!)
    await expect(reveal).toHaveAttribute('aria-pressed', 'true')
    await expect(input).toHaveAttribute('type', 'text')
  },
}

export const Grupo: Story = {
  name: 'InputGroup',
  render: () => (
    <div style={grid}>
      <Field label="Tensão nominal (V)">
        <InputGroup>
          <Input inputMode="numeric" placeholder="Tensão em volts" />
          <InputAddon>V</InputAddon>
        </InputGroup>
      </Field>
      <Field label="Tensão nominal (V)" error="Informe um valor entre 110 e 380.">
        <InputGroup>
          <Input defaultValue="12" />
          <InputAddon>V</InputAddon>
        </InputGroup>
      </Field>
      <Field label="Tensão nominal (V)" description="Edição indisponível.">
        <InputGroup>
          <Input defaultValue="220" disabled />
          <InputAddon>V</InputAddon>
        </InputGroup>
      </Field>
    </div>
  ),
}

export const Arquivo: Story = {
  name: 'FileInput',
  render: () => (
    <div style={grid}>
      <Field label="Anexo">
        <FileInput />
      </Field>
      <Field label="Anexo" description="Edição indisponível.">
        <FileInput disabled />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const [input] = canvas!.getAllByLabelText('Anexo')
    await userEvent.upload(input!, new File(['%PDF'], 'manual.pdf', { type: 'application/pdf' }))
    await expect(input!.closest('.k-file')).toHaveTextContent('Selecionar arquivo|manual.pdf')
  },
}
