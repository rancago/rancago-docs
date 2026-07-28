import React, { useState, useEffect } from 'react';
import { Users, Github, ExternalLink, GitCommit, Heart, RefreshCw, CheckCircle2 } from 'lucide-react';
import { CONTRIBUTORS_DATA, Contributor } from '../data/githubData';
import { fetchRealGitHubContributors } from '../services/githubService';
import { Language } from '../types';

interface ContributorsSectionProps {
  lang: Language;
}

export const ContributorsSection: React.FC<ContributorsSectionProps> = ({ lang }) => {
  const [contributors, setContributors] = useState<Contributor[]>(CONTRIBUTORS_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRealData, setIsRealData] = useState<boolean>(false);

  const loadContributors = async () => {
    setLoading(true);
    try {
      const res = await fetchRealGitHubContributors();
      setContributors(res.contributors);
      setIsRealData(res.isRealData);
    } catch (e) {
      console.warn('Failed to load contributors:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContributors();
  }, []);

  return (
    <section className="py-10 bg-white dark:bg-[#120E0C] border-y border-[#E2D2C3] dark:border-[#2A2019]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C4A27] dark:text-[#E58A3C] font-mono mb-1">
              <Users className="w-4 h-4" />
              <span>{lang === 'id' ? 'Komunitas Open Source' : 'Open Source Community'}</span>
              
              {/* Realtime API status indicator */}
              <span className={`inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isRealData 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {isRealData ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />}
                <span>{isRealData ? (lang === 'id' ? 'Live GitHub API' : 'Live GitHub API') : (lang === 'id' ? 'Cached / Fallback' : 'Cached / Fallback')}</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C2118] dark:text-[#F7F2EC]">
              {lang === 'id' ? 'Kontributor Utama Rancago' : 'Key Rancago Contributors'}
            </h2>
            <p className="text-xs sm:text-sm text-[#736257] dark:text-[#99887B] mt-1 max-w-2xl">
              {lang === 'id'
                ? 'Data kontributor diambil secara real-time langsung dari GitHub API repositori resmi Rancago.'
                : 'Contributor data fetched in real-time directly from official Rancago GitHub repository APIs.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadContributors}
              disabled={loading}
              className="p-2 rounded-xl bg-[#F5EBE1] dark:bg-[#251D18] border border-[#E2D2C3] dark:border-[#332820] text-xs font-bold text-[#8C4A27] dark:text-[#E58A3C] hover:bg-[#EADBCE] dark:hover:bg-[#2F241E] transition-colors disabled:opacity-50"
              title={lang === 'id' ? 'Muat Ulang Data GitHub' : 'Refresh GitHub Data'}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <a
              href="https://github.com/rancago/rancago/graphs/contributors"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F5EBE1] dark:bg-[#251D18] border border-[#E2D2C3] dark:border-[#332820] text-xs font-bold text-[#8C4A27] dark:text-[#E58A3C] hover:bg-[#EADBCE] dark:hover:bg-[#2F241E] transition-colors shrink-0"
            >
              <Github className="w-4 h-4" />
              <span>{lang === 'id' ? 'Lihat Semua di GitHub' : 'View All on GitHub'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Contributors Grid or Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-[#E2D2C3] dark:border-[#2C2018] bg-[#FAF7F2] dark:bg-[#16110E] animate-pulse flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-zinc-300 dark:bg-zinc-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-300 dark:bg-zinc-800 rounded w-2/3" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-850 rounded w-1/2" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-850 rounded w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {contributors.map((contributor) => (
              <div
                key={contributor.username}
                className="p-5 rounded-2xl border border-[#E2D2C3] dark:border-[#2C2018] bg-[#FAF7F2] dark:bg-[#16110E] hover:border-[#8C4A27] dark:hover:border-[#E58A3C] transition-all flex items-start gap-4 group shadow-2xs hover:shadow-md"
              >
                <a
                  href={contributor.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative shrink-0"
                >
                  <img
                    src={contributor.avatarUrl}
                    alt={contributor.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#8C4A27] dark:border-[#E58A3C] transition-transform group-hover:scale-105"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#181310] text-[#E58A3C] rounded-full p-0.5 border border-[#332820]">
                    <Github className="w-3 h-3" />
                  </div>
                </a>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={contributor.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sm text-[#2C2118] dark:text-[#F7F2EC] truncate hover:text-[#8C4A27] dark:hover:text-[#E58A3C] transition-colors"
                    >
                      {contributor.name}
                    </a>
                  </div>

                  <p className="text-[11px] font-mono text-[#8C4A27] dark:text-[#E58A3C] font-semibold">
                    @{contributor.username}
                  </p>

                  <p className="text-xs text-[#736257] dark:text-[#99887B] mt-1 line-clamp-1">
                    {contributor.role[lang]}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono border-t border-[#E5D8CC] dark:border-[#2A2019] pt-2">
                    <span className="flex items-center gap-1 text-[#2C2118] dark:text-[#F7F2EC] font-bold">
                      <GitCommit className="w-3 h-3 text-[#8C4A27] dark:text-[#E58A3C]" />
                      {contributor.contributions} {contributor.contributions === 1 ? 'commit' : 'commits'}
                    </span>
                    <span className="text-[#8A766A] dark:text-[#8C7C70] truncate max-w-[120px]">
                      {contributor.repos.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call-to-action banner for new contributors */}
        <div className="p-6 rounded-2xl bg-[#231A14] dark:bg-[#181310] text-[#F7F2EC] flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#3D2E24] shadow-lg">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="p-3 rounded-full bg-[#3D2E24] text-[#E58A3C] shrink-0 hidden sm:block">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base">
                {lang === 'id' ? 'Tertarik Menjadi Kontributor Rancago?' : 'Interested in Contributing to Rancago?'}
              </h4>
              <p className="text-xs text-[#A8988B] mt-0.5">
                {lang === 'id'
                  ? 'Kami menyambut Pull Requests, perbaikan dokumentasi, bug fixes, dan pengajuan ide modul baru.'
                  : 'We welcome Pull Requests, docs improvements, bug fixes, and module ideas.'}
              </p>
            </div>
          </div>

          <a
            href="https://github.com/rancago/rancago/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#8C4A27] hover:bg-[#6E381C] text-white font-bold text-xs shrink-0 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>{lang === 'id' ? 'Panduan Kontribusi' : 'Contributing Guidelines'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

