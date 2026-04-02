# SwiftPOS Application Logic & Documentation

This document explains the overarching structure, pages, and specific logic flows of the SwiftPOS application—with a heavy focus on the Checkout experience.

---

## 📁 Pages Overview

The application is built into several key pages, guarded by role-based authentication handled in `App.tsx` and `AuthContext.tsx`.

1. **`LoginPage.tsx`**
   - **Role:** Entry point for the application.
   - **Logic:** Authenticates users (admin, manager, cashier) against mocked credentials in the `AuthContext`.
2. **`CheckoutPage.tsx`**
   - **Role:** The core Point-Of-Sale terminal.
   - **Visibility:** All roles (admin, manager, cashier).
   - **Logic:** Handles product browsing, cart creation, global/item-level discounts, and transaction completion via Cash or Paystack (Card/Mobile Money).
3. **`InventoryPage.tsx`**
   - **Role:** Stock management screen.
   - **Visibility:** admin, manager, cashier.
   - **Logic:** Displays existing product database with low-stock threshold warnings.
4. **`CustomersPage.tsx`**
   - **Role:** Customer CRM.
   - **Visibility:** admin, manager.
   - **Logic:** Shows loyalty points, total spent, and contact details of registered customers.
5. **`AnalyticsPage.tsx`**
   - **Role:** Business intelligence.
   - **Visibility:** admin, manager.
   - **Logic:** Provides sales reports, top products, and revenue graphs.

---

## 🛒 Checkout Page Logic & Workflows

The checkout process on `CheckoutPage.tsx` is built utilizing React state to handle complex user interactions. Here is how the UI and functions work together.

### 1. Picking an item (Adding to Cart)
Items can be picked in two ways: Hand selecting from the grid or scanning a barcode.

**Relevant State:**

- `cart`: An array of objects keeping track of selected `product`, `qty`, and `discount`.

**How it works together:**

- **Clicking an item:** Invokes the `addToCart(product: Product)` function.
- **Scanning a barcode:** The `handleBarcodeSubmit(e)` function checks the `barcodeInput` state against the product database. If a match is found, it automatically calls `addToCart()`.
- **The Engine:** Inside `addToCart`, the application checks if the `cart` array already contains an item with the same ID. 
  - If **Yes**, it maps over the cart array and safely increments that item's `qty` by 1.
  - If **No**, it appends a new entry to the array with `qty: 1` and `discount: 0`.

### 2. Removing an Item
Cashiers can remove items or adjust their quantities.

**How it works together:**

- **Decreasing Quantity:** The `updateQty(id, delta)` function adds or subtracts from the quantity. It utilizes `Math.max(0, i.qty + delta)` to make sure a quantity never goes below 0. A `.filter((i) => i.qty > 0)` is chained right after. If the quantity hits zero, the item is automatically dropped from the cart.
- **Voiding Entirely:** A dedicated `voidItem(id)` removes a product outright. For security in POS systems, clicking the trash icon triggers the `voidConfirm` state, changing the UI to ask for visual confirmation (Void / Cancel) before actually dispatching `voidItem()`.

### 3. Payment Processing
The payment flow relies on local calculation paired with logical gating before allowing a successful transaction. It supports Paystack for online/digital transfers.

**Calculating Totals:**

- `subtotal`: A `.reduce()` loops over the cart calculating `(price * qty) - itemDiscount`.
- `total`: Created by subtracting the `globalDiscount` from the `subtotal`.

When the cashier chooses a payment method, the UI dynamically changes what inputs are required (`payMethod` state).

#### A. Paying with Cash

- When the `cash` tab is selected, the UI displays an input bound to the `cashGiven` state.
- **Logic:** The "Confirm Payment" button is permanently `disabled` as long as `cashGiven` is less than the required `total`.
- **Execution:** Once `cashGiven` is sufficient, the `handlePay()` function is invoked. Because it's cash, it operates purely locally. It immediately bypasses payment gateways and fires `setTransactionDone(true)`. The UI transitions to the success screen, calculating and displaying the physical `change` due to the customer mathematically `(cashGiven - total)`.

#### B. Paying with Mobile Money

- Mobile Money transactions rely on a phone number and digital validation via the Paystack API (`react-paystack`).
- **Dynamic Config:** The `config` object utilizes the `phoneNumber` state. The UI provides an input for the cashier to punch in the customer's phone number. Alternatively, if a customer was picked from the dropdown (`selectedCustomerId`), their registered phone number natively auto-fills into the active phone variable.
- **Logic:** The "Confirm Payment" button is locked until a valid-length phone number is present.
- **Execution:** When `handlePay()` fires, it detects that `payMethod` is not cash. It triggers `initializePayment({ onSuccess, onClose })`. The `react-paystack` hook takes over, opening the Paystack widget with the passed configuration, instructing Paystack to initiate a Mobile Money prompt to the customer's handset. If successful, the `onSuccess` callback fires internally, triggering `setTransactionDone(true)`.

#### C. Paying with Card

- Card works almost identically to Mobile Money, but requires a valid email strictly to send the secure receipt from Paystack.
- **Dynamic Config:** The UI watches `payMethod === "card"`. If no customer profile was selected on the screen, a new Email Address input appears to capture the walk-in's email (`emailInput` state). If an official customer was selected from the UI dropdown, it gracefully uses the customer's registered email internally.
- **Execution:** Calling `handlePay()` runs `initializePayment()` which triggers the secure Paystack card form overlay. Upon successful card charge, Paystack fires the `onSuccess` callback, and the UI shifts to the final success receipt.

### 4. Concluding the Transaction
On the Success screen, pressing "New Transaction" invokes the `newTransaction()` reset function. This wipes out the cart, discounts, cash inputs, customer selections, resets the modal overlays, and places the application cleanly back at Step 1, ready for the next customer.
