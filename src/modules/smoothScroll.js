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
        const unsupportedBrowser = navigator.appVersion.indexOf('Trident/') > -1 || RegExp(/ip(ad|hone).*version\/(9|10)/i).test(navigator.appVersion);

        if (!unsupportedBrowser && target) {
            window.scrollBy({ top: rect.y, behavior: "smooth" });
        } else {
            window.scrollTo(0, rect.top)
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