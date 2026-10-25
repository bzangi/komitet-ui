/**
 * Regressão visual dos componentes representativos, nos dois temas (decorator do preview).
 * Baselines em __screenshots__/; para atualizar: `npm run test:visual -- --update`.
 */
import { composeStories, setProjectAnnotations } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { afterEach, expect, test } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import preview from '../.storybook/preview.js'
import * as Badge from './components/Badge/Badge.stories.js'
import * as Button from './components/Button/Button.stories.js'
import * as Card from './components/Card/Card.stories.js'
import * as Checkbox from './components/Checkbox/Checkbox.stories.js'
import * as Input from './components/Input/Input.stories.js'
import * as Switch from './components/Switch/Switch.stories.js'
import * as Fundamentos from './foundations/Fundamentos.stories.js'
import * as Feedback from './components/Feedback/Feedback.stories.js'
import * as Instrumentos from './components/Instruments/Instruments.stories.js'
import * as Navegacao from './components/Navigation/Navigation.stories.js'
import * as Slider from './components/Slider/Slider.stories.js'
import * as Toggle from './components/Toggle/Toggle.stories.js'
import * as Painel from './examples/Painel.stories.js'
import * as Tabelas from './components/Table/Table.stories.js'
import * as Datas from './components/Dates/Dates.stories.js'
import * as Busca from './components/Search/Search.stories.js'
import { Button as KButton, Checkbox as KCheckbox, Input as KInput, Switch as KSwitch, Theme } from './index.js'

setProjectAnnotations(preview)

const stories = {
  'fundamentos-paletas': composeStories(Fundamentos).Paletas,
  'button-variantes': composeStories(Button).Variantes,
  'button-tamanhos': composeStories(Button).Tamanhos,
  'icon-button': composeStories(Button).IconButtons,
  'badge-estados': composeStories(Badge).Estados,
  'input-estados': composeStories(Input).Estados,
  'checkbox-estados': composeStories(Checkbox).Estados,
  'switch-estados': composeStories(Switch).Estados,
  'card-papel': composeStories(Card).Papel,
  'card-placa': composeStories(Card).Placa,
  'card-compacto': composeStories(Card).Compacto,
  'toggle-teclas': composeStories(Toggle).Teclas,
  'slider-estados': composeStories(Slider).Estados,
  'alertas': composeStories(Feedback).Alertas,
  'abas': composeStories(Navegacao).Abas,
  'gauge': composeStories(Instrumentos).Mostradores,
  'readout': composeStories(Instrumentos).Visores,
  'painel-composicao': composeStories(Painel).Painel_,
  'tabelas': composeStories(Tabelas).Tabelas,
  'calendario': composeStories(Datas).Calendario,
  'input-otp': composeStories(Busca).Codigo,
}

let root: ReturnType<typeof createRoot> | undefined
afterEach(() => root?.unmount())

const mount = async (Story: () => ReactNode) => {
  const container = document.body.appendChild(document.createElement('div'))
  container.style.width = '1100px'
  root = createRoot(container)
  flushSync(() => root!.render(<Story />))
  await document.fonts.ready
  // Animações funcionais (Spinner, Progress) congeladas para capturas estáveis.
  container.style.setProperty('--k-duration', '0ms')
  return container
}

for (const [name, Story] of Object.entries(stories)) {
  test(name, async () => {
    const container = await mount(Story)
    await expect.element(page.elementLocator(container)).toMatchScreenshot(name)
  })
}

test('foco por teclado: button, input, checkbox, switch', async () => {
  const container = await mount(() => (
    <div style={{ display: 'flex' }}>
      {(['construtivista', 'industrial'] as const).map(t => (
        <Theme key={t} theme={t} style={{ flex: 1, display: 'grid', gap: 12, justifyItems: 'start', padding: 24 }}>
          <KButton>Confirmar</KButton>
          <KInput placeholder="Nome da estação" aria-label="Identificação" />
          <KCheckbox>Selecionar opção</KCheckbox>
          <KSwitch>Alimentação</KSwitch>
        </Theme>
      ))}
    </div>
  ))
  for (const name of ['button', 'input', 'checkbox', 'switch']) {
    await userEvent.tab()
    await expect.element(page.elementLocator(container)).toMatchScreenshot(`foco-${name}`)
  }
})
