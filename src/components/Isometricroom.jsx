import { useGLTF } from '@react-three/drei'
import { Bookcase } from '../components/modelcomponents/boookcase'
import { useControls } from 'leva'
import { useRef } from 'react'
import { Fireplace } from '../components/modelcomponents/fireplace'
import { Planks } from '../components/modelcomponents/planks'
import { Wall } from '../components/modelcomponents/wall'
import { WallCorner } from '../components/modelcomponents/wallcorner'
import { Window } from '../components/modelcomponents/window'

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

function Walls() {
  return
  ;<>
    <Wall position={[2, 0, 1]} />
    <Window position={[1, 2, 1]} />
    <WallCorner position={[-1, 0, -1]} />
  </>
}

export default function IsometricRoom({ onBookcaseClick }) {
  const bookcaseRef = useRef({ onBookcaseClick })
  return (
    <>
      {' '}
      <Bookcase
        ref={bookcaseRef}
        rotation={[0, 0.5, 0]}
        position={[0, 0, 0]}
        onClick={onBookcaseClick}
      />
      <Fireplace position={[-2, 0, 1]} scale={0.5} />
      <Floor onBookcaseClick={onBookcaseClick} />
    </>
  )
}
