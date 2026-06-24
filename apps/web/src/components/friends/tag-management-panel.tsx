'use client'

import { useState } from 'react'
import { api, type TagWithFriendCount } from '@/lib/api'

interface Props {
  tags: TagWithFriendCount[]
  onCreated: (tag: TagWithFriendCount) => void
}

const DEFAULT_TAG_COLOR = '#06C755'

export default function TagManagementPanel({ tags, onCreated }: Props) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    setError('')

    if (!trimmed) {
      setError('タグ名を入力してください。')
      return
    }

    const duplicated = tags.some((tag) => tag.name.trim().toLowerCase() === trimmed.toLowerCase())
    if (duplicated) {
      setError('同じ名前のタグがすでにあります。')
      return
    }

    setSubmitting(true)
    try {
      const res = await api.tags.create({ name: trimmed, color: DEFAULT_TAG_COLOR })
      if (!res.success) {
        setError(res.error || 'タグの作成に失敗しました。')
        return
      }
      onCreated(res.data)
      setName('')
    } catch {
      setError('タグの作成に失敗しました。時間をおいてもう一度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-gray-900">タグ管理</h2>
            <span className="text-xs text-gray-500">{tags.length.toLocaleString('ja-JP')} 件</span>
          </div>
          <div className="mt-3 overflow-hidden rounded-md border border-gray-100">
            {tags.length === 0 ? (
              <div className="px-3 py-4 text-xs text-gray-500">タグはまだありません。</div>
            ) : (
              <div className="max-h-40 overflow-y-auto divide-y divide-gray-100">
                {tags.map((tag) => (
                  <div key={tag.id} className="grid grid-cols-[1fr_72px] items-center gap-3 px-3 py-2">
                    <div className="min-w-0 flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag.color }}
                        aria-hidden="true"
                      />
                      <span className="truncate text-xs font-medium text-gray-800" title={tag.name}>
                        {tag.name}
                      </span>
                    </div>
                    <span className="text-right text-xs text-gray-500">
                      {tag.friendCount.toLocaleString('ja-JP')}人
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full xl:w-[360px]">
          <label className="block text-xs font-medium text-gray-600 mb-1" htmlFor="friend-tag-create">
            新規タグ作成
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="friend-tag-create"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError('')
              }}
              placeholder="新しいタグ名"
              maxLength={40}
              className="min-w-0 flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
              style={{ backgroundColor: DEFAULT_TAG_COLOR }}
            >
              {submitting ? '作成中' : '作成'}
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </form>
      </div>
    </section>
  )
}
