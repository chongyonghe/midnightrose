document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.querySelector("tbody");
    const cartTotalDisplay = document.querySelector(".cart-total strong");
    const subtotalDisplay = document.querySelector(".cart-subtotal strong");
    const checkoutButton = document.querySelector(".btn-dark.w-100");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartDisplay() {
        if (!cartContainer) return;

        cartContainer.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = `<tr><td colspan="5" class="text-center">Your cart is empty.</td></tr>`;
            subtotalDisplay.textContent = "RM0.00";
            cartTotalDisplay.textContent = "RM0.00";
            localStorage.removeItem("cart"); // ✅ Clear cart data
            return;
        }

        cart.forEach((item, index) => {
            let itemTotal = item.price * item.quantity;
            total += itemTotal;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${item.img}" alt="${item.name}" width="50"> ${item.name}</td>
                <td>RM${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" class="form-control cart-qty" value="${item.quantity}" min="1" data-index="${index}">
                </td>
                <td>RM${itemTotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button>
                </td>
            `;
            cartContainer.appendChild(row);
        });

        subtotalDisplay.textContent = `RM${total.toFixed(2)}`;
        cartTotalDisplay.textContent = `RM${total.toFixed(2)}`;
        localStorage.setItem("cart", JSON.stringify(cart)); // ✅ Update localStorage after modifying cart
    }

    // Handle quantity update
    if (cartContainer) {
        cartContainer.addEventListener("input", function (event) {
            if (event.target.classList.contains("cart-qty")) {
                const index = event.target.dataset.index;
                cart[index].quantity = parseInt(event.target.value);
                localStorage.setItem("cart", JSON.stringify(cart)); // ✅ Save changes to localStorage
                updateCartDisplay();
            }
        });

        // Remove item from cart
        cartContainer.addEventListener("click", function (event) {
            if (event.target.classList.contains("remove-item")) {
                const index = event.target.dataset.index;
                cart.splice(index, 1); // Remove item from cart array
                localStorage.setItem("cart", JSON.stringify(cart)); // ✅ Update localStorage
                updateCartDisplay();
            }
        });
    }

    // Checkout button functionality
    if (checkoutButton) {
        checkoutButton.addEventListener("click", function () {
            const name = document.getElementById("name").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const address = document.getElementById("address").value.trim();
            const date = document.getElementById("date").value;
            
            if (!name || !phone || !address || !date) {
                alert("Please fill in all required fields!");
                return;
            }

            alert("Order placed successfully!");
            localStorage.removeItem("cart");
            window.location.href = "thankyou.html";
        });
    }

    // Function to add items to cart
    function addToCart(name, price, img, quantity) {
        cart = JSON.parse(localStorage.getItem("cart")) || [];

        let existingItemIndex = cart.findIndex(item => item.name === name);

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity = quantity; // ✅ Reset quantity
        } else {
            cart.push({ name, price: parseFloat(price), img, quantity });
        }

        localStorage.setItem("cart", JSON.stringify(cart)); // ✅ Save cart data
        updateCartDisplay(); // ✅ Update UI immediately
    }

    // Add to Cart button
    const addToCartBtn = document.querySelector(".add-to-cart");
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", function () {
            const name = this.dataset.name;
            const price = this.dataset.price;
            const img = this.dataset.img;
            const quantity = parseInt(document.querySelector(".quantity input").value);

            addToCart(name, price, img, quantity);
            alert("✅ Item added to cart!");
        });
    }

    // Buy Now button
    const buyNowBtn = document.querySelector(".buy-now");
    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", function () {
            const name = this.dataset.name;
            const price = this.dataset.price;
            const img = this.dataset.img;
            const quantity = parseInt(document.querySelector(".quantity input").value);

            addToCart(name, price, img, quantity);
            window.location.href = "cart.html"; // Redirect to cart page
        });
    }

    updateCartDisplay();
});
