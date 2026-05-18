import { useRef, useEffect, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { getPlankPositions } from '../utils/floorLayout.js'

export default function Floor({ room }) {
  const { length, width, layoutType } = room
  const plankLength = 0.6
  const plankWidth = 0.1
  const thickness = 0.015
  const plankOffset = 0.005

  const meshRef = useRef()
  
  let bc_texture = useTexture('/textures/Poliigon_WoodFloorAsh_4186/2K/Poliigon_WoodFloorAsh_4186_BaseColor.jpg');
  let r_texture = useTexture('/textures/Poliigon_WoodFloorAsh_4186/2K/Poliigon_WoodFloorAsh_4186_Roughness.jpg');
  let m_texture = useTexture('/textures/Poliigon_WoodFloorAsh_4186/2K/Poliigon_WoodFloorAsh_4186_Metallic.jpg');
  let n_texture = useTexture('/textures/Poliigon_WoodFloorAsh_4186/2K/Poliigon_WoodFloorAsh_4186_Normal.png');

  // Генерируем позиции и повороты
  const planks = useMemo(
    () => getPlankPositions(width, length, layoutType, plankLength, plankWidth, plankOffset),
    [width, length, layoutType]
  )

  // Применяем матрицы к инстансам при каждом изменении данных
  useEffect(() => {
    if (!meshRef.current) return
    const matrix = new THREE.Matrix4()
    const position = new THREE.Vector3()
    const scale = new THREE.Vector3()
    const quaternion = new THREE.Quaternion()
    const euler = new THREE.Euler(0, 0, 0, 'YXZ')

    planks.forEach((plank, i) => {
      position.set(plank.pos[0], thickness / 2, plank.pos[2])
      scale.set(plank.scale[0], plank.scale[1], plank.scale[2])
      euler.set(0, plank.rot, 0)          // поворот вокруг Y
      quaternion.setFromEuler(euler)
      matrix.compose(position, quaternion, scale)
      meshRef.current.setMatrixAt(i, matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [planks, thickness])

  return (
    <group>
      {/* Подстилка – сплошная плоскость под плашками */}
      <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#2c1e0f" roughness={0.9} />
      </mesh>
      <instancedMesh
        ref={meshRef}
        args={[null, null, planks.length]} // геометрию и материал зададим позже
      >
        <boxGeometry args={[plankLength, thickness, plankWidth]} />
        <meshStandardMaterial
          map={bc_texture || undefined}
          color={bc_texture ? 'white' : '#b08968'}
          roughnessMap={r_texture}
          metalnessMap={m_texture}
          normalMap={n_texture}
          roughness={1}
          metalness={1}
          normalScale={[1, 1]}
        />
      </instancedMesh>
    </group>
  )
}