import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect } from 'storybook/test'
import { eachTheme, figma } from '../../../.storybook/play.js'
import { Slider } from '../Slider/Slider.js'
import { Annunciator, Gauge, Readout, Terminal } from './Instruments.js'

const meta = {
  title: 'Instrumentos/Instrumentos',
  component: Gauge,
  subcomponents: { Readout, Terminal, Annunciator },
  parameters: figma(
    { Gauge: '16:3896', Readout: '16:4161', Terminal: '16:4244', Annunciator: '16:4299' },
    'Low/Default/High do Gauge e Low do Readout derivam do valor. A agulha segue a escala de −120° a +120° (no Figma os ângulos são aproximados). Valores e limites são expostos como `meter` ou em texto para leitores de tela.',
  ),
  args: { label: 'NÍVEL DE OPERAÇÃO', value: 64 },
} satisfies Meta<typeof Gauge>
export default meta
type Story = StoryObj<typeof meta>

const row = { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' } as const

export const Mostradores: Story = {
  name: 'Gauge',
  render: () => (
    <div style={row}>
      <Gauge label="NÍVEL DE OPERAÇÃO" value={24} />
      <Gauge label="NÍVEL DE OPERAÇÃO" value={64} />
      <Gauge label="NÍVEL DE OPERAÇÃO" value={88} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const canvas of eachTheme(canvasElement)) {
      const [low] = canvas.getAllByRole('meter', { name: 'NÍVEL DE OPERAÇÃO' })
      await expect(low).toHaveAttribute('aria-valuenow', '24')
      await expect(low).toHaveAttribute('aria-valuetext', '24 %')
      await expect(low).toHaveAttribute('aria-valuemax', '100')
    }
  },
}

export const Ajuste: Story = {
  name: 'Composição: Slider controla o Gauge',
  render: () => {
    const [v, setV] = useState(64)
    return (
      <div style={{ ...row, alignItems: 'center' }}>
        <Gauge label="PRESSÃO DA LINHA" value={v} max={120} unit="psi" />
        <div style={{ width: 240 }}>
          <Slider label="Pressão" value={v} onValueChange={setV} max={120} unit=" psi" />
        </div>
      </div>
    )
  },
}

export const Visores: Story = {
  name: 'Readout',
  render: () => (
    <div style={row}>
      <Readout label="LEITURA AUXILIAR" value={24} />
      <Readout label="LEITURA AUXILIAR" value={64} />
      <Readout label="LEITURA AUXILIAR" value={null} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const canvas of eachTheme(canvasElement)) {
      await expect(canvas.getByText('024')).toBeVisible()
      await expect(canvas.getByText('Falha de leitura')).toBeInTheDocument()
    }
  },
}

export const Monitor: Story = {
  name: 'Terminal',
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
      <Terminal aria-label="Registro da estação 04">
        {'ESTAÇÃO 04 / CONECTADA\n› Verificação concluída.\n› Aguardando instruções.'}
      </Terminal>
      <Terminal error aria-label="Registro da estação 04 com falha">
        {'ESTAÇÃO 04 / SEM CONEXÃO\n› Verifique a alimentação.'}
      </Terminal>
    </div>
  ),
}

export const Sinalizadores: Story = {
  name: 'Annunciator',
  render: () => (
    <div style={row}>
      <Annunciator>Rede ativa</Annunciator>
      <Annunciator tone="warning">Atenção</Annunciator>
      <Annunciator tone="error">Bloqueio</Annunciator>
    </div>
  ),
}
