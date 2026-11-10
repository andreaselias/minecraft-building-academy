import { OrbitControls } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import type { OrthographicCamera } from 'three'
import type { Blueprint } from '../domain/blueprint'
import { BlockMesh } from './BlockMesh'

export type CameraPreset = 'iso' | 'top' | 'front' | 'side'

interface BlueprintViewerProps {
  blueprint: Blueprint
  layer: number
  showPrevious: boolean
  cameraPreset: CameraPreset
}

const cameraPositions: Record<CameraPreset, [number, number, number]> = {
  iso: [15, 12, 15],
  top: [0, 22, 0.01],
  front: [-18, 6, 0],
  side: [0, 6, 18],
}

function CameraRig({ preset }: { preset: CameraPreset }) {
  const { camera } = useThree()

  useEffect(() => {
    const [x, y, z] = cameraPositions[preset]
    camera.position.set(x, y, z)
    camera.lookAt(0, 3, 0)

    const orthographicCamera = camera as OrthographicCamera
    orthographicCamera.zoom = preset === 'top' ? 42 : 38
    orthographicCamera.updateProjectionMatrix()
  }, [camera, preset])

  return null
}

export function BlueprintViewer({
  blueprint,
  layer,
  showPrevious,
  cameraPreset,
}: BlueprintViewerProps) {
  const visibleBlocks = useMemo(
    () =>
      blueprint.blocks.filter(
        (block) => block.y === layer || (showPrevious && block.y < layer),
      ),
    [blueprint, layer, showPrevious],
  )

  const centerX = (blueprint.size.width - 1) / 2
  const centerZ = (blueprint.size.depth - 1) / 2

  return (
    <Canvas
      orthographic
      shadows
      dpr={[1, 2]}
      camera={{ position: cameraPositions.iso, zoom: 38, near: 0.1, far: 200 }}
    >
      <color attach="background" args={['#11151a']} />
      <ambientLight intensity={1.7} />
      <directionalLight
        position={[10, 16, 8]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-8, 7, -10]} intensity={0.55} />

      <CameraRig preset={cameraPreset} />

      {visibleBlocks.map((block, index) => (
        <BlockMesh
          key={block.block + '-' + block.x + '-' + block.y + '-' + block.z + '-' + index}
          block={block}
          ghost={block.y < layer}
          position={[
            block.x - centerX,
            block.y + 0.5,
            block.z - centerZ,
          ]}
        />
      ))}

      <gridHelper args={[26, 26, '#727b83', '#2e363d']} position={[0, -0.02, 0]} />
      <OrbitControls
        makeDefault
        target={[0, 3, 0]}
        enableDamping
        dampingFactor={0.08}
        minZoom={16}
        maxZoom={90}
      />
    </Canvas>
  )
}
