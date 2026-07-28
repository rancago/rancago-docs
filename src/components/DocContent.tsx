import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Copy,
  Check,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Info,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  List,
  Hash,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DocItem, Language } from '../types';
import { MermaidDiagram } from './MermaidDiagram';

interface DocContentProps {
  doc: DocItem;
  lang: Language;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  prevDocTitle?: string;
  nextDocTitle?: string;
}

export const DocContent: React.FC<DocContentProps> = ({
  doc,
  lang,
  onNavigateNext,
  onNavigatePrev,
  prevDocTitle,
  nextDocTitle,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const [tocExpanded, setTocExpanded] = useState<boolean>(true);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const content = doc.content[lang];
  const pageTitle = `${content.heading} | Rancago Docs`;
  const pageDescription = content.subtitle || doc.summary[lang];
  const pageKeywords = `Rancago, Go, Golang, Clean Architecture, ${doc.category}, ${doc.title[lang]}, Microservices`;

  // Scroll Progress Calculation
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [doc.id, lang]);

  useEffect(() => {
    setActiveSection('section-0');
    setTocExpanded(true);
  }, [doc.id, lang]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    content.sections.forEach((_, idx) => {
      const el = document.getElementById(`section-${idx}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [doc.id, lang, content.sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -95;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getCalloutStyles = (type: 'info' | 'warning' | 'tip' | 'sunda') => {
    switch (type) {
      case 'sunda':
        return {
          container:
            'bg-[#F5EBE1] dark:bg-[#251D18] border-[#E2D2C3] dark:border-[#332820] text-[#3B2D25] dark:text-[#D4C7BC]',
          icon: <Sparkles className="w-5 h-5 text-[#8C4A27] dark:text-[#E58A3C] shrink-0" />,
        };
      case 'warning':
        return {
          container:
            'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200',
          icon: <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />,
        };
      case 'tip':
        return {
          container:
            'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200',
          icon: <Lightbulb className="w-5 h-5 text-[#B45309] dark:text-[#F59E0B] shrink-0" />,
        };
      case 'info':
      default:
        return {
          container:
            'bg-[#F5EBE1]/60 dark:bg-[#1C1613] border-[#E2D2C3] dark:border-[#2C2018] text-[#3B2D25] dark:text-[#D4C7BC]',
          icon: <Info className="w-5 h-5 text-[#8C4A27] dark:text-[#E58A3C] shrink-0" />,
        };
    }
  };

  return (
    <div className="flex-1 flex gap-8 min-w-0">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Rancago Go Documentation" />
        <meta property="og:locale" content={lang === 'id' ? 'id_ID' : 'en_US'} />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>

      {/* Top Fixed Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#8C4A27] via-[#B45309] to-[#E58A3C] dark:from-[#E58A3C] dark:via-[#F59E0B] dark:to-[#E58A3C] transition-all duration-75 ease-out shadow-[0_0_8px_rgba(229,138,60,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="flex-1 py-6 min-w-0 w-full max-w-4xl space-y-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#8A766A] dark:text-[#8C7C70] font-medium">
          <span>Rancago Docs</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="capitalize">{doc.category.replace('-', ' ')}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#2C2118] dark:text-[#F7F2EC] font-bold truncate">
            {doc.title[lang]}
          </span>
        </div>

        {/* Main Title Header */}
        <div className="border-b border-[#E2D2C3] dark:border-[#2A2019] pb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C2118] dark:text-[#F7F2EC] tracking-tight">
              {content.heading}
            </h1>
            {doc.badge && (
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-[#F5EBE1] dark:bg-[#251D18] text-[#8C4A27] dark:text-[#E58A3C] border border-[#E2D2C3] dark:border-[#332820]">
                {doc.badge}
              </span>
            )}
          </div>
          <p className="text-base text-[#6E5748] dark:text-[#A8988B] font-normal">
            {content.subtitle}
          </p>
        </div>

        {/* Auto-generated Inline Table of Contents Card */}
        {content.sections && content.sections.length > 0 && (
          <div className="rounded-xl border border-[#E2D2C3] dark:border-[#2A2019] bg-[#F5EBE1]/40 dark:bg-[#16110E]/80 p-4 transition-all shadow-2xs">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setTocExpanded(!tocExpanded)}
                className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#8C4A27] dark:text-[#E58A3C] hover:opacity-80 transition-opacity"
              >
                <List className="w-4 h-4" />
                <span>{lang === 'id' ? 'Daftar Isi Halaman' : 'On This Page'}</span>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#E2D2C3] dark:bg-[#251D18] text-[#3B2D25] dark:text-[#D4C7BC] font-semibold">
                  {content.sections.length} {lang === 'id' ? 'Bagian' : 'Sections'}
                </span>
              </button>
              <button
                onClick={() => setTocExpanded(!tocExpanded)}
                className="p-1 rounded hover:bg-[#E2D2C3]/50 dark:hover:bg-[#251D18] text-[#8A766A] dark:text-[#8C7C70] transition-colors"
                title={tocExpanded ? 'Collapse Table of Contents' : 'Expand Table of Contents'}
              >
                {tocExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {tocExpanded && (
              <nav className="mt-3 pt-3 border-t border-[#E2D2C3] dark:border-[#2A2019]">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs">
                  {content.sections.map((section, idx) => {
                    const sectionId = `section-${idx}`;
                    const isActive = activeSection === sectionId;
                    return (
                      <li key={idx}>
                        <button
                          onClick={() => scrollToSection(sectionId)}
                          className={`w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all ${
                            isActive
                              ? 'bg-[#8C4A27] text-white dark:bg-[#E58A3C] dark:text-[#0C0A09] font-bold shadow-2xs'
                              : 'text-[#6E5748] dark:text-[#A8988B] hover:text-[#2C2118] dark:hover:text-[#F7F2EC] hover:bg-[#F5EBE1] dark:hover:bg-[#251D18] font-medium'
                          }`}
                        >
                          <Hash className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white dark:text-[#0C0A09]' : 'text-[#8C4A27] dark:text-[#E58A3C]'}`} />
                          <span className="truncate">{section.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-8">
          {content.sections.map((section, idx) => {
            const sectionId = `section-${idx}`;
            return (
              <div key={idx} className="space-y-4">
                <h2
                  id={sectionId}
                  className="text-xl font-bold text-[#2C2118] dark:text-[#F7F2EC] flex items-center gap-2 scroll-mt-24 group cursor-pointer"
                  onClick={() => scrollToSection(sectionId)}
                >
                  <span className="w-1.5 h-5 bg-[#8C4A27] dark:bg-[#E58A3C] rounded-full inline-block" />
                  <span>{section.title}</span>
                  <Hash className="w-4 h-4 text-[#8C4A27]/0 group-hover:text-[#8C4A27]/60 dark:group-hover:text-[#E58A3C]/60 transition-all ml-1" />
                </h2>

                {section.description && (
                  <p className="text-sm sm:text-base text-[#3B2D25] dark:text-[#D4C7BC] leading-relaxed">
                    {section.description}
                  </p>
                )}

                {/* Callout Box */}
                {section.callout && (
                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3 my-4 ${
                      getCalloutStyles(section.callout.type).container
                    }`}
                  >
                    {getCalloutStyles(section.callout.type).icon}
                    <div className="space-y-1">
                      <div className="font-bold text-sm">{section.callout.title}</div>
                      <div className="text-xs sm:text-sm leading-relaxed opacity-90">
                        {section.callout.message}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bullet Points */}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="space-y-2 pl-2">
                    {section.bullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="text-xs sm:text-sm text-[#3B2D25] dark:text-[#D4C7BC] flex items-start gap-2"
                      >
                        <span className="text-[#8C4A27] dark:text-[#E58A3C] font-bold shrink-0 mt-0.5">
                          •
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Code Snippet Box or Visual Mermaid Diagram */}
                {section.codeSnippet &&
                  (() => {
                    const snippet = section.codeSnippet;
                    const isMermaid =
                      snippet.language === 'mermaid' ||
                      ['graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram', 'erDiagram', 'gantt'].some(
                        (kw) => snippet.code.trim().startsWith(kw)
                      );

                    if (isMermaid) {
                      return (
                        <MermaidDiagram
                          initialCode={snippet.code}
                          filename={snippet.filename || 'Architecture-Diagram.mmd'}
                          title={section.title}
                        />
                      );
                    }

                    return (
                      <div className="rounded-xl border border-[#3D2E24] dark:border-[#2C2018] bg-[#231A14] text-[#F7F2EC] shadow-md overflow-hidden font-mono my-4">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#1B140F] border-b border-[#3D2E24] text-xs text-[#A8988B]">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-[#E58A3C]" />
                            <span className="text-[#F7F2EC] font-semibold">
                              {snippet.filename || 'Code Snippet'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase tracking-wider text-[#8A766A] font-bold">
                              {snippet.language}
                            </span>
                            <button
                              onClick={() => handleCopyCode(snippet.code, idx)}
                              className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#38281F] hover:bg-[#4A3629] text-[#D4C7BC] hover:text-white transition-colors"
                              title="Copy Code"
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-[11px] text-emerald-400 font-semibold">
                                    Copied
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span className="text-[11px]">Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="p-4 text-xs sm:text-sm overflow-x-auto leading-relaxed text-[#F7F2EC] bg-[#17110D] min-w-0">
                          <pre className="overflow-x-auto max-w-full">{snippet.code}</pre>
                        </div>
                      </div>
                    );
                  })()}
              </div>
            );
          })}
        </div>

        {/* Prev / Next Pagination Bar */}
        <div className="pt-8 border-t border-[#E2D2C3] dark:border-[#2A2019] flex items-center justify-between gap-4">
          {onNavigatePrev && prevDocTitle ? (
            <button
              onClick={onNavigatePrev}
              className="flex items-center gap-2 p-3 rounded-xl border border-[#E2D2C3] dark:border-[#2C2018] hover:border-[#8C4A27] dark:hover:border-[#E58A3C] text-left transition-all hover:bg-[#F5EBE1] dark:hover:bg-[#181310] group bg-white dark:bg-[#120E0C]"
            >
              <ArrowLeft className="w-4 h-4 text-[#8A766A] group-hover:text-[#2C2118] dark:group-hover:text-white" />
              <div>
                <div className="text-[10px] uppercase font-mono text-[#8A766A]">
                  {lang === 'id' ? 'Sebelumnya' : 'Previous'}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#2C2118] dark:text-[#F7F2EC] group-hover:text-[#8C4A27] dark:group-hover:text-[#E58A3C]">
                  {prevDocTitle}
                </div>
              </div>
            </button>
          ) : (
            <div />
          )}

          {onNavigateNext && nextDocTitle ? (
            <button
              onClick={onNavigateNext}
              className="flex items-center gap-2 p-3 rounded-xl border border-[#E2D2C3] dark:border-[#2C2018] hover:border-[#8C4A27] dark:hover:border-[#E58A3C] text-right transition-all hover:bg-[#F5EBE1] dark:hover:bg-[#181310] group ml-auto bg-white dark:bg-[#120E0C]"
            >
              <div>
                <div className="text-[10px] uppercase font-mono text-[#8A766A]">
                  {lang === 'id' ? 'Selanjutnya' : 'Next'}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#2C2118] dark:text-[#F7F2EC] group-hover:text-[#8C4A27] dark:group-hover:text-[#E58A3C]">
                  {nextDocTitle}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8A766A] group-hover:text-[#2C2118] dark:group-hover:text-white" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </article>

      {/* Sticky Right Table of Contents Widget for Large/XL Desktop Screens */}
      {content.sections && content.sections.length > 0 && (
        <aside className="hidden xl:block w-56 shrink-0 py-6">
          <div className="sticky top-24 p-4 rounded-xl border border-[#E2D2C3] dark:border-[#2A2019] bg-white dark:bg-[#120E0C] text-xs space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 font-mono text-[11px] font-extrabold uppercase tracking-wider text-[#8C4A27] dark:text-[#E58A3C]">
              <List className="w-3.5 h-3.5" />
              <span>{lang === 'id' ? 'Daftar Isi' : 'On This Page'}</span>
            </div>
            <nav>
              <ul className="space-y-1">
                {content.sections.map((section, idx) => {
                  const sectionId = `section-${idx}`;
                  const isActive = activeSection === sectionId;
                  return (
                    <li key={idx}>
                      <button
                        onClick={() => scrollToSection(sectionId)}
                        className={`w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all ${
                          isActive
                            ? 'bg-[#8C4A27] text-white dark:bg-[#E58A3C] dark:text-[#0C0A09] font-bold shadow-2xs'
                            : 'text-[#6E5748] dark:text-[#A8988B] hover:text-[#2C2118] dark:hover:text-[#F7F2EC] hover:bg-[#F5EBE1] dark:hover:bg-[#1E1713] font-medium'
                        }`}
                      >
                        <span className="text-[10px] font-mono opacity-70 shrink-0">
                          {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}.
                        </span>
                        <span className="truncate">{section.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>
      )}
    </div>
  );
};

