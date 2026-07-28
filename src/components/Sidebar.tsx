import React, { useState } from 'react';
import { ChevronRight, ChevronDown, BookOpen, Menu } from 'lucide-react';
import { DocSection, Language } from '../types';

interface SidebarProps {
  sections: DocSection[];
  activeDocId: string;
  onSelectDoc: (docId: string) => void;
  lang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeDocId,
  onSelectDoc,
  lang,
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  // Track open accordion categories (default all open)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'getting-started': true,
    'core-framework': true,
    'rancago-cli': true,
    'rancago-install': true,
    forums: true,
  });

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 p-4 sm:p-5 rounded-2xl border border-[#E2D2C3] dark:border-[#2A2019] bg-white dark:bg-[#120E0C] text-[#2C2118] dark:text-[#F7F2EC] shadow-xs min-w-0">
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden flex items-center justify-between pb-2 border-b border-[#E2D2C3] dark:border-[#2A2019] mb-3">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="flex items-center gap-2 text-xs font-bold text-[#8C4A27] dark:text-[#E58A3C]"
        >
          <BookOpen className="w-4 h-4" />
          <span>{lang === 'id' ? 'Daftar Topik Dokumentasi' : 'Documentation Topics'}</span>
        </button>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1 rounded bg-[#F5EBE1] dark:bg-[#251D18] text-[#8C4A27] dark:text-[#E58A3C] text-xs font-bold flex items-center gap-1 px-2"
        >
          <span>{mobileNavOpen ? (lang === 'id' ? 'Tutup' : 'Close') : (lang === 'id' ? 'Buka Menu' : 'Open')}</span>
          {mobileNavOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className={`space-y-6 lg:sticky lg:top-20 ${mobileNavOpen ? 'block' : 'hidden lg:block'}`}>
        {sections.map((section) => {
          const isOpen = openCategories[section.id] ?? true;

          return (
            <section key={section.id}>
              <button
                onClick={() => toggleCategory(section.id)}
                className="w-full flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8C572B] dark:text-[#C88A58] font-extrabold mb-3 hover:text-[#8C4A27] dark:hover:text-[#E58A3C] transition-colors"
              >
                <span>{section.title[lang]}</span>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-[#8A766A] dark:text-[#8C7C70]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-[#8A766A] dark:text-[#8C7C70]" />
                )}
              </button>

              {isOpen && (
                <ul className="space-y-1.5 text-xs">
                  {section.items.map((item) => {
                    const isActive = activeDocId === item.id;

                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            onSelectDoc(item.id);
                            setMobileNavOpen(false);
                          }}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all ${
                            isActive
                              ? 'bg-[#8C4A27] text-white dark:bg-[#E58A3C] dark:text-[#0C0A09] font-bold shadow-xs'
                              : 'text-[#6E5748] dark:text-[#A8988B] hover:text-[#2C2118] dark:hover:text-[#F7F2EC] hover:bg-[#F5EBE1] dark:hover:bg-[#1E1713] font-medium'
                          }`}
                        >
                          <span className="truncate pr-2">{item.title[lang]}</span>
                          {item.badge && (
                            <span
                              className={`text-[9px] px-1.5 py-0.5 font-mono rounded font-semibold ${
                                isActive
                                  ? 'bg-white/20 dark:bg-black/20 text-white dark:text-[#0C0A09]'
                                  : 'bg-[#F5EBE1] dark:bg-[#251D18] text-[#8C4A27] dark:text-[#E58A3C]'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </aside>
  );
};
