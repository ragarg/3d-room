import { useState } from 'react'
import UI from './components/UI.jsx'
import Scene from './components/Scene.jsx'
import { calculatePaint, calculateBaseboard, calculatePlanks } from './utils/calculations.js'

export default function App() {
  const [length, setLength] = useState(5)      // м
  const [width, setWidth] = useState(4)        // м
  const [height, setHeight] = useState(2.7)    // м
  const [layoutType, setLayoutType] = useState('straight') // 'straight' | 'herringbone'
  const [color, setColor] = useState('#f5f0e1') // цвет стен

  const room = { length, width, height, layoutType }

  const paint = calculatePaint(room)
  const baseboard = calculateBaseboard(room)
  const planks = calculatePlanks(room)

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <Scene room={room} wallColor={color} />
      </div>
      <UI
        length={length} setLength={setLength}
        width={width} setWidth={setWidth}
        height={height} setHeight={setHeight}
        layoutType={layoutType} setLayoutType={setLayoutType}
        color={color} setColor={setColor}
        paint={paint}
        baseboard={baseboard}
        planks={planks}
      />
    </div>
  )
}