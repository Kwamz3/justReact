import { useState } from "react";
import { useAuth, Role } from "../context/AuthContext";
import { ShoppingCart, Eye, EyeOff, Lock, User, ChevronDown } from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("cashier");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const success = login(username, password, role);
    setLoading(false);
    if (success) {
      onLoginSuccess();
    } else {
      setError("Invalid credentials. Please check your username, password, and role.");
    }
  };

  const fillDemo = (r: Role) => {
    setRole(r);
    if (r === "admin") { setUsername("admin"); setPassword("admin123"); }
    else if (r === "manager") { setUsername("manager"); setPassword("manager123"); }
    else { setUsername("cashier"); setPassword("cashier123"); }
    setError("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #22d3ee, transparent)" }} />
      </div>

      <div className="w-full max-w-md px-4 relative z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white" style={{ fontSize: "1.75rem", fontWeight: 700 }}>SwiftPOS</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "0.25rem" }}>Point of Sale Management System</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <h2 className="text-white mb-1" style={{ fontSize: "1.25rem", fontWeight: 600 }}>Welcome back</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selection */}
            <div>
              <label style={{ color: "#cbd5e1", fontSize: "0.85rem", fontWeight: 500, display: "block", marginBottom: "0.4rem" }}>
                Access Role
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full rounded-xl px-4 py-3 appearance-none pr-10 focus:outline-none focus:ring-2"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#f1f5f9",
                    fontSize: "0.9rem",
                  }}
                >
                  <option value="cashier" style={{ background: "#1e293b" }}>Cashier</option>
                  <option value="manager" style={{ background: "#1e293b" }}>Manager</option>
                  <option value="admin" style={{ background: "#1e293b" }}>Administrator</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#94a3b8" }} />
              </div>
            </div>

            {/* Username */}
            <div>
              <label style={{ color: "#cbd5e1", fontSize: "0.85rem", fontWeight: 500, display: "block", marginBottom: "0.4rem" }}>
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#94a3b8" }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="w-full rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#f1f5f9",
                    fontSize: "0.9rem",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ color: "#cbd5e1", fontSize: "0.85rem", fontWeight: 500, display: "block", marginBottom: "0.4rem" }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#94a3b8" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:ring-2"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#f1f5f9",
                    fontSize: "0.9rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#94a3b8" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 flex items-center justify-center gap-2 mt-2 transition-opacity"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.95rem",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p style={{ color: "#64748b", fontSize: "0.8rem", textAlign: "center", marginBottom: "0.75rem" }}>
              Quick Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["admin", "manager", "cashier"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => fillDemo(r)}
                  className="rounded-lg py-2 px-2 text-center capitalize transition-all hover:scale-105"
                  style={{
                    background: role === r ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.05)",
                    border: role === r ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.1)",
                    color: role === r ? "#a5b4fc" : "#94a3b8",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p style={{ color: "#475569", fontSize: "0.78rem", textAlign: "center", marginTop: "1.5rem" }}>
          SwiftPOS v2.0 &bull; Secure Access Portal
        </p>
      </div>
    </div>
  );
}
