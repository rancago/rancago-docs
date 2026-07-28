import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  EcosystemAggregateStats,
  Language,
  RepoStats,
  ThemeMode,
} from './types';
import { DOCS_SECTIONS } from './data/docsContent';
import { REPOS_DATA, FALLBACK_AGGREGATE_STATS } from './data/githubData';
import { fetchGitHubStats } from './services/githubService';

import { Navbar, NavTab } from './components/Navbar';
import { Hero } from './components/Hero';
import { RepoGrid } from './components/RepoGrid';
import { Sidebar } from './components/Sidebar';
import { DocContent } from './components/DocContent';
import { InteractiveCliPlayground } from './components/InteractiveCliPlayground';
import { SearchModal } from './components/SearchModal';
import { ContributorsSection } from './components/ContributorsSection';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { Footer } from './components/Footer';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rancago_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });
  const [lang, setLang] = useState<Language>('id');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeDocId, setActiveDocId] = useState<string>('intro');
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const [aggregateStats, setAggregateStats] = useState<EcosystemAggregateStats>(
    FALLBACK_AGGREGATE_STATS
  );
  const [repos, setRepos] = useState<RepoStats[]>(REPOS_DATA);

  // Initialize Theme class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('rancago_theme', theme);
  }, [theme]);

  // Fetch real-time GitHub aggregate stats on mount
  useEffect(() => {
    async function loadStats() {
      const { aggregate, repos: fetchedRepos } = await fetchGitHubStats();
      setAggregateStats(aggregate);
      setRepos(fetchedRepos);
    }
    loadStats();
  }, []);

  // Global Keyboard Shortcuts ('T' for Theme Toggle, 'Cmd+K' / 'Ctrl+K' for Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // Cmd+K or Ctrl+K -> Search Modal
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
        return;
      }

      // 'T' or 't' -> Toggle Theme (when not typing in an input field)
      if (!isInput && !e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleChangeLang = (newLang: Language) => {
    setLang(newLang);
  };

  const handleSelectDoc = (docId: string) => {
    setActiveDocId(docId);
    setActiveTab('docs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPlayground = () => {
    setActiveTab('playground');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find active doc item across sections
  const allDocItems = DOCS_SECTIONS.flatMap((sec) => sec.items);
  const currentDocIndex = allDocItems.findIndex((item) => item.id === activeDocId);
  const currentDoc = allDocItems[currentDocIndex] || allDocItems[0];

  const prevDoc = currentDocIndex > 0 ? allDocItems[currentDocIndex - 1] : null;
  const nextDoc =
    currentDocIndex < allDocItems.length - 1 ? allDocItems[currentDocIndex + 1] : null;

  return (
    <div className="min-h-screen pt-16 md:pt-16 pb-6 md:pb-0 w-full max-w-full overflow-x-hidden bg-[#FAF7F2] dark:bg-[#0C0A09] text-[#2C2118] dark:text-[#F7F2EC] transition-colors duration-200 flex flex-col font-sans selection:bg-[#8B4513] selection:text-white">
      <Helmet>
        <html lang={lang} />
        <title>Rancago — Framework Go Enterprise & Clean Architecture Ecosystem</title>
        <meta
          name="description"
          content="Dokumentasi resmi ekosistem Rancago: Framework Go High-Performance, CLI Code Generator, Agnostic HTTP Drivers, dan Komunitas Q&A."
        />
        <meta name="keywords" content="Rancago, Go, Golang, Clean Architecture, Enterprise Framework, CLI, Microservices" />
        <meta property="og:site_name" content="Rancago Go Ecosystem" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Top Navigation Bar */}
      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        lang={lang}
        onChangeLang={handleChangeLang}
        onOpenSearch={() => setSearchModalOpen(true)}
        aggregateStats={aggregateStats}
        onSelectDoc={handleSelectDoc}
        currentDocId={activeDocId}
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Page Content Router (Focused per Tab) */}
      <div className="flex-1">
        {/* TAB 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="animate-fadeIn">
            <Hero
              aggregateStats={aggregateStats}
              repos={repos}
              lang={lang}
              onSelectDoc={handleSelectDoc}
              onOpenPlayground={handleOpenPlayground}
            />

            {/* Quick Navigation Cards Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold tracking-tight text-[#2C2118] dark:text-[#F7F2EC]">
                  {lang === 'id' ? 'Jelajahi Ekosistem Rancago' : 'Explore the Rancago Ecosystem'}
                </h2>
                <p className="text-sm text-[#736257] dark:text-[#99887B] mt-1 max-w-xl mx-auto">
                  {lang === 'id'
                    ? 'Pilih halaman berikut untuk mulai mempelajari arsitektur, mencoba terminal CLI, atau bergabung dalam diskusi komunitas.'
                    : 'Choose a page below to start learning the clean architecture, test CLI terminal, or join community Q&A.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => handleSelectDoc('intro')}
                  className="p-6 rounded-2xl bg-white dark:bg-[#14100E] border border-[#E2D2C3] dark:border-[#2C2018] hover:border-[#8C4A27] dark:hover:border-[#E58A3C] transition-all text-left group shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F5EBE1] dark:bg-[#251D18] flex items-center justify-center text-[#8C4A27] dark:text-[#E58A3C] mb-4 font-bold text-lg group-hover:scale-110 transition-transform">
                    📚
                  </div>
                  <h3 className="font-bold text-lg text-[#2C2118] dark:text-[#F7F2EC] group-hover:text-[#8C4A27] dark:group-hover:text-[#E58A3C] transition-colors">
                    {lang === 'id' ? 'Dokumentasi Lengkap' : 'Full Documentation'}
                  </h3>
                  <p className="text-xs text-[#736257] dark:text-[#99887B] mt-2 leading-relaxed">
                    {lang === 'id'
                      ? 'Panduan Clean Architecture, Inward Dependency, Agnostic HTTP Drivers, dan Resiliency Circuit Breaker.'
                      : 'Guides on Clean Architecture, Inward Dependency, Agnostic HTTP Drivers, and Resiliency Circuit Breakers.'}
                  </p>
                  <div className="mt-4 text-xs font-bold text-[#8C4A27] dark:text-[#E58A3C] flex items-center gap-1">
                    <span>{lang === 'id' ? 'Buka Dokumentasi' : 'Open Docs'}</span> →
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('playground')}
                  className="p-6 rounded-2xl bg-white dark:bg-[#14100E] border border-[#E2D2C3] dark:border-[#2C2018] hover:border-[#8C4A27] dark:hover:border-[#E58A3C] transition-all text-left group shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F5EBE1] dark:bg-[#251D18] flex items-center justify-center text-[#8C4A27] dark:text-[#E58A3C] mb-4 font-bold text-lg group-hover:scale-110 transition-transform">
                    ⚡
                  </div>
                  <h3 className="font-bold text-lg text-[#2C2118] dark:text-[#F7F2EC] group-hover:text-[#8C4A27] dark:group-hover:text-[#E58A3C] transition-colors">
                    {lang === 'id' ? 'Interactive CLI Playground' : 'Interactive CLI Playground'}
                  </h3>
                  <p className="text-xs text-[#736257] dark:text-[#99887B] mt-2 leading-relaxed">
                    {lang === 'id'
                      ? 'Coba perintah `rancago-cli` secara interaktif di browser untuk generate modul, scaffold app, dan simulasi hot reload.'
                      : 'Interactively run `rancago-cli` commands in browser to generate modules, scaffold apps, and test hot reload.'}
                  </p>
                  <div className="mt-4 text-xs font-bold text-[#8C4A27] dark:text-[#E58A3C] flex items-center gap-1">
                    <span>{lang === 'id' ? 'Buka Terminal' : 'Open Terminal'}</span> →
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('repos')}
                  className="p-6 rounded-2xl bg-white dark:bg-[#14100E] border border-[#E2D2C3] dark:border-[#2C2018] hover:border-[#8C4A27] dark:hover:border-[#E58A3C] transition-all text-left group shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F5EBE1] dark:bg-[#251D18] flex items-center justify-center text-[#8C4A27] dark:text-[#E58A3C] mb-4 font-bold text-lg group-hover:scale-110 transition-transform">
                    📦
                  </div>
                  <h3 className="font-bold text-lg text-[#2C2118] dark:text-[#F7F2EC] group-hover:text-[#8C4A27] dark:group-hover:text-[#E58A3C] transition-colors">
                    {lang === 'id' ? '4 Repositori Resmi' : '4 Official Repositories'}
                  </h3>
                  <p className="text-xs text-[#736257] dark:text-[#99887B] mt-2 leading-relaxed">
                    {lang === 'id'
                      ? 'Statistik real-time, link GitHub, perintah install, dan versi rilis dari `rancago`, `cli`, `http`, dan `forums`.'
                      : 'Real-time stats, GitHub links, installation commands, and release tags for `rancago`, `cli`, `http`, and `forums`.'}
                  </p>
                  <div className="mt-4 text-xs font-bold text-[#8C4A27] dark:text-[#E58A3C] flex items-center gap-1">
                    <span>{lang === 'id' ? 'Lihat Repositori' : 'View Repos'}</span> →
                  </div>
                </button>
              </div>
            </section>

            {/* Contributors Section */}
            <ContributorsSection lang={lang} />
          </div>
        )}

        {/* TAB 2: DOCUMENTATION PAGE (FOCUSED VIEW) */}
        {activeTab === 'docs' && (
          <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <Sidebar
                sections={DOCS_SECTIONS}
                activeDocId={activeDocId}
                onSelectDoc={(id) => {
                  setActiveDocId(id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                lang={lang}
              />

              {/* Active Documentation Article Content */}
              <DocContent
                doc={currentDoc}
                lang={lang}
                onNavigateNext={nextDoc ? () => handleSelectDoc(nextDoc.id) : undefined}
                onNavigatePrev={prevDoc ? () => handleSelectDoc(prevDoc.id) : undefined}
                nextDocTitle={nextDoc ? nextDoc.title[lang] : undefined}
                prevDocTitle={prevDoc ? prevDoc.title[lang] : undefined}
              />
            </div>
          </main>
        )}

        {/* TAB 3: CLI PLAYGROUND PAGE (FOCUSED VIEW) */}
        {activeTab === 'playground' && (
          <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-6">
            <div className="bg-white dark:bg-[#14100E] border border-[#E2D2C3] dark:border-[#2C2018] rounded-2xl p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-[#2C2118] dark:text-[#F7F2EC]">
                {lang === 'id' ? '⚡ Terminal & Code Generator Playground' : '⚡ Terminal & Code Generator Playground'}
              </h1>
              <p className="text-sm text-[#736257] dark:text-[#99887B] mt-1">
                {lang === 'id'
                  ? 'Simulasi perintah `rancago-cli` secara interaktif di browser. Ketik perintah seperti `rancago new`, `rancago dev`, atau `rancago generate module`.'
                  : 'Interactively simulate `rancago-cli` commands inside your browser. Try commands like `rancago new`, `rancago dev`, or `rancago generate module`.'}
              </p>
            </div>

            <InteractiveCliPlayground lang={lang} />
          </main>
        )}

        {/* TAB 4: REPOSITORIES PAGE (FOCUSED VIEW) */}
        {activeTab === 'repos' && (
          <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-6">
            <div className="bg-white dark:bg-[#14100E] border border-[#E2D2C3] dark:border-[#2C2018] rounded-2xl p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-[#2C2118] dark:text-[#F7F2EC]">
                {lang === 'id' ? '📦 Repositori Resmi Ekosistem Rancago' : '📦 Official Rancago Ecosystem Repositories'}
              </h1>
              <p className="text-sm text-[#736257] dark:text-[#99887B] mt-1">
                {lang === 'id'
                  ? '4 repositori utama open-source yang membentuk fondasi ekosistem Rancago Framework Go.'
                  : '4 core open-source repositories powering the Rancago Go Framework ecosystem.'}
              </p>
            </div>

            <RepoGrid repos={repos} lang={lang} onSelectDoc={handleSelectDoc} />
            <ContributorsSection lang={lang} />
          </main>
        )}
      </div>

      {/* Command + K Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        sections={DOCS_SECTIONS}
        onSelectDoc={handleSelectDoc}
        lang={lang}
      />

      {/* Floating Scroll to Top Button */}
      <ScrollToTopButton label={lang === 'id' ? 'Atas' : 'Top'} />

      {/* Floating Keyboard Shortcut Helper Badge */}
      <div className="fixed bottom-4 left-4 z-40 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#181310]/90 backdrop-blur-md border border-[#E2D2C3] dark:border-[#332820] shadow-md text-[11px] text-[#6E5748] dark:text-[#A8988B] transition-all opacity-80 hover:opacity-100">
        <span className="font-mono font-bold text-[#8C4A27] dark:text-[#E58A3C]">Pintasan:</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-[#F5EBE1] dark:bg-[#251D18] border border-[#E2D2C3] dark:border-[#3A2D24] text-[10px] font-mono font-bold text-[#2C2118] dark:text-[#F7F2EC]">⌘K / Ctrl+K</kbd> {lang === 'id' ? 'Cari' : 'Search'}
        </span>
        <span className="text-[#D0C2B4] dark:text-[#3D3027]">•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-[#F5EBE1] dark:bg-[#251D18] border border-[#E2D2C3] dark:border-[#3A2D24] text-[10px] font-mono font-bold text-[#2C2118] dark:text-[#F7F2EC]">T</kbd> {lang === 'id' ? 'Ubah Tema' : 'Toggle Theme'}
        </span>
      </div>

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
}
