class ZoomSlider {
    constructor(sliderSelector) {
        this.slider = document.querySelector(sliderSelector);
        this.main = this.slider.querySelector(".zoom-slider__main");
        this.wrap = this.slider.querySelector(".zoom-slider__wrap");
        this.items = this.slider.querySelectorAll(".zoom-slider__item");
        this.preview = {
            wrap: this.slider.querySelector(".zoom-slider__preview"),
            items: this.slider.querySelectorAll(".zoom-slider__preview__item"),
        };
        this.slideWidth = this.items[0].offsetWidth;
        this.totalWidth = this.slideWidth * this.items.length;
        this.rightEdgeLimit = this.totalWidth - this.slideWidth;
        this.currentItemSize = {
            width: null,
            height: null,
        };
        this.control = {
            left: null,
            right: null,
        };
        this.currentSlidePosition = 0;
        this.zoomItem;
        this.activeSlide = 0;

        this.init();
    }
    zoomEnter = () => {
        const el = event.currentTarget;
        el.addEventListener("mouseleave", this.zoomLeave.bind(this, el));
        el.addEventListener("mousemove", this.zoomMove.bind(this, el));
        //Set the dimentions of the currently hovered item for use in transforms
        this.currentItemSize.width = el.offsetWidth;
        this.currentItemSize.height = el.offsetHeight;
        this.zoomItem = el.querySelector(".zoom-slider__item__zoom");
        this.showZoomItem();
    };
    zoomMove = (el) => {
        let rect = el.getBoundingClientRect();
        const position = {
            x: event.pageX - rect.left,
            y: event.pageY - rect.top,
        };
        // Convert position to a percentage to be used in transform
        const percentage = {
            x: ((position.x / this.currentItemSize.width) * 100).toFixed(2) - 0,
            y:
                ((position.y / this.currentItemSize.height) * 100).toFixed(2) -
                0,
        };
        this.zoomItem.style.transform = `translate(${-percentage.x / 2}%, ${
            -percentage.y / 2
        }%)`;
    };
    zoomLeave = (el) => {
        el.removeEventListener("mousemove", this.zoomMove);
        this.hideZoomItem();
    };
    showZoomItem = () => {
        const [source, dataSource] = [
            this.zoomItem.getAttribute("src"),
            this.zoomItem.getAttribute("data-src"),
        ];
        // Set real source based on data source only if src is not already set.
        if (!source) {
            this.zoomItem.setAttribute("src", dataSource);
        }
        this.zoomItem.classList.add("zoom-slider__item__zoom--active");
    };
    hideZoomItem = () => {
        this.zoomItem.classList.remove("zoom-slider__item__zoom--active");
    };
    slideLeft = () => {
        this.currentSlidePosition -= this.slideWidth;
        this.wrap.style.transform = `translateX(-${this.currentSlidePosition}px)`;
        this.activeSlide -= 1;
        this.updateUI();
    };
    slideRight = () => {
        this.currentSlidePosition += this.slideWidth;
        this.wrap.style.transform = `translateX(-${this.currentSlidePosition}px)`;
        this.activeSlide += 1;
        this.updateUI();
    };
    updateUI = () => {
        this.control.left.classList.add("zoom-slider__ui--active");
        this.control.right.classList.add("zoom-slider__ui--active");
        console.log(this.currentSlidePosition, this.rightEdgeLimit);
        if (!this.currentSlidePosition) {
            // Disable left control
            this.control.left.classList.remove("zoom-slider__ui--active");
        } else if (this.currentSlidePosition === this.rightEdgeLimit) {
            // Disable right control
            this.control.right.classList.remove("zoom-slider__ui--active");
        }
        this.updatePreview();
    };
    updatePreview = () => {
        this.preview.items.forEach((item) =>
            item.classList.remove("zoom-slider__preview__item--active")
        );
        this.preview.items[this.activeSlide].classList.add(
            "zoom-slider__preview__item--active"
        );
    };
    setUI = () => {
        const leftControl = `<div class="zoom-slider__ui zoom-slider__ui--left"></div>`;
        const rightControl = `<div class="zoom-slider__ui zoom-slider__ui--right"></div>`;
        this.main.insertAdjacentHTML("afterbegin", leftControl + rightControl);

        this.control.left = this.slider.querySelector(".zoom-slider__ui--left");
        this.control.right = this.slider.querySelector(
            ".zoom-slider__ui--right"
        );
        this.control.left.addEventListener("click", this.slideLeft);
        this.control.right.addEventListener("click", this.slideRight);
        this.updateUI();
    };
    previewControl = () => {
        const preview = event.currentTarget;
        const previewIndex = parseInt(
            preview.getAttribute("data-slider-preview")
        );
        const diff = previewIndex - this.activeSlide;
        if (diff > 0) {
            for (let i = 0; i < diff; i++)  this.slideRight()
        }
        if (diff < 0) {
            for (let i = 0; i > diff; i--) this.slideLeft()
        }
    };
    init() {
        this.items.forEach((item) =>
            item.addEventListener("mouseover", this.zoomEnter)
        );
        this.preview.items.forEach((item) => {
            item.addEventListener("click", this.previewControl);
        });
        this.setUI();
        console.log(this);
    }
}
const mainProductSlider = document.querySelector(".zoom-slider");
const zoomSlider = new ZoomSlider(".zoom-slider");

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
const collapseBoxes = document.querySelectorAll(".collapse-box");
for (const el of collapseBoxes) new CollapseBox(el);
