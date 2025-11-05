<!DOCTYPE html>

<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Relatório Meta x Realizado - VSO</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
<style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f0f8f0;
            color: #0a4d3a;
        }

        .container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 24px;
        }

        .header {
            background: white;
            border-radius: 12px;
            padding: 32px;
            margin-bottom: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        h1 {
            color: #0a4d3a;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 24px;
        }

        .filters-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
        }

        .filter-group {
            position: relative;
        }

        .filter-label {
            font-weight: 600;
            margin-bottom: 8px;
            color: #1a5f4a;
            font-size: 14px;
            display: block;
        }

        .picklist-trigger {
            width: 100%;
            padding: 10px 36px 10px 12px;
            border: 1px solid #66ffaa;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            font-size: 14px;
            color: #0a4d3a;
            text-align: left;
            transition: all 0.2s;
            position: relative;
        }

        .picklist-trigger:hover {
            border-color: #1a5f4a;
        }

        .picklist-trigger.active {
            border-color: #66ffaa;
            box-shadow: 0 0 0 3px rgba(102, 255, 170, 0.1);
        }

        .picklist-trigger::after {
            content: '▼';
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 10px;
            color: #1a5f4a;
        }

        .picklist-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            margin-top: 4px;
            background: white;
            border: 1px solid #66ffaa;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            max-height: 280px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        }

        .picklist-dropdown.active {
            display: block;
        }

        .picklist-search {
            padding: 8px 12px;
            border-bottom: 1px solid #66ffaa;
            position: sticky;
            top: 0;
            background: white;
            z-index: 1;
        }

        .picklist-search input {
            width: 100%;
            padding: 6px 10px;
            border: 1px solid #66ffaa;
            border-radius: 6px;
            font-size: 13px;
        }

        .picklist-options {
            padding: 4px;
        }

        .picklist-option {
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 6px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.15s;
        }

        .picklist-option:hover {
            background: #f0f8f0;
        }

        .picklist-option input[type="checkbox"] {
            width: 16px;
            height: 16px;
            cursor: pointer;
        }

        .picklist-selected-count {
            display: inline-block;
            background: #66ffaa;
            color: #0a4d3a;
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 10px;
            margin-left: 8px;
            font-weight: 600;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }

        .metric-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .metric-card.vso-tri {
            border-left: 4px solid #1a5f4a;
        }

        .metric-card.vso-ano {
            border-left: 4px solid #66ffaa;
            background: linear-gradient(135deg, #f0f8f0, white);
        }

        .metric-label {
            font-size: 12px;
            font-weight: 600;
            color: #1a5f4a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .metric-value {
            font-size: 28px;
            font-weight: 700;
            color: #0a4d3a;
            margin-bottom: 6px;
        }

        .metric-value.large {
            font-size: 32px;
        }

        .metric-subtitle {
            font-size: 11px;
            color: #1a5f4a;
            line-height: 1.3;
        }

        .metric-bar {
            width: 100%;
            height: 6px;
            background: #f0f8f0;
            border-radius: 3px;
            margin-top: 12px;
            overflow: hidden;
        }

        .metric-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #1a5f4a, #66ffaa);
            border-radius: 3px;
            transition: width 0.6s ease;
        }

        .table-section {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .table-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .table-title {
            font-size: 20px;
            font-weight: 700;
            color: #0a4d3a;
        }

        .table-count {
            font-size: 14px;
            color: #1a5f4a;
            background: #f0f8f0;
            padding: 6px 12px;
            border-radius: 6px;
        }

        .table-wrapper {
            overflow-x: auto;
            border-radius: 8px;
            border: 1px solid #66ffaa;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 1200px;
        }

        thead {
            background: #f0f8f0;
        }

        th {
            padding: 14px 16px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            color: #0a4d3a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #66ffaa;
        }

        td {
            padding: 14px 16px;
            border-bottom: 1px solid #f0f8f0;
            font-size: 14px;
        }

        tbody tr:hover {
            background: #f0f8f0;
        }

        .vso-badge {
            display: inline-flex;
            align-items: center;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
        }

        .vso-high { background: #66ffaa; color: #0a4d3a; }
        .vso-medium { background: #1a5f4a; color: white; }
        .vso-low { background: #0a4d3a; color: white; }

        .loading, .no-data {
            text-align: center;
            padding: 60px;
            color: #1a5f4a;
        }

        .currency {
            font-variant-numeric: tabular-nums;
        }

        .analysis-section {
            margin-bottom: 24px;
        }

        .analysis-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
        }

        .analysis-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .analysis-card.strengths {
            border-left: 4px solid #66ffaa;
        }

        .analysis-card.warnings {
            border-left: 4px solid #1a5f4a;
        }

        .analysis-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }

        .analysis-icon {
            font-size: 24px;
        }

        .analysis-header h3 {
            font-size: 18px;
            font-weight: 700;
            color: #0a4d3a;
        }

        .analysis-content {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .analysis-item {
            padding: 12px 16px;
            background: #f0f8f0;
            border-radius: 8px;
            font-size: 14px;
            line-height: 1.6;
            color: #0a4d3a;
        }

        .analysis-item strong {
            color: #0a4d3a;
            font-weight: 600;
        }

        .analysis-item.empty {
            text-align: center;
            color: #1a5f4a;
            font-style: italic;
        }

        .charts-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 20px;
            margin-bottom: 24px;
        }

        .chart-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .chart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .chart-title {
            font-size: 18px;
            font-weight: 700;
            color: #0a4d3a;
        }

        .chart-selector {
            padding: 6px 12px;
            border: 1px solid #66ffaa;
            border-radius: 6px;
            font-size: 13px;
            background: white;
            color: #0a4d3a;
            cursor: pointer;
            font-weight: 500;
        }

        .chart-selector:focus {
            outline: none;
            border-color: #1a5f4a;
        }

        canvas {
            max-height: 350px;
        }

        .download-btn {
            padding: 10px 20px;
            background: linear-gradient(135deg, #1a5f4a, #66ffaa);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }

        .download-btn:active {
            transform: translateY(0);
        }

        .alert {
            background: #f0f8f0;
            color: #0a4d3a;
            padding: 12px 24px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 14px;
            border: 1px solid #66ffaa;
        }
    
.metric-card {
    min-width: 220px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
}

.metric-value {
    font-size: clamp(18px, 2vw, 28px);
    word-wrap: break-word;
    line-height: 1.2;
}

.metric-value.large {
    font-size: clamp(20px, 2.5vw, 32px);
}


/* === AJUSTE PARA AUMENTAR OS CARDS E COMPORTAR NÚMEROS MAIORES === */
.metric-card {
    padding: 28px 28px;
    min-height: 150px;  /* cards mais altos */
}

.metric-value {
    font-size: 28px !important; /* volta ao padrão, sem reduzir */
    white-space: normal;         /* permite quebra de linha */
    word-wrap: break-word;
    word-break: break-word;
    line-height: 1.15;
}

.metric-value.large {
    font-size: 34px !important;  /* valor maior para destaques */
}


/* === RESPONSIVIDADE PARA MOBILE === */
@media (max-width: 768px) {
    .container {
        padding: 12px;
    }

    h1 {
        font-size: 20px;
        text-align: center;
    }

    .metrics-grid {
        grid-template-columns: 1fr !important; /* cards em coluna única */
    }

    .metric-card {
        min-width: 100% !important;
        padding: 20px;
        margin-bottom: 12px;
    }

    .metric-value {
        font-size: 22px !important;
        text-align: center;
    }

    .metric-value.large {
        font-size: 26px !important;
    }

    .filters-grid {
        grid-template-columns: 1fr !important;
    }

    .charts-section {
        grid-template-columns: 1fr !important;
    }

    .analysis-grid {
        grid-template-columns: 1fr !important;
    }
}


/* === CONGELAR 3 PRIMEIRAS COLUNAS (Empresa, Linha de Produto, Produto) === */
.table-wrapper {
    overflow: auto; /* permite deslizar para o lado */
}

.table-section table {
    border-collapse: separate; /* necessário para sticky em colunas */
    border-spacing: 0;
}

.sticky-col {
    position: sticky;
    background: #fff;
    z-index: 2;
}

.sticky-col.col-1 { left: 0; z-index: 5; box-shadow: 2px 0 0 #e8f4ec; }
.sticky-col.col-2 { left: var(--col1, 220px); z-index: 4; box-shadow: 2px 0 0 #e8f4ec; }
.sticky-col.col-3 { left: calc((var(--col1, 220px) + var(--col2, 240px))); z-index: 3; box-shadow: 2px 0 0 #e8f4ec; }

/* Manter cabeçalho colado ao topo em rolarem vertical (opcional, ajuda em mobile) */
.table-section thead th {
    position: sticky;
    top: 0;
    background: #f0f8f0;
    z-index: 6;
}

/* Zelar por alinhamento e largura mínima para as colunas congeladas */
.table-section th, .table-section td {
    white-space: nowrap;
}

.table-section td, .table-section th {
    background-clip: padding-box;
}


/* === EXPANDIR / COLAPSAR QUADRO RESUMO DETALHADO === */
.table-section.expandable .expand-btn {
    padding: 8px 14px;
    border: 1px solid #66ffaa;
    background: #ffffff;
    color: #0a4d3a;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all .2s;
}
.table-section.expandable .expand-btn:hover {
    border-color: #1a5f4a;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

/* Estado expandido em tela cheia */
.table-section.expanded {
    position: fixed;
    inset: 0;
    background: #ffffff;
    z-index: 9998;
    margin: 0 !important;
    border-radius: 0 !important;
    padding: 16px !important;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.table-section.expanded .table-header {
    padding: 4px 0;
}
.table-section.expanded .table-title {
    font-size: 18px;
}
.table-section.expanded .table-wrapper {
    flex: 1;
    height: auto;
    max-height: none;
    overflow: auto;
    border: 1px solid #66ffaa;
    border-radius: 8px;
}

/* Em modo normal, garanta uma altura max para facilitar o scroll vertical */
.table-section.expandable .table-wrapper {
    max-height: 60vh;
}

/* Responsivo para mobile quando expandido */
@media (max-width: 768px) {
    .table-section.expanded {
        padding: 8px !important;
    }
    .table-section.expanded .table-title {
        font-size: 16px;
        text-align: center;
    }
    .table-section.expandable .expand-btn {
        padding: 8px 12px;
        font-size: 12px;
    }
}


/* Totals row styling */
.table-section tfoot#totals-footer tr td,
.table-section tfoot#totals-footer tr th {
  background: #f0f8f0;
  position: sticky;
  bottom: 0;
  z-index: 7;
  border-top: 2px solid #66ffaa;
  font-weight: 700;
}
</style>
<style>
/* Ocultar apenas os cards 'Pontos Fortes' e 'Pontos de Atenção' sem remover elementos */
.analysis-card.strengths, 
.analysis-card.warnings {
    display: none !important;
}
</style>
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
</head>
<body>
<!-- INJETADO: dados + helpers + contador -->
<div id="badgeLoaded" style="position:fixed;top:8px;right:8px;background:#0ea5e9;color:#fff;padding:8px 12px;border-radius:8px;z-index:9999;font-family:Inter,system-ui">Atualizado automaticamente da Planilha em 2025-11-03 14:20:05</div>
<script>

var allData = [];
(function() {
  try {
    var csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSju9gP6RC3zHnt5qHlUPuqJMKCqr2TIQ0y7RIhEhGkuUZLGjzKCp6M0kYnqmkLEKJQXNEZycZgCSv6/pub?gid=0&single=true&output=csv";
    var req = new XMLHttpRequest();
    req.open('GET', csvUrl, false); // synchronous to ensure allData is ready
    req.send(null);
    if (req.status === 200) {
      var parsed = Papa.parse(req.responseText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });
      // Trim keys and normalize
      function t(s) { return (s||"").toString().trim(); }
      allData = parsed.data.map(function(r) {
        var o = {};
        Object.keys(r).forEach(function(k) {
          o[t(k)] = r[k];
        });
        // Coerções numéricas seguras
        function num(x) {
          var v = (typeof x === 'string') ? x.replace(/\./g,'').replace(',', '.') : x;
          v = parseFloat(v);
          return isFinite(v) ? v : 0;
        }
        // Campos esperados pelo dashboard
        return {
          "Empresa": o["Empresa"] ?? o["EMPRESA"] ?? o["empresa"] ?? "",
          "Mês": o["Mês"] ?? o["Mes"] ?? o["MÊS"] ?? o["MES"] ?? "",
          "Ano": num(o["Ano"] ?? o["ANO"] ?? o["ano"]),
          "Linha de Produto": o["Linha de Produto"] ?? o["LINHA DE PRODUTO"] ?? o["Linha"] ?? "",
          "Produto": o["Produto"] ?? o["PRODUTO"] ?? "",
          " Meta VGV ": num(o[" Meta VGV "] ?? o["Meta VGV"] ?? o["META VGV"] ?? o["Meta_VGV"]),
          " Real VGV ": num(o[" Real VGV "] ?? o["Real VGV"] ?? o["REAL VGV"] ?? o["Real_VGV"]),
          "Meta Qtd": num(o["Meta Qtd"] ?? o["META QTD"] ?? o["Meta_Qtd"]),
          "Real Qtd": num(o["Real Qtd"] ?? o["REAL QTD"] ?? o["Real_Qtd"]),
          "Estoque VGV": num(o["Estoque VGV"] ?? o["ESTOQUE VGV"] ?? o["Estoque_VGV"]),
          "Estoque Qtd": num(o["Estoque Qtd"] ?? o["ESTOQUE QTD"] ?? o["Estoque_Qtd"]),
          "% VSO": num(o["% VSO"] ?? o["%VSO"] ?? o["VSO"] ?? o["% vso"] ?? 0)
        };
      });
      console.log("Planilha carregada:", allData.length, "linhas");
    } else {
      console.warn("Falha ao buscar CSV", req.status, req.statusText);
    }
  } catch(e) {
    console.error("Erro ao carregar CSV:", e);
  }
})();


// Exibir contador
document.addEventListener('DOMContentLoaded', function(){
  var b = document.getElementById('badgeLoaded');
  b.textContent = allData && allData.length ? (allData.length + ' registros carregados') : '0 registros';
  setTimeout(()=> b.remove(), 4000);
});
</script>
<div class="container">
<div class="header">
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
<h1>📊 Análise Meta x Realizado - VSO</h1>
<div style="display: flex; gap: 12px;">
<button class="download-btn" onclick="toggleDebugPanel()" style="background: #ffc107; color: #856404;">
                    🔍 Ver Cálculos
                </button>
<button class="download-btn" onclick="downloadReport()">
                    💾 Baixar Relatório
                </button>
</div>
</div>
<script>
function toggleDebugPanel() {
    const panel = document.getElementById('debugPanel');
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
}
</script>
<div class="filters-grid">
<div class="filter-group">
<label class="filter-label">🏢 Empresa</label>
<button class="picklist-trigger" onclick="togglePicklist('empresa')">
                        Selecione<span id="empresa-count"></span>
</button>
<div class="picklist-dropdown" id="picklist-empresa">
<div class="picklist-search">
<input oninput="filterPicklist('empresa', this.value)" placeholder="Buscar..." type="text"/>
</div>
<div class="picklist-options" id="options-empresa"></div>
</div>
</div>
<div class="filter-group">
<label class="filter-label">📅 Mês</label>
<button class="picklist-trigger" onclick="togglePicklist('mes')">
                        Selecione<span id="mes-count"></span>
</button>
<div class="picklist-dropdown" id="picklist-mes">
<div class="picklist-search">
<input oninput="filterPicklist('mes', this.value)" placeholder="Buscar..." type="text"/>
</div>
<div class="picklist-options" id="options-mes"></div>
</div>
</div>
<div class="filter-group">
<label class="filter-label">📆 Ano</label>
<button class="picklist-trigger" onclick="togglePicklist('ano')">
                        Selecione<span id="ano-count"></span>
</button>
<div class="picklist-dropdown" id="picklist-ano">
<div class="picklist-search">
<input oninput="filterPicklist('ano', this.value)" placeholder="Buscar..." type="text"/>
</div>
<div class="picklist-options" id="options-ano"></div>
</div>
</div>
<div class="filter-group">
<label class="filter-label">📦 Linha de Produto</label>
<button class="picklist-trigger" onclick="togglePicklist('linha')">
                        Selecione<span id="linha-count"></span>
</button>
<div class="picklist-dropdown" id="picklist-linha">
<div class="picklist-search">
<input oninput="filterPicklist('linha', this.value)" placeholder="Buscar..." type="text"/>
</div>
<div class="picklist-options" id="options-linha"></div>
</div>
</div>
<div class="filter-group">
<label class="filter-label">🏷️ Produto</label>
<button class="picklist-trigger" onclick="togglePicklist('produto')">
                        Selecione<span id="produto-count"></span>
</button>
<div class="picklist-dropdown" id="picklist-produto">
<div class="picklist-search">
<input oninput="filterPicklist('produto', this.value)" placeholder="Buscar..." type="text"/>
</div>
<div class="picklist-options" id="options-produto"></div>
</div>
</div>
</div>
</div>
<div id="alertContainer"></div>
<div class="metrics-grid" id="metricsGrid">
<div class="loading">Carregando dados...</div>
</div>
<div class="analysis-section" id="analysisSection" style="display: none;">
<div class="analysis-grid">
<div class="analysis-card strengths">
<div class="analysis-header">
<span class="analysis-icon">✅</span>
<h3>Pontos Fortes</h3>
</div>
<div class="analysis-content" id="strengthsContent"></div>
</div>
<div class="analysis-card warnings">
<div class="analysis-header">
<span class="analysis-icon">⚠️</span>
<h3>Pontos de Atenção</h3>
</div>
<div class="analysis-content" id="warningsContent"></div>
</div>
</div>
</div>
<div class="charts-section">
<div class="chart-card">
<div class="chart-header">
<h3 class="chart-title">📊 Meta x Realizado</h3>
<select class="chart-selector" id="chartType1" onchange="updateCharts()">
<option value="mes">Por Mês</option>
<option value="linha">Por Linha de Produto</option>
<option value="produto">Por Produto</option>
</select>
</div>
<canvas id="chartMetaRealizado"></canvas>
</div>
<div class="chart-card">
<div class="chart-header">
<h3 class="chart-title">📈 % VSO</h3>
<select class="chart-selector" id="chartType2" onchange="updateCharts()">
<option value="mes">Por Mês</option>
<option value="linha">Por Linha de Produto</option>
<option value="produto">Por Produto</option>
</select>
</div>
<canvas id="chartVSO"></canvas>
</div>
</div>
<div class="table-section">
<div class="table-header">
<h2 class="table-title">Quadro Resumo Detalhado</h2>
<span class="table-count" id="recordCount">0 registros</span>
</div>
<div class="table-wrapper">
<table data-totals-injected="true">
<thead>
<tr>
<th>Empresa</th>
<th>Linha de Produto</th>
<th>Produto</th>
<th>Meta VGV</th>
<th>Real VGV</th>
<th>Meta Qtd</th>
<th>Real Qtd</th>
<th>Estoque VGV</th>
<th>Estoque Qtd</th>
<th>% VSO</th>
</tr>
</thead>
<tbody id="tableBody">
<tr><td class="loading" colspan="10">Carregando...</td></tr>
</tbody>
<tfoot id="totals-footer"><tr><th>TOTAL</th></tr></tfoot></table>
</div>
</div>
</div>
<script>
        
        const selectedFilters = {
            empresa: new Set(),
            mes: new Set(),
            ano: new Set(),
            linha: new Set(),
            produto: new Set()
        };

        // Dados completos do Excel incorporados
        

        function initializeFilters() {
            const empresas = [...new Set(allData.map(d => d.Empresa))].filter(Boolean).sort();
            
            // Ordem correta dos meses
            const ordemMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                               'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            const mesesUnicos = [...new Set(allData.map(d => d.Mês))].filter(Boolean);
            const meses = ordemMeses.filter(m => mesesUnicos.includes(m));
            
            const anos = [...new Set(allData.map(d => d.Ano))].filter(Boolean).sort((a, b) => b - a);
            const linhas = [...new Set(allData.map(d => d['Linha de Produto']))].filter(Boolean).sort();
            const produtos = [...new Set(allData.map(d => d.Produto))].filter(Boolean).sort();

            populatePicklist('empresa', empresas);
            populatePicklist('mes', meses);
            populatePicklist('ano', anos);
            populatePicklist('linha', linhas);
            populatePicklist('produto', produtos);
        }

        function populatePicklist(id, items) {
            const container = document.getElementById(`options-${id}`);
            container.innerHTML = items.map(item => `
                <label class="picklist-option">
                    <input type="checkbox" value="${item}" onchange="updateFilter('${id}', '${item}', this.checked)">
                    <span>${item}</span>
                </label>
            `).join('');
        }

        function togglePicklist(id) {
            const dropdown = document.getElementById(`picklist-${id}`);
            const trigger = dropdown.previousElementSibling;
            
            document.querySelectorAll('.picklist-dropdown').forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                    d.previousElementSibling.classList.remove('active');
                }
            });
            
            dropdown.classList.toggle('active');
            trigger.classList.toggle('active');
        }

        function filterPicklist(id, searchTerm) {
            const options = document.querySelectorAll(`#options-${id} .picklist-option`);
            const term = searchTerm.toLowerCase();
            
            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                option.style.display = text.includes(term) ? 'flex' : 'none';
            });
        }

        function updateFilter(id, value, checked) {
            if (checked) {
                selectedFilters[id].add(value);
            } else {
                selectedFilters[id].delete(value);
            }
            
            updateSelectedCount(id);
            updateDashboard();
        }

        function updateSelectedCount(id) {
            const count = selectedFilters[id].size;
            const countEl = document.getElementById(`${id}-count`);
            
            if (count > 0) {
                countEl.innerHTML = `<span class="picklist-selected-count">${count}</span>`;
            } else {
                countEl.innerHTML = '';
            }
        }

        function filterData() {
            return allData.filter(row => {
                return (selectedFilters.empresa.size === 0 || selectedFilters.empresa.has(row.Empresa)) &&
                       (selectedFilters.mes.size === 0 || selectedFilters.mes.has(row.Mês)) &&
                       (selectedFilters.ano.size === 0 || selectedFilters.ano.has(String(row.Ano))) &&
                       (selectedFilters.linha.size === 0 || selectedFilters.linha.has(row['Linha de Produto'])) &&
                       (selectedFilters.produto.size === 0 || selectedFilters.produto.has(row.Produto));
            });
        }

        function updateDashboard() {
            const filtered = filterData();
            updateMetrics(filtered);
            updateAnalysis(filtered);
            updateTable(filtered);
            
            // Chamar updateCharts apenas se os elementos existirem
            if (document.getElementById('chartMetaRealizado') && document.getElementById('chartVSO')) {
                updateCharts();
            }
        }

        function updateMetrics(data) {
            // Métricas básicas
            const metaVGV = data.reduce((sum, r) => sum + (r[' Meta VGV '] || 0), 0);
            const realVGV = data.reduce((sum, r) => sum + (r[' Real VGV '] || 0), 0);
            
            console.log(`[VENDAS DEBUG] Total de registros em data: ${data.length}`);
            console.log(`[VENDAS DEBUG] Real VGV (soma de vendas): R$ ${realVGV.toLocaleString('pt-BR', {maximumFractionDigits:0})}`);
            
            const selectedAnoStrs = Array.from(selectedFilters.ano);
const selectedAno = selectedAnoStrs.length===1 ? parseInt(selectedAnoStrs[0]) : null;
const selectedMeses = Array.from(selectedFilters.mes);
const extraFilterFn = (r)=> (
  (selectedFilters.empresa.size===0 || selectedFilters.empresa.has(r.Empresa)) &&
  (selectedFilters.linha.size===0   || selectedFilters.linha.has(r['Linha de Produto'])) &&
  (selectedFilters.produto.size===0 || selectedFilters.produto.has(r['Produto']))
);
const estoqueVGV = (typeof getEstoqueVGVForFilters==='function')
  ? getEstoqueVGVForFilters(selectedAno, selectedMeses, extraFilterFn)
  : data.reduce((sum, r) => sum + (r['Estoque VGV'] || 0), 0);
const vsoMedio = estoqueVGV > 0 ? (realVGV / estoqueVGV * 100) : 0;
            
            // Debug para verificar lógica de estoque
            console.log('=== DEBUG ESTOQUE - NOVA LÓGICA ===');
            console.log('Meses selecionados:', selectedMeses.length > 0 ? selectedMeses : 'Nenhum');
            console.log('Ano selecionado:', selectedAno || 'Nenhum');
            if (selectedMeses.length === 0) {
                console.log('LÓGICA: Sem filtro → Último estoque disponível');
            } else if (selectedMeses.length === 1) {
                console.log('LÓGICA: 1 mês → Estoque do próprio mês (' + selectedMeses[0] + ')');
            } else {
                const MESES_ORD = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
                const mesesOrdenados = selectedMeses.slice().sort((a,b) => MESES_ORD.indexOf(a) - MESES_ORD.indexOf(b));
                const ultimoMes = mesesOrdenados[mesesOrdenados.length - 1];
                const idxUltimo = MESES_ORD.indexOf(ultimoMes);
                const mesSubsequente = idxUltimo < 11 ? MESES_ORD[idxUltimo + 1] : 'Janeiro do ano seguinte';
                console.log('LÓGICA: Múltiplos meses → SOMA dos estoques de todos os meses selecionados');
            }
            console.log('Real VGV (Vendas):', realVGV.toFixed(2));
            console.log('Estoque VGV:', estoqueVGV.toFixed(2));
            console.log('VSO Geral:', vsoMedio.toFixed(2) + '%');
            console.log('====================================');
            
            const atingimentoMeta = metaVGV > 0 ? (realVGV / metaVGV * 100) : 0;

            document.getElementById('metricsGrid').innerHTML = `
                <div class="metric-card">
                    <div class="metric-label">Meta VGV</div>
                    <div class="metric-value currency">R$ ${formatMoney(metaVGV)}</div>
                    <div class="metric-subtitle">Valor planejado</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Real VGV</div>
                    <div class="metric-value currency">R$ ${formatMoney(realVGV)}</div>
                    <div class="metric-subtitle">${atingimentoMeta.toFixed(1)}% da meta</div>
                    <div class="metric-bar">
                        <div class="metric-bar-fill" style="width: ${Math.min(atingimentoMeta, 100)}%"></div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Estoque VGV</div>
                    <div class="metric-value currency">R$ ${formatMoney(estoqueVGV)}</div>
                    <div class="metric-subtitle">Valor em estoque</div>
                </div>
                <div class="metric-card vso-ano">
                    <div class="metric-label">VSO Geral</div>
                    <div class="metric-value large">${vsoMedio.toFixed(1)}%</div>
                    <div class="metric-subtitle">
                        Vendas: R$ ${formatMoneyShort(realVGV)}<br>
                        Estoque: R$ ${formatMoneyShort(estoqueVGV)}<br>
                        <small style="opacity: 0.7;">
                            ${selectedMeses.length === 0 
                                ? 'Estoque: Último mês disponível' 
                                : selectedMeses.length === 1
                                ? 'Estoque: Do próprio mês'
                                : 'Estoque: Mês subsequente ao período'}
                        </small>
                    </div>
                    <div class="metric-bar">
                        <div class="metric-bar-fill" style="width: ${Math.min(vsoMedio, 100)}%"></div>
                    </div>
                </div>
            `;
        }

        function updateAnalysis(data) {
            if (data.length === 0) {
                document.getElementById('analysisSection').style.display = 'none';
                return;
            }

            document.getElementById('analysisSection').style.display = 'block';

            // Calcular métricas para análise
            const metaVGV = data.reduce((sum, r) => sum + (r[' Meta VGV '] || 0), 0);
            const realVGV = data.reduce((sum, r) => sum + (r[' Real VGV '] || 0), 0);
            const selectedAnoStrs = Array.from(selectedFilters.ano);
const selectedAno = selectedAnoStrs.length===1 ? parseInt(selectedAnoStrs[0]) : null;
const selectedMeses = Array.from(selectedFilters.mes);
const extraFilterFn = (r)=> (
  (selectedFilters.empresa.size===0 || selectedFilters.empresa.has(r.Empresa)) &&
  (selectedFilters.linha.size===0   || selectedFilters.linha.has(r['Linha de Produto'])) &&
  (selectedFilters.produto.size===0 || selectedFilters.produto.has(r['Produto']))
);
const estoqueVGV = (typeof getEstoqueVGVForFilters==='function')
  ? getEstoqueVGVForFilters(selectedAno, selectedMeses, extraFilterFn)
  : data.reduce((sum, r) => sum + (r['Estoque VGV'] || 0), 0);
const vsoMedio = estoqueVGV > 0 ? (realVGV / estoqueVGV * 100) : 0;
            const atingimentoMeta = metaVGV > 0 ? (realVGV / metaVGV * 100) : 0;

            // Análise por produto
            const produtosVSO = data.map(r => ({
                nome: r.Produto,
                vso: (r['% VSO'] || 0) * 100,
                realVGV: r[' Real VGV '] || 0,
                metaVGV: r[' Meta VGV '] || 0
            })).filter(p => p.vso > 0);

            const melhoresProdutos = [...produtosVSO].sort((a, b) => b.vso - a.vso).slice(0, 3);
            const pioresProdutos = [...produtosVSO].sort((a, b) => a.vso - b.vso).slice(0, 3);

            // PONTOS FORTES
            const strengths = [];

            if (atingimentoMeta >= 100) {
                strengths.push(`<div class="analysis-item"><strong>Meta Superada!</strong> O realizado atingiu ${atingimentoMeta.toFixed(1)}% da meta VGV planejada.</div>`);
            } else if (atingimentoMeta >= 80) {
                strengths.push(`<div class="analysis-item"><strong>Bom Desempenho:</strong> Atingimento de ${atingimentoMeta.toFixed(1)}% da meta VGV.</div>`);
            }

            if (vsoMedio >= 50) {
                strengths.push(`<div class="analysis-item"><strong>Excelente VSO:</strong> Velocidade média de ${vsoMedio.toFixed(1)}% indica alta eficiência nas vendas.</div>`);
            } else if (vsoMedio >= 30) {
                strengths.push(`<div class="analysis-item"><strong>VSO Satisfatório:</strong> ${vsoMedio.toFixed(1)}% de velocidade sobre estoque.</div>`);
            }

            if (melhoresProdutos.length > 0 && melhoresProdutos[0].vso >= 50) {
                const top = melhoresProdutos[0];
                strengths.push(`<div class="analysis-item"><strong>Destaque de Vendas:</strong> ${top.nome} com ${top.vso.toFixed(1)}% de VSO.</div>`);
            }

            if (realVGV > 0) {
                const produtosAcimaMeta = data.filter(r => 
                    (r[' Real VGV '] || 0) >= (r[' Meta VGV '] || 0) && (r[' Meta VGV '] || 0) > 0
                ).length;
                
                if (produtosAcimaMeta > 0) {
                    strengths.push(`<div class="analysis-item"><strong>Produtos na Meta:</strong> ${produtosAcimaMeta} produto(s) atingiram ou superaram suas metas.</div>`);
                }
            }

            // PONTOS DE ATENÇÃO
            const warnings = [];

            if (atingimentoMeta < 50) {
                warnings.push(`<div class="analysis-item"><strong>Meta Baixa:</strong> Apenas ${atingimentoMeta.toFixed(1)}% da meta VGV foi alcançada. Revisar estratégias.</div>`);
            } else if (atingimentoMeta < 80) {
                warnings.push(`<div class="analysis-item"><strong>Meta Parcial:</strong> ${atingimentoMeta.toFixed(1)}% da meta atingida. Esforço adicional necessário.</div>`);
            }

            if (vsoMedio < 20) {
                warnings.push(`<div class="analysis-item"><strong>VSO Crítico:</strong> ${vsoMedio.toFixed(1)}% de velocidade indica vendas lentas em relação ao estoque.</div>`);
            } else if (vsoMedio < 30) {
                warnings.push(`<div class="analysis-item"><strong>VSO Abaixo do Ideal:</strong> ${vsoMedio.toFixed(1)}% sugere necessidade de ações comerciais.</div>`);
            }

            if (pioresProdutos.length > 0 && pioresProdutos[0].vso < 20) {
                const worst = pioresProdutos[0];
                warnings.push(`<div class="analysis-item"><strong>Produto com Dificuldade:</strong> ${worst.nome} com apenas ${worst.vso.toFixed(1)}% de VSO.</div>`);
            }

            const estoqueAlto = data.filter(r => {
                const vso = (r['% VSO'] || 0) * 100;
                return vso > 0 && vso < 15 && (r['Estoque VGV'] || 0) > 1000000;
            }).length;

            if (estoqueAlto > 0) {
                warnings.push(`<div class="analysis-item"><strong>Estoque Elevado:</strong> ${estoqueAlto} produto(s) com estoque alto e vendas lentas.</div>`);
            }

            if (realVGV === 0 && metaVGV > 0) {
                warnings.push(`<div class="analysis-item"><strong>Sem Vendas:</strong> Nenhuma venda realizada no período selecionado.</div>`);
            }

            // Renderizar
            const strengthsEl = document.getElementById('strengthsContent');
            const warningsEl = document.getElementById('warningsContent');

            strengthsEl.innerHTML = strengths.length > 0 
                ? strengths.join('') 
                : '<div class="analysis-item empty">Nenhum ponto forte identificado no período</div>';

            warningsEl.innerHTML = warnings.length > 0 
                ? warnings.join('') 
                : '<div class="analysis-item empty">Nenhum ponto de atenção identificado</div>';
        }

        function updateTable(data) {
            const tbody = document.getElementById('tableBody');
            
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="10" class="no-data">Nenhum registro encontrado</td></tr>';
                document.getElementById('recordCount').textContent = '0 registros';
                return;
            }

            // Obter filtros selecionados
            const selectedAnoStrs = Array.from(selectedFilters.ano);
            const selectedAno = selectedAnoStrs.length === 1 ? parseInt(selectedAnoStrs[0]) : null;
            const selectedMeses = Array.from(selectedFilters.mes);

            // Agrupar dados por produto
            const groupedData = {};
            
            data.forEach(row => {
                const key = `${row.Empresa}-${row['Linha de Produto']}-${row.Produto}`;
                
                if (!groupedData[key]) {
                    groupedData[key] = {
                        Empresa: row.Empresa,
                        'Linha de Produto': row['Linha de Produto'],
                        Produto: row.Produto,
                        metaVGV: 0,
                        realVGV: 0,
                        metaQtd: 0,
                        realQtd: 0,
                        estoqueVGV: 0,
                        estoqueQtd: 0,
                        rawData: []  // Armazenar dados brutos para cálculo de estoque
                    };
                }
                
                // Acumular Meta e Real normalmente
                groupedData[key].metaVGV += row[' Meta VGV '] || 0;
                groupedData[key].realVGV += row[' Real VGV '] || 0;
                groupedData[key].metaQtd += row['Meta Qtd'] || 0;
                groupedData[key].realQtd += row['Real Qtd'] || 0;
                
                // Armazenar dados brutos para calcular estoque corretamente
                groupedData[key].rawData.push(row);
            });

            // Calcular Estoque corretamente para cada produto
            Object.keys(groupedData).forEach(key => {
                const group = groupedData[key];
                const productData = group.rawData;
                
                // Função auxiliar para filtrar dados do produto
                const extraFilterFn = (r) => (
                    r.Empresa === group.Empresa &&
                    r['Linha de Produto'] === group['Linha de Produto'] &&
                    r.Produto === group.Produto
                );
                
                // Usar as funções globais para calcular estoque
                if (typeof getEstoqueVGVForFilters === 'function') {
                    group.estoqueVGV = getEstoqueVGVForFilters(selectedAno, selectedMeses, extraFilterFn) || 0;
                } else {
                    // Fallback: soma simples
                    group.estoqueVGV = productData.reduce((sum, r) => sum + (r['Estoque VGV'] || 0), 0);
                }
                
                if (typeof getEstoqueQtdForFilters === 'function') {
                    group.estoqueQtd = getEstoqueQtdForFilters(selectedAno, selectedMeses, extraFilterFn) || 0;
                } else {
                    // Fallback: soma simples
                    group.estoqueQtd = productData.reduce((sum, r) => sum + (r['Estoque Qtd'] || 0), 0);
                }
                
                // Remover rawData para não aparecer na saída
                delete group.rawData;
            });

            const groupedArray = Object.values(groupedData);
            document.getElementById('recordCount').textContent = `${groupedArray.length} produtos`;

            tbody.innerHTML = groupedArray.map(row => {
                const vso = row.estoqueVGV > 0 ? (row.realVGV / row.estoqueVGV * 100) : 0;
                const vsoClass = vso >= 50 ? 'vso-high' : vso >= 20 ? 'vso-medium' : 'vso-low';

                return `
                    <tr>
                        <td>${row.Empresa || '-'}</td>
                        <td>${row['Linha de Produto'] || '-'}</td>
                        <td>${row.Produto || '-'}</td>
                        <td class="currency">R$ ${formatMoney(row.metaVGV)}</td>
                        <td class="currency">R$ ${formatMoney(row.realVGV)}</td>
                        <td>${row.metaQtd}</td>
                        <td>${row.realQtd}</td>
                        <td class="currency">R$ ${formatMoney(row.estoqueVGV)}</td>
                        <td>${row.estoqueQtd}</td>
                        <td><span class="vso-badge ${vsoClass}">${vso.toFixed(1)}%</span></td>
                    </tr>
                `;
            }).join('');
        }

        let chartMetaRealizado = null;
        let chartVSO = null;

        function updateCharts() {
            const filtered = filterData();
            
            if (!document.getElementById('chartMetaRealizado') || !document.getElementById('chartVSO')) {
                return;
            }
            
            const type1 = document.getElementById('chartType1').value;
            const type2 = document.getElementById('chartType2').value;

            updateMetaRealizadoChart(filtered, type1);
            updateVSOChart(filtered, type2);
        }

        function updateMetaRealizadoChart(data, groupBy) {
            const ctx = document.getElementById('chartMetaRealizado');
            
            if (chartMetaRealizado) {
                chartMetaRealizado.destroy();
            }

            const grouped = groupData(data, groupBy);
            const labels = Object.keys(grouped);
            const metaData = labels.map(label => grouped[label].meta);
            const realData = labels.map(label => grouped[label].real);

            chartMetaRealizado = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Meta VGV',
                            data: metaData,
                            backgroundColor: 'rgba(0, 124, 39, 0.7)',
                            borderColor: '#007C27',
                            borderWidth: 2
                        },
                        {
                            label: 'Real VGV',
                            data: realData,
                            backgroundColor: 'rgba(104, 204, 1, 0.7)',
                            borderColor: '#68CC01',
                            borderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': R$ ' + formatMoney(context.parsed.y);
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: false
                            },
                            ticks: {
                                callback: function(value) {
                                    return 'R$ ' + formatMoneyShort(value);
                                }
                            }
                        }
                    }
                }
            });
        }

        function updateVSOChart(data, groupBy) {
            const ctx = document.getElementById('chartVSO');
            
            if (chartVSO) {
                chartVSO.destroy();
            }

            const grouped = groupData(data, groupBy);
            const labels = Object.keys(grouped);
            const vsoData = labels.map(label => {
                const group = grouped[label];
                return group.estoque > 0 ? (group.real / group.estoque * 100) : 0;
            });

            chartVSO = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '% VSO',
                        data: vsoData,
                        backgroundColor: vsoData.map(v => 
                            v >= 50 ? 'rgba(104, 204, 1, 0.7)' : 
                            v >= 20 ? 'rgba(0, 124, 39, 0.7)' : 
                            'rgba(0, 81, 42, 0.7)'
                        ),
                        borderColor: vsoData.map(v => 
                            v >= 50 ? '#68CC01' : 
                            v >= 20 ? '#007C27' : 
                            '#00512A'
                        ),
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return '% VSO: ' + context.parsed.y.toFixed(1) + '%';
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: {
                                display: false
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    }
                }
            });
        }

        function groupData(data, groupBy) {
            const grouped = {};
            const ordemMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                               'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

            data.forEach(row => {
                let key;
                if (groupBy === 'mes') {
                    key = row.Mês;
                } else if (groupBy === 'linha') {
                    key = row['Linha de Produto'];
                } else {
                    key = row.Produto;
                }

                if (!key) return;

                if (!grouped[key]) {
                    grouped[key] = { meta: 0, real: 0, estoque: 0 };
                }

                grouped[key].meta += row[' Meta VGV '] || 0;
                grouped[key].real += row[' Real VGV '] || 0;
                grouped[key].estoque += row['Estoque VGV'] || 0;
            });

            if (groupBy === 'mes') {
                const sorted = {};
                ordemMeses.forEach(mes => {
                    if (grouped[mes]) {
                        sorted[mes] = grouped[mes];
                    }
                });
                return sorted;
            } else if (groupBy === 'produto') {
                const sorted = Object.entries(grouped)
                    .sort((a, b) => b[1].real - a[1].real);
                const result = {};
                sorted.forEach(([key, value]) => {
                    result[key] = value;
                });
                return result;
            } else {
                const sorted = Object.keys(grouped).sort();
                const result = {};
                sorted.forEach(key => {
                    result[key] = grouped[key];
                });
                return result;
            }
        }

        function formatMoney(value) {
            return new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        }

        function formatMoneyShort(value) {
            return new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        }

        function downloadReport() {
            const wb = XLSX.utils.book_new();
            const filtered = filterData();
            
            const ws = XLSX.utils.json_to_sheet(filtered);
            XLSX.utils.book_append_sheet(wb, ws, "Dados");
            
            const metaVGV = filtered.reduce((sum, r) => sum + (r[' Meta VGV '] || 0), 0);
            const realVGV = filtered.reduce((sum, r) => sum + (r[' Real VGV '] || 0), 0);
            const estoqueVGV = filtered.reduce((sum, r) => sum + (r['Estoque VGV'] || 0), 0);
            const vsoMedio = estoqueVGV > 0 ? (realVGV / estoqueVGV * 100) : 0;
            const atingimentoMeta = metaVGV > 0 ? (realVGV / metaVGV * 100) : 0;
            
            const resumo = [
                { Metrica: 'Meta VGV', Valor: metaVGV },
                { Metrica: 'Real VGV', Valor: realVGV },
                { Metrica: 'Estoque VGV', Valor: estoqueVGV },
                { Metrica: '% VSO Médio', Valor: vsoMedio.toFixed(1) + '%' },
                { Metrica: '% Atingimento Meta', Valor: atingimentoMeta.toFixed(1) + '%' }
            ];
            
            const wsResumo = XLSX.utils.json_to_sheet(resumo);
            XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo");
            
            XLSX.writeFile(wb, 'relatorio-meta-realizado.xlsx');
        }

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filter-group')) {
                document.querySelectorAll('.picklist-dropdown').forEach(d => {
                    d.classList.remove('active');
                    d.previousElementSibling.classList.remove('active');
                });
            }
        });

        // Inicializar dashboard
        initializeFilters();
        updateDashboard();
        setTimeout(() => {
            updateCharts();
        }, 50);
    </script>
<!-- INJETADO POR CHATGPT: REGRAS FINAIS (Victa=Diagonal, filtros 100%, estoque card=denominador, abreviação em milhões) -->
<script>
(function(){
  if (window.__vsoMasterInstalled) return; window.__vsoMasterInstalled = true;

  const MES2NUM = {"Janeiro":1,"Fevereiro":2,"Março":3,"Abril":4,"Maio":5,"Junho":6,"Julho":7,"Agosto":8,"Setembro":9,"Outubro":10,"Novembro":11,"Dezembro":12};
  const NUM2MES = Object.fromEntries(Object.entries(MES2NUM).map(([k,v])=>[v,k]));
  const QTR = {1:[1,2,3], 2:[4,5,6], 3:[7,8,9], 4:[10,11,12]};

  // Utils
  function norm(t){ return (t||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim(); }
  function percentBR(p){ try{ return new Intl.NumberFormat('pt-BR',{style:'percent',maximumFractionDigits:1}).format(p); }catch(e){ return (p*100).toFixed(1).replace('.',',')+'%'; } }
  function brlShort(n){
    const v = Number(n)||0;
    try { return 'R$ ' + v.toLocaleString('pt-BR', { maximumFractionDigits: 0 }); }
    catch(e){ return 'R$ ' + String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g,'.'); }
  }

  // Read filters robustly
  function getSelectedFilters(){
    const out = {};
    document.querySelectorAll('.filter-group').forEach(g=>{
      const lab = g.querySelector('.filter-label'); if (!lab) return;
      const t = norm(lab.textContent||'');
      let key=null;
      if (t.includes('empresa')) key='Empresa';
      else if (t.includes('mês') || t.includes('mes')) key='Mês';
      else if (t.includes('ano')) key='Ano';
      else if (t.includes('linha')) key='Linha de Produto';
      else if (t.includes('produto')) key='Produto';
      if (!key) return;
      const vals=[];
      g.querySelectorAll('.picklist-dropdown input[type="checkbox"]').forEach(ch=>{
        if (ch.checked){
          const opt = ch.closest('.picklist-option'); const txt = opt?opt.textContent:'';
          if (txt) vals.push(txt.replace(/\s+/g,' ').trim());
        }
      });
      if (!vals.length){
        g.querySelectorAll('.picklist-option.selected').forEach(opt=>{
          const txt = opt?opt.textContent:'';
          if (txt) vals.push(txt.replace(/\s+/g,' ').trim());
        });
      }
      if (!vals.length) return;
      if (key==='Ano') out[key] = vals.map(v=>parseInt(v.replace(/\D/g,''),10)).filter(n=>!isNaN(n));
      else out[key] = vals;
    });
    return out;
  }
  function applyFilters(data, sel){
    if (!sel || !Object.keys(sel).length) return data.slice();
    return data.filter(d=>{
      for (const k in sel){
        if (k==='Ano'){ if (!sel[k].includes(Number(d[k])||0)) return false; }
        else { if (!sel[k].includes(String(d[k]))) return false; }
      }
      return true;
    });
  }
  function nextMonth(y,m){ return (m===12)?{y:y+1,m:1}:{y:y,m:m+1}; }
  function selMonthsNums(sel){ const arr = sel&&sel['Mês']?sel['Mês']:[]; return arr.map(nm=>MES2NUM[nm]).filter(Boolean); }

  // Build Empresa->Ano->Mes index
  function idxEmpresa(data){
    const idx={};
    data.forEach(d=>{
      const emp = String(d['Empresa']||'').trim();
      const ano = Number(d['Ano'])||0;
      const m = MES2NUM[d['Mês']]||0;
      if (!emp||!ano||!m) return;
      idx[emp] = idx[emp] || {};
      idx[emp][ano] = idx[emp][ano] || {};
      idx[emp][ano][m] = idx[emp][ano][m] || {real:0, estoque:0};
      idx[emp][ano][m].real += (Number(d[' Real VGV '])||0);
      idx[emp][ano][m].estoque += (Number(d['Estoque VGV'])||0);
    });
    return idx;
  }

  function quarterByEmpresa(idx, q, monthsSel, initialDivideBy2){
    const Q_MONTHS = {
      1: [1, 2, 3],
      2: [4, 5, 6],
      3: [7, 8, 9],
      4: [10, 11, 12]
    };
    const Q_ESTOQUE_MONTHS = {
      1: { start: 1, end: 4 }, // Jan, Abr
      2: { start: 4, end: 7 }, // Abr, Jul
      3: { start: 7, end: 10 }, // Jul, Out
      4: { start: 10, end: 1 } // Out, Jan (próximo ano)
    };
    const qMonths = Q_MONTHS[q];
    const qEstoque = Q_ESTOQUE_MONTHS[q];

    let real = 0;
    let estoqueDenom = 0;
    let monthsUsed = [];

    Object.keys(idx).forEach(emp=>{
      Object.keys(idx[emp]).map(x=>parseInt(x,10)).sort().forEach(ano=>{
        // 1. Soma do Real (Vendas)
        // Se há filtro de mês, usamos a intersecção dos meses do trimestre e os meses filtrados.
        // Se não há filtro de mês, usamos todos os meses do trimestre.
        const ms = monthsSel.length ? monthsSel.filter(m=>qMonths.includes(m)) : qMonths;
        const validMonths = ms.filter(m=>idx[emp][ano] && idx[emp][ano][m]);
        if (!validMonths.length) return;

        validMonths.forEach(m=>{
          real += (idx[emp][ano][m].real || 0);
          if (!monthsUsed.includes(m)) monthsUsed.push(m);
        });

        // 2. Cálculo do Denominador (Estoque)
        // Estoque do mês SUBSEQUENTE ao último mês do trimestre
        const mesEstoque = qEstoque.end; // mês subsequente já definido em Q_ESTOQUE_MONTHS
        let anoEstoque = ano;
        
        // Se for 4º trimestre, o estoque é de janeiro do ano seguinte
        if (q === 4 && mesEstoque === 1) {
          anoEstoque = ano + 1;
        }
        
        const estoqueMes = (idx[emp][anoEstoque] && idx[emp][anoEstoque][mesEstoque] && idx[emp][anoEstoque][mesEstoque].estoque) || 0;
        estoqueDenom += estoqueMes;
      });
    });

    return {
      real: real,
      estoque: estoqueDenom,
      pct: estoqueDenom > 0 ? real / estoqueDenom : 0,
      months: monthsUsed.sort((a,b)=>a-b)
    };
  }
  function annualByEmpresa(idx, monthsSel, initialDivideBy2){
    const ESTOQUE_MONTHS = { start: 1, end: 10 }; // Jan, Out (para o cálculo anual)

    let real = 0;
    let estoqueDenom = 0;
    let monthsUsed = [];

    Object.keys(idx).forEach(emp=>{
      Object.keys(idx[emp]).map(x=>parseInt(x,10)).sort().forEach(ano=>{
        // 1. Soma do Real (Vendas)
        // Se há filtro de mês, usamos apenas os meses filtrados.
        // Se não há filtro de mês, usamos todos os meses do ano.
        const allMonths = [1,2,3,4,5,6,7,8,9,10,11,12];
        const ms = monthsSel.length ? monthsSel : allMonths;
        const validMonths = ms.filter(m=>idx[emp][ano] && idx[emp][ano][m]);
        if (!validMonths.length) return;

        validMonths.forEach(m=>{
          real += (idx[emp][ano][m].real || 0);
          if (!monthsUsed.includes(m)) monthsUsed.push(m);
        });

        // 2. Cálculo do Denominador (Estoque)
        if (validMonths.length === 1) {
          // 1 mês: usar estoque DESSE mês
          const mes = validMonths[0];
          const estoqueMes = (idx[emp][ano] && idx[emp][ano][mes] && idx[emp][ano][mes].estoque) || 0;
          estoqueDenom += estoqueMes;
        } else {
          // Múltiplos meses: usar estoque do mês SUBSEQUENTE ao último
          const ultimoMes = Math.max(...validMonths);
          const mesSubsequente = ultimoMes < 12 ? ultimoMes + 1 : 1;
          const anoEstoque = mesSubsequente === 1 ? ano + 1 : ano;
          
          const estoqueMes = (idx[emp][anoEstoque] && idx[emp][anoEstoque][mesSubsequente] && idx[emp][anoEstoque][mesSubsequente].estoque) || 0;
          estoqueDenom += estoqueMes;
        }
      });
    });

    return {
      real: real,
      estoque: estoqueDenom,
      pct: estoqueDenom > 0 ? real / estoqueDenom : 0,
      months: monthsUsed.sort((a,b)=>a-b)
    };
  }

  function isQuarter(label){
    const t = norm(label);
    if (/\bt1\b/.test(t) || t.includes('1º') || t.includes('1o') || t.includes('primeiro')) return 1;
    if (/\bt2\b/.test(t) || t.includes('2º') || t.includes('2o') || t.includes('segundo')) return 2;
    if (/\bt3\b/.test(t) || t.includes('3º') || t.includes('3o') || t.includes('terceiro')) return 3;
    if (/\bt4\b/.test(t) || t.includes('4º') || t.includes('4o') || t.includes('quarto')) return 4;
    return null;
  }

  function updateAll(){
    try{
      if (typeof allData === 'undefined') return;
      const sel = getSelectedFilters();
      const filtered = applyFilters(allData, sel);
      const idx = idxEmpresa(filtered);
      const monthsSel = selMonthsNums(sel);
      const initialDivideBy2 = false; // NÃO dividir por 2 quando não há filtro de mês

      // Update %VSO cards
      document.querySelectorAll('.metric-card, .card, [class*="card"]').forEach(card=>{
        const labelEl = card.querySelector('.metric-label, .label, h3, h4, .card-title');
        const valueEl = card.querySelector('.metric-value, .value, .card-value, strong, b, .number');
        if (!labelEl || !valueEl) return;
        const label = labelEl.textContent||'';
        const t = norm(label);
        if (!t.includes('vso')) return;

        let info=null;
        const q = isQuarter(label);
        if (q) info = quarterByEmpresa(idx, q, monthsSel, initialDivideBy2);
        else if (t.includes('anual') || t.includes('ano')) info = annualByEmpresa(idx, monthsSel, initialDivideBy2);
        if (!info) return;

        valueEl.textContent = percentBR(info.pct);
        const sub = card.querySelector('.metric-subtitle');
        if (sub){
          if (info.months && info.months.length){
            const nomes = info.months.map(m=>NUM2MES[m]).join('-');
            sub.textContent = `${nomes} ${brlShort(info.real)} / ${brlShort(info.estoque)}`;
          } else {
            sub.textContent = `Velocidade anual ${brlShort(info.real)} / ${brlShort(info.estoque)}`;
          }
        }
      });

      // Make ESTOQUE VGV card equal to denominator when months filtered
      if (monthsSel.length){
        const estoqueCard = Array.from(document.querySelectorAll('.metric-card, .card')).find(c=>{
          const lab=c.querySelector('.metric-label, .label, h3, h4, .card-title');
          return lab && /estoque\s*vgv/i.test(lab.textContent||'');
        });
        if (estoqueCard){
          // compute denom anual/geral com mesma regra do trimestre selecionado (usar meses selecionados como conjunto corrente)
          let denom=0;
          Object.keys(idx).forEach(emp=>{
            Object.keys(idx[emp]).map(x=>parseInt(x,10)).sort().forEach(ano=>{
              const ms = monthsSel.filter(m=>idx[emp][ano] && idx[emp][ano][m]).sort((a,b)=>a-b);
              if (!ms.length) return;
              const mF=ms[0], mL=ms[ms.length-1];
              const nxt = nextMonth(ano, mL);
              const eFirst = (idx[emp][ano][mF] && idx[emp][ano][mF].estoque) || 0;
              const eNext  = (idx[emp][nxt.y] && idx[emp][nxt.y][nxt.m] && idx[emp][nxt.y][nxt.m].estoque) || 0;
              denom += (eFirst + eNext);
            });
          });
          const vEl = estoqueCard.querySelector('.metric-value, .value, .card-value, strong, b, .number');
          if (vEl) vEl.textContent = brlShort(denom);
          const sEl = estoqueCard.querySelector('.metric-subtitle');
          if (sEl) sEl.textContent = 'Valor em estoque (denominador do %VSO)';
        }
      }

      // Abbreviate big numbers in header cards (META/REAL/ESTOQUE)
      (function abbreviateHeaderCards(){
        const cards = Array.from(document.querySelectorAll('.metric-card, .card'));
        cards.forEach(card=>{
          const labelEl = card.querySelector('.metric-label, .label, h3, h4, .card-title');
          const label = labelEl ? (labelEl.textContent||'').toUpperCase() : '';
          if (!/META VGV|REAL VGV|ESTOQUE VGV/.test(label)) return;
          const valEl = card.querySelector('.metric-value, .value, .card-value, strong, b, .number');
          if (!valEl) return;
          // Try to read number in the same element or in siblings
          const txt = valEl.textContent || '';
          const m = txt.replace(/\s/g,'').match(/(\d{1,3}(?:\.\d{3}){2,}(?:,\d+)?)/);
          if (m){
            // parse BR number
            let s = m[1];
            if (s.indexOf(',')>=0){ s = s.replace(/\./g,'').replace(',','.'); }
            const n = parseFloat(s);
            if (!isNaN(n)){
              valEl.textContent = 'R$ ' + n.toLocaleString('pt-BR',{maximumFractionDigits:0});
            }
          }
        });
      })();

    }catch(e){ console.error('vso master error', e); }
  }

  function schedule(){ clearTimeout(window.__vsoMasterTmr); window.__vsoMasterTmr = setTimeout(updateAll, 100); }
  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', schedule); } else { schedule(); }
  document.addEventListener('filters:changed', schedule);
  const root = document.querySelector('.filters-grid') || document;
  root.addEventListener('click', schedule, true);
  root.addEventListener('change', schedule, true);
  // MutationObserver desabilitado para evitar loop infinito
  // const mo = new MutationObserver(schedule);
  // mo.observe(document.body, { subtree:true, childList:true, characterData:true });
})();
</script>
<!-- INJETADO POR CHATGPT: ABREVIAÇÃO SEGURA (pt-BR) E CORREÇÃO DOS CARDS META/REAL/ESTOQUE -->
<script>
(function(){
  if (window.__headerCardsFixInstalled) return; window.__headerCardsFixInstalled = true;

  const MES2NUM = {"Janeiro":1,"Fevereiro":2,"Março":3,"Abril":4,"Maio":5,"Junho":6,"Julho":7,"Agosto":8,"Setembro":9,"Outubro":10,"Novembro":11,"Dezembro":12};
  function norm(t){ return (t||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim(); }
  function nextMonth(y,m){ return (m===12)?{y:y+1,m:1}:{y:y,m:m+1}; }

  function brlShort(n){
    const v = Number(n)||0;
    try { return (v).toLocaleString('pt-BR',{maximumFractionDigits:0}); }
    catch(e){ return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g,'.'); }
  }

  function getSelectedFilters(){
    const out = {};
    document.querySelectorAll('.filter-group').forEach(g=>{
      const lab = g.querySelector('.filter-label'); if (!lab) return;
      const t = norm(lab.textContent||'');
      let key=null;
      if (t.includes('empresa')) key='Empresa';
      else if (t.includes('mês')||t.includes('mes')) key='Mês';
      else if (t.includes('ano')) key='Ano';
      else if (t.includes('linha')) key='Linha de Produto';
      else if (t.includes('produto')) key='Produto';
      if (!key) return;
      const vals=[];
      g.querySelectorAll('.picklist-dropdown input[type="checkbox"]').forEach(ch=>{
        if (ch.checked){
          const opt=ch.closest('.picklist-option'); const txt=opt?opt.textContent:'';
          if (txt) vals.push(txt.replace(/\s+/g,' ').trim());
        }
      });
      if (!vals.length){
        g.querySelectorAll('.picklist-option.selected').forEach(opt=>{
          const txt = opt?opt.textContent:'';
          if (txt) vals.push(txt.replace(/\s+/g,' ').trim());
        });
      }
      if (!vals.length) return;
      if (key==='Ano'){ out[key]=vals.map(v=>parseInt(v.replace(/\D/g,''),10)).filter(n=>!isNaN(n)); }
      else { out[key]=vals; }
    });
    return out;
  }

  function applyFilters(data, sel){
    if (!sel || !Object.keys(sel).length) return data.slice();
    return data.filter(d=>{
      for (const k in sel){
        if (k==='Ano'){ if (!sel[k].includes(Number(d[k])||0)) return false; }
        else { if (!sel[k].includes(String(d[k]))) return false; }
      }
      return true;
    });
  }

  function selMonthsNums(sel){ const arr = sel&&sel['Mês']?sel['Mês']:[]; return arr.map(nm=>MES2NUM[nm]).filter(Boolean); }

  function idxEmpresa(data){
    const idx={};
    data.forEach(d=>{
      const emp = String(d['Empresa']||'').trim();
      const ano = Number(d['Ano'])||0;
      const m = MES2NUM[d['Mês']]||0;
      if (!emp||!ano||!m) return;
      idx[emp]=idx[emp]||{};
      idx[emp][ano]=idx[emp][ano]||{};
      idx[emp][ano][m]=idx[emp][ano][m]||{real:0, estoque:0, meta:0};
      idx[emp][ano][m].real += (Number(d[' Real VGV '])||0);
      idx[emp][ano][m].estoque += (Number(d['Estoque VGV'])||0);
      idx[emp][ano][m].meta += (Number(d[' Meta VGV '])||0);
    });
    return idx;
  }

  function computeEstoqueDenom(idx, monthsSel){
    // Estoque para exibir quando meses estão filtrados: 1º mês + seguinte ao último (por empresa/ano), somado
    let estoque=0;
    Object.keys(idx).forEach(emp=>{
      Object.keys(idx[emp]).map(x=>parseInt(x,10)).sort().forEach(ano=>{
        const ms = monthsSel.filter(m=>idx[emp][ano] && idx[emp][ano][m]).sort((a,b)=>a-b);
        if (!ms.length) return;
        const mF=ms[0], mL=ms[ms.length-1];
        const nxt = nextMonth(ano, mL);
        const eFirst = (idx[emp][ano][mF] && idx[emp][ano][mF].estoque) || 0;
        const eNext  = (idx[emp][nxt.y] && idx[emp][nxt.y][nxt.m] && idx[emp][nxt.y][nxt.m].estoque) || 0;
        estoque += (eFirst + eNext);
      });
    });
    return estoque;
  }

  function sumByKey(data, key){
    return data.reduce((s,d)=> s + (Number(d[key])||0), 0);
  }

  function updateHeaderCards(){
    if (typeof allData === 'undefined') return;
    const sel = getSelectedFilters();
    const filtered = applyFilters(allData, sel);
    const monthsSel = selMonthsNums(sel);
    const idx = idxEmpresa(filtered);

    const metaSum = sumByKey(filtered, ' Meta VGV ');
    const realSum = sumByKey(filtered, ' Real VGV ');
    let estoqueSum;

    if (monthsSel.length){
      estoqueSum = computeEstoqueDenom(idx, monthsSel);
    } else {
      // Visão inicial: mostrar estoque agregado do dataset filtrado
      estoqueSum = sumByKey(filtered, 'Estoque VGV');
    }

    // Atualiza os 3 cards
    const cards = Array.from(document.querySelectorAll('.metric-card, .card'));
    function setCard(labelRegex, value){
      const card = cards.find(c => {
        const lab = c.querySelector('.metric-label, .label, h3, h4, .card-title');
        return lab && labelRegex.test((lab.textContent||'').toUpperCase());
      });
      if (!card) return;
      const valEl = card.querySelector('.metric-value, .value, .card-value, strong, b, .number');
      if (valEl){
        // NÃO prefixar "R$" aqui: o layout já tem o "R$" separado
        valEl.textContent = brlShort(value);
      }
    }
    setCard(/META VGV/i, metaSum);
    setCard(/REAL VGV/i, realSum);
    setCard(/ESTOQUE VGV/i, estoqueSum);
  }

  function schedule(){ clearTimeout(window.__headerFixTmr); window.__headerFixTmr = setTimeout(updateHeaderCards, 100); }

  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', schedule); } else { schedule(); }
  document.addEventListener('filters:changed', schedule);
  const root = document.querySelector('.filters-grid') || document;
  root.addEventListener('click', schedule, true);
  root.addEventListener('change', schedule, true);
  // MutationObserver desabilitado para evitar loop infinito
  // const mo = new MutationObserver(schedule);
  // mo.observe(document.body, { subtree:true, childList:true, characterData:true });
})();
</script>
<script>
(function() {
  function findResumoDetalhadoTable() {
    // Procura por uma seção cujo título contenha "Quadro Resumo Detalhado"
    const sections = document.querySelectorAll('.table-section');
    for (const sec of sections) {
      const title = sec.querySelector('.table-title');
      if (title && /quadro\s+resumo\s+detalhado/i.test(title.textContent || '')) {
        const tbl = sec.querySelector('table');
        if (tbl) return tbl;
      }
    }
    // Fallback: primeira tabela da página
    return document.querySelector('.table-section table') || document.querySelector('table');
  }

  function measureColWidths(tbl) {
    if (!tbl) return {w1:220, w2:240, w3:260};
    const rows = Array.from(tbl.querySelectorAll('tr'));
    // Captura índices das 3 primeiras colunas (0,1,2)
    let w = [0,0,0];
    rows.slice(0, Math.min(rows.length, 30)).forEach(tr => {
      const cells = tr.children;
      for (let i = 0; i < 3; i++) {
        const cell = cells[i];
        if (!cell) continue;
        const rect = cell.getBoundingClientRect();
        // Usa largura real ou largura computada mínima
        const cw = Math.max(rect.width, 160);
        if (cw > w[i]) w[i] = cw;
      }
    });
    // Defaults de segurança
    w = w.map((v, i) => v || [220,240,260][i]);
    return {w1: Math.ceil(w[0]), w2: Math.ceil(w[1]), w3: Math.ceil(w[2])};
  }

  function applyStickyCols(tbl) {
    if (!tbl) return;
    // Garantir wrapper com scroll
    const wrapper = tbl.closest('.table-wrapper') || tbl.parentElement;
    if (wrapper) wrapper.style.overflow = 'auto';

    // Adiciona classes às 3 primeiras colunas (th/td)
    const rows = tbl.querySelectorAll('tr');
    rows.forEach(tr => {
      const cells = tr.children;
      if (cells[0]) cells[0].classList.add('sticky-col', 'col-1');
      if (cells[1]) cells[1].classList.add('sticky-col', 'col-2');
      if (cells[2]) cells[2].classList.add('sticky-col', 'col-3');
    });

    // Mede e aplica variáveis CSS no próprio <table>
    const {w1, w2, w3} = measureColWidths(tbl);
    tbl.style.setProperty('--col1', w1 + 'px');
    tbl.style.setProperty('--col2', w2 + 'px');
    tbl.style.setProperty('--col3', w3 + 'px');

    // Define larguras mínimas nas células congeladas para evitar sobreposição
    const setMinWidth = (selector, w) => {
      tbl.querySelectorAll(selector).forEach(el => {
        el.style.minWidth = w + 'px';
        el.style.width = w + 'px';
        el.style.maxWidth = w + 'px';
      });
    };
    setMinWidth('.col-1', w1);
    setMinWidth('.col-2', w2);
    setMinWidth('.col-3', w3);
  }

  function initFreeze() {
    const tbl = findResumoDetalhadoTable();
    if (!tbl) return;
    applyStickyCols(tbl);
  }

  // Executa após carregamento e reexecuta em resize
  window.addEventListener('load', initFreeze);
  window.addEventListener('resize', () => {
    // Recalcular rapidamente em resize
    const tbl = (function(){
      const sections = document.querySelectorAll('.table-section');
      for (const sec of sections) {
        const title = sec.querySelector('.table-title');
        if (title && /quadro\s+resumo\s+detalhado/i.test(title.textContent || '')) {
          return sec.querySelector('table');
        }
      }
      return document.querySelector('.table-section table') || document.querySelector('table');
    })();
    if (!tbl) return;
    // Remover widths antigos para recalcular
    tbl.style.removeProperty('--col1');
    tbl.style.removeProperty('--col2');
    tbl.style.removeProperty('--col3');
    // Reaplicar
    const rows = tbl.querySelectorAll('tr');
    rows.forEach(tr => {
      const cells = tr.children;
      if (cells[0]) cells[0].style = '';
      if (cells[1]) cells[1].style = '';
      if (cells[2]) cells[2].style = '';
    });
    // Reaplica sticky
    (function(){ applyStickyCols(tbl); })();
  });
})();
</script>
<script>
(function(){
  function findResumoDetalhadoSection() {
    const sections = document.querySelectorAll('.table-section');
    for (const sec of sections) {
      const title = sec.querySelector('.table-title');
      if (title && /quadro\s+resumo\s+detalhado/i.test(title.textContent || '')) {
        return sec;
      }
    }
    return null;
  }

  function ensureExpandButton(section) {
    if (!section) return;
    section.classList.add('expandable');
    const header = section.querySelector('.table-header');
    if (!header) return;

    // evita duplicar botão
    if (header.querySelector('.expand-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'expand-btn';
    btn.type = 'button';
    btn.textContent = 'Expandir';

    // insere à direita do header
    header.appendChild(btn);

    function toggleExpand() {
      const isExpanded = section.classList.toggle('expanded');
      btn.textContent = isExpanded ? 'Fechar' : 'Expandir';
      // trava destrava scroll do body ao expandir
      document.body.style.overflow = isExpanded ? 'hidden' : '';
    }

    btn.addEventListener('click', toggleExpand);
  }

  function init() {
    const section = findResumoDetalhadoSection();
    ensureExpandButton(section);
  }

  window.addEventListener('load', init);
})();
</script>
<script id="interactive-totals-script">
(function(){
  function parseNumberBR(txt){
    if(!txt) return 0;
    txt = txt.replace(/\u00A0/g,' ').trim();
    // strip R$, spaces
    txt = txt.replace(/[R$\s]/g,'');
    // remove thousand dots, swap comma for dot
    txt = txt.replace(/\./g,'').replace(/,/g,'.');
    var v = parseFloat(txt);
    return isNaN(v) ? 0 : v;
  }
  function formatBR(n){
    try { return (n||0).toLocaleString('pt-BR'); }
    catch(e){ return String(n); }
  }
  function norm(s){ return (s||'').toLowerCase().replace(/\s+/g,' ').trim(); }

  function getHeaderIndices(table){
    var map = {};
    var ths = table.querySelectorAll('thead th');
    ths.forEach(function(th, i){
      var t = norm(th.textContent||'');
      map[t] = i;
    });
    return map;
  }

  function identifyNumericColumns(table){
    var ths = table.querySelectorAll('thead th');
    var numeric = [];
    var firstNumeric = null;
    var targets = [
      'meta vgv','real vgv','meta qtd','real qtd',
      'estoque vgv','estoque qtd','% vso','vso %','vso'
    ];
    function cleanedHeader(txt){
      return norm(txt).replace(/[%()]/g,'');
    }
    ths.forEach(function(th, i){
      var h = cleanedHeader(th.textContent||'');
      var isTarget = targets.some(function(t){ return h.indexOf(t)!==-1; });
      if(isTarget){ numeric.push(i); if(firstNumeric==null || i<firstNumeric) firstNumeric=i; }
    });
    // Heuristic fallback
    if(numeric.length===0 && ths.length>=6){
      var start = Math.max(0, ths.length-6);
      for(var j=start;j<ths.length;j++){ numeric.push(j); }
      firstNumeric = start;
    }
    return {numeric:numeric, first:firstNumeric};
  }

  function buildFooterCells(table, firstNumeric, numericIndices){
    var tfoot = table.querySelector('tfoot#totals-footer');
    if(!tfoot){
      tfoot = document.createElement('tfoot');
      tfoot.id = 'totals-footer';
      table.appendChild(tfoot);
    }
    var tr = tfoot.querySelector('tr') || document.createElement('tr');
    tr.innerHTML = '';
    // Cells before numeric
    for (var i=0;i<firstNumeric;i++){
      if(i===firstNumeric-1){
        var th = document.createElement('th');
        th.textContent = 'TOTAL';
        th.style.textAlign = 'right';
        tr.appendChild(th);
      } else {
        var td = document.createElement('td');
        tr.appendChild(td);
      }
    }
    // Numeric total cells
    numericIndices.forEach(function(idx){
      var td = document.createElement('td');
      td.dataset.totalForIndex = String(idx);
      tr.appendChild(td);
    });
    if(!tfoot.contains(tr)) tfoot.appendChild(tr);
  }

  function computeTotals(table){
    var info = identifyNumericColumns(table);
    if(info.first==null) return;
    buildFooterCells(table, info.first, info.numeric);

    var sums = {};
    info.numeric.forEach(function(i){ sums[i]=0; });

    var tbody = table.querySelector('tbody');
    if(!tbody) return;
    var rows = Array.from(tbody.rows);

    rows.forEach(function(tr){
      // count only visible rows
      var visible = !(tr.style && (tr.style.display==='none' || tr.style.visibility==='hidden')) && tr.offsetParent !== null;
      if(!visible) return;
      info.numeric.forEach(function(i){
        var cell = tr.cells[i];
        if(!cell) return;
        var txt = (cell.textContent||'').trim();
        var headerText = (table.querySelector('thead th:nth-child('+(i+1)+')')||{}).textContent||'';
        var isPercent = /%/.test(headerText);
        var val;
        if(isPercent){
          var match = txt.replace(',', '.').match(/-?\d+(\.\d+)?/);
          val = match ? parseFloat(match[0]) : parseNumberBR(txt);
        } else {
          val = parseNumberBR(txt);
        }
        if(isFinite(val)) sums[i]+=val;
      });
    });

    // write totals with special handling for % VSO
    var headerTexts = Array.from(table.querySelectorAll('thead th')).map(function(th){ return (th.textContent||'').toLowerCase(); });
    function findIndexByName(name){
      var target = name.toLowerCase();
      for (var i=0;i<headerTexts.length;i++){
        if (headerTexts[i].indexOf(target)!==-1) return i;
      }
      return -1;
    }
    var idxRealVgv = findIndexByName('real vgv');
    var idxEstoqueVgv = findIndexByName('estoque vgv');
    var idxRealQtd = findIndexByName('real qtd');
    var idxEstoqueQtd = findIndexByName('estoque qtd');

    var tds = table.querySelectorAll('tfoot#totals-footer td[data-total-for-index]');
    // Build current filter context
    var selectedAnoStrs = (typeof selectedFilters!=='undefined' && selectedFilters.ano) ? Array.from(selectedFilters.ano) : [];
    var selectedAno = selectedAnoStrs.length===1 ? parseInt(selectedAnoStrs[0]) : null;
    var selectedMeses = (typeof selectedFilters!=='undefined' && selectedFilters.mes) ? Array.from(selectedFilters.mes) : [];
    var extraFilterFn = function(r){
      var ok = true;
      if (selectedFilters){
        if (selectedFilters.empresa && selectedFilters.empresa.size>0) ok = ok && selectedFilters.empresa.has(r.Empresa);
        if (selectedFilters.linha && selectedFilters.linha.size>0) ok = ok && selectedFilters.linha.has(r['Linha de Produto']);
        if (selectedFilters.produto && selectedFilters.produto.size>0) ok = ok && selectedFilters.produto.has(r['Produto']);
      }
      return ok;
    };

    tds.forEach(function(td){
      var idx = parseInt(td.dataset.totalForIndex, 10);
      var headerText = (table.querySelector('thead th:nth-child('+(idx+1)+')')||{}).textContent||'';
      var isPercent = /%/.test(headerText);
      var headerNorm = headerText.toLowerCase();

      // Override for Estoque VGV and Estoque Qtd using same rules as cards
      if (headerNorm.indexOf('estoque vgv') !== -1 && typeof window.getEstoqueVGVForFilters === 'function'){
        var vEstVGV = window.getEstoqueVGVForFilters(selectedAno, selectedMeses, extraFilterFn) || 0;
        td.textContent = formatBR(vEstVGV);
        return;
      }
      if (headerNorm.indexOf('estoque qtd') !== -1 && typeof window.getEstoqueQtdForFilters === 'function'){
        var vEstQtd = window.getEstoqueQtdForFilters(selectedAno, selectedMeses, extraFilterFn) || 0;
        td.textContent = formatBR(vEstQtd);
        return;
      }

      if (isPercent){
        // % VSO computed as Real/Estoque using card rules for denominator when possible
        var idxRealVgv = findIndexByName('real vgv');
        var idxEstoqueVgv = findIndexByName('estoque vgv');
        var idxRealQtd = findIndexByName('real qtd');
        var idxEstoqueQtd = findIndexByName('estoque qtd');

        var denom = 0, numer = 0;
        if (typeof window.getEstoqueVGVForFilters === 'function'){
          denom = window.getEstoqueVGVForFilters(selectedAno, selectedMeses, extraFilterFn);
        } else if (idxEstoqueVgv>=0) {
          denom = sums[idxEstoqueVgv] || 0;
        }
        if (idxRealVgv>=0) {
          numer = sums[idxRealVgv] || 0;
        } else if (idxRealQtd>=0 && typeof window.getEstoqueQtdForFilters === 'function'){
          numer = sums[idxRealQtd] || 0;
          if (!denom && typeof window.getEstoqueQtdForFilters === 'function'){
            denom = window.getEstoqueQtdForFilters(selectedAno, selectedMeses, extraFilterFn);
          }
        }
        var pct = (denom>0) ? (numer/denom)*100.0 : 0;
        td.textContent = pct.toFixed(2)+'%';
      } else {
        var v = sums[idx] || 0;
        td.textContent = formatBR(v);
      }
    });
  }

  function attachObservers(table){
    var tbody = table.querySelector('tbody');
    if(!tbody) return;
    var mo = new MutationObserver(function(){ computeTotals(table); });
    mo.observe(tbody, {childList:true, subtree:true, attributes:true, attributeFilter:['style','class']});

    // also hook generic inputs/selects/buttons
    document.querySelectorAll('select, input, button').forEach(function(el){
      ['change','click','input'].forEach(function(evt){
        el.addEventListener(evt, function(){ setTimeout(function(){ computeTotals(table); }, 0); });
      });
    });
  }

  function init(){
    var table = document.querySelector('.table-section table[data-totals-injected="true"]') || document.querySelector('table[data-totals-injected="true"]');
    if(!table) return;
    computeTotals(table);
    attachObservers(table);
    // safety recompute after async renders
    setTimeout(function(){ computeTotals(table); }, 400);
    setTimeout(function(){ computeTotals(table); }, 1000);
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
</script>



<script>
(function(){
  const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  
  // Encontra o último mês que tem dados de vendas ou meta (indicando atividade comercial)
  function ultimoMesComAtividade(data, ano){
    for (let i=MESES.length-1; i>=0; i--){
      const m = MESES[i];
      const registros = data.filter(r => String(r["Ano"])===String(ano) && r["Mês"]===m);
      // Verifica se há dados de vendas ou meta neste mês
      const temAtividade = registros.some(r => 
        (+r[" Real VGV "]||0) > 0 || 
        (+r[" Meta VGV "]||0) > 0 || 
        (+r["Real Qtd"]||0) > 0 || 
        (+r["Meta Qtd"]||0) > 0
      );
      if (temAtividade) {
        console.log(`[ESTOQUE] Último mês com atividade em ${ano}: ${m}`);
        return m;
      }
    }
    console.log(`[ESTOQUE] Nenhum mês com atividade encontrado em ${ano}`);
    return null;
  }
  
  function ultimoMesComInfoSum(data, ano, campo){
    for (let i=MESES.length-1; i>=0; i--){
      const m = MESES[i];
      const soma = data.filter(r => String(r["Ano"])===String(ano) && r["Mês"]===m)
                       .reduce((s,r)=> s + (+r[campo]||0), 0);
      if (soma > 0) return {mes:m, soma};
    }
    return {mes:null, soma:0};
  }
  function ordMeses(arr){
    return arr.slice().sort((a,b)=>MESES.indexOf(a)-MESES.indexOf(b));
  }
  window.getEstoqueQtdForFilters = function(selectedAno, selectedMeses, extraFilterFn){
    const base = Array.isArray(window.allData) ? window.allData : [];
    const data = extraFilterFn ? base.filter(extraFilterFn) : base;
    
    // Filtrar por ano se especificado
    const dadosFiltrados = selectedAno 
      ? data.filter(r => String(r["Ano"]) === String(selectedAno))
      : data;
    
    if (selectedMeses && selectedMeses.length >= 1){
      const ord = ordMeses(selectedMeses);
      
      if (ord.length === 1) {
        // 1 mês: pegar estoque DESSE mês
        const mes = ord[0];
        const estoque = dadosFiltrados.filter(r => r["Mês"] === mes)
                   .reduce((s,r)=> s + (+r["Estoque Qtd"]||0), 0);
        console.log(`[ESTOQUE QTD] 1 mês (${mes}): ${estoque}`);
        return estoque;
      } else {
        // Múltiplos meses: SOMAR estoques de TODOS os meses filtrados
        const estoque = dadosFiltrados.filter(r => ord.includes(r["Mês"]))
                   .reduce((s,r)=> s + (+r["Estoque Qtd"]||0), 0);
        console.log(`[ESTOQUE QTD] ${ord.length} meses (${ord.join(', ')}): SOMA de estoques = ${estoque}`);
        return estoque;
      }
    }
    
    // Sem filtro de mês: pegar o último mês disponível de cada produto
    const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    
    // Criar mapa: chave = Empresa|Linha|Produto, valor = array de {mes, estoque}
    const produtoEstoques = {};
    
    dadosFiltrados.forEach(r => {
      const chave = `${r.Empresa}|${r['Linha de Produto']}|${r.Produto}`;
      const mes = r["Mês"];
      const estoque = +r["Estoque Qtd"] || 0;
      
      if (!produtoEstoques[chave]) {
        produtoEstoques[chave] = {};
      }
      
      // Acumular estoque por mês (caso haja múltiplas linhas do mesmo produto/mês)
      produtoEstoques[chave][mes] = (produtoEstoques[chave][mes] || 0) + estoque;
    });
    
    // Para cada produto, pegar o estoque do último mês que existe
    let estoqueTotal = 0;
    Object.keys(produtoEstoques).forEach(chave => {
      const mesesDoProduto = produtoEstoques[chave];
      
      // Encontrar o último mês (mais recente cronologicamente)
      let ultimoMes = null;
      for (let i = MESES.length - 1; i >= 0; i--) {
        if (mesesDoProduto[MESES[i]] !== undefined) {
          ultimoMes = MESES[i];
          break;
        }
      }
      
      if (ultimoMes) {
        estoqueTotal += mesesDoProduto[ultimoMes];
      }
    });
    
    console.log(`[ESTOQUE QTD] Sem filtro de mês - Total (último mês de cada produto): ${estoqueTotal}`);
    return estoqueTotal;
  };
  window.getEstoqueVGVForFilters = function(selectedAno, selectedMeses, extraFilterFn){
    const base = Array.isArray(window.allData) ? window.allData : [];
    const data = extraFilterFn ? base.filter(extraFilterFn) : base;
    
    // Filtrar por ano se especificado
    const dadosFiltrados = selectedAno 
      ? data.filter(r => String(r["Ano"]) === String(selectedAno))
      : data;
    
    if (selectedMeses && selectedMeses.length >= 1){
      const ord = ordMeses(selectedMeses);
      
      if (ord.length === 1) {
        // 1 mês: pegar estoque DESSE mês
        const mes = ord[0];
        const estoque = dadosFiltrados.filter(r => r["Mês"] === mes)
                   .reduce((s,r)=> s + (+r["Estoque VGV"]||0), 0);
        console.log(`[ESTOQUE VGV] 1 mês (${mes}): R$ ${estoque.toLocaleString('pt-BR', {maximumFractionDigits:0})}`);
        return estoque;
      } else {
        // Múltiplos meses: SOMAR estoques de TODOS os meses filtrados
        console.log(`[ESTOQUE VGV DEBUG] Múltiplos meses: ${ord.join(', ')}`);
        console.log(`[ESTOQUE VGV DEBUG] Total de registros em dadosFiltrados: ${dadosFiltrados.length}`);
        
        const registrosPorMes = {};
        ord.forEach(m => {
          const regs = dadosFiltrados.filter(r => r["Mês"] === m);
          const estoqueDoMes = regs.reduce((s,r)=> s + (+r["Estoque VGV"]||0), 0);
          registrosPorMes[m] = {count: regs.length, estoque: estoqueDoMes};
          console.log(`[ESTOQUE VGV DEBUG] ${m}: ${regs.length} registros, Estoque = R$ ${estoqueDoMes.toLocaleString('pt-BR', {maximumFractionDigits:0})}`);
        });
        
        const estoque = dadosFiltrados.filter(r => ord.includes(r["Mês"]))
                   .reduce((s,r)=> s + (+r["Estoque VGV"]||0), 0);
        console.log(`[ESTOQUE VGV] ${ord.length} meses: SOMA total = R$ ${estoque.toLocaleString('pt-BR', {maximumFractionDigits:0})}`);
        return estoque;
      }
    }
    
    // Sem filtro de mês: pegar o último mês disponível de cada produto
    const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    
    // Criar mapa: chave = Empresa|Linha|Produto, valor = array de {mes, estoque}
    const produtoEstoques = {};
    
    dadosFiltrados.forEach(r => {
      const chave = `${r.Empresa}|${r['Linha de Produto']}|${r.Produto}`;
      const mes = r["Mês"];
      const estoque = +r["Estoque VGV"] || 0;
      
      if (!produtoEstoques[chave]) {
        produtoEstoques[chave] = {};
      }
      
      // Acumular estoque por mês (caso haja múltiplas linhas do mesmo produto/mês)
      produtoEstoques[chave][mes] = (produtoEstoques[chave][mes] || 0) + estoque;
    });
    
    // Para cada produto, pegar o estoque do último mês que existe
    let estoqueTotal = 0;
    Object.keys(produtoEstoques).forEach(chave => {
      const mesesDoProduto = produtoEstoques[chave];
      
      // Encontrar o último mês (mais recente cronologicamente)
      let ultimoMes = null;
      for (let i = MESES.length - 1; i >= 0; i--) {
        if (mesesDoProduto[MESES[i]] !== undefined) {
          ultimoMes = MESES[i];
          break;
        }
      }
      
      if (ultimoMes) {
        estoqueTotal += mesesDoProduto[ultimoMes];
      }
    });
    
    console.log(`[ESTOQUE VGV] Sem filtro de mês - Total: R$ ${estoqueTotal.toLocaleString('pt-BR', {maximumFractionDigits:0})}`);
    return estoqueTotal;
  };
})();
</script>


<script>
// ===== SAFE AUTO-LOADER (append only) =====
(function(){
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSju9gP6RC3zHnt5qHlUPuqJMKCqr2TIQ0y7RIhEhGkuUZLGjzKCp6M0kYnqmkLEKJQXNEZycZgCSv6/pub?gid=0&single=true&output=csv";

  function normalizeHeader(h){
    if (!h) return h;
    let k = String(h).replace(/\s+/g,' ').trim();
    const map = {
      "Meta VGV": " Meta VGV ",
      "Real VGV": " Real VGV ",
      "Meta Qtd": "Meta Qtd",
      "Real Qtd": "Real Qtd",
      "Estoque VGV": "Estoque VGV",
      "Estoque Qtd": "Estoque Qtd",
      "Linha": "Linha de Produto",
      "Linha de Produto": "Linha de Produto",
      "Mes": "Mês",
      "Mês": "Mês",
      "Ano": "Ano",
      "Empresa": "Empresa",
      "Produto": "Produto",
      "% VSO": "% VSO"
    };
    return map[k] || k;
  }

  function fmtMes(valor){
    const nomes = ["","Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    if (valor==null || valor==="") return valor;
    const n = Number(valor);
    if (!Number.isNaN(n) && n>=1 && n<=12) return nomes[n];
    const s = String(valor).trim();
    const idx = nomes.findIndex(x => x.toLowerCase() == s.toLowerCase());
    return idx>0 ? nomes[idx] : s;
  }

  async function carregar(){
    try {
      const resp = await fetch(CSV_URL + "&_cb=" + Date.now(), { cache: "no-store" });
      if(!resp.ok) throw new Error("HTTP " + resp.status);
      const csv = await resp.text();
      const parsed = Papa.parse(csv, { header: true, dynamicTyping: false, skipEmptyLines: true });
      const rows = parsed.data.map(row => {
        const out = {};
        Object.keys(row).forEach(key => out[ normalizeHeader(key) ] = row[key]);
        if (out["Ano"]!==undefined) out["Ano"] = Number(String(out["Ano"]).replace(/\D/g,'')) || null;
        if (out["Mês"]!==undefined) out["Mês"] = fmtMes(out["Mês"]);
        [" Meta VGV "," Real VGV ","Meta Qtd","Real Qtd","Estoque VGV","Estoque Qtd","% VSO"].forEach(k=>{
          if (out[k]!==undefined) {
            const v = (''+out[k]).trim();
            const n = Number(v.replace(/\./g,'').replace(',','.'));
            out[k] = isNaN(n) ? (Number(v) || 0) : n;
          }
        });
        return out;
      });

      console.log("[SAFE LOADER] Linhas carregadas:", rows.length);
      // Override global data used pelo painel (sem apagar estrutura original)
      window.allData = rows;

      const badge = document.getElementById("badgeLoaded");
      if (badge){
        const d=new Date(), pad=n=>String(n).padStart(2,'0');
        badge.textContent = "Atualizado em " + d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+":"+pad(d.getMinutes())+":"+pad(d.getSeconds())+" (Sheets publicado) • "+rows.length+" linhas";
        badge.style.background = rows.length ? "#0ea5e9" : "#dc2626";
      }
      // Dispara os mesmos eventos que o painel já escuta
      document.dispatchEvent(new Event('filters:changed'));
      setTimeout(()=>document.dispatchEvent(new Event('filters:changed')), 150);
      setTimeout(()=>document.dispatchEvent(new Event('filters:changed')), 500);
    } catch(e){
      console.error("[SAFE LOADER] Erro:", e);
      const badge = document.getElementById("badgeLoaded");
      if (badge){ badge.textContent = "Erro Sheets (SAFE): " + e.message; badge.style.background = "#dc2626"; }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', carregar);
  else carregar();
  setInterval(carregar, 5*60*1000);
})();
</script>

</body>
</html>
