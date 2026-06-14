# プロジェクト進捗状況

## 基本情報

- 最終更新日：2026-06-14
- 現在のフェーズ：フェーズ1：現状調査・プロジェクト準備
- 全体ステータス：公式リポジトリのForkを正式作業場所 `/Users/mooyama/codex/LINE-Harness-oss-Custom` へ統合済み。`v0.15.0`起点の `custom/main` と、優先未リリースコミット検証用ブランチ `integrate/upstream-v0.15.0-fixes` を作成済み。
- 次の主要目標：優先未リリース2コミットの検証再開と、改造版初期差分の設計。

## 現在のゴール

今後のCodex作業で、進捗、決定事項、未決定事項、インストーラー設計方針、リリース前確認項目を継続的に確認・更新できる状態を作る。

## 完了した作業

- [x] プロジェクト計画書の作成を確認
- [x] AGENTS.mdの作成を確認
- [x] プロジェクト開始前のローカル環境確認を実施
- [x] プロジェクト管理ドキュメントの作成
- [x] LINE Harness公式リポジトリのread-only調査
- [x] 改造版の基準を公式 `v0.15.0`、基準コミットを `1515a74cbe2f7154fdb09ad2f370e743ed8421a6` に決定
- [x] GitHubのFork方式採用を決定
- [x] `main`の未リリース4コミットは初期土台に含めず、ソース取得後に個別評価する方針を決定
- [x] 初期版では`update`による自動更新を実行させず、未対応案内を表示する方針を決定
- [x] 正式なLICENSE本文または元開発者の許諾確認まで、npmでの正式公開を行わない方針を決定
- [x] GitHub CLI認証状態の復旧を確認
- [x] 公式リポジトリ `Shudesu/line-harness-oss` を `mooyama1701-sketch/line-harness-oss-custom` としてFork
- [x] Forkを取得し、正式作業場所 `/Users/mooyama/codex/LINE-Harness-oss-Custom` へ統合
- [x] clone先で `origin`、`upstream`、`v0.15.0`、基準コミットの存在を確認
- [x] remoteとタグを最新化
- [x] 基準コミット `1515a74cbe2f7154fdb09ad2f370e743ed8421a6` からローカルブランチ `custom/main` を作成
- [x] 公式`main`の未リリース4コミットを一覧化し、個別評価を `docs/UPSTREAM_ANALYSIS.md` に記録
- [x] `custom/main` を `origin/custom/main` へ初回push
- [x] 検証用ブランチ `integrate/upstream-v0.15.0-fixes` を作成
- [x] 優先CI修正 `43cbee6f1c3b6f3f74f0b9f85853c39b1c2c6d01` を検証用ブランチへcherry-pick
- [x] 開発用リポジトリと管理資料用フォルダを `/Users/mooyama/codex/LINE-Harness-oss-Custom` へ統合
- [x] 統合前の管理資料用フォルダを `/Users/mooyama/codex/LINE-Harness-oss-Custom-backup-20260614` として保持

## 現在進行中の作業

- [ ] 優先未リリース2コミットの検証完了
- [ ] 改造版初期差分の設計

## 次に行う作業

1. `integrate/upstream-v0.15.0-fixes` で停止中の検証を再開する
2. Workerテスト失敗原因を、独自修正せずに前提build不足か実不具合か切り分ける
3. 問題がなければセキュリティ修正 `e2689ba3228cf3a8074b1edf6cf4f260502a70b3` をcherry-pickして検証する
4. `packages/create-line-harness` の変更対象を確定

## 現在のローカル環境

| 項目 | 状態 | バージョン・内容 | 確認日 |
|---|---|---|---|
| Git | インストール済み | git version 2.52.0 | 2026-06-14 |
| GitHub CLI | インストール済み | gh version 2.86.0 (2026-01-21) | 2026-06-14 |
| Node.js | インストール済み | v20.20.2 | 2026-06-14 |
| npm | インストール済み | 11.16.0 | 2026-06-14 |
| pnpm | インストール済み | 9.15.4 | 2026-06-14 |
| Corepack | インストール済み | 0.34.6 | 2026-06-14 |

## Git・GitHubの状態

- Git初期化：済み
- 現在のブランチ：`integrate/upstream-v0.15.0-fixes`
- origin：`https://github.com/mooyama1701-sketch/line-harness-oss-custom.git`
- upstream：`https://github.com/Shudesu/line-harness-oss.git`
- GitHub CLI認証：有効。アクティブアカウントは `mooyama1701-sketch`。Git操作プロトコルは `https`。
- GitHub上の同名リポジトリ：`mooyama1701-sketch/line-harness-oss` は存在するが、`Shudesu/line-harness-oss` のForkではない。
- 作成済みFork：`mooyama1701-sketch/line-harness-oss-custom`
- Fork URL：`https://github.com/mooyama1701-sketch/line-harness-oss-custom`
- Fork元：`Shudesu/line-harness-oss`
- 正式作業場所：`/Users/mooyama/codex/LINE-Harness-oss-Custom`
- バックアップ先：`/Users/mooyama/codex/LINE-Harness-oss-Custom-backup-20260614`
- clone先の現在ブランチ：`integrate/upstream-v0.15.0-fixes`
- clone先の作業ツリー：clean
- clone先のorigin：`https://github.com/mooyama1701-sketch/line-harness-oss-custom.git`
- clone先のupstream：`https://github.com/Shudesu/line-harness-oss.git`
- 基準タグ確認：`v0.15.0` は `1515a74cbe2f7154fdb09ad2f370e743ed8421a6` を指している
- 基準コミット確認：`1515a74cbe2f7154fdb09ad2f370e743ed8421a6` はclone先に存在する
- 作成済みローカルブランチ：`custom/main`
- `custom/main` の起点：`1515a74cbe2f7154fdb09ad2f370e743ed8421a6`
- 作成済み検証ブランチ：`integrate/upstream-v0.15.0-fixes`
- `integrate/upstream-v0.15.0-fixes` の現在コミット：`d06e26c171c1fa499de56fd997a73fbcbe8cd8b5`
- 評価済み未リリースコミット：
  - `a0a9c60849e5b25c030b6d40e514f5242721dac1`
  - `43cbee6f1c3b6f3f74f0b9f85853c39b1c2c6d01`
  - `e2689ba3228cf3a8074b1edf6cf4f260502a70b3`
  - `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c`

## 現在の成果物

- `AGENTS.md`
- `docs/プロジェクト計画書.md`
- `docs/README.md`
- `docs/PROJECT_STATUS.md`
- `docs/DECISIONS.md`
- `docs/INSTALLER_ARCHITECTURE.md`
- `docs/RELEASE_CHECKLIST.md`
- `docs/UPSTREAM_ANALYSIS.md`
- `/Users/mooyama/codex/LINE-Harness-oss-Custom`

## 未決定事項

- 改造版の正式サービス名
- GitHubリポジトリの正式名称
- npmスコープ
- npmパッケージ名
- 既存本番カスタマイズを引き継ぐか
- 開発用Cloudflareリソース名
- テスト用LINE公式アカウントの準備状況
- `main`の未リリース4コミットの実際の取り込み有無
- 公式CLI `0.1.25`とnpm公開済み`0.1.24`のどちらをインストーラー調査基準にするか
- MIT License表示の具体的な整備方法

## ブロッカー

- テスト用Cloudflare環境とテスト用LINE公式アカウントの準備状況が未確認
- 正式なLICENSE本文または元開発者の許諾を確認するまで、npmでの正式公開は行わない

## 現在確認しているリスク

- `upstream` は公式リポジトリを向いているため、誤って公式へpushしないよう運用上の注意が必要
- 仮名称が多く、公開前に正式名称を決める必要がある
- 公式インストーラー内部の処理が未調査のため、変更対象ファイルと安全上のリスクが未確定
- 本番環境と検証環境の分離を徹底しないと、CloudflareやLINE設定へ影響する可能性がある
- 公式リポジトリにはroot `LICENSE` が存在しないため、正式なLICENSE本文または元開発者の許諾を確認するまでnpmでの正式公開は行わない
- 公式インストーラーは同名D1/R2/Pagesを既存扱いで続行する箇所があり、新規構築限定の安全原則に合わせて停止または明示確認へ変更する必要がある
- 公式update機能は公式release-manifestを参照するため、改造版初期版では自動更新を実行させず、未対応案内を表示して終了させる必要がある

## 次回Codexへ依頼する作業

`integrate/upstream-v0.15.0-fixes` で優先未リリース2コミットの検証を再開してください。現時点ではCI修正 `43cbee6f1c3b6f3f74f0b9f85853c39b1c2c6d01` はcherry-pick済みですが、Workerテストが `@line-crm/shared` のdist解決失敗で停止しています。セキュリティ修正 `e2689ba3228cf3a8074b1edf6cf4f260502a70b3` は未適用です。
