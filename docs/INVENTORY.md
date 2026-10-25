# Inventário Figma → React

Fonte: Figma `efiIkmlCZ1DyEoYhc6zvZr`, página **02 · Biblioteca** (72 conjuntos, 468 variantes).
Link de nó: `https://www.figma.com/design/efiIkmlCZ1DyEoYhc6zvZr?node-id=<id com hífen>`.

Regras de conversão:
- `Theme` nunca é prop: é o atributo `data-k-theme` aplicado por `<Theme>`.
- Hover, focus-visible e pressed são CSS. Disabled e read-only são atributos nativos.
- `State` que só representa conteúdo ou item selecionado (Default/Second/Third, Alt/Escape, Empty/Filled) não vira prop.
- `Show label` dos controles de formulário → o rótulo pertence a `Field`; os controles são “nus”.

| Seção | Figma (nó) | React | Props / estados | Dependência |
|---|---|---|---|---|
| 01 | Avatar `10:7` | `Avatar` | `name` → iniciais; sem nome = Empty | — |
| 01 | Badge `10:54` | `Badge` | `tone` neutral/success/warning/error | — |
| 01 | Spinner `10:141` | `Spinner` | `label`, role=status | — |
| 01 | Skeleton `10:168` | `Skeleton` | decorativo (aria-hidden) | — |
| 01 | Kbd `10:203` | `Kbd` | Alt/Escape = conteúdo | — |
| 01 | Separator `10:258` | `Separator` | `orientation`, `decorative` | radix-ui Separator |
| 01 | Progress `10:285` | `Progress` | `value=null` indeterminado (Loading); `value=max` Complete | radix-ui Progress |
| 02 | Button/Primary `11:89` · Secondary `11:198` · Destructive `11:307` · Quiet `11:416` · Button/Size `18:3525` | `Button` | `variant`, `size` sm/md/lg (32/42/52), `loading`, `disabled`, `asChild` | radix-ui Slot |
| 13 | IconButton `18:3588` | `IconButton` | `aria-label` obrigatório, `icon`, `size` | — |
| 02 | SignalButton `11:519` | `Toggle variant="signal"` | `pressed`/`defaultPressed`/`onPressedChange` | radix-ui Toggle |
| 02 | Toggle `11:578` | `Toggle` | idem | radix-ui Toggle |
| 02 | ButtonGroup `11:635` | `ButtonGroup` + `ButtonGroupItem` | role=group; Default/Second = item `primary` | — |
| 02 | ToggleGroup `11:702` | `ToggleGroup` + `ToggleGroupItem` | `type` single/multiple | radix-ui ToggleGroup |
| 13 | Field `18:3699` | `Field` | `label`, `description`, `error`, `success`; liga ids/aria | — |
| 03 | Label `12:1584` | `Label` | — | radix-ui Label |
| 03 | Input `12:251` | `Input` | Error/Success via Field; ReadOnly/Disabled nativos | — |
| 03 | Textarea `12:422` | `Textarea` | idem | — |
| 03 | Select `12:567` | `Select` | `<select>` nativo; `placeholder` | — |
| 03 | Checkbox `12:692` | `Checkbox` | `checked` boolean/'indeterminate' (Mixed); DisabledOn = disabled+checked | radix-ui Checkbox |
| 03 | RadioGroup `12:813` | `RadioGroup` + `RadioGroupItem` | — | radix-ui RadioGroup |
| 03 | Switch `12:916` | `Switch` | `checked`/`defaultChecked` | radix-ui Switch |
| 03 | Slider `12:1087` | `Slider` | valor e unidade visíveis | radix-ui Slider |
| 03 | FileInput `12:1220` | `FileInput` | input file nativo | — |
| 03 | SearchInput `12:1299` | `Input type="search"` | — | — |
| 03 | PasswordInput `12:1396` | `PasswordInput` | revelar com `aria-pressed` | — |
| 03 | InputGroup `12:1493` | `InputGroup` + `InputAddon` | — | — |
| 04 | Card/Paper `13:639` · Plate `13:1080` · Module `13:1549` · Compact `13:2018` | `Card` + partes | `material`, `selected`, `disabled`; Loading/Empty/Error = composições | — |
| 05 | Table/Standard `13:2422` · Compact `13:2587` · Zebra `13:2752` | `Table` | `density`, `striped`, linha `selected` | — |
| 05 | DataTable `13:2923` | `DataTable` | seleção, `loading`, `empty`, `error` | — |
| 05 | Pagination `13:3436` | `Pagination` | `page`, `pageCount`, `onPageChange` | — |
| 06 | Tabs `14:2021` | `Tabs` | — | radix-ui Tabs |
| 06 | Breadcrumb `14:2104` | `Breadcrumb` | `aria-current` no último | — |
| 06 | Accordion `14:2129` | `Accordion` | Closed/Open | radix-ui Accordion |
| 06 | Collapsible `14:2178` | `Collapsible` | Closed/Open | radix-ui Collapsible |
| 06 | Sidebar `14:2227` | `Sidebar` | item ativo com `aria-current` | — |
| 07 | Alert `14:2337` | `Alert` | `tone` | — |
| 07 | Toast `14:2410` | `Toaster`, `toast()` | Default/Error | radix-ui Toast |
| 07 | Empty `14:2461` | `Empty` | título, descrição, ação | — |
| 08 | Dialog `15:2163` | `Dialog` | Form/Loading/Error/Success = composições | radix-ui Dialog |
| 08 | AlertDialog `15:2474` | `AlertDialog` | Loading/Error = composições | radix-ui AlertDialog |
| 08 | Sheet `15:2657` | `Sheet` | `side` | radix-ui Dialog |
| 08 | Drawer `15:2888` | `Drawer` | sem gesto de arrasto | radix-ui Dialog |
| 09 | DropdownMenu `15:3086` | `DropdownMenu` | — | radix-ui DropdownMenu |
| 09 | ContextMenu `15:3261` | `ContextMenu` | + controle visível equivalente | radix-ui ContextMenu |
| 09 | Menubar `15:3416` | `Menubar` | — | radix-ui Menubar |
| 09 | Popover `15:3499` | `Popover` | — | radix-ui Popover |
| 09 | HoverCard `15:3530` | `HoverCard` | hover + foco + clique | radix-ui Popover |
| 09 | Tooltip `15:3561` | `Tooltip` | — | radix-ui Tooltip |
| 10 | Command `16:2847` | `Command` | vazio explícito | cmdk |
| 10 | Combobox `16:2988` | `Combobox` | combobox WAI-ARIA | radix-ui Popover |
| 10 | InputOTP `16:3097` | `InputOTP` | 6 dígitos | input-otp |
| 10 | Calendar `16:3364` | `Calendar` | — | react-day-picker |
| 10 | DatePicker `16:3713` | `DatePicker` | dd/mm/aaaa | react-day-picker + radix-ui Popover |
| 10 | DateRange `16:3812` | `DateRange` | fim ≥ início | react-day-picker |
| 11 | Gauge `16:3896` | `Gauge` | role=meter; Low/High derivados de limiares | — (SVG) |
| 11 | Readout `16:4161` | `Readout` | `error`; Low derivado | — |
| 11 | Terminal `16:4244` | `Terminal` | role=log | — |
| 11 | Annunciator `16:4299` | `Annunciator` | `tone` | — |
| 12 | Item `17:3419` | `Item` | — | — |
| 12 | Resizable `17:3470` | `Resizable` | divisão por Slider (como no Figma) | — |
| 12 | Carousel `17:3561` | `Carousel` | uma ficha por vez; sem autoplay | — |
| 12 | AspectRatio `17:3644` | `AspectRatio` | CSS `aspect-ratio` | — |
| 14 | DescriptionList `24:3601` | `DescriptionList` | dl/dt/dd | — |
