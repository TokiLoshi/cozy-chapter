import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import Isometricroom from '../components/Isometricroom'

export default function Experience() {
  return (
    <>
      <div className="w-full h-screen">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: '#000' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <OrbitControls />
          <Isometricroom />
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
