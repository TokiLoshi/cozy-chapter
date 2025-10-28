import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import Isometricroom from '../components/Isometricroom'
import { useControls } from 'leva'

export default function Experience({ onBookcaseClick }) {
  const {
    ambientIntensity,
    directionalIntensity,
    directionalX,
    directionalY,
    directionalZ,
  } = useControls(
    'Lighting',
    {
      ambientIntensity: { value: 0.8, min: 0, max: 2, step: 0.1 },
      directionalIntensity: { value: 1.5, min: 0, max: 3, step: 0.1 },
      directionalX: { value: 10, min: -20, max: 20, step: 1 },
      directionalY: { value: 15, min: 0, max: 30, step: 1 },
      directionalZ: { value: 5, min: -20, max: 20, step: 1 },
    },
    { collapsed: true },
  )

  const { bgColor } = useControls(
    'Scene',
    {
      bgColor: '2c1810',
    },
    { collapsed: true },
  )

  return (
    <>
      <div className="w-full h-screen">
        <Canvas
          toneMapping="ACESFILMIC"
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ bgColor }}
        >
          <ambientLight intensity={ambientIntensity} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <OrbitControls />
          <Isometricroom onBookcaseClick={onBookcaseClick} />
        </Canvas>
      </div>
    </>
  )
}

// function RotatingCube() {
//   const meshRef = useRef()

//   useFrame((state, delta) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.x += delta
//       meshRef.current.rotation.y += delta * 0.5
//     }
//   })

//   return (
//     <mesh ref={meshRef}>
//       <boxGeometry args={[2, 2, 2]} />
//       <meshStandardMaterial color="hotpink" />
//     </mesh>
//   )
// }
