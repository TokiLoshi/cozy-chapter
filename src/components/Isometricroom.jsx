import { Sparkles, useGLTF } from '@react-three/drei'
import { Bookcase } from '../components/modelcomponents/boookcase'
import { useControls } from 'leva'
import { useRef } from 'react'
import { Fireplace } from '../components/modelcomponents/fireplace'
import { Planks } from '../components/modelcomponents/planks'
import { Wall } from '../components/modelcomponents/wall'
import { WallCorner } from '../components/modelcomponents/wallcorner'
import { Window } from '../components/modelcomponents/window'
import CozyRoom from '../components/modelcomponents/wholeroom'
import Husky from '../components/modelcomponents/husky'

function Floor({ onBookcaseClick }) {
  return (
    <>
      <Planks position={[0.1, 0.1, 1]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
    </>
  )
}

export default function IsometricRoom({ onBookcaseClick }) {
  const bookcaseRef = useRef({ onBookcaseClick })
  const { firePosX, firePosY, firePosZ, fireRotX, fireRotY, fireRotZ } =
    useControls(
      'Fireplace',
      {
        firePosX: { value: 0, min: -20, max: 20, step: 0.01 },
        firePosY: { value: 0, min: -20, max: 20, step: 0.01 },
        firePosZ: { value: -4.2, min: -20, max: 20, step: 0.01 },
        fireRotX: { value: 0, min: -20, max: 20, step: 0.01 },
        fireRotY: { value: 0, min: -20, max: 20, step: 0.01 },
        fireRotZ: { value: 0, min: -20, max: 20, step: 0.01 },
      },
      { collapsed: true },
    )
  const {
    huskyPosX,
    huskyPosY,
    huskyPosZ,
    huskyRotX,
    huskyRotY,
    huskyRotZ,
    huskyScale,
  } = useControls(
    'husky',
    {
      huskyPosX: { value: -0.6, min: -20, max: 20, step: 0.01 },
      huskyPosY: { value: 0.5, min: -20, max: 20, step: 0.01 },
      huskyPosZ: { value: 1.5, min: -20, max: 20, step: 0.01 },
      huskyRotX: { value: 0, min: -20, max: 20, step: 0.01 },
      huskyRotY: { value: 3, min: -20, max: 20, step: 0.01 },
      huskyRotZ: { value: 0, min: -20, max: 20, step: 0.01 },
      huskyScale: { value: 0.3, min: -5, max: 10, step: 0.01 },
    },
    { collapsed: true },
  )
  return (
    <>
      <Husky
        position={[huskyPosX, huskyPosY, huskyPosZ]}
        rotation={[huskyRotX, huskyRotY, huskyRotZ]}
        scale={huskyScale}
      />
      <Sparkles count={10} scale={10 * 2} size={6} speed={0.4} />
      <CozyRoom onBookcaseClick={onBookcaseClick} />
    </>
  )
}
