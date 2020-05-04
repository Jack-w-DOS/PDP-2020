class SmoothScroll {
    constructor() {
        this.init();
    }
    scroll = () => {
        const targetValue = event.currentTarget.getAttribute("data-scroll");
        const target = document.querySelector(targetValue);
        const rect = target.getBoundingClientRect()
        if (target) {
            window.scrollBy({ top: rect.y, behavior: "smooth" });
        }
    };
    init() {
        document
            .querySelector("[data-scroll]")
            .addEventListener("click", this.scroll);
    }
}

export default SmoothScroll