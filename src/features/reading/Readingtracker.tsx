import { useEffect, useMemo, useState } from 'react'

const MOCK_BOOKS = [
  {
    id: '1',
    title: 'Dune',
    authors: ['Frank Herbert'],
    pageCount: 412,
    coverImage: null,
  },
  {
    id: '2',
    title: 'Project Hail Mary',
    authors: ['Andy Weir'],
    pageCount: 496,
    coverImageUrl: null,
  },
  {
    id: '3',
    title: 'The pragmatic programmer',
    authors: ['David T'],
  },
]
