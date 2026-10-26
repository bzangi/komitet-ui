# Komitet UI

Biblioteca React de componentes analógicos — painéis, instrumentos, papel e placas — com dois temas: **Construtivista** (papel ocre, latão, tinta vermelha) e **Industrial** (chapa esmaltada verde, metal, oliva).

Catálogo online: https://bzangi.github.io/komitet-ui/

Referência visual: Figma `efiIkmlCZ1DyEoYhc6zvZr`. Cobertura e divergências: [`docs/COVERAGE.md`](docs/COVERAGE.md). Mapa Figma → React: [`docs/INVENTORY.md`](docs/INVENTORY.md).

> Em desenvolvimento: veja em `docs/COVERAGE.md` o que já está concluído.

## Instalação

```bash
npm install komitet-ui
```

Requer React 19. O CSS é distribuído pronto e não depende de Tailwind nem de configuração de bundler:

```tsx
import 'komitet-ui/styles.css'
```

### Fontes

A lib não embute fontes; carregue as quatro famílias do sistema (todas OFL, no Google Fonts):

```bash
npm install @fontsource/oswald @fontsource/pt-sans @fontsource/courier-prime @fontsource/share-tech-mono
```

```tsx
import '@fontsource/oswald/500.css'
import '@fontsource/oswald/700.css'
import '@fontsource/pt-sans/400.css'
import '@fontsource/pt-sans/700.css'
import '@fontsource/courier-prime/700.css'
import '@fontsource/share-tech-mono/400.css'
```

Sem elas, as pilhas caem para Arial Narrow, Trebuchet, Courier New e o monospace do sistema.

## Temas

Construtivista é o padrão em `:root`. `<Theme>` aplica um material a qualquer subárvore, e os temas podem ser aninhados ou exibidos lado a lado:

```tsx
import { Theme, Button } from 'komitet-ui'

<Theme theme="industrial">
  <Button>Confirmar</Button>
</Theme>
```

`<Theme>` também pinta o fundo (`paper`), a cor do texto (`ink`) e a fonte de corpo. Para aplicar só os tokens, use o atributo direto: `<div data-k-theme="industrial">`.

### Tokens

Todos os valores são CSS variables com prefixo `--k-`, extraídas do Figma:

| Grupo | Exemplos |
|---|---|
| Cores semânticas (por tema) | `--k-paper` `--k-surface` `--k-soft` `--k-ink` `--k-muted` `--k-line` `--k-metal` `--k-brand` `--k-onbrand` `--k-good` `--k-warn` `--k-bad` `--k-terminalbg` `--k-terminalfg` |
| Texto de status acessível | `--k-good-text` `--k-warn-text` `--k-bad-text` |
| Compartilhadas | `--k-amber` `--k-readout` `--k-signal` |
| Métricas | `--k-space-{0..64}` `--k-radius-{0,2,3,4,8,999}` `--k-border-{1..5}` `--k-control-{32,42,52}` |
| Tipografia | `--k-text-display-xl` … `--k-text-readout` (shorthand `font`), `--k-font-*`, `--k-tracking-label` |
| Relevo | `--k-raised` `--k-inset` |
| Movimento | `--k-duration` (0 com `prefers-reduced-motion`) |

Use os semânticos no seu código. As primitivas (`--k-construtivista-*`, `--k-industrial-*`) existem só para definir os temas.

## Uso

```tsx
import { Button, Card, CardActions, CardContent, CardHeader, CardMeta, CardTitle, Field, Input, Switch } from 'komitet-ui'

<Card material="plate">
  <CardHeader>
    <CardMeta>ARQUIVO / AUR-04</CardMeta>
    <CardTitle>Controle de alimentação</CardTitle>
  </CardHeader>
  <CardContent>
    <Field label="Identificação" error={erro}>
      <Input value={valor} onChange={e => setValor(e.target.value)} />
    </Field>
    <Switch checked={ligado} onCheckedChange={setLigado}>
      Alimentação {ligado ? 'ligada' : 'desligada'}
    </Switch>
  </CardContent>
  <CardActions>
    <Button loading={salvando}>Confirmar</Button>
    <Button variant="quiet">Cancelar</Button>
  </CardActions>
</Card>
```

Convenções:
- Os componentes aceitam os atributos HTML do elemento raiz, `className` e `ref` (React 19).
- Os estados podem ser controlados (`checked` + `onCheckedChange`, `value` + `onChange`) ou não controlados (`defaultChecked`, `defaultValue`).
- Controles de formulário dentro de `Field` recebem `id`, `aria-describedby` e `aria-invalid` automaticamente.
- `asChild` (Button, Card) aplica o material ao filho, por exemplo um `<a>` ou o `Link` do seu router.

## Exemplos

- `Introdução` no Storybook: instalação, fontes, temas, tokens e convenções.
- `Exemplos/Painel de operação` no Storybook: índice, trilha, abas, instrumentos ligados a controles, formulário com validação, Dialog de confirmação e Toast, nos dois temas.
- Cada família tem stories de estados, de texto longo/largura estreita e de composição.

## Desenvolvimento

```bash
npm run dev           # Storybook em http://localhost:6006 (temas lado a lado; troque na barra)
npm test              # comportamento + axe em cada story, navegador real (Chromium)
npm run test:visual   # regressão visual dos componentes representativos nos dois temas
npm run build         # dist/ (ESM + .d.ts + komitet-ui.css)
npm run build-storybook # catálogo estático em storybook-static/ (publicado no GitHub Pages a cada push na main)
```

Na primeira vez, rode `npx playwright install chromium`. Para atualizar as baselines visuais depois de uma mudança intencional, use `npm run test:visual -- --update`. As baselines dependem da plataforma (`*-chromium-darwin.png`).
