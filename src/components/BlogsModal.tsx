import { FileText, Link, Trash } from 'lucide-react'
import EditArticleModal from './EditArticleModal'
import type { Blog } from '@/lib/types/Blog'

export default function ArticleCard({
  item,

  onDelete,
}: {
  item: Blog

  onDelete: () => void
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
      <div className="w-16 h-16 bg-slate-600 rounded flex items-center justify-center flex-shrink-0">
        {item.url ? (
          <a href={item.url} target="_blank" rel="noopener noreferer">
            <Link className="w-6 h-6 text-amber-500/80 hover:text-amber-400 transition-colors cursor-pointer" />
          </a>
        ) : (
          <FileText className="w-6 h-6 text-slate-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-slate-100 ">{item.title}</h4>

        <p className="text-sm text-slate-200 ">
          {item.author ? `by: ${item.author}` : 'author unknown'}
        </p>
        <span>
          {item.description && (
            <p className="text-sm text-slate-400">
              Description: {item.description}
            </p>
          )}
          {item.estimatedReadingTime && (
            <p className="text-sm text-slate-400">
              Estimated Reading Time: {item.estimatedReadingTime}
            </p>
          )}
          {item.notes && (
            <p className="text-sm text-slate-400">Notes: {item.notes}</p>
          )}
        </span>
      </div>

      <div className="flex gap-2 items-center">
        <EditArticleModal blog={item} refreshPath="/readingroom" />

        <button
          onClick={onDelete}
          className="cursor-pointer px-3 py-3 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg transition-all duration-200"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
