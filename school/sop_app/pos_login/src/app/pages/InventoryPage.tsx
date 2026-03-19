import { useState } from "react";
import { Plus, Search, Edit2, Trash2, X, Package, AlertTriangle, CheckCircle2, ChevronUp, ChevronDown } from "lucide-react";
import { initialProducts, Product, CATEGORIES } from "../data/mockData";

type SortKey = "id" | "name" | "category" | "price" | "quantity";
type SortDir = "asc" | "desc";

const BLANK_PRODUCT: Omit<Product, "id"> = {
  name: "",
  category: "Beverages",
  price: 0,
  quantity: 0,
  barcode: "",
  image: "https://images.unsplash.com/photo-1698466632388-77a7495b89b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  lowStockThreshold: 10,
};

export function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, "id">>(BLANK_PRODUCT);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode.includes(search);
      const matchCat = filterCat === "All" || p.category === filterCat;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = typeof aVal === "string" ? aVal.localeCompare(String(bVal)) : Number(aVal) - Number(bVal);
      return sortDir === "asc" ? cmp : -cmp;
    });

  const openAdd = () => {
    setEditingProduct(null);
    setFormData(BLANK_PRODUCT);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({ name: p.name, category: p.category, price: p.price, quantity: p.quantity, barcode: p.barcode, image: p.image, lowStockThreshold: p.lowStockThreshold });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p));
    } else {
      const newId = `P${String(products.length + 1).padStart(3, "0")}`;
      setProducts(prev => [...prev, { id: newId, ...formData }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
  };

  const getStockStatus = (p: Product) => {
    if (p.quantity === 0) return { label: "Out of Stock", color: "#ef4444", bg: "#fef2f2", icon: <X className="w-3 h-3" /> };
    if (p.quantity <= p.lowStockThreshold) return { label: "Low Stock", color: "#f59e0b", bg: "#fefce8", icon: <AlertTriangle className="w-3 h-3" /> };
    return { label: "In Stock", color: "#10b981", bg: "#f0fdf4", icon: <CheckCircle2 className="w-3 h-3" /> };
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (sortDir === "asc" ? <ChevronUp className="w-3 h-3 inline ml-1" /> : <ChevronDown className="w-3 h-3 inline ml-1" />) : null;

  const inStock = products.filter(p => p.quantity > p.lowStockThreshold).length;
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold).length;
  const outOfStock = products.filter(p => p.quantity === 0).length;

  return (
    <div className="p-6 min-h-full" style={{ background: "#f1f5f9" }}>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color: "#0f172a", fontWeight: 700, fontSize: "1.5rem" }}>Inventory Management</h1>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.2rem" }}>Manage your product catalog and stock levels</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
          style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white", fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Products", value: products.length, color: "#3b82f6", bg: "#eff6ff" },
          { label: "In Stock", value: inStock, color: "#10b981", bg: "#f0fdf4" },
          { label: "Low Stock", value: lowStock, color: "#f59e0b", bg: "#fefce8" },
          { label: "Out of Stock", value: outOfStock, color: "#ef4444", bg: "#fef2f2" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4" style={{ background: "white", border: "1px solid #e2e8f0" }}>
            <p style={{ color: "#64748b", fontSize: "0.8rem" }}>{stat.label}</p>
            <p style={{ color: stat.color, fontSize: "1.75rem", fontWeight: 800, lineHeight: 1.2, marginTop: "0.25rem" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "white", border: "1px solid #e2e8f0" }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: "#94a3b8" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, or barcode..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#1e293b" }}
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-xl px-4 py-2.5 appearance-none outline-none text-sm"
          style={{ background: "white", border: "1px solid #e2e8f0", color: "#1e293b", minWidth: 140 }}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid #e2e8f0" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                {[
                  { label: "Product ID", key: "id" as SortKey },
                  { label: "Name", key: "name" as SortKey },
                  { label: "Category", key: "category" as SortKey },
                  { label: "Price", key: "price" as SortKey },
                  { label: "Quantity", key: "quantity" as SortKey },
                  { label: "Status", key: null },
                  { label: "Actions", key: null },
                ].map(({ label, key }) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-left"
                    style={{ color: "#64748b", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", cursor: key ? "pointer" : "default" }}
                    onClick={key ? () => handleSort(key) : undefined}
                  >
                    {label}
                    {key && <SortIcon k={key} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, idx) => {
                const status = getStockStatus(product);
                return (
                  <tr key={product.id} style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #f1f5f9" : "none" }} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="rounded-lg px-2 py-1 text-xs font-mono" style={{ background: "#f1f5f9", color: "#64748b" }}>{product.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                        <div>
                          <p style={{ color: "#1e293b", fontWeight: 600, fontSize: "0.85rem" }}>{product.name}</p>
                          <p style={{ color: "#94a3b8", fontSize: "0.72rem" }}>{product.barcode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: "#f1f5f9", color: "#475569" }}>{product.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ color: "#1e293b", fontWeight: 700 }}>${product.price.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ color: "#1e293b", fontWeight: 600 }}>{product.quantity}</span>
                      <span style={{ color: "#94a3b8", fontSize: "0.72rem", marginLeft: "4px" }}>units</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: status.bg, color: status.color }}>
                        {status.icon}
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ background: "#eff6ff", color: "#3b82f6" }}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {deleteConfirm === product.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(product.id)} className="text-xs px-2 py-1 rounded-lg" style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca" }}>Delete</button>
                            <button onClick={() => setDeleteConfirm(null)} className="text-xs px-2 py-1 rounded-lg" style={{ background: "#f1f5f9", color: "#64748b" }}>Cancel</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                            style={{ background: "#fef2f2", color: "#ef4444" }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Package className="w-10 h-10" style={{ color: "#cbd5e1" }} />
              <p style={{ color: "#94a3b8" }}>No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ background: "white" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontWeight: 700, color: "#1e293b", fontSize: "1.1rem" }}>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" style={{ color: "#94a3b8" }} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Product Name", key: "name", type: "text", placeholder: "e.g. Coca-Cola 1.5L" },
                { label: "Barcode", key: "barcode", type: "text", placeholder: "e.g. 5000112637922" },
                { label: "Price ($)", key: "price", type: "number", placeholder: "e.g. 2.50" },
                { label: "Quantity", key: "quantity", type: "number", placeholder: "e.g. 100" },
                { label: "Low Stock Threshold", key: "lowStockThreshold", type: "number", placeholder: "e.g. 10" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 500, display: "block", marginBottom: "0.3rem" }}>{label}</label>
                  <input
                    type={type}
                    value={String(formData[key as keyof typeof formData])}
                    onChange={(e) => setFormData(prev => ({ ...prev, [key]: type === "number" ? parseFloat(e.target.value) || 0 : e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-xl px-4 py-2.5 outline-none text-sm"
                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b" }}
                  />
                </div>
              ))}
              <div>
                <label style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 500, display: "block", marginBottom: "0.3rem" }}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-xl px-4 py-2.5 outline-none text-sm appearance-none"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b" }}
                >
                  {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl" style={{ background: "#f1f5f9", color: "#64748b", fontWeight: 500 }}>Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white", fontWeight: 600 }}>
                {editingProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
