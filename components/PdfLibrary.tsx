import React, { useState } from 'react';
import { FileText, Download, Search, Filter, ExternalLink } from 'lucide-react';
import { PdfFile } from '../types';
import { db } from '../services/storage';

// Lista de Links REAIS para provas anteriores
// Nota: Sites militares frequentemente alteram a estrutura de links.
// Para garantir acesso, usamos links para os repositórios oficiais ou links persistentes (INEP).
const realPdfs: PdfFile[] = [
  { 
      id: 'enem-2023-azul', 
      title: 'ENEM 2023 - Caderno Azul', 
      year: '2023', 
      exam: 'ENEM', 
      size: 'PDF Direto', 
      url: 'https://download.inep.gov.br/enem/provas_gabaritos/2023/PV_impresso_D1_CD1_AZUL.pdf' 
  },
  { 
      id: 'enem-2022-amarelo', 
      title: 'ENEM 2022 - Caderno Amarelo', 
      year: '2022', 
      exam: 'ENEM', 
      size: 'PDF Direto', 
      url: 'https://download.inep.gov.br/enem/provas_gabaritos/2022/PV_impresso_D1_CD2_AMARELA.pdf' 
  },
  { 
      id: 'esa-repo', 
      title: 'Acervo Oficial de Provas ESA', 
      year: '2010-2023', 
      exam: 'ESA', 
      size: 'Site Oficial', 
      url: 'https://esa.eb.mil.br/index.php/concurso/provas-anteriores' 
  },
  { 
      id: 'espcex-repo', 
      title: 'Acervo Oficial de Provas EsPCEx', 
      year: '2015-2023', 
      exam: 'EsPCEx', 
      size: 'Site Oficial', 
      url: 'https://espcex.eb.mil.br/index.php/provas-anteriores' 
  },
  { 
      id: 'pmsp-vunesp', 
      title: 'Página do Concurso PM-SP (Vunesp)', 
      year: '2023', 
      exam: 'PM-SP', 
      size: 'Site da Banca', 
      url: 'https://www.vunesp.com.br/PMES2203' 
  },
  {
      id: 'bb-2021-g',
      title: 'Prova Banco do Brasil 2021 (A)',
      year: '2021',
      exam: 'Bancário',
      size: 'PDF Direto',
      url: 'https://blog.grancursosonline.com.br/wp-content/uploads/2021/09/PROVA-A-GAB-1.pdf'
  }
];

export const PdfLibrary: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('Todos');

  const categories = ['Todos', 'ESA', 'EsPCEx', 'PM-SP', 'ENEM', 'Bancário'];

  const filteredPdfs = realPdfs.filter(pdf => {
    const matchesSearch = pdf.title.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = category === 'Todos' || pdf.exam === category;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (pdf: PdfFile) => {
    // 1. Abre o link real em nova aba
    window.open(pdf.url, '_blank');
    
    // 2. Registra no banco para XP
    db.registerDownload(pdf.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="text-gold-500" /> Biblioteca de Provas
            </h2>
            <p className="text-zinc-400 text-sm">Baixe provas oficiais. Se o link for do site oficial, busque por "Provas Anteriores".</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-zinc-500" size={20} />
              <input 
                  type="text" 
                  placeholder="Buscar prova..." 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-gold-500 outline-none"
              />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                        category === cat 
                        ? 'bg-gold-500 text-black' 
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPdfs.map(pdf => (
              <div key={pdf.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:border-zinc-600 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-red-500/10 rounded-lg text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                          <FileText size={24} />
                      </div>
                      <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded">{pdf.exam}</span>
                  </div>
                  <h3 className="font-bold text-white truncate">{pdf.title}</h3>
                  <div className="flex justify-between items-center mt-4 text-sm text-zinc-500">
                      <span>{pdf.year} • {pdf.size}</span>
                      <button 
                        onClick={() => handleDownload(pdf)}
                        className="flex items-center gap-2 text-gold-500 hover:text-gold-400 font-bold"
                      >
                         ABRIR <ExternalLink size={16} />
                      </button>
                  </div>
              </div>
          ))}
          
          {filteredPdfs.length === 0 && (
              <div className="col-span-full py-12 text-center text-zinc-500">
                  <Filter size={48} className="mx-auto mb-4 opacity-50"/>
                  <p>Nenhuma prova encontrada com estes filtros.</p>
              </div>
          )}
      </div>
    </div>
  );
};