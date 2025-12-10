# Contributing

## Using from Local Repository

If you're using this action from the same repository or a local checkout:

```yaml
- name: Analyze Build Log
  uses: ./
  if: always() # Run even if the build failed
  with:
    log-file-path: 'path/to/your/build.log'
```

## Development

### Install Dependencies
```bash
npm install
```

### Build
```bash
npm run build
```

### Test
```bash
npm test
```
