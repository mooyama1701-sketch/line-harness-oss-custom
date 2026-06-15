'use client'

export interface ReleaseInfo {
  tag: string
  url: string
}

export function useUpdateNotification(): {
  release: ReleaseInfo | null
  dismiss: () => void
} {
  function dismiss(): void {
    // 自動更新は初期リリースでは無効化されているため、通知も表示しません。
  }

  return { release: null, dismiss }
}
