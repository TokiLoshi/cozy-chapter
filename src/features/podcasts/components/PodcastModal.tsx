import {
  Edit,
  ExternalLink,
  Loader2,
  Play,
  Plus,
  Search,
  Trash,
  XIcon,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect, useMemo, useState } from 'react'
import type { Podcast, UserPodcast } from '@/db/schemas/podcast-schema'
import {
  BaseModal,
  DetailItem,
  DisplayActions,
  DisplayDescription,
  DisplayStarRating,
} from '@/components/ExpandedCard'
import SearchArea from '@/components/SearchArea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  addPodcast,
  deleteUserPodcastServer,
  getUserPodcastsServer,
  searchSpotifyPodcasts,
  searchYouTubePodcasts,
  updateUserPodcastServer,
} from '@/lib/server/podcasts'

type PodcastModalProps = {
  isOpen: boolean
  onClose: () => void
}

type PodcastItem = {
  podcast: Podcast
  userPodcast: UserPodcast
}

type SearchSource = 'spotify' | 'youtube'
type SourceFilter = 'all' | 'spotify' | 'youtube'

function formatDuration(ms: number | null): string {
  if (!ms) return '--'
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const hours = Math.floor(totalSeconds / 3600)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function SourceBadge({ source }: { source: string }) {
  const isSpotify = source === 'spotify'
  return (
    <>
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${isSpotify ? 'bg-green-600/30 text-green-400' : 'bg-red-600/30 text-red-400'}`}
      >
        {isSpotify ? 'Spotify' : 'YouTube'}
      </span>
    </>
  )
}

function ExpandedPodcastCard({
  item,
  onEdit,
  onDelete,
  onClose,
}: {
  item: PodcastItem
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}) {
  return (
    <BaseModal onClose={onClose}>
      {/** Header */}
      <div className="flex gap-4 mb-4">
        {item.podcast.coverImageUrl && (
          <img
            src={item.podcast.coverImageUrl}
            alt={item.podcast.episodeTitle}
            className="w-16 h-16 object-cover rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-100 mb-1">
            {item.podcast.episodeTitle}
          </h3>
          {item.podcast.showName && (
            <p className="text-sm text-slate-400">{item.podcast.showName}</p>
          )}
          <div className="mt-1">
            <SourceBadge source={item.podcast.source} />
          </div>
        </div>
      </div>
      {/** Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/** Status */}
        <DetailItem label="Status">
          <p className="text-sm font-medium text-slate-200">
            {item.userPodcast.status}
          </p>
        </DetailItem>
        {/** Duration */}
        <DetailItem label="Duration">
          <p className="text-sm font-medium text-slate-200">
            {formatDuration(item.podcast.durationMs)}
          </p>
        </DetailItem>

        {/** Rating */}
        {item.userPodcast.rating && (
          <DetailItem label="Rating">
            <DisplayStarRating rating={item.userPodcast.rating} maxStars={5} />
          </DetailItem>
        )}

        {/** Started at */}
        {item.userPodcast.startedAt && (
          <DetailItem label="Started">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.userPodcast.startedAt).toLocaleDateString()}
            </p>
          </DetailItem>
        )}

        {/** Finished at */}
        {item.userPodcast.finishedAt && (
          <DetailItem label="Finished">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.userPodcast.finishedAt).toLocaleDateString()}
            </p>
          </DetailItem>
        )}

        {/** Published at */}
        {item.podcast.publishedAt && (
          <DetailItem label="Published">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.podcast.publishedAt).toLocaleDateString()}
            </p>
          </DetailItem>
        )}

        {/** Play Button */}
        {item.podcast.externalUrl && (
          <div className="mb-4">
            <a
              href={item.podcast.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${item.podcast.source === 'spotify' ? 'bg-green-600' : 'bg-red-500'}`}
            >
              <Play className="w-4 h-4" />
              Play on{' '}
              {item.podcast.source === 'spotify' ? 'Spotify' : 'YouTube'}
            </a>
          </div>
        )}

        {/** Actions */}
        <DisplayActions onEdit={onEdit} onDelete={onDelete} onClose={onClose} />

        {/** Description */}
        {item.podcast.description && (
          <DisplayDescription description={item.podcast.description} />
        )}
      </div>
    </BaseModal>
  )
}

function PodcastCard({
  item,
  onEdit,
  onDelete,
}: {
  item: PodcastItem
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <>
      <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
        {/** Image */}
        {item.podcast.coverImageUrl && (
          <img
            src={item.podcast.coverImageUrl}
            alt={item.podcast.episodeTitle}
            className="w-16 h-16 object-cover rounded"
          />
        )}
        {/** Title */}
        <div className="flex min-2-0">
          <h4 className="font-mdium text-slate-100 truncate">
            {item.podcast.episodeTitle}
          </h4>
          {/** Showname */}
          <p className="text-sm font-text-slate-400 truncate">
            {item.podcast.showName}
          </p>
          {/** Source Badge */}
          <div className="flex items-center gap-2 mt-1">
            <SourceBadge source={item.podcast.source} />
            {/** Duration */}
            <span className="text-xs text-slate-300">
              {formatDuration(item.podcast.durationMs)}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button
            className="cursor-pointer bg-amber-600/80 hover:bg-amber-500 text-white p-2 rounded-lg transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="cursor-pointer bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}

function EmptyTabContent({ message }: { message: string }) {
  return (
    <>
      <p className="text-slate-400 text-sm py-4 text-center">{message}</p>
    </>
  )
}
