import { useGLTF } from '@react-three/drei'
import { Bookcase } from '../components/modelcomponents/boookcase'
import { useControls } from 'leva'
import { useRef } from 'react'
import { Fireplace } from '../components/modelcomponents/fireplace'
import { Planks } from '../components/modelcomponents/planks'
import { Wall } from '../components/modelcomponents/wall'
import { WallCorner } from '../components/modelcomponents/wallcorner'
import { Window } from '../components/modelcomponents/window'
import CozyRoom from '../components/modelcomponents/wholeroom'

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

// TODO:
// Instance all this stuff
function Walls() {
  const {
    wall1PosX,
    wall1PosY,
    wall1PosZ,
    wall1RotX,
    wall1RotY,
    wall1RotZ,
    wall1scale,
  } = useControls(
    'wall1',
    {
      wall1PosX: { value: 0, min: -20, max: 20, step: 0.01 },
      wall1PosY: { value: 0, min: -20, max: 20, step: 0.01 },
      wall1PosZ: { value: 0, min: -20, max: 20, step: 0.01 },
      wall1RotX: { value: 0, min: -20, max: 20, step: 0.01 },
      wall1RotX: { value: 0, min: -20, max: 20, step: 0.01 },
      wall1RotX: { value: 0, min: -20, max: 20, step: 0.01 },
      wall1scale: { value: 1, min: -5, max: 20, step: 0.01 },
    },
    { collapsed: true },
  )
  const {
    wall2PosX,
    wall2PosY,
    wall2PosZ,
    wall2RotX,
    wall2RotY,
    wall2RotZ,
    wall2scale,
  } = useControls(
    'wall2',
    {
      wall2PosX: { value: 0, min: -20, max: 20, step: 0.01 },
      wall2PosY: { value: 0, min: -20, max: 20, step: 0.01 },
      wall2PosZ: { value: 0, min: -20, max: 20, step: 0.01 },
      wall2RotX: { value: 0, min: -20, max: 20, step: 0.01 },
      wall2RotX: { value: 0, min: -20, max: 20, step: 0.01 },
      wall2RotX: { value: 0, min: -20, max: 20, step: 0.01 },
      wall2scale: { value: 1, min: -5, max: 20, step: 0.01 },
    },
    { collapsed: true },
  )

  const {
    cornerPosX,
    cornerPosY,
    cornerPosZ,
    cornerRotX,
    cornerRotY,
    cornerRotZ,
    cornerScale,
  } = useControls(
    'cornerWall',
    {
      cornerPosX: { value: 0, min: -20, max: 20, step: 0.01 },
      cornerPosY: { value: 0, min: -20, max: 20, step: 0.01 },
      cornerPosZ: { value: 0, min: -20, max: 20, step: 0.01 },
      cornerRotX: { value: 0, min: -20, max: 20, step: 0.01 },
      cornerRotY: { value: 0, min: -20, max: 20, step: 0.01 },
      cornerRotZ: { value: 0, min: -20, max: 20, step: 0.01 },
      cornerScale: { value: 1, min: -20, max: 20, step: 0.01 },
    },
    { collapsed: true },
  )
  return (
    <>
      <Wall position={[2, 0, 1]} />
      <Window position={[1, 2, 1]} />
      <WallCorner
        position={[cornerPosX, cornerPosY, cornerPosZ]}
        rotation={[cornerRotX, cornerRotY, cornerRotZ]}
        scale={cornerScale}
      />
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
  return (
    <>
      {' '}
      {/* <Bookcase
        ref={bookcaseRef}
        rotation={[0, 0.5, 0]}
        position={[0, 0, 0]}
        onClick={onBookcaseClick}
      />
      <Fireplace
        position={[firePosX, firePosY, firePosZ]}
        rotation={[fireRotX, fireRotY, fireRotZ]}
        scale={0.5}
      />
      <Floor onBookcaseClick={onBookcaseClick} />
      <Walls /> */}
      <CozyRoom />
    </>
  )
}
