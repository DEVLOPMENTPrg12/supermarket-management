import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";

export default function Reports() {
  const [salesReport, setSalesReport] = useState([]);
  const [stockReport, setStockReport] = useState([]);
  const [profitReport, setProfitReport] = useState([]);
  const [period, setPeriod] = useState("daily"); // daily, weekly, monthly

  useEffect(() => {
    fetchReports();
  }, [period]);

  const fetchReports = async () => {
    try {
      const salesRes = await axios.get(`http://localhost:5000/api/reports/sales?period=${period}`);
      setSalesReport(salesRes.data);

      const stockRes = await axios.get("http://localhost:5000/api/reports/stock");
      setStockReport(stockRes.data);

      const profitRes = await axios.get(`http://localhost:5000/api/reports/profit?period=${period}`);
      setProfitReport(profitRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-green-800 font-semibold text-lg">Reports</h2>

      <div className="flex gap-3 mb-4">
        <button onClick={() => setPeriod("daily")} className="bg-green-500 text-white px-4 py-1 rounded">Daily</button>
        <button onClick={() => setPeriod("weekly")} className="bg-green-500 text-white px-4 py-1 rounded">Weekly</button>
        <button onClick={() => setPeriod("monthly")} className="bg-green-500 text-white px-4 py-1 rounded">Monthly</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Report */}
        <div className="bg-white p-6 rounded-xl shadow-xl border border-green-200">
          <h3 className="text-green-800 font-semibold mb-2">Sales Report ({period})</h3>
          <Line
            data={{
              labels: salesReport.map(s => s.date),
              datasets: [
                {
                  label: "Sales Amount ($)",
                  data: salesReport.map(s => s.total),
                  borderColor: "rgba(34,197,94,1)",
                  backgroundColor: "rgba(34,197,94,0.3)",
                  fill: true
                }
              ]
            }}
          />
        </div>

        {/* Stock Report */}
        <div className="bg-white p-6 rounded-xl shadow-xl border border-green-200">
          <h3 className="text-green-800 font-semibold mb-2">Stock Report</h3>
          <Bar
            data={{
              labels: stockReport.map(p => p.product),
              datasets: [
                {
                  label: "Quantity",
                  data: stockReport.map(p => p.quantity),
                  backgroundColor: "rgba(34,197,94,0.5)",
                  borderColor: "rgba(34,197,94,1)",
                  borderWidth: 1
                }
              ]
            }}
          />
        </div>

        {/* Profit Report */}
        <div className="bg-white p-6 rounded-xl shadow-xl border border-green-200 md:col-span-2">
          <h3 className="text-green-800 font-semibold mb-2">Profit Report ({period})</h3>
          <Line
            data={{
              labels: profitReport.map(p => p.date),
              datasets: [
                {
                  label: "Profit ($)",
                  data: profitReport.map(p => p.profit),
                  borderColor: "rgba(234,88,12,1)",
                  backgroundColor: "rgba(234,88,12,0.3)",
                  fill: true
                }
              ]
            }}
          />
        </div>
      </div>
    </div>
  );
}
