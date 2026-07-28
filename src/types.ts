export type Language = 'id' | 'en';
export type ThemeMode = 'light' | 'dark';

export interface RepoStats {
  name: string;
  repoName: string;
  githubUrl: string;
  description: Record<Language, string>;
  stars: number;
  forks: number;
  openIssues: number;
  language: string;
  license: string;
  version: string;
  iconName: string;
  installCmd: string;
  updatedAt?: string;
}

export interface EcosystemAggregateStats {
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  totalContributors: number;
  lastUpdated: string;
  isLoading: boolean;
  isFallback: boolean;
}

export interface DocSection {
  id: string;
  title: Record<Language, string>;
  icon: string;
  items: DocItem[];
}

export interface DocItem {
  id: string;
  title: Record<Language, string>;
  summary: Record<Language, string>;
  category: string;
  badge?: string;
  content: Record<Language, DocPageContent>;
}

export interface DocPageContent {
  heading: string;
  subtitle: string;
  sections: {
    title: string;
    description?: string;
    codeSnippet?: {
      language: string;
      filename?: string;
      code: string;
    };
    callout?: {
      type: 'info' | 'warning' | 'tip' | 'sunda';
      title: string;
      message: string;
    };
    bullets?: string[];
  }[];
}

export interface SearchResult {
  id: string;
  docId: string;
  title: string;
  summary: string;
  category: string;
}
