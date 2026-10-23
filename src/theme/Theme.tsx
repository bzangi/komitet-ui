import type { ComponentProps } from 'react'

export type ThemeName = 'construtivista' | 'industrial'

export type ThemeProps = ComponentProps<'div'> & { theme: ThemeName }

/** Aplica o material de um tema à subárvore. Temas podem ser aninhados. */
export function Theme({ theme, ...props }: ThemeProps) {
  // ponytail: portais (Dialog, menus) herdam o tema via container quando as famílias de overlay chegarem.
  return <div data-k-theme={theme} {...props} />
}
