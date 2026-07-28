import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Terminal, ChevronRight, CornerDownLeft } from 'lucide-react';
import { DocSection, Language } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: DocSection[];
  onSelectDoc: (docId: string) => void;
  lang: Language;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  sections,
  onSelectDoc,
  lang,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Flatten all searchable items
  const allDocItems = sections.flatMap((sec) => sec.items);

  const filteredItems = query.trim() === ''
    ? allDocItems.slice(0, 5)
    : allDocItems.filter((item) => {
        const titleMatch = item.title[lang].toLowerCase().includes(query.toLowerCase());
        const summaryMatch = item.summary[lang].toLowerCase().includes(query.toLowerCase());
        const catMatch = item.category.toLowerCase().includes(query.toLowerCase());
        return titleMatch || summaryMatch || catMatch;
      });

  // Helper function to highlight matching search term
  const highlightText = (text: string, searchQuery: string, isSelected: boolean) => {
    if (!searchQuery.trim()) return text;

    const escapedQuery = searchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.trim().toLowerCase() ? (
        <mark
          key={i}
          className={`px-0.5 rounded font-extrabold ${
            isSelected
              ? 'bg-amber-400 text-zinc-950 dark:bg-amber-400 dark:text-zinc-950'
              : 'bg-amber-200/90 text-amber-950 dark:bg-amber-900/80 dark:text-amber-100'
          }`}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search modal
          inputRef.current?.focus();
        }
      }

      if (e.key === 'Escape' && isOpen) {
        onClose();
      }

      if (isOpen && filteredItems.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const selected = filteredItems[selectedIndex];
          if (selected) {
            onSelectDoc(selected.id);
            onClose();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose, onSelectDoc]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800 gap-3 bg-zinc-50/50 dark:bg-zinc-900/50">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              lang === 'id'
                ? 'Cari fitur, adapter Fiber, Circuit Breaker, perintah CLI...'
                : 'Search features, Fiber adapters, Circuit Breakers, CLI commands...'
            }
            className="flex-1 bg-transparent text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="p-2 overflow-y-auto flex-1 divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500 font-medium">
              {lang === 'id'
                ? `Tidak ada hasil pencarian untuk "${query}"`
                : `No results found for "${query}"`}
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = selectedIndex === idx;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectDoc(item.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl flex items-start justify-between gap-3 transition-colors ${
                    isSelected
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="font-bold text-xs sm:text-sm">
                        {highlightText(item.title[lang], query, isSelected)}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                            isSelected
                              ? 'bg-amber-500 text-zinc-950'
                              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs line-clamp-1 ${
                        isSelected
                          ? 'text-zinc-300 dark:text-zinc-700'
                          : 'text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      {highlightText(item.summary[lang], query, isSelected)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 text-xs font-mono">
                    <span
                      className={`text-[10px] uppercase ${
                        isSelected
                          ? 'text-amber-400 dark:text-amber-600 font-bold'
                          : 'text-zinc-400'
                      }`}
                    >
                      {highlightText(item.category, query, isSelected)}
                    </span>
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint Bar */}
        <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>Rancago Engine Docs</span>
        </div>
      </div>
    </div>
  );
};
