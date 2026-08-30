import { Howl, Howler } from 'howler'
import { useEffect, useRef, useState } from 'react'
import {
  CircleArrowLeft,
  CircleArrowRight,
  CirclePause,
  CirclePlay,
  Volume2,
} from 'lucide-react'

export default function AudioComponent() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [volume, setVolume] = useState(0.3)
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
      volume,
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

  useEffect(() => {
    if (!soundRef.current) return
    soundRef.current.volume(volume)
  }, [volume, currentTrackIndex])

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
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
  }

  return (
    <>
      <p className="text-white text-xs font-slate-500 mb-2 text-center">
        Cozy music
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleBack}
          aria-label="Previous Track"
          className="text-white/80 hover:text-white transition-all hover:scale-100 hover:cursor-pointer active:scale-95"
        >
          <CircleArrowLeft className="text-white " />
        </button>

        <button
          onClick={handleClick}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          className="text-white/80 hover:text-white transition-all hover:scale-100 hover:cursor-pointer active:scale-95"
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
          className="text-white/80 hover:text-white transition-all hover:scale-100 hover:cursor-pointer active:scale-95"
        >
          <CircleArrowRight className="text-white" />
        </button>
      </div>
      <div className="text-center"></div>
      {isPlaying && (
        <>
          <div className="flex items-center gap-2 w-full px-2">
            <span className="text-white/50 text-xs">
              <Volume2 />
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Volume"
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
          <div className="items-center text-center">
            <p className="text-white/80 text-xs">
              <span className="font-semibold">
                {isPlaying ? 'Now playing:' : ''}
              </span>{' '}
              {isPlaying ? trackNames[currentTrackIndex] : ''}
            </p>
          </div>
        </>
      )}
    </>
  )
}
