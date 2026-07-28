import React, { useState } from 'react';
import {
  Cpu,
  Terminal,
  Download,
  MessageSquare,
  Star,
  GitFork,
  ExternalLink,
  Copy,
  Check,
  Github,
  Code2,
  Clock,
} from 'lucide-react';
import { Language, RepoStats } from '../types';
import { formatRelativeTime } from '../services/githubService';

interface RepoGridProps {
  repos: RepoStats[];
  lang: Language;
  onSelectDoc: (docId: string) => void;
}

export const RepoGrid: React.FC<RepoGridProps> = ({ repos, lang, onSelectDoc }) => {
  const [copiedRepo, setCopiedRepo] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-[#8C4A27] dark:text-[#E58A3C]" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-[#B45309] dark:text-[#F59E0B]" />;
      case 'Download':
        return <Download className="w-5 h-5 text-[#9A4811] dark:text-[#D97706]" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-[#78350F] dark:text-[#C07D3E]" />;
      default:
        return <Code2 className="w-5 h-5 text-[#8A766A]" />;
    }
  };

  const getDocMapping = (repoName: string) => {
    switch (repoName) {
      case 'rancago':
        return 'http-adapters';
      case 'rancago-cli':
        return 'cli-commands';
      case 'rancago-install':
        return 'installation-script';
      case 'forums':
        return 'forums-overview';
      default:
        return 'intro';
    }
  };

  const handleCopy = (repoName: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedRepo(repoName);
    setTimeout(() => setCopiedRepo(null), 2000);
  };

  return (
    <section className="py-12 bg-[#FAF7F2] dark:bg-[#0C0A09] border-b border-[#E2D2C3] dark:border-[#2A2019]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#8C4A27] dark:text-[#E58A3C] font-mono mb-1">
              {lang === 'id' ? 'Ekosistem Modul Modular' : 'Modular Ecosystem Repositories'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C2118] dark:text-[#F7F2EC]">
              {lang === 'id' ? '4 Repositori Resmi Rancago' : '4 Official Rancago Repositories'}
            </h2>
          </div>
          <a
            href="https://github.com/rancago"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6E5748] dark:text-[#A8988B] hover:text-[#8C4A27] dark:hover:text-[#E58A3C] transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>{lang === 'id' ? 'Lihat Organisasi GitHub' : 'View GitHub Organization'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repos.map((repo) => (
            <div
              key={repo.repoName}
              className="group relative rounded-xl border border-[#E2D2C3] dark:border-[#2C2018] bg-white dark:bg-[#16110E] hover:border-[#8C4A27] dark:hover:border-[#E58A3C] transition-all duration-200 p-6 flex flex-col justify-between hover:shadow-md"
            >
              <div>
                {/* Header: Icon, Name, Version, Stars */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#F5EBE1] dark:bg-[#251D18] border border-[#E2D2C3] dark:border-[#332820] shadow-2xs">
                      {getIcon(repo.iconName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#2C2118] dark:text-[#F7F2EC] group-hover:text-[#8C4A27] dark:group-hover:text-[#E58A3C] transition-colors">
                        {repo.name}
                      </h3>
                      <span className="font-mono text-xs text-[#8A766A] dark:text-[#8C7C70]">
                        github.com/rancago/{repo.repoName}
                      </span>
                    </div>
                  </div>

                  {/* Version Pill */}
                  <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded bg-[#F5EBE1] dark:bg-[#251D18] text-[#8C4A27] dark:text-[#E58A3C] shrink-0 border border-[#E2D2C3] dark:border-[#332820]">
                    {repo.version}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#6E5748] dark:text-[#A8988B] leading-relaxed mb-4">
                  {repo.description[lang]}
                </p>

                {/* Command Copy Pill */}
                <div className="mb-4 flex items-center justify-between px-3 py-2 rounded-lg bg-[#231A14] text-[#F7F2EC] font-mono text-xs overflow-hidden border border-[#3D2E24]">
                  <span className="truncate pr-2 text-[#E58A3C] font-semibold">$ {repo.installCmd}</span>
                  <button
                    onClick={() => handleCopy(repo.repoName, repo.installCmd)}
                    className="p-1 rounded hover:bg-[#38281F] text-[#A8988B] hover:text-white transition-colors shrink-0"
                    title="Copy command"
                  >
                    {copiedRepo === repo.repoName ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Card Footer: Metadata & Links */}
              <div className="pt-4 border-t border-[#E2D2C3] dark:border-[#2C2018] flex flex-wrap items-center justify-between gap-2 text-xs text-[#8A766A] dark:text-[#8C7C70]">
                <div className="flex items-center gap-2.5 sm:gap-3 font-mono font-medium flex-wrap">
                  <div className="flex items-center gap-1 text-[#B45309] dark:text-[#F59E0B] font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{repo.stars}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#8A766A] dark:text-[#8C7C70]">
                    <GitFork className="w-3.5 h-3.5" />
                    <span>{repo.forks}</span>
                  </div>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#F5EBE1] dark:bg-[#251D18] text-[#6E4720] dark:text-[#D4C7BC] text-[10px] font-semibold">
                    {repo.language}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#8A766A] dark:text-[#8C7C70]">
                    <Clock className="w-3 h-3 text-[#8C4A27] dark:text-[#E58A3C]" />
                    <span>{formatRelativeTime(repo.updatedAt, lang)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectDoc(getDocMapping(repo.repoName))}
                    className="text-xs font-bold text-[#3B2D25] dark:text-[#D4C7BC] hover:text-[#8C4A27] dark:hover:text-[#E58A3C] transition-colors"
                  >
                    {lang === 'id' ? 'Dokumentasi' : 'Docs'}
                  </button>
                  <span className="text-[#D8C8B8] dark:text-[#382A20]">•</span>
                  <a
                    href={repo.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#8C4A27] dark:text-[#E58A3C] hover:underline"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
