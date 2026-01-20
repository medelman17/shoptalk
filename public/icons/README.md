# PWA Icons

This directory should contain the following icons for PWA functionality:

- `icon-192.png` - 192x192 standard icon
- `icon-512.png` - 512x512 standard icon
- `icon-maskable.png` - 512x512 maskable icon with safe zone padding

## Generating Icons

You can use a tool like [PWA Asset Generator](https://github.com/niccolomineo/pwa-asset-generator) or create icons manually:

```bash
# Install pwa-asset-generator
pnpm add -g pwa-asset-generator

# Generate from a source image (recommend 1024x1024 PNG)
pwa-asset-generator ./source-icon.png ./public/icons --icon-only
```

## Icon Guidelines

- Use the ShopTalk brand colors (dark background with accent)
- Include the app logo/symbol
- Maskable icons should have 20% safe zone padding
- Transparent background is acceptable for standard icons
