import type { Preview } from '@storybook/react-vite'
import '@fontsource/oswald/500.css'
import '@fontsource/oswald/700.css'
import '@fontsource/pt-sans/400.css'
import '@fontsource/pt-sans/700.css'
import '@fontsource/courier-prime/700.css'
import '@fontsource/share-tech-mono/400.css'
import '../src/styles/index.css'
import { Theme, type ThemeName } from '../src/theme/Theme'

const themes: ThemeName[] = ['construtivista', 'industrial']

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Tema',
      toolbar: {
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'both', title: 'Lado a lado' },
          { value: 'construtivista', title: 'Construtivista' },
          { value: 'industrial', title: 'Industrial' },
        ],
      },
    },
  },
  initialGlobals: { theme: 'both' },
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
  decorators: [
    (Story, { globals }) => {
      const shown = globals.theme === 'both' ? themes : [globals.theme as ThemeName]
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '100vh' }}>
          {shown.map(t => (
            <Theme key={t} theme={t} style={{ flex: '1 1 420px', padding: 24, minWidth: 0 }}>
              <Story />
            </Theme>
          ))}
        </div>
      )
    },
  ],
}

export default preview
