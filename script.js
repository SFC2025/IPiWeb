const products = [
  { id: 1, name: "Sweater Roma", code: "ART. 5700", category: "Sweaters", price: 12750, status: "Disponible" },
  { id: 2, name: "Sweater Milano", code: "ART. 5701", category: "Sweaters", price: 12750, status: "Disponible" },
  { id: 3, name: "Buzo Street", code: "ART. 5703", category: "Buzos", price: 26000, status: "Disponible" },
  { id: 4, name: "Remera Basic", code: "ART. 5704", category: "Remeras", price: 12000, status: "Disponible" },
  { id: 5, name: "Remera Oversize", code: "ART. 5726", category: "Remeras", price: 14500, status: "Agotado" },
  { id: 6, name: "Campera Urban", code: "ART. 5727", category: "Camperas", price: 45000, status: "Disponible" },
  { id: 7, name: "Pantalón Cargo", code: "ART. 7210", category: "Pantalones", price: 31000, status: "Disponible" },
  { id: 8, name: "Jogger Classic", code: "ART. 7211", category: "Pantalones", price: 28500, status: "Disponible" },
  { id: 9, name: "Sweater Nordic", code: "ART. 7214", category: "Sweaters", price: 21000, status: "Disponible" },
  { id: 10, name: "Buzo Essential", code: "ART. 7215", category: "Buzos", price: 24500, status: "Agotado" },
  { id: 11, name: "Gorra NP", code: "ART. 7216", category: "Accesorios", price: 12000, status: "Disponible" },
  { id: 12, name: "Campera Denim", code: "ART. 7217", category: "Camperas", price: 42000, status: "Disponible" }
];

const productsGrid = document.getElementById("productsGrid");
const productCount = document.getElementById("productCount");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");

const overlay = document.getElementById("overlay");

const productModal = document.getElementById("productModal");
const productModalBody = document.getElementById("productModalBody");
const closeProductModal = document.getElementById("closeProductModal");

const infoBtn = document.getElementById("infoBtn");
const infoModal = document.getElementById("infoModal");
const closeInfoModal = document.getElementById("closeInfoModal");
const acceptInfoBtn = document.getElementById("acceptInfoBtn");

const cartPanel = document.getElementById("cartPanel");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");

const subtotalText = document.getElementById("subtotalText");
const discountText = document.getElementById("discountText");
const totalText = document.getElementById("totalText");

const clientName = document.getElementById("clientName");
const clientDni = document.getElementById("clientDni");
const sellerSelect = document.getElementById("sellerSelect");

const confirmOrderBtn = document.getElementById("confirmOrderBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");

let currentCategory = "Todos";
let cart = [];

const money = (value) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);
};

function renderProducts() {
  let filtered = [...products];

  const searchValue = searchInput.value.toLowerCase().trim();

  if (currentCategory !== "Todos") {
    filtered = filtered.filter(product => product.category === currentCategory);
  }

  if (searchValue) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchValue) ||
      product.code.toLowerCase().includes(searchValue)
    );
  }

  const sortValue = sortSelect.value;

  if (sortValue === "nameAsc") filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sortValue === "nameDesc") filtered.sort((a, b) => b.name.localeCompare(a.name));
  if (sortValue === "priceAsc") filtered.sort((a, b) => a.price - b.price);
  if (sortValue === "priceDesc") filtered.sort((a, b) => b.price - a.price);
  if (sortValue === "catAsc") filtered.sort((a, b) => a.category.localeCompare(b.category));
  if (sortValue === "catDesc") filtered.sort((a, b) => b.category.localeCompare(a.category));

  productCount.textContent = `${filtered.length} de ${products.length} productos`;

  productsGrid.innerHTML = filtered.map(product => {
    const isSoldOut = product.status === "Agotado";

    return `
      <article class="product-card ${isSoldOut ? "sold-out" : ""}">
        <div class="product-img">
          <img src="img/sueterejemplo.png" alt="${product.name}">
          <span class="badge">${product.category}</span>
          <span class="status ${isSoldOut ? "out" : "available"}">${product.status}</span>
        </div>

        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="code">${product.code}</p>
          <p class="price">${money(product.price)}</p>

          <div class="card-actions">
            <button class="small-btn secondary" onclick="openProductModal(${product.id})">Ver detalle</button>
            <button class="small-btn" onclick="quickAddToCart(${product.id})" ${isSoldOut ? "disabled" : ""}>
              Agregar
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function setCategory(category) {
  currentCategory = category;

  document.querySelectorAll(".category-btn, .chip").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });

  renderProducts();
}

function openProductModal(productId) {
  const product = products.find(item => item.id === productId);
  const isSoldOut = product.status === "Agotado";

  productModalBody.innerHTML = `
    <div class="modal-product">
      <img src="img/sueterejemplo.png" alt="${product.name}">

      <div>
        <span class="badge-static">${product.category}</span>
        <h2>${product.name}</h2>
        <p class="code">${product.code}</p>
        <p class="price">${money(product.price)}</p>
        <p>Prenda seleccionada para venta mayorista. Ideal para locales, revendedores y showroom.</p>

        <div class="modal-fields">
          <label>
            Talle
            <select id="modalSize">
              <option value="S">S</option>
              <option value="M" selected>M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </label>

          <label>
            Cantidad
            <input type="number" id="modalQty" value="1" min="1">
          </label>
        </div>

        <button class="btn btn--dark" onclick="addModalProductToCart(${product.id})" ${isSoldOut ? "disabled" : ""}>
          ${isSoldOut ? "Producto agotado" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  `;

  openModal(productModal);
}

function addModalProductToCart(productId) {
  const size = document.getElementById("modalSize").value;
  const qty = Number(document.getElementById("modalQty").value);

  addToCart(productId, size, qty);
  closeAll();
  openCart();
}

function quickAddToCart(productId) {
  addToCart(productId, "M", 1);
  openCart();
}

function addToCart(productId, size, qty) {
  const product = products.find(item => item.id === productId);

  if (!product || product.status === "Agotado") return;

  const existing = cart.find(item => item.id === productId && item.size === size);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      ...product,
      size,
      qty
    });
  }

  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">El carrito está vacío</p>`;
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="img/sueterejemplo.png" alt="${item.name}">

        <div>
          <h4>${item.name}</h4>
          <p>${item.code} | Talle: ${item.size}</p>
          <p>Precio: ${money(item.price)}</p>
          <p>Subtotal: <strong>${money(item.price * item.qty)}</strong></p>

          <div class="cart-controls">
            <button onclick="decreaseQty(${item.id}, '${item.size}')">-</button>
            <strong>${item.qty}</strong>
            <button onclick="increaseQty(${item.id}, '${item.size}')">+</button>
            <button class="remove" onclick="removeFromCart(${item.id}, '${item.size}')">Eliminar</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  updateTotals();
}

function increaseQty(productId, size) {
  const item = cart.find(product => product.id === productId && product.size === size);
  item.qty++;
  renderCart();
}

function decreaseQty(productId, size) {
  const item = cart.find(product => product.id === productId && product.size === size);

  if (item.qty > 1) {
    item.qty--;
  } else {
    removeFromCart(productId, size);
    return;
  }

  renderCart();
}

function removeFromCart(productId, size) {
  cart = cart.filter(product => !(product.id === productId && product.size === size));
  renderCart();
}

function getCartTotals() {
  const itemsQty = cart.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = itemsQty >= 6 ? subtotal * 0.10 : 0;
  const total = subtotal - discount;

  return { itemsQty, subtotal, discount, total };
}

function updateTotals() {
  const { itemsQty, subtotal, discount, total } = getCartTotals();

  cartCount.textContent = itemsQty;
  subtotalText.textContent = money(subtotal);
  discountText.textContent = `-${money(discount)}`;
  totalText.textContent = money(total);
}

function clearCart() {
  cart = [];
  renderCart();
}

function confirmOrder() {
  if (cart.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  const name = clientName.value.trim();
  const dni = clientDni.value.trim();
  const seller = sellerSelect.value;

  if (!name) {
    alert("Completá tu nombre y apellido o empresa.");
    return;
  }

  if (!dni) {
    alert("Completá tu DNI/CUIT.");
    return;
  }

  if (!seller) {
    alert("Elegí un vendedor.");
    return;
  }

  const { subtotal, discount, total } = getCartTotals();

  const orderLines = cart.map(item => {
    return `- ${item.name} / ${item.code} / Talle ${item.size} / Cantidad ${item.qty} / Precio unitario ${money(item.price)} / Subtotal ${money(item.price * item.qty)}`;
  }).join("\n");

  const message = `
Hola Nacho Pirola, quiero confirmar este pedido mayorista:

Cliente:
Nombre / Empresa: ${name}
DNI/CUIT: ${dni}

Pedido:
${orderLines}

Subtotal: ${money(subtotal)}
Descuento aplicado: -${money(discount)}
Total final: ${money(total)}

Vendedor seleccionado: ${seller}

Aclaración:
Los precios no incluyen IVA.
  `.trim();

  const phone = "5493424494726";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
}

function openCart() {
  cartPanel.classList.add("active");
  overlay.classList.add("active");
}

function closeCart() {
  cartPanel.classList.remove("active");
  overlay.classList.remove("active");
}

function openModal(modal) {
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeAll() {
  productModal.classList.remove("active");
  infoModal.classList.remove("active");
  cartPanel.classList.remove("active");
  overlay.classList.remove("active");
}

document.querySelectorAll(".category-btn, .chip").forEach(btn => {
  btn.addEventListener("click", () => setCategory(btn.dataset.category));
});

clearFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  sortSelect.value = "default";
  setCategory("Todos");
});

sortSelect.addEventListener("change", renderProducts);
searchInput.addEventListener("input", renderProducts);

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);

clearCartBtn.addEventListener("click", clearCart);
confirmOrderBtn.addEventListener("click", confirmOrder);

infoBtn.addEventListener("click", () => openModal(infoModal));
closeInfoModal.addEventListener("click", closeAll);
acceptInfoBtn.addEventListener("click", closeAll);

closeProductModal.addEventListener("click", closeAll);
overlay.addEventListener("click", closeAll);

renderProducts();
renderCart();