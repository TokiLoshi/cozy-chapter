import { useGLTF } from '@react-three/drei'
import { Bookcase } from '../components/modelcomponents/boookcase'
import { useRef } from 'react'

function Floor({ onBookcaseClick }) {
  const bookcaseRef = useRef({ onBookcaseClick })

  return (
    <>
      <Bookcase
        ref={bookcaseRef}
        rotation={[0, 0.5, 0]}
        position={[0, 0, 0]}
        onClick={onBookcaseClick}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
    </>
  )
}

function Bookshelf() {
  const model = useGLTF()
}

export default function IsometricRoom({ onBookcaseClick }) {
  return (
    <>
      <Floor onBookcaseClick={onBookcaseClick} />
    </>
  )
}
