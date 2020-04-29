class Reviews {
    constructor(
        productNumber,
        locations = { head: ".reviews-head", main: ".reviews-main" }
    ) {
        (this.productNumber = productNumber), (this.pageSize = 5);
        this.pageNumber = 1;
        this.reviewsData = null;
        this.locations = {
            head: document.querySelector(locations.head),
            main: document.querySelector(locations.main),
        };
        this.paginationIndexCount = window.innerWidth < 768 ? 3 : 5;
        this.paginationShowAllPageSize
        this.init();
    }
    getReviews = () => {
        this.showLoading()
        fetch(
            `https://api.feefo.com/api/10/reviews/product?merchant_identifier=worktop-express&parent_product_sku=${this.productNumber}&full_thread=include&empty_product_comments=include&page_size=${this.pageSize}&page=${this.pageNumber}`
        )
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.reviewsData = data;
                this.hideLoading()
                this.setMain();
                this.setPagesUI();
            })
            .catch((e) => {
                console.error(e);
            });
    };
    getSummary = () => {
        fetch(
            `https://api.feefo.com/api/10/reviews/summary/product?merchant_identifier=worktop-express&parent_product_sku=${this.productNumber}`
        )
            .then((response) => response.json())
            .then((data) => {
                this.summaryData = data;
                this.setHead();
            });
    };
    setHead = () => {
        const headString = `<div class="reviews-head__index col-md-auto col-md px-0 font-12 font-md-15 colour-grey3">(${this.summaryData.meta.count} customer reviews)</div>`;
        this.locations.head.insertAdjacentElement(
            "afterbegin",
            this.getStars(this.summaryData.rating.rating)
        );
        this.locations.head.innerHTML += headString;
    };
    getStars = (rating) => {
        const starWrapper = document.createElement("div");
        starWrapper.className = "review-stars-wrapper";
        // starWrapper.innerHTML += `<div class="review-stars-wrapper__cover" style="width:${(5 - this.summaryData.rating.rating) * 2 * 20}%"></div>`
        const starMarkup = `<svg class="review-star" xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 9.4 9.4">
                <g transform="translate(-70.6 -160.6)">
                    <path d="M5.434,7.794,2.529,9.4,3.084,6,.734,3.59l3.248-.5L5.434,0,6.887,3.094l3.248.5L7.784,6l.555,3.4Z" transform="translate(69.866 160.6)" fill="#f7b538"></path>
                </g>
            </svg>`;
        for (let i = 0; i < 5; i++) {
            if (rating > i + 0.75) {
                // Add whole star
                starWrapper.innerHTML += starMarkup;
            } else if (rating > i + 0.25) {
                // Add half star
                starWrapper.innerHTML += "half";
            } else {
                // Add grey star
                starWrapper.innerHTML += "empty";
            }
        }
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
            const url = review.url;
            const date = review.products[0].created_at;
            const rating = review.products[0].rating.rating;
            const product = review.products[0].product.title;
            const comment = review.products[0].review;

            this.parseDate(date)
            reviewsMarkup += `<div class="review-card card p-4 my-2" data-review="${id}">
                <a href="${url}">
                    <div class="row-bs">
                        <div class="col-md-3 col-xl-2 d-flex flex-wrap align-content-center">
                            <div class="review-card__name font-weight-6 w-100">${name}</div>
                            <div class="review-card__time colour-grey3">${this.parseDate(date)}</div>
                        </div>
                        <div class="col-md-9 col-xl-10">
                            <div class="review-card__stars">${
                                this.getStars(rating).innerHTML
                            }</div>
                            <div class="review-card__product font-14 colour-grey3">${product}</div>
                            ${
                                comment
                                    ? '<div class="review-card__comment">' +
                                      comment +
                                      "</div>"
                                    : ""
                            }
                        </div>
                    </div>
                </a>
            </div>`;
        }
        this.locations.main.innerHTML = reviewsMarkup;
    };
    parseDate = (date) => {
        const currentDate = new Date().getTime()
        const convertedDate = new Date(date).getTime()
        const dayDiff = Math.round((currentDate - convertedDate)/(1000*60*60*24))
        const monthDiff = Math.round((currentDate - convertedDate)/(1000*60*60*24*31))
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
    setPagesUI = () => {
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
        // TEMP
        // this.paginationIndexCount = 3
        if (totalPages <= this.paginationShowAllPageSize) {
            for (let block of indexArray) pagination.appendChild(block);
        } else {
            const diffMax = Math.floor(this.paginationIndexCount / 2)
            let startDiff = parseInt(this.pageNumber - 1);
            let endDiff = parseInt(totalPages - this.pageNumber)
            if (startDiff > diffMax) startDiff = diffMax
            if (endDiff > diffMax) endDiff = diffMax
            console.log({
                start: startDiff,
                end: endDiff,
                diffMax: diffMax
            })
            // Add one and ellipsis if page number is greater than this.paginationIndexCount number
            if (this.pageNumber - startDiff > 1) {
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
            if (this.pageNumber + endDiff < totalPages) {
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
    }
    showLoading = () => {
        this.locations.main.classList.add('reviews-main--loading')
    }
    hideLoading = () => {
        this.locations.main.classList.remove('reviews-main--loading')
    }
    previousPage = () => {
        this.pageNumber -= 1;
        this.getReviews()
    }
    nextPage = () => {
        this.pageNumber += 1;
        this.getReviews()
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
        } else {
            this.paginationIndexCount = 5
        }

        if (previousIndex !== this.paginationIndexCount) this.getReviews()
    }
    init() {
        this.getSummary();
        this.getReviews();
        window.addEventListener('resize', this.resizeUpdates)
    }
}

export default Reviews;
