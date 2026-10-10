import React, { useState } from 'react';
import { generateStandaloneHtml } from '../utils/standaloneHtml.ts';
import { retroAudio } from '../utils/audio.ts';

interface SingleFileExportModalProps {
  onClose: () => void;
}

export const SingleFileExportModal: React.FC<SingleFileExportModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const standaloneCode = generateStandaloneHtml();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(standaloneCode);
      setCopied(true);
      retroAudio.playEquip();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = standaloneCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    retroAudio.playBlip(560);
    const blob = new Blob([standaloneCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'viet-phuc-pixel-art.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-[#141022] border-4 border-[#f8b800] shadow-[0_0_30px_rgba(248,184,0,0.4)] p-4 md:p-6 text-white flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#33264f]">
          <div className="flex items-center gap-2">
            <span className="text-xl">💾</span>
            <div>
              <h3 className="text-sm md:text-base font-bold text-[#f8b800]">
                MÃ NGUỒN ĐƠN TỆP (SINGLE-FILE HTML / CSS / JS)
              </h3>
              <p className="text-[11px] text-[#baaecd]">
                Toàn bộ mã nguồn đóng gói trong 01 file duy nhất, chạy ngay trên mọi trình duyệt
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              retroAudio.playBlip(300);
              onClose();
            }}
            className="w-8 h-8 flex items-center justify-center bg-[#851d28] hover:bg-[#b71c1c] border border-[#f8b800] text-white font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#1e1633] border border-[#3c2a61] mb-3">
          <div className="text-xs text-[#ffd54f]">
            ✨ Kích thước: ~25KB • Không phụ thuộc thư viện ngoài (Zero-dependency)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 text-xs font-bold border cursor-pointer transition-all ${
                copied
                  ? 'bg-[#00a86b] text-white border-white shadow-[0_0_10px_#00a86b]'
                  : 'bg-[#f8b800] hover:bg-[#ffc107] text-[#110e1a] border-[#ffd54f]'
              }`}
            >
              {copied ? '✓ ĐÃ SAO CHÉP MÃ NGUỒN!' : '📋 SAO CHÉP CODE (COPY)'}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-bold bg-[#c1272d] hover:bg-[#d32f2f] border border-[#ff8a80] text-white cursor-pointer"
            >
              ⬇ TẢI FILE (.HTML)
            </button>
          </div>
        </div>

        {/* Code display window */}
        <div className="flex-1 min-h-[300px] overflow-hidden border border-[#2b2144] relative bg-[#0a0713]">
          <pre className="p-3 text-[11px] font-mono text-[#e1d5f2] h-full overflow-auto select-text leading-relaxed">
            <code>{standaloneCode}</code>
          </pre>
        </div>

        {/* Instruction Footer */}
        <div className="mt-3 pt-2 border-t border-[#2a2044] text-[11px] text-[#9a8cb8] flex flex-wrap justify-between items-center gap-2">
          <span>
            💡 <strong>Cách dùng:</strong> Lưu thành file <code className="text-[#ffd54f]">index.html</code> và click đúp chuột để mở trực tiếp trong Chrome/Edge/Firefox/Safari.
          </span>
          <button
            onClick={() => {
              retroAudio.playBlip(300);
              onClose();
            }}
            className="text-xs text-[#f8b800] underline hover:text-white cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
