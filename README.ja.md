[![unit-test](https://github.com/asabon/android-build-log-analyzer/actions/workflows/test.yml/badge.svg?branch=main&event=push)](https://github.com/asabon/android-build-log-analyzer/actions/workflows/test.yml)

# Android Build Log Analyzer

[English (英語)](./README.md)

この GitHub Action は、Android のビルドログを解析し、エラーや警告を検出してアノテーションとして表示します。
GitHub Actions の UI 上でビルドプロセスの問題を素早く特定できるように設計されています。

## 出力例 (Output Example)

このアクションが生成するレポートの例です。

```markdown
<!-- START_DEMO_REPORT -->
<!-- END_DEMO_REPORT -->
```

## 使用方法 (Usage)

ワークフロー内で、通常はログファイルを生成するビルドステップの後に、以下のステップを追加してください。


```yaml
- name: Analyze Build Log
  uses: asabon/android-build-log-analyzer@v0
  if: always() # ビルドが失敗しても実行するようにします
  with:
    log-file-path: 'path/to/your/build.log'
```



## 入力 (Inputs)

| 入力 | 説明 | 必須 | デフォルト |
| :--- | :--- | :--- | :--- |
| `log-file-path` | 解析対象の Android ビルドログファイルのパス。 | **はい** | なし |
| `report-path` | 解析レポート（Markdown 形式）を保存するパス。 | いいえ | なし |

## 動作 (Behavior)

このアクションは指定されたログファイルを行ごとに解析し、特定のキーワード（大文字小文字区別なし）を探します。

- **エラー検出 (Error Detection)**: `error` を含む行は **Error** アノテーションとして報告されます。エラーが1つでも見つかった場合、このアクションは失敗します。
- **警告検出 (Warning Detection)**: `warning` を含む行は **Warning** アノテーションとして報告されます。

## 開発への参加 (Contributing)

ビルド、テスト、ローカルでの使用方法などの詳細については、[CONTRIBUTING.ja.md](./CONTRIBUTING.ja.md) を参照してください。
