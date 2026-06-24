'use client'

import { useState } from 'react'
import type { Tag } from '@line-crm/shared'
import { api } from '@/lib/api'

interface Props {
  tags: Tag[]
  onCreated: (tag: Tag) => void
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-gray-900">タグ管理</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.length === 0 ? (
              <span className="text-xs text-gray-500">タグはまだありません。</span>
            ) : (
              tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center max-w-full px-2 py-1 rounded text-xs font-medium"
                  style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                  title={tag.name}
                >
                  <span className="truncate">{tag.name}</span>
                </span>
              ))
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full lg:w-[360px]">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
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
