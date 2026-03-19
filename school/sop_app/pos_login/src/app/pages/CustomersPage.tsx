import { useState } from "react";
import { Search, UserPlus, Edit2, Star, Phone, Mail, X, Users, TrendingUp, Award, Gift } from "lucide-react";
import { initialCustomers, Customer } from "../data/mockData";

const BLANK_CUSTOMER: Omit<Customer, "id" | "loyaltyPoints" | "joinDate" | "totalSpent"> = {
  name: "",
  phone: "",
  email: "",
};

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState(BLANK_CUSTOMER);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [addPointsModal, setAddPointsModal] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState("");

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
  });

  const openAdd = () => {
    setEditingCustomer(null);
    setFormData(BLANK_CUSTOMER);
    setShowModal(true);
  };

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFormData({ name: c.name, phone: c.phone, email: c.email });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, ...formData } : c));
    } else {
      const newId = `C${String(customers.length + 1).padStart(3, "0")}`;
      setCustomers(prev => [...prev, {
        id: newId,
        ...formData,
        loyaltyPoints: 0,
        joinDate: new Date().toISOString().split("T")[0],
        totalSpent: 0,
      }]);
    }
    setShowModal(false);
  };

  const handleAddPoints = () => {
    const pts = parseInt(pointsToAdd) || 0;
    if (selectedCustomer && pts > 0) {
      setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? { ...c, loyaltyPoints: c.loyaltyPoints + pts } : c));
      setSelectedCustomer(prev => prev ? { ...prev, loyaltyPoints: prev.loyaltyPoints + pts } : null);
    }
    setAddPointsModal(false);
    setPointsToAdd("");
  };

  const getTierInfo = (pts: number) => {
    if (pts >= 3000) return { tier: "Gold", color: "#f59e0b", bg: "#fefce8", icon: "🥇" };
    if (pts >= 1000) return { tier: "Silver", color: "#64748b", bg: "#f1f5f9", icon: "🥈" };
    return { tier: "Bronze", color: "#b45309", bg: "#fef3c7", icon: "🥉" };
  };

  const totalCustomers = customers.length;
  const totalPoints = customers.reduce((s, c) => s + c.loyaltyPoints, 0);
  const goldMembers = customers.filter(c => c.loyaltyPoints >= 3000).length;
  const newThisMonth = customers.filter(c => c.joinDate.startsWith("2026")).length;

  return (
    <div className="flex h-full overflow-hidden" style={{ background: "#f1f5f9" }}>
      {/* Left: Customer list */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 flex-shrink-0">
          <div>
            <h1 style={{ color: "#0f172a", fontWeight: 700, fontSize: "1.5rem" }}>Customer Management</h1>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.2rem" }}>Manage loyalty members and customer profiles</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white", fontWeight: 600 }}
          >
            <UserPlus className="w-4 h-4" />
            New Customer
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5 flex-shrink-0">
          {[
            { label: "Total Customers", value: totalCustomers, icon: <Users className="w-4 h-4" />, color: "#3b82f6", bg: "#eff6ff" },
            { label: "Gold Members", value: goldMembers, icon: <Award className="w-4 h-4" />, color: "#f59e0b", bg: "#fefce8" },
            { label: "New This Year", value: newThisMonth, icon: <TrendingUp className="w-4 h-4" />, color: "#10b981", bg: "#f0fdf4" },
            { label: "Total Points", value: totalPoints.toLocaleString(), icon: <Star className="w-4 h-4" />, color: "#6366f1", bg: "#eef2ff" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-3" style={{ background: "white", border: "1px solid #e2e8f0" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: stat.bg, color: stat.color }}>
                {stat.icon}
              </div>
              <p style={{ color: stat.color, fontWeight: 800, fontSize: "1.3rem", lineHeight: 1 }}>{stat.value}</p>
              <p style={{ color: "#94a3b8", fontSize: "0.72rem", marginTop: "0.2rem" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4 flex-shrink-0" style={{ background: "white", border: "1px solid #e2e8f0" }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: "#94a3b8" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, email, or ID..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#1e293b" }}
          />
        </div>

        {/* Customer cards */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-3 pb-2">
            {filtered.map((customer) => {
              const tier = getTierInfo(customer.loyaltyPoints);
              const isSelected = selectedCustomer?.id === customer.id;
              return (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(isSelected ? null : customer)}
                  className="rounded-xl p-4 cursor-pointer transition-all"
                  style={{
                    background: "white",
                    border: isSelected ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                    transform: isSelected ? "scale(1.005)" : "scale(1)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                      style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                    >
                      {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.9rem" }}>{customer.name}</p>
                        <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: tier.bg, color: tier.color }}>
                          {tier.icon} {tier.tier}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1" style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                          <Phone className="w-3 h-3" />{customer.phone}
                        </span>
                        <span className="flex items-center gap-1" style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                          <Mail className="w-3 h-3" />{customer.email}
                        </span>
                      </div>
                    </div>

                    {/* Points & actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Star className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
                          <span style={{ fontWeight: 700, color: "#f59e0b", fontSize: "0.9rem" }}>{customer.loyaltyPoints.toLocaleString()}</span>
                        </div>
                        <p style={{ color: "#94a3b8", fontSize: "0.7rem" }}>pts · ${customer.totalSpent.toFixed(0)} spent</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(customer); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "#eff6ff", color: "#3b82f6" }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 gap-2">
                <Users className="w-10 h-10" style={{ color: "#e2e8f0" }} />
                <p style={{ color: "#94a3b8" }}>No customers found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Customer detail panel */}
      {selectedCustomer && (
        <div className="w-80 flex-shrink-0 flex flex-col overflow-hidden" style={{ background: "white", borderLeft: "1px solid #e2e8f0" }}>
          <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <h3 style={{ fontWeight: 700, color: "#1e293b" }}>Customer Profile</h3>
            <button onClick={() => setSelectedCustomer(null)}><X className="w-4 h-4" style={{ color: "#94a3b8" }} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {/* Avatar */}
            <div className="text-center mb-5">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-white font-bold text-xl mb-3"
                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
              >
                {selectedCustomer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <h2 style={{ fontWeight: 700, color: "#1e293b" }}>{selectedCustomer.name}</h2>
              <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Member since {new Date(selectedCustomer.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
              <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold mt-2" style={{ background: getTierInfo(selectedCustomer.loyaltyPoints).bg, color: getTierInfo(selectedCustomer.loyaltyPoints).color }}>
                {getTierInfo(selectedCustomer.loyaltyPoints).icon} {getTierInfo(selectedCustomer.loyaltyPoints).tier} Member
              </span>
            </div>

            {/* Loyalty points */}
            <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)", border: "1px solid #fcd34d" }}>
              <Star className="w-6 h-6 mx-auto mb-1" style={{ color: "#f59e0b" }} />
              <p style={{ fontSize: "2rem", fontWeight: 800, color: "#92400e", lineHeight: 1 }}>{selectedCustomer.loyaltyPoints.toLocaleString()}</p>
              <p style={{ color: "#b45309", fontSize: "0.8rem", marginTop: "0.2rem" }}>Loyalty Points</p>
              <p style={{ color: "#d97706", fontSize: "0.72rem", marginTop: "0.5rem" }}>
                ≈ ${(selectedCustomer.loyaltyPoints * 0.01).toFixed(2)} redeemable value
              </p>
            </div>

            {/* Tier progress */}
            <div className="rounded-xl p-3 mb-4" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div className="flex justify-between mb-2">
                <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Progress to next tier</span>
                <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                  {selectedCustomer.loyaltyPoints < 1000
                    ? `${1000 - selectedCustomer.loyaltyPoints} pts to Silver`
                    : selectedCustomer.loyaltyPoints < 3000
                    ? `${3000 - selectedCustomer.loyaltyPoints} pts to Gold`
                    : "Max tier reached! 🥇"}
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#e2e8f0" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (selectedCustomer.loyaltyPoints / (selectedCustomer.loyaltyPoints >= 3000 ? 3000 : selectedCustomer.loyaltyPoints >= 1000 ? 3000 : 1000)) * 100)}%`,
                    background: "linear-gradient(90deg, #f59e0b, #f97316)",
                  }}
                />
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-2 mb-4">
              <h4 style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact Details</h4>
              {[
                { icon: <Phone className="w-4 h-4" />, label: "Phone", value: selectedCustomer.phone },
                { icon: <Mail className="w-4 h-4" />, label: "Email", value: selectedCustomer.email },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: "#f8fafc" }}>
                  <div style={{ color: "#94a3b8" }}>{icon}</div>
                  <div>
                    <p style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{label}</p>
                    <p style={{ fontSize: "0.85rem", color: "#1e293b", fontWeight: 500 }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total spent */}
            <div className="rounded-xl p-3 mb-4" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <p style={{ fontSize: "0.78rem", color: "#16a34a" }}>Total Lifetime Spend</p>
              <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "#15803d" }}>${selectedCustomer.totalSpent.toFixed(2)}</p>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => setAddPointsModal(true)}
                className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2"
                style={{ background: "#fef3c7", color: "#d97706", border: "1px solid #fde68a", fontWeight: 600 }}
              >
                <Gift className="w-4 h-4" />
                Add Loyalty Points
              </button>
              <button
                onClick={() => openEdit(selectedCustomer)}
                className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2"
                style={{ background: "#eff6ff", color: "#3b82f6", border: "1px solid #bfdbfe", fontWeight: 600 }}
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="rounded-2xl p-6 w-96" style={{ background: "white" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontWeight: 700, color: "#1e293b", fontSize: "1.1rem" }}>
                {editingCustomer ? "Edit Customer" : "Register New Customer"}
              </h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" style={{ color: "#94a3b8" }} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "e.g. John Doe" },
                { label: "Phone Number", key: "phone", type: "tel", placeholder: "e.g. +233 24 123 4567" },
                { label: "Email Address", key: "email", type: "email", placeholder: "e.g. john@example.com" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 500, display: "block", marginBottom: "0.3rem" }}>{label}</label>
                  <input
                    type={type}
                    value={String(formData[key as keyof typeof formData])}
                    onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-xl px-4 py-2.5 outline-none text-sm"
                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b" }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl" style={{ background: "#f1f5f9", color: "#64748b", fontWeight: 500 }}>Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white", fontWeight: 600 }}>
                {editingCustomer ? "Save Changes" : "Register"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Points Modal */}
      {addPointsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="rounded-2xl p-6 w-80" style={{ background: "white" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontWeight: 700, color: "#1e293b" }}>Add Loyalty Points</h3>
              <button onClick={() => setAddPointsModal(false)}><X className="w-5 h-5" style={{ color: "#94a3b8" }} /></button>
            </div>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1rem" }}>
              Adding points to: <strong>{selectedCustomer?.name}</strong>
            </p>
            <input
              type="number"
              value={pointsToAdd}
              onChange={(e) => setPointsToAdd(e.target.value)}
              placeholder="Number of points to add"
              min={1}
              className="w-full rounded-xl px-4 py-3 outline-none mb-4"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b" }}
            />
            <div className="flex gap-2">
              <button onClick={() => setAddPointsModal(false)} className="flex-1 py-2.5 rounded-xl" style={{ background: "#f1f5f9", color: "#64748b" }}>Cancel</button>
              <button onClick={handleAddPoints} className="flex-1 py-2.5 rounded-xl" style={{ background: "#f59e0b", color: "white", fontWeight: 600 }}>Add Points</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
