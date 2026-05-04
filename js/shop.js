console.log("js loaded");

let allProducts = [];
let filteredProducts = [];

let visibleCount = 12;
const step = 12;
let startIndex = 50;

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// =======================
// LOAD PRODUCTS FROM API
// =======================
async function loadProducts() {
    const container = document.getElementById("productsContainer");

    try {
        container.innerHTML = "Loading products...";

        const res = await fetch("https://makeup-api.herokuapp.com/api/v1/products.json");
        const data = await res.json();

        allProducts = data;
        filteredProducts = [...allProducts];

        displayProducts();
    } catch (error) {
        container.innerHTML = "Failed to load products";
        console.error(error);
    }
}


// =======================
// DISPLAY PRODUCTS
// =======================
function displayProducts() {
    const container = document.getElementById("productsContainer");
    container.innerHTML = "";

    const productsToShow = filteredProducts.slice(startIndex, startIndex + visibleCount);

    productsToShow.forEach(product => {
        const image = product.image_link || "https://via.placeholder.com/200";
        const price = product.price ? `₹${Math.round(product.price * 80)}` : "₹499";

        container.innerHTML += `
        <div class="product-card">

            <img src="${image}" />
            <h4>${product.name}</h4>
            <p>${price}</p>

            <button onclick="addToCart('${product.name.replace(/'/g, "\\'")}', ${product.price ? Math.round(product.price * 80) : 499})">
                🛒 Add to Cart
            </button>

            <button onclick="addToWishlist('${product.name.replace(/'/g, "\\'")}')">
                ❤️ Wishlist
            </button>

        </div>
        `;
    });

    // Load more button control
    const loadBtn = document.getElementById("loadMoreBtn");
    if (startIndex + visibleCount >= filteredProducts.length) {
        loadBtn.style.display = "none";
    } else {
        loadBtn.style.display = "block";
    }
}


// =======================
// LOAD MORE
// =======================
function loadMoreProducts() {
    visibleCount += step;
    displayProducts();
}


// =======================
// FILTER STATE
// =======================
let selectedCategory = "all";
let selectedBrand = "all";
let selectedPrice = "all";
let selectedSort = "default";


// =======================
// DROPDOWN FUNCTION
// =======================
function setupDropdown(dropdownId, selectedId, optionsId, callback) {
    const dropdown = document.getElementById(dropdownId);
    const selected = document.getElementById(selectedId);
    const options = document.getElementById(optionsId);

    selected.addEventListener("click", () => {
        dropdown.classList.toggle("active");
    });

    options.querySelectorAll("div").forEach(option => {
        option.addEventListener("click", () => {
            selected.innerText = option.innerText + " ▾";
            dropdown.classList.remove("active");

            const value = option.getAttribute("data-value");
            callback(value);
        });
    });

    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove("active");
        }
    });
}


// =======================
// APPLY FILTERS
// =======================
function applyFilters() {
    let filtered = [...allProducts];

    // CATEGORY
    if (selectedCategory !== "all") {
        filtered = filtered.filter(p => p.product_type === selectedCategory);
    }

    // BRAND
    if (selectedBrand !== "all") {
        filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    // PRICE
    filtered = filtered.filter(p => {
        const price = p.price ? p.price * 80 : 499;

        if (selectedPrice === "low") return price < 500;
        if (selectedPrice === "mid") return price >= 500 && price <= 1000;
        if (selectedPrice === "high") return price > 1000;
        return true;
    });

    // SORT
    if (selectedSort === "low-high") {
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (selectedSort === "high-low") {
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    filteredProducts = filtered;
    visibleCount = 12;

    displayProducts();
}


// =======================
// SEARCH
// =======================
function searchProducts() {
    const keyword = document.getElementById("searchInput").value.toLowerCase();

    filteredProducts = allProducts.filter(product =>
        product.name && product.name.toLowerCase().includes(keyword)
    );

    visibleCount = 12;
    displayProducts();
}


// =======================
// DOM READY
// =======================
document.addEventListener("DOMContentLoaded", () => {

window.openWishlist = openWishlist;
window.closeWishlist = closeWishlist;
window.removeWishlist = removeWishlist;

    // =======================
    // TOAST FUNCTION
    // =======================
    function showToast(message, type = "") {
    const toastBox = document.getElementById("toastBox");

    const toast = document.createElement("div");
    toast.innerText = message;

    // ADD THIS LINE 👇
    toast.className = `toast show ${type}`;

    toastBox.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

    // Make functions global (for onclick)
   window.addToCart = function(productName, price = 500) {
  cart.push({ name: productName, price: price });

  localStorage.setItem("cart", JSON.stringify(cart));

  showToast(productName + " added to cart 🛒", "cart");

  renderCart();
};

window.addToWishlist = function(name) {

    // prevent duplicates
    if (wishlist.includes(name)) {
        showToast("Already in wishlist ❤️", "wishlist");
        return;
    }

    wishlist.push(name);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    showToast(`${name} added to wishlist ❤️`, "wishlist");

    renderWishlist(); // 👈 important
};
    // =======================
    // LOAD PRODUCTS
    // =======================
    loadProducts();

    // =======================
    // DROPDOWNS
    // =======================
    setupDropdown("categoryDropdown", "selectedCategory", "categoryOptions", (value) => {
        selectedCategory = value;
        applyFilters();
    });

    setupDropdown("brandDropdown", "selectedBrand", "brandOptions", (value) => {
        selectedBrand = value;
        applyFilters();
    });

    setupDropdown("priceDropdown", "selectedPrice", "priceOptions", (value) => {
        selectedPrice = value;
        applyFilters();
    });

    setupDropdown("sortDropdown", "selectedSort", "sortOptions", (value) => {
        selectedSort = value;
        applyFilters();
    });

});



function openWishlist() {
    document.getElementById("wishlistSidebar").classList.add("active");
    renderWishlist();
}

function closeWishlist() {
    document.getElementById("wishlistSidebar").classList.remove("active");
}

function renderWishlist() {
  const box = document.getElementById("wishlistItems");

  if (!box) return;

  box.innerHTML = "";

  if (wishlist.length === 0) {
    box.innerHTML = "<p style='text-align:center;'>Your wishlist is empty 💔</p>";
    return;
  }

  wishlist.forEach((item, index) => {
    const div = document.createElement("div");

    div.className = "wishlist-item";

    div.innerHTML = `
      <span>${item}</span>
      <button class="remove-btn" onclick="removeWishlist(${index})">❌</button>
    `;

    box.appendChild(div);
  });
}

function removeWishlist(index) {
    wishlist.splice(index, 1);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    renderWishlist();
}



console.log("Cart JS loaded");


// ======================
// TOAST FUNCTION
// ======================
function showToast(message) {
  const toastBox = document.getElementById("toastBox");

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  toastBox.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ======================
// ADD TO CART
// ======================
function addToCart(name, price = 500) {
  cart.push({ name, price });

  localStorage.setItem("cart", JSON.stringify(cart));

  showToast(name + " added to cart");

  renderCart();
}

// ======================
// RENDER CART
// ======================
function renderCart() {
  const box = document.getElementById("cartItems");
  const totalBox = document.getElementById("cartTotal");

  if (!box) return;

  box.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    box.innerHTML = "<p>Cart is empty</p>";
    totalBox.innerText = "Total: ₹0";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <span>${item.name}</span>
      <button class="cart-remove" onclick="removeCart(${index})">❌</button>
    `;

    box.appendChild(div);
  });

  totalBox.innerText = "Total: ₹" + total;
}

// ======================
// REMOVE ITEM
// ======================
function removeCart(index) {
  cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
}

// ======================
// OPEN / CLOSE
// ======================
function openCart() {
  document.getElementById("cartSidebar").classList.add("active");
  renderCart();
}

function closeCart() {
  document.getElementById("cartSidebar").classList.remove("active");
}

// ======================
// CHECKOUT
// ======================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("checkoutBtn");

  if (btn) {
    btn.addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Cart is empty!");
        return;
      }

      showToast("Order placed 🎉");

      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));

      renderCart();
    });
  }
});