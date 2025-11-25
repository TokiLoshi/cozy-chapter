import { Howl, Howler } from 'howler'
import { useEffect, useRef } from 'react'

let deckSound = null
let fireSound = null
let guitarSound = null

export function handleDecksClick() {
  console.log('Decks clicked in function')

  if (deckSound) {
    deckSound.stop()
    deckSound.unload()
    deckSound = null
    return
  }
  const tracks = [
    '/sound/bandcamp-alpha-samples-ultimate-breakbeat-loops-246889.mp3',
    '/sound/2-euro-sample-packs-bandcamp-249333.mp3',
  ]

  const trackToPlay = tracks[Math.floor(Math.random() * tracks.length)]
  console.log('Track to play: ', trackToPlay)
  deckSound = new Howl({
    src: [trackToPlay],
    loop: false,
    volume: 0.3,
  })
  deckSound.play()
}

export function handleGuitarClick() {
  console.log('Guitar clicked')

  if (guitarSound) {
    guitarSound.stop()
    guitarSound.unload()
    guitarSound = null
    return
  }
  const tracks = [
    '/sound/e_flat_minor9.mp3',
    '/sound/guitar-in-d.mp3',
    '/sound/guitar-pluck-104882.mp3',
    '/sound/guitar-strum-g.mp3',
    '/sound/guitar-strumming.mp3',
  ]
  const trackToPlay = tracks[Math.floor(Math.random() * tracks.length)]
  console.log('TRack to play: ', trackToPlay)
  guitarSound = new Howl({
    src: [trackToPlay],
    loop: false,
    volume: 0.3,
  })
  guitarSound.play()
}

export function handleFirePlaceClick() {
  console.log('Fireplace clicked')
  const tracks = ['fireplace.mp3']
  if (fireSound) {
    fireSound.stop()
    fireSound.unload()
    fireSound = null
    return
  }
  fireSound = new Howl({
    src: '/sound/fireplace.mp3',
    loop: false,
    volume: 0.3,
  })
  fireSound.play()
}
