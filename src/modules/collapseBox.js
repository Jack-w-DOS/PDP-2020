class CollapseBox {
    constructor(element, boxname) {
        this.element = element;
        this.head = this.element.querySelector(".collapse-box__head");
        this.wrap = this.element.querySelector(".collapse-box__wrap");
        this.config = {
            open: this.element.getAttribute("data-open"),
        };
        this.init();
    }

    open = () => {
        this.head.removeEventListener("click", this.open);
        this.head.addEventListener("click", this.close);
        this.wrapHeight = this.wrap.scrollHeight;
        this.wrap.style.height = `${this.wrapHeight}px`;
        this.element.classList.add("collapse-box--open");
        this.wrap.addEventListener("transitionend", this.heightAuto);
    };

    close = () => {
        this.head.removeEventListener("click", this.close);
        this.head.addEventListener("click", this.open);
        this.wrap.removeEventListener("transitionend", this.heightAuto);

        requestAnimationFrame(() => {
            this.wrapHeight = this.wrap.scrollHeight;
            this.wrap.style.height = `${this.wrapHeight}px`;
            requestAnimationFrame(() => {
                this.wrap.style.height = "0px";
            });
        });
        this.element.classList.remove("collapse-box--open");
    };

    heightAuto = () => {
        this.wrap.style.height = "auto";
    };

    handleDefaultState = () => {
        this.config.open !== null && this.open();
    };

    init() {
        this.head.addEventListener("click", this.open);
        this.handleDefaultState();
    }
}

export default CollapseBox