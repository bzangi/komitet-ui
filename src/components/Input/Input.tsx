import { useState, type ComponentProps, type ReactNode } from 'react'
import { useFieldControl } from '../Field/Field.js'
import { cx } from '../../utils/cx.js'

export type InputProps = ComponentProps<'input'>

/** Campo de texto; `type="search"` cobre o SearchInput. Rótulo e mensagens vêm do `Field`. Figma 12:251 · 12:1299. */
export function Input({ className, ...props }: InputProps) {
  return <input className={cx('k-input', className)} {...useFieldControl(props)} />
}

export type TextareaProps = ComponentProps<'textarea'>

/** Registro de várias linhas. Figma 12:422. */
export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={cx('k-input', 'k-textarea', className)} {...useFieldControl(props)} />
}

export type SelectProps = ComponentProps<'select'> & { placeholder?: string }

/** Seleção nativa em lista conhecida (o Figma não desenha a lista aberta). Figma 12:567. */
export function Select({ className, placeholder, children, ...props }: SelectProps) {
  return (
    <span className={cx('k-select', className)}>
      <select
        className="k-input"
        {...useFieldControl(props)}
        defaultValue={props.defaultValue ?? (props.value === undefined && placeholder ? '' : undefined)}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    </span>
  )
}

/** Campo com complemento (unidade, prefixo ou ação). Figma 12:1493. */
export function InputGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx('k-input-group', className)} {...props} />
}

/** Unidade ou prefixo. Inclua a unidade também no rótulo ou na descrição do `Field`. */
export function InputAddon({ className, ...props }: ComponentProps<'span'>) {
  return <span className={cx('k-input-group__addon', className)} {...props} />
}

export type PasswordInputProps = Omit<InputProps, 'type'> & { revealLabel?: string }

/** Senha com revelação (`aria-pressed`). Figma 12:1396. */
export function PasswordInput({ revealLabel = 'Mostrar', disabled, ...props }: PasswordInputProps) {
  const [shown, setShown] = useState(false)
  return (
    <InputGroup>
      <Input type={shown ? 'text' : 'password'} disabled={disabled} autoComplete="current-password" {...props} />
      <button
        type="button"
        className="k-input-group__action"
        aria-pressed={shown}
        aria-label={`${revealLabel} senha`}
        disabled={disabled}
        onClick={() => setShown(s => !s)}
      >
        {revealLabel}
      </button>
    </InputGroup>
  )
}

export type FileInputProps = Omit<InputProps, 'type'> & { placeholder?: ReactNode }

/** Seleção de anexo; mostra o nome do arquivo escolhido. Figma 12:1220. */
export function FileInput({ className, placeholder = 'Selecionar arquivo', onChange, ...props }: FileInputProps) {
  const [names, setNames] = useState('')
  return (
    <span className={cx('k-input', 'k-file', className)} data-filled={names ? '' : undefined}>
      <input
        type="file"
        className="k-file__native"
        {...useFieldControl(props)}
        onChange={event => {
          setNames([...(event.currentTarget.files ?? [])].map(f => f.name).join(', '))
          onChange?.(event)
        }}
      />
      <span aria-hidden className="k-file__text">
        {names ? (
          <>
            {placeholder}
            <span className="k-file__sep">|</span>
            {names}
          </>
        ) : (
          placeholder
        )}
      </span>
    </span>
  )
}
