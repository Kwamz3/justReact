import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ShoppingCart,
  LayoutDashboard,
  Package,
  BarChart3,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

type Page = "checkout" | "inventory" | "analytics" | "customers";

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { id: "checkout", label: "Checkout", icon: <LayoutDashboard className="w-5 h-5" />, roles: ["admin", "manager", "cashier"] },
  { id: "inventory", label: "Inventory", icon: <Package className="w-5 h-5" />, roles: ["admin", "manager"] },
  { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" />, roles: ["admin", "manager"] },
  { id: "customers", label: "Customers", icon: <Users className="w-5 h-5" />, roles: ["admin", "manager", "cashier"] },
];

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  onPageChange: (page: Page) => void;
  onLogout: () => void;
}

const ROLE_COLORS: Record<string, string> = {
  admin: "#ef4444",
  manager: "#f59e0b",
  cashier: "#10b981",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  manager: "Manager",
  cashier: "Cashier",
};

export function Layout({ children, activePage, onPageChange, onLogout }: LayoutProps) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const accessibleNav = NAV_ITEMS.filter((item) => user && item.roles.includes(user.role));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1 }}>SwiftPOS</div>
            <div style={{ color: "#64748b", fontSize: "0.7rem", marginTop: "2px" }}>Management System</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {accessibleNav.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onPageChange(item.id); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
              style={{
                background: isActive ? "rgba(59,130,246,0.2)" : "transparent",
                color: isActive ? "#60a5fa" : "#94a3b8",
                border: isActive ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
              }}
            >
              {item.icon}
              <span style={{ fontSize: "0.9rem", fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          );
        })}
      </nav>

      {/* User info */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
            style={{ background: ROLE_COLORS[user?.role || "cashier"], fontSize: "0.75rem", fontWeight: 700 }}
          >
            {user?.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ color: "white", fontSize: "0.85rem", fontWeight: 600 }} className="truncate">{user?.name}</div>
            <div style={{ fontSize: "0.72rem", color: ROLE_COLORS[user?.role || "cashier"], fontWeight: 500 }}>
              {ROLE_LABELS[user?.role || "cashier"]}
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all"
          style={{ color: "#ef4444", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
        >
          <LogOut className="w-4 h-4" />
          <span style={{ fontSize: "0.85rem" }}>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0f172a" }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-56 flex-shrink-0"
        style={{ background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.07)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-56 flex flex-col z-50" style={{ background: "#0f172a" }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: "#f8fafc" }}>
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3" style={{ background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <span style={{ color: "white", fontWeight: 700 }}>SwiftPOS</span>
          </div>
          <button onClick={() => setMobileOpen(true)} style={{ color: "#94a3b8" }}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
