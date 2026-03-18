let cart = [];
let allProducts = [];

async function loadProducts() {
    const response = await fetch('api/products');
    allProducts = await response.json();
    renderProducts(allProducts);
}

function renderProducts(products) {
    const list = document.getElementById('product-list');
    list.innerHTML = products.map(p => `
        <div class="product-card" onclick="addToCart(${p.product_id})">
        <strong>${p.product_name}</strong><br>
        ${(p.price).toFixed(2)} | Stock: ${p.quantity}
        </div>
        `).join('');
}

function addToCart(product) {
    const product = allProducts.find(p => p.product_id == productId);
    const existing = cart.find(item => item.product_id == productId);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateInterface();
}

function updateInterface() {
    const itemsDiv = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');

    itemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
        <span>${item.product_name} X ${item.quantity}</span>
        <span>${(item.price * item.quantity).toFixed(2)} </span>
        </div>
        `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalSpan.innerText = total.toFixed(2);
}


async function processCheckout() {
    if (cart.length === 0)
        return (alert("Cart is empty!"));

    const saleData = {
        user_id: 1,
        total_amount: parseFloat(document.getElementById('cart-total').innerText),
        payment_method: document.getElementById('payment-method').value,
        items: cart.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        }))
    }

    const response = await fetch('api/sales', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(saleData)
    });

    if (response.ok) {
        alert("Sale successful! Stock updated.");
        cart = [];
        updateInterface();
        loadProducts();
    } else {
        alert("Error processing sale!");
    }
}

loadProducts();
