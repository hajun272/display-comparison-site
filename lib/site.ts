function getRepoName() {
  const explicitRepo = process.env.GITHUB_PAGES_REPO?.trim();

  if (explicitRepo) {
    return explicitRepo;
  }

  const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];
  return repository ?? "";
}

export function getBasePath() {
  const repoName = getRepoName();
  const shouldPublishToPages =
    process.env.GITHUB_PAGES === "true" || process.env.GITHUB_ACTIONS === "true";

  if (!shouldPublishToPages || !repoName || repoName.endsWith(".github.io")) {
    return "";
  }

  return `/${repoName}`;
}

export function getSiteUrl() {
  const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (explicitSiteUrl) {
    return explicitSiteUrl.replace(/\/+$/, "");
  }

  const owner =
    process.env.GITHUB_REPOSITORY_OWNER?.trim() ??
    process.env.GITHUB_REPOSITORY?.split("/")[0] ??
    "";
  const repoName = getRepoName();

  if (owner && repoName) {
    if (repoName.endsWith(".github.io")) {
      return `https://${owner}.github.io`;
    }

    return `https://${owner}.github.io/${repoName}`;
  }

  return "https://example.github.io";
}
