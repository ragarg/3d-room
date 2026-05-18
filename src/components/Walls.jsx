import { useMemo } from 'react'

export default function Walls({ room, color }) {
  const { length, width, height } = room
  const t = 0.1 // толщина стен

  // Координаты четырёх стен, чтобы пол был на y=0
  const walls = useMemo(() => [
    // стена -Z
    { pos: [0, height/2, -width/2 - t/2], size: [length + t*2, height, t] },
    // стена +Z
    { pos: [0, height/2, width/2 + t/2],  size: [length + t*2, height, t] },
    // стена -X
    { pos: [-length/2 - t/2, height/2, 0], size: [t, height, width + t*2] },
    // стена +X
    { pos: [length/2 + t/2, height/2, 0],  size: [t, height, width + t*2] },
  ], [length, width, height])

  return (
    <group>
      {walls.map((w, i) => (
        <mesh key={i} position={w.pos} castShadow receiveShadow>
          <boxGeometry args={w.size} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}