/* =========================================================
   TOYO FOODS & FRUITS
   PRODUCTS / MENU JAVASCRIPT
========================================================= */


/* =========================================================
   CART STORAGE
========================================================= */

let cart = [];

try {
    cart = JSON.parse(
        localStorage.getItem("toyoCart")
    ) || [];
} catch (error) {
    console.error("Could not load cart:", error);
    cart = [];
}


/* =========================================================
   DOM ELEMENTS
========================================================= */

const searchInput =
    document.getElementById("search-input");

const searchButton =
    document.getElementById("search-btn");

const categoryButtons =
    document.querySelectorAll(".category-filter");

const cartCount =
    document.getElementById("cart-count");

const cartItems =
    document.getElementById("cart-items");

const cartTotal =
    document.getElementById("cart-total");


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartUI();

        setupCategoryFilters();

        setupSearch();

        setupAddToCartButtons();

    }
);


/* =========================================================
   ADD TO CART BUTTONS
========================================================= */

function setupAddToCartButtons() {

    const buttons =
        document.querySelectorAll(".add-cart");


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const productCard =
                    button.closest(".product-card");


                if (!productCard) {
                    return;
                }


                const productName =
                    button.dataset.product ||
                    productCard.dataset.name ||
                    productCard.querySelector("h3")?.textContent.trim();


                const productPrice =
                    getProductPrice(productCard);


                if (!productName) {

                    console.error(
                        "Product name is missing."
                    );

                    return;
                }


                if (productPrice <= 0) {

                    console.error(
                        `Invalid price for ${productName}`
                    );

                    return;
                }


                addToCart(
                    productName,
                    productPrice
                );

            }
        );

    });

}


/* =========================================================
   GET PRODUCT PRICE
========================================================= */

function getProductPrice(productCard) {

    if (!productCard) {
        return 0;
    }


    const priceElement =
        productCard.querySelector(".price");


    if (!priceElement) {
        return 0;
    }


    const priceText =
        priceElement.textContent;


    const numbers =
        priceText.match(/[\d,]+/g);


    if (!numbers || numbers.length === 0) {
        return 0;
    }


    const firstPrice =
        numbers[0].replace(/,/g, "");


    const price =
        Number(firstPrice);


    return Number.isFinite(price)
        ? price
        : 0;

}


/* =========================================================
   ADD ITEM TO CART
========================================================= */

function addToCart(name, price) {

    const existingItem =
        cart.find(function (item) {

            return item.name === name;

        });


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            name: name,

            price: price,

            quantity: 1

        });

    }


    saveCart();

    updateCartUI();

    showAddedMessage(name);

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
   UPDATE CART UI
========================================================= */

function updateCartUI() {

    const totalItems =
        cart.reduce(
            function (total, item) {

                return total +
                    Number(item.quantity || 0);

            },
            0
        );


    const totalPrice =
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


    /* NAVBAR CART COUNT */

    if (cartCount) {

        cartCount.textContent =
            totalItems;

    }


    /* STICKY CART ITEM COUNT */

    if (cartItems) {

        cartItems.textContent =
            totalItems;

    }


    /* STICKY CART TOTAL */

    if (cartTotal) {

        cartTotal.textContent =
            totalPrice.toLocaleString();

    }

}


/* =========================================================
   CATEGORY FILTERS
========================================================= */

function setupCategoryFilters() {

    categoryButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    categoryButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const category =
                        button.dataset.category ||
                        "all";


                    filterProducts(category);

                }
            );

        }
    );

}


/* =========================================================
   FILTER PRODUCTS
========================================================= */

function filterProducts(category) {

    const products =
        document.querySelectorAll(
            ".product-card"
        );


    products.forEach(
        function (product) {

            const productCategory =
                product.dataset.category ||
                "";


            if (
                category === "all" ||
                productCategory === category
            ) {

                product.style.display = "";

            } else {

                product.style.display = "none";

            }

        }
    );

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function () {

            searchProducts(
                searchInput.value
            );

        }
    );


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            function () {

                searchProducts(
                    searchInput.value
                );

            }
        );

    }

}


/* =========================================================
   SEARCH PRODUCTS
========================================================= */

function searchProducts(searchTerm) {

    const products =
        document.querySelectorAll(
            ".product-card"
        );


    const term =
        String(searchTerm)
            .trim()
            .toLowerCase();


    products.forEach(
        function (product) {

            const productName =
                (
                    product.dataset.name ||
                    ""
                ).toLowerCase();


            const productText =
                product.textContent.toLowerCase();


            const matches =
                productName.includes(term) ||
                productText.includes(term);


            product.style.display =
                matches ? "" : "none";

        }
    );

}


/* =========================================================
   ADDED TO CART MESSAGE
========================================================= */

function showAddedMessage(productName) {

    const existingNotification =
        document.querySelector(
            ".cart-notification"
        );


    if (existingNotification) {
        existingNotification.remove();
    }


    const notification =
        document.createElement("div");


    notification.className =
        "cart-notification";


    notification.innerHTML = `
        <strong>Added to cart!</strong>
        <span>${escapeHTML(productName)}</span>
    `;


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
   BASIC HTML ESCAPING
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}