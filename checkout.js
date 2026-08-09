    /* =========================================================
    TOYO FOODS & FRUITS
    CHECKOUT SYSTEM
    ========================================================= */


    /* =========================================================
    GOOGLE APPS SCRIPT URL
    ========================================================= */

    /*
    AFTER WE DEPLOY GOOGLE APPS SCRIPT,

    paste the Web App URL here.

    Example:

    const GOOGLE_SCRIPT_URL =
        "https://script.google.com/macros/s/XXXXXXXX/exec";
    */

    const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxSFah7GFecRlDoiBOplVB8bTqY7dnEljd5IV1CFNd1tQZjn0XbftEC05MgxU381qw/exec";


    /* =========================================================
    TOYO BANK DETAILS
    ========================================================= */

    const TOYO_BANK_NAME = "WEMA BANK";

    const TOYO_ACCOUNT_NUMBER = "0242286532";


    /* =========================================================
    DOM ELEMENTS
    ========================================================= */

    const checkoutForm =
        document.getElementById("checkout-form");

    const checkoutItems =
        document.getElementById("checkout-items");

    const checkoutItemCount =
        document.getElementById("checkout-item-count");

    const checkoutSubtotal =
        document.getElementById("checkout-subtotal");

    const checkoutTotal =
        document.getElementById("checkout-total");

    const paymentTotal =
        document.getElementById("payment-total");

    const cartCount =
        document.getElementById("cart-count");

    const submitOrderButton =
        document.getElementById("submit-order");

    const copyAccountButton =
        document.getElementById("copy-account");

    const accountNumberElement =
        document.getElementById("account-number");

    const bankNameElement =
        document.getElementById("bank-name");


    /* =========================================================
    CART
    ========================================================= */

    let cart = [];


    /* =========================================================
    INITIALIZE
    ========================================================= */

    document.addEventListener(
        "DOMContentLoaded",
        initializeCheckout
    );


    function initializeCheckout() {

        loadCart();

        displayBankDetails();

        renderCheckoutItems();

        updateCartCount();

        setupCopyAccount();

        setupCheckoutForm();

    }


    /* =========================================================
    LOAD CART
    ========================================================= */

    function loadCart() {

        try {

            const savedCart =
                localStorage.getItem("toyoCart");


            if (!savedCart) {

                cart = [];

                return;

            }


            const parsedCart =
                JSON.parse(savedCart);


            if (!Array.isArray(parsedCart)) {

                cart = [];

                return;

            }


            /*
                Clean the cart data.
            */

            cart =
                parsedCart
                    .filter(item =>
                        item &&
                        item.name
                    )
                    .map(item => ({

                        name:
                            String(item.name),

                        price:
                            getValidPrice(item.price),

                        quantity:
                            getValidQuantity(
                                item.quantity
                            )

                    }));


        } catch (error) {

            console.error(
                "Could not load cart:",
                error
            );

            cart = [];

        }

    }


    /* =========================================================
    DISPLAY BANK DETAILS
    ========================================================= */

    function displayBankDetails() {

        if (bankNameElement) {

            bankNameElement.textContent =
                TOYO_BANK_NAME;

        }


        if (accountNumberElement) {

            accountNumberElement.textContent =
                TOYO_ACCOUNT_NUMBER;

        }

    }


    /* =========================================================
    RENDER CHECKOUT ITEMS
    ========================================================= */

    function renderCheckoutItems() {

        if (!checkoutItems) {
            return;
        }


        checkoutItems.innerHTML = "";


        /*
            EMPTY CART
        */

        if (cart.length === 0) {

            checkoutItems.innerHTML = `

                <div class="checkout-empty">

                    <p>
                        Your cart is currently empty.
                    </p>

                    <a href="products.html">
                        Browse Our Menu
                    </a>

                </div>

            `;


            updateTotals();

            disableCheckout();

            return;

        }


        /*
            RENDER ITEMS
        */

        cart.forEach(
            item => {

                const quantity =
                    getValidQuantity(
                        item.quantity
                    );


                const price =
                    getValidPrice(
                        item.price
                    );


                const itemTotal =
                    price * quantity;


                const element =
                    document.createElement("div");


                element.className =
                    "checkout-item";


                element.innerHTML = `

                    <div class="checkout-item-info">

                        <p class="checkout-item-name">
                            ${escapeHTML(item.name)}
                        </p>

                        <span class="checkout-item-quantity">
                            ${quantity} ×
                            ₦${price.toLocaleString()}
                        </span>

                    </div>


                    <span class="checkout-item-price">
                        ₦${itemTotal.toLocaleString()}
                    </span>

                `;


                checkoutItems.appendChild(
                    element
                );

            }
        );


        updateTotals();

    }


    /* =========================================================
    UPDATE TOTALS
    ========================================================= */

    function updateTotals() {

        const totalItems =
            cart.reduce(
                (total, item) => {

                    return total +
                        getValidQuantity(
                            item.quantity
                        );

                },
                0
            );


        const totalPrice =
            cart.reduce(
                (total, item) => {

                    return total +
                        (
                            getValidPrice(
                                item.price
                            ) *
                            getValidQuantity(
                                item.quantity
                            )
                        );

                },
                0
            );


        if (checkoutItemCount) {

            checkoutItemCount.textContent =
                totalItems;

        }


        if (checkoutSubtotal) {

            checkoutSubtotal.textContent =
                totalPrice.toLocaleString();

        }


        if (checkoutTotal) {

            checkoutTotal.textContent =
                totalPrice.toLocaleString();

        }


        if (paymentTotal) {

            paymentTotal.textContent =
                totalPrice.toLocaleString();

        }


        /*
            Save current total.
        */

        localStorage.setItem(
            "toyoCartSubtotal",
            totalPrice
        );

    }


    /* =========================================================
    UPDATE CART COUNT
    ========================================================= */

    function updateCartCount() {

        if (!cartCount) {
            return;
        }


        const totalItems =
            cart.reduce(
                (total, item) => {

                    return total +
                        getValidQuantity(
                            item.quantity
                        );

                },
                0
            );


        cartCount.textContent =
            totalItems;

    }


    /* =========================================================
    LISTEN FOR CART CHANGES
    ========================================================= */

    /*
        If the customer changes the cart
        in another browser tab, checkout
        updates automatically.
    */

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key === "toyoCart"
            ) {

                loadCart();

                renderCheckoutItems();

                updateCartCount();

            }

        }
    );


    /* =========================================================
    COPY ACCOUNT NUMBER
    ========================================================= */

    function setupCopyAccount() {

        if (
            !copyAccountButton ||
            !accountNumberElement
        ) {

            return;

        }


        copyAccountButton.addEventListener(
            "click",
            copyAccountNumber
        );

    }


    /* =========================================================
    COPY ACCOUNT NUMBER
    ========================================================= */

    async function copyAccountNumber() {

        const number =
            accountNumberElement.textContent.trim();


        if (!number) {

            showNotification(
                "Account number is unavailable."
            );

            return;

        }


        /*
            Modern clipboard API.
        */

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            try {

                await navigator.clipboard.writeText(
                    number
                );


                showCopySuccess();

                return;

            } catch (error) {

                console.warn(
                    "Clipboard API failed.",
                    error
                );

            }

        }


        /*
            Fallback.
        */

        const success =
            fallbackCopy(number);


        if (success) {

            showCopySuccess();

        } else {

            showNotification(
                "Copy failed. Please copy the account number manually."
            );

        }

    }


    /* =========================================================
    FALLBACK COPY
    ========================================================= */

    function fallbackCopy(text) {

        const textarea =
            document.createElement("textarea");


        textarea.value =
            text;


        textarea.setAttribute(
            "readonly",
            ""
        );


        textarea.style.position =
            "fixed";

        textarea.style.left =
            "-9999px";


        document.body.appendChild(
            textarea
        );


        textarea.select();

        textarea.setSelectionRange(
            0,
            textarea.value.length
        );


        let successful = false;


        try {

            successful =
                document.execCommand(
                    "copy"
                );

        } catch (error) {

            successful = false;

        }


        textarea.remove();


        return successful;

    }


    /* =========================================================
    COPY SUCCESS
    ========================================================= */

    function showCopySuccess() {

        const originalText =
            copyAccountButton.textContent;


        copyAccountButton.textContent =
            "Copied ✓";


        setTimeout(
            () => {

                copyAccountButton.textContent =
                    originalText || "Copy";

            },
            2000
        );

    }


    /* =========================================================
    CHECKOUT FORM
    ========================================================= */

    function setupCheckoutForm() {

        if (!checkoutForm) {
            return;
        }


        checkoutForm.addEventListener(
            "submit",
            handleCheckoutSubmit
        );

    }


    /* =========================================================
    HANDLE SUBMISSION
    ========================================================= */

    async function handleCheckoutSubmit(event) {

        event.preventDefault();


        clearFormErrors();


        /*
            Reload cart one final time.
        */

        loadCart();


        /*
            Make sure cart isn't empty.
        */

        if (cart.length === 0) {

            showNotification(
                "Your cart is empty. Please add food before checking out."
            );

            return;

        }


        /*
            Get form fields.
        */

        const customerName =
            document
                .getElementById("customer-name")
                ?.value
                .trim();


        const customerPhone =
            document
                .getElementById("customer-phone")
                ?.value
                .trim();


        const deliveryArea =
            document
                .getElementById("delivery-area")
                ?.value
                .trim();


        const deliveryAddress =
            document
                .getElementById("delivery-address")
                ?.value
                .trim();


        const orderNotes =
            document
                .getElementById("order-notes")
                ?.value
                .trim();


        const transactionId =
            document
                .getElementById("transaction-id")
                ?.value
                .trim();


        const paymentConfirmation =
            document
                .getElementById(
                    "payment-confirmation"
                )
                ?.checked;


        let valid = true;


        /* =====================================================
        VALIDATION
        ===================================================== */

        if (!customerName) {

            showFieldError(
                "customer-name",
                "Please enter your full name."
            );

            valid = false;

        }


        if (!customerPhone) {

            showFieldError(
                "customer-phone",
                "Please enter your phone or WhatsApp number."
            );

            valid = false;

        }


        if (!deliveryArea) {

            showFieldError(
                "delivery-area",
                "Please select your delivery area."
            );

            valid = false;

        }


        if (!deliveryAddress) {

            showFieldError(
                "delivery-address",
                "Please enter your delivery address."
            );

            valid = false;

        }


        if (!transactionId) {

            showFieldError(
                "transaction-id",
                "Your transaction/reference ID is required."
            );

            valid = false;

        }


        if (!paymentConfirmation) {

            showNotification(
                "Please confirm that you have made the payment."
            );

            valid = false;

        }


        if (!valid) {

            return;

        }


        /*
            Calculate total.
        */

        const foodTotal =
            calculateCartTotal();


        /*
            Generate order ID.
        */

        const orderReference =
            generateOrderReference();


        /*
            Build complete order.
        */

        const order = {

            orderReference,

            dateTime:
                new Date().toISOString(),


            customer: {

                name:
                    customerName,

                phone:
                    customerPhone,

                deliveryArea:
                    deliveryArea,

                deliveryAddress:
                    deliveryAddress,

                notes:
                    orderNotes

            },


            items:
                cart.map(item => ({

                    name:
                        item.name,

                    price:
                        getValidPrice(
                            item.price
                        ),

                    quantity:
                        getValidQuantity(
                            item.quantity
                        ),

                    total:
                        getValidPrice(
                            item.price
                        ) *
                        getValidQuantity(
                            item.quantity
                        )

                })),


            payment: {

                method:
                    "Bank Transfer",

                transactionReference:
                    transactionId,

                amount:
                    foodTotal,

                verificationStatus:
                    "Pending"

            },


            status:
                "Pending Verification"

        };


        /*
            Submit order.
        */

        await sendOrderToCompany(
            order
        );

    }


    /* =========================================================
    SEND ORDER TO COMPANY
    ========================================================= */

    async function sendOrderToCompany(order) {

        if (!GOOGLE_SCRIPT_URL) {

            console.error(
                "Google Apps Script URL has not been configured."
            );


            showNotification(
                "The order system has not been connected yet."
            );


            return;

        }


        /*
            Disable button.
        */

        if (submitOrderButton) {

            submitOrderButton.disabled =
                true;


            submitOrderButton.innerHTML = `
                <span>
                    Sending Order...
                </span>
            `;

        }


        try {

            /*
                Send JSON to Apps Script.
            */

            const response =
                await fetch(
                    GOOGLE_SCRIPT_URL,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "text/plain;charset=utf-8"

                        },

                        body:
                            JSON.stringify(order)

                    }
                );


            /*
                Read response.
            */

            const result =
                await response.json();


            if (
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    "Order could not be submitted."
                );

            }


            /*
                Store latest order locally
                for the success page.
            */

            localStorage.setItem(
                "toyoLatestOrder",
                JSON.stringify(order)
            );


            /*
                Clear cart ONLY after
                successful submission.
            */

            localStorage.removeItem(
                "toyoCart"
            );


            localStorage.removeItem(
                "toyoCartSubtotal"
            );


            /*
                Go to success page.
            */

            window.location.href =
                `order-success.html?order=${encodeURIComponent(
                    order.orderReference
                )}`;


        } catch (error) {

            console.error(
                "Order submission failed:",
                error
            );


            showNotification(
                "We could not submit your order. Please try again."
            );


            /*
                Re-enable button.
            */

            if (submitOrderButton) {

                submitOrderButton.disabled =
                    false;


                submitOrderButton.innerHTML = `
                    <span>
                        Submit Order for Verification
                    </span>

                    <span>
                        →
                    </span>
                `;

            }

        }

    }


    /* =========================================================
    CALCULATE CART TOTAL
    ========================================================= */

    function calculateCartTotal() {

        return cart.reduce(
            (total, item) => {

                return total +
                    (
                        getValidPrice(
                            item.price
                        ) *
                        getValidQuantity(
                            item.quantity
                        )
                    );

            },
            0
        );

    }


    /* =========================================================
    GENERATE ORDER REFERENCE
    ========================================================= */

    function generateOrderReference() {

        const timestamp =
            Date.now()
                .toString()
                .slice(-7);


        const random =
            Math.floor(
                100 +
                Math.random() * 900
            );


        return `TOYO-${timestamp}-${random}`;

    }


    /* =========================================================
    VALID PRICE
    ========================================================= */

    function getValidPrice(price) {

        const number =
            Number(price);


        if (
            !Number.isFinite(number) ||
            number < 0
        ) {

            return 0;

        }


        return number;

    }


    /* =========================================================
    VALID QUANTITY
    ========================================================= */

    function getValidQuantity(quantity) {

        const number =
            Number(quantity);


        if (
            !Number.isFinite(number) ||
            number < 1
        ) {

            return 1;

        }


        return Math.floor(number);

    }


    /* =========================================================
    FORM ERROR
    ========================================================= */

    function showFieldError(
        fieldId,
        message
    ) {

        const field =
            document.getElementById(
                fieldId
            );


        if (!field) {
            return;
        }


        const error =
            document.getElementById(
                `${fieldId}-error`
            );


        if (error) {

            error.textContent =
                message;

        }


        const group =
            field.closest(
                ".form-group"
            );


        if (group) {

            group.classList.add(
                "input-error"
            );

        }

    }


    /* =========================================================
    CLEAR ERRORS
    ========================================================= */

    function clearFormErrors() {

        document
            .querySelectorAll(
                ".form-error"
            )
            .forEach(
                element => {

                    element.textContent =
                        "";

                }
            );


        document
            .querySelectorAll(
                ".form-group"
            )
            .forEach(
                group => {

                    group.classList.remove(
                        "input-error"
                    );

                }
            );

    }


    /* =========================================================
    DISABLE CHECKOUT
    ========================================================= */

    function disableCheckout() {

        if (!submitOrderButton) {
            return;
        }


        submitOrderButton.disabled =
            true;


        submitOrderButton.innerHTML = `
            <span>
                Your Cart Is Empty
            </span>
        `;

    }


    /* =========================================================
    NOTIFICATION
    ========================================================= */

    function showNotification(message) {

        const old =
            document.querySelector(
                ".checkout-notification"
            );


        if (old) {
            old.remove();
        }


        const notification =
            document.createElement("div");


        notification.className =
            "checkout-notification";


        notification.textContent =
            message;


        document.body.appendChild(
            notification
        );


        setTimeout(
            () => {

                notification.remove();

            },
            3500
        );

    }


    /* =========================================================
    ESCAPE HTML
    ========================================================= */

    function escapeHTML(value) {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }