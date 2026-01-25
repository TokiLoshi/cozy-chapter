import { Sparkles, useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { useRef } from 'react'
import CozyRoom from '../modelcomponents/wholeroom'
import Husky from '../modelcomponents/husky'
import Laptop from '../modelcomponents/laptop'

export default function IsometricRoom({
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
}) {
  const bookcaseRef = useRef({ onBookcaseClick })

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

  const {
    laptopPosX,
    laptopPosY,
    laptopPosZ,
    laptopRotX,
    laptopRotY,
    laptopRotZ,
    laptopScale,
  } = useControls(
    'laptop',
    {
      laptopPosX: { value: 0.27, min: -20, max: 20, step: 0.01 },
      laptopPosY: { value: 0.5, min: -20, max: 20, step: 0.01 },
      laptopPosZ: { value: 2, min: -20, max: 20, step: 0.01 },
      laptopRotX: { value: 0, min: -20, max: 20, step: 0.01 },
      laptopRotY: { value: -1, min: -20, max: 20, step: 0.01 },
      laptopRotZ: { value: 0, min: -20, max: 20, step: 0.01 },
      laptopScale: { value: 0.27, min: -5, max: 10, step: 0.01 },
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
      <Laptop
        position={[laptopPosX, laptopPosY, laptopPosZ]}
        rotation={[laptopRotX, laptopRotY, laptopRotZ]}
        scale={laptopScale}
      />
      <Sparkles count={10} scale={10 * 2} size={6} speed={0.4} />
      <CozyRoom
        onBookcaseClick={onBookcaseClick}
        onCreditsClick={onCreditsClick}
        onDecksClick={onDecksClick}
        onFireClick={onFireClick}
        onGuitarClick={onGuitarClick}
        onLampClick={onLampClick}
        isLampOn={isLampOn}
        onPlantClick={onPlantClick}
        onOrchidClick={onOrchidClick}
        onHeadPhonesClick={onHeadPhonesClick}
      />
    </>
  )
}
