import { Canvas, useFrame } from '@react-three/fiber'
import { Loader, OrbitControls, useHelper } from '@react-three/drei'
import { Suspense, useEffect, useRef } from 'react'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import Isometricroom from './Isometricroom'
import { useControls } from 'leva'
import { ACESFilmicToneMapping, DirectionalLightHelper } from 'three'
import * as THREE from 'three'
import { Leva } from 'leva'

function DirectionalLightWithHelper({ position, intensity }) {
  const lightRef = useRef()
  useHelper(lightRef, DirectionalLightHelper, 1, 'red')
  return <directionalLight ref={lightRef} intensity={intensity} castShadow />
}

export default function Experience({
  onBookcaseClick,
  onCreditsClick,
  onDecksClick,
  onFireClick,
  onGuitarClick,
  onLampClick,
  isLampOn,
  onPlantClick,
  onOrchidClick,
  onHeadPhonesClick,
  handleLaptopClick,
}) {
  const {
    ambientIntensity,
    directionalIntensity,
    directionalX,
    directionalY,
    directionalZ,
  } = useControls(
    'Lighting',
    {
      ambientIntensity: { value: 0.5, min: 0, max: 2, step: 0.1 },
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
          gl={{
            toneMapping: ACESFilmicToneMapping,
          }}
          flat
          camera={{ position: [5, 3, 3], fov: 75 }}
          shadows
        >
          <color attach="background" args={[bgColor]} />
          <ambientLight intensity={ambientIntensity} />
          {/* <DirectionalLightWithHelper
            position={[directionalX, directionalY, directionalZ]}
            intensity={directionalIntensity}
          /> */}
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[0, 3, 0]} intensity={0.5} color="#ffeedd" />
          <pointLight position={[-3.1, 2, 0]} intensity={0.8} color="#ff6d3d" />
          <pointLight position={[-1, 1, -1]} intensity={0.8} color="#ff6d3d" />
          <OrbitControls
            minPolarAngle={-Math.PI * 0.5}
            maxPolarAngle={Math.PI / 2.2}
            maxDistance={15}
            minDistance={3}
          />
          <Suspense fallback={null}>
            <Isometricroom
              onBookcaseClick={onBookcaseClick}
              onCreditsClick={onCreditsClick}
              onDecksClick={onDecksClick}
              onFireClick={onFireClick}
              onGuitarClick={onGuitarClick}
              onLampClick={onLampClick}
              isLampOn={isLampOn}
              receiveShadow
              scale={2}
              onPlantClick={onPlantClick}
              onOrchidClick={onOrchidClick}
              onHeadPhonesClick={onHeadPhonesClick}
              handleLaptopClick={handleLaptopClick}
            />
          </Suspense>
          {/* <EffectComposer> */}
          {/* <Bloom intensity={1} luminanceThreshold={1.5} /> */}
          {/* </EffectComposer> */}
        </Canvas>
        <Leva hidden />
        <Loader
          containerStyles={{
            background:
              'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            backdropFilter: 'blur(10px)',
          }}
          innerStyles={{
            background: 'rgba(148, 163, 184, 0.1)',
            width: '300px',
            height: '6px',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
          barStyles={{
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
            height: '6px',
            borderRadius: '3px',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
          }}
          dataStyles={{
            color: '#e2e8f0',
            fontFamily: '"Inter", "SF Pro Display", -apple-system, sans-serif',
            fontSize: '16px',
            fontWeight: '500',
            letterSpacing: '0.5px',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
          dataInterpolation={(p) =>
            `${p < 100 ? '📚 Loading Reading Room...' : '✨ Ready!'}\n${p.toFixed(0)}%`
          }
        />
      </div>
    </>
  )
}
