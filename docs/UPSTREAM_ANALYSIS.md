# LINE Harness公式リポジトリ調査

## 調査情報

- 調査日：2026-06-14
- 調査方法：
  - GitHub公開Webページ
  - GitHub Public API GET
  - `raw.githubusercontent.com`
  - `git ls-remote https://github.com/Shudesu/line-harness-oss.git`
  - `npm view create-line-harness ...`
- 認証の使用：なし。GitHub CLI認証は使用していない。
- ローカルソース取得：なし。`git clone`、npmパッケージのダウンロード、展開は未実施。
- 外部環境への変更：なし。Cloudflare、LINE、GitHubリポジトリ、npmへの変更は未実施。

## 公式リポジトリ基本情報

| 項目 | 確認結果 |
|---|---|
| 正式なリポジトリ名 | `Shudesu/line-harness-oss` |
| URL | https://github.com/Shudesu/line-harness-oss |
| 公開状態 | Public |
| デフォルトブランチ | `main` |
| `main`最新コミット | `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c` |
| `main`最新コミット日時 | 2026-06-12T14:47:55Z |
| `main`最新コミットメッセージ | `feat(ci): bake admin CORS vars into deploy config so they survive redeploys (#165)` |
| 最新正式リリース | `v0.15.0` |
| 最新正式リリース公開日時 | 2026-06-07T05:01:45Z |
| 最新正式リリースの対象コミット | `1515a74cbe2f7154fdb09ad2f370e743ed8421a6` |
| 最新タグ | `v0.15.0` |
| ライセンス | READMEと`packages/create-line-harness/package.json`はMIT表記。root `LICENSE` は存在しないため、ライセンス本文の同梱は未確認。 |
| Node.js要件 | root `package.json` とCLI `package.json` は `>=20`。READMEは `Node.js 22+ / pnpm` と記載。 |
| pnpm要件 | root `package.json` の `packageManager` は `pnpm@9.15.4` |
| package manager指定 | `pnpm@9.15.4` |
| モノレポ構成 | `pnpm-workspace.yaml` で `apps/*` と `packages/*` をworkspace化 |

確認元：

- GitHub repository API: https://api.github.com/repos/Shudesu/line-harness-oss
- 最新リリース: https://github.com/Shudesu/line-harness-oss/releases/tag/v0.15.0
- npm: https://www.npmjs.com/package/create-line-harness

## リリース・タグ一覧

主要タグは以下です。

| タグ | コミット | 日付 | 備考 |
|---|---|---|---|
| `v0.15.0` | `1515a74cbe2f7154fdb09ad2f370e743ed8421a6` | 2026-06-07 | 最新正式リリース |
| `v0.14.1` | `b1e6b0a2575ae8f78f2667af4efcdf811611cc25` | 2026-05-20 | 一つ前の正式リリース |
| `v0.14.0` | `ea28ef5f9ef809ba7a1dbdedd5d4187bca447ade` | 2026-05-12 | 0.14系リリース |
| `v0.13.1` | `079b09241524bf73f551d2a7bcfaa9ee07c36adb` | 2026-05-03 | 0.13系リリース |
| `v0.11.0` | `0c4d0d9e548ba86dfa6f475e4577940e29e02928` | 2026-04-21 | Conversation Inbox関連 |
| `v0.10.2` | `dd157f75d562c08ee546bcdcd47e43e33d9a1030` | 2026-04-14 | cron race修正 |

`git ls-remote`では、`v0.15.0` は注釈付きタグとして `85e33e1cadaf8d11a899a7d1f743cabf237c7dec` を持ち、実体コミットは `1515a74cbe2f7154fdb09ad2f370e743ed8421a6` でした。

## npmパッケージ情報

| 項目 | 確認結果 |
|---|---|
| パッケージ名 | `create-line-harness` |
| npm最新バージョン | `0.1.24` |
| dist-tags | `{ latest: "0.1.24" }` |
| bin | `create-line-harness`: `dist/index.js` |
| engines | `node >=20` |
| repository | `git+https://github.com/Shudesu/line-harness.git`、directory `packages/create-line-harness` |
| npm最終更新 | 2026-05-22T01:02:01.928Z |

注意：リポジトリ上の `packages/create-line-harness/package.json` は `0.1.25` でしたが、npm公開済みのlatestは `0.1.24` です。つまり、公式リポジトリのCLI package定義とnpm公開状態は一致していません。

## 最新正式リリースとmainの比較

### 候補A：最新正式リリースタグ `v0.15.0`

- タグ実体コミット：`1515a74cbe2f7154fdb09ad2f370e743ed8421a6`
- コミット日時：2026-06-07T04:59:03Z
- リリース作成日時：2026-06-07T04:59:36Z
- リリース公開日時：2026-06-07T05:01:45Z
- root `package.json` version：`0.15.0`
- release-manifest latest：`0.15.0`
- リリース状態：正式リリース済み、GitHub Release assetsあり
- Release assets：
  - `bundle.tar.gz`
  - `release-entry.json`
  - `release-manifest.json`

### 候補B：現在の`main`

- 最新コミット：`1c4adffc8390e6b68ea0bba7aed3b566498a4e8c`
- コミット日時：2026-06-12T14:47:55Z
- root `package.json` version：`0.15.0`
- `packages/create-line-harness/package.json` version：`0.1.25`
- リリース状態：`v0.15.0`より4コミット先行。未リリース変更を含む。

| 比較項目 | 候補A：`v0.15.0` | 候補B：`main` |
|---|---|---|
| コミットID | `1515a74cbe2f7154fdb09ad2f370e743ed8421a6` | `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c` |
| 更新日時 | コミット 2026-06-07T04:59:03Z、公開 2026-06-07T05:01:45Z | コミット 2026-06-12T14:47:55Z |
| バージョン | root `0.15.0`、CLI `0.1.25` | root `0.15.0`、CLI `0.1.25` |
| リリース状態 | 正式リリース済み | 未リリース |
| 変更量 | なし | `v0.15.0`から4コミット、11ファイル変更 |
| 安定性 | リリース成果物とmanifestがあり、基準として説明しやすい | 重要修正を含むが、正式リリース未反映 |
| インストーラー | setup/updateあり | setup/updateあり。CLI package versionは同じ |
| 更新取り込み | タグ基準で差分管理しやすい | 上流の最新状態に近いが、基準説明はコミット固定になる |

`v0.15.0`以降の`main`主要変更：

| コミット | 日時 | 内容 | 事実/推測 |
|---|---|---|---|
| `a0a9c60849e5b25c030b6d40e514f5242721dac1` | 2026-06-07T05:31:00Z | 管理画面にビルド指紋を表示 | 事実 |
| `43cbee6f1c3b6f3f74f0b9f85853c39b1c2c6d01` | 2026-06-12T14:31:46Z | deploy workflowでWorker前に`@line-harness/update-engine`をbuild | 事実 |
| `e2689ba3228cf3a8074b1edf6cf4f260502a70b3` | 2026-06-12T14:31:58Z | LIFF `/auth/line` redirectで危険schemeをguard | 事実 |
| `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c` | 2026-06-12T14:47:55Z | fork利用者向けにAdmin CORS varsをdeploy configへ反映 | 事実 |

調査上の推測：`main`の4コミットは、リリース後の小規模なCI・セキュリティ・fork運用補強に見えます。ただし正式リリースタグではないため、配布版の基準として採用するなら、ユーザー承認後に「特定コミット基準」として明記する必要があります。

## リポジトリ構成

| パス | 存在 | 確認できた役割 |
|---|---|---|
| `apps/worker` | 存在 | API、LIFF、Webhook受信、cron配信処理を担うWorker |
| `apps/web` | 存在 | Next.js管理画面 |
| `apps/liff` | 存在 | LIFFアプリ。READMEではWorker統合と読める箇所もあるため、役割は追加確認が必要 |
| `packages/create-line-harness` | 存在 | セットアップCLI |
| `packages/db` | 存在 | D1 schema、bootstrap、migrations |
| `migrations` | rootには存在しない | 実際のmigrationは `packages/db/migrations` |
| `docs` | 存在 | 運用・同期・セットアップ・仕様文書 |
| `scripts` | 存在 | release bundle、manifest、migration check、sandbox runnerなど |
| `.github/workflows` | 存在 | deploy、release、upstream update、worker CI |
| `pnpm-workspace.yaml` | 存在 | `apps/*`、`packages/*` |
| `package.json` | 存在 | root package、version `0.15.0` |
| `pnpm-lock.yaml` | 存在 | lockfile |
| `LICENSE` | 存在しない | README等にMIT表記はあるが、root LICENSEファイルは未確認ではなく「存在しない」 |
| `README.md` | 存在 | 概要、要件、npx setup、MIT表記 |
| `AGENTS.md` | 存在 | 公式リポジトリ側のAIエージェント向け短い指示 |

## インストーラー構成

確認対象：`packages/create-line-harness`

| 項目 | 確認結果 |
|---|---|
| npmパッケージ名 | `create-line-harness` |
| package.json version | `0.1.25` |
| npm published latest | `0.1.24` |
| binコマンド | `create-line-harness`: `./dist/index.js` |
| type | `module` |
| Node.js engines | `>=20` |
| npm公開対象 files | `dist` |
| build script | `tsup` |
| publish関連設定 | `prepublishOnly`: `node ./scripts/guard-source-publish.mjs` |
| CLIエントリーポイント | `packages/create-line-harness/src/index.ts` |
| `setup`コマンド | あり。引数なしの既定コマンド |
| `update`コマンド | あり |
| 引数なしの動作 | `setup`として実行し、必要に応じてrepo取得・依存install後にセットアップ |
| `--help` | 専用help実装は確認できず。不明コマンド時にUsageを出す |
| エラー処理 | top-level catchで`Error: <message>`表示、`WranglerError`は原因候補を出す |

主要ファイル：

| ファイル | 役割 |
|---|---|
| `src/index.ts` | args解析、setup/update分岐、設定ディレクトリ解決 |
| `src/commands/setup.ts` | 対話式セットアップ本体、state保存、D1/R2/Worker/Pages/Secrets/LINE登録 |
| `src/commands/update.ts` | 既存環境更新、manifest取得、bundle検証、D1/Worker/Pages更新 |
| `src/steps/clone-repo.ts` | `~/.line-harness`へのclone/pull、依存install |
| `src/steps/database.ts` | D1作成、bootstrap/schema/migration適用 |
| `src/steps/deploy-worker.ts` | Worker build/deploy、wrangler.toml生成、cron設定 |
| `src/steps/deploy-admin.ts` | Pages project作成、Admin build/deploy |
| `src/steps/secrets.ts` | Worker Secrets登録 |
| `src/steps/admin-auth.ts` | Admin cookie/CORS向けSecrets登録 |
| `src/lib/installed-wrangler.ts` | インストール済み環境用wrangler.toml生成 |
| `src/lib/wrangler.ts` | `npx wrangler`実行ラッパー、エラー補助 |

## 固定参照一覧

| ファイルパス | 現在の値 | 用途 | 影響 | 改造要否 |
|---|---|---|---|---|
| `packages/create-line-harness/src/steps/clone-repo.ts` | `https://github.com/Shudesu/line-harness-oss.git` | 初回clone元 | 改造せず残すと公式OSSを取得する | 必須 |
| `packages/create-line-harness/src/steps/clone-repo.ts` | `~/.line-harness` | 標準保存先 | 公式版と競合する | 必須 |
| `packages/create-line-harness/src/index.ts` | `~/.line-harness` | update時の設定ディレクトリ | 公式版設定を読む可能性 | 必須 |
| `packages/create-line-harness/src/index.ts` | `.line-harness-config.json` | update設定ファイル | 公式版設定と競合する | 必須 |
| `packages/create-line-harness/src/commands/setup.ts` | `.line-harness-setup.json` | セットアップ再開state | 公式版stateと競合する | 必須 |
| `packages/create-line-harness/src/commands/setup.ts` | `https://github.com/Shudesu/line-harness-oss/releases/latest/download/release-manifest.json` | インストール後configのmanifest URL | 改造版でも公式updateを参照する | 必須 |
| `packages/create-line-harness/src/commands/update.ts` | 同上 | update manifest既定値 | 公式bundleへ更新される可能性 | 必須または初期版では無効化 |
| `packages/create-line-harness/src/lib/installed-wrangler.ts` | 同上 | 生成wrangler.tomlの`MANIFEST_URL` | Worker側更新導線が公式を参照する | 必須または初期版では無効化 |
| `packages/create-line-harness/package.json` | `create-line-harness` | npmパッケージ名/bin | 公式CLI名と競合する | 必須 |
| `packages/create-line-harness/package.json` | repository `https://github.com/Shudesu/line-harness.git` | npm metadata | private repo風のURLが残る | 必須 |
| `.github/workflows/update-from-upstream.yml` | `https://github.com/Shudesu/line-harness-oss.git` | forkの上流取り込みworkflow | 改造版でも上流同期に使える可能性。ただしブランチ運用に合わせる必要あり | 推奨 |
| `.github/workflows/deploy-cloudflare-*.yml` | `github.repository != 'Shudesu/line-harness-oss'` | forkでのみdeploy有効化 | fork運用では有効。独立repoでも動く可能性あり | 要追加調査 |
| README多言語 | `npx create-line-harness`、`Shudesu/line-harness-oss` | 利用者向け案内・PR先 | 改造版利用者が公式へ誘導される | 必須 |
| `docs/FORK_CLOUDFLARE_WORKFLOW.md` | `Shudesu/line-harness-oss`、`create-line-harness@latest` | fork運用案内 | 改造版運用と混同する | 推奨 |

指定文字列のうち、`raw.githubusercontent.com` は今回の検索対象範囲ではヒットしませんでした。`release-manifest.json` はrelease workflow、update処理、setup後config、generated wrangler configで使用されています。

## Cloudflare構築処理

### リソース命名

| リソース | 公式インストーラーの命名 |
|---|---|
| Worker | `state.projectName` |
| D1 | `state.projectName` |
| R2 | `${state.projectName}-images` |
| Pages | `${state.projectName}-admin-${apiKey先頭8文字}` |
| Worker Secrets | 対象Worker名は `state.workerName` |
| ローカル設定ファイル | `<repoDir>/.line-harness-config.json` |
| ローカルセットアップstate | `<repoDir>/.line-harness-setup.json` |
| ローカルソース保存先 | `~/.line-harness` |

### 構築処理の確認結果

- Cloudflare認証：`npx wrangler whoami`で確認し、未認証なら`npx wrangler login`を対話実行。
- D1：`wrangler d1 create <projectName>`を実行。`already exists`の場合は`wrangler d1 list --json`から既存DB IDを取得して続行。
- D1 migration：新規作成時は`packages/db/bootstrap.sql`と未含有migration、または`schema.sql` + `packages/db/migrations/*.sql`を`--remote --file`で適用。既存DBでもschema errorがbenignなら継続する設計。
- R2：`wrangler r2 bucket create <projectName>-images`。`already exists`なら既存扱いで続行。
- Worker：`apps/worker/wrangler.toml`を一時生成し、`npx vite build`、`wrangler deploy`。cronは `*/5 * * * *`。
- インストール後Worker設定：`renderInstalledWranglerToml`でgenerated wrangler.tomlを書き、cronは `*/5 * * * *` と `0 */6 * * * *`。
- Secrets：`wrangler secret bulk --name <workerName>`、失敗時は`wrangler versions secret put`へfallback。
- Pages：`wrangler pages project create <projectName> --production-branch main`後、`wrangler pages deploy out --project-name <projectName>`。すでに存在する場合はエラーを無視して続行。
- LINE account登録：LINEトークンを一時SQLファイルに書き、`wrangler d1 execute --remote --file`で直接D1へ登録。temp SQLは都度削除する設計。
- 途中失敗：`.line-harness-setup.json`へ完了stepを保存し、同じコマンド再実行で再開。
- 再実行：完了済みstepはskip。Cloudflare accountが変わった場合はアカウント依存stepをリセットする導線あり。

### 安全上の注意

公式インストーラーは「既存同名D1/R2/Pagesを無断上書きしない」方向の処理がありますが、同名の場合に既存リソースを再利用して続行する箇所があります。大山版の初期リリース方針が「新規構築限定」であるなら、同名検出時は明示確認または停止に寄せる必要があります。

## update機能

### 公式updateの仕様

| 項目 | 確認結果 |
|---|---|
| 更新設定の保存場所 | `.line-harness-config.json` |
| manifest取得先 | 既定値は `https://github.com/Shudesu/line-harness-oss/releases/latest/download/release-manifest.json` |
| GitHub Releasesとの関係 | Release assetsの`release-manifest.json`、`release-entry.json`、`bundle.tar.gz`を使う |
| Worker更新 | bundle内Worker JSをCloudflare APIでput |
| Pages更新 | bundle内Admin/LIFFファイルをPages deploy |
| D1 migration | manifestの`migrations`をbundleから取り出してD1へ適用 |
| ハッシュ検証 | bundle内Worker/Admin/LIFFのhashをmanifest値と照合 |
| Fork検知 | 現在versionとworker/admin/liff hashがmanifestと一致しない場合fork扱い |
| API token | `CLOUDFLARE_API_TOKEN` env、またはconfigの`cfApiToken`を参照。ただしコメント上はconfig保存非推奨 |

### 改造版でそのまま使う問題

- 公式manifestを見に行くため、大山版から公式bundleへ更新される可能性がある。
- updateはD1 migration、Worker、Pagesを変更するため、初期リリース対象外の既存環境更新に該当する。
- fork検知はhash差分を検出して自動更新をスキップする可能性があるが、「誤って公式に戻らない」保証としては、初期版では入口を止める方が明確。
- `liffProject`など、setupが現在省略している/Worker統合扱いにしている項目とupdate側必須項目にずれが見える。legacy promptで補完する設計だが、第三者向け初期版では混乱要因になる。

### 初期版での扱い案

| 案 | 内容 | 長所 | 短所 |
|---|---|---|---|
| 削除 | `update`コマンドやupdate-engine依存を外す | 誤実行リスクが最小 | 将来復活時の差分が大きい |
| 無効化 | `update`を受け付けず終了する | 誤更新を止められる | ユーザーには「なぜあるのに動かないか」の説明が必要 |
| コマンドは残して案内だけ表示 | `update`実行時に「初期版では対象外」と表示して終了 | 将来拡張の導線を残し、初期版対象外と一致 | 実装上、公式manifest参照へ到達しない保証が必要 |

推奨案：初期版では「コマンドは残して案内だけ表示」。理由は、CLI利用者へ将来機能であることを説明でき、公式update誤実行を防ぎつつ、将来の第2段階で再利用しやすいためです。ただし、これは今回の調査上の推奨であり、決定事項ではありません。

## Fork関連資料

| 文書 | 要点 |
|---|---|
| `docs/FORK_CLOUDFLARE_WORKFLOW.md` | 公式はforkしたrepoを本番環境として育てる運用を推奨。`origin`を自fork、`upstream`を`Shudesu/line-harness-oss`にする流れを説明。 |
| `.github/workflows/update-from-upstream.yml` | forkでのみ動く想定。`upstream/main`をfetchし、`upstream/update-<timestamp>` branchを作り、forkの`main`へPRを作成。 |
| `docs/OSS-SYNC-CHARTER.md` | 公式側のPrivate→OSS同期憲章。外部PRはPrivateへ取り込み、PrivateからOSSへ同期する前提。リリース手順、秘密情報除外、npm publish方針が記載。 |
| `docs/CREATE_LINE_HARNESS_SANDBOX.md` | `create-line-harness`検証時にHOMEを隔離し、`~/.line-harness`やwrangler設定を汚さないsandbox runnerを説明。Cloudflare実リソースは隔離されない点も明記。 |
| `.github/workflows/release.yml` | tag pushでbuild/test/hash生成/bundle作成/manifest更新/draft GitHub Release作成。 |

## ライセンス

確認できた事実：

- READMEには「MIT License. 商用利用・改変・再配布自由。」と記載。
- `packages/create-line-harness/package.json`には `"license": "MIT"` と記載。
- GitHub repository APIの`license`は`null`。
- root `LICENSE` ファイルは存在しない。

整理：

| 項目 | 確認結果 |
|---|---|
| ライセンスの種類 | MITとREADME/packageに記載 |
| 改変の可否 | README上は可と記載 |
| 商用利用の可否 | README上は可と記載 |
| 再配布の可否 | README上は可と記載 |
| 著作権表示の維持 | root LICENSE本文が存在しないため、本文からは未確認 |
| ライセンス本文の同梱 | 現在のmainではroot LICENSEが存在しないため未達の可能性 |
| 元OSSのクレジット方法 | README末尾に `LINE Harness by @Shudesu` 表示あり |

注意：MIT Licenseとして第三者配布するには、通常はライセンス本文と著作権表示を同梱する必要があります。公式リポジトリにroot `LICENSE` がないため、改造版では公開前にライセンス本文、著作権表示、READMEクレジットの扱いを人が確認してください。法律上の最終判断は専門家確認が必要です。

## GitHub管理方式の比較

| 観点 | 案A：GitHub Fork | 案B：独立新規リポジトリ |
|---|---|---|
| 元OSSとの関係 | GitHub上でfork元が明示され分かりやすい | README等で明示しないと関係が見えにくい |
| upstream更新取り込み | 公式workflowやGitHubの比較機能と相性がよい | remote設定で可能だが運用を自前で設計する必要がある |
| 独自ブランド化 | GitHub上はfork表示が残る | ブランド・リポジトリ設計の自由度が高い |
| GitHub上の表示 | fork元表示、ネットワーク内扱い | 独立プロジェクトとして見える |
| npm連携 | どちらでも可能 | どちらでも可能 |
| 第三者配布 | fork元が見える安心感がある | 独自サービスとして見せやすい |
| Pull Request運用 | upstream取り込みPRを作りやすい | 上流追従PRの導線は自作 |
| 長期保守 | 上流追従しやすい | 独自変更が大きくなるほど自由度は高いが、上流同期の負担増 |
| ライセンス表示 | fork元の履歴が残りやすい | 意識してLICENSE/NOTICE/READMEを整える必要がある |
| 元リポジトリ削除/非公開時 | forkは独立コピーとして残る可能性があるが、GitHub上のfork関係は影響を受ける可能性あり | 独立repoとして残る |
| GitHub Fork特有の制約 | 同一ownerに同じ親のforkを複数作れない等の制約があり得る。完全独立ブランドにはやや不向き | fork機能の制約は受けない |

今回の目的に対する推奨：案AのGitHub Fork方式を推奨します。理由は、計画書の「元OSSの更新を取り込みやすくする」「初期は構造を大きく変えない」と一致し、公式側にもfork運用文書と`update-from-upstream.yml`が存在するためです。ただし、正式サービス名やnpmパッケージ名の独自化が強い場合は、Fork後にREADMEとpackage metadataを明確に改造版へ寄せる必要があります。

この推奨は決定事項ではありません。

## 基準バージョン候補

| 候補 | 安定性 | インストーラー完成度 | 配布適性 | 不具合リスク | 保守性 | 分かりやすさ |
|---|---|---|---|---|---|---|
| 最新正式リリース `v0.15.0` | 正式リリース済みで高い | setup/updateあり | タグ基準で説明しやすい | `main`の4修正を含まない | タグから上流同期しやすい | 高い |
| 一つ前 `v0.14.1` | 正式リリース済み | setup/updateあり | `v0.15.0`より古い | 最新修正を多く含まない | 追従差分が増える | 高い |
| 現在の`main` `1c4adffc...` | 未リリースのため中程度 | setup/updateあり | fork/CI/security補強を含む | 未リリース変更のため検証が必要 | 上流最新に近い | コミット固定の説明が必要 |
| 特定コミット | 必要に応じて選択 | 選ぶコミット次第 | 説明が複雑 | 選定理由が必要 | 管理負担あり | 低〜中 |

## 推奨案

推奨する基準タグまたはコミット：`v0.15.0`（コミット `1515a74cbe2f7154fdb09ad2f370e743ed8421a6`）

推奨理由：

- 最新正式リリースであり、GitHub Release、release-manifest、bundleが揃っている。
- root versionが`0.15.0`で、リリース基準として第三者に説明しやすい。
- 改造版の初期調査・差分管理では、タグを基点にすると「公式から何を変えたか」を追いやすい。
- `main`の4コミットは有用だが未リリースのため、基準に混ぜる場合は別途ユーザー承認を得て「取り込み対象」として扱う方が安全。

採用時の注意点：

- `main`の4コミットには、fork運用・CI・redirect安全性に関係する重要そうな修正が含まれるため、ソース取得後に取り込み要否を判断する。
- READMEの「現バージョン: v0.14.1」は、root package `0.15.0`とずれているため、改造版では修正候補。
- root `LICENSE`がないため、改造版ではMIT本文と元OSSクレジットを整備する必要がある。
- `packages/create-line-harness/package.json`は`0.1.25`だが、npm最新は`0.1.24`であり、公式CLIの公開状態とリポジトリ状態が一致していない。

別候補を選ぶ条件：

- fork利用者向けGitHub ActionsやAdmin CORS修正を最初から含めたい場合は、`main`の `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c` を基準候補にする。
- 公式Release assetと完全一致する状態を最優先する場合は、`v0.15.0`のまま開始する。
- `v0.15.0`で重大な不具合が見つかった場合は、`main`の4コミット取り込み、または次の正式リリース待ちを検討する。

## 未確認事項

- `v0.15.0` release assetの`bundle.tar.gz`内容は未展開。
- npm package tarball内容は未ダウンロード・未展開。
- `create-line-harness@0.1.24`とリポジトリ上`0.1.25`の実コード差分は未確認。
- Cloudflare実環境でのセットアップ動作は未確認。
- LINE Developers連携の実動作は未確認。
- 既存本番カスタマイズとの差分は、今回の禁止事項により未調査。
- root `LICENSE`が存在しないため、ライセンス本文・著作権表示の最終的な扱いは未確認。

---

## Fork後の基準ブランチ作成と未リリースコミット評価

調査日：2026-06-14

対象ローカルリポジトリ：

```text
/Users/mooyama/codex/LINE-Harness-oss-Custom
```

実施したGit操作：

- `git fetch --all --tags --prune` で `origin` / `upstream` とタグを最新化
- `1515a74cbe2f7154fdb09ad2f370e743ed8421a6` からローカルブランチ `custom/main` を作成

確認結果：

| 項目 | 確認結果 |
|---|---|
| 作成ブランチ | `custom/main` |
| ブランチ起点 | `1515a74cbe2f7154fdb09ad2f370e743ed8421a6` |
| 起点コミットの内容 | `chore: prepare 0.15.0 release (#156)` |
| `v0.15.0`の実体コミット | `1515a74cbe2f7154fdb09ad2f370e743ed8421a6` |
| 評価対象範囲 | `v0.15.0..upstream/main` |
| 評価対象コミット数 | 4 |

### `v0.15.0`以降の公式`main`コミット一覧

| 順序 | コミット | 日時 | 件名 |
|---|---|---|---|
| 1 | `a0a9c60849e5b25c030b6d40e514f5242721dac1` | 2026-06-07T14:31:00+09:00 | `fix: show admin build fingerprint (#157)` |
| 2 | `43cbee6f1c3b6f3f74f0b9f85853c39b1c2c6d01` | 2026-06-12T23:31:46+09:00 | `fix(ci): build @line-harness/update-engine before worker in deploy workflow (#164)` |
| 3 | `e2689ba3228cf3a8074b1edf6cf4f260502a70b3` | 2026-06-12T23:31:58+09:00 | `fix(liff): guard /auth/line redirect against dangerous schemes (#163)` |
| 4 | `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c` | 2026-06-12T23:47:55+09:00 | `feat(ci): bake admin CORS vars into deploy config so they survive redeploys (#165)` |

### 個別評価

| コミット | 変更目的 | 主な変更ファイル | 種別 | カスタマイズ版への必要性 | 取り込みリスク | 推奨 |
|---|---|---|---|---|---|---|
| `a0a9c60849e5b25c030b6d40e514f5242721dac1` | Admin画面にバージョンだけでなくビルドコミットSHAとビルド時刻を表示し、スクリーンショット等からデプロイ元を判別しやすくする。Admin deploy/release workflowでビルド時刻を渡す。 | `.github/workflows/deploy-cloudflare-admin.yml`, `.github/workflows/release.yml`, `apps/web/next.config.ts`, `apps/web/src/components/layout/sidebar.tsx`, `docs/OSS-SYNC-CHARTER.md` | 不具合修正寄りの運用改善 | 中。改造版では問い合わせ対応や配布版判別に有用。ただし初期インストーラーの安全性には直接関係しない。 | 低〜中。UI表示とNext.js build env追加が中心。ブランド名や表示文言を改造版用に変える作業と競合する可能性あり。 | 取り込み推奨。ただしUIブランド調整時にまとめて適用するのがよい。 |
| `43cbee6f1c3b6f3f74f0b9f85853c39b1c2c6d01` | Worker deploy workflowで、Worker build前に `@line-harness/update-engine` をbuildし、workspace依存解決失敗を防ぐ。 | `.github/workflows/deploy-cloudflare-worker.yml` | 不具合修正 | 高。Fork運用でGitHub Actions deployを使う場合、Worker build失敗を防ぐため重要。初期版でupdate自動実行を止める方針でも、Worker内の参照解決には影響し得る。 | 低。workflowのbuild対象追加のみ。初期版でGitHub Actions deployを無効化する場合でも副作用は小さい。 | 取り込み推奨。 |
| `e2689ba3228cf3a8074b1edf6cf4f260502a70b3` | LIFF/OAuth後の `redirect` パラメータを検証し、`javascript:`, `data:`, `vbscript:`, `file:`, protocol-relative URL、制御文字を拒否する。server側 `/auth/callback` とclient側 LIFF navigationの両方へ適用し、テストを追加する。 | `apps/worker/src/lib/safe-redirect.ts`, `apps/worker/src/lib/safe-redirect.test.ts`, `apps/worker/src/routes/liff.ts`, `apps/worker/src/client/main.ts` | セキュリティ不具合修正 | 高。第三者向け配布ではXSS/open redirect系のリスク低減が重要。LINE/LIFF導線に関係するため、改造版でも優先度が高い。 | 中。外部LPやdeep linkを許容するdenylist設計だが、既存の特殊なredirect値が拒否される可能性はある。追加テストあり。 | 取り込み推奨。優先度は最も高い。 |
| `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c` | Fork利用者のGitHub Actions deployで、Admin CORS関連varsをWorker deploy configへ埋め込み、redeployでCloudflare Dashboard手動設定が落ちてAdmin loginが壊れる問題を防ぐ。 | `.github/workflows/deploy-cloudflare-worker.yml`, `docs/ADMIN-AUTH.md` | 機能追加寄りの運用不具合対策 | 中〜高。初期版はnpxインストーラー中心だが、Fork運用やGitHub Actions deployを使う場合は重要。第三者向け運用資料にも関係する。 | 中。workflowに `jq` を使ったconfig patchが追加され、GitHub repo Variables運用が前提になる。初期版のインストーラー設計と重複・競合しないか確認が必要。 | 取り込み推奨。ただしGitHub Actions deploy方針とAdmin CORS設計確認後に適用する。 |

### 取り込み候補の整理

| 優先度 | コミット | 理由 |
|---|---|---|
| 高 | `e2689ba3228cf3a8074b1edf6cf4f260502a70b3` | LIFF redirectの安全性に関わるセキュリティ修正のため。 |
| 高 | `43cbee6f1c3b6f3f74f0b9f85853c39b1c2c6d01` | Fork側Worker deploy workflowのbuild失敗回避に関わるため。 |
| 中 | `1c4adffc8390e6b68ea0bba7aed3b566498a4e8c` | Fork運用時のAdmin CORS設定維持に有用。ただしインストーラー設計との整合確認が必要。 |
| 中 | `a0a9c60849e5b25c030b6d40e514f5242721dac1` | ビルド判別性向上に有用。ただしUIブランド調整と合わせて取り込む方がよい。 |

今回の評価では、4コミットすべてを「不要」ではなく取り込み候補と判断します。ただし、今回は未リリースコミットのcherry-pick・mergeは実施していません。
