import { within } from 'storybook/test'

/** Uma consulta por tema renderizado (o decorator mostra os dois lado a lado). */
export const eachTheme = (canvasElement: HTMLElement) =>
  [...canvasElement.querySelectorAll<HTMLElement>('[data-k-theme]')].map(el => within(el))

export const figma = (nodeId: string) => `https://www.figma.com/design/efiIkmlCZ1DyEoYhc6zvZr?node-id=${nodeId.replace(':', '-')}`
