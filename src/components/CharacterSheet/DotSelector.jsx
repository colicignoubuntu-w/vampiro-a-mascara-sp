export default function DotSelector({
  value,
  min = 0,
  max = 5,
  onChange,
}) {
  function handleClick(
    selectedValue
  ) {
    /*
      Se clicar exatamente no
      último ponto preenchido,
      remove 1 ponto.
    */

    if (
      selectedValue === value &&
      value > min
    ) {
      onChange(value - 1)

      return
    }

    /*
      Permite preencher diretamente
      até a bolinha clicada.
    */

    if (
      selectedValue >= min &&
      selectedValue <= max
    ) {
      onChange(selectedValue)
    }
  }

  return (
    <div className="dot-selector">
      {Array.from({
        length: max,
      }).map((_, index) => {
        const dotValue =
          index + 1

        const active =
          dotValue <= value

        return (
          <button
            key={dotValue}
            type="button"
            className={
              active
                ? 'dot active'
                : 'dot'
            }
            onClick={() =>
              handleClick(
                dotValue
              )
            }
            aria-label={`Nível ${dotValue}`}
          />
        )
      })}
    </div>
  )
}