import { useState, useRef, useEffect } from "react";
import {
  Search, Barcode, ShoppingBag, Trash2, Plus, Minus,
  Tag, CreditCard, Banknote, Smartphone, X, CheckCircle, Receipt
} from "lucide-react";
import { initialProducts, Product, CartItem } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES, Customer } from "../data/mockData";
import { usePaystackPayment } from "react-paystack";

type PaymentMethod = "cash" | "mobile_money" | "card";

export function CheckoutPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showPayModal, setShowPayModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountItem, setDiscountItem] = useState<string | null>(null);
  const [discountValue, setDiscountValue] = useState("");
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>("cash");
  const [cashGiven, setCashGiven] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [transactionDone, setTransactionDone] = useState(false);
  const [voidConfirm, setVoidConfirm] = useState<string | null>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search);
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1, discount: 0 }];
    });
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.barcode === barcodeInput.trim());
    if (product) {
      addToCart(product);
      setBarcodeInput("");
    } else {
      setBarcodeInput("");
    }
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => i.product.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
        .filter((i) => i.qty > 0)
    );
  };

  const voidItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
    setVoidConfirm(null);
  };

  const applyItemDiscount = () => {
    const val = parseFloat(discountValue);
    if (isNaN(val) || val < 0 || val > 100) return;
    setCart((prev) =>
      prev.map((i) => i.product.id === discountItem ? { ...i, discount: val } : i)
    );
    setShowDiscountModal(false);
    setDiscountItem(null);
    setDiscountValue("");
  };

  const subtotal = cart.reduce((sum, i) => {
    const itemPrice = i.product.price * i.qty * (1 - i.discount / 100);
    return sum + itemPrice;
  }, 0);

  const globalDiscountAmt = subtotal * (globalDiscount / 100);
  const total = subtotal - globalDiscountAmt;
  const cashGivenNum = parseFloat(cashGiven) || 0;
  const change = cashGivenNum - total;

  const config = {
    reference: (new Date()).getTime().toString(),
    email: "customer@example.com",
    amount: Math.round(total * 100), // Paystack expects amount in lowest denomination (e.g. kobo)
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "", 
    phone: phoneNumber,
    currency: "GHS", // uncomment to enforce a currency, defaults to account currency
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    setTransactionDone(true);
  };

  const onClose = () => {
    // optional: add logic for modal close without payment
  };

  const handlePay = () => {
    if (payMethod === "cash") {
      setTransactionDone(true);
    } else {
      if (!config.publicKey || config.publicKey === "pk_test_...") {
        alert("Please set your Paystack valid test public key in the .env file before checking out.");
        return;
      }
      initializePayment({ onSuccess, onClose });
    }
  };

  const newTransaction = () => {
    setCart([]);
    setGlobalDiscount(0);
    setTransactionDone(false);
    setShowPayModal(false);
    setCashGiven("");
    setPhoneNumber("");
    setPayMethod("cash");
  };

  const displayCats = CATEGORIES.filter(c => c !== "Household");

  return (
    <div className="flex h-full overflow-hidden" style={{ background: "#f1f5f9" }}>
      {/* Left: Product panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden p-4 gap-3">
        {/* Barcode + search bar */}
        <div className="flex gap-2">
          <form onSubmit={handleBarcodeSubmit} className="flex items-center gap-2 rounded-xl px-3 py-2.5 flex-shrink-0" style={{ background: "white", border: "2px solid #3b82f6", width: 240 }}>
            <Barcode className="w-4 h-4 flex-shrink-0" style={{ color: "#3b82f6" }} />
            <input
              ref={barcodeRef}
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Scan barcode..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "#1e293b", minWidth: 0 }}
            />
          </form>
          <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "white", border: "1px solid #e2e8f0" }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: "#94a3b8" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "#1e293b" }}
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0" style={{ scrollbarWidth: "none" }}>
          {displayCats.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-3 py-1.5 rounded-lg whitespace-nowrap text-sm flex-shrink-0 transition-all"
              style={{
                background: selectedCategory === cat ? "#3b82f6" : "white",
                color: selectedCategory === cat ? "white" : "#64748b",
                border: selectedCategory === cat ? "1px solid #3b82f6" : "1px solid #e2e8f0",
                fontWeight: selectedCategory === cat ? 600 : 400,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 pb-2">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="rounded-xl overflow-hidden text-left transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
                style={{ background: "white", border: "1px solid #e2e8f0" }}
              >
                <div className="relative h-28 overflow-hidden" style={{ background: "#f8fafc" }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.quantity <= product.lowStockThreshold && (
                    <div className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca" }}>
                      Low
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <div className="text-xs font-semibold truncate" style={{ color: "#1e293b" }}>{product.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span style={{ color: "#3b82f6", fontWeight: 700, fontSize: "0.9rem" }}>${product.price.toFixed(2)}</span>
                    <span style={{ color: "#94a3b8", fontSize: "0.7rem" }}>Qty: {product.quantity}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <ShoppingBag className="w-8 h-8" style={{ color: "#cbd5e1" }} />
              <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart panel */}
      <div className="w-80 xl:w-96 flex flex-col flex-shrink-0" style={{ background: "white", borderLeft: "1px solid #e2e8f0" }}>
        {/* Cart header */}
        <div className="px-4 py-3 flex items-center justify-between flex-shrink-0" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" style={{ color: "#3b82f6" }} />
            <span style={{ fontWeight: 700, color: "#1e293b" }}>Current Sale</span>
          </div>
          <span className="rounded-full px-2.5 py-0.5 text-sm font-semibold" style={{ background: "#eff6ff", color: "#3b82f6" }}>
            {cart.reduce((s, i) => s + i.qty, 0)} items
          </span>
        </div>

        {/* Cashier info */}
        <div className="px-4 py-2 flex-shrink-0" style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
            Cashier: <strong style={{ color: "#1e293b" }}>{user?.name}</strong> &bull; {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <ShoppingBag className="w-10 h-10" style={{ color: "#e2e8f0" }} />
              <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Cart is empty</p>
              <p style={{ color: "#cbd5e1", fontSize: "0.75rem" }}>Tap a product or scan a barcode</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.product.id} className="rounded-xl p-3" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "#1e293b" }}>{item.product.name}</p>
                      <p style={{ color: "#64748b", fontSize: "0.75rem" }}>
                        ${item.product.price.toFixed(2)} each
                        {item.discount > 0 && <span style={{ color: "#f59e0b", marginLeft: 4 }}>-{item.discount}% off</span>}
                      </p>
                    </div>
                    <div style={{ color: "#3b82f6", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0 }}>
                      ${(item.product.price * item.qty * (1 - item.discount / 100)).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.product.id, -1)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ background: "#e2e8f0" }}>
                        <Minus className="w-3 h-3" style={{ color: "#64748b" }} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold" style={{ color: "#1e293b" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.product.id, 1)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ background: "#e2e8f0" }}>
                        <Plus className="w-3 h-3" style={{ color: "#64748b" }} />
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setDiscountItem(item.product.id); setDiscountValue(String(item.discount)); setShowDiscountModal(true); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: "#fef3c7" }}
                        title="Apply discount"
                      >
                        <Tag className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
                      </button>
                      {voidConfirm === item.product.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => voidItem(item.product.id)} className="text-xs px-2 py-1 rounded-lg" style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca" }}>Void</button>
                          <button onClick={() => setVoidConfirm(null)} className="text-xs px-2 py-1 rounded-lg" style={{ background: "#f1f5f9", color: "#64748b" }}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setVoidConfirm(item.product.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#fef2f2" }}>
                          <Trash2 className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals & actions */}
        <div className="flex-shrink-0 px-4 py-3" style={{ borderTop: "1px solid #e2e8f0" }}>
          {/* Global discount */}
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4" style={{ color: "#f59e0b" }} />
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Order Discount:</span>
            <div className="flex items-center gap-1 ml-auto">
              {[0, 5, 10, 15, 20].map((d) => (
                <button
                  key={d}
                  onClick={() => setGlobalDiscount(d)}
                  className="px-2 py-1 rounded-lg text-xs"
                  style={{
                    background: globalDiscount === d ? "#fef3c7" : "#f1f5f9",
                    color: globalDiscount === d ? "#f59e0b" : "#64748b",
                    border: globalDiscount === d ? "1px solid #fde68a" : "1px solid transparent",
                    fontWeight: globalDiscount === d ? 600 : 400,
                  }}
                >
                  {d === 0 ? "None" : `${d}%`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 mb-3">
            <div className="flex justify-between text-sm" style={{ color: "#64748b" }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {globalDiscount > 0 && (
              <div className="flex justify-between text-sm" style={{ color: "#f59e0b" }}>
                <span>Discount ({globalDiscount}%)</span>
                <span>-${globalDiscountAmt.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2" style={{ borderTop: "1px solid #e2e8f0" }}>
              <span style={{ fontWeight: 700, color: "#1e293b", fontSize: "1rem" }}>Total</span>
              <span style={{ fontWeight: 800, color: "#3b82f6", fontSize: "1.25rem" }}>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => cart.length > 0 && setShowPayModal(true)}
            disabled={cart.length === 0}
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all"
            style={{
              background: cart.length > 0 ? "linear-gradient(135deg, #3b82f6, #6366f1)" : "#e2e8f0",
              color: cart.length > 0 ? "white" : "#94a3b8",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: cart.length > 0 ? "pointer" : "not-allowed",
            }}
          >
            <CreditCard className="w-5 h-5" />
            Pay ${total.toFixed(2)}
          </button>
        </div>
      </div>

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="rounded-2xl p-6 w-80" style={{ background: "white" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontWeight: 700, color: "#1e293b" }}>Apply Item Discount</h3>
              <button onClick={() => setShowDiscountModal(false)}><X className="w-5 h-5" style={{ color: "#94a3b8" }} /></button>
            </div>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1rem" }}>
              Item: <strong>{cart.find(i => i.product.id === discountItem)?.product.name}</strong>
            </p>
            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder="Discount % (0-100)"
              min={0}
              max={100}
              className="w-full rounded-xl px-4 py-3 outline-none mb-4"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b" }}
            />
            <div className="flex gap-2">
              <button onClick={() => setShowDiscountModal(false)} className="flex-1 py-2.5 rounded-xl" style={{ background: "#f1f5f9", color: "#64748b" }}>Cancel</button>
              <button onClick={applyItemDiscount} className="flex-1 py-2.5 rounded-xl" style={{ background: "#f59e0b", color: "white", fontWeight: 600 }}>Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="rounded-2xl p-6 w-96 max-h-[90vh] overflow-y-auto" style={{ background: "white" }}>
            {transactionDone ? (
              <div className="text-center py-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#d1fae5" }}>
                  <CheckCircle className="w-10 h-10" style={{ color: "#10b981" }} />
                </div>
                <h3 style={{ fontWeight: 700, color: "#1e293b", fontSize: "1.25rem" }}>Payment Successful!</h3>
                <p style={{ color: "#64748b", marginTop: "0.5rem" }}>Transaction completed successfully</p>
                <div className="my-4 py-4 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <p style={{ color: "#64748b", fontSize: "0.85rem" }}>Total Charged</p>
                  <p style={{ color: "#3b82f6", fontWeight: 800, fontSize: "1.75rem" }}>${total.toFixed(2)}</p>
                  {payMethod === "cash" && cashGivenNum >= total && (
                    <p style={{ color: "#10b981", fontSize: "0.9rem", marginTop: "0.5rem" }}>Change: <strong>${change.toFixed(2)}</strong></p>
                  )}
                  <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "0.5rem", textTransform: "capitalize" }}>
                    via {payMethod.replace("_", " ")}
                  </p>
                </div>
                <button
                  onClick={newTransaction}
                  className="w-full py-3 rounded-xl flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white", fontWeight: 600 }}
                >
                  <Receipt className="w-4 h-4" />
                  New Transaction
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 style={{ fontWeight: 700, color: "#1e293b", fontSize: "1.1rem" }}>Select Payment Method</h3>
                  <button onClick={() => setShowPayModal(false)}><X className="w-5 h-5" style={{ color: "#94a3b8" }} /></button>
                </div>

                {/* Order summary */}
                <div className="rounded-xl p-4 mb-4" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Items ({cart.reduce((s, i) => s + i.qty, 0)})</span>
                    <span style={{ color: "#64748b", fontSize: "0.85rem" }}>${subtotal.toFixed(2)}</span>
                  </div>
                  {globalDiscount > 0 && (
                    <div className="flex justify-between mb-1">
                      <span style={{ color: "#f59e0b", fontSize: "0.85rem" }}>Discount</span>
                      <span style={{ color: "#f59e0b", fontSize: "0.85rem" }}>-${globalDiscountAmt.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2" style={{ borderTop: "1px solid #e2e8f0" }}>
                    <span style={{ fontWeight: 700, color: "#1e293b" }}>Total Due</span>
                    <span style={{ fontWeight: 800, color: "#3b82f6", fontSize: "1.1rem" }}>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment method buttons */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { id: "cash" as PaymentMethod, label: "Cash", icon: <Banknote className="w-6 h-6" />, color: "#10b981" },
                    { id: "mobile_money" as PaymentMethod, label: "Mobile Money", icon: <Smartphone className="w-6 h-6" />, color: "#f59e0b" },
                    { id: "card" as PaymentMethod, label: "Card", icon: <CreditCard className="w-6 h-6" />, color: "#3b82f6" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPayMethod(method.id)}
                      className="rounded-xl py-4 flex flex-col items-center gap-2 transition-all"
                      style={{
                        background: payMethod === method.id ? `${method.color}15` : "#f8fafc",
                        border: payMethod === method.id ? `2px solid ${method.color}` : "2px solid #e2e8f0",
                        color: payMethod === method.id ? method.color : "#64748b",
                      }}
                    >
                      {method.icon}
                      <span style={{ fontSize: "0.75rem", fontWeight: payMethod === method.id ? 600 : 400 }}>{method.label}</span>
                    </button>
                  ))}
                </div>

                {payMethod === "cash" && (
                  <div className="mb-4">
                    <label style={{ color: "#64748b", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>Cash Given</label>
                    <input
                      type="number"
                      value={cashGiven}
                      onChange={(e) => setCashGiven(e.target.value)}
                      placeholder={`Min. $${total.toFixed(2)}`}
                      className="w-full rounded-xl px-4 py-3 outline-none"
                      style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b" }}
                    />
                    {cashGivenNum >= total && cashGivenNum > 0 && (
                      <p style={{ color: "#10b981", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                        Change: <strong>${change.toFixed(2)}</strong>
                      </p>
                    )}
                  </div>
                )}
                {payMethod === "mobile_money" && (
                  <div className="mb-4">
                    <label style={{ color: "#64748b", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. +233 54 123 4567"
                      className="w-full rounded-xl px-4 py-3 outline-none"
                      style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b" }}
                    />
                  </div>
                )}

                <button
                  onClick={handlePay}
                  disabled={(payMethod === "cash" && cashGivenNum < total && cashGiven !== "") || (payMethod === "mobile_money" && phoneNumber.length < 9)}
                  className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  <CheckCircle className="w-5 h-5" />
                  Confirm Payment
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
