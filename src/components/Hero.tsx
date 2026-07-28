import React, { useState } from 'react';
import { EcosystemAggregateStats, Language, RepoStats } from '../types';
import { SundanesePattern } from './SundanesePattern';
import { formatRelativeTime } from '../services/githubService';

interface HeroProps {
  aggregateStats: EcosystemAggregateStats;
  repos: RepoStats[];
  lang: Language;
  onSelectDoc: (docId: string) => void;
  onOpenPlayground: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  aggregateStats,
  repos,
  lang,
  onSelectDoc,
  onOpenPlayground,
}) => {
  const [activeTab, setActiveTab] = useState<'cli' | 'installer' | 'core'>('cli');
  const [copied, setCopied] = useState(false);

  const installCommands = {
    cli: 'go install github.com/rancago/rancago-cli@latest',
    installer: 'curl -sSL https://raw.githubusercontent.com/rancago/rancago-install/main/install.sh | bash',
    core: 'go get github.com/rancago/rancago@latest',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommands[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const coreRepo = repos.find((r) => r.repoName === 'rancago');
  const cliRepo = repos.find((r) => r.repoName === 'rancago-cli');
  const installRepo = repos.find((r) => r.repoName === 'rancago-install');
  const forumsRepo = repos.find((r) => r.repoName === 'forums');

  return (
    <section className="relative overflow-hidden py-12 md:py-16 border-b border-[#E2D2C3] dark:border-[#2A2019] bg-[#FAF7F2] dark:bg-[#0C0A09] text-[#2C2118] dark:text-[#F7F2EC]">
      {/* Background Pattern */}
      <SundanesePattern />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2C2118] dark:text-[#F7F2EC] flex flex-wrap items-baseline gap-2 sm:gap-3">
              <span>Rancago</span>
              <span className="text-[#8C572B] dark:text-[#C88A58] font-semibold font-mono text-xl sm:text-3xl lg:text-4xl">ᮛᮔ᮪ᮎᮍᮧ</span>
            </h1>
            <p className="text-base sm:text-xl text-[#6E5748] dark:text-[#A8988B] max-w-2xl leading-relaxed">
              {lang === 'id'
                ? 'Kerangka kerja Go yang tangguh, agnostic, dan native Clean-Architecture. Diciptakan untuk performa tinggi, dirancang untuk manusia.'
                : 'A Resilient, Agnostic, & Native Clean-Architecture framework for the Go ecosystem. Built for performance, designed for humans.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 max-w-full min-w-0">
              <div className="flex-1 min-w-0 bg-[#231A14] dark:bg-[#16110E] border border-[#3D2E24] dark:border-[#2C2018] rounded-lg flex items-center px-3 sm:px-4 py-3 font-mono text-xs sm:text-sm group overflow-x-auto shadow-inner">
                <span className="text-[#A88B73] dark:text-[#8A766A] mr-2 shrink-0 select-none">$</span>
                <span className="text-[#F7F2EC] flex-1 min-w-0 truncate font-mono">{installCommands[activeTab]}</span>
                <button
                  onClick={handleCopy}
                  className="ml-2 shrink-0 text-xs font-bold text-[#E58A3C] hover:text-white transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectDoc('intro')}
                  className="px-6 py-3 bg-[#8C4A27] hover:bg-[#733B1E] dark:bg-[#E58A3C] dark:hover:bg-[#D4792B] text-white dark:text-[#0C0A09] font-bold rounded-lg shadow-md transition-colors text-sm"
                >
                  {lang === 'id' ? 'Mulai Sekarang' : 'Get Started'}
                </button>
                <button
                  onClick={onOpenPlayground}
                  className="px-4 py-3 bg-[#F5EBE1] dark:bg-[#181310] text-[#2C2118] dark:text-[#F7F2EC] font-semibold border border-[#E2D2C3] dark:border-[#332820] rounded-lg hover:border-[#8C4A27] dark:hover:border-[#E58A3C] transition-colors text-sm"
                >
                  Terminal
                </button>
              </div>
            </div>
          </header>

          {/* Quick Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="p-6 rounded-xl bg-white/80 dark:bg-[#16110E]/70 border border-[#E2D2C3] dark:border-[#2C2018] hover:border-[#8C4A27] dark:hover:border-[#E58A3C] transition-all shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-[#2C2118] dark:text-[#F7F2EC]">rancago-core</h3>
                <span className="text-[10px] bg-[#F5EBE1] dark:bg-[#251D18] px-2 py-0.5 rounded text-[#8C4A27] dark:text-[#E58A3C] font-mono font-bold">
                  {coreRepo ? coreRepo.version : 'v2.4.0'}
                </span>
              </div>
              <p className="text-sm text-[#6E5748] dark:text-[#A8988B] mb-4">
                {lang === 'id'
                  ? 'Engine utama dengan pola Clean Architecture native dan ketahanan sistem terintegrasi.'
                  : 'The foundational engine with native clean-architecture patterns and resiliency built-in.'}
              </p>
              <div className="flex items-center text-[11px] text-[#8A766A] dark:text-[#8C7C70] space-x-4 font-mono font-medium">
                <span className="text-[#B45309] dark:text-[#F59E0B]">
                  ★ {(coreRepo ? coreRepo.stars : 1).toLocaleString()}
                </span>
                <span>{lang === 'id' ? 'Diupdate' : 'Updated'} {formatRelativeTime(coreRepo?.updatedAt, lang)}</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/80 dark:bg-[#16110E]/70 border border-[#E2D2C3] dark:border-[#2C2018] hover:border-[#8C4A27] dark:hover:border-[#E58A3C] transition-all shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-[#2C2118] dark:text-[#F7F2EC]">rancago-cli</h3>
                <span className="text-[10px] bg-[#F5EBE1] dark:bg-[#251D18] px-2 py-0.5 rounded text-[#8C4A27] dark:text-[#E58A3C] font-mono font-bold">
                  {cliRepo ? cliRepo.version : 'v2.1.0'}
                </span>
              </div>
              <p className="text-sm text-[#6E5748] dark:text-[#A8988B] mb-4">
                {lang === 'id'
                  ? 'Scaffold aplikasi mikroservis Go kelas enterprise dalam hitungan detik tanpa boilerplate.'
                  : 'Scaffold enterprise-grade applications in seconds with zero configuration boilerplate.'}
              </p>
              <div className="flex items-center text-[11px] text-[#8A766A] dark:text-[#8C7C70] space-x-4 font-mono font-medium">
                <span className="text-[#B45309] dark:text-[#F59E0B]">
                  ★ {(cliRepo ? cliRepo.stars : 1).toLocaleString()}
                </span>
                <span>{lang === 'id' ? 'Diupdate' : 'Updated'} {formatRelativeTime(cliRepo?.updatedAt, lang)}</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/80 dark:bg-[#16110E]/70 border border-[#E2D2C3] dark:border-[#2C2018] hover:border-[#8C4A27] dark:hover:border-[#E58A3C] transition-all shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-[#2C2118] dark:text-[#F7F2EC]">rancago-install</h3>
                <span className="text-[10px] bg-[#F5EBE1] dark:bg-[#251D18] px-2 py-0.5 rounded text-[#8C4A27] dark:text-[#E58A3C] font-mono font-bold">
                  {installRepo ? installRepo.version : 'v1.4.0'}
                </span>
              </div>
              <p className="text-sm text-[#6E5748] dark:text-[#A8988B] mb-4">
                {lang === 'id'
                  ? 'Skrip instalasi teroptimasi untuk Linux, macOS, dan Windows secara native.'
                  : 'Optimized installation scripts for any environment. Linux, macOS, and Windows native.'}
              </p>
              <div className="flex items-center text-[11px] text-[#8A766A] dark:text-[#8C7C70] space-x-4 font-mono font-medium">
                <span className="text-[#B45309] dark:text-[#F59E0B]">
                  ★ {(installRepo ? installRepo.stars : 1).toLocaleString()}
                </span>
                <span>{lang === 'id' ? 'Diupdate' : 'Updated'} {formatRelativeTime(installRepo?.updatedAt, lang)}</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/80 dark:bg-[#16110E]/70 border border-[#E2D2C3] dark:border-[#2C2018] hover:border-[#8C4A27] dark:hover:border-[#E58A3C] transition-all shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-[#2C2118] dark:text-[#F7F2EC]">rancago/forums</h3>
                <span className="text-[10px] bg-[#F5EBE1] dark:bg-[#251D18] px-2 py-0.5 rounded text-[#8C4A27] dark:text-[#E58A3C] font-mono font-bold">
                  Q&A Hub
                </span>
              </div>
              <p className="text-sm text-[#6E5748] dark:text-[#A8988B] mb-4">
                {lang === 'id'
                  ? 'Repositori resmi forum tanya-jawab (Q&A), diskusi arsitektur, dan masukan komunitas Rancago.'
                  : 'Official community hub for technical Q&A, architecture discussions, and ecosystem feedback.'}
              </p>
              <div className="flex items-center text-[11px] text-[#8A766A] dark:text-[#8C7C70] space-x-4 font-mono font-medium">
                <span className="text-[#B45309] dark:text-[#F59E0B]">
                  ★ {(forumsRepo ? forumsRepo.stars : 0).toLocaleString()}
                </span>
                <span>{lang === 'id' ? 'Diupdate' : 'Updated'} {formatRelativeTime(forumsRepo?.updatedAt, lang)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
