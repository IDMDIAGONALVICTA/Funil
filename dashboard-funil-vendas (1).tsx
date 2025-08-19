import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Filter, TrendingDown, Users, Eye, FolderOpen, DollarSign, Target } from 'lucide-react';
import Papa from 'papaparse';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [pastas, setPastas] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtros
  const [filters, setFilters] = useState({
    empreendimento: '',
    origemMidia: '',
    dataInicio: '',
    dataFim: '',
    imobiliaria: '',
    corretor: '',
    tipoVisita: '',
    tipoMidia: '',
    qualificacao: ''
  });

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Carregar LEADS
        const leadsContent = await window.fs.readFile('LEADS.csv', { encoding: 'utf8' });
        const leadsData = Papa.parse(leadsContent, { 
          header: true, 
          skipEmptyLines: true, 
          delimitersToGuess: [';', ','] 
        }).data;
        
        // Carregar VISITAS
        const visitasContent = await window.fs.readFile('VISITA.csv', { encoding: 'utf8' });
        const visitasData = Papa.parse(visitasContent, { 
          header: true, 
          skipEmptyLines: true, 
          delimitersToGuess: [';', ','] 
        }).data;
        
        // Carregar PASTAS
        const pastasContent = await window.fs.readFile('PASTA.csv', { encoding: 'utf8' });
        const pastasData = Papa.parse(pastasContent, { 
          header: true, 
          skipEmptyLines: true, 
          delimitersToGuess: [';', ','] 
        }).data;
        
        // Carregar VENDAS
        const vendasContent = await window.fs.readFile('VENDAS.csv', { encoding: 'utf8' });
        const vendasData = Papa.parse(vendasContent, { 
          header: true, 
          skipEmptyLines: true, 
          delimitersToGuess: [';', ','] 
        }).data;
        
        setLeads(leadsData);
        setVisitas(visitasData);
        setPastas(pastasData);
        setVendas(vendasData);
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Função para limpar strings
  const cleanString = (str) => {
    if (!str) return '';
    return str.toString().trim().toLowerCase();
  };

  // Função para verificar se data está no range
  const isDateInRange = (dateStr, startDate, endDate) => {
    if (!dateStr || (!startDate && !endDate)) return true;
    
    try {
      const date = new Date(dateStr.split('/').reverse().join('-'));
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && date < start) return false;
      if (end && date > end) return false;
      return true;
    } catch {
      return true;
    }
  };

  // Função para aplicar filtros
  const applyFilters = (data, dateField = 'Data') => {
    return data.filter(item => {
      if (filters.empreendimento && !cleanString(item.Empreendimento || '').includes(cleanString(filters.empreendimento))) return false;
      if (filters.origemMidia) {
        const origem = item['ORIGEM MÍDIA'] || item['ORIGEM MÍDEA'] || item['ORIGEM M�DEA'] || item['Primeira Origem'] || '';
        if (!cleanString(origem).includes(cleanString(filters.origemMidia))) return false;
      }
      if (filters.imobiliaria) {
        const imob = item['Imobiliária'] || item['Imobili�ria'] || '';
        if (!cleanString(imob).includes(cleanString(filters.imobiliaria))) return false;
      }
      if (filters.corretor && !cleanString(item.Corretor || '').includes(cleanString(filters.corretor))) return false;
      if (filters.tipoVisita && !cleanString(item['Tipo da visita'] || '').includes(cleanString(filters.tipoVisita))) return false;
      if (filters.tipoMidia) {
        const tipo = item['TIPO DE MÍDIA'] || item['TIPO DE MÍDEA'] || item['TIPO DE M�DEA'] || '';
        if (!cleanString(tipo).includes(cleanString(filters.tipoMidia))) return false;
      }
      if (filters.qualificacao && !cleanString(item.QUALIFICADO || '').includes(cleanString(filters.qualificacao))) return false;
      if (!isDateInRange(item[dateField] || item['Data do Cadastro'], filters.dataInicio, filters.dataFim)) return false;
      
      return true;
    });
  };

  // Cálculos do funil
  const funilData = useMemo(() => {
    if (loading) return { totalLeads: 0, oportunidades: 0, agendamentos: 0, visitasConcluidas: 0, totalPastas: 0, pastasAnalisadas: 0, totalVendas: 0 };

    try {
      const filteredLeads = applyFilters(leads);
      const filteredVisitas = applyFilters(visitas);
      const filteredPastas = applyFilters(pastas, 'Data do Cadastro');
      const filteredVendas = applyFilters(vendas);

      // Total de leads
      const totalLeads = filteredLeads.reduce((sum, item) => sum + (parseInt(item.LEADS) || 0), 0);
      
      // Oportunidades
      const oportunidades = filteredLeads.filter(item => 
        item.QUALIFICADO && (
          cleanString(item.QUALIFICADO).includes('qualificado') || 
          cleanString(item.QUALIFICADO).includes('não qualificado')
        )
      ).reduce((sum, item) => sum + (parseInt(item.LEADS) || 0), 0);

      // Agendamentos
      const agendamentos = filteredVisitas.filter(item => 
        cleanString(item['Tipo da visita'] || '').includes('visita agendada')
      ).reduce((sum, item) => sum + (parseInt(item.VISITA) || 0), 0);

      // Visitas concluídas
      const visitasConcluidas = filteredVisitas.filter(item => {
        const situacao = item['Situação da visita'] || item['Situa��o da visita'] || '';
        return cleanString(situacao).includes('conclu');
      }).reduce((sum, item) => sum + (parseInt(item.VISITA) || 0), 0);

      // Total de pastas
      const totalPastas = filteredPastas.reduce((sum, item) => sum + (parseInt(item.PASTA) || 0), 0);

      // Pastas analisadas
      const pastasAnalisadas = filteredPastas.filter(item => {
        const valorStr = item[' Valor Prestação '] || item['Valor Prestação'] || item[' Valor Presta��o '] || '';
        
        if (!valorStr || valorStr.toString().trim() === '') {
          return false;
        }
        
        try {
          const valorLimpo = valorStr.toString().trim().replace(/\./g, '').replace(',', '.');
          const valor = parseFloat(valorLimpo.replace(/[^\d.-]/g, ''));
          return !isNaN(valor) && valor > 0;
        } catch {
          return false;
        }
      }).reduce((sum, item) => sum + (parseInt(item.PASTA) || 0), 0);

      // Total de vendas
      const totalVendas = filteredVendas.reduce((sum, item) => sum + (parseInt(item.VENDA) || 0), 0);

      return {
        totalLeads,
        oportunidades,
        agendamentos,
        visitasConcluidas,
        totalPastas,
        pastasAnalisadas,
        totalVendas
      };
    } catch (error) {
      console.error('Erro nos cálculos:', error);
      return { totalLeads: 0, oportunidades: 0, agendamentos: 0, visitasConcluidas: 0, totalPastas: 0, pastasAnalisadas: 0, totalVendas: 0 };
    }
  }, [leads, visitas, pastas, vendas, filters, loading]);

  // Extrair opções para filtros
  const filterOptions = useMemo(() => {
    if (loading) return { empreendimentos: [], origemMidia: [], imobiliarias: [], corretores: [], tiposVisita: [], tiposMidia: [], qualificacoes: [] };

    try {
      const allData = [...leads, ...visitas, ...pastas, ...vendas];
      
      return {
        empreendimentos: [...new Set(allData.map(item => item.Empreendimento).filter(Boolean))].sort(),
        origemMidia: [...new Set(allData.map(item => 
          item['ORIGEM MÍDIA'] || item['ORIGEM MÍDEA'] || item['ORIGEM M�DEA'] || item['Primeira Origem']
        ).filter(Boolean))].sort(),
        imobiliarias: [...new Set(allData.map(item => 
          item['Imobiliária'] || item['Imobili�ria']
        ).filter(Boolean))].sort(),
        corretores: [...new Set(allData.map(item => item.Corretor).filter(Boolean))].sort(),
        tiposVisita: [...new Set(visitas.map(item => item['Tipo da visita']).filter(Boolean))].sort(),
        tiposMidia: [...new Set(allData.map(item => 
          item['TIPO DE MÍDIA'] || item['TIPO DE MÍDEA'] || item['TIPO DE M�DEA']
        ).filter(Boolean))].sort(),
        qualificacoes: [...new Set(allData.map(item => item.QUALIFICADO).filter(Boolean))].sort()
      };
    } catch (error) {
      console.error('Erro ao extrair opções:', error);
      return { empreendimentos: [], origemMidia: [], imobiliarias: [], corretores: [], tiposVisita: [], tiposMidia: [], qualificacoes: [] };
    }
  }, [leads, visitas, pastas, vendas, loading]);

  const clearFilters = () => {
    setFilters({
      empreendimento: '',
      origemMidia: '',
      dataInicio: '',
      dataFim: '',
      imobiliaria: '',
      corretor: '',
      tipoVisita: '',
      tipoMidia: '',
      qualificacao: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold">Carregando dados...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Funil de Vendas</h1>
          <p className="text-gray-600">Análise consolidada de Leads, Visitas, Pastas e Vendas</p>
        </div>

        {/* Debug info */}
        <div className="border rounded-lg p-4 mb-8" style={{backgroundColor: '#f0fdf4', borderColor: '#66ffaa'}}>
          <h3 className="text-sm font-semibold mb-2" style={{color: '#0a4d3a'}}>Debug Info</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <div style={{color: '#1a5f4a'}}>Leads:</div>
              <div className="font-bold">{leads.length}</div>
            </div>
            <div>
              <div style={{color: '#1a5f4a'}}>Visitas:</div>
              <div className="font-bold">{visitas.length}</div>
            </div>
            <div>
              <div style={{color: '#1a5f4a'}}>Pastas:</div>
              <div className="font-bold">{pastas.length}</div>
            </div>
            <div>
              <div style={{color: '#1a5f4a'}}>Vendas:</div>
              <div className="font-bold">{vendas.length}</div>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div>
              <div style={{color: '#1a5f4a'}}>Leads calc:</div>
              <div className="font-bold">{funilData.totalLeads}</div>
            </div>
            <div>
              <div style={{color: '#1a5f4a'}}>Visitas concl:</div>
              <div className="font-bold">{funilData.visitasConcluidas}</div>
            </div>
            <div>
              <div style={{color: '#1a5f4a'}}>Pastas total:</div>
              <div className="font-bold">{funilData.totalPastas}</div>
            </div>
            <div>
              <div style={{color: '#1a5f4a'}}>Pastas analis:</div>
              <div className="font-bold">{funilData.pastasAnalisadas}</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Filter className="w-5 h-5 mr-2" style={{color: '#0a4d3a'}} />
              <h2 className="text-xl font-semibold">Filtros</h2>
            </div>
            <button 
              onClick={clearFilters}
              className="px-3 py-1 text-white rounded text-sm hover:opacity-80"
              style={{backgroundColor: '#1a5f4a'}}
            >
              Limpar Filtros
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empreendimento</label>
              <select 
                value={filters.empreendimento} 
                onChange={(e) => setFilters({...filters, empreendimento: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todos</option>
                {filterOptions.empreendimentos.map(emp => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origem Mídia</label>
              <select 
                value={filters.origemMidia} 
                onChange={(e) => setFilters({...filters, origemMidia: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todas</option>
                {filterOptions.origemMidia.map(origem => (
                  <option key={origem} value={origem}>{origem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualificação</label>
              <select 
                value={filters.qualificacao} 
                onChange={(e) => setFilters({...filters, qualificacao: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todos</option>
                {filterOptions.qualificacoes.map(qual => (
                  <option key={qual} value={qual}>{qual}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
              <input 
                type="date" 
                value={filters.dataInicio} 
                onChange={(e) => setFilters({...filters, dataInicio: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
              <input 
                type="date" 
                value={filters.dataFim} 
                onChange={(e) => setFilters({...filters, dataFim: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imobiliária</label>
              <select 
                value={filters.imobiliaria} 
                onChange={(e) => setFilters({...filters, imobiliaria: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todas</option>
                {filterOptions.imobiliarias.map(imob => (
                  <option key={imob} value={imob}>{imob}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Corretor</label>
              <select 
                value={filters.corretor} 
                onChange={(e) => setFilters({...filters, corretor: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todos</option>
                {filterOptions.corretores.map(corretor => (
                  <option key={corretor} value={corretor}>{corretor}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Visita</label>
              <select 
                value={filters.tipoVisita} 
                onChange={(e) => setFilters({...filters, tipoVisita: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todos</option>
                {filterOptions.tiposVisita.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Mídia</label>
              <select 
                value={filters.tipoMidia} 
                onChange={(e) => setFilters({...filters, tipoMidia: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todos</option>
                {filterOptions.tiposMidia.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Funil */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Funil de Vendas</h2>
          
          <div className="space-y-4">
            {/* Lead */}
            <div className="flex items-center justify-center">
              <div className="text-white p-4 rounded-lg w-full max-w-2xl text-center" style={{backgroundColor: '#0a4d3a'}}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5" />
                  <span className="text-lg font-semibold">Leads</span>
                </div>
                <div className="text-2xl font-bold">{funilData.totalLeads}</div>
              </div>
            </div>

            {/* Oportunidade */}
            <div className="flex items-center justify-center">
              <div className="text-white p-4 rounded-lg w-full max-w-xl text-center" style={{backgroundColor: '#1a5f4a'}}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-5 h-5" />
                  <span className="text-lg font-semibold">Oportunidades</span>
                </div>
                <div className="text-2xl font-bold">{funilData.oportunidades}</div>
              </div>
            </div>

            {/* Agendamentos */}
            <div className="flex items-center justify-center">
              <div className="text-white p-4 rounded-lg w-full max-w-lg text-center" style={{backgroundColor: '#0a4d3a'}}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-lg font-semibold">Agendamentos</span>
                </div>
                <div className="text-2xl font-bold">{funilData.agendamentos}</div>
              </div>
            </div>

            {/* Visitas */}
            <div className="flex items-center justify-center">
              <div className="text-white p-4 rounded-lg w-full max-w-md text-center" style={{backgroundColor: '#1a5f4a'}}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Eye className="w-5 h-5" />
                  <span className="text-lg font-semibold">Visitas Concluídas</span>
                </div>
                <div className="text-2xl font-bold">{funilData.visitasConcluidas}</div>
              </div>
            </div>

            {/* Pasta Total */}
            <div className="flex items-center justify-center">
              <div className="text-white p-4 rounded-lg w-full max-w-sm text-center" style={{backgroundColor: '#0a4d3a'}}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FolderOpen className="w-5 h-5" />
                  <span className="text-lg font-semibold">Pasta Total</span>
                </div>
                <div className="text-2xl font-bold">{funilData.totalPastas}</div>
              </div>
            </div>

            {/* Pasta Analisada */}
            <div className="flex items-center justify-center">
              <div className="text-white p-4 rounded-lg w-full max-w-xs text-center" style={{backgroundColor: '#1a5f4a'}}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5" />
                  <span className="text-lg font-semibold">Pasta Analisada</span>
                </div>
                <div className="text-2xl font-bold">{funilData.pastasAnalisadas}</div>
              </div>
            </div>

            {/* Vendas */}
            <div className="flex items-center justify-center">
              <div className="p-4 rounded-lg w-full max-w-xs text-center" style={{backgroundColor: '#66ffaa'}}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-gray-900" />
                  <span className="text-lg font-semibold text-gray-900">Vendas</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{funilData.totalVendas}</div>
              </div>
            </div>
          </div>

          {/* Taxas de Conversão */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-center" style={{color: '#0a4d3a'}}>Taxas de Conversão</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              <div className="p-3 rounded" style={{backgroundColor: '#f0fdf4'}}>
                <div className="text-sm" style={{color: '#1a5f4a'}}>Lead → Oportunidade</div>
                <div className="font-semibold text-lg" style={{color: '#0a4d3a'}}>
                  {funilData.totalLeads > 0 ? ((funilData.oportunidades / funilData.totalLeads) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="p-3 rounded" style={{backgroundColor: '#f0fdf4'}}>
                <div className="text-sm" style={{color: '#1a5f4a'}}>Oportunidade → Agendamento</div>
                <div className="font-semibold text-lg" style={{color: '#0a4d3a'}}>
                  {funilData.oportunidades > 0 ? ((funilData.agendamentos / funilData.oportunidades) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="p-3 rounded" style={{backgroundColor: '#f0fdf4'}}>
                <div className="text-sm" style={{color: '#1a5f4a'}}>Agendamento → Visita</div>
                <div className="font-semibold text-lg" style={{color: '#0a4d3a'}}>
                  {funilData.agendamentos > 0 ? ((funilData.visitasConcluidas / funilData.agendamentos) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="p-3 rounded" style={{backgroundColor: '#f0fdf4'}}>
                <div className="text-sm" style={{color: '#1a5f4a'}}>Visita → Pasta Total</div>
                <div className="font-semibold text-lg" style={{color: '#0a4d3a'}}>
                  {funilData.visitasConcluidas > 0 ? ((funilData.totalPastas / funilData.visitasConcluidas) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="p-3 rounded" style={{backgroundColor: '#f0fdf4'}}>
                <div className="text-sm" style={{color: '#1a5f4a'}}>Pasta Total → Analisada</div>
                <div className="font-semibold text-lg" style={{color: '#0a4d3a'}}>
                  {funilData.totalPastas > 0 ? ((funilData.pastasAnalisadas / funilData.totalPastas) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="p-3 rounded" style={{backgroundColor: '#f0fdf4'}}>
                <div className="text-sm" style={{color: '#1a5f4a'}}>Pasta Analisada → Venda</div>
                <div className="font-semibold text-lg" style={{color: '#0a4d3a'}}>
                  {funilData.pastasAnalisadas > 0 ? ((funilData.totalVendas / funilData.pastasAnalisadas) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;