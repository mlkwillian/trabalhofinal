"use client";

import React from "react";

export default function RelatorioAuditoria() {
  const dados = [
    {
      ambiente: "Almoxarifado Principal",
      total: 174,
      conformes: 139,
      atencao: 28,
      criticos: 7,
    },
    {
      ambiente: "Cozinha Industrial",
      total: 174,
      conformes: 142,
      atencao: 24,
      criticos: 8,
    },
    {
      ambiente: "Laboratório de Análises",
      total: 174,
      conformes: 137,
      atencao: 25,
      criticos: 12,
    },
  ];

  const exportarCSV = () => {
    const headers = ["Ambiente", "Total", "Conformes", "Atenção", "Críticos"];

    const rows = dados.map((d) => [
      d.ambiente,
      d.total,
      d.conformes,
      d.atencao,
      d.criticos,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(";")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "relatorio_auditoria.csv";
    link.click();
  };

  return (
    <div className="p-8 space-y-8">
<h1 style={{color: "red"}}>RELATORIO NOVO 🔥</h1>
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Relatório de Auditoria</h1>
          <p className="text-gray-500 text-sm">
            Histórico completo e análise de conformidade
          </p>
        </div>

        <button
          onClick={exportarCSV}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition"
        >
          ⬇ Exportar Relatório
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card title="Total" value="522" />
        <Card title="Conformes" value="418" color="text-green-600" />
        <Card title="Atenção" value="77" color="text-yellow-500" />
        <Card title="Críticos" value="27" color="text-red-500" />
        <Card title="Taxa" value="80.1%" destaque />
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Conformidade por Ambiente
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="text-left py-2">Ambiente</th>
              <th>Total</th>
              <th>Conformes</th>
              <th>Atenção</th>
              <th>Críticos</th>
            </tr>
          </thead>

          <tbody>
            {dados.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.ambiente}</td>
                <td>{item.total}</td>
                <td className="text-green-600">{item.conformes}</td>
                <td className="text-yellow-500">{item.atencao}</td>
                <td className="text-red-500">{item.criticos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 🔹 COMPONENTE CARD
function Card({ title, value, color, destaque }) {
  return (
    <div
      className={`p-4 rounded-xl shadow-sm ${
        destaque ? "bg-blue-100" : "bg-white"
      }`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );
}