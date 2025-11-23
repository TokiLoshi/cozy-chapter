import { Howl, Howler } from 'howler'
import { useEffect, useRef, useState } from 'react'
import {
  CircleArrowLeft,
  CircleArrowRight,
  CirclePause,
  CirclePlay,
} from 'lucide-react'

export default function AudioComponent() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const soundRef = useRef(null)

  const tracks = [
    '/sound/cozy.mp3',
    '/sound/lofi.mp3',
    '/sound/ambient-abstract-guitar-atmospheric-sci-fi-space-257044.mp3',
    '/sound/atmospheric-ambience-background_maven-11492.mp3',
    '/sound/cascade-breathe-future-garage-412839.mp3',
    '/sound/embrace-364091.mp3',
    '/sound/slow-edm-atmospheric-background-music-258550.mp3',
  ]
  const trackNames = {
    1: 'cozy',
    2: 'lofi',
    3: 'abstract',
    4: 'atmospheric',
    5: 'cascade',
    6: 'embrace',
    7: 'slow',
  }
  console.log('Playing: ', tracks[currentTrackIndex])

  useEffect(() => {
    // Clean up old track
    if (soundRef.current) {
      soundRef.current.stop()
      soundRef.current.unload()
    }
    // Load new instance
    soundRef.current = new Howl({
      src: [tracks[currentTrackIndex]],
      loop: true,
      volume: 0.3,
      onend: () => {
        handleNext()
      },
    })

    if (isPlaying) {
      soundRef.current.play()
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.stop()
        soundRef.current.unload()
      }
    }
  }, [currentTrackIndex])

  const handleClick = () => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.pause()
      } else {
        soundRef.current.play()
      }
    }
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
  }

  const handleBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1) % tracks.length)
  }
  return (
    <>
      <div>
        <button onClick={handleClick}>
          {isPlaying ? (
            <CirclePause className="text-white" />
          ) : (
            <CirclePlay className="text-white" />
          )}
        </button>
        <button onClick={handleNext}>
          <CircleArrowRight className="text-white" />
        </button>
        <button onClick={handleBack}>
          <CircleArrowLeft className="text-white" />
        </button>
        <p className="text-white text-sm">
          Now playing: {trackNames[currentTrackIndex]}
        </p>
      </div>
    </>
  )
}
