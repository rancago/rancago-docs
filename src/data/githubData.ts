import { RepoStats } from '../types';
import githubJson from './githubData.json';

export interface Contributor {
  name: string;
  username: string;
  avatarUrl: string;
  role: Record<'id' | 'en', string>;
  contributions: number;
  repos: string[];
  githubUrl: string;
}

export const REPOS_DATA: RepoStats[] = githubJson.repos as RepoStats[];

export const CONTRIBUTORS_DATA: Contributor[] = githubJson.contributors as Contributor[];

export const FALLBACK_AGGREGATE_STATS = {
  ...githubJson.fallbackAggregateStats,
  lastUpdated: new Date().toISOString(),
  isLoading: false,
};
