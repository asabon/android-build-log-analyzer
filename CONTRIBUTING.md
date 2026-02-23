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

> [!IMPORTANT]
> Since this project is a GitHub Action, the `dist/` directory contains the compiled code that is executed. **You must run `npm run build` and commit the changes in the `dist/` directory** whenever you modify the source code.

### Test
```bash
npm test
```
