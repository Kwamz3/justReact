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
        ${p.price.to.Fixed(2)} | Stock: ${p.quantity}
        </div>
        `).join('');
}