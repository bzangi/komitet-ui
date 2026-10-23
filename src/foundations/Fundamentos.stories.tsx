import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { figma } from '../../.storybook/play'

const meta: Meta = {
  title: 'Fundamentos',
  parameters: figma({ Paletas: '7:2', Tipografia: '7:74', 'Geometria e material': '7:87' }),
}
export default meta

const label: CSSProperties = { font: 'var(--k-text-label)', letterSpacing: 'var(--k-tracking-label)' }
const heading: CSSProperties = { font: 'var(--k-text-heading-l)', margin: '0 0 12px' }

const swatches = [
  ['Base', 'paper'],
  ['Superfície', 'surface'],
  ['Suporte', 'soft'],
  ['Ação', 'brand'],
  ['Texto', 'ink'],
  ['Ferragens', 'metal'],
  ['Sobre ação', 'onbrand'],
  ['Secundário', 'muted'],
  ['Linha', 'line'],
  ['Terminal fundo', 'terminalbg'],
  ['Terminal texto', 'terminalfg'],
] as const

const statuses = [
  ['✓', 'Sucesso', 'good'],
  ['!', 'Atenção', 'warn'],
  ['×', 'Erro', 'bad'],
] as const

export const Paletas: StoryObj = {
  render: () => (
    <section>
      <h2 style={heading}>Paleta semântica</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16 }}>
        {swatches.map(([name, token]) => (
          <figure key={token} style={{ margin: 0 }}>
            <div style={{ height: 56, background: `var(--k-${token})`, border: '1px solid var(--k-line)' }} />
            <figcaption style={{ ...label, marginTop: 8 }}>
              {name}
              <br />
              <code style={{ font: 'inherit', fontWeight: 400 }}>--k-{token}</code>
            </figcaption>
          </figure>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginTop: 16 }}>
        {statuses.map(([glyph, name, token]) => (
          <div
            key={token}
            style={{ background: 'var(--k-surface)', border: '1px solid var(--k-soft)', padding: 12, color: `var(--k-${token})`, font: 'var(--k-text-body-strong)' }}
          >
            {glyph} {name}
          </div>
        ))}
      </div>
      <p style={{ font: 'var(--k-text-body-strong)' }}>Texto escuro sobre papel e metal. Texto claro somente em fundos densos.</p>
    </section>
  ),
}

const textStyles = [
  ['Display/XL', 'display-xl', 'Forma a serviço da função.'],
  ['Display/L', 'display-l', 'Forma a serviço da função.'],
  ['Heading/L', 'heading-l', 'Hierarquia firme, leitura clara.'],
  ['Heading/M', 'heading-m', 'Hierarquia firme, leitura clara.'],
  ['Body/Default', 'body', 'PT Sans preserva a legibilidade de textos, rótulos e formulários.'],
  ['Body/Strong', 'body-strong', 'PT Sans preserva a legibilidade de textos, rótulos e formulários.'],
  ['Body/Small', 'body-small', 'PT Sans preserva a legibilidade de textos, rótulos e formulários.'],
  ['Label/Default', 'label', 'COURIER PRIME / ETIQUETAS E REGISTROS'],
  ['Label/Small', 'label-small', 'COURIER PRIME / ETIQUETAS E REGISTROS'],
  ['Control/Default', 'control', 'Confirmar'],
  ['Terminal/Default', 'terminal', 'ESTAÇÃO 04 / CONEXÃO ESTABELECIDA'],
  ['Readout/Value', 'readout', '64.0'],
] as const

export const Tipografia: StoryObj = {
  render: () => (
    <section>
      <h2 style={heading}>Tipografia</h2>
      {textStyles.map(([name, token, sample]) => (
        <div key={token} style={{ marginBottom: 12 }}>
          <div style={label}>{name}</div>
          <div
            style={{
              font: `var(--k-text-${token})`,
              letterSpacing: token.startsWith('label') ? 'var(--k-tracking-label)' : undefined,
              overflowWrap: 'anywhere',
            }}
          >
            {sample}
          </div>
        </div>
      ))}
    </section>
  ),
}

export const Geometria: StoryObj = {
  render: () => (
    <section>
      <h2 style={heading}>Geometria e material</h2>
      <div style={label}>Espaçamento — base de 4 px</div>
      <div style={{ display: 'flex', alignItems: 'end', gap: 8, margin: '8px 0 20px' }}>
        {[4, 8, 12, 16, 24, 32, 48, 64].map(s => (
          <div key={s} style={{ textAlign: 'center', ...label }}>
            <div style={{ width: `var(--k-space-${s})`, height: `var(--k-space-${s})`, background: 'var(--k-brand)' }} />
            {s}
          </div>
        ))}
      </div>
      <div style={label}>Bordas, cantos e relevo</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 8 }}>
        {[
          ['Divisória 1 px', { borderTop: 'var(--k-border-1) solid var(--k-line)' }],
          ['Controle 2 px · raio 2', { border: 'var(--k-border-2) solid var(--k-line)', borderRadius: 'var(--k-radius-2)' }],
          ['Moldura 4 px · raio 3', { border: 'var(--k-border-4) solid var(--k-metal)', borderRadius: 'var(--k-radius-3)' }],
          ['Elevado', { background: 'var(--k-surface)', boxShadow: 'var(--k-raised)', borderRadius: 'var(--k-radius-3)' }],
          ['Encaixe', { background: 'var(--k-soft)', boxShadow: 'var(--k-inset)', borderRadius: 'var(--k-radius-3)' }],
          ['Lente', { background: 'var(--k-signal)', border: 'var(--k-border-2) solid var(--k-metal)', borderRadius: 'var(--k-radius-999)', width: 48 }],
        ].map(([name, style]) => (
          <div key={name as string} style={{ ...label, width: 120 }}>
            <div style={{ height: 48, marginBottom: 8, ...(style as CSSProperties) }} />
            {name as string}
          </div>
        ))}
      </div>
    </section>
  ),
}
