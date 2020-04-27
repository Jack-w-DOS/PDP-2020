var filters = {
    DOM: {
        bar: document.querySelector(".tab-filter__bar"),
        tabs: document.querySelectorAll(".tab-filter__tab"),
        sort: document.querySelectorAll(".tab-filter__col"),
        container: document.querySelector(".tab-filter__wrap"),
        items: document.querySelectorAll(".tab-filter__item"),
        quantity: document.querySelectorAll(".prod-input"),
        index: {
            items: document.querySelector(".cart-index"),
            total: document.querySelector(".total-index"),
        },
        warn: document.querySelector(".tab-filter__alert"),
        warnButton: document.querySelector(".tab-filter__alert .button"),
        hidden: document.querySelector(".hidden-index"),
        calls: document.querySelectorAll("[data-filter-call]"),
        tip: document.querySelector(".tab-filter__bar .tooltip"),
        cartBtn: document.querySelector(".cart__btn"),
        cartWrap: document.querySelector(".tab-filter__cart"),
    },
    alert: function alert() {
        var els, ind, hidden, warn, i;
        els = this.DOM.items;
        hidden = 0;

        for (i = 0; i < els.length; i++) {
            if (els[i].classList.contains("d-none")) {
                ind = parseInt(els[i].querySelector(".prod-input").value, 10);

                if (ind > 0) {
                    hidden += ind;
                    warn = true;
                }
            }
        }

        if (warn) {
            if (hidden === 1) {
                this.DOM.hidden.innerHTML =
                    '<span class="font-weight-5">' +
                    hidden +
                    "</span> cart item is hidden by filters";
            } else {
                this.DOM.hidden.innerHTML =
                    '<span class="font-weight-5">' +
                    hidden +
                    "</span> cart items are hidden by filters";
            }

            this.DOM.warn.classList.add("tab-filter__alert--active");
        } else {
            this.DOM.warn.classList.remove("tab-filter__alert--active");
        }
    },
    updateClasses: function updateClasses() {
        var els = document.querySelectorAll(".tab-filter__item:not(.d-none)");
        for (var i = 0; i < els.length; i++) {
            if (i % 2) {
                els[i].classList.add("tab-filter__item--odd");
            } else {
                els[i].classList.remove("tab-filter__item--odd");
            }
        }
    },
    filterUse: 0,
    filter: function filter(event) {
        var els, tabs, type, value, att, tip, i;
        els = filters.DOM.items;
        tabs = filters.DOM.tabs;
        tip = filters.DOM.tip;
        type = this.getAttribute("data-type");
        value = this.getAttribute("data-value"); // remove active classes

        for (i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove("tab-filter__tab--active");
        } // Add active class

        this.classList.add("tab-filter__tab--active");

        for (i = 0; i < els.length; i++) {
            att = els[i].getAttribute("data-" + type);

            if (att == value || !value || value == "all") {
                els[i].classList.remove("d-none");
                els[i].classList.add("d-flex");
            } else {
                els[i].classList.add("d-none");
                els[i].classList.remove("d-flex");
            }
        }

        filters.alert();
        document.querySelector(".tab-filter__cart").style.transform =
            "translateY(0px)";
        filters.filterUse++;

        if (filters.filterUse === 2) {
            tip.parentElement.removeChild(tip);
        }

        filters.updateClasses();
    },
    filterCall: function filterCall() {
        var val, target;
        val = this.getAttribute("data-filter-call");
        target = document.querySelector(
            '.tab-filter__tab[data-value="' + val + '"]'
        );
        filters.filter.call(target);
    },
    sort: function sort() {
        var els, wrap, sortArr, type, sortOrder, attA, attB, i;
        els = filters.DOM.items;
        wrap = filters.DOM.container;
        type = this.getAttribute("data-sort");
        sortOrder = this.getAttribute("data-sort-order");
        sortArr = Array.from(els);

        var order = function order(_order) {
            sortArr.sort(function (a, b) {
                attA = parseInt(a.getAttribute("data-" + type));
                attB = parseInt(b.getAttribute("data-" + type));

                if (_order == "asc") {
                    if (attA > attB) return 1;
                    if (attA < attB) return -1;
                    if (attA == attB) return 0;
                } else if (_order == "desc") {
                    if (attA < attB) return 1;
                    if (attA > attB) return -1;
                    if (attA == attB) return 0;
                }
            });
        };

        var removeArrows = function removeArrows() {
            for (var i = 0; i < filters.DOM.sort.length; i++) {
                var icon = filters.DOM.sort[i].querySelector("i");
                //                    icon.classList.replace("fa-sort-up", "fa-sort");
                icon.classList.add("fa-sort");
                icon.classList.remove("fa-sort-up");
                //                    icon.classList.replace("fa-sort-down", "fa-sort");
                icon.classList.add("fa-sort");
                icon.classList.remove("fa-sort-down");
                //                    icon.classList.replace("colour-grey3", "colour-grey2");
                icon.classList.add("colour-grey2");
                icon.classList.remove("colour-grey3");
            }
        };

        var icon = this.querySelector("i");

        if (sortOrder === "desc") {
            removeArrows();
            icon.classList.add("fa-sort-down");
            icon.classList.remove("fa-sort-up");
            //                icon.classList.replace("colour-grey2", "colour-grey3");
            icon.classList.add("colour-grey3");
            icon.classList.remove("colour-grey2");
            order("desc");
        } else if (sortOrder === "asc") {
            removeArrows();
            icon.classList.add("fa-sort-up");
            icon.classList.remove("fa-sort-down");
            //                icon.classList.replace("colour-grey2", "colour-grey3");
            icon.classList.add("colour-grey3");
            icon.classList.remove("colour-grey2");
            order("asc");
        } else {
            if (icon.classList.contains("fa-sort-up")) {
                removeArrows();
                icon.classList.add("fa-sort-down");
                icon.classList.remove("fa-sort-up");
                //                    icon.classList.replace("colour-grey2", "colour-grey3");
                icon.classList.add("colour-grey3");
                icon.classList.remove("colour-grey2");
                order("desc");
            } else {
                removeArrows();
                icon.classList.add("fa-sort-up");
                icon.classList.remove("fa-sort-down");
                //                    icon.classList.replace("colour-grey2", "colour-grey3");
                icon.classList.add("colour-grey3");
                icon.classList.remove("colour-grey2");
                order("asc");
            }
        } // Append to DOM

        for (i = 0; i < sortArr.length; i++) {
            wrap.appendChild(sortArr[i]);
        }
    },
    tipAdded: false,
    tipTrigger: function tipTrigger() {
        var elements, triggers, dataAr, time, i, j, k;
        elements = document.querySelectorAll("[data-tiptrigger]");

        for (i = 0; i < elements.length; i++) {
            dataAr = elements[i].getAttribute("data-tiptrigger").split(",");
            triggers = document.querySelectorAll(dataAr[0]);
            time = dataAr[1] ? dataAr[1] : 2000;

            var remove = function remove() {
                elements[i].classList.add("tooltip--fixed");
                setTimeout(function () {
                    elements[i].parentElement.removeChild(elements[i]);
                    for (j = 0; j < triggers.length; j++) {
                        triggers[j].removeEventListener("click", remove);
                    }
                }, time);
            };
            for (k = 0; k < triggers.length; k++) {
                triggers[k].addEventListener("click", remove);
            }
        }
    },

    cart: function cart() {
        var items, total, inps, value, print, parent, price, i;
        items = 0;
        total = 0;
        inps = filters.DOM.quantity;
        print = {
            items: filters.DOM.index.items,
            total: filters.DOM.index.total,
        };

        for (i = 0; i < inps.length; i++) {
            parent = inps[i].parentElement.parentElement;
            price = parent.getAttribute("data-price");
            value = parseInt(inps[i].value, 10);

            if (value) {
                items += value;
                total += price * value;
            }
            parent.setAttribute("data-quantity", !value ? 0 : value);
        }

        print.items.innerHTML = items; // Modulus checks if total is a whole number and returns either: integer or to 2 decimal places

        print.total.innerHTML =
            "&pound;" + (total % 1 == 0 ? total : total.toFixed(2));

        if (items > 0) {
            filters.unlockCart();
        } else {
            filters.lockCart();
        }
    },
    removeCartMessageTimer: undefined,
    addCartMessage: function () {
        // alert('Please select a quantity to add an item to the cart');
        var transition = 200;

        notice = document.querySelector(".cart__notice");
        if (!notice) {
            var notice =
                '<div class="p-4 background-red colour-white font-weight-5 shadow cart__notice" style="transition: ' +
                transition +
                'ms">Please select a quantity to add to cart</div>';
            filters.DOM.cartWrap.insertAdjacentHTML("afterbegin", notice);
            notice = document.querySelector(".cart__notice");
        }

        clearTimeout(filters.removeCartMessageTimer);

        requestAnimationFrame(function () {
            notice.classList.add("cart__notice--show");
        });

        filters.removeCartMessageTimer = setTimeout(function () {
            notice.classList.remove("cart__notice--show");
        }, 3500);
    },
    inputHighlight: function () {
        var inputs = filters.DOM.quantity;
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].classList.add("prod-input--glow");
        }
        setTimeout(function () {
            filters.removeInputHighlight();
        }, 1000);
    },
    removeInputHighlight: function () {
        var inputs = filters.DOM.quantity;
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].classList.remove("prod-input--glow");
        }
    },
    cartPrevent: function cartPrevent(event) {
        event.preventDefault();
        filters.removeInputHighlight();
        filters.addCartMessage();
        filters.inputHighlight();
    },
    lockCart: function lockCart() {
        var button = this.DOM.cartBtn;
        button.classList.add("cart__btn--locked");
        button.addEventListener("click", this.cartPrevent, true);
    },
    unlockCart: function unlockCart() {
        var button = this.DOM.cartBtn;
        button.classList.remove("cart__btn--locked");
        button.removeEventListener("click", this.cartPrevent, true);
    },
    typeRules: function typeRules(e) {
        // prevents incorrect keys being entered
        if (
            !(
                (e.keyCode > 95 && e.keyCode < 106) ||
                (e.keyCode > 47 && e.keyCode < 58) ||
                (e.keyCode >= 37 && e.keyCode <= 40) ||
                e.keyCode == 8 ||
                e.keyCode == 46 ||
                e.keyCode == 13 ||
                e.keyCode == 9
            )
        ) {
            e.preventDefault();
            return false;
        }
    },
    eventLoop: function eventLoop(el, event, callback) {
        for (var i = 0; i < el.length; i++) {
            el[i].addEventListener(event, callback);
        }
    },
    setFilter: function setFilter() {
        var session, target, defFilt, tabs;
        defFilt = this.DOM.bar.getAttribute("data-default-filter");
        tabs = this.DOM.tabs;

        target = tabs[0];
        if (defFilt) {
            target = this.DOM.bar.querySelector(
                '[data-value="' + defFilt + '"]'
            );

            if (!target) target = tabs[0];
        }

        session = sessionStorage.getItem("set-filter");

        if (session) {
            target = document.querySelector(
                '.tab-filter__tab[data-value="' + session + '"]'
            );
            filters.filter.call(target);
            sessionStorage.setItem("set-filter", "");
        } else {
            filters.filter.call(target);
        }
    },
    events: function events() {
        var lastFilter = this.DOM.tabs[this.DOM.tabs.length - 1];
        this.eventLoop(this.DOM.tabs, "click", this.filter);
        this.eventLoop(this.DOM.quantity, "keyup", this.cart);
        this.eventLoop(this.DOM.quantity, "change", this.cart);
        this.eventLoop(this.DOM.quantity, "keydown", this.typeRules);
        this.eventLoop(this.DOM.sort, "click", this.sort);
        this.eventLoop(this.DOM.calls, "click", this.filterCall);
        this.DOM.warnButton.addEventListener(
            "click",
            this.filter.bind(lastFilter, lastFilter)
        );
    },
    init: function init() {
        this.events();
        this.setFilter();
        this.tipTrigger();
        this.cart();
    },
};
export default filters