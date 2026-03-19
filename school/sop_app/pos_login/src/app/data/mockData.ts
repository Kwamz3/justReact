export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  barcode: string;
  image: string;
  lowStockThreshold: number;
}

export interface CartItem {
  product: Product;
  qty: number;
  discount: number;
}

export interface Transaction {
  id: string;
  date: string;
  cashier: string;
  cashierId: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  paymentMethod: "cash" | "mobile_money" | "card";
  customerId?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
  joinDate: string;
  totalSpent: number;
}

export const CATEGORIES = ["All", "Beverages", "Snacks", "Produce", "Bakery", "Dairy", "Hot Drinks", "Household"];

export const initialProducts: Product[] = [
  {
    id: "P001",
    name: "Coca-Cola 1.5L",
    category: "Beverages",
    price: 2.5,
    quantity: 120,
    barcode: "5000112637922",
    image: "https://images.unsplash.com/photo-1698466632388-77a7495b89b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    lowStockThreshold: 20,
  },
  {
    id: "P002",
    name: "Lays Classic Chips",
    category: "Snacks",
    price: 1.75,
    quantity: 8,
    barcode: "0028400047685",
    image: "https://images.unsplash.com/photo-1762417582386-611a7f85ea63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    lowStockThreshold: 15,
  },
  {
    id: "P003",
    name: "Fresh Apple (kg)",
    category: "Produce",
    price: 3.2,
    quantity: 45,
    barcode: "2000000001234",
    image: "https://images.unsplash.com/photo-1553799262-a37c45961038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    lowStockThreshold: 10,
  },
  {
    id: "P004",
    name: "Whole Wheat Bread",
    category: "Bakery",
    price: 2.8,
    quantity: 3,
    barcode: "0012345678901",
    image: "https://images.unsplash.com/photo-1767065885755-58ee6202ae74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    lowStockThreshold: 10,
  },
  {
    id: "P005",
    name: "Full Cream Milk 1L",
    category: "Dairy",
    price: 1.9,
    quantity: 60,
    barcode: "8901234567890",
    image: "https://images.unsplash.com/photo-1685531309627-f0c9e8656ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    lowStockThreshold: 15,
  },
  {
    id: "P006",
    name: "Arabica Coffee 250g",
    category: "Hot Drinks",
    price: 6.5,
    quantity: 22,
    barcode: "7640151830019",
    image: "https://images.unsplash.com/photo-1662528567037-42551f98dfe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    lowStockThreshold: 10,
  },
  {
    id: "P007",
    name: "Orange Juice 1L",
    category: "Beverages",
    price: 3.4,
    quantity: 35,
    barcode: "5449000214911",
    image: "https://images.unsplash.com/photo-1698466632388-77a7495b89b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    lowStockThreshold: 10,
  },
  {
    id: "P008",
    name: "Pringles Original",
    category: "Snacks",
    price: 2.9,
    quantity: 18,
    barcode: "5053990104773",
    image: "https://images.unsplash.com/photo-1762417582386-611a7f85ea63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    lowStockThreshold: 10,
  },
  {
    id: "P009",
    name: "Cheddar Cheese 200g",
    category: "Dairy",
    price: 4.2,
    quantity: 5,
    barcode: "4006381333931",
    image: "https://images.unsplash.com/photo-1685531309627-f0c9e8656ff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    lowStockThreshold: 8,
  },
  {
    id: "P010",
    name: "Banana (kg)",
    category: "Produce",
    price: 1.5,
    quantity: 70,
    barcode: "2000000002345",
    image: "https://images.unsplash.com/photo-1553799262-a37c45961038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    lowStockThreshold: 15,
  },
  {
    id: "P011",
    name: "Green Tea 20 bags",
    category: "Hot Drinks",
    price: 3.1,
    quantity: 40,
    barcode: "0796433140369",
    image: "https://images.unsplash.com/photo-1662528567037-42551f98dfe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    lowStockThreshold: 10,
  },
  {
    id: "P012",
    name: "Croissant",
    category: "Bakery",
    price: 1.2,
    quantity: 12,
    barcode: "3017620425035",
    image: "https://images.unsplash.com/photo-1767065885755-58ee6202ae74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    lowStockThreshold: 10,
  },
];

export const initialCustomers: Customer[] = [
  {
    id: "C001",
    name: "Mary Williams",
    phone: "+233 24 123 4567",
    email: "mary.w@gmail.com",
    loyaltyPoints: 1250,
    joinDate: "2024-03-15",
    totalSpent: 312.5,
  },
  {
    id: "C002",
    name: "James Mensah",
    phone: "+233 20 987 6543",
    email: "james.m@yahoo.com",
    loyaltyPoints: 780,
    joinDate: "2024-06-22",
    totalSpent: 195.0,
  },
  {
    id: "C003",
    name: "Sarah Asante",
    phone: "+233 27 456 7890",
    email: "sarah.a@outlook.com",
    loyaltyPoints: 3400,
    joinDate: "2023-11-08",
    totalSpent: 850.0,
  },
  {
    id: "C004",
    name: "Kwame Boateng",
    phone: "+233 54 321 0987",
    email: "kwame.b@gmail.com",
    loyaltyPoints: 210,
    joinDate: "2025-01-12",
    totalSpent: 52.5,
  },
  {
    id: "C005",
    name: "Abena Osei",
    phone: "+233 26 654 3210",
    email: "abena.o@gmail.com",
    loyaltyPoints: 1890,
    joinDate: "2024-02-28",
    totalSpent: 472.5,
  },
  {
    id: "C006",
    name: "Kofi Antwi",
    phone: "+233 55 789 0123",
    email: "kofi.a@hotmail.com",
    loyaltyPoints: 560,
    joinDate: "2024-09-05",
    totalSpent: 140.0,
  },
];

export const sampleTransactions: Transaction[] = [
  {
    id: "T001",
    date: "2026-03-18T09:15:00",
    cashier: "Carol Davis",
    cashierId: "u3",
    items: [
      { name: "Coca-Cola 1.5L", qty: 2, price: 2.5 },
      { name: "Lays Classic Chips", qty: 1, price: 1.75 },
    ],
    total: 6.75,
    paymentMethod: "cash",
    customerId: "C001",
  },
  {
    id: "T002",
    date: "2026-03-18T10:22:00",
    cashier: "David Lee",
    cashierId: "u4",
    items: [
      { name: "Fresh Apple (kg)", qty: 2, price: 3.2 },
      { name: "Full Cream Milk 1L", qty: 1, price: 1.9 },
      { name: "Whole Wheat Bread", qty: 1, price: 2.8 },
    ],
    total: 11.1,
    paymentMethod: "mobile_money",
  },
  {
    id: "T003",
    date: "2026-03-18T11:05:00",
    cashier: "Carol Davis",
    cashierId: "u3",
    items: [
      { name: "Arabica Coffee 250g", qty: 1, price: 6.5 },
      { name: "Green Tea 20 bags", qty: 2, price: 3.1 },
    ],
    total: 12.7,
    paymentMethod: "card",
    customerId: "C003",
  },
  {
    id: "T004",
    date: "2026-03-18T12:30:00",
    cashier: "Carol Davis",
    cashierId: "u3",
    items: [
      { name: "Pringles Original", qty: 3, price: 2.9 },
      { name: "Orange Juice 1L", qty: 2, price: 3.4 },
    ],
    total: 15.5,
    paymentMethod: "cash",
  },
  {
    id: "T005",
    date: "2026-03-17T09:00:00",
    cashier: "David Lee",
    cashierId: "u4",
    items: [
      { name: "Cheddar Cheese 200g", qty: 1, price: 4.2 },
      { name: "Banana (kg)", qty: 3, price: 1.5 },
    ],
    total: 8.7,
    paymentMethod: "mobile_money",
    customerId: "C002",
  },
  {
    id: "T006",
    date: "2026-03-17T14:45:00",
    cashier: "Carol Davis",
    cashierId: "u3",
    items: [
      { name: "Coca-Cola 1.5L", qty: 4, price: 2.5 },
      { name: "Lays Classic Chips", qty: 2, price: 1.75 },
      { name: "Croissant", qty: 3, price: 1.2 },
    ],
    total: 17.1,
    paymentMethod: "cash",
    customerId: "C005",
  },
  {
    id: "T007",
    date: "2026-03-16T10:10:00",
    cashier: "David Lee",
    cashierId: "u4",
    items: [
      { name: "Full Cream Milk 1L", qty: 3, price: 1.9 },
      { name: "Whole Wheat Bread", qty: 2, price: 2.8 },
    ],
    total: 11.3,
    paymentMethod: "card",
  },
  {
    id: "T008",
    date: "2026-03-16T16:20:00",
    cashier: "Carol Davis",
    cashierId: "u3",
    items: [
      { name: "Arabica Coffee 250g", qty: 2, price: 6.5 },
      { name: "Fresh Apple (kg)", qty: 1, price: 3.2 },
    ],
    total: 16.2,
    paymentMethod: "mobile_money",
    customerId: "C001",
  },
  {
    id: "T009",
    date: "2026-03-15T08:30:00",
    cashier: "David Lee",
    cashierId: "u4",
    items: [
      { name: "Orange Juice 1L", qty: 3, price: 3.4 },
      { name: "Pringles Original", qty: 1, price: 2.9 },
    ],
    total: 13.1,
    paymentMethod: "cash",
    customerId: "C003",
  },
  {
    id: "T010",
    date: "2026-03-14T11:55:00",
    cashier: "Carol Davis",
    cashierId: "u3",
    items: [
      { name: "Banana (kg)", qty: 2, price: 1.5 },
      { name: "Cheddar Cheese 200g", qty: 1, price: 4.2 },
      { name: "Green Tea 20 bags", qty: 1, price: 3.1 },
    ],
    total: 10.3,
    paymentMethod: "card",
  },
];

export const weeklySalesData = [
  { day: "Mon", revenue: 142.5, transactions: 18 },
  { day: "Tue", revenue: 198.3, transactions: 25 },
  { day: "Wed", revenue: 167.8, transactions: 21 },
  { day: "Thu", revenue: 223.4, transactions: 29 },
  { day: "Fri", revenue: 312.6, transactions: 38 },
  { day: "Sat", revenue: 389.2, transactions: 47 },
  { day: "Sun", revenue: 275.9, transactions: 33 },
];

export const topProductsData = [
  { name: "Coca-Cola 1.5L", sold: 187, revenue: 467.5 },
  { name: "Lays Classic Chips", sold: 143, revenue: 250.25 },
  { name: "Full Cream Milk 1L", sold: 128, revenue: 243.2 },
  { name: "Fresh Apple (kg)", sold: 115, revenue: 368.0 },
  { name: "Arabica Coffee 250g", sold: 98, revenue: 637.0 },
];
