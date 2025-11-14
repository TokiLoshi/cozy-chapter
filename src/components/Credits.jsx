import { useState } from 'react'
import { XIcon } from 'lucide-react'
import { ScrollArea } from '../components/ui/scroll-area'

const credits = [
  {
    name: 'Bookcase with Books',
    by: 'Quaternius via polypizza',
    link: 'https://poly.pizza/m/tACDGJ4CGW',
  },
  {
    name: 'Wall Corner',
    by: 'Kenney via polypizza',
    link: 'https://poly.pizza/m/Rad76BJn2L',
  },
  {
    name: 'Wall',
    by: 'Kenney via polyypizza',
    link: 'https://poly.pizza/m/N8d0nkQGOn',
  },
  {
    name: 'Book',
    by: 'Quaternius via polypizza',
    link: 'https://poly.pizza/m/LC0w7VI75u',
  },
  {
    name: 'L Couch',
    by: 'Quaternius via polypizza',
    link: 'https://poly.pizza/m/1kwsjhpY84',
  },
  {
    name: 'Planks',
    by: 'Kay Lousberg via polypizza',
    link: 'https://poly.pizza/m/5m4LLpNl2M',
  },
  {
    name: 'Open Book',
    by: 'Quaternius via polypizza',
    link: 'https://poly.pizza/m/JEDMpG0UIR',
  },
  {
    name: 'DJ gear',
    by: 'Poly by Google via polypizza',
    link: 'https://poly.pizza/m/5Zq4tgSECXz',
  },
  {
    name: 'Headphones',
    by: 'Michael Fuchs via polypizza',
    link: 'https://poly.pizza/m/fPJoG2u0gnN',
  },
  {
    name: 'Husky',
    by: 'Quaternius via polypizza',
    link: 'https://poly.pizza/m/wcWiuEqwzq',
  },
  {
    name: 'Windows',
    by: 'Francis Chen via polypizza',
    link: 'https://poly.pizza/m/c93mqlf3yl1',
  },
  {
    name: 'Light Stand',
    by: 'Quaternius via polypizza',
    link: 'https://poly.pizza/m/9L6lLUl9sD',
  },
  {
    name: 'Fireplace',
    by: 'Poly by Google via polypizza',
    link: 'https://poly.pizza/m/fueH4_5W9Ug',
  },
  {
    name: 'Painting',
    by: 'CreativeTrio via polypizza',
    link: 'https://poly.pizza/m/Pi6oReAizt',
  },
  {
    name: 'Accoustic Guitar',
    by: 'Dave Edwards via polypizza',
    link: 'https://poly.pizza/m/bf6_h_1wp2D',
  },
  {
    name: 'Orchid',
    by: 'Poly by Google via polypizza',
    link: 'https://poly.pizza/m/0gEtIcRV4do',
  },
  {
    name: 'Houseplant',
    by: 'Quaternius via polypizza',
    link: 'https://poly.pizza/m/bfLOqIV5uP',
  },
  {
    name: 'Table',
    by: 'Kenney via polypizza',
    link: 'https://poly.pizza/m/41R2HTYj1O',
  },
]

export default function CreditsModal({ isOpen, onClose }) {
  if (!isOpen) return
  return (
    <>
      <div className="absolute top-6 right-6 z-10 bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white mb-1">Asset Credits</h2>
          <button
            onClick={onClose}
            className="text-gray-400 ms-2 hover:text-white transition-colors"
          >
            <XIcon className="text-white" />
          </button>
        </div>
        <ScrollArea className="h-[500px] p-2 ">
          <div className="space-y-4">
            {credits.map((credit, index) => (
              <div key={index}>
                <p className="text-white font-medium">{credit.name}</p>
                <p className="text-gray-400">
                  <a
                    href={credit.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blueee-400 hover:text-blue-300 text-xs break-all"
                  >
                    by {credit.by}{' '}
                  </a>
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
