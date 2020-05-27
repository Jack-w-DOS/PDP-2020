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
            const isIE11 = navigator.userAgent.match(/Trident.*rv\:11\./);
            window.scrollBy({ top: rect.y, behavior: "smooth" });
            if (isIE11) window.scrollBy(0, rect.y);
        }
        if (callback) {
            Function(callback)();
        }
    };
    init() {
        document
            .querySelector("[data-scroll]")
            .addEventListener("click", this.scroll);
    }
}

export default SmoothScroll