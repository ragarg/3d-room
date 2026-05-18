export default function UI({
  length, setLength,
  width, setWidth,
  height, setHeight,
  layoutType, setLayoutType,
  color, setColor,
  paint,
  baseboard,
  planks
}) {
  return (
    <div style={{
      width: 300, padding: 20, background: '#222', color: '#fff',
      overflowY: 'auto', fontFamily: 'sans-serif'
    }}>
      <h2>Параметры комнаты</h2>
      <label>
        Длина (м):
        <input type="number" value={length} min={2} max={10} step={0.1}
          onChange={e => setLength(Number(e.target.value))} />
      </label>
      <br />
      <label>
        Ширина (м):
        <input type="number" value={width} min={2} max={10} step={0.1}
          onChange={e => setWidth(Number(e.target.value))} />
      </label>
      <br />
      <label>
        Высота (м):
        <input type="number" value={height} min={2} max={5} step={0.1}
          onChange={e => setHeight(Number(e.target.value))} />
      </label>
      <br />
      <label>
        Тип раскладки:
        <select value={layoutType} onChange={e => setLayoutType(e.target.value)}>
          <option value="straight">Прямая</option>
          <option value="herringbone">Ёлочка</option>
        </select>
      </label>
      <br />
      <label>
        Цвет стен:
        <input type="color" value={color} onChange={e => setColor(e.target.value)} />
      </label>

      <h3>Расчёты</h3>
      <p>Краска (стены): {paint.liters.toFixed(2)} л (площадь {paint.wallArea.toFixed(2)} м²)</p>
      <p>Плинтус (периметр): {baseboard.toFixed(2)} пог. м</p>
      <p>Плашки: {planks.total} шт.</p>
      <p>С запасом (+5%): {planks.withReserve} шт.</p>
      <p>Площадь пола: {planks.floorArea.toFixed(2)} м²</p>
      <p>Площадь одной плашки: {planks.plankArea.toFixed(4)} м²</p>
    </div>
  )
}