import { EcosystemAggregateStats, Language, RepoStats } from '../types';
import { FALLBACK_AGGREGATE_STATS, REPOS_DATA, Contributor, CONTRIBUTORS_DATA } from '../data/githubData';

export function formatRelativeTime(isoString?: string, lang: Language = 'id'): string {
  if (!isoString) return lang === 'id' ? 'Baru saja diupdate' : 'Recently updated';
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 0) {
    return lang === 'id' ? 'Hari ini' : 'Today';
  }

  if (diffInSeconds < 60) {
    return lang === 'id' ? 'Baru saja' : 'Just now';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return lang === 'id' ? `${diffInMinutes} menit lalu` : `${diffInMinutes}m ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return lang === 'id' ? `${diffInHours} jam lalu` : `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return lang === 'id' ? `${diffInDays} hari lalu` : `${diffInDays}d ago`;
  }
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return lang === 'id' ? `${diffInMonths} bulan lalu` : `${diffInMonths}mo ago`;
  }
  return date.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export async function fetchGitHubStats(): Promise<{
  aggregate: EcosystemAggregateStats;
  repos: RepoStats[];
}> {
  try {
    // Attempt fetching each repository directly from GitHub REST API
    const repoPromises = REPOS_DATA.map(async (baseRepo) => {
      try {
        const res = await fetch(`https://api.github.com/repos/rancago/${baseRepo.repoName}`, {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          return {
            ...baseRepo,
            stars: typeof data.stargazers_count === 'number' ? data.stargazers_count : baseRepo.stars,
            forks: typeof data.forks_count === 'number' ? data.forks_count : baseRepo.forks,
            openIssues: typeof data.open_issues_count === 'number' ? data.open_issues_count : baseRepo.openIssues,
            language: data.language || baseRepo.language,
            updatedAt: data.pushed_at || data.updated_at || new Date().toISOString(),
          };
        }
      } catch (e) {
        console.warn(`Could not fetch stats for ${baseRepo.repoName}`, e);
      }
      return {
        ...baseRepo,
        updatedAt: baseRepo.updatedAt || new Date().toISOString(),
      };
    });

    const updatedRepos = await Promise.all(repoPromises);

    // Fetch real contributor count
    let realContributorCount = 1;
    try {
      const { contributors } = await fetchRealGitHubContributors();
      if (contributors.length > 0) {
        realContributorCount = contributors.length;
      }
    } catch (err) {
      console.warn('Could not fetch real contributors count:', err);
    }

    // Calculate aggregate numbers directly from GitHub API results
    const totalStars = updatedRepos.reduce((acc, repo) => acc + repo.stars, 0);
    const totalForks = updatedRepos.reduce((acc, repo) => acc + repo.forks, 0);

    const nowIso = new Date().toISOString();

    return {
      aggregate: {
        totalStars,
        totalForks,
        totalRepos: updatedRepos.length,
        totalContributors: realContributorCount,
        lastUpdated: nowIso,
        isLoading: false,
        isFallback: false,
      },
      repos: updatedRepos,
    };
  } catch (err) {
    console.error('Error fetching GitHub stats:', err);
    return {
      aggregate: { ...FALLBACK_AGGREGATE_STATS, lastUpdated: new Date().toISOString(), isFallback: true },
      repos: REPOS_DATA,
    };
  }
}

/**
 * Real-time fetch for contributors across Rancago GitHub repositories directly from GitHub REST API
 */
export async function fetchRealGitHubContributors(): Promise<{
  contributors: Contributor[];
  isRealData: boolean;
}> {
  const contributorMap: Record<string, {
    username: string;
    avatarUrl: string;
    contributions: number;
    repos: Set<string>;
    githubUrl: string;
  }> = {};

  let foundRealData = false;

  try {
    // Fetch contributors from all official Rancago repos in parallel
    const fetches = REPOS_DATA.map(async (repo) => {
      try {
        const res = await fetch(`https://api.github.com/repos/rancago/${repo.repoName}/contributors?per_page=30`, {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            foundRealData = true;
            data.forEach((item: any) => {
              // Ignore bot accounts
              if (item.type === 'Bot' || item.login?.includes('[bot]')) return;

              const username = item.login;
              if (!contributorMap[username]) {
                contributorMap[username] = {
                  username,
                  avatarUrl: item.avatar_url || `https://github.com/${username}.png`,
                  contributions: 0,
                  repos: new Set<string>(),
                  githubUrl: item.html_url || `https://github.com/${username}`,
                };
              }
              contributorMap[username].contributions += item.contributions || 1;
              contributorMap[username].repos.add(repo.repoName);
            });
          }
        }
      } catch (err) {
        console.warn(`Error fetching real contributors for ${repo.repoName}:`, err);
      }
    });

    await Promise.all(fetches);

    // If no org repo returned contributors, try fetching org members
    if (!foundRealData) {
      try {
        const orgRes = await fetch(`https://api.github.com/orgs/rancago/members?per_page=30`, {
          headers: { Accept: 'application/vnd.github.v3+json' },
        });
        if (orgRes.ok) {
          const members = await orgRes.json();
          if (Array.isArray(members) && members.length > 0) {
            foundRealData = true;
            members.forEach((m: any) => {
              contributorMap[m.login] = {
                username: m.login,
                avatarUrl: m.avatar_url,
                contributions: 1,
                repos: new Set(['rancago']),
                githubUrl: m.html_url,
              };
            });
          }
        }
      } catch (err) {
        console.warn('Error fetching org members:', err);
      }
    }

    if (foundRealData && Object.keys(contributorMap).length > 0) {
      const sortedList: Contributor[] = Object.values(contributorMap)
        .sort((a, b) => b.contributions - a.contributions)
        .map((c) => ({
          name: c.username === 'Muhammad-Ikhwan-Fathulloh' ? 'Muhammad Ikhwan Fathulloh' : c.username,
          username: c.username,
          avatarUrl: c.avatarUrl,
          role: {
            id: c.username === 'Muhammad-Ikhwan-Fathulloh'
              ? `Pengembang Utama (${c.contributions} komit)`
              : `Kontributor Utama (${c.contributions} komit)`,
            en: c.username === 'Muhammad-Ikhwan-Fathulloh'
              ? `Lead Architect & Creator (${c.contributions} commits)`
              : `Core Contributor (${c.contributions} commits)`,
          },
          contributions: c.contributions,
          repos: Array.from(c.repos),
          githubUrl: c.githubUrl,
        }));

      return {
        contributors: sortedList,
        isRealData: true,
      };
    }
  } catch (error) {
    console.error('Failed to fetch real GitHub contributors:', error);
  }

  // If GitHub API returns rate limit or offline, return cached fallback data
  return {
    contributors: CONTRIBUTORS_DATA,
    isRealData: false,
  };
}


