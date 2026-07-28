import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import {
  Copy,
  Check,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Code,
  Eye,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface MermaidDiagramProps {
  initialCode: string;
  filename?: string;
  title?: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  initialCode,
  filename = 'Architecture-Diagram.mmd',
  title = 'Visual Architecture Diagram',
}) => {
  const [code, setCode] = useState(initialCode);
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync initialCode if props change
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  // Render Mermaid SVG
  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      try {
        const isDark = document.documentElement.classList.contains('dark');

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
          theme: isDark ? 'dark' : 'neutral',
          themeVariables: isDark
            ? {
                darkMode: true,
                background: '#16110E',
                primaryColor: '#8C4A27',
                primaryTextColor: '#F7F2EC',
                primaryBorderColor: '#E58A3C',
                lineColor: '#E58A3C',
                secondaryColor: '#251D18',
                tertiaryColor: '#1E1713',
                nodeBorder: '#E58A3C',
                clusterBkg: '#1A1410',
                clusterBorder: '#332820',
                defaultLinkColor: '#E58A3C',
                titleColor: '#F7F2EC',
                edgeLabelBackground: '#251D18',
              }
            : {
                darkMode: false,
                background: '#FAF7F2',
                primaryColor: '#8C4A27',
                primaryTextColor: '#2C2118',
                primaryBorderColor: '#8C4A27',
                lineColor: '#8C4A27',
                secondaryColor: '#F5EBE1',
                tertiaryColor: '#FFFFFF',
                nodeBorder: '#8C4A27',
                clusterBkg: '#F5EBE1',
                clusterBorder: '#E2D2C3',
                defaultLinkColor: '#8C4A27',
                titleColor: '#2C2118',
                edgeLabelBackground: '#FFFFFF',
              },
        });

        const uniqueId = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, code.trim());

        if (isMounted) {
          setSvgContent(svg);
          setRenderError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Mermaid Render Error:', err);
          setRenderError(err?.message || 'Gagal merender diagram Mermaid');
        }
      }
    };

    renderChart();

    // Listen to theme changes on html element
    const observer = new MutationObserver(() => {
      renderChart();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, [code]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-[#E2D2C3] dark:border-[#2C2018] bg-white dark:bg-[#16110E] shadow-md overflow-hidden my-6 transition-all">
      {/* Card Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#F5EBE1]/80 dark:bg-[#1B140F] border-b border-[#E2D2C3] dark:border-[#2C2018] gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8C4A27] dark:text-[#E58A3C]" />
          <span className="text-xs sm:text-sm font-bold text-[#2C2118] dark:text-[#F7F2EC] font-mono">
            {filename}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[#8C4A27]/10 dark:bg-[#E58A3C]/20 text-[#8C4A27] dark:text-[#E58A3C]">
            Mermaid Live
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="flex items-center bg-[#E2D2C3]/60 dark:bg-[#251D18] p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeTab === 'visual'
                  ? 'bg-white dark:bg-[#16110E] text-[#8C4A27] dark:text-[#E58A3C] shadow-2xs font-bold'
                  : 'text-[#6E5748] dark:text-[#A8988B] hover:text-[#2C2118] dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visual</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeTab === 'code'
                  ? 'bg-white dark:bg-[#16110E] text-[#8C4A27] dark:text-[#E58A3C] shadow-2xs font-bold'
                  : 'text-[#6E5748] dark:text-[#A8988B] hover:text-[#2C2118] dark:hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Kode Source</span>
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#E2D2C3] dark:border-[#332820] bg-white dark:bg-[#181310] hover:border-[#8C4A27] dark:hover:border-[#E58A3C] text-xs font-medium text-[#3B2D25] dark:text-[#D4C7BC] transition-colors"
            title="Salin Kode Mermaid"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 text-[11px] font-bold">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Copy</span>
              </>
            )}
          </button>

          {svgContent && activeTab === 'visual' && (
            <button
              onClick={handleDownloadSVG}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#E2D2C3] dark:border-[#332820] bg-white dark:bg-[#181310] hover:border-[#8C4A27] dark:hover:border-[#E58A3C] text-xs font-medium text-[#3B2D25] dark:text-[#D4C7BC] transition-colors"
              title="Unduh Diagram SVG"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">SVG</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Container Content */}
      {activeTab === 'visual' ? (
        <div className="relative p-6 bg-[#FAF7F2] dark:bg-[#120E0C] min-h-[220px] flex flex-col items-center justify-center overflow-x-auto">
          {/* Zoom controls */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-[#1B140F]/90 backdrop-blur border border-[#E2D2C3] dark:border-[#2C2018] p-1 rounded-lg shadow-2xs z-10">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.15, 2))}
              className="p-1 hover:bg-[#F5EBE1] dark:hover:bg-[#251D18] rounded text-[#6E5748] dark:text-[#A8988B] transition-colors"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.5))}
              className="p-1 hover:bg-[#F5EBE1] dark:hover:bg-[#251D18] rounded text-[#6E5748] dark:text-[#A8988B] transition-colors"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1 hover:bg-[#F5EBE1] dark:hover:bg-[#251D18] rounded text-[#6E5748] dark:text-[#A8988B] transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {renderError ? (
            <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 flex items-start gap-3 my-2 text-xs w-full max-w-lg">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Error Rendering Diagram</div>
                <div className="mt-1 font-mono text-[11px] opacity-90">{renderError}</div>
                <div className="mt-2 text-[11px] text-rose-600 dark:text-rose-400">
                  Periksa tab &quot;Kode Source&quot; untuk mengedit sintaksis Mermaid.
                </div>
              </div>
            </div>
          ) : (
            <div
              ref={containerRef}
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
              className="transition-transform duration-200 ease-out w-full max-w-full overflow-x-auto flex justify-center py-2 [&>svg]:max-w-full [&>svg]:h-auto min-w-0"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          )}
        </div>
      ) : (
        /* Live Code Editor Mode */
        <div className="p-4 bg-[#17110D] text-[#F7F2EC] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-[#8A766A] text-[11px]">
            <span>Edit kode Mermaid di bawah ini untuk melihat perubahan secara langsung:</span>
            <span>Live Sync</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
            className="w-full p-3 rounded-lg bg-[#231A14] border border-[#3D2E24] text-[#F7F2EC] font-mono focus:outline-none focus:border-[#E58A3C] transition-colors resize-y leading-relaxed text-xs"
            placeholder="Ketik kode Mermaid..."
          />
        </div>
      )}
    </div>
  );
};
