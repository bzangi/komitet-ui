import { within } from 'storybook/test'

/** Uma consulta por tema renderizado (o decorator mostra os dois lado a lado). */
export const eachTheme = (canvasElement: HTMLElement) =>
  [...canvasElement.querySelectorAll<HTMLElement>('[data-k-theme]')].map(el => within(el))

const url = (nodeId: string) => `https://www.figma.com/design/efiIkmlCZ1DyEoYhc6zvZr?node-id=${nodeId.replace(':', '-')}`

/** Parâmetros de meta: links para os nós do Figma na página de docs da família. */
export const figma = (nodes: Record<string, string>, note = '') => ({
  docs: {
    description: {
      component: `**Figma:** ${Object.entries(nodes)
        .map(([name, id]) => `[${name} \`${id}\`](${url(id)})`)
        .join(' · ')}${note ? `\n\n${note}` : ''}`,
    },
  },
})
