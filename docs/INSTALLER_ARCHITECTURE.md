# 改造版インストーラー設計

## 1. この文書の目的

この文書は、LINE Harness改造版の第三者向けインストーラーについて、計画書で決定している方針、公式コードから確認できた現行仕様、現時点の設計案、今後確定する事項を分けて管理するためのものです。

公式リポジトリの公開情報とrawファイルをread-onlyで確認し、公式インストーラーの現行仕様を一部整理しました。ローカルへのソース取得、npmパッケージ展開、実行検証はまだ行っていません。

## 2. 現在のステータス

- 設計段階：公式インストーラー調査結果と決定済み方針を反映した初期設計整理
- 実装状況：未実装
- 公式コード調査：公開rawファイルで主要処理をread-only確認済み。ローカル実行は未実施。
- 基準ソース：公式 `v0.15.0`、基準コミット `1515a74cbe2f7154fdb09ad2f370e743ed8421a6`
- リポジトリ管理方式：GitHub Fork方式
- 最終更新日：2026-06-14

## 3. 全体構成

計画書上の方針では、初期段階はLINE Harness本体とインストーラーを一つのリポジトリで管理します。

公式リポジトリ調査結果を踏まえ、改造版の初期土台は公式 `v0.15.0`、基準コミット `1515a74cbe2f7154fdb09ad2f370e743ed8421a6` とします。GitHub管理方式はFork方式を採用します。

公式 `main` は `v0.15.0` より4コミット先行していますが、未リリース変更のため初期土台には含めません。ソース取得後に内容を個別評価し、必要なものだけ取り込みを検討します。

公式リポジトリでは、root `pnpm-workspace.yaml` により `apps/*` と `packages/*` がworkspace化されています。

確認できた主な構成は以下です。

```text
line-harness-oss
├── apps
│   ├── worker
│   ├── web
│   └── liff
├── packages
│   ├── create-line-harness
│   ├── db
│   ├── update-engine
│   ├── sdk
│   ├── mcp-server
│   ├── line-sdk
│   └── shared
├── docs
├── scripts
├── .github/workflows
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── README.md
```

root `LICENSE` は公式mainでは確認できませんでした。

改造版では、計画書上の方針に従い、初期段階では以下のような一体管理を想定します。

```text
line-harness-custom
├── apps
│   ├── worker
│   └── web
├── packages
│   ├── create-line-harness
│   ├── db
│   └── その他パッケージ
├── docs
├── LICENSE
└── README.md
```

公式ではmigrationはroot `migrations` ではなく `packages/db/migrations` にあります。改造版では公式構造を尊重するなら、`packages/db/migrations`を維持する方が差分管理しやすいです。

インストーラーは、第三者自身のPCから第三者自身のCloudflareアカウントへ接続し、新規リソースを作成する方針です。

## 4. 想定する利用者側の処理フロー

### 公式コードで確認できた現行フロー

1. `npx create-line-harness` 実行
2. `setup`が既定コマンドとして選択される
3. `--repo-dir`、cwd、`~/.line-harness` の順でリポジトリを探す
4. 見つからない場合、`https://github.com/Shudesu/line-harness-oss.git` を `~/.line-harness` へ `git clone --depth 1`
5. `pnpm install`を実行
6. Node.js `>=20` と `npx` を確認
7. `wrangler whoami`でCloudflare認証確認、未認証なら`wrangler login`
8. Cloudflare accountを選択
9. R2有効化を人に促す
10. プロジェクト名を入力
11. LINE Messaging API、LINE Login、LIFF IDを入力
12. API keyを生成
13. D1作成とschema/migration適用
14. R2 bucket作成
15. LINE bot basic ID取得を試行
16. Worker build/deploy
17. Worker Secrets登録
18. LINE account情報をD1へ直接登録
19. Admin Pages project作成/deploy
20. Admin cookie/CORS用Secrets登録
21. インストール済みWorker設定を生成して再deploy
22. 必要に応じてMCP config生成
23. Webhook URL、Callback URL、LIFF URL、管理画面URLを表示
24. `.line-harness-config.json` を保存

### 改造版の設計案

1. npxコマンド実行
2. 動作環境確認
3. Cloudflare認証
4. プロジェクト名入力
5. LINE関連情報入力
6. 既存リソース名の重複確認
7. 構築内容の最終確認
8. D1作成
9. R2作成
10. Workerデプロイ
11. Worker Secrets登録
12. D1マイグレーション
13. LINEアカウント情報登録
14. 初期管理者作成
15. Pages管理画面デプロイ
16. 完了結果表示

## 5. 構築対象リソース

| リソース | 用途 | 命名方針 | 重複時の方針 |
|---|---|---|---|
| Worker | LINE Webhook受信、API処理、バックエンド処理 | 公式では `projectName` | 改造版では既存同名Workerを無断で上書きしない。公式はdeploy時に同名Workerを更新し得るため要対策 |
| D1 | LINE Harness用データベース | 公式では `projectName` | 公式は`already exists`時に既存D1を取得して続行。改造版では停止または明示確認が必要 |
| R2 | 画像などのファイル保存 | 公式では `${projectName}-images` | 公式は`already exists`時に既存扱いで続行。改造版では停止または明示確認が必要 |
| Pages | 管理画面の公開 | 公式では `${projectName}-admin-${apiKey先頭8文字}` | 公式は既存project作成エラーを無視してdeployへ進む。改造版では重複時方針を明確化 |

## 6. 秘密情報の取り扱い

計画書で決定している方針は以下です。

- 第三者自身のPCから、第三者自身のCloudflareへ接続する
- Cloudflare認証情報、LINEチャネルアクセストークン、LINEチャネルシークレット、LINE LoginチャネルID、LIFF ID、管理画面用APIキーを大山管理サーバーへ送信しない
- 秘密情報はログに平文表示しない
- GitHub、npmパッケージ、README、テスト結果へ秘密情報を含めない

公式コード調査では、入力箇所、保存箇所、Secrets登録処理の主要部分を確認しました。ログ出力の網羅確認は未実施です。

公式コードで確認できたSecrets登録対象：

- `LINE_CHANNEL_ACCESS_TOKEN`
- `LINE_CHANNEL_SECRET`
- `LINE_LOGIN_CHANNEL_ID`
- `LIFF_URL`
- `API_KEY`
- `ADMIN_ORIGIN`
- `ADMIN_ALLOW_CROSS_SITE`
- `WORKER_URL`

公式コードでは`wrangler secret bulk`を使い、失敗時に`wrangler versions secret put`へfallbackします。LINE account登録時には一時SQLファイルに平文token/secretを書きますが、`tmpdir()`配下に`0o600`で作成し、実行後に削除する設計です。

## 7. 安全機能

初期リリースで必要な安全機能は以下です。

- 既存Worker名の重複確認
- 既存D1名の重複確認
- 既存R2名の重複確認
- 既存Pages名の重複確認
- 既存リソースの無断上書き禁止
- 実行前の構築内容確認
- 秘密情報のマスク
- 失敗時の原因表示
- 再実行方法の案内
- 作成済みリソースの明確な報告

公式コードで一部確認できた安全機能：

- セットアップstateを保存し、失敗後に再実行できる
- Cloudflare accountが変わった場合、アカウント依存stepをリセットできる
- D1 transient errorはリトライする
- Worker deploy時の一時`.env`はfinallyで削除する
- `wrangler.toml`を一時変更した場合、成功・失敗・SIGINT時に復元しようとする
- updateではbundle hash検証とfork検知がある

改造版で追加・変更が必要そうな安全機能：

- 同名D1/R2/Pages/Workerを既存扱いで続行しない
- 実行前に作成予定リソースを一覧表示し、明示確認を取る
- updateが公式manifestへ到達しないようにする
- 公式版の`~/.line-harness`や`.line-harness-config.json`と競合しない保存先にする
- README、CLIメッセージ、npm metadataを改造版用に変更する

## 8. ローカルに保存する情報

公式コードで確認できた保存先：

- 標準ソース保存先：`~/.line-harness`
- セットアップ再開state：`<repoDir>/.line-harness-setup.json`
- update用設定：`<repoDir>/.line-harness-config.json`
- update時のconfig探索順：`--repo-dir`、cwdの`.line-harness-config.json`、`~/.line-harness`

計画書上の改造版仮名称として、以下が示されています。

- ローカル保存先候補：`~/.line-harness-custom`
- 設定ファイル候補：`.line-harness-custom-config.json`

これらは正式決定ではありません。公式版との競合回避方針と、改造版の正式名称を確認してから確定します。

公式版との競合回避のため、改造版では保存先・設定ファイル・setup stateをすべて別名にする必要があります。

## 9. 初期リリース対象外

初期リリースでは以下を扱いません。

- 既存環境の自動更新
- 既存D1から新D1へのデータ移行
- 自動ロールバック
- 自動バックアップ
- 有料ライセンス認証
- テレメトリー
- SaaS化
- 大山管理サーバーへの秘密情報送信
- npxコマンドによるバージョンアップ

公式には`update`コマンドが存在しますが、初期リリースでは自動更新対象外です。改造版初期版では`update`による自動更新を実行させず、「初期版では未対応」と案内して終了する方針です。

実装時は、`update`実行時に以下へ到達しないことを確認します。

- 公式release manifestの取得
- D1 migration
- Worker更新
- Pages更新
- Cloudflare APIによる既存環境変更

## 10. 追加確認が必要な項目

- npm公開済み`create-line-harness@0.1.24`と、リポジトリ上`packages/create-line-harness@0.1.25`の差分
- release asset `bundle.tar.gz` の中身
- 実際にCLIを動かした場合の`--help`表示
- 実Cloudflare環境での同名リソース衝突時の挙動
- root `LICENSE` 不在への具体的な対応方法

## 11. 未決定事項

- 正式なnpmスコープ
- 正式なnpmパッケージ名
- 正式なbinコマンド名
- 正式なローカル保存先
- 正式な設定ファイル名
- 初期プロジェクト名
- 既存本番カスタマイズを引き継ぐか
- 公式`main`の未リリース4コミットを個別に取り込むか
- 正式なLICENSE本文、著作権表示、元OSSクレジット、または元開発者の許諾確認の具体的な進め方
