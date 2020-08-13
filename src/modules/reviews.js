class Reviews {
    constructor(productNumber, options = {
            merchantID: 'worktop-express',
            locations: { head: ".reviews-head", main: ".reviews__main", summary: ".reviews__summary", box: "#product-reviews" }
    }) {
        this.productNumber = productNumber;
        this.pageSize = window.innerWidth < 768 ? 3 : 5;;
        this.pageNumber = 1;
        this.reviewsData = null;
        this.mobile = window.innerWidth < 768 ? true : false;
        this.merchantID = options.merchantID
        this.locations = {
            head: document.querySelector(options.locations.head),
            main: document.querySelector(options.locations.main),
            summary: document.querySelector(options.locations.summary),
            box: document.querySelector(options.locations.box)
        };
        this.paginationIndexCount = window.innerWidth < 768 ? 3 : 5;
        this.init();
    }
    getReviews = () => {
        this.showLoading()
        // fetch(
        //     `https://api.feefo.com/api/10/reviews/product?merchant_identifier=${this.merchantID}&parent_product_sku=${this.productNumber}&full_thread=include&empty_product_comments=include&page_size=${this.pageSize}&page=${this.pageNumber}`
        // )
        //     .then((response) => {
        //         return response.json();
        //     })
        //     .then((data) => {
        //         this.reviewsData = data;
        //         if (!data.reviews.length) return this.removeReviews()
        //         this.hideLoading()
        //         this.setMain();
        //         this.setPagesUI();
        //     })
        //     .catch((e) => {
        //         console.error(e);
        //     });

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {

            if (xhr.readyState !== 4) return;

            if (xhr.status >= 200 && xhr.status < 300) {
                this.reviewsData = JSON.parse(xhr.responseText);
                if (!this.reviewsData.reviews.length) return this.removeReviews()
                this.hideLoading()
                this.setMain();
                this.setPagesUI();
            } else {
                console.log('error', xhr);
            }

        };

        xhr.open('GET', `https://api.feefo.com/api/10/reviews/product?merchant_identifier=${this.merchantID}&parent_product_sku=${this.productNumber}&full_thread=include&empty_product_comments=include&page_size=${this.pageSize}&page=${this.pageNumber}`);
        xhr.send();
    };
    getSummary = () => {
        // fetch(
        //     `https://api.feefo.com/api/10/reviews/summary/product?merchant_identifier=${this.merchantID}&parent_product_sku=${this.productNumber}`
        // )
        //     .then((response) => response.json())
        //     .then((data) => {
        //         if (!data.rating.product.count) return false
        //         this.summaryData = data;
        //         this.setStatic()
        //     });

            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
    
                if (xhr.readyState !== 4) return;
    
                if (xhr.status >= 200 && xhr.status < 300) {
                    var data = JSON.parse(xhr.responseText)
                    if (!data.rating.product.count) return false
                    this.summaryData = data;
                    this.setStatic()
                } else {
                    console.log('error', xhr);
                }
    
            };
    
            xhr.open('GET', `https://api.feefo.com/api/10/reviews/summary/product?merchant_identifier=${this.merchantID}&parent_product_sku=${this.productNumber}`);
            xhr.send();       
    };
    setStatic = () => {
        // Set page info that does not change
        this.setHead();    
        const banner = document.querySelector('.reviews__banner')
        banner.insertAdjacentElement('beforeend', this.getStars(this.summaryData.rating.rating, 21,'mb-1 px-2'))
        banner.innerHTML += '<img class="d-none d-md-inline" srcset="https://res.cloudinary.com/dy7hqiitw/image/upload/w_60/worktop-express-uk/brands/feefo-logo.png 1x, https://res.cloudinary.com/dy7hqiitw/image/upload/w_120/worktop-express-uk/brands/feefo-logo.png 2x" alt="Feefo logo">';
        
        switch(this.merchantID) {
            case 'worktop-express-gmbh': // WEX DE
                this.locations.summary.innerHTML += `${this.getStars(this.summaryData.rating.rating, 27, null, '<img class="d-inline-block pl-2" srcset="https://res.cloudinary.com/dy7hqiitw/image/upload/w_60/worktop-express-uk/brands/feefo-logo.png 1x, https://res.cloudinary.com/dy7hqiitw/image/upload/w_120/worktop-express-uk/brands/feefo-logo.png 2x" alt="Feefo logo">').outerHTML}`;
                this.locations.summary.innerHTML += `<div class="font-14 colour-grey4">Bewertet mit ${this.summaryData.rating.rating} / 5 basierend auf ${this.summaryData.rating.product.count} Bewertungen</div>`;
                break;

            default: // WEX UK
                this.locations.summary.innerHTML += `${this.getStars(this.summaryData.rating.rating, 27, null, '<img class="d-inline-block pl-2" srcset="https://res.cloudinary.com/dy7hqiitw/image/upload/w_60/worktop-express-uk/brands/feefo-logo.png 1x, https://res.cloudinary.com/dy7hqiitw/image/upload/w_120/worktop-express-uk/brands/feefo-logo.png 2x" alt="Feefo logo">').outerHTML}`;
                this.locations.summary.innerHTML += `<div class="font-14 colour-grey4">Rated ${this.summaryData.rating.rating} / 5 Based on ${this.summaryData.rating.product.count} reviews</div>`;
        }
    }
    setHead = () => {
        if (this.summaryData.rating.rating < 3) return
        
        let headString;
        switch(this.merchantID){
            case 'worktop-express-gmbh': // WEX DE
                headString = `<div class="reviews-head__index col-md-auto col-md px-0 font-12 font-md-15 underline colour-grey3 pt-1 pt-md-0 pl-md-2">(${this.summaryData.rating.product.count} Kundenbewertungen)</div>`;
                break;

            default: // WEX UK
                headString = `<div class="reviews-head__index col-md-auto col-md px-0 font-12 font-md-15 underline colour-grey3 pt-1 pt-md-0 pl-md-2">(${this.summaryData.rating.product.count} customer reviews)</div>`; 
        }

        this.locations.head.insertAdjacentElement(
            "afterbegin",
            this.getStars(this.summaryData.rating.rating)
        );
        this.locations.head.innerHTML += headString;
    };
    getStars = (rating, size = 21, modifier, addMarkup) => {
        const starWrapper = document.createElement("div")
        starWrapper.classList.add('d-inline-block');
        if (modifier) starWrapper.className += ' ' + modifier;
        const isIOS9 = navigator.appVersion.indexOf('Version/9');
        const wholeStar = `<svg class="${isIOS9 < 0 && 'review-star'}" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 9.4 9.4">
                <g transform="translate(-70.6 -160.6)">
                    <path d="M5.434,7.794,2.529,9.4,3.084,6,.734,3.59l3.248-.5L5.434,0,6.887,3.094l3.248.5L7.784,6l.555,3.4Z" transform="translate(69.866 160.6)" fill="#f7b538"></path>
                </g>
            </svg>`;
        const halfStar = `<svg class="${isIOS9 < 0 && 'review-star'}" xmlns="http://www.w3.org/2000/svg" width="${size/2}" height="${size}" viewBox="0 0 9.4 19.6">
                <path id="Path_70" data-name="Path 70" d="M-816.257-323.4v0l1.156-7.09-4.9-5.022,6.772-1.034L-810.2-343v16.252l-6.055,3.347Z" transform="translate(820 343)" fill="#f7b538"/>
            </svg>
            `;
        // Add whole stars
        for (let i = 0; i < Math.floor(rating); i++) {
            starWrapper.innerHTML += wholeStar;
        }
        const decimal = rating - Math.floor(rating)
        if (decimal >= .25 && decimal < .75) {
            // Half star
            starWrapper.innerHTML += halfStar;
        } else if (decimal < 1 && decimal > 0){
            // Whole star
            starWrapper.innerHTML += wholeStar;
        }

        if (addMarkup) starWrapper.innerHTML += addMarkup

        return starWrapper;
    };
    setMain = () => {
        const reviews = this.reviewsData.reviews;
        let reviewsMarkup = '';
        for (const review of reviews) {
            const name = review.customer
                ? review.customer.display_name
                : "Trusted Customer";
            const id = review.products[0].id;
            const date = review.products[0].created_at;
            const rating = review.products[0].rating.rating;
            const product = review.products[0].product.title;
            const comment = review.products[0].review;

            this.parseDate(date)
            reviewsMarkup += `<div class="reviews-card card card--nohover p-4 my-2" data-review="${id}">
                <div class="row-bs">
                    <div class="col-md-3 col-xl-2 d-flex flex-wrap align-content-center">
                        <div class="reviews-card__name font-weight-6 w-100">${name}</div>
                        <div class="reviews-card__time colour-grey3">${this.parseDate(date)}</div>
                    </div>
                    <div class="col-md-9 col-xl-10">
                        <div class="reviews-card__stars">${
                            this.getStars(rating).outerHTML
                        }</div>
                        <div class="reviews-card__product font-14 colour-grey3">${product}</div>
                        ${
                            comment
                                ? '<div class="reviews-card__comment">' +
                                    comment +
                                    "</div>"
                                : ""
                        }
                    </div>
                </div>
            </div>`;
        }
        this.locations.main.innerHTML = reviewsMarkup;
    };
    parseDate = (date) => {
        const currentDate = new Date().getTime()
        const convertedDate = new Date(date).getTime()
        const dayDiff = Math.round((currentDate - convertedDate)/(1000*60*60*24))
        const monthDiff = Math.round((currentDate - convertedDate)/(1000*60*60*24*31))

        if (this.merchantID == 'worktop-express-gmbh'){

            if (dayDiff < 1) {
                return 'Heute'
            } else if (dayDiff === 1) {
                return 'Gestern'
            } else if (dayDiff > 1 && dayDiff <= 31) {
                return `Vor ${dayDiff} Tagen`
            } else if (monthDiff <= 1){
                return `vor einem Monat`
            } else if (monthDiff < 12) {
                return `Vor ${monthDiff} Monaten`
            } else {
                return 'vor &uuml;ber einem Jahr'
            }

        } else {

            if (dayDiff < 1) {
                return 'Today'
            } else if (dayDiff === 1) {
                return 'Yesterday'
            } else if (dayDiff > 1 && dayDiff <= 31) {
                return `${dayDiff} days ago`
            } else if (monthDiff <= 1){
                return `a month ago`
            } else if (monthDiff < 12) {
                return `${monthDiff} months ago`
            } else {
                return 'over a year ago'
            }

        }

    }
    setPagesUI = () => {
        if (this.reviewsData.summary.meta.pages <= 1) return;
        const totalPages = this.reviewsData.summary.meta.pages;
        const createEl = (type, classNames, att, content) => {
            const el = document.createElement(type);
            el.className = classNames;
            if (att) {
                el.setAttribute(att.name, att.value);
            }
            if (content) el.innerHTML = `<span>${content}</span>`;
            return el;
        };
        const pagination = createEl("div", "reviews__pages mx-auto");
        const isIE11 = !!navigator.userAgent.match(/Trident.*rv\:11\./);
        if (isIE11) pagination.classList.add('reviews__pages--iefix');
        const leftControl = createEl(
            "div",
            "reviews__pages__block reviews__pages__block--control reviews__pages__block--control--left"
        );
        const rightControl = createEl(
            "div",
            "reviews__pages__block reviews__pages__block--control reviews__pages__block--control--right"
        );
        const ellipsis = createEl(
            "div",
            "reviews__pages__block reviews__pages__block--ellipsis",
            null,
            "..."
        );
        const indexArray = [];
        for (var i = 1; i < totalPages + 1; i++) {
            const block = createEl(
                            "div",
                            "reviews__pages__block reviews__pages__block--index",
                            { name: "data-index", value: i },
                            i
                        );
            indexArray.push(block);
        }
        
        // Add left control arrow
        pagination.appendChild(leftControl);
        // Are total pages greater than 7
        if (totalPages <= this.pageSize) {
            for (let block of indexArray) pagination.appendChild(block);
        } else {
            const diffMax = Math.floor(this.paginationIndexCount / 2)
            let startDiff = parseInt(this.pageNumber - 1);
            let endDiff = parseInt(totalPages - this.pageNumber)
            if (startDiff > diffMax) startDiff = diffMax
            if (endDiff > diffMax) endDiff = diffMax
            // Add one and ellipsis if page number is greater than this.paginationIndexCount number
            if (this.pageNumber - startDiff > 1 && !this.mobile) {
                pagination.appendChild(createEl("div","reviews__pages__block reviews__pages__block--index",{ name: "data-index", value: 1 },1))
                if (this.pageNumber - startDiff > 2) pagination.appendChild(ellipsis.cloneNode(true))
            }
            if (this.pageNumber + this.paginationIndexCount <= totalPages) {
                for (let i = this.pageNumber - startDiff; i < this.pageNumber + (this.paginationIndexCount - startDiff); i++) {
                    // Add 5 numbers with the focus in the middle (is page no > 2)
                    pagination.appendChild(createEl("div","reviews__pages__block reviews__pages__block--index",{ name: "data-index", value: i },i))
                }
            } else {
                for (let i = this.pageNumber - this.paginationIndexCount + endDiff + 1; i <= this.pageNumber + endDiff && i <= totalPages; i++) {
                    pagination.appendChild(createEl("div","reviews__pages__block reviews__pages__block--index",{ name: "data-index", value: i },i))
                } 
            }
            // Add ellipsis and final number if page number is less than final number - this.paginationIndexCount numbers
            if (this.pageNumber + endDiff < totalPages && !this.mobile) {
                if (this.pageNumber + endDiff < totalPages - 1)  pagination.appendChild(ellipsis)
                pagination.appendChild(createEl("div","reviews__pages__block reviews__pages__block--index",{ name: "data-index", value: totalPages }, totalPages))
            }
        }
        // Add right control arrow
        pagination.appendChild(rightControl);
        this.locations.main.insertAdjacentElement("beforeend", pagination);
        
        this.pagination = {
            main: document.querySelector('.reviews__pages'),
            control: {
                left: document.querySelector('.reviews__pages__block--control--left'),
                right: document.querySelector('.reviews__pages__block--control--right')
            },
            blocks: document.querySelectorAll('.reviews__pages__block--index')
        }
        this.updatePagesUI()
    };
    switchPage = () => {
        const index = event.currentTarget.getAttribute('data-index')
        this.pageNumber = parseInt(index);
        this.getReviews()
        this.scrollToTop()
    }
    showLoading = () => {
        this.locations.main.classList.add('reviews__main--loading')
    }
    hideLoading = () => {
        this.locations.main.classList.remove('reviews__main--loading')
    }
    previousPage = () => {
        this.pageNumber -= 1;
        this.getReviews()
        this.scrollToTop()
    }
    nextPage = () => {
        this.pageNumber += 1;
        this.getReviews()
        this.scrollToTop()
    }
    scrollToTop = () => {
        this.locations.box.scrollIntoView(true)
    }
    updatePagesUI = () => {
        const currentPageBlock = this.pagination.main.querySelector(`[data-index="${this.pageNumber}"]`)
        for (let block of this.pagination.blocks) {
            block.addEventListener('click', this.switchPage)
            block.classList.remove('reviews__pages__block--active')
        }
        currentPageBlock.classList.add('reviews__pages__block--active')
        if (this.pageNumber == 1) {
            this.pagination.control.left.classList.add('reviews__pages__block--inactive')
            this.pagination.control.right.addEventListener('click', this.nextPage)
        } else if (this.pageNumber == this.reviewsData.summary.meta.pages) {
            this.pagination.control.right.classList.add('reviews__pages__block--inactive')
            this.pagination.control.left.addEventListener('click', this.previousPage)
        } else {
            this.pagination.control.right.addEventListener('click', this.nextPage)
            this.pagination.control.left.addEventListener('click', this.previousPage)
            this.pagination.control.left.classList.remove('reviews__pages__block--inactive')
            this.pagination.control.right.classList.remove('reviews__pages__block--inactive')
        }
    }
    resizeUpdates = () => {
        const previousIndex = this.paginationIndexCount
        if (window.innerWidth < 768) {
            this.paginationIndexCount = 3
            this.pageSize = 3
            this.mobile = true
        } else {
            this.paginationIndexCount = 5
            this.pageSize = 5
            this.mobile = false
        }

        if (previousIndex !== this.paginationIndexCount) this.getReviews()
    }
    removeReviews = () => {
        // Remove reviews from the layout if the AJAX returns nothing or an error.
        this.locations.box.parentElement.removeChild(this.locations.box)
    }
    init() {
        this.getSummary();
        this.getReviews();
        this.resizeUpdates()
        window.addEventListener('resize', this.resizeUpdates)
    }
}

export default Reviews;
