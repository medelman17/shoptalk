const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// Let Metro know where to resolve packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Handle workspace packages
config.resolver.extraNodeModules = {
  '@shoptalk/shared': path.resolve(monorepoRoot, 'packages/shared'),
  '@shoptalk/db': path.resolve(monorepoRoot, 'packages/db'),
};

module.exports = config;
