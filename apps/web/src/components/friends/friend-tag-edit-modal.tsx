'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Tag } from '@line-crm/shared'
import { api, type FriendListItem, type TagWithFriendCount } from '@/lib/api'
import TagBadge from './tag-badge'

interface Props {
  friend: FriendListItem
  allTags: TagWithFriendCount[]
  onClose: () => void
  onChanged: (tags?: TagWithFriendCount[]) => void
}

const DEFAULT_TAG_COLOR = '#06C755'

function normalizeName(name: string): string {
  return name.trim().toLowerCase()
}

function asAssignableTag(tag: Tag, allTags: TagWithFriendCount[]): TagWithFriendCount {
  return allTags.find((item) => item.id === tag.id) ?? {
    ...tag,
    folderId: null,
    folderName: null,
    friendCount: 0,
  }
}

export default function FriendTagEditModal({ friend, allTags, onClose, onChanged }: Props) {
  const [localTags, setLocalTags] = useState<TagWithFriendCount[]>(allTags)
  const [assignedTags, setAssignedTags] = useState<TagWithFriendCount[]>(
    () => friend.tags.map((tag) => asAssignableTag(tag, allTags)),
  )
  const [search, setSearch] = useState('')
  const [newTagName, setNewTagName] = useState('')
  const [loadingTagId, setLoadingTagId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLocalTags(allTags)
  }, [allTags])

  useEffect(() => {
    setAssignedTags(friend.tags.map((tag) => asAssignableTag(tag, allTags)))
  }, [friend.id])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const assignedIds = useMemo(
    () => new Set(assignedTags.map((tag) => tag.id)),
    [assignedTags],
  )
  const filteredTags = useMemo(() => {
    const query = normalizeName(search)
    return localTags.filter((tag) => normalizeName(tag.name).includes(query))
  }, [localTags, search])

  const refreshParent = (nextTags = localTags) => {
    onChanged([...nextTags].sort((a, b) => a.name.localeCompare(b.name, 'ja')))
  }

  const handleAddExisting = async (tag: TagWithFriendCount) => {
    if (assignedIds.has(tag.id)) return
    setLoadingTagId(tag.id)
    setError('')
    try {
      await api.friends.addTag(friend.id, tag.id)
      setAssignedTags((current) => [...current, tag].sort((a, b) => a.name.localeCompare(b.name, 'ja')))
      const nextTags = localTags.map((item) =>
        item.id === tag.id ? { ...item, friendCount: item.friendCount + 1 } : item,
      )
      setLocalTags(nextTags)
      refreshParent(nextTags)
    } catch {
      setError('タグの付与に失敗しました。時間をおいてもう一度お試しください。')
    } finally {
      setLoadingTagId(null)
    }
  }

  const handleRemove = async (tag: TagWithFriendCount) => {
    setLoadingTagId(tag.id)
    setError('')
    try {
      await api.friends.removeTag(friend.id, tag.id)
      setAssignedTags((current) => current.filter((item) => item.id !== tag.id))
      const nextTags = localTags.map((item) =>
        item.id === tag.id ? { ...item, friendCount: Math.max(0, item.friendCount - 1) } : item,
      )
      setLocalTags(nextTags)
      refreshParent(nextTags)
    } catch {
      setError('タグの解除に失敗しました。時間をおいてもう一度お試しください。')
    } finally {
      setLoadingTagId(null)
    }
  }

  const handleCreateAndAssign = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = newTagName.trim()
    setError('')

    if (!trimmed) {
      setError('タグ名を入力してください。')
      return
    }
    if (localTags.some((tag) => normalizeName(tag.name) === normalizeName(trimmed))) {
      setError('同じ名前のタグがすでにあります。')
      return
    }

    setCreating(true)
    try {
      const createdRes = await api.tags.create({ name: trimmed, color: DEFAULT_TAG_COLOR })
      if (!createdRes.success) {
        setError(createdRes.error || 'タグの作成に失敗しました。')
        return
      }

      const created = { ...createdRes.data, friendCount: 1 }
      const nextTags = [...localTags, created].sort((a, b) => a.name.localeCompare(b.name, 'ja'))
      try {
        await api.friends.addTag(friend.id, created.id)
      } catch {
        setLocalTags(nextTags.map((tag) => tag.id === created.id ? { ...tag, friendCount: 0 } : tag))
        refreshParent(nextTags.map((tag) => tag.id === created.id ? { ...tag, friendCount: 0 } : tag))
        setError('タグは作成されましたが、友だちへの付与に失敗しました。')
        return
      }

      setLocalTags(nextTags)
      setAssignedTags((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name, 'ja')))
      setNewTagName('')
      setSearch('')
      refreshParent(nextTags)
    } catch {
      setError('タグの作成に失敗しました。時間をおいてもう一度お試しください。')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4 py-6">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-xl border border-gray-200">
        <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900">タグ編集</h2>
            <p className="mt-0.5 truncate text-xs text-gray-500">{friend.displayName || '名前なし'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        <div className="max-h-[calc(90vh-73px)] overflow-y-auto p-5 space-y-5">
          <section>
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="text-xs font-semibold text-gray-600">付与済みタグ</h3>
              <span className="text-xs text-gray-400">{assignedTags.length.toLocaleString('ja-JP')} 件</span>
            </div>
            <div className="min-h-[42px] rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
              {assignedTags.length === 0 ? (
                <p className="text-xs text-gray-500">付与済みタグはありません。</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {assignedTags.map((tag) => (
                    <TagBadge
                      key={tag.id}
                      tag={tag}
                      onRemove={() => handleRemove(tag)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
            <label className="block text-xs font-semibold text-gray-600 mb-2" htmlFor="friend-tag-search">
              既存タグを検索
            </label>
            <input
              id="friend-tag-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="タグ名で検索"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="mt-2 max-h-52 overflow-y-auto rounded-md border border-gray-200 divide-y divide-gray-100">
              {filteredTags.length === 0 ? (
                <p className="px-3 py-4 text-xs text-gray-500">一致するタグはありません。</p>
              ) : (
                filteredTags.map((tag) => {
                  const assigned = assignedIds.has(tag.id)
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleAddExisting(tag)}
                      disabled={assigned || loadingTagId === tag.id || creating}
                      className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:bg-green-50"
                    >
                      <span className="min-w-0 flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: tag.color }}
                          aria-hidden="true"
                        />
                        <span className="truncate text-sm text-gray-800">{tag.name}</span>
                      </span>
                      <span className="flex-shrink-0 text-xs text-gray-500">
                        {assigned ? '付与済み' : `${tag.friendCount.toLocaleString('ja-JP')}人`}
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          </section>

          <form onSubmit={handleCreateAndAssign} className="rounded-md border border-gray-200 bg-gray-50 p-3">
            <label className="block text-xs font-semibold text-gray-600 mb-2" htmlFor="friend-tag-create-in-modal">
              新規タグを作成して付与
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="friend-tag-create-in-modal"
                type="text"
                value={newTagName}
                onChange={(event) => {
                  setNewTagName(event.target.value)
                  if (error) setError('')
                }}
                placeholder="新しいタグ名"
                maxLength={40}
                className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                disabled={creating || Boolean(loadingTagId)}
                className="px-4 py-2 rounded-md text-sm font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: DEFAULT_TAG_COLOR }}
              >
                {creating ? '作成中' : '作成して付与'}
              </button>
            </div>
          </form>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
