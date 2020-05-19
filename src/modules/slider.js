class ZoomSlider {
    constructor(sliderSelector, config) {
        this.slider = document.querySelector(sliderSelector);
        this.main = this.slider.querySelector(".zoom-slider__main");
        this.wrap = this.slider.querySelector(".zoom-slider__wrap");
        this.items = this.slider.querySelectorAll(".zoom-slider__item");
        this.preview = {
            wrap: this.slider.querySelector(".zoom-slider__preview"),
            items: this.slider.querySelectorAll(".zoom-slider__preview__item"),
        };
        this.slideWidth = this.wrap.offsetWidth;
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
        this.doubleTap = false;
        this.zoomed = false;
        this.touch = {
            start: null,
            move: null,
            dist: null,
        };
        this.config = config;
        this.tipActive = true;
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
        this.zoomed = true;
    };
    zoomMove = (el) => {
        if (!this.zoomed) return;
        let rect = el.getBoundingClientRect();
        const position = {
            x: (event.pageX || event.touches[0].pageX) - window.scrollX - rect.left,
            y: (event.pageY || event.touches[0].pageY) - (window.scrollY + rect.top),
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
        this.zoomed = false;
    };
    showZoomItem = () => {
        // Loop through the picture element replacing data-src/set with src/set
        const pictureChildNodes = this.zoomItem.childNodes;
        pictureChildNodes.forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                const [source, dataSource, dataSourceSet] = [
                    child.getAttribute("src"),
                    child.getAttribute("data-src"),
                    child.getAttribute("data-srcset"),
                ];
                if (source) return;
                dataSource && child.setAttribute("src", source);
                dataSourceSet && child.setAttribute("srcset", dataSourceSet);
            }
        });
        this.zoomItem.classList.add("zoom-slider__item__zoom--active");
    };
    hideZoomItem = () => {
        this.zoomItem && this.zoomItem.classList.remove("zoom-slider__item__zoom--active");
        this.zoomed = false
    };
    touchZoom = () => {
        event.preventDefault();
        const time = new Date().getTime();
        const timeDiff = time - this.doubleTap;
        const el = event.currentTarget;
        this.currentItemSize.width = el.offsetWidth;
        this.currentItemSize.height = el.offsetHeight;
        this.touch.start = event.touches[0].clientX;
        this.zoomItem = el.querySelector(".zoom-slider__item__zoom");
        // If double taped (two taps under 500ms)
        if (timeDiff < 500) {
            // Zoom toggle
            this.zoomed = !this.zoomed;
        }
        el.addEventListener("touchmove", this.touchMove);
        if (this.zoomed) {
            el.removeEventListener("touchmove", this.touchMove);
            this.showZoomItem();
            this.zoomMove.call(this, event.currentTarget);
        } else {
            this.hideZoomItem();
            this.wrap.style.transition = "none";
        }
        el.addEventListener("touchend", this.touchEnd);
        this.doubleTap = new Date().getTime();
        if (this.tipActive) {
            this.main.classList.remove('zoom-slider__main--tip');
            this.tipActive = false;
        }
    };
    touchMove = () => {
        this.touch.move = event.touches[0].clientX;
        this.touch.dist = this.touch.start - this.touch.move;

        this.wrap.style.transform = `translateX(-${
            this.currentSlidePosition + this.touch.dist
        }px)`;
    };
    touchEnd = () => {
        // this.touch.end = event.touches[0].clientX;
        this.currentSlidePosition += this.touch.dist;
        this.wrap.style.transition = null;
        this.centerSlide();
    };
    centerSlide = () => {
        const lengthArray = Array.from(this.items).map(
            (item, i) => this.slideWidth * i
        );
        let arrayIndex = 0;
        for (let i = 0; i < lengthArray.length; i++) {
            if (
                this.currentSlidePosition >
                lengthArray[i] + this.slideWidth / 2
            ) {
                arrayIndex = i + 1;
            }
            if (this.currentSlidePosition <= 0) {
                arrayIndex = 0;
            }
            if (this.currentSlidePosition + this.slideWidth > this.totalWidth) {
                arrayIndex = this.items.length - 1;
            }
        }
        this.currentSlidePosition = this.slideWidth * arrayIndex;
        this.activeSlide = arrayIndex;
        this.wrap.style.transform = `translateX(-${this.currentSlidePosition}px)`;
        this.updateUI();
    };
    slideLeft = () => {
        this.hideZoomItem()
        this.currentSlidePosition -= this.slideWidth;
        this.wrap.style.transform = `translateX(-${this.currentSlidePosition}px)`;
        this.activeSlide -= 1;
        this.updateUI();
    };
    slideRight = () => {
        this.hideZoomItem()
        this.currentSlidePosition += this.slideWidth;
        this.wrap.style.transform = `translateX(-${this.currentSlidePosition}px)`;
        this.activeSlide += 1;
        this.updateUI();
    };
    updateUI = () => {
        this.control.left.classList.add("zoom-slider__ui--active");
        this.control.right.classList.add("zoom-slider__ui--active");
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
        this.createPreviewControls();
        this.updateUI();
    };
    createPreviewControls() {
        // Check if manual preview exists or if config isn't set to true
        if (this.preview.wrap) {
            return
        }
        if (!this.config.buildImagePreview) return
        // Create preview markup
        let previewMarkup = '<div class="zoom-slider__preview">';
        let currentImages = Array.from(this.items).map((item) => {
            return (
                item.querySelector("img").getAttribute("srcset") ||
                item.querySelector("img").getAttribute("src") ||
                item.querySelector("img").getAttribute("data-srcset") ||
                item.querySelector("img").getAttribute("data-src")
            );
        });
        let images = this.config.previewImages || currentImages;
        const imageString = images.map((img, index) => {
            // TODO: split string and alter width cloudinary pararmenter
            if (!this.config.previewImages) {
                img = img.split('upload').join('upload/w_103,h_103,c_fill,f_auto/')
            }
            return `<div class="zoom-slider__preview__item" data-slider-preview="${index}">
                        <img src="${img}" alt="Image preview">
                    </div>`;
        }).join('');
        previewMarkup += (imageString + "</div>");
        // Add markup to DOM
        this.slider.insertAdjacentHTML('beforeend', previewMarkup)
        this.preview = {
            wrap: this.slider.querySelector(".zoom-slider__preview"),
            items: this.slider.querySelectorAll(".zoom-slider__preview__item"),
        };
        // Add events
        this.preview.items.forEach((item) => {
            item.addEventListener("click", this.previewControl);
        });
    }
    previewControl = () => {
        const preview = event.currentTarget;
        const previewIndex = parseInt(
            preview.getAttribute("data-slider-preview")
        );
        const diff = previewIndex - this.activeSlide;
        if (diff > 0) {
            for (let i = 0; i < diff; i++) this.slideRight();
        }
        if (diff < 0) {
            for (let i = 0; i > diff; i--) this.slideLeft();
        }
    };
    resetValues = () => {
        this.slideWidth = this.wrap.offsetWidth;
        this.totalWidth = this.slideWidth * this.items.length;
        this.rightEdgeLimit = this.totalWidth - this.slideWidth;
        this.currentSlidePosition = this.slideWidth * this.activeSlide;
        this.wrap.style.transform = `translateX(-${this.currentSlidePosition}px)`;
    };
    init() {
        this.items.forEach((item) => {
            item.addEventListener("mouseover", this.zoomEnter);
            item.addEventListener("touchstart", this.touchZoom);
        });
        this.setUI();
        // Add double tap to zoom tip if device has touch capabilities
        if ('ontouchstart' in window || navigator.msMaxTouchPoints) this.main.classList.add('zoom-slider__main--tip');

        // TODO: add debounce
        window.addEventListener("resize", this.resetValues);
    }
}

export default ZoomSlider