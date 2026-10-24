import { createContext, useContext, type ComponentProps, type ReactNode } from 'react'

export type ThemeName = 'construtivista' | 'industrial'

const ThemeContext = createContext<ThemeName | undefined>(undefined)

export type ThemeProps = ComponentProps<'div'> & { theme: ThemeName }

/** Aplica o material de um tema à subárvore, inclusive a overlays em portal. Temas podem ser aninhados. */
export function Theme({ theme, ...props }: ThemeProps) {
  return (
    <ThemeContext.Provider value={theme}>
      <div data-k-theme={theme} {...props} />
    </ThemeContext.Provider>
  )
}

/** Reaplica o tema do `<Theme>` mais próximo a conteúdo renderizado em portal (fora da subárvore). */
export function ThemeScope({ children }: { children: ReactNode }) {
  const theme = useContext(ThemeContext)
  return theme ? (
    <div data-k-theme={theme} className="k-theme-scope">
      {children}
    </div>
  ) : (
    children
  )
}
