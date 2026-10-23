# Cobertura

Legenda: ✅ concluído (story nos dois temas, estados, testes, comparado ao Figma) · 🟡 parcial · ⬜ pendente.
A biblioteca não está pronta enquanto houver ⬜ ou 🟡.

## Fundamentos
| Item | Status | Nota |
|---|---|---|
| Tokens (Primitives, semânticos por tema, Metrics, Typography, relevos) | ✅ | comparados com 7:2, 7:74 e 7:87 no Storybook |
| `Theme` | 🟡 | sem container de portal (entra com overlays) |

## Componentes
| Componente | Figma | Status | Nota |
|---|---|---|---|
| Avatar | 10:7 | ⬜ | |
| Badge | 10:54 | ⬜ | |
| Spinner | 10:141 | ⬜ | |
| Skeleton | 10:168 | ⬜ | |
| Kbd | 10:203 | ⬜ | |
| Separator | 10:258 | ⬜ | |
| Progress | 10:285 | ⬜ | |
| Button | 11:89 · 11:198 · 11:307 · 11:416 · 18:3525 | ⬜ | entrega 1 |
| IconButton | 18:3588 | ⬜ | entrega 1 |
| SignalButton | 11:519 | ⬜ | |
| Toggle | 11:578 | ⬜ | |
| ButtonGroup | 11:635 | ⬜ | |
| ToggleGroup | 11:702 | ⬜ | |
| Field | 18:3699 | ⬜ | entrega 1 |
| Label | 12:1584 | ⬜ | entrega 1 |
| Input | 12:251 | ⬜ | entrega 1 |
| Textarea | 12:422 | ⬜ | |
| Select | 12:567 | ⬜ | |
| Checkbox | 12:692 | ⬜ | entrega 1 |
| RadioGroup | 12:813 | ⬜ | |
| Switch | 12:916 | ⬜ | entrega 1 |
| Slider | 12:1087 | ⬜ | |
| FileInput | 12:1220 | ⬜ | |
| SearchInput | 12:1299 | ⬜ | |
| PasswordInput | 12:1396 | ⬜ | |
| InputGroup | 12:1493 | ⬜ | |
| Card | 13:639 · 13:1080 · 13:1549 · 13:2018 | ⬜ | entrega 1 |
| Table | 13:2422 · 13:2587 · 13:2752 | ⬜ | |
| DataTable | 13:2923 | ⬜ | |
| Pagination | 13:3436 | ⬜ | |
| Tabs | 14:2021 | ⬜ | |
| Breadcrumb | 14:2104 | ⬜ | |
| Accordion | 14:2129 | ⬜ | |
| Collapsible | 14:2178 | ⬜ | |
| Sidebar | 14:2227 | ⬜ | |
| Alert | 14:2337 | ⬜ | |
| Toast | 14:2410 | ⬜ | |
| Empty | 14:2461 | ⬜ | |
| Dialog | 15:2163 | ⬜ | |
| AlertDialog | 15:2474 | ⬜ | |
| Sheet | 15:2657 | ⬜ | |
| Drawer | 15:2888 | ⬜ | |
| DropdownMenu | 15:3086 | ⬜ | |
| ContextMenu | 15:3261 | ⬜ | |
| Menubar | 15:3416 | ⬜ | |
| Popover | 15:3499 | ⬜ | |
| HoverCard | 15:3530 | ⬜ | |
| Tooltip | 15:3561 | ⬜ | |
| Command | 16:2847 | ⬜ | |
| Combobox | 16:2988 | ⬜ | |
| InputOTP | 16:3097 | ⬜ | |
| Calendar | 16:3364 | ⬜ | |
| DatePicker | 16:3713 | ⬜ | |
| DateRange | 16:3812 | ⬜ | |
| Gauge | 16:3896 | ⬜ | |
| Readout | 16:4161 | ⬜ | |
| Terminal | 16:4244 | ⬜ | |
| Annunciator | 16:4299 | ⬜ | |
| Item | 17:3419 | ⬜ | |
| Resizable | 17:3470 | ⬜ | |
| Carousel | 17:3561 | ⬜ | |
| AspectRatio | 17:3644 | ⬜ | |
| DescriptionList | 24:3601 | ⬜ | |

## Divergências e ambiguidades em relação ao Figma
1. **Textura:** os Fundamentos pedem “textura discreta”, mas não há image fill nem gradiente nos componentes. Entregue sem textura.
2. **Foco:** no Figma é um traço tracejado (`[4,3]`/`[3,3]`); os estilos `*/Focus` não são usados. Implementado como `outline: dashed`, e o comprimento do traço depende do navegador.
3. **Fontes:** o Figma usa Courier Prime no lugar de Courier New. A lib não embute fontes; as pilhas caem para Courier New e monospace do sistema.
4. **`control/*`:** as variáveis existem, mas nenhum nó as usa. As alturas vêm da geometria e do Button/Size (32/42/52); `control/44` não tem uso.
5. **Default/Second(/Third)** em ButtonGroup, ToggleGroup, Pagination, Tabs, Menubar e Carousel representam o item ativo, não um estado.
6. **Card com Focus** só existe quando o card é interativo (`asChild` com link/botão).
7. **Loading do Button** é visualmente igual ao Disabled no Figma (só muda o rótulo). Implementado com `aria-busy`, sem spinner extra.
8. **Label** usa conteúdo em caixa alta no Figma, mas `textCase=ORIGINAL`. A lib não força caixa alta.
