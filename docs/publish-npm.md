# Publishing Guide

## NPM
```bash
# Update version
npm version patch|minor|major

# Build and publish
npm run build
npm publish --access public
```

## GitHub
```bash
# Push changes
git add .
git commit -m "feat: description"
git push origin main

# Push tags
git push --tags
```

Note: Ensure you're logged into npm (`npm login`) and GitHub before publishing.