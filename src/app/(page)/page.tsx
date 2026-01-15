import Link from 'next/link'
export default function MainPage() {
  // Dados simulados (Mock) focados em Limpeza Urbana
  const stats = {
    total: 1248,
    resolvidos: 856,
    pendentes: 392,
    bairros: 45 // Bairros de Salvador atendidos
  }

  // Lista de ocorrências recentes com bairros reais de Salvador e problemas de lixo
  const ultimasOcorrencias = [
    { id: 1, titulo: 'Descarte irregular de entulho', bairro: 'Cajazeiras', tempo: 'Há 2h', status: 'Aberto' },
    { id: 2, titulo: 'Coleta não passou no horário', bairro: 'Barra', tempo: 'Há 4h', status: 'Resolvido' },
    { id: 3, titulo: 'Lixo acumulado na praça', bairro: 'Rio Vermelho', tempo: 'Há 1 dia', status: 'Aberto' },
    { id: 4, titulo: 'Caçamba de lixo transbordando', bairro: 'Itapuã', tempo: 'Há 1 dia', status: 'Resolvido' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">

      {/* 1. HERO SECTION (Capa do Site) */}
      <header className="bg-emerald-700 text-white pt-20 pb-24 px-6 text-center shadow-lg relative overflow-hidden">
        {/* Efeito de fundo decorativo */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute right-10 top-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
           <div className="absolute left-10 bottom-10 w-40 h-40 bg-emerald-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Lixo Zero SSA
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Portal de transparência e colaboração urbana. Ajude a transformar Salvador em uma cidade mais limpa monitorando e reportando focos de sujeira.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Botão para Cidadão Comum (Ação Principal) */}
            <Link
              href="/reclamacao-add"
              className="bg-white text-emerald-800 font-bold py-4 px-8 rounded-full shadow-xl hover:bg-emerald-50 transition transform hover:-translate-y-1 w-full sm:w-auto"
            >
              📢 Registrar Problema
            </Link>

            {/* Botão para Login */}
            <Link
              href="/sign-in"
              className="flex items-center justify-center gap-2 text-white border border-emerald-400/50 bg-emerald-800/50 backdrop-blur-sm font-semibold py-4 px-8 rounded-full hover:bg-emerald-800 transition w-full sm:w-auto"
            >
              🔐 Área do Usuário / Login
            </Link>
          </div>
        </div>
      </header>

      {/* 2. PLACAR DE DADOS (Cards Flutuantes) */}
      <section className="max-w-6xl mx-auto px-6 -mt-16 w-full mb-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card Total */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border-b-4 border-blue-500 text-center transform hover:scale-105 transition duration-300">
            <span className="text-4xl block mb-2">📊</span>
            <h3 className="text-4xl font-bold text-gray-800">{stats.total}</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Ocorrências Totais</p>
          </div>

          {/* Card Resolvidos */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border-b-4 border-emerald-500 text-center transform hover:scale-105 transition duration-300">
            <span className="text-4xl block mb-2">✅</span>
            <h3 className="text-4xl font-bold text-emerald-600">{stats.resolvidos}</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Casos Resolvidos</p>
          </div>

          {/* Card Pendentes */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border-b-4 border-amber-500 text-center transform hover:scale-105 transition duration-300">
            <span className="text-4xl block mb-2">⚠️</span>
            <h3 className="text-4xl font-bold text-amber-500">{stats.pendentes}</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Em Análise</p>
          </div>

          {/* Card Bairros */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border-b-4 border-purple-500 text-center transform hover:scale-105 transition duration-300">
            <span className="text-4xl block mb-2">🏙️</span>
            <h3 className="text-4xl font-bold text-purple-600">{stats.bairros}</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Bairros Atendidos</p>
          </div>
        </div>
      </section>

      {/* 3. CONTEÚDO PRINCIPAL: Feed e Mapa */}
      <main className="flex-grow max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 pb-20">

        {/* Coluna da Esquerda: Feed de Atualizações */}
        <div>
          <div className="flex items-center justify-between mb-6 border-b pb-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-emerald-600">♻️</span> Últimas Atualizações
            </h2>
            <Link href="/reclamacao-list" className="text-emerald-600 hover:text-emerald-800 hover:underline text-sm font-medium transition">
              Ver todas &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {ultimasOcorrencias.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center justify-between group">
                <div>
                  <h4 className="font-bold text-gray-800 group-hover:text-emerald-700 transition">{item.titulo}</h4>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <span>📍 {item.bairro}</span>
                    <span>•</span>
                    <span>🕒 {item.tempo}</span>
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  item.status === 'Resolvido'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna da Direita: Mapa Ilustrativo (Conceito do Heatmap) */}
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 flex flex-col justify-center items-center text-center border border-emerald-100 shadow-inner">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-md mb-6 animate-pulse">
            🗺️
          </div>

          {/* Texto adaptado para Lixo/Entulho */}
          <h3 className="text-xl font-bold text-emerald-900 mb-3">Mapeamento de Pontos Viciados</h3>
          <p className="text-gray-600 mb-8 max-w-sm leading-relaxed text-sm">
            Nossa tecnologia utiliza geolocalização para identificar áreas com recorrência de descarte irregular de entulho e lixo, permitindo atuação preventiva.
          </p>

          {/* Mini Gráfico Visual - Adaptado para o Tema Lixo */}
          <div className="w-full max-w-xs space-y-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase text-left">Maiores Problemas (Hoje)</h4>

            <div className="flex items-center text-xs text-gray-600 gap-2">
              <span className="w-24 font-medium truncate">Descarte Entulho</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-[75%] rounded-full"></div>
              </div>
              <span className="font-bold">75%</span>
            </div>

            <div className="flex items-center text-xs text-gray-600 gap-2">
              <span className="w-24 font-medium truncate">Coleta Atrasada</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 w-[40%] rounded-full"></div>
              </div>
              <span className="font-bold">40%</span>
            </div>

            <div className="flex items-center text-xs text-gray-600 gap-2">
              <span className="w-24 font-medium truncate">Limpeza de Praça</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[25%] rounded-full"></div>
              </div>
              <span className="font-bold">25%</span>
            </div>
          </div>
        </div>
      </main>

      {/* 4. RODAPÉ */}
      <footer className="bg-white border-t border-gray-200 py-10 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-emerald-800 font-bold text-lg mb-2">Lixo Zero SSA</p>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Projeto TCC - Dropplace Mobile. <br/>
            Tecnologia desenvolvida para cidadania e sustentabilidade.
          </p>
        </div>
      </footer>
    </div>
  )
}
