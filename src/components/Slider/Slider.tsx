import { useId, useState, type ComponentProps, type ReactNode } from 'react'
import { Slider as SliderPrimitive } from 'radix-ui'
import { cx } from '../../utils/cx'

export type SliderProps = Omit<ComponentProps<typeof SliderPrimitive.Root>, 'value' | 'defaultValue' | 'onValueChange' | 'children'> & {
  label: ReactNode
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  /** Unidade exibida e anunciada junto do valor. */
  unit?: string
}

/** Ajuste contínuo por trilho mecânico, sempre com valor e unidade visíveis. Figma 12:1087. */
export function Slider({ label, value, defaultValue = 0, onValueChange, unit = '', className, ...props }: SliderProps) {
  const [inner, setInner] = useState(defaultValue)
  const current = value ?? inner
  const labelId = useId()
  return (
    <div className={cx('k-slider', className)}>
      <span className="k-slider__label">
        <span id={labelId}>{label}</span> · {current}
        {unit}
      </span>
      <SliderPrimitive.Root
        className="k-slider__control"
        value={[current]}
        onValueChange={([v]) => {
          setInner(v!)
          onValueChange?.(v!)
        }}
        {...props}
      >
        <SliderPrimitive.Track className="k-slider__track" />
        <SliderPrimitive.Thumb className="k-slider__thumb" aria-labelledby={labelId} aria-valuetext={`${current}${unit}`} />
      </SliderPrimitive.Root>
    </div>
  )
}
