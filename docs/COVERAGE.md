# Cobertura

Legenda: ✅ concluído (story nos dois temas, estados, testes, comparado ao Figma) · 🟡 parcial · ⬜ pendente.
A biblioteca não está pronta enquanto houver ⬜ ou 🟡.

## Fundamentos
| Item | Status | Nota |
|---|---|---|
| Tokens (Primitives, semânticos por tema, Metrics, Typography, relevos) | ✅ | comparados com 7:2, 7:74 e 7:87 no Storybook |
| `Theme` | ✅ | contexto + `ThemeScope` reaplicam o tema dentro de portais |
| Tokens de texto de status (`--k-*-text`) | ✅ | ver divergência 9 |

## Pendências transversais
| Item | Status | Nota |
|---|---|---|
| Pacote instalável em consumidor `moduleResolution: NodeNext` | ⬜ | `.d.ts` emitidos com imports relativos sem `.js`; validar com `npm pack` + app limpo |
| `Theme` → contexto para portais (overlays herdam o tema) | ✅ | testado no Dialog nos dois temas |
| Decisão sobre texto de status (divergência 9) | ✅ | aprovado em 2026-10-23: escurecer só o texto (`--k-*-text`) |

## Componentes
| Componente | Figma | Status | Nota |
|---|---|---|---|
| Avatar | 10:7 | ✅ | iniciais; Empty = sem `name` |
| Badge | 10:54 | ✅ | necessário para os estados do Card |
| Spinner | 10:141 | ✅ | role=status; rotação funcional (interpretação) |
| Skeleton | 10:168 | ✅ | estático |
| Kbd | 10:203 | ✅ |  |
| Separator | 10:258 | ✅ |  |
| Progress | 10:285 | ✅ | `value=null` indeterminado |
| Button | 11:89 · 11:198 · 11:307 · 11:416 · 18:3525 | ✅ | 4 variantes, 3 tamanhos, loading, asChild |
| IconButton | 18:3588 | ✅ | aria-label obrigatório |
| SignalButton | 11:519 | ✅ | `<Toggle variant="signal">` |
| Toggle | 11:578 | ✅ | aria-pressed; rótulo preservado |
| ButtonGroup | 11:635 | ✅ | `ButtonGroupItem primary` = ênfase |
| ToggleGroup | 11:702 | ✅ | single/multiple, setas |
| Field | 18:3699 | ✅ | label/description/error/success, hideLabel |
| Label | 12:1584 | ✅ |  |
| Input | 12:251 | ✅ | Empty/Filled/Focus/Error/Success/ReadOnly/Disabled |
| Textarea | 12:422 | ✅ |  |
| Select | 12:567 | ✅ | `<select>` nativo |
| Checkbox | 12:692 | ✅ | Mixed = indeterminate |
| RadioGroup | 12:813 | ✅ | setas, rótulo clicável |
| Switch | 12:916 | ✅ |  |
| Slider | 12:1087 | ✅ | valor + unidade no rótulo e em aria-valuetext |
| FileInput | 12:1220 | ✅ | input nativo sobre o campo |
| SearchInput | 12:1299 | ✅ | `<Input type="search">` |
| PasswordInput | 12:1396 | ✅ | revelar com aria-pressed |
| InputGroup | 12:1493 | ✅ | `InputGroup` + `InputAddon` |
| Card | 13:639 · 13:1080 · 13:1549 · 13:2018 | ✅ | paper/plate/compact; Module = Plate. |
| Table | 13:2422 · 13:2587 · 13:2752 | ⬜ | |
| DataTable | 13:2923 | ⬜ | |
| Pagination | 13:3436 | ⬜ | |
| Tabs | 14:2021 | ✅ | setas; segmentos |
| Breadcrumb | 14:2104 | ✅ | nav + aria-current |
| Accordion | 14:2129 | ✅ | + / −; aria-expanded |
| Collapsible | 14:2178 | ✅ |  |
| Sidebar | 14:2227 | ✅ | `SidebarItem current`; asChild para router |
| Alert | 14:2337 | ✅ | tom default/warning/error; role alert/status |
| Toast | 14:2410 | ✅ | `<Toaster>` + `toast()`; sem botão fechar (ver 25) |
| Empty | 14:2461 | ✅ |  |
| Dialog | 15:2163 | ✅ | foco preso, Esc, retorno do foco; status error/success |
| AlertDialog | 15:2474 | ✅ | só fecha pelas ações; foco inicial em Cancelar |
| Sheet | 15:2657 | ✅ | `SheetContent` (direita, altura total) |
| Drawer | 15:2888 | ✅ | `DrawerContent` (base); sem gesto de arrasto |
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
| Item | 17:3419 | ✅ | media/title/description/action |
| Resizable | 17:3470 | ⬜ | |
| Carousel | 17:3561 | ⬜ | |
| AspectRatio | 17:3644 | ✅ | CSS `aspect-ratio` |
| DescriptionList | 24:3601 | ✅ | `DescriptionList` + `DescriptionItem` |

## Divergências e ambiguidades em relação ao Figma
1. **Textura:** os Fundamentos pedem “textura discreta”, mas não há image fill nem gradiente nos componentes. Entregue sem textura.
2. **Foco:** no Figma é um traço tracejado (`[4,3]`/`[3,3]`); os estilos `*/Focus` não são usados. Implementado com `outline`/`border` `dashed`; o comprimento do traço depende do navegador.
3. **Fontes:** o Figma usa Courier Prime no lugar de Courier New. A lib não embute fontes; as pilhas caem para Courier New e monospace do sistema.
4. **Alturas de controle:** os frames têm 34/44/54 px porque o traço interno de 1 px soma à altura no Figma. A descrição do Button/Size e as variáveis `control/32|42|52` indicam 32/42/52 px, que é o que a lib usa. Efeito visível: o aro de metal fica com 2 px na vertical em vez de 3 px. `control/44` não é usado.
5. **Default/Second(/Third)** em ButtonGroup, ToggleGroup, Pagination, Tabs, Menubar e Carousel representam o item ativo, não um estado.
6. **Card com Focus** só existe quando o card é interativo (`asChild` com link/botão).
7. **Loading do Button** é visualmente igual ao Disabled (face `soft`), só troca o rótulo por “Aguarde…”. Implementado com `aria-busy` + `aria-disabled`, mantendo o foco; sem spinner extra.
8. **Label** usa conteúdo em caixa alta no Figma, mas `textCase=ORIGINAL`. A lib não força caixa alta.
9. **Contraste de texto de status:** os tons `good`/`warn`/`bad` passam 4.5:1 sobre `surface`, mas não sobre `paper` (Industrial: `bad` 2.82:1, `good` 3.30:1, `warn` 2.85:1; Construtivista: `warn` 4.33:1). O próprio Figma põe a mensagem de erro do Input Industrial sobre `paper` (frame 12:302). A lib usa `--k-good-text`/`--k-warn-text`/`--k-bad-text`, misturados com `ink` só o necessário para ≥ 4.5:1 sobre `paper` e `surface`. Na Industrial o resultado é bem mais escuro que o tom original. Lentes, bordas e o Badge (fundo `surface`) usam o tom puro. **Aprovado pelo Bruno em 2026-10-23.**
10. **Card/Module** é idêntico ao Card/Plate em todas as variantes, nos dois temas (verificado por comparação estrutural). A API expõe `paper | plate | compact`.
11. **Button/Quiet** não tem diferença visual em Hover, Focus nem Pressed no Figma. A lib aplica o mesmo traço de foco das outras teclas (obrigatório para teclado); hover e pressed continuam sem efeito.
12. **Largura do Button:** o Figma usa largura fixa (112/140/180) e padding de 4 px. A lib usa essas larguras como `min-width` e 12 px de padding lateral, para rótulos longos.
13. **Ícones:** o IconButton usa “add” do Material 3 Design Kit (biblioteca remota). A lib recebe o ícone por slot e não distribui ícones.
14. **Marca do Checkbox:** o Figma usa os glifos de texto “✓” e “−” em PT Sans Bold. PT Sans não tem “✓”, então o desenho do glifo depende da fonte de fallback, tanto no Figma quanto no navegador.
15. **Card/Paper:** o frame tem 2 px de moldura na vertical e 3 px na horizontal. A lib usa 3 px nos dois eixos.
16. **Spinner e Progress indeterminado** são estáticos no Figma. A lib anima a rotação do anel e o deslocamento do segmento, por serem indicadores funcionais de atividade, e os dois param com `prefers-reduced-motion`. Skeleton continua estático.
17. **Larguras fixas de texto:** vários frames do Figma fixam a largura dos textos (por exemplo, a tecla Kbd com 68 px e o rótulo do Spinner com 164 px). Na lib os componentes se ajustam ao conteúdo.
18. **SignalButton:** a descrição fala em “lente”, mas o desenho não tem lente. O estado Selected só afunda a tecla (Inset no aro e na face), e a lib reproduz isso. Para tecnologias assistivas, o estado é exposto por `aria-pressed`.
19. **ButtonGroup e ToggleGroup** são visualmente idênticos. No ButtonGroup, o item em `brand` foi interpretado como ênfase de comando (`primary`). No ToggleGroup, ele é a seleção. Os segmentos não têm Hover, Focus, Pressed nem Disabled desenhados: a lib usa o foco tracejado padrão e o texto `muted` para Disabled.
20. **Select:** o Figma só desenha o campo fechado com o glifo ▾, sem a lista aberta. A lib usa o `<select>` nativo estilizado, cuja lista é a do sistema operacional, em vez de inventar o desenho de um popup.
21. **SearchInput** é idêntico ao Input no Figma (sem ícone nem botão de limpar). Implementado como `<Input type="search">`.
22. **FileInput vazio:** o placeholder do Figma (“Nome da estação”) é texto copiado do Input. A lib usa “Selecionar arquivo”, o mesmo prefixo do estado preenchido.
23. **Mensagem de erro do Select no Figma** (“Use pelo menos 4 caracteres.”) também é texto copiado do Input. O conteúdo é do consumidor.
24. **InputGroup:** a unidade (por exemplo, “V”) é só visual. Inclua a unidade no rótulo ou na descrição do `Field` para que seja anunciada.
25. **Toast:** o Figma não tem botão de fechar. A lib não adiciona um: a notificação some sozinha (o tempo pausa com hover ou foco), com Esc (F8 leva o foco à área de notificações) ou com gesto de arrastar. O Error usa `type="foreground"`, anunciado com mais prioridade.
26. **Alert “Default”** usa a moldura `good` (verde), portanto é um aviso positivo, não neutro. A API chama esse tom de `default` para manter o nome do Figma.
27. **DescriptionList, Item e AspectRatio** aparecem no Figma sobre uma placa (aro + face). A placa é tratada como contêiner (`Card material="plate"`), não como parte do componente.
28. **Sidebar Selected:** o Figma troca o relevo do aro inteiro para Inset quando há um item selecionado. Como sempre há um item atual, a lib mantém o aro Raised e marca só o item (`soft` + borda `brand` + `aria-current`).
29. **Catálogo:** a regra `landmark-unique` do axe está desligada no Storybook, porque cada story é renderizada uma vez por tema e isso duplica os landmarks. Num app com um único tema a regra se aplica normalmente.
30. **Modais:** o Figma não desenha o fundo escurecido nem botão de fechar. A lib usa `ink` a 40% como fundo, e o fechamento é por Esc, clique fora ou ação explícita. O AlertDialog só fecha pelas ações. Sheet ancora à direita em altura total e Drawer na base (até 420 px), porque o Figma só mostra os painéis isolados, sem posição na tela. Os estados Form, Loading, Error e Success são composições (`status`, `Button loading`).
