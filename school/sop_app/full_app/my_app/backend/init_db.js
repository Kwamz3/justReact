const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./pos_system.db');
db.serialize(() => {

    db.run(`CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password_hash TEXT,
        role TEXT CHECK(role IN ('Admin', 'Manager', 'Cashier'))
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS products (
        product_id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_name TEXT,
        category TEXT,
        price REAL,
        quantity INTEGER,
        barcode TEXT UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS sales (
        sale_id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER,
        total_amount REAL,
        payment_method TEXT,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS sales_items (
        sale_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
        sale_id INTEGER,
        product_id INTEGER,
        quantity INTEGER,
        price REAL,
        FOREIGN KEY (sale_id) REFERENCES sales(sale_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
    )`);
console.log("Database initialized with POS tables.");
});
db.close();
