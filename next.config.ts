import { fileURLToPath } from "node:url";
import path from "node:path";
import type { NextConfig } from "next";

function getRepoName() {
  const explicitRepo = process.env.GITHUB_PAGES_REPO?.trim();

  if (explicitRepo) {
    return explicitRepo;
  }

  const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];
  return repository ?? "";
}

function getBasePath() {
  const repoName = getRepoName();
  const shouldPublishToPages =
    process.env.GITHUB_PAGES === "true" || process.env.GITHUB_ACTIONS === "true";

  if (!shouldPublishToPages || !repoName || repoName.endsWith(".github.io")) {
    return "";
  }

  return `/${repoName}`;
}

const basePath = getBasePath();
const configDirectory = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath,
  assetPrefix: basePath || undefined,
  turbopack: {
    root: configDirectory
  }
};

export default nextConfig;
