class SmoothScroll {
    constructor() {
        this.init();
    }
    scroll = () => {
        const targetValue = event.currentTarget.getAttribute("data-scroll");
        const clickElement = event.currentTarget.getAttribute("data-scroll-click");
        let clickElementTarget;
        console.log(clickElement)
        if (clickElement) {
            clickElementTarget = document.querySelector(clickElement);
            console.log(clickElementTarget)
            clickElementTarget.click()
        }
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