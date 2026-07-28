import React from 'react';
import { Github, Star, ExternalLink, Heart } from 'lucide-react';
import { Language } from '../types';
import { AksaraSundaBadge } from './SundanesePattern';
import { REPOS_DATA } from '../data/githubData';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="border-t border-[#E2D2C3] dark:border-[#2A2019] bg-[#FAF7F2] dark:bg-[#0C0A09] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#E2D2C3] dark:border-[#2A2019]">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2C2118] dark:bg-[#E58A3C] text-[#FAF7F2] dark:text-[#0C0A09] flex items-center justify-center font-black text-lg shadow-2xs">
                R
              </div>
              <span className="font-extrabold text-xl text-[#2C2118] dark:text-[#F7F2EC]">
                Rancago Framework
              </span>
              <AksaraSundaBadge size="sm" />
            </div>

            <p className="text-xs sm:text-sm text-[#6E5748] dark:text-[#A8988B] max-w-md leading-relaxed">
              Resilient, Agnostic, & Native Clean-Architecture Go Framework.
              {lang === 'id'
                ? ' Dibangun dengan filosofi ketahanan, fleksibilitas tanpa vendor lock-in, dan kemudahan pengujian.'
                : ' Engineered for high resiliency, framework-agnostic adaptability, and seamless microservices.'}
            </p>

            <div className="pt-2 text-xs font-mono text-[#8C4A27] dark:text-[#E58A3C] font-bold italic">
              "Silih Asah, Silih Asih, Silih Asuh — ᮛᮔ᮪ᮎᮌ᮰"
            </div>
          </div>

          {/* Repositories Column */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#2C2118] dark:text-[#F7F2EC] font-mono mb-3">
              {lang === 'id' ? 'Repositori Resmi' : 'Official Repos'}
            </h4>
            <ul className="space-y-2 text-xs">
              {REPOS_DATA.map((repo) => (
                <li key={repo.repoName}>
                  <a
                    href={repo.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[#6E5748] dark:text-[#A8988B] hover:text-[#8C4A27] dark:hover:text-[#E58A3C] transition-colors font-medium"
                  >
                    <span>{repo.name}</span>
                    <ExternalLink className="w-3 h-3 text-[#8A766A]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community & Docs Column */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#2C2118] dark:text-[#F7F2EC] font-mono mb-3">
              {lang === 'id' ? 'Organisasi GitHub' : 'GitHub Organization'}
            </h4>
            <ul className="space-y-2 text-xs text-[#6E5748] dark:text-[#A8988B]">
              <li>
                <a
                  href="https://github.com/rancago"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[#8C4A27] dark:hover:text-[#E58A3C] transition-colors font-medium"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>github.com/rancago</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/rancago/forums"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[#8C4A27] dark:hover:text-[#E58A3C] transition-colors font-medium"
                >
                  <span>Community & Forum Discussions</span>
                </a>
              </li>
              <li className="text-[11px] text-[#8A766A] pt-2">
                License: Open Source (MIT)
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A766A] dark:text-[#8C7C70] gap-4 font-mono">
          <div>
            © {new Date().getFullYear()} Rancago Framework Organization.
            Released under MIT License.
          </div>
          <div className="flex items-center gap-1 font-semibold">
            <span>Made with Clean Go & Sundanese Cultural Elegance</span>
            <span className="text-[#8C4A27] dark:text-[#E58A3C] font-bold">ᮛᮔ᮪ᮎᮌ᮰</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
