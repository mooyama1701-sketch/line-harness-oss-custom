# 新規環境インストール試験計画

## 1. 目的

この文書は、改造版LINE Harnessの初期リリース前に、`npx @airestart/create-line-harness` を使った新規環境インストールを安全に確認するための試験計画です。

初期リリースでは、新規Cloudflare環境の構築だけを対象とします。既存環境の自動更新、既存D1からの移行、自動ロールバック、自動バックアップは対象外です。

## 2. 現在の状態

- 計画作成日：2026-06-17
- 状態：計画作成済み。公開前tarballによるsandbox最小試験とCloudflare read-only確認は実施済み。Cloudflare実作成試験、LINE試験、npm registry経由の正式package取得試験は未実施
- 対象CLI：`@airestart/create-line-harness`
- 対象bin：`create-line-harness-custom`
- 対象ソース：改造版repositoryの固定commit
- 認証前停止モード：`LINE_HARNESS_SETUP_STOP_BEFORE_CLOUDFLARE_AUTH=1`
- 実Cloudflare環境での同名リソース停止確認：未実施
- 実LINE環境でのWebhook/LIFF確認：未実施

## 3. 試験の基本方針

試験は、外部への影響が小さい順に進めます。

1. 外部接続・書き込みなしのローカル確認
2. 認証・読み取りのみの確認
3. Cloudflare/LINEへの作成・変更を伴う確認

各段階で問題が出た場合は、次の段階へ進まず、原因を整理します。CloudflareやLINEの本番環境は使わず、試験専用のアカウント、リソース名、LINE公式アカウントを使います。

## 4. 試験専用環境の準備物

### 必須

- Node.js、npm/npx、Git、pnpmまたはCorepack
- sandbox実行用ディレクトリ：`/private/tmp/line-harness-sandboxes/<name>`
- npm registryとGitHubから読み取れるネットワーク環境
- 試験専用Cloudflareアカウント、または本番と確実に分離したCloudflareアカウント
- R2 Object Storageを有効化できるCloudflare環境
- 試験用LINE公式アカウント
- 試験用Messaging API channel
- 試験用LINE Login channel
- 試験用LIFF app

### 推奨リソース名

本番リソースと衝突しないよう、次のような専用名を使います。

| 種類 | 推奨名 |
|---|---|
| Worker | `line-harness-custom-dev` |
| D1 | `line-harness-custom-dev` |
| R2 | `line-harness-custom-dev-images` |
| Pages | `line-harness-custom-dev-admin-<apiKey先頭8文字>` |

### 使ってはいけない本番リソース

| 種類 | 本番名 |
|---|---|
| Worker | `line-harness-production` |
| D1 | `line-harness` |
| Pages | `line-harness-production-admin` |

## 5. 区分1：外部接続・書き込みなし

この区分では、外部サービスへ接続せず、ローカルファイルと既存テストだけで確認します。

| 順序 | 試験 | 目的 | 前提条件 | 成功条件 | 外部影響 | 後片付け |
|---:|---|---|---|---|---|---|
| 1 | package metadata確認 | npm package名、bin名、公開対象ファイル、ライセンス同梱方針を確認する | repositoryがcheckout済み | `@airestart/create-line-harness`、`create-line-harness-custom`、`LICENSE`/`NOTICE`同梱方針を確認できる | なし | 不要 |
| 2 | update無効化テスト | 初期版で自動updateが動かないことを確認する | 依存関係が導入済み | `UPDATE_ENABLED=false`、update実行時に未対応案内で終了する | なし | 不要 |
| 3 | source pin単体テスト | 改造版repository URL、固定commit、origin検証、detached HEAD検証を確認する | 依存関係が導入済み | `source-repo.test.ts` が成功する | なし | 不要 |
| 4 | 衝突防止単体テスト | 同名Worker/D1/R2/Pages検出時に作成・deploy・migration前で停止することをmockで確認する | 依存関係が導入済み | `resource-collision.test.ts` が成功する | なし | 不要 |
| 5 | ローカル名分離テスト | 公式版の設定名やMCP登録を読込・上書きしないことを確認する | 依存関係が導入済み | `custom-name-isolation.test.ts` が成功する | なし | 不要 |
| 6 | インストーラーbuild | npm packageとして起動できる成果物を生成できるか確認する | 依存関係が導入済み | `pnpm --filter @airestart/create-line-harness build` が成功する | なし | 生成物の差分確認 |
| 7 | 本体品質確認 | Worker/Admin/LIFF/DBなどの基本品質を確認する | 依存関係が導入済み | 変更範囲に応じたtypecheck/test/buildが成功する | なし | 生成物の差分確認 |
| 8 | pnpm pack dry-run | npm公開対象ファイルに秘密情報や不要物が含まれず、workspace依存が通常versionへ変換されることを確認する | build済み | `dist`、`LICENSE`、`NOTICE`など必要なファイルだけが対象になり、`@line-harness/update-engine` が `^0.0.2` として収録される | なし | 不要 |

候補コマンド：

```bash
pnpm vitest run --config packages/create-line-harness/vitest.config.ts
pnpm test:scripts
pnpm --filter @airestart/create-line-harness build
pnpm --filter worker typecheck
pnpm --filter worker test
pnpm --filter worker build
NEXT_PUBLIC_API_URL=https://worker.example.test pnpm --filter web build
pnpm --filter web test
pnpm --filter liff build
pnpm --filter @line-crm/db test
pnpm --filter @line-crm/db typecheck
cd packages/create-line-harness
pnpm pack --dry-run
pnpm pack --pack-destination /private/tmp/line-harness-pack
```

注意：

- `npm pack` は `workspace:` 依存を通常versionへ変換しないため、検証用tarball作成には使用しない。
- pnpm 9.15.4では `pnpm --filter @airestart/create-line-harness pack ...` が `Unknown option: 'recursive'` で失敗するため、packageディレクトリへ移動して `pnpm pack` を実行する。
- tarball展開後の `package.json` で `@line-harness/update-engine` が `workspace:^0.0.2` ではなく `^0.0.2` になっていることを確認する。
- ローカルtarballからCLIを起動する場合は、`npx -p <tarball> create-line-harness-custom` を使用する。`npx <tarball>` はtarballを実行ファイルとして扱うため使用しない。

実施結果（2026-06-20）：

- `@airestart/create-line-harness@0.1.25` の `pnpm pack` 産tarballで確認した。
- tarball内の `@line-harness/update-engine` は `^0.0.2` で、`workspace:` 依存は残っていなかった。
- tarballには `dist/index.js`、`LICENSE`、`NOTICE`、`package.json` が含まれていた。

## 6. 区分2：認証・読み取りのみ

この区分では、npm、GitHub、Cloudflareへの接続や認証を使いますが、CloudflareやLINEのリソースは作成・変更しません。

| 順序 | 試験 | 目的 | 前提条件 | 成功条件 | 外部影響 | 後片付け |
|---:|---|---|---|---|---|---|
| 1 | npm package起動確認 | 公開済み、または検証対象のnpm packageからCLIが起動することを確認する | npm registryへ接続できる | CLIが起動し、想定外の旧package名へ流れない | npm読み取り | npm cacheのみ |
| 2 | sandbox内update無効化確認 | 外部更新処理に進まないことをpackage経由で確認する | sandboxを使用 | updateが未対応案内で終了し、manifest取得やCloudflare更新に進まない | npm読み取り | sandbox削除 |
| 3 | sandbox内clone確認 | `setup` 起動時に改造版repositoryをcloneし、固定commitへcheckoutすることを確認する | npm/GitHubへ接続できる。`LINE_HARNESS_SETUP_STOP_BEFORE_CLOUDFLARE_AUTH=1` を指定する | originが改造版repository、HEADが固定commit、detached HEAD。Cloudflare認証チェック前で正常停止する | npm/GitHub読み取り | sandbox削除 |
| 4 | 依存関係導入確認 | clone後に固定commitの依存関係を導入できるか確認する | sandbox内clone完了 | `pnpm install --frozen-lockfile` またはfallback installが完了する | npm/GitHub読み取り | sandbox削除 |
| 5 | Cloudflare認証確認 | 試験用CloudflareアカウントをCLIが認識できるか確認する | 試験用Cloudflareログイン | `npx wrangler whoami` で試験用accountが確認できる | Cloudflare読み取り | 必要ならlogout |
| 6 | Cloudflare同名確認 | 本番や既存リソースと衝突しないことをread-onlyで確認する | 試験用Cloudflareログイン、候補名決定 | Worker/Pages/D1/R2の一覧で候補名の有無を確認できる | Cloudflare読み取り | 不要 |

候補コマンド：

```bash
./scripts/run-create-line-harness-sandbox.sh --name install-min --reset -- npx -y @airestart/create-line-harness update
./scripts/run-create-line-harness-sandbox.sh --name install-min --reset -- env LINE_HARNESS_SETUP_STOP_BEFORE_CLOUDFLARE_AUTH=1 npx -y @airestart/create-line-harness
git -C /private/tmp/line-harness-sandboxes/install-min/home/.line-harness-custom remote get-url origin
git -C /private/tmp/line-harness-sandboxes/install-min/home/.line-harness-custom rev-parse --abbrev-ref HEAD
git -C /private/tmp/line-harness-sandboxes/install-min/home/.line-harness-custom rev-parse HEAD
git -C /private/tmp/line-harness-sandboxes/install-min/home/.line-harness-custom status --porcelain
npx wrangler whoami
npx wrangler versions list --name line-harness-custom-dev --json
npx wrangler pages project list --json
npx wrangler d1 list --json
npx wrangler r2 bucket list
```

公開前tarballでのsandbox最小試験コマンド：

```bash
./scripts/run-create-line-harness-sandbox.sh --name install-min-tarball --reset -- \
  env LINE_HARNESS_SETUP_STOP_BEFORE_CLOUDFLARE_AUTH=1 \
  npx -y -p /private/tmp/line-harness-pack/airestart-create-line-harness-0.1.25.tgz \
  create-line-harness-custom
```

実施結果（2026-06-20）：

- `pnpm pack` 産tarballからsetupを起動し、clone、固定commit checkout、依存導入、環境チェックに成功した。
- 固定commit `593781111c06837408eb33b3d0f25c72c747f6f0` のdetached HEADになっていることを確認した。
- Cloudflare認証前で終了コード `0` で停止した。
- Cloudflare認証、`wrangler login`、Cloudflareリソース確認・作成、LINE設定変更は実行していない。
- npm registry経由の正式package取得試験は未実施。

Cloudflare read-only確認結果（2026-06-20）：

- Wrangler `4.77.0` で確認した。
- OAuthでログイン済み。対象アカウントは `Mooyama1701@gmail.com's Account`。
- `account:read`、`user:read`、`workers:write`、`workers_scripts:write`、`workers_tail:read`、`d1:write`、`pages:write` などの権限を確認した。write系権限も含まれるが、実行した操作は一覧・存在確認のみ。
- 試験用Worker候補 `line-harness-custom-dev` は未使用。
- 試験用Pages候補 `line-harness-custom-dev-admin` と prefix `line-harness-custom-dev-admin-` は未使用。
- 試験用D1候補 `line-harness-custom-dev` は未使用。
- 試験用R2候補 `line-harness-custom-dev-images` は未使用。
- 本番Worker `line-harness-production` と本番D1 `line-harness` は同一Cloudflareアカウント上に存在する。
- 本番Pages `line-harness-production-admin` は今回のPages一覧では確認できなかった。理由は未確認。
- Cloudflareリソースの作成、変更、削除、deploy、migration、secret登録は実施していない。
- 実作成試験へ進む前に、使用Cloudflareアカウントと試験用リソース名を確定し、本番Worker `line-harness-production` と本番D1 `line-harness` を使わないことを再確認する。

## 7. 区分3：Cloudflare/LINEへの作成・変更あり

この区分は、実際にCloudflareやLINEへ作成・変更を行います。本番環境では実施しません。

| 順序 | 試験 | 目的 | 前提条件 | 成功条件 | 外部影響 | 後片付け |
|---:|---|---|---|---|---|---|
| 1 | 新規フルセットアップ | 新規Worker/D1/R2/Pages/Secrets/D1初期データを作れるか確認する | 試験用Cloudflare、試験用LINE、専用project名 | 完了画面にWorker URL、Admin URL、Webhook URL、LIFF URLが表示される | Cloudflare作成、D1書き込み、LINE情報登録 | 作成リソース削除 |
| 2 | 同名衝突の実環境確認 | 既存リソースを無断で上書きしないことを実Cloudflareで確認する | 専用dummyリソースを作成済み | setupが作成・更新・deploy・migration前に停止する | dummy作成あり | dummy削除 |
| 3 | 途中失敗後の再実行確認 | state保存とresumeが安全に動くことを確認する | 専用環境、意図的な中断点 | 同じコマンドで続きから再開でき、wrangler.tomlが復元される | 作成途中リソースあり | 作成リソース削除 |
| 4 | 管理画面ログイン確認 | Admin Pages、Worker CORS、cookie認証が動くことを確認する | フルセットアップ済み | API keyでログインでき、セッション確認が成功する | 作成済み環境へのアクセス | 作成リソース削除 |
| 5 | LINE Webhook確認 | Webhook URLでLINEイベントを受信できることを確認する | 試験用LINE公式アカウント | Webhook検証、友だち追加、メッセージ受信が確認できる | LINE設定変更あり | Webhook設定を戻す |
| 6 | LIFF確認 | LIFF導線がWorker配信の画面へ到達することを確認する | 試験用LIFF app | LIFF endpoint更新後、LINE内で画面が開く | LINE LIFF設定変更あり | LIFF endpointを戻す |
| 7 | 削除・後片付け確認 | 試験で作成したものを残さないことを確認する | 作成リソース一覧がある | Worker/D1/R2/Pages、LINE設定の後片付けが完了する | Cloudflare/LINE変更あり | 完了後なし |

## 8. 最初に行うsandbox最小試験

最初の実作業は、外部への書き込みをしないsandbox最小試験にします。

### 目的

- npm packageからCLIが起動することを確認する
- `update` が無効化されていることを確認する
- `setup` が改造版repositoryをcloneすることを確認する
- 固定commit checkout、detached HEAD、origin、clean状態を確認する
- Cloudflare login、Cloudflare作成、LINE設定変更には進まない

### 手順

1. 作業前Git状態を確認します。

```bash
git status --short --branch
git rev-parse HEAD
```

2. sandboxでupdateを起動します。

```bash
./scripts/run-create-line-harness-sandbox.sh --name install-min --reset -- npx -y @airestart/create-line-harness update
```

成功条件：

- 初期リリースでは自動更新不可、という案内で終了する
- 公式manifest取得、Cloudflare更新、D1 migration、Worker/Pages更新へ進まない

3. sandboxでsetupを起動し、Cloudflare認証チェック前で止めます。

```bash
./scripts/run-create-line-harness-sandbox.sh --name install-min --reset -- env LINE_HARNESS_SETUP_STOP_BEFORE_CLOUDFLARE_AUTH=1 npx -y @airestart/create-line-harness
```

成功条件：

- npm packageからCLIが起動する
- `~/.line-harness-custom` 相当のsandbox内ディレクトリにcloneされる
- 依存関係導入まで完了する
- `検証用停止モードが有効です` と表示される
- Cloudflare認証チェック、`wrangler login`、CloudflareやLINEの作成・変更には進まない

4. sandbox内cloneを確認します。

```bash
git -C /private/tmp/line-harness-sandboxes/install-min/home/.line-harness-custom remote get-url origin
git -C /private/tmp/line-harness-sandboxes/install-min/home/.line-harness-custom rev-parse --abbrev-ref HEAD
git -C /private/tmp/line-harness-sandboxes/install-min/home/.line-harness-custom rev-parse HEAD
git -C /private/tmp/line-harness-sandboxes/install-min/home/.line-harness-custom status --porcelain
```

成功条件：

- originが `https://github.com/mooyama1701-sketch/line-harness-oss-custom.git`
- branch表示が `HEAD`
- HEADが `packages/create-line-harness/src/lib/source.ts` の固定commit
- 作業ツリーがclean

## 9. 後続課題として扱う不整合

今回の文書化では修正せず、後続課題として扱います。

- `CUSTOM_SOURCE_COMMIT` は暫定commitであり、初期リリース直前に最終リリースcommitへ更新する必要がある。
- setup CLIにdry-runは見つかっていないため、実作成前の安全確認はunit test、認証前停止モード付きsandbox、Cloudflare read-only確認で補う必要がある。
- `createDatabase()`、R2作成、Pages作成には既存リソースを続行扱いにする分岐が残っている。前段の衝突ガードで止める設計だが、実Cloudflareで順序確認が必要。
- `README.md` のNode.js条件は `22+`、package enginesとCLI checkは `>=20` で不一致がある。
- `README.md` はLIFFアプリの自動作成と説明しているが、現在のCLIはLIFF IDを入力する流れになっている。
- `README.md` の現バージョン表記がroot packageの `0.15.0` と一致していない。
- `docs/CREATE_LINE_HARNESS_SANDBOX.md` に古いローカルパスが残っている。
- `docs/INSTALLER_ARCHITECTURE.md` に実装状況が現在のP0/P1完了状態と合わない記述がある。

## 10. 完了判定

初期リリース前に、少なくとも以下を確認します。

- 外部接続・書き込みなしの試験が成功している。
- npm package起動と固定commit取得を認証前停止モード付きsandboxで確認している。
- Cloudflare read-onlyで本番名や既存名との衝突がないことを確認している。
- 試験専用Cloudflare/LINE環境で新規フルセットアップが成功している。
- 同名リソースがある場合に、作成・更新・deploy・migration前に停止することを実Cloudflare環境で確認している。
- 試験で作成したCloudflare/LINE設定の後片付けが完了している。
- 本番Worker、D1、Pages、LINE公式アカウントへ影響していない。
