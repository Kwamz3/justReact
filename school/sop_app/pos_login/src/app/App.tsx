import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { Layout } from "./components/Layout";
import { CheckoutPage } from "./pages/CheckoutPage";
import { InventoryPage } from "./pages/InventoryPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { CustomersPage } from "./pages/CustomersPage";

type Page = "checkout" | "inventory" | "analytics" | "customers";

function AppContent() {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState<Page>("checkout");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn || !user) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setActivePage("checkout");
  };

  // Role-based page guard
  const canAccess = (page: Page): boolean => {
    if (page === "analytics" || page === "customers") {
      return user.role === "admin" || user.role === "manager";
    }
    return true;
  };

  const safePage = canAccess(activePage) ? activePage : "checkout";

  const renderPage = () => {
    switch (safePage) {
      case "checkout": return <CheckoutPage />;
      case "inventory": return <InventoryPage />;
      case "analytics": return <AnalyticsPage />;
      case "customers": return <CustomersPage />;
      default: return <CheckoutPage />;
    }
  };

  return (
    <Layout
      activePage={safePage}
      onPageChange={(page) => {
        if (canAccess(page)) setActivePage(page);
      }}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
