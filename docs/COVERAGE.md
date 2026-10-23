# Cobertura

Legenda: ✅ concluído (story nos dois temas, estados, testes, comparado ao Figma) · 🟡 parcial · ⬜ pendente.
A biblioteca não está pronta enquanto houver ⬜ ou 🟡.

## Fundamentos
| Item | Status | Nota |
|---|---|---|
| Tokens (Primitives, semânticos por tema, Metrics, Typography, relevos) | ✅ | comparados com 7:2, 7:74 e 7:87 no Storybook |
| `Theme` | 🟡 | sem container de portal (entra com overlays) |
| Tokens de texto de status (`--k-*-text`) | ✅ | ver divergência 9 |

## Pendências transversais
| Item | Status | Nota |
|---|---|---|
| Pacote instalável em consumidor `moduleResolution: NodeNext` | ⬜ | `.d.ts` emitidos com imports relativos sem `.js`; validar com `npm pack` + app limpo |
| `Theme` → contexto para portais (overlays herdam o tema) | ⬜ | antes do primeiro overlay |
| Decisão sobre texto de status (divergência 9) | ⬜ | aguardando o dono do design |

## Componentes
| Componente | Figma | Status | Nota |
|---|---|---|---|
| Avatar | 10:7 | ⬜ | |
| Badge | 10:54 | ✅ | necessário para os estados do Card |
| Spinner | 10:141 | ⬜ | |
| Skeleton | 10:168 | ⬜ | |
| Kbd | 10:203 | ⬜ | |
| Separator | 10:258 | ⬜ | |
| Progress | 10:285 | ⬜ | |
| Button | 11:89 · 11:198 · 11:307 · 11:416 · 18:3525 | ✅ | 4 variantes, 3 tamanhos, loading, asChild |
| IconButton | 18:3588 | ✅ | aria-label obrigatório |
| SignalButton | 11:519 | ⬜ | |
| Toggle | 11:578 | ⬜ | |
| ButtonGroup | 11:635 | ⬜ | |
| ToggleGroup | 11:702 | ⬜ | |
| Field | 18:3699 | ✅ | label/description/error/success, hideLabel |
| Label | 12:1584 | ✅ |  |
| Input | 12:251 | ✅ | Empty/Filled/Focus/Error/Success/ReadOnly/Disabled |
| Textarea | 12:422 | ⬜ | |
| Select | 12:567 | ⬜ | |
| Checkbox | 12:692 | ✅ | Mixed = indeterminate |
| RadioGroup | 12:813 | ⬜ | |
| Switch | 12:916 | ✅ |  |
| Slider | 12:1087 | ⬜ | |
| FileInput | 12:1220 | ⬜ | |
| SearchInput | 12:1299 | ⬜ | |
| PasswordInput | 12:1396 | ⬜ | |
| InputGroup | 12:1493 | ⬜ | |
| Card | 13:639 · 13:1080 · 13:1549 · 13:2018 | ✅ | paper/plate/compact; Module = Plate. Story de Loading usa barras provisórias até o Skeleton |
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
2. **Foco:** no Figma é um traço tracejado (`[4,3]`/`[3,3]`); os estilos `*/Focus` não são usados. Implementado com `outline`/`border` `dashed`; o comprimento do traço depende do navegador.
3. **Fontes:** o Figma usa Courier Prime no lugar de Courier New. A lib não embute fontes; as pilhas caem para Courier New e monospace do sistema.
4. **Alturas de controle:** os frames têm 34/44/54 px porque o traço interno de 1 px soma à altura no Figma. A descrição do Button/Size e as variáveis `control/32|42|52` indicam 32/42/52 px, que é o que a lib usa. Efeito visível: o aro de metal fica com 2 px na vertical em vez de 3 px. `control/44` não é usado.
5. **Default/Second(/Third)** em ButtonGroup, ToggleGroup, Pagination, Tabs, Menubar e Carousel representam o item ativo, não um estado.
6. **Card com Focus** só existe quando o card é interativo (`asChild` com link/botão).
7. **Loading do Button** é visualmente igual ao Disabled (face `soft`), só troca o rótulo por “Aguarde…”. Implementado com `aria-busy` + `aria-disabled`, mantendo o foco; sem spinner extra.
8. **Label** usa conteúdo em caixa alta no Figma, mas `textCase=ORIGINAL`. A lib não força caixa alta.
9. **Contraste de texto de status:** os tons `good`/`warn`/`bad` passam 4.5:1 sobre `surface`, mas não sobre `paper` (Industrial: `bad` 2.82:1, `good` 3.30:1, `warn` 2.85:1; Construtivista: `warn` 4.33:1). O próprio Figma põe a mensagem de erro do Input Industrial sobre `paper` (frame 12:302). A lib usa `--k-good-text`/`--k-warn-text`/`--k-bad-text`, misturados com `ink` só o necessário para ≥ 4.5:1 sobre `paper` e `surface`. Na Industrial o resultado é bem mais escuro que o tom original. Lentes, bordas e o Badge (fundo `surface`) usam o tom puro. **Decisão pendente do dono do design.**
10. **Card/Module** é idêntico ao Card/Plate em todas as variantes, nos dois temas (verificado por comparação estrutural). A API expõe `paper | plate | compact`.
11. **Button/Quiet** não tem diferença visual em Hover, Focus nem Pressed no Figma. A lib aplica o mesmo traço de foco das outras teclas (obrigatório para teclado); hover e pressed continuam sem efeito.
12. **Largura do Button:** o Figma usa largura fixa (112/140/180) e padding de 4 px. A lib usa essas larguras como `min-width` e 12 px de padding lateral, para rótulos longos.
13. **Ícones:** o IconButton usa “add” do Material 3 Design Kit (biblioteca remota). A lib recebe o ícone por slot e não distribui ícones.
14. **Marca do Checkbox:** o Figma usa os glifos de texto “✓” e “−” em PT Sans Bold. PT Sans não tem “✓”, então o desenho do glifo depende da fonte de fallback, tanto no Figma quanto no navegador.
15. **Card/Paper:** o frame tem 2 px de moldura na vertical e 3 px na horizontal. A lib usa 3 px nos dois eixos.
