class ProductFilters {
    constructor(main, defaultFilter = 0) {
        this.main = document.querySelector(main);
        this.columns = this.main.querySelectorAll(".tab-filter__col");
        this.sortIcons = this.main.querySelectorAll(".tab-filter__col i");
        this.filters = this.main.querySelectorAll(".tab-filter__tab");
        this.defaultFilter = defaultFilter;
        this.products = {
            container: this.main.querySelector(".tab-filter__wrap"),
            items: this.main.querySelectorAll(".tab-filter__item"),
        };
        this.inputs = {
            block: this.main.querySelectorAll(".increment-input"),
            input: this.main.querySelectorAll(".increment-input__input"),
        };
        this.summary = {
            items: document.querySelector(".cart-index"),
            total: document.querySelector(".total-index"),
        };
        this.sort = {
            type: null,
            order: null,
        };
        this.state = {
            items: 0,
            price: 0,
            inputValue: 0,
        };
        this.init();
    }
    createInputs = () => {
        for (const input of this.inputs.block) {
            const buttons = {
                add: `<div class="increment-input__button increment-input__button--add">+</div>`,
                subtract: `<div class="increment-input__button increment-input__button--subtract">-</div>`,
            };
            input.insertAdjacentHTML("afterbegin", buttons.subtract);
            input.insertAdjacentHTML("beforeend", buttons.add);

            const add = input.querySelector(".increment-input__button--add");
            const subtract = input.querySelector(
                ".increment-input__button--subtract"
            );
            add.addEventListener(
                "click",
                this.increment.bind(this, input.querySelector("input"))
            );
            subtract.addEventListener(
                "click",
                this.decrement.bind(this, input.querySelector("input"))
            );
        }
    };
    increment = (input) => {
        this.state.items += 1;
        this.state.price += this.getPrice(input);
        input.value++;
        input.parentElement.parentElement.parentElement.setAttribute(
            "data-quantity",
            parseInt(input.value)
        );
        this.updateSummary();
    };
    decrement = (input) => {
        if (input.value <= 0) return;
        this.state.items -= 1;
        this.state.price -= this.getPrice(input);
        input.value -= 1;
        input.parentElement.parentElement.parentElement.setAttribute(
            "data-quantity",
            parseInt(input.value)
        );
        this.updateSummary();
    };
    getPrice = (input) => {
        const attValue = input.parentElement.parentElement.parentElement.getAttribute(
            "data-price"
        );
        return parseInt(attValue);
    };
    handleFocus = () => {
        this.inputValue = !parseInt(event.target.value)
            ? 0
            : parseInt(event.target.value);
    };
    handleChange = () => {
        const changeValue = parseInt(event.target.value);
        if (changeValue < 0) return (event.target.value = 0);
        const diff = changeValue - this.inputValue;
        this.state.items += diff;
        this.state.price += this.getPrice(event.target) * diff;
        event.target.parentElement.parentElement.parentElement.setAttribute(
            "data-quantity",
            changeValue
        );
        this.updateSummary();
        event.target.blur();
    };
    updateSummary = () => {
        this.summary.items.innerText = this.state.items;
        this.summary.total.innerHTML = `&pound;${this.state.price}`;
    };
    sortItems = (sort) => {
        const lastType = this.sort.type;
        const target = sort
        this.sort.type = target.getAttribute("data-sort");
        if (lastType === this.sort.type) {
            if (this.sort.order === "asc") {
                this.sort.order = "dec";
            } else {
                this.sort.order = "asc";
            }
        } else {
            this.sort.order = "asc";
        }

        const sortedProducts = Array.from(this.products.items).sort((a, b) => {
            const aValue = parseInt(a.getAttribute(`data-${this.sort.type}`));
            const bValue = parseInt(b.getAttribute(`data-${this.sort.type}`));
            if (this.sort.order === "asc") {
                return aValue >= bValue ? 1 : -1;
            } else {
                return aValue >= bValue ? -1 : 1;
            }
        });
        for (const product of sortedProducts) {
            this.products.container.appendChild(product);
        }
        // Sort Icons
        this.updateIcons(sort);
    };
    updateIcons = (column) => {
        const currentIcon = column.querySelector("i");
        for (const icon of this.sortIcons)
            icon.className = "fas fa-sort colour-grey3";
        if (this.sort.order === "asc") {
            currentIcon.classList.add('fa-sort-down')
        } else {
            currentIcon.classList.add('fa-sort-up')
        }
    };
    filterItems = (filter) => {
        const target = filter;
        const type = target.getAttribute("data-type");
        const value = target.getAttribute("data-value");
        for (const product of this.products.items) {
            const attr = product.getAttribute(`data-${type}`);
            if (attr === value || value === "all") {
                product.classList.add("d-flex");
                product.classList.remove("d-none");
            } else {
                product.classList.remove("d-flex");
                product.classList.add("d-none");
            }
        }
        // Active style class
        for (const filter of this.filters)
            filter.classList.remove("tab-filter__tab--active");
        target.classList.add("tab-filter__tab--active");
    };
    urlParams = () => {
        const urlParams = new URLSearchParams(window.location.search).entries()
        let filter, sort;
        for (let ent of urlParams) {
            if (ent[0] === 'filter') {
                filter = this.main.querySelector(`.tab-filter__tab[data-value="${ent[1]}"]`)
            }
            if (ent[0] === 'sort') {
                sort = this.main.querySelector(`.tab-filter__col[data-sort="${ent[1]}"]`)
            }
            if (ent[0] === 'order') {
                this.sort.order = ent[1] === 'asc' || ent[1] === 'dec' ? ent[1] : 'asc'
            }
        }
        filter && this.filterItems.call(this, filter)
        sort && this.sortItems.call(this, sort)
    }
    init = () => {
        const addEvents = (event, nodes, callback) => {
            for (const el of nodes) el.addEventListener(event, callback);
        };
        this.createInputs();
        addEvents("focus", this.inputs.input, this.handleFocus);
        addEvents("change", this.inputs.input, this.handleChange);
        for (const el of this.filters)
            el.addEventListener("click", this.filterItems.bind(this, el));
            for (const el of this.columns)
            el.addEventListener("click", this.sortItems.bind(this, el));

        // Trigger default filter
        this.filterItems(this.filters[this.defaultFilter]);
        // Filter through URL parameters on load
        this.urlParams()
    };
}

export default ProductFilters;
