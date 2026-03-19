import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, ShoppingCart, Award, Users, ArrowUpRight, Star } from "lucide-react";
import { weeklySalesData, topProductsData, sampleTransactions } from "../data/mockData";

const cashierStats = [
  { name: "Carol Davis", transactions: 6, revenue: 78.55, role: "Cashier", avatar: "CD" },
  { name: "David Lee", transactions: 4, revenue: 44.2, role: "Cashier", avatar: "DL" },
];

const paymentMethodData = [
  { method: "Cash", count: 4, amount: 45.85 },
  { method: "Mobile Money", count: 3, amount: 34.3 },
  { method: "Card", count: 3, amount: 42.6 },
];

export function AnalyticsPage() {
  const todayTransactions = sampleTransactions.filter(t => t.date.startsWith("2026-03-18"));
  const todayRevenue = todayTransactions.reduce((s, t) => s + t.total, 0);
  const weekRevenue = weeklySalesData.reduce((s, d) => s + d.revenue, 0);
  const avgTransaction = todayRevenue / (todayTransactions.length || 1);

  const summaryCards = [
    {
      label: "Today's Revenue",
      value: `$${todayRevenue.toFixed(2)}`,
      sub: "+12.5% vs yesterday",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "#3b82f6",
      bg: "#eff6ff",
    },
    {
      label: "Today's Transactions",
      value: todayTransactions.length,
      sub: "4 completed today",
      icon: <ShoppingCart className="w-5 h-5" />,
      color: "#10b981",
      bg: "#f0fdf4",
    },
    {
      label: "Weekly Revenue",
      value: `$${weekRevenue.toFixed(0)}`,
      sub: "Last 7 days total",
      icon: <Award className="w-5 h-5" />,
      color: "#6366f1",
      bg: "#eef2ff",
    },
    {
      label: "Avg. Transaction",
      value: `$${avgTransaction.toFixed(2)}`,
      sub: "Per sale today",
      icon: <Users className="w-5 h-5" />,
      color: "#f59e0b",
      bg: "#fefce8",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-xl p-3 shadow-lg" style={{ background: "white", border: "1px solid #e2e8f0" }}>
          <p style={{ fontWeight: 600, color: "#1e293b", marginBottom: "0.4rem" }}>{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.color, fontSize: "0.85rem" }}>
              {p.name}: {p.name === "revenue" ? `$${p.value.toFixed(2)}` : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 min-h-full" style={{ background: "#f1f5f9" }}>
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ color: "#0f172a", fontWeight: 700, fontSize: "1.5rem" }}>Analytics & Reports</h1>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.2rem" }}>
          Business performance overview — as of March 18, 2026
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #e2e8f0" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.bg, color: card.color }}>
                {card.icon}
              </div>
              <div className="flex items-center gap-1 text-xs" style={{ color: "#10b981" }}>
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span style={{ fontWeight: 600 }}>+12%</span>
              </div>
            </div>
            <p style={{ color: card.color, fontSize: "1.6rem", fontWeight: 800, lineHeight: 1 }}>{card.value}</p>
            <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginTop: "0.4rem" }}>{card.label}</p>
            <p style={{ color: "#10b981", fontSize: "0.72rem", marginTop: "0.2rem" }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Weekly sales chart */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "white", border: "1px solid #e2e8f0" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 style={{ fontWeight: 700, color: "#1e293b" }}>Weekly Sales Overview</h3>
              <p style={{ color: "#94a3b8", fontSize: "0.78rem" }}>Revenue & transactions for the past 7 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklySalesData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment methods */}
        <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "0.25rem" }}>Payment Methods</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.78rem", marginBottom: "1.25rem" }}>Today's breakdown</p>
          <div className="space-y-3">
            {paymentMethodData.map((item, idx) => {
              const total = paymentMethodData.reduce((s, i) => s + i.count, 0);
              const pct = Math.round((item.count / total) * 100);
              const colors = ["#3b82f6", "#f59e0b", "#10b981"];
              return (
                <div key={item.method}>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: "0.85rem", color: "#1e293b", fontWeight: 500 }}>{item.method}</span>
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>{pct}% · ${item.amount.toFixed(2)}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: colors[idx] }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
            <p style={{ color: "#64748b", fontSize: "0.78rem" }}>Total collected today</p>
            <p style={{ color: "#1e293b", fontWeight: 800, fontSize: "1.25rem" }}>${paymentMethodData.reduce((s, i) => s + i.amount, 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top products */}
        <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #e2e8f0" }}>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5" style={{ color: "#f59e0b" }} />
            <h3 style={{ fontWeight: 700, color: "#1e293b" }}>Top Selling Products</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topProductsData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sold" name="sold" fill="#3b82f6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cashier performance */}
        <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "0.25rem" }}>Cashier Performance</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.78rem", marginBottom: "1rem" }}>Transaction summary per cashier today</p>
          <div className="space-y-3">
            {cashierStats.map((cashier) => (
              <div key={cashier.name} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-bold" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                  {cashier.avatar}
                </div>
                <div className="flex-1">
                  <p style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>{cashier.name}</p>
                  <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{cashier.role}</p>
                </div>
                <div className="text-right">
                  <p style={{ fontWeight: 700, color: "#3b82f6", fontSize: "0.95rem" }}>${cashier.revenue.toFixed(2)}</p>
                  <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{cashier.transactions} txns</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
            <h4 style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem", marginBottom: "0.75rem" }}>Recent Transactions</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {sampleTransactions.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: "0.8rem", color: "#1e293b", fontWeight: 500 }}>{t.id}</p>
                    <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{t.cashier} · {new Date(t.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div className="text-right">
                    <p style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.85rem" }}>${t.total.toFixed(2)}</p>
                    <span className="rounded-full px-2 py-0.5 text-xs capitalize" style={{
                      background: t.paymentMethod === "cash" ? "#f0fdf4" : t.paymentMethod === "card" ? "#eff6ff" : "#fefce8",
                      color: t.paymentMethod === "cash" ? "#10b981" : t.paymentMethod === "card" ? "#3b82f6" : "#f59e0b",
                    }}>
                      {t.paymentMethod.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
