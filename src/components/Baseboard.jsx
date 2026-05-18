import { useMemo } from 'react'

export default function Baseboard({ room }) {
  const { length, width, height } = room
  const h = 0.06  // высота плинтуса
  const d = 0.015 // толщина
  const y = h / 2 // центр по Y от пола

  // 4 отрезка по периметру, уложены вплотную к стенам
  const parts = useMemo(() => {
    const t = 0.1 // толщина стен (как в Walls)
    const inner = {
      minX: -length/2 - t/2 + d/2,
      maxX:  length/2 + t/2 - d/2,
      minZ: -width/2 - t/2 + d/2,
      maxZ:  width/2 + t/2 - d/2,
    }
    return [
      // нижний ( -Z )
      { pos: [0, y, inner.minZ + t / 2], size: [length + t, h, d] },
      // верхний ( +Z )
      { pos: [0, y, inner.maxZ - t / 2], size: [length + t, h, d] },
      // левый ( -X )
      { pos: [inner.minX + t / 2, y, 0], size: [d, h, width + t] },
      // правый ( +X )
      { pos: [inner.maxX - t / 2, y, 0], size: [d, h, width + t] },
    ]
  }, [length, width])

  return (
    <group>
      {parts.map((p, i) => (
        <mesh key={i} position={p.pos} castShadow receiveShadow>
          <boxGeometry args={p.size} />
          <meshStandardMaterial color="#f0e6d2" roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}