import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats} from '@react-three/drei'
import Walls from './Walls.jsx'
import Floor from './Floor.jsx'
import Baseboard from './Baseboard.jsx'
import { Suspense } from 'react'
import * as THREE from 'three'

export default function Scene({ room, wallColor }) {
  const { length, width, height } = room
  const halfW = width / 2
  const halfL = length / 2
  return (
    <Canvas
      camera={{ position: [8, 5, 8], fov: 50 }}
      shadows={{ type: THREE.PCFShadowMap }}
    >
      <ambientLight intensity={0.4} />
      {/* <directionalLight
        position={[-10, 15, -10]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      /> */}
      {/* 4 точечных источника в углах комнаты */}
      <pointLight position={[ halfL - 0.5, height * 0.8,  halfW - 0.5]} intensity={1.5} castShadow />
      <pointLight position={[-halfL + 0.5, height * 0.8,  halfW - 0.5]} intensity={1.5} castShadow />
      <pointLight position={[ halfL - 0.5, height * 0.8, -halfW + 0.5]} intensity={1.5} castShadow />
      <pointLight position={[-halfL + 0.5, height * 0.8, -halfW + 0.5]} intensity={1.5} castShadow />
      <pointLight position={[0, height * 0.8, 0]} intensity={1.5} castShadow />
      <OrbitControls target={[0, 1.5, 0]} />
      <Stats />
      <group position={[0, 0, 0]}>
        <Walls room={room} color={wallColor} />
        <Suspense fallback={null}>
          <Floor room={room} />
        </Suspense>
        <Baseboard room={room} />
      </group>
      <gridHelper args={[20, 20, '#888', '#444']} position={[0, -0.01, 0]} />
    </Canvas>
  )
}