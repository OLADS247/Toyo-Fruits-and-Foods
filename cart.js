/* =========================================================
   TOYO FOODS & FRUITS
   CART PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   CART STORAGE
========================================================= */

let cart = [];

try {

    cart =
        JSON.parse(
            localStorage.getItem("toyoCart")
        ) || [];

} catch (error) {

    console.error(
        "Could not load cart:",
        error
    );

    cart = [];

}


/* =========================================================
   DOM ELEMENTS
========================================================= */

const cartItemsList =
    document.getElementById("cart-items-list");

const emptyCart =
    document.getElementById("empty-cart");

const cartItemCount =
    document.getElementById("cart-item-count");

const cartCount =
    document.getElementById("cart-count");

const cartSubtotal =
    document.getElementById("cart-subtotal");

const cartGrandTotal =
    document.getElementById("cart-grand-total");

const checkoutButton =
    document.getElementById("checkout-button");


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderCart();

    }
);


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    if (!cartItemsList) {
        return;
    }


    cartItemsList.innerHTML = "";


    if (cart.length === 0) {

        showEmptyCart();

        return;

    }


    if (emptyCart) {

        emptyCart.style.display =
            "none";

    }


    cartItemsList.style.display =
        "flex";


    cart.forEach(
        function (item, index) {

            const cartItem =
                createCartItem(
                    item,
                    index
                );


            cartItemsList.appendChild(
                cartItem
            );

        }
    );


    updateCartTotals();

    enableCheckout();

}


/* =========================================================
   CREATE CART ITEM
========================================================= */

function createCartItem(item, index) {

    const article =
        document.createElement("article");


    article.className =
        "cart-item";


    const price =
        Number(item.price) || 0;


    const quantity =
        Number(item.quantity) || 1;


    const itemTotal =
        price * quantity;


    article.innerHTML = `

        <div class="cart-item-image">

            <div class="cart-food-placeholder">
                🍽️
            </div>

        </div>


        <div class="cart-item-details">

            <span class="cart-item-category">
                TOYO FOODS & FRUITS
            </span>

            <h3>
                ${escapeHTML(item.name)}
            </h3>

            <p class="cart-item-price">
                ₦${price.toLocaleString()} each
            </p>


            <div class="cart-item-actions">


                <div class="quantity-control">

                    <button
                        type="button"
                        class="quantity-btn"
                        data-action="decrease"
                        data-index="${index}"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>


                    <span class="quantity-value">
                        ${quantity}
                    </span>


                    <button
                        type="button"
                        class="quantity-btn"
                        data-action="increase"
                        data-index="${index}"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>

                </div>


                <button
                    type="button"
                    class="remove-item"
                    data-action="remove"
                    data-index="${index}"
                >
                    Remove
                </button>

            </div>

        </div>


        <div class="cart-item-total">

            <strong>
                ₦${itemTotal.toLocaleString()}
            </strong>

        </div>

    `;


    const buttons =
        article.querySelectorAll(
            "button"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const action =
                        button.dataset.action;


                    const itemIndex =
                        Number(
                            button.dataset.index
                        );


                    if (
                        action === "increase"
                    ) {

                        increaseQuantity(
                            itemIndex
                        );

                    }


                    if (
                        action === "decrease"
                    ) {

                        decreaseQuantity(
                            itemIndex
                        );

                    }


                    if (
                        action === "remove"
                    ) {

                        removeItem(
                            itemIndex
                        );

                    }

                }
            );

        }
    );


    return article;

}


/* =========================================================
   INCREASE QUANTITY
========================================================= */

function increaseQuantity(index) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity =
        Number(cart[index].quantity) + 1;


    saveCart();

    renderCart();

}


/* =========================================================
   DECREASE QUANTITY
========================================================= */

function decreaseQuantity(index) {

    if (!cart[index]) {
        return;
    }


    const quantity =
        Number(cart[index].quantity);


    if (quantity <= 1) {

        removeItem(index);

        return;

    }


    cart[index].quantity =
        quantity - 1;


    saveCart();

    renderCart();

}


/* =========================================================
   REMOVE ITEM
========================================================= */

function removeItem(index) {

    if (!cart[index]) {
        return;
    }


    const removedItem =
        cart[index].name;


    cart.splice(
        index,
        1
    );


    saveCart();

    renderCart();


    showCartNotification(
        `${removedItem} removed from your cart.`
    );

}


/* =========================================================
   UPDATE TOTALS
========================================================= */

function updateCartTotals() {

    const totalItems =
        cart.reduce(
            function (total, item) {

                return total +
                    (Number(item.quantity) || 0);

            },
            0
        );


    const subtotal =
        cart.reduce(
            function (total, item) {

                const price =
                    Number(item.price) || 0;

                const quantity =
                    Number(item.quantity) || 0;

                return total +
                    (price * quantity);

            },
            0
        );


    if (cartItemCount) {

        cartItemCount.textContent =
            `${totalItems} ${
                totalItems === 1
                    ? "item"
                    : "items"
            }`;

    }


    if (cartCount) {

        cartCount.textContent =
            totalItems;

    }


    if (cartSubtotal) {

        cartSubtotal.textContent =
            subtotal.toLocaleString();

    }


    if (cartGrandTotal) {

        cartGrandTotal.textContent =
            subtotal.toLocaleString();

    }


    localStorage.setItem(
        "toyoCartSubtotal",
        String(subtotal)
    );

}


/* =========================================================
   EMPTY CART
========================================================= */

function showEmptyCart() {

    if (cartItemsList) {

        cartItemsList.innerHTML = "";

        cartItemsList.style.display =
            "none";

    }


    if (emptyCart) {

        emptyCart.style.display =
            "flex";

    }


    if (cartItemCount) {

        cartItemCount.textContent =
            "0 items";

    }


    if (cartCount) {

        cartCount.textContent =
            "0";

    }


    if (cartSubtotal) {

        cartSubtotal.textContent =
            "0";

    }


    if (cartGrandTotal) {

        cartGrandTotal.textContent =
            "0";

    }


    disableCheckout();

}


/* =========================================================
   ENABLE CHECKOUT
========================================================= */

function enableCheckout() {

    if (!checkoutButton) {
        return;
    }


    checkoutButton.classList.remove(
        "disabled"
    );


    checkoutButton.removeAttribute(
        "aria-disabled"
    );


    checkoutButton.href =
        "checkout.html";

}


/* =========================================================
   DISABLE CHECKOUT
========================================================= */

function disableCheckout() {

    if (!checkoutButton) {
        return;
    }


    checkoutButton.classList.add(
        "disabled"
    );


    checkoutButton.setAttribute(
        "aria-disabled",
        "true"
    );


    checkoutButton.href =
        "products.html";

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    localStorage.setItem(
        "toyoCart",
        JSON.stringify(cart)
    );

}


/* =========================================================
   NOTIFICATION
========================================================= */

function showCartNotification(message) {

    const existing =
        document.querySelector(
            ".cart-notification"
        );


    if (existing) {
        existing.remove();
    }


    const notification =
        document.createElement("div");


    notification.className =
        "cart-notification";


    notification.textContent =
        message;


    document.body.appendChild(
        notification
    );


    setTimeout(
        function () {

            if (notification) {
                notification.remove();
            }

        },
        2500
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}