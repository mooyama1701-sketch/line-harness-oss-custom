'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Header from '@/components/layout/header'
import { api, type TagFolderWithTagCount, type TagWithFriendCount } from '@/lib/api'

const DEFAULT_TAG_COLOR = '#06C755'
const UNFILED_FOLDER_ID = '__unfiled'

type SelectedFolder = 'all' | typeof UNFILED_FOLDER_ID | string

function normalizeName(name: string): string {
  return name.trim().toLowerCase()
}

function folderLabel(folderId: string | null, folders: TagFolderWithTagCount[]): string {
  if (!folderId) return '未分類'
  return folders.find((folder) => folder.id === folderId)?.name ?? '未分類'
}

function CreateTagDialog({
  open,
  folders,
  defaultFolderId,
  existingTags,
  onClose,
  onCreated,
}: {
  open: boolean
  folders: TagFolderWithTagCount[]
  defaultFolderId: string | null
  existingTags: TagWithFriendCount[]
  onClose: () => void
  onCreated: () => void
}) {
  const [name, setName] = useState('')
  const [folderId, setFolderId] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setName('')
    setFolderId(defaultFolderId ?? '')
    setError('')
  }, [open, defaultFolderId])

  if (!open) return null

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = name.trim()
    setError('')

    if (!trimmed) {
      setError('タグ名を入力してください。')
      return
    }
    if (existingTags.some((tag) => normalizeName(tag.name) === normalizeName(trimmed))) {
      setError('同じ名前のタグがすでにあります。')
      return
    }

    setSaving(true)
    try {
      const res = await api.tags.create({
        name: trimmed,
        color: DEFAULT_TAG_COLOR,
        folderId: folderId || null,
      })
      if (!res.success) {
        setError(res.error || 'タグの作成に失敗しました。')
        return
      }
      onCreated()
      onClose()
    } catch {
      setError('タグの作成に失敗しました。時間をおいてもう一度お試しください。')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4 py-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-xl">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">新しいタグ</h2>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="new-tag-name">
              新しいタグ名
            </label>
            <input
              id="new-tag-name"
              autoFocus
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                if (error) setError('')
              }}
              maxLength={40}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="new-tag-folder">
              タグフォルダ
            </label>
            <select
              id="new-tag-folder"
              value={folderId}
              onChange={(event) => setFolderId(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">未分類</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>{folder.name}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={saving}
            className="min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: DEFAULT_TAG_COLOR }}
          >
            {saving ? '作成中' : '決定'}
          </button>
        </div>
      </form>
    </div>
  )
}

function CreateFolderDialog({
  open,
  existingFolders,
  onClose,
  onCreated,
}: {
  open: boolean
  existingFolders: TagFolderWithTagCount[]
  onClose: () => void
  onCreated: (folder: TagFolderWithTagCount) => void
}) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setName('')
    setError('')
  }, [open])

  if (!open) return null

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = name.trim()
    setError('')

    if (!trimmed) {
      setError('フォルダ名を入力してください。')
      return
    }
    if (existingFolders.some((folder) => normalizeName(folder.name) === normalizeName(trimmed))) {
      setError('同じ名前のフォルダがすでにあります。')
      return
    }

    setSaving(true)
    try {
      const res = await api.tagFolders.create({ name: trimmed })
      if (!res.success) {
        setError(res.error || 'フォルダの作成に失敗しました。')
        return
      }
      onCreated(res.data)
      onClose()
    } catch {
      setError('フォルダの作成に失敗しました。時間をおいてもう一度お試しください。')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4 py-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-xl">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">新しいフォルダ</h2>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="new-folder-name">
              フォルダ名
            </label>
            <input
              id="new-folder-name"
              autoFocus
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                if (error) setError('')
              }}
              maxLength={40}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={saving}
            className="min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: DEFAULT_TAG_COLOR }}
          >
            {saving ? '作成中' : '決定'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagWithFriendCount[]>([])
  const [folders, setFolders] = useState<TagFolderWithTagCount[]>([])
  const [selectedFolder, setSelectedFolder] = useState<SelectedFolder>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateTag, setShowCreateTag] = useState(false)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [movingTagId, setMovingTagId] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [tagsRes, foldersRes] = await Promise.all([
        api.tags.list(),
        api.tagFolders.list(),
      ])
      if (!tagsRes.success) throw new Error(tagsRes.error)
      if (!foldersRes.success) throw new Error(foldersRes.error)
      setTags(tagsRes.data)
      setFolders(foldersRes.data)
    } catch {
      setError('タグ情報の読み込みに失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const filteredTags = useMemo(() => {
    if (selectedFolder === 'all') return tags
    if (selectedFolder === UNFILED_FOLDER_ID) return tags.filter((tag) => !tag.folderId)
    return tags.filter((tag) => tag.folderId === selectedFolder)
  }, [selectedFolder, tags])

  const unfiledCount = tags.filter((tag) => !tag.folderId).length
  const defaultFolderId =
    selectedFolder !== 'all' && selectedFolder !== UNFILED_FOLDER_ID ? selectedFolder : null

  const handleFolderCreated = (folder: TagFolderWithTagCount) => {
    setFolders((current) => [...current, folder].sort((a, b) => a.name.localeCompare(b.name, 'ja')))
    setSelectedFolder(folder.id)
  }

  const handleMoveTag = async (tagId: string, nextFolderId: string) => {
    setMovingTagId(tagId)
    setError('')
    try {
      const res = await api.tags.update(tagId, { folderId: nextFolderId || null })
      if (!res.success) throw new Error(res.error)
      await reload()
    } catch {
      setError('タグの移動に失敗しました。時間をおいてもう一度お試しください。')
    } finally {
      setMovingTagId(null)
    }
  }

  const handleDeleteTag = async (tag: TagWithFriendCount) => {
    if (!confirm(`「${tag.name}」を削除します。友だちに付いているこのタグも外れます。続行しますか？`)) return
    try {
      await api.tags.delete(tag.id)
      await reload()
    } catch {
      setError('タグの削除に失敗しました。')
    }
  }

  const handleDeleteFolder = async (folder: TagFolderWithTagCount) => {
    if (!confirm(`フォルダ「${folder.name}」を削除します。中のタグは未分類に移動します。続行しますか？`)) return
    try {
      await api.tagFolders.delete(folder.id)
      setSelectedFolder('all')
      await reload()
    } catch {
      setError('フォルダの削除に失敗しました。')
    }
  }

  return (
    <div>
      <Header
        title="タグ管理"
        description="タグの新規作成とフォルダ分けを行います。"
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowCreateFolder(true)}
              className="min-h-[44px] rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
            >
              ＋ 新しいフォルダ
            </button>
            <button
              type="button"
              onClick={() => setShowCreateTag(true)}
              className="min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: DEFAULT_TAG_COLOR }}
            >
              ＋ 新しいタグ
            </button>
          </div>
        }
      />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid min-h-[520px] grid-cols-1 overflow-hidden rounded-lg border border-gray-200 bg-white lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-gray-200 bg-gray-50 lg:border-b-0 lg:border-r">
          <div className="border-b border-gray-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">タグフォルダ</h2>
          </div>
          <div className="p-2">
            <button
              type="button"
              onClick={() => setSelectedFolder('all')}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${
                selectedFolder === 'all' ? 'bg-green-100 text-green-800' : 'text-gray-700 hover:bg-white'
              }`}
            >
              <span className="font-medium">すべて</span>
              <span className="text-xs">{tags.length.toLocaleString('ja-JP')}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFolder(UNFILED_FOLDER_ID)}
              className={`mt-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${
                selectedFolder === UNFILED_FOLDER_ID ? 'bg-green-100 text-green-800' : 'text-gray-700 hover:bg-white'
              }`}
            >
              <span className="font-medium">未分類</span>
              <span className="text-xs">{unfiledCount.toLocaleString('ja-JP')}</span>
            </button>
            <div className="mt-2 space-y-1">
              {folders.map((folder) => (
                <div key={folder.id} className="group flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`flex min-w-0 flex-1 items-center justify-between rounded-md px-3 py-2 text-left text-sm ${
                      selectedFolder === folder.id ? 'bg-green-100 text-green-800' : 'text-gray-700 hover:bg-white'
                    }`}
                  >
                    <span className="truncate font-medium">{folder.name}</span>
                    <span className="ml-2 text-xs">{folder.tagCount.toLocaleString('ja-JP')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteFolder(folder)}
                    className="hidden min-h-[36px] w-9 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 group-hover:flex"
                    aria-label={`${folder.name}を削除`}
                    title="削除"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="flex flex-col gap-2 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                {selectedFolder === 'all'
                  ? 'すべてのタグ'
                  : selectedFolder === UNFILED_FOLDER_ID
                    ? '未分類'
                    : folders.find((folder) => folder.id === selectedFolder)?.name ?? 'タグ'}
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                {filteredTags.length.toLocaleString('ja-JP')} 件
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateTag(true)}
              className="min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: DEFAULT_TAG_COLOR }}
            >
              ＋ 新しいタグ
            </button>
          </div>

          {loading ? (
            <div className="space-y-0 divide-y divide-gray-100">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="grid grid-cols-[1fr_120px_180px_88px] items-center gap-3 px-4 py-3">
                  <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
                  <div className="h-8 w-full animate-pulse rounded bg-gray-100" />
                  <div className="h-8 w-16 animate-pulse rounded bg-gray-100" />
                </div>
              ))}
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="px-4 py-16 text-center text-sm text-gray-500">
              タグはまだありません。
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">タグ名</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">人数</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">フォルダ</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredTags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                            style={{ backgroundColor: tag.color }}
                            aria-hidden="true"
                          />
                          <span className="truncate font-medium text-gray-900">{tag.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {tag.friendCount.toLocaleString('ja-JP')}人
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={tag.folderId ?? ''}
                          onChange={(event) => handleMoveTag(tag.id, event.target.value)}
                          disabled={movingTagId === tag.id}
                          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                          aria-label={`${tag.name}のフォルダ`}
                          title={folderLabel(tag.folderId, folders)}
                        >
                          <option value="">未分類</option>
                          {folders.map((folder) => (
                            <option key={folder.id} value={folder.id}>{folder.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteTag(tag)}
                          className="min-h-[36px] rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <CreateTagDialog
        open={showCreateTag}
        folders={folders}
        defaultFolderId={defaultFolderId}
        existingTags={tags}
        onClose={() => setShowCreateTag(false)}
        onCreated={reload}
      />
      <CreateFolderDialog
        open={showCreateFolder}
        existingFolders={folders}
        onClose={() => setShowCreateFolder(false)}
        onCreated={handleFolderCreated}
      />
    </div>
  )
}
