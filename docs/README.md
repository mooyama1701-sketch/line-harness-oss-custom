# プロジェクトドキュメント

このディレクトリには、LINE Harness改造版プロジェクトを継続的に管理するための資料を保存します。

## ドキュメント一覧

| ファイル | 用途 |
|---|---|
| [PROJECT_STATUS.md](./PROJECT_STATUS.md) | 現在の進捗、次の作業、課題、リスクを管理する |
| [DECISIONS.md](./DECISIONS.md) | プロジェクトで決定した事項と、その理由を記録する |
| [INSTALLER_ARCHITECTURE.md](./INSTALLER_ARCHITECTURE.md) | 改造版インストーラーの構成と処理方針を管理する |
| [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) | npm公開や正式リリース前の確認項目を管理する |
| [UPSTREAM_ANALYSIS.md](./UPSTREAM_ANALYSIS.md) | 公式LINE Harnessのリリース、構成、インストーラー、管理方式の調査結果を管理する |
| [プロジェクト計画書.md](./プロジェクト計画書.md) | プロジェクト全体の目的、範囲、安全方針を管理する |

## 更新ルール

- 作業開始時に [PROJECT_STATUS.md](./PROJECT_STATUS.md) を確認する
- 作業完了時に進捗と次の作業を更新する
- 重要な方針を決定した場合は [DECISIONS.md](./DECISIONS.md) へ記録する
- インストーラー設計を変更した場合は [INSTALLER_ARCHITECTURE.md](./INSTALLER_ARCHITECTURE.md) を更新する
- 公開準備に関係する作業は [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) へ反映する
- 確認できていない事項を、完了済みまたは決定済みとして記録しない
