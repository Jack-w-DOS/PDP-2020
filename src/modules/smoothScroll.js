class SmoothScroll {
    constructor() {
        this.init();
    }
    scroll = () => {
        const targetValue = event.currentTarget.getAttribute("data-scroll");
        const callback = event.currentTarget.getAttribute(
            "data-scroll-callback"
        );
        const target = document.querySelector(targetValue);
        const rect = target.getBoundingClientRect();
        if (target) {
            window.scroll(0, rect.top) || window.scrollTo(0, rect.top) || window.scrollTo({ top: rect.y, behavior: "smooth" });
        }
        if (callback) {
            Function(callback)();
        }
    };
    init() {
        const items = document.querySelectorAll("[data-scroll]")
        Array.from(items).forEach(item => item.addEventListener("click", this.scroll))
    }
}

export default SmoothScroll