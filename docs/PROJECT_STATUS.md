# プロジェクト進捗状況

## 基本情報

- 最終更新日：2026-06-14
- 現在のフェーズ：フェーズ1：現状調査・プロジェクト準備
- 全体ステータス：公式リポジトリのForkを正式作業場所 `/Users/mooyama/codex/LINE-Harness-oss-Custom` へ統合済み。`v0.15.0`起点の `custom/main` に優先未リリース2コミット（CI修正、LIFFセキュリティ修正）を正式取り込み済み。Admin build fingerprintコミットの検証を完了し、正式取り込み可能と判断。
- 次の主要目標：Admin CORS運用改善コミットの検証と、改造版初期差分の設計。

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
- [x] 管理資料とAGENTS.mdを `custom/main` へcommitし、`origin/custom/main` へpush
- [x] 優先CI修正 `43cbee6f1c3b6f3f74f0b9f85853c39b1c2c6d01` の検証を完了
- [x] LIFFセキュリティ修正 `e2689ba3228cf3a8074b1edf6cf4f260502a70b3` を検証用ブランチへcherry-pickし、検証を完了
- [x] 検証済み優先2コミットと検証記録を `custom/main` へ正式取り込みし、`origin/custom/main` へpush
- [x] 残り2コミット `a0a9c60849e5b25c030b6d40e514f5242721dac1` と `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c` の設計整合性を調査
- [x] Admin build fingerprint `a0a9c60849e5b25c030b6d40e514f5242721dac1` を検証用ブランチで検証し、正式取り込み可能と判断

## 現在進行中の作業

- [ ] Admin CORS運用改善 `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c` の検証
- [ ] 改造版初期差分の設計

## 次に行う作業

1. Admin CORS運用改善 `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c` を、`docs/FORK_CLOUDFLARE_WORKFLOW.md` 更新と合わせて検証する
2. 検証用ブランチを作り、`1c4adff` をcherry-pickしてWorker deploy workflow、Admin CORS、関連資料の整合性を確認する
3. 必要なtest・typecheck・buildを実行する
4. `packages/create-line-harness` の変更対象を確定する

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
- `custom/main` の現在コミット：`273caf2233f64653eac4be15ab68869d39c8189f`
- `integrate/upstream-v0.15.0-fixes` の現在コミット：`273caf2233f64653eac4be15ab68869d39c8189f`
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

Admin CORS運用改善 `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c` を、`docs/FORK_CLOUDFLARE_WORKFLOW.md` 更新とセットで検証してください。設計整合性調査では「修正して取り込む」推奨です。コミット本体に加えて、Fork運用資料のrepo Variables一覧へ `ADMIN_ORIGIN` / `ADMIN_ALLOW_CROSS_SITE` / `WORKER_URL` を追記するのが望ましいです。

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
