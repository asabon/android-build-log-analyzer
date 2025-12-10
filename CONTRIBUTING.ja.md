# 開発への参加 (Contributing)

## ローカルリポジトリから使用する場合

同じリポジトリ内またはローカルのチェックアウトから使用する場合:

```yaml
- name: Analyze Build Log
  uses: ./
  if: always() # ビルドが失敗しても実行するようにします
  with:
    log-file-path: 'path/to/your/build.log'
```

## 開発 (Development)

### 依存関係のインストール
```bash
npm install
```

### ビルド
```bash
npm run build
```

### テスト
```bash
npm test
```
