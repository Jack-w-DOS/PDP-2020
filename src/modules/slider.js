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
        this.touch = {
            start: null,
            move: null,
            dist: null,
        };
        this.doubleTap = false;
        this.tapTimer = new Date().getTime()
        this.config = config;
        this.tipActive = true;
        this.init();
    }
    zoomEnter = () => {
        const el = event.currentTarget;
        this.zoomed = true;
        el.addEventListener("mouseleave", this.zoomLeave.bind(this, el));
        el.addEventListener("mousemove", this.zoomMove.bind(this, el));
        // Set the dimensions of the currently hovered item for use in transforms
        this.currentItemSize.width = el.offsetWidth;
        this.currentItemSize.height = el.offsetHeight;
        this.zoomItem = el.querySelector(".zoom-slider__item__zoom");
        if (this.tipActive) {
            this.main.classList.remove('zoom-slider__main--tip');
            this.tipActive = false;
        }
        this.showZoomItem();
    };
    zoomMove = (el) => {
        let rect = el.getBoundingClientRect();
        const position = {
            x: (event.pageX || event.touches[0].pageX) - window.pageXOffset - rect.left,
            y: (event.pageY || event.touches[0].pageY) - (window.pageYOffset + rect.top),
        };
        // Convert position to a percentage to be used in transform
        const percentage = {
            x: ((position.x / this.currentItemSize.width) * 100).toFixed(2) - 0,
            y:
            ((position.y / this.currentItemSize.height) * 100).toFixed(2) -
            0,
        };
        if (percentage.x > 100) percentage.x = 100;
        if (percentage.y > 100) percentage.y = 100;
        if (percentage.x < 0) percentage.x = 0;
        if (percentage.y < 0) percentage.y = 0;
        this.zoomItem.style.transform = `translate(${-percentage.x / 2}%, ${
            -percentage.y / 2
        }%)`;
    };
    zoomLeave = (el) => {
        el.removeEventListener("mousemove", this.zoomMove);
        this.hideZoomItem();
        this.zoomed = false
    };
    touchStart = () => {
        event.preventDefault();
        if (new Date().getTime() - this.tapTimer < 500) this.doubleTap = !this.doubleTap
        
        this.tapTimer = new Date().getTime()

        const el = event.currentTarget;
        this.currentItemSize.width = el.offsetWidth;
        this.currentItemSize.height = el.offsetHeight;
        this.touch.start = event.touches[0].clientX;
        this.touch.dist = 0;
        this.zoomItem = el.querySelector(".zoom-slider__item__zoom");
        
        if (this.doubleTap) {
            this.showZoomItem();
            this.zoomMove.call(this, event.target);
        } else {
            this.hideZoomItem()
            this.wrap.style.transition = 'none';
            el.addEventListener("touchend", this.touchEnd);
        }
        el.addEventListener("touchmove", this.touchMove);
        if (this.tipActive) {
            this.main.classList.remove('zoom-slider__main--tip');
            this.tipActive = false;
        }
    };
    touchMove = () => {
        if (this.doubleTap) {
            this.zoomMove.call(this, event.target);
        } else if (this.items.length > 1) {
            this.touch.move = event.touches[0].clientX;
            this.touch.dist = this.touch.start - this.touch.move;

            this.wrap.style.transform = `translateX(-${
                this.currentSlidePosition + this.touch.dist
            }px)`;
        }
    };
    touchEnd = () => {
        if (!this.doubleTap) {
            this.hideZoomItem()
            this.currentSlidePosition += this.touch.dist;
            this.wrap.style.transition = null;
            this.centerSlide();
        }
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
    showZoomItem = () => {
        // Loop through the picture element replacing data-src/set with src/set
        const pictureChildNodes = this.zoomItem.childNodes;
        Array.from(pictureChildNodes).forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                const [source, dataSource] = [
                    child.getAttribute("srcset"),
                    child.getAttribute("data-srcset"),
                ];
                if (source) return;
                child.setAttribute("srcset", dataSource);
                child.removeAttribute("data-srcset")
            }
        });
        this.zoomItem.classList.add("zoom-slider__item__zoom--active");
        picturefill({reevaluate: true})
    };
    hideZoomItem = () => {
        this.doubleTap = false;
        this.zoomItem && this.zoomItem.classList.remove("zoom-slider__item__zoom--active");
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
        Array.from(this.preview.items).forEach((item) =>
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
        if (this.preview.wrap || !this.config.buildImagePreview) return
        // Create preview markup
        let previewMarkup = '<div class="zoom-slider__preview">';
        let currentImages = Array.from(this.items).map((item) => {
            return item.querySelector("img").getAttribute("srcset");
        });
        let images = this.config.previewImages || currentImages;
        const imageString = images.map((img, index) => {
            console.log(img)
            // TODO: split string and alter width cloudinary pararmeter
            if (!this.config.previewImages) {
                const imgSplit = img.split(/,\s+/)
                const img1x = imgSplit[0].replace(/upload\/.*?\//g, 'upload/w_103,h_103,c_fill/');
                const img2x = imgSplit[1].replace(/upload\/.*?\//g, 'upload/w_206,h_206,c_fill/');
                img = `${img1x}, ${img2x}`
            }
            console.log(img)
            return `<div class="zoom-slider__preview__item" data-slider-preview="${index}">
                        <img srcset="${img}" alt="Image preview">
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
        Array.from(this.preview.items).forEach((item) => {
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
        Array.from(this.items).forEach((item) => {
            item.addEventListener("mouseover", this.zoomEnter);
            item.addEventListener("touchstart", this.touchStart);
        });
        if (this.items.length > 1) this.setUI();
        // Add double tap to zoom tip if device has touch capabilities
        if ('ontouchstart' in window || navigator.msMaxTouchPoints) {
            this.main.classList.add('zoom-slider__main--tip');
        }

        // TODO: add debounce
        window.addEventListener("resize", this.resetValues);
    }
}

export default ZoomSlider