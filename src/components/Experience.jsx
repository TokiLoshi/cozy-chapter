import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import Isometricroom from '../components/Isometricroom'
import { useControls } from 'leva'
import { Sky } from '@react-three/drei'

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
      directionalX: { value: 5, min: -20, max: 20, step: 1 },
      directionalY: { value: 10, min: 0, max: 30, step: 1 },
      directionalZ: { value: 5, min: -20, max: 20, step: 1 },
    },
    { collapsed: true },
  )
  const { bgColor } = useControls(
    'SceneControls',
    {
      bgColor: '#1a233e',
    },
    { collapsed: true },
  )

  return (
    <>
      <div className="w-full h-screen">
        <Canvas
          toneMapping="ACESFILMIC"
          camera={{ position: [5, 4, 3], fov: 75 }}
          shadows
        >
          <color attach="background" args={[bgColor]} />
          <ambientLight intensity={ambientIntensity} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[0, 3, 0]} intensity={0.5} color="#ffeedd" />
          <pointLight position={[-2, 1, 1]} intensity={0.8} color="ff6d3d" />
          <OrbitControls />
          <Isometricroom
            onBookcaseClick={onBookcaseClick}
            receiveShadow
            scale={2}
          />
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
