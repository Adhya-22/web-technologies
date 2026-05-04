console.log("JS loaded");

async function loadFeaturedProducts() {
    try {
        const res = await fetch("https://makeup-api.herokuapp.com/api/v1/products.json");
        const data = await res.json();

        // 👉 Filter only products with rating
        const filtered = data.filter(p => p.rating && p.image_link);

        // 👉 Sort by rating (highest first)
        const topRated = filtered.sort((a, b) => b.rating - a.rating);

        // 👉 Take only first 8 products
        const featured = topRated.slice(0, 8);

        displayFeatured(featured);

    } catch (error) {
        console.log("Error loading featured products", error);
    }
}

function displayFeatured(products) {
    const container = document.getElementById("featuredProducts");

    container.innerHTML = "";

    products.forEach(product => {
        const image = product.image_link || "https://via.placeholder.com/200";
        const price = product.price ? `₹${Math.round(product.price * 80)}` : "₹499";

        container.innerHTML += `
        <div class="product-card">

            <img src="${image}" />
            <h4>${product.name}</h4>
            <p>${price}</p>

            <button onclick="addToCart('${product.name.replace(/'/g, "\\'")}')">
                🛒 Add to Cart
            </button>

            <button onclick="addToWishlist('${product.name.replace(/'/g, "\\'")}')">
                ❤️ Wishlist
            </button>

        </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    loadFeaturedProducts();
});


function showToast(message, type) {
    const toast = document.getElementById("toast");

    toast.innerText = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function addToCart(productName) {
    showToast(productName + " is added to cart", "cart");
}

function addToWishlist(productName) {
    showToast(productName + " is added to wishlist", "wishlist");
}

document.getElementById("subscribeBtn").addEventListener("click", function () {
    const email = document.getElementById("emailInput").value.trim();

    if (email === "") {
        showToast("Please enter your email", "warning");
        return;
    }

    // Simple email validation
    if (!email.includes("@") || !email.includes(".")) {
        showToast("Enter a valid email address", "warning");
        return;
    }

    showToast("Thank you for subscribing!", "success");

    // Optional: clear input
    document.getElementById("emailInput").value = "";
});