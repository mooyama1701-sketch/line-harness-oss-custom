# プロジェクト進捗状況

## 基本情報

- 最終更新日：2026-06-25
- 現在のフェーズ：フェーズ1：現状調査・プロジェクト準備
- 全体ステータス：公式リポジトリのForkを正式作業場所 `/Users/mooyama/codex/LINE-Harness-oss-Custom` へ統合済み。`v0.15.0`起点の `custom/main` に優先未リリース2コミット（CI修正、LIFFセキュリティ修正）、Admin build fingerprint、Worker CORS Variables対応を正式取り込み済み。改造版初期リリース向けP0対応として、自動update無効化、改造版ソースの固定参照、Cloudflare同名リソース時の停止処理を実装済み。P1対応として、ローカル設定名、setup package名、setup CLI bin名、MCP登録名、MCP package名、MCP bin名、MCP内部server名の分離、LICENSE本文と元OSSクレジットのnpm package同梱を実装済み。新規環境インストール試験計画を `docs/INSTALLATION_TEST_PLAN.md` に文書化済み。setupの認証前停止モードを実装済み。`packages/create-line-harness` の正式pack方法は `pnpm pack` と確認済みで、tarball内の `@line-harness/update-engine` は `^0.0.2` へ変換される。公開前tarballによる認証前停止モード付きsandbox最小試験は成功済み。Cloudflare read-only確認では試験用候補名が未使用であることを確認済み。管理画面の友だちリストにタグ一覧・新規作成を追加し、友だち一覧/詳細から既存タグを付与・解除できるタグ管理導線を実装済み。友だち一覧のタグ編集はモーダル化し、既存タグ検索、新規タグ作成、作成後の即時付与、付与人数表示に対応済み。友だちタグAPIは、タグ一覧取得、存在しない友だち/タグIDの404、二重追加時の冪等処理に対応済み。Lステップ風の独立したタグ管理画面として、サイドメニュー「タグ管理」、新規タグ作成、タグフォルダ作成、フォルダ別表示、タグ移動、タグ/フォルダ削除を実装済み。シナリオ詳細画面から友だちを手動でシナリオ登録するUIを実装し、dev Admin Pagesへ反映済み。localhost開発時のAdminログイン用に、loopback WorkerでのみCookie Secure属性を外し、Vite dev serverのcredentialed CORSをlocalhost限定で許可する調整を実装済み。dev実環境 `line-harness-custom-dev` 系へ `046_tag_folders.sql`、Worker、Admin Pagesを反映し、`/tags` とログイン画面の到達、Admin originからWorkerへのCORS preflight成功を確認済み。dev管理画面で `テストシナリオ２` へ友だちを手動登録し、重複登録メッセージ、stats再取得、cronによるステップ配信ログ作成まで確認済み。Cloudflare新規フルセットアップ試験、LINE試験、npm registry経由の正式package取得試験は未実施。
- 次の主要目標：改造版初期差分の設計。

## 現在のゴール

今後のCodex作業で、進捗、決定事項、未決定事項、インストーラー設計方針、リリース前確認項目を継続的に確認・更新できる状態を作る。

## Codex作業時の参照資料

- `AGENTS.md`：共通作業ルール
- `docs/CUSTOM_RELEASE_POLICY.md`：初期リリース設計方針
- `docs/PROJECT_STATUS.md`：現在の進捗
- `docs/INSTALLATION_TEST_PLAN.md`：新規環境インストール試験計画
- `docs/UPSTREAM_ANALYSIS.md`：上流との差分と検証履歴

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
- [x] 管理資料とAGENTS.mdを `custom/main` へcommitし、`origin/custom/main` へpush
- [x] 優先CI修正 `43cbee6f1c3b6f3f74f0b9f85853c39b1c2c6d01` の検証を完了
- [x] LIFFセキュリティ修正 `e2689ba3228cf3a8074b1edf6cf4f260502a70b3` を検証用ブランチへcherry-pickし、検証を完了
- [x] 検証済み優先2コミットと検証記録を `custom/main` へ正式取り込みし、`origin/custom/main` へpush
- [x] 残り2コミット `a0a9c60849e5b25c030b6d40e514f5242721dac1` と `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c` の設計整合性を調査
- [x] Admin build fingerprint `a0a9c60849e5b25c030b6d40e514f5242721dac1` を検証用ブランチで検証し、正式取り込み可能と判断
- [x] Worker CORS Variables `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c` を検証用ブランチで検証し、資料追記込みで正式取り込み可能と判断
- [x] Fork運用資料 `docs/FORK_CLOUDFLARE_WORKFLOW.md` にWorker CORS Variablesのrepo Variables説明を追加
- [x] 改造版初期リリース向けP0対応として、自動update無効化を検証し、正式取り込み可能と判断
- [x] 初期リリース向けにroot `LICENSE` / `NOTICE` と公開対象npm packageへの `LICENSE` / `NOTICE` 同梱を整備
- [x] MIT License著作権表示 `Copyright (c) 2026 Shudesu and LINE Harness contributors` が元作者確認済み
- [x] 新規環境インストール試験計画を `docs/INSTALLATION_TEST_PLAN.md` に文書化
- [x] setupの認証前停止モードを実装し、sandbox最小試験でCloudflare認証前に止められるようにする
- [x] `packages/create-line-harness` のpack方法を比較し、`npm pack` では `workspace:` 依存が残り、正式手順の `pnpm pack` では通常versionへ変換されることを確認
- [x] 公開前 `pnpm pack` 産tarballで認証前停止モード付きsandbox最小試験を実施し、clone、固定commit checkout、依存導入、環境チェック、Cloudflare認証前停止を確認
- [x] Cloudflare read-only確認で試験用Worker/Pages/D1/R2候補名が未使用であることを確認
- [x] 管理画面の友だちリスト上部にタグ一覧・新規作成を追加
- [x] 友だち一覧のタグ編集で、既存タグの付与・解除とタグ未作成時の案内を表示
- [x] チャット画面の友だち詳細で、既存タグの付与・解除を実行できるようにした
- [x] タグ作成APIで空白名を拒否し、重複名を409として返す最小補強を追加
- [x] タグ作成APIの空白名、trim、重複409の単体テストを追加
- [x] 友だち一覧のタグ編集をモーダル化し、付与済みタグ、既存タグ検索、新規タグ作成、作成後の即時付与を同一画面で操作できるようにした
- [x] タグ一覧APIとタグ管理パネルに、既存 `friend_tags` 集計による付与人数表示を追加
- [x] 友だちタグAPIで、友だち別タグ一覧取得、存在しない friend/tag の404、二重追加時の副作用抑止を実装
- [x] サイドメニューに独立した「タグ管理」を追加し、タグ作成・フォルダ作成・フォルダ別表示・タグ移動ができるLステップ風UIを追加
- [x] `tag_folders` と `tags.folder_id` を追加し、新規インストール用 `bootstrap.sql` とマイグレーションを同期
- [x] dev実環境 `line-harness-custom-dev` D1へ `046_tag_folders.sql` を適用し、WorkerとAdmin Pagesへタグ管理UIを反映
- [x] シナリオ詳細画面に、友だち検索と手動シナリオ登録UIを追加
- [x] dev Admin Pagesへシナリオ手動登録UIを反映し、`テストシナリオ２` への手動登録、重複登録表示、stats再取得、cron配信ログを確認
- [x] localhost開発時のAdminログイン用に、loopback WorkerだけCookie Secure属性を外し、Vite dev serverのCORSをlocalhost限定で調整

初期リリース準備状況：

完了：

- 上流優先修正の検証・取り込み
- Build Fingerprint
- Worker再deploy時のCORS Variables保護
- 初期リリースでの自動update無効化
- 改造版ソースの固定参照（暫定commit）
- Cloudflare同名リソース時の停止処理（実Cloudflare環境ではなくmockで検証）
- 改造版専用ローカル設定名の分離（`~/.line-harness-custom`、`.line-harness-custom-setup.json`、`.line-harness-custom-config.json`）
- MCP登録名の分離（`.mcp.json` に `line-harness-custom` として追加）
- MCP package名の分離（`@airestart/line-harness-mcp-server`）
- MCP bin名の分離（`line-harness-custom-mcp`）
- MCP内部server名の分離（`line-harness-custom`）
- setup package名の分離（`@airestart/create-line-harness`）
- setup CLI bin名の分離（`create-line-harness-custom`）
- root `LICENSE` / `NOTICE` の追加
- 公開対象npm packageへの `LICENSE` / `NOTICE` 同梱
- READMEへの元OSSクレジットと改造版説明の追記
- MIT License著作権表示の元作者確認
- 新規環境インストール試験計画の文書化
- setup認証前停止モード
- setup packageの `pnpm pack` 手順確認とtarball依存表記の再発防止テスト
- 公開前tarballによる認証前停止モード付きsandbox最小試験
- Cloudflare read-onlyによる試験用候補名の衝突確認
- 管理画面からタグ作成、友だちへのタグ付与・解除を行う最小導線
- タグ作成APIの空白名拒否、重複名409、trimの単体テスト
- 友だち一覧のタグ編集モーダル化と、タグ一覧の付与人数表示
- 友だちタグAPIの一覧取得、付与、解除、二重追加、存在しないIDエラーの単体テスト
- Lステップ風の独立タグ管理UI（サイドメニュー、タグ作成、フォルダ作成、フォルダ別表示、タグ移動）
- シナリオ詳細からの友だち手動登録UI
- dev実環境へのタグフォルダmigration、Worker deploy、Admin Pages deploy
- dev Admin Pagesでのシナリオ手動登録UI確認（`テストシナリオ２`、友だち `KAZU@KOKE`、重複登録表示、cron配信ログ確認）
- localhost開発時のAdminログイン調整（production/deployed WorkerではCookie Secure維持、localhost CORSのみ許可）

未完了：

- 新規環境でのインストール試験
- npm registry経由の正式package取得試験
- Cloudflareリソース新規作成を伴うフルセットアップ試験
- 実LINE環境でのWebhook/LIFF確認

## 現在進行中の作業

- [ ] 新規環境インストール試験の実施準備

## 次に行う作業

1. 初期リリース直前に、setup用clone元の固定commitを最終リリースcommitへ更新する
2. `docs/INSTALLATION_TEST_PLAN.md` に従い、使用Cloudflareアカウントと試験用リソース名を確定し、npm registry経由のpackage取得試験またはCloudflare実作成試験へ進む

## シナリオ手動登録UI dev反映確認（2026-06-24）

対象：

- dev Admin Pages：`line-harness-custom-dev-admin-fb2091b6`
- dev Worker：`https://line-harness-custom-dev.x-picard1701.workers.dev`
- 管理画面：`https://line-harness-custom-dev-admin-fb2091b6.pages.dev`
- 対象シナリオ：`テストシナリオ２`
- 対象友だち：`KAZU@KOKE`

実施内容：

- `NEXT_PUBLIC_API_URL=https://line-harness-custom-dev.x-picard1701.workers.dev pnpm --filter web build` 成功。
- `wrangler pages deploy out --project-name line-harness-custom-dev-admin-fb2091b6 --branch main --commit-dirty=true` でdev Admin Pagesへ反映。
- dev Workerの再deployは未実施。既存の `POST /api/scenarios/:id/enroll/:friendId` APIを利用。
- dev管理画面のシナリオ詳細で「友だちを登録」UIが表示されることを確認。
- 友だち検索欄で `KAZU` を検索し、`KAZU@KOKE` を選択できることを確認。
- `テストシナリオ２` に `KAZU@KOKE` を手動登録できることを確認。
- 登録後、画面上で `登録 1 人 / 進行中 1 人` とstatsが再取得されることを確認。
- 同じ友だちを再登録した場合、`この友だちは既にこのシナリオに登録済みです` と表示されることを確認。
- dev D1で `friend_scenarios` に `テストシナリオ２` x `KAZU@KOKE` の登録が作成されたことを確認。
- 5分cron後、`messages_log` に `source = scenario`、本文 `これはテスト配信２です。` の送信ログが作成され、`friend_scenarios.status = completed` になったことを確認。

安全確認：

- 本番Cloudflare、本番LINE、npm publishは未実施。
- dev反映作業時点ではcommit未実施。後続の差分整理でローカルcommitした。
- 今回対象外の既存差分（auth/middleware/vite系、`docs/LINE-Harness-oss-Custom.code-workspace`）は変更していない。

## 友だちタグ付与・解除API整備（2026-06-25）

対象：

- 友だち管理画面のタグ表示・タグ編集モーダル
- 友だちタグAPI：`/api/friends/:id/tags`
- 既存DBテーブル：`friends`、`tags`、`tag_folders`、`friend_tags`

確認した既存実装：

- `friend_tags` は既に存在し、`PRIMARY KEY (friend_id, tag_id)` により同じ友だちへ同じタグを二重登録しない構造。
- `tags` と `tag_folders` は `046_tag_folders.sql`、`schema.sql`、`bootstrap.sql` に反映済み。
- 友だち一覧画面ではタグバッジ表示、タグ編集モーダル、タグ絞り込みが既に実装済み。
- シナリオ詳細画面の友だち手動登録UIは既存API `POST /api/scenarios/:id/enroll/:friendId` を使用しており、今回の変更対象外。

実施内容：

- `GET /api/friends/:id/tags` を追加し、友だちに付与済みのタグ一覧を取得できるようにした。
- `POST /api/friends/:id/tags` で、存在しない friendId / tagId を404として返すようにした。
- 同じ友だちへ同じタグを再付与した場合は200で成功扱いにし、`tag_change` や `tag_added` シナリオ副作用を二重発火させないようにした。
- `DELETE /api/friends/:id/tags/:tagId` で、存在しない friendId / tagId を404として返すようにした。
- 未付与タグの解除は200で成功扱いにし、不要な副作用を発火させないようにした。
- OpenAPIの簡易定義に、友だちタグ一覧取得と404/二重追加時レスポンスを追記した。
- API単体テストを追加した。

DB migration：

- 追加なし。
- 既存 `friend_tags`、`tags`、`tag_folders` を使用するため、破壊的DB変更は不要。

未実施：

- Cloudflare deployは未実施。
- 本番D1、本番Worker、本番Pages、本番LINE設定、npm publishは未実施。
- タグ追加をトリガーにした新規のシナリオ自動開始機能、シナリオ分岐、一斉配信は今回追加していない。

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
- 現在のブランチ：`custom/main`
- origin：`https://github.com/mooyama1701-sketch/line-harness-oss-custom.git`
- upstream：`https://github.com/Shudesu/line-harness-oss.git`
- GitHub CLI認証：有効。アクティブアカウントは `mooyama1701-sketch`。Git操作プロトコルは `https`。
- GitHub上の同名リポジトリ：`mooyama1701-sketch/line-harness-oss` は存在するが、`Shudesu/line-harness-oss` のForkではない。
- 作成済みFork：`mooyama1701-sketch/line-harness-oss-custom`
- Fork URL：`https://github.com/mooyama1701-sketch/line-harness-oss-custom`
- Fork元：`Shudesu/line-harness-oss`
- 正式作業場所：`/Users/mooyama/codex/LINE-Harness-oss-Custom`
- バックアップ先：`/Users/mooyama/codex/LINE-Harness-oss-Custom-backup-20260614`
- clone先の現在ブランチ：`custom/main`
- clone先の作業ツリー：clean
- clone先のorigin：`https://github.com/mooyama1701-sketch/line-harness-oss-custom.git`
- clone先のupstream：`https://github.com/Shudesu/line-harness-oss.git`
- 基準タグ確認：`v0.15.0` は `1515a74cbe2f7154fdb09ad2f370e743ed8421a6` を指している
- 基準コミット確認：`1515a74cbe2f7154fdb09ad2f370e743ed8421a6` はclone先に存在する
- 作成済みローカルブランチ：`custom/main`
- `custom/main` の起点：`1515a74cbe2f7154fdb09ad2f370e743ed8421a6`
- 作成済み検証ブランチ：`integrate/upstream-v0.15.0-fixes`
- `custom/main` の現在コミット：作業ごとの最終確認で `git rev-parse HEAD` と `git rev-parse origin/custom/main` を照合する
- `integrate/upstream-v0.15.0-fixes`：優先未リリース2コミット検証用のローカルブランチ
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
- `docs/CUSTOM_RELEASE_POLICY.md`
- `docs/DECISIONS.md`
- `docs/INSTALLER_ARCHITECTURE.md`
- `docs/INSTALLATION_TEST_PLAN.md`
- `docs/RELEASE_CHECKLIST.md`
- `docs/UPSTREAM_ANALYSIS.md`
- `/Users/mooyama/codex/LINE-Harness-oss-Custom`

## 未決定事項

- 改造版の正式サービス名
- GitHubリポジトリの正式名称
- SDKやupdate-engineのpackage名を改造版専用名へ分離するか
- 既存本番カスタマイズを引き継ぐか
- 開発用Cloudflareリソース名
- テスト用LINE公式アカウントの準備状況
- 新規環境インストール試験の実施結果
- 実Cloudflare環境で、Worker secretsとplain varsが同名で存在する場合の最終的な優先順位
- 公式CLI `0.1.25`とnpm公開済み`0.1.24`のどちらをインストーラー調査基準にするか

## ブロッカー

- テスト用Cloudflare環境とテスト用LINE公式アカウントの準備状況が未確認

## 現在確認しているリスク

- `upstream` は公式リポジトリを向いているため、誤って公式へpushしないよう運用上の注意が必要
- 仮名称が多く、公開前に正式名称を決める必要がある
- setup処理でCloudflare同名リソース時の停止処理はmock検証済み。read-onlyでは試験用候補名が未使用であることを確認済みだが、実Cloudflare環境での作成前停止は未確認
- 新規環境インストール試験計画、setup認証前停止モード、公開前tarballによる認証前停止モード付きsandbox最小試験、Cloudflare read-only確認は完了済みだが、Cloudflare実作成試験と実LINE試験は未実施
- 本番環境と検証環境の分離を徹底しないと、CloudflareやLINE設定へ影響する可能性がある
- 改造版にはroot `LICENSE` と `NOTICE` を追加済み。MIT License著作権表示は元作者確認済み。
- 公式インストーラーは同名D1/R2/Pagesを既存扱いで続行する箇所があったが、改造版setupでは同名Worker、Pages project、D1 database、R2 bucketを検出した場合に作成・更新・deploy・migration前に停止するよう変更済み
- 公式update機能は公式release-manifestを参照するため、改造版初期版では自動更新を実行させず、未対応案内を表示して終了させる対応を検証済み。正式取り込み後も、将来updateを復活させる場合は改造版manifest設計が必要。

## 次回Codexへ依頼する作業

次は、`docs/INSTALLATION_TEST_PLAN.md` に従い、使用Cloudflareアカウントと試験用リソース名を確定してから、npm registry経由の正式package取得試験またはCloudflare実作成試験へ進んでください。初期リリース直前にはsetup用clone元の固定commitを最終commitへ更新してください。

## 認証前停止モード付きsandbox最小試験結果（2026-06-20）

検証対象：

- package：`@airestart/create-line-harness`
- package version：`0.1.25`
- tarball作成方法：`pnpm pack`
- tarball起動形式：`npx -p <tarball> create-line-harness-custom`

確認済み：

- `pnpm pack` 産tarball内で `@line-harness/update-engine` は `^0.0.2` として収録され、`workspace:` 依存は残らない
- tarballに `dist/index.js`、`LICENSE`、`NOTICE`、`package.json` が含まれる
- sandbox内でtarballからsetupを起動し、改造版repositoryのclone、固定commit checkout、依存導入、環境チェックに成功
- clone先originは `https://github.com/mooyama1701-sketch/line-harness-oss-custom.git`
- clone先はdetached HEADで、HEADは固定commit `593781111c06837408eb33b3d0f25c72c747f6f0`
- `LINE_HARNESS_SETUP_STOP_BEFORE_CLOUDFLARE_AUTH=1` によりCloudflare認証前で終了コード `0` で停止
- Cloudflare認証、`wrangler login`、Cloudflareリソース確認・作成、LINE設定変更は実行していない
- 停止位置がCloudflare認証前のため、`.line-harness-custom-setup.json` と `.line-harness-custom-config.json` は作成されていない

未実施：

- npm registry経由の正式package取得試験
- Cloudflareリソース作成を伴う新規環境インストール試験
- LINE Developers設定やWebhook/LIFF確認

## Cloudflare read-only確認結果（2026-06-20）

確認環境：

- Wrangler：`4.77.0`
- 認証状態：OAuthでログイン済み
- 対象アカウント：`Mooyama1701@gmail.com's Account`
- 確認済み権限：`account:read`、`user:read`、`workers:write`、`workers_scripts:write`、`workers_tail:read`、`d1:write`、`pages:write` など

実行した操作：

- `wrangler whoami`
- `wrangler versions list --name ... --json`
- `wrangler pages project list --json`
- `wrangler d1 list --json`
- `wrangler r2 bucket list --json`

確認結果：

| 種類 | 試験用候補名 | 結果 |
|---|---|---|
| Worker | `line-harness-custom-dev` | 未使用 |
| Pages | `line-harness-custom-dev-admin` | 未使用 |
| Pages prefix | `line-harness-custom-dev-admin-` | 該当なし |
| D1 | `line-harness-custom-dev` | 未使用 |
| R2 | `line-harness-custom-dev-images` | 未使用 |

本番リソース確認：

- 本番Worker `line-harness-production` は同一Cloudflareアカウント上に存在する
- 本番D1 `line-harness` は同一Cloudflareアカウント上に存在する
- 本番Pages `line-harness-production-admin` は今回のPages一覧では確認できなかった。理由は未確認であり、推測で断定しない

注意：

- 今回の操作は一覧・存在確認のみ。Cloudflareリソースの作成、変更、削除、deploy、migration、secret登録は実施していない
- 認証tokenにはwrite系権限も含まれるため、実作成試験へ進む前に使用アカウントと試験用リソース名を確定し、本番名を使わないことを再確認する

未実施：

- Cloudflareリソース作成を伴う新規環境インストール試験
- Worker Secrets登録
- D1 migration
- Pages deploy
- LINE Developers設定やWebhook/LIFF確認
- npm registry経由の正式package取得試験

## 優先未リリース2コミット検証結果（2026-06-14）

検証ブランチ：`integrate/upstream-v0.15.0-fixes`

| 項目 | 結果 |
|---|---|
| Node.js | `v20.20.2` |
| pnpm | `9.15.4` |
| 依存関係 | `node_modules` 存在確認済み。追加installなし |
| 1件目 | `43cbee6f1c3b6f3f74f0b9f85853c39b1c2c6d01` を適用済み。rebase後コミットは `d25eb07275f12237178887b9cb715e005a0fac0f` |
| 2件目 | `e2689ba3228cf3a8074b1edf6cf4f260502a70b3` を競合なしでcherry-pick。検証ブランチ上コミットは `8876457b8a0691d6b32dec57a4c5a977a1c186e6` |
| Workerテスト失敗原因 | 前回失敗は、実装不具合ではなく、workflowと同じ事前buildを行っていなかったことによる `@line-crm/shared` dist不足と判断 |
| 取り込み判断 | 検証上は `custom/main` へ取り込み可能。ただしmerge/pushは未実施 |

実行した検証：

- `pnpm --filter @line-crm/shared --filter @line-crm/line-sdk --filter @line-crm/db --filter @line-harness/update-engine build`：成功
- `pnpm --filter worker typecheck`：成功
- `pnpm --filter worker test`：成功（1件目検証時：45 files / 511 tests、2件目適用後：46 files / 520 tests）
- `pnpm --filter worker build`：成功
- `pnpm --filter worker test -- src/lib/safe-redirect.test.ts`：成功（1 file / 9 tests）
- `pnpm --filter liff build`：成功

補足：

- `pnpm --filter worker build` 実行時、Wranglerが `/Users/mooyama/Library/Preferences/.wrangler/logs/` へログを書けない `EPERM` 警告を出したが、コマンドの終了コードは0で、ビルド自体は成功。
- lockfileや想定外のソースファイル変更は発生していない。

## 残り2コミット設計整合性調査結果（2026-06-14）

| コミット | 評価 | 理由 |
|---|---|---|
| `a0a9c60849e5b25c030b6d40e514f5242721dac1` | そのまま取り込む推奨 | Adminサイドバーにcommit SHAとbuild時刻を表示し、問い合わせ時のデプロイ元判別に有用。インストーラー設計と直接衝突しない。将来のブランド調整時に `L Harness` 表示名は再確認する。 |
| `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c` | 修正して取り込む推奨 | GitHub Actions deployでAdmin CORS varsを毎回wrangler configへ注入し、redeployで設定が落ちる事故を防ぐ。インストーラーのsecrets方式とは責務が別で両立可能。ただしFork運用資料のVariables一覧更新が必要。 |

推奨順序：

1. `a0a9c60849e5b25c030b6d40e514f5242721dac1`
2. `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c` + `docs/FORK_CLOUDFLARE_WORKFLOW.md` 更新

今回の調査では、cherry-pick、merge、ブランチ作成、ソースコード修正、workflow修正、Cloudflare操作、npm操作は行っていない。

## Admin build fingerprint検証結果（2026-06-14）

検証ブランチ：`validate/upstream-a0a9c60-build-fingerprint`

| 項目 | 結果 |
|---|---|
| 対象コミット | `a0a9c60849e5b25c030b6d40e514f5242721dac1` |
| 検証ブランチ上commit | `cf23efd5a00b...` |
| cherry-pick | 競合なしで成功 |
| Webテスト | `pnpm --filter web test` 成功。2 files / 8 tests passed |
| 環境変数なしbuild | `NEXT_PUBLIC_API_URL=https://worker.example.test pnpm --filter web build` 成功。commit SHAはGit情報、build時刻はbuild時ISO時刻へfallback |
| 環境変数ありbuild | `APP_COMMIT_SHA=1234567 APP_BUILD_TIME=2026-06-14T12:34:56Z NEXT_PUBLIC_API_URL=https://worker.example.test pnpm --filter web build` 成功 |
| Cloudflare Pages向けbuild | `NEXT_PUBLIC_API_URL=https://worker.example.test pnpm deploy:web` 成功 |
| 最初のbuild失敗 | `NEXT_PUBLIC_API_URL` 未設定による既存仕様の失敗。Build Fingerprint起因ではない |
| 取り込み判断 | そのまま正式取り込み可能 |

補足：

- GitHub Actions workflowに不要な権限追加、secret追加、deploy先やbranch条件の意図しない変更は見つからなかった。
- 表示情報はversion、commit SHA、build時刻であり、秘密情報漏えいの懸念は低い。
- ローカル実画面プレビューは未実施。build成果物と差分で確認した。
- `L Harness` 表示名は今回は維持し、将来の改造版ブランド確定時に再確認する。
- Cloudflare deploy、本番環境変更、LINE設定変更、npm publishは実施していない。

## Worker CORS Variables検証結果（2026-06-14）

検証ブランチ：`validate/upstream-1c4adff-worker-cors-vars`

| 項目 | 結果 |
|---|---|
| 対象コミット | `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c` |
| 検証ブランチ上commit | `416ed3d054b6bcb2f9ac1fda5d6a7cbac3b5eeac` |
| cherry-pick | 競合なしで成功 |
| 上流変更ファイル | `.github/workflows/deploy-cloudflare-worker.yml`, `docs/ADMIN-AUTH.md` |
| 追加した運用資料 | `docs/FORK_CLOUDFLARE_WORKFLOW.md` |
| 運用資料commit | `bf3c9e3e0a1f217a2353cc5c6533466ae68c0f8f` |
| Workflow構文確認 | 成功 |
| Worker typecheck | 成功 |
| Admin auth config test | 成功。1 file / 20 tests passed |
| repo Variables注入テスト | 5パターン成功 |
| 取り込み判断 | 資料追記込みで正式取り込み可能 |

確認した内容：

- GitHub ActionsのWorker deployで、repo Variables `ADMIN_ORIGIN` / `ADMIN_ALLOW_CROSS_SITE` / `WORKER_URL` をdeploy前の `apps/worker/dist/line_harness/wrangler.json` へ注入する。
- `ADMIN_ORIGIN` が未設定の場合はno-opで、既存のsame-site構成には影響しない。
- `ADMIN_ALLOW_CROSS_SITE` 未設定時は文字列 `"true"` になり、`false` 指定時は文字列 `"false"` として保持される。
- Worker側は `env.ADMIN_ALLOW_CROSS_SITE === 'true'` で判定するため、`"false"` はfalseとして扱われる。
- `WORKER_URL` 未設定時はvarsへ追加されない。
- `jq` により既存varsやD1設定を保持できる。
- 特殊文字を含むURLでもJSONは壊れない。
- `docs/FORK_CLOUDFLARE_WORKFLOW.md` にFork運用時のrepo Variables説明を追加済み。

責務分離：

- npxインストーラーは、第三者が新規環境を構築する際にWorkerへ初期設定する。
- GitHub Actionsは、Fork運用中の再deployで必要な設定を再現する。

未実施・未確認：

- Cloudflare deploy、GitHub Actions手動実行、本番環境変更、LINE設定変更、npm publishは実施していない。
- 実Cloudflare環境で、同名のsecretとplain varが存在する場合の最終的な優先順位は未検証。
- 同じ運用値を設定する前提では衝突リスクは低いが、今後の検証環境または本番環境での再deploy時に確認する。

補足：

- この対応を `custom/main` へfast-forwardで取り込めば、`v0.15.0` 後の上流調査対象4コミットの検証・取り込み作業は一段落する。
