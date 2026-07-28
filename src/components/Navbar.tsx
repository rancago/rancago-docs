import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Search,
  Globe,
  Github,
  Star,
  Layers,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  BookOpen,
  Terminal,
  Home,
  FolderGit2,
} from 'lucide-react';
import { EcosystemAggregateStats, Language, ThemeMode } from '../types';
import { AksaraSundaBadge } from './SundanesePattern';
import { REPOS_DATA } from '../data/githubData';
import navJson from '../data/navigation.json';

export type NavTab = 'home' | 'docs' | 'playground' | 'repos';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  lang: Language;
  onChangeLang: (lang: Language) => void;
  onOpenSearch: () => void;
  aggregateStats: EcosystemAggregateStats;
  onSelectDoc: (docId: string) => void;
  currentDocId: string;
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  lang,
  onChangeLang,
  onOpenSearch,
  aggregateStats,
  currentTab,
  onSelectTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ecosystemDropdownOpen, setEcosystemDropdownOpen] = useState(false);

  const iconMap: Record<string, React.ReactNode> = {
    Home: <Home className="w-3.5 h-3.5" />,
    BookOpen: <BookOpen className="w-3.5 h-3.5" />,
    Terminal: <Terminal className="w-3.5 h-3.5" />,
    FolderGit2: <FolderGit2 className="w-3.5 h-3.5" />,
  };

  const navItems = navJson.navItems.map((item) => ({
    id: item.id as NavTab,
    label: item.label,
    icon: iconMap[item.icon] || <Home className="w-3.5 h-3.5" />,
  }));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[#E5D8CC] dark:border-[#2A2019] bg-[#FFFFFF]/95 dark:bg-[#0F0C0A]/95 text-[#2C2118] dark:text-[#F7F2EC] backdrop-blur-md transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Desktop Header Layout (>= md) */}
        <div className="hidden md:flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center space-x-3 text-left focus:outline-none group"
            >
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold tracking-tighter text-[#2C2118] dark:text-[#F7F2EC] group-hover:text-[#8C4A27] dark:group-hover:text-[#E58A3C] transition-colors">
                  {navJson.brand.name}
                </span>
                <span className="text-[10px] text-[#8C572B] dark:text-[#C88A58] font-mono tracking-widest font-semibold">
                  {navJson.brand.sundaneseScript}
                </span>
              </div>
            </button>

            <div className="h-6 w-px bg-[#E5D8CC] dark:bg-[#2A2019] hidden xl:block"></div>

            {/* Desktop Navigation Tabs */}
            <nav className="flex items-center space-x-1 ml-2">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#8C4A27] text-white dark:bg-[#E58A3C] dark:text-[#0C0A09] shadow-sm'
                        : 'text-[#6E5748] dark:text-[#A8988B] hover:text-[#2C2118] dark:hover:text-[#F7F2EC] hover:bg-[#F5EBE1] dark:hover:bg-[#1C1714]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label[lang]}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Ecosystem Stars Badge */}
            <a
              href="https://github.com/rancago"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center space-x-1 bg-[#F5EBE1] dark:bg-[#181310] px-2.5 py-1 rounded border border-[#E2D2C3] dark:border-[#332820] hover:border-[#8C4A27] dark:hover:border-[#E58A3C] transition-colors text-xs text-[#6E5748] dark:text-[#A8988B]"
            >
              <span className="text-[#B45309] dark:text-[#F59E0B]">★</span>
              <span className="font-mono font-bold text-[#2C2118] dark:text-[#F7F2EC]">
                {aggregateStats.totalStars.toLocaleString()}
              </span>
            </a>

            {/* Search Input */}
            <button
              onClick={onOpenSearch}
              className="flex items-center bg-[#F5EBE1] dark:bg-[#181310] border border-[#E2D2C3] dark:border-[#332820] rounded-md px-3 py-1.5 w-44 lg:w-56 text-[#6E5748] dark:text-[#A8988B] text-xs hover:border-[#8C4A27] dark:hover:border-[#E58A3C] transition-colors"
            >
              <Search className="w-3.5 h-3.5 mr-2 text-[#8A766A] dark:text-[#8C7C70]" />
              <span className="flex-1 text-left font-medium line-clamp-1">
                {lang === 'id' ? 'Cari dokumentasi...' : 'Search docs...'}
              </span>
              <span className="text-[10px] font-mono bg-[#E8DBD0] dark:bg-[#2A2019] px-1.5 py-0.5 rounded text-[#3B2D25] dark:text-[#D4C7BC] font-semibold">⌘K</span>
            </button>

            {/* Language Switcher Pills */}
            <div className="flex items-center space-x-1 border-l border-[#E5D8CC] dark:border-[#2A2019] pl-2 sm:pl-3">
              <button
                onClick={() => onChangeLang('id')}
                className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
                  lang === 'id'
                    ? 'bg-[#8C4A27] text-white dark:bg-[#E58A3C] dark:text-[#0C0A09]'
                    : 'text-[#736257] dark:text-[#8C7C70] hover:text-[#2C2118] dark:hover:text-[#F7F2EC]'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => onChangeLang('en')}
                className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
                  lang === 'en'
                    ? 'bg-[#8C4A27] text-white dark:bg-[#E58A3C] dark:text-[#0C0A09]'
                    : 'text-[#736257] dark:text-[#8C7C70] hover:text-[#2C2118] dark:hover:text-[#F7F2EC]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded border border-[#E2D2C3] dark:border-[#332820] bg-[#F5EBE1] dark:bg-[#181310] text-[#2C2118] dark:text-[#F7F2EC] hover:bg-[#EBDCD0] dark:hover:bg-[#251D18] transition-colors"
              title="Toggle theme (Tekan 'T')"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4 text-[#8C4A27]" />}
              <span className="text-[10px] font-mono bg-[#E8DBD0] dark:bg-[#2A2019] px-1 py-0.2 rounded text-[#3B2D25] dark:text-[#D4C7BC] font-semibold hidden sm:inline">T</span>
            </button>
          </div>
        </div>

        {/* Mobile Top Header Bar (< md) */}
        <div className="flex md:hidden items-center justify-between h-14">
          {/* Mobile Brand Logo */}
          <button
            onClick={() => {
              onSelectTab('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center space-x-2 text-left focus:outline-none"
          >
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold tracking-tighter text-[#2C2118] dark:text-[#F7F2EC]">
                {navJson.brand.name}
              </span>
              <span className="text-[9px] text-[#8C572B] dark:text-[#C88A58] font-mono tracking-widest font-semibold">
                {navJson.brand.sundaneseScript}
              </span>
            </div>
          </button>

          {/* Right Controls on Mobile Top Header */}
          <div className="flex items-center space-x-1.5">
            {/* Search Icon */}
            <button
              onClick={onOpenSearch}
              className="p-1.5 rounded-lg text-[#6E5748] dark:text-[#A8988B] hover:text-[#2C2118] dark:hover:text-[#F7F2EC] hover:bg-[#F5EBE1] dark:hover:bg-[#1C1714] transition-colors"
              title={lang === 'id' ? 'Cari' : 'Search'}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#F5EBE1] dark:bg-[#181310] border border-[#E2D2C3] dark:border-[#332820] p-0.5 rounded-md text-[11px] font-bold">
              <button
                onClick={() => onChangeLang('id')}
                className={`px-1.5 py-0.5 rounded ${
                  lang === 'id'
                    ? 'bg-[#8C4A27] text-white dark:bg-[#E58A3C] dark:text-[#0C0A09]'
                    : 'text-[#736257] dark:text-[#8C7C70]'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => onChangeLang('en')}
                className={`px-1.5 py-0.5 rounded ${
                  lang === 'en'
                    ? 'bg-[#8C4A27] text-white dark:bg-[#E58A3C] dark:text-[#0C0A09]'
                    : 'text-[#736257] dark:text-[#8C7C70]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg border border-[#E2D2C3] dark:border-[#332820] bg-[#F5EBE1] dark:bg-[#181310] text-[#2C2118] dark:text-[#F7F2EC] transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4 text-[#8C4A27]" />}
            </button>

            {/* Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg border border-[#E2D2C3] dark:border-[#332820] bg-[#8C4A27] dark:bg-[#E58A3C] text-white dark:text-[#0C0A09] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer (slide down from top navbar) */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 max-h-[80vh] overflow-y-auto border-b border-[#E5D8CC] dark:border-[#2A2019] bg-[#FAF7F2]/98 dark:bg-[#0F0C0A]/98 backdrop-blur-md px-4 py-4 space-y-4 shadow-2xl">
          <div className="text-[10px] font-mono font-bold text-[#8A766A] dark:text-[#8C7C70] uppercase tracking-widest">
            {lang === 'id' ? 'Navigasi Utama' : 'Main Navigation'}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#8C4A27] text-white dark:bg-[#E58A3C] dark:text-[#0C0A09] shadow-sm'
                      : 'bg-white dark:bg-[#181310] text-[#2C2118] dark:text-[#F7F2EC] border border-[#E2D2C3] dark:border-[#332820]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label[lang]}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[10px] font-mono font-bold text-[#8A766A] dark:text-[#8C7C70] uppercase tracking-widest pt-2">
            Ecosystem Repositories
          </div>
          <div className="grid grid-cols-1 gap-2">
            {REPOS_DATA.map((repo) => (
              <a
                key={repo.repoName}
                href={repo.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded border border-[#E2D2C3] dark:border-[#332820] text-xs font-medium text-[#2C2118] dark:text-[#F7F2EC] bg-white dark:bg-[#181310]"
              >
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-[#B45309] dark:text-[#E58A3C]" />
                  <span>{repo.name}</span>
                </div>
                <div className="flex items-center gap-1 text-[#B45309] dark:text-[#E58A3C] font-mono">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{repo.stars}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
