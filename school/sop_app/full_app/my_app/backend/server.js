const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

const db = new sqlite3.Database('./pos_system.db');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/sales', (req, res) => {
    const { user_id, items, total_amount, payment_method } = req.body;
db.serialize(() => {

        db.run("BEGIN TRANSACTION");

        const saleStmt = db.prepare(`INSERT INTO sales (user_id, total_amount, payment_method) VALUES (?, ?, ?)`);
        saleStmt.run(user_id, total_amount, payment_method, function(err) {
            if (err) {
                db.run("ROLLBACK");
                return res.status(500).json({ error: "Error creating sale" });
            }
            
            const sale_id = this.lastID;

            items.forEach(item => {
                // Record the sale item [cite: 132]
                db.run(`INSERT INTO sales_items (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`, 
                    [sale_id, item.product_id, item.quantity, item.price]);

                db.run(`UPDATE products SET quantity = quantity - ? WHERE product_id = ?`, 
                    [item.quantity, item.product_id]);
            });
db.run("COMMIT");
            res.status(200).json({ message: "Sale processed successfully", sale_id });
        });
        saleStmt.finalize();
    });
});

app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.listen(PORT, () => {
    console.log(`POS Server running at http://localhost:${PORT}`);
});
