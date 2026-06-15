# カスタム初期リリース方針

この資料は、改造版LINE Harnessの初期リリースに向けた設計方針を整理するものです。現在の進捗は `docs/PROJECT_STATUS.md`、上流との差分や検証履歴は `docs/UPSTREAM_ANALYSIS.md` を正とします。

## 初期リリース方針

- 自動update機能は無効にする。
- 公式manifestと公式release bundleは利用しない。
- インストール元は改造版repositoryの固定commitとする。
- 固定commitは初期リリース直前に最終更新する。
- Cloudflareの既存Worker、D1、R2、Pagesは再利用・上書きしない。
- 同名リソースが存在する場合は停止する。
- 公式版と改造版のローカル設定は将来分離する。
- package名とMCP名は改造版専用名へ将来分離する。
- 本番deployは実装・検証とは別タスクで行う。
- 実績、数値、URL、認証情報は推測や捏造をしない。

## 作業の優先順位

### P0

- update無効化
- 改造版ソースの固定参照
- Cloudflare同名リソース時の停止処理

### P1

- ローカル設定名の分離
- npm package名の分離
- MCP package・server名の分離
- 安全設計のテスト追加

### P2

- 改造版専用update方式
- npm packageへのテンプレート同梱方式

## 現在の状態

- update無効化は完了。
- 改造版ソースの固定参照は暫定commitで実装済み。
- 固定commitは初期リリース直前に最終更新が必要。
- Cloudflare同名リソース停止は実装済み。Worker、Pages project、D1 database、R2 bucketの同名検出時は、作成・更新・deploy・migration前にsetupを停止する。
- Cloudflare同名リソース停止は実Cloudflare環境ではなくmockで検証済み。
- package名、設定名、MCP名は未確定。
