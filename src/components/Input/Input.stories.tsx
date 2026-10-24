import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play.js'
import { Field } from '../Field/Field.js'
import { Input } from './Input.js'

const meta = {
  title: 'Formulários/Input',
  component: Input,
  parameters: figma({ Input: '12:251', Field: '18:3699', Label: '12:1584' }),
} satisfies Meta<typeof Input>
export default meta
type Story = StoryObj<typeof meta>

const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 } as const

export const Estados: Story = {
  render: () => (
    <div style={grid}>
      <Field label="Identificação">
        <Input placeholder="Nome da estação" />
      </Field>
      <Field label="Identificação">
        <Input defaultValue="Estação Aurora" />
      </Field>
      <Field label="Identificação" error="Use pelo menos 4 caracteres.">
        <Input defaultValue="12" />
      </Field>
      <Field label="Identificação" success="✓ Código válido.">
        <Input defaultValue="Estação Aurora" />
      </Field>
      <Field label="Identificação" description="Somente leitura. Pode ser copiado.">
        <Input defaultValue="Estação Aurora" readOnly />
      </Field>
      <Field label="Identificação" description="Edição indisponível.">
        <Input placeholder="Gerenciado pela equipe" disabled />
      </Field>
      <Field label="Identificação" hideLabel>
        <Input placeholder="Rótulo oculto (Show label = false)" />
      </Field>
    </div>
  ),
}

export const TextoLongo: Story = {
  name: 'Texto longo e largura estreita',
  render: () => (
    <div style={{ width: 220 }}>
      <Field
        label="Identificação completa da estação de bombeamento e tratamento"
        error="Use pelo menos 4 caracteres e não inclua símbolos especiais no código da estação."
      >
        <Input defaultValue="Estação Aurora — setor norte, bloco administrativo" />
      </Field>
    </div>
  ),
}

export const TesteRotuloEMensagem: Story = {
  name: 'Teste: rótulo, mensagem e digitação',
  render: () => (
    <Field label="Identificação" error="Use pelo menos 4 caracteres.">
      <Input defaultValue="12" />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    for (const canvas of eachTheme(canvasElement)) {
      const input = canvas.getByLabelText('Identificação')
      await expect(input).toHaveAttribute('aria-invalid', 'true')
      await expect(input).toHaveAccessibleDescription('Use pelo menos 4 caracteres.')
      await userEvent.type(input, '34')
      await expect(input).toHaveValue('1234')
    }
  },
}

export const TesteSomenteLeitura: Story = {
  name: 'Teste: somente leitura e desabilitado',
  render: () => (
    <>
      <Field label="Código">
        <Input defaultValue="AUR-04" readOnly />
      </Field>
      <Field label="Equipe">
        <Input defaultValue="Norte" disabled />
      </Field>
    </>
  ),
  play: async ({ canvasElement }) => {
    const [canvas] = eachTheme(canvasElement)
    const code = canvas!.getByLabelText('Código')
    await userEvent.type(code, 'X')
    await expect(code).toHaveValue('AUR-04')
    await expect(canvas!.getByLabelText('Equipe')).toBeDisabled()
  },
}
