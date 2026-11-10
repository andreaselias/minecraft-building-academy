import { OrbitControls } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import type { OrthographicCamera } from 'three'
import type { Blueprint, BlueprintBlock } from '../domain/blueprint'
import { BlockMesh } from './BlockMesh'

export type CameraPreset = 'iso' | 'top' | 'front' | 'side'

interface BlueprintViewerProps {
  blueprint: Blueprint
  visibleStepIds: string[]
  currentStepId: string
  cameraPreset: CameraPreset
  selectedBlock: BlueprintBlock | null
  onSelectBlock: (block: BlueprintBlock | null) => void
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
  visibleStepIds,
  currentStepId,
  cameraPreset,
  selectedBlock,
  onSelectBlock,
}: BlueprintViewerProps) {
  const visibleStepSet = useMemo(() => new Set(visibleStepIds), [visibleStepIds])

  const visibleBlocks = useMemo(
    () => blueprint.blocks.filter((block) => visibleStepSet.has(block.stepId)),
    [blueprint, visibleStepSet],
  )

  const { centerX, centerZ } = useMemo(() => {
    const xs = blueprint.blocks.map((block) => block.x)
    const zs = blueprint.blocks.map((block) => block.z)

    return {
      centerX: (Math.min(...xs) + Math.max(...xs)) / 2,
      centerZ: (Math.min(...zs) + Math.max(...zs)) / 2,
    }
  }, [blueprint.blocks])

  return (
    <Canvas
      orthographic
      shadows
      dpr={[1, 2]}
      camera={{ position: cameraPositions.iso, zoom: 38, near: 0.1, far: 200 }}
      onPointerMissed={() => onSelectBlock(null)}
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

      {visibleBlocks.map((block, index) => {
        const current = block.stepId === currentStepId

        return (
          <BlockMesh
            key={block.block + '-' + block.x + '-' + block.y + '-' + block.z + '-' + index}
            block={block}
            ghost={!current}
            selected={selectedBlock === block}
            onSelect={current ? onSelectBlock : undefined}
            position={[
              block.x - centerX,
              block.y + 0.5,
              block.z - centerZ,
            ]}
          />
        )
      })}

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
