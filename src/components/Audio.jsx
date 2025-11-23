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
  const trackNames = [
    'cozy',
    'lofi',
    'abstract',
    'atmospheric',
    'cascade',
    'embrace',
    'slow',
  ]
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
  console.log('Should be: ', trackNames[currentTrackIndex])
  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-white text-lg font-semibold">music player</h3>
        {currentTrackIndex >= 1 && (
          <button
            onClick={handleBack}
            aria-label="Previous Track"
            className="text-white/80 hover:text-white transition-all hover:scale-100 active:scale-95"
          >
            <CircleArrowLeft className="text-white" />
          </button>
        )}
        <button
          onClick={handleClick}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          className="text-white/80 hover:text-white transition-all hover:scale-100 active:scale-95"
        >
          {isPlaying ? (
            <CirclePause className="text-white" />
          ) : (
            <CirclePlay className="text-white" />
          )}
        </button>
        <button
          onClick={handleNext}
          aria-label="Next Track"
          className="text-white/80 hover:text-white transition-all hover:scale-100 active:scale-95"
        >
          <CircleArrowRight className="text-white" />
        </button>

        <div className="text-center">
          <p className="text-white/80 text-sm font-medium">
            {isPlaying ? 'Now playing:' : ''}
          </p>
          <p className="text-white/80 text-sm font-medium">
            {isPlaying ? trackNames[currentTrackIndex] : ''}
          </p>
        </div>
      </div>
    </>
  )
}
