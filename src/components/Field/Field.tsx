import { createContext, useContext, useId, type ComponentProps, type ReactNode } from 'react'
import { Label as LabelPrimitive } from 'radix-ui'
import { cx } from '../../utils/cx.js'

type FieldContextValue = {
  id: string
  hintId?: string
  invalid: boolean
  status?: 'error' | 'success'
}

const FieldContext = createContext<FieldContextValue | null>(null)

/** Props que um controle de formulário herda do `Field` mais próximo. */
export function useFieldControl<P extends { id?: string; 'aria-describedby'?: string; 'aria-invalid'?: ComponentProps<'input'>['aria-invalid'] }>(props: P) {
  const field = useContext(FieldContext)
  if (!field) return props
  return {
    ...props,
    id: props.id ?? field.id,
    'aria-describedby': cx(field.hintId, props['aria-describedby']) || undefined,
    'aria-invalid': props['aria-invalid'] ?? (field.invalid || undefined),
    'data-status': field.status,
  }
}

export type LabelProps = ComponentProps<typeof LabelPrimitive.Root>

/** Rótulo de controle. Figma 12:1584. */
export function Label({ className, ...props }: LabelProps) {
  return <LabelPrimitive.Root className={cx('k-label', className)} {...props} />
}

export type FieldProps = Omit<ComponentProps<'div'>, 'children'> & {
  label: ReactNode
  /** Figma `Show label = false`: o rótulo continua disponível para tecnologias assistivas. */
  hideLabel?: boolean
  description?: ReactNode
  /** Mensagem de correção; marca o controle como inválido. */
  error?: ReactNode
  success?: ReactNode
  children: ReactNode
}

/** Rótulo + controle + mensagem. Figma 18:3699. */
export function Field({ label, hideLabel, description, error, success, className, children, ...props }: FieldProps) {
  const id = useId()
  const hint = error ?? success ?? description
  const status = error ? 'error' : success ? 'success' : undefined
  const hintId = hint ? `${id}-hint` : undefined
  return (
    <FieldContext.Provider value={{ id, hintId, invalid: !!error, status }}>
      <div className={cx('k-field', className)} {...props}>
        <Label htmlFor={id} className={hideLabel ? 'k-sr-only' : undefined}>
          {label}
        </Label>
        {children}
        {hint && (
          <p id={hintId} className="k-field__hint" data-status={status}>
            {hint}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  )
}
