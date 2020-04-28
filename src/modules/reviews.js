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
        this.init();
    }
    getReviews = () => {
        fetch(
            `https://api.feefo.com/api/10/reviews/product?merchant_identifier=worktop-express&parent_product_sku=${this.productNumber}&full_thread=include&empty_product_comments=include&page_size=${this.pageSize}&page=${this.pageNumber}`
        )
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.reviewsData = data;
                console.log(this.reviewsData);
                this.setMain()
            })
            // .catch((e) => {
            //     alert(e);
            // });
    };
    getSummary = () => {
        fetch(
            `https://api.feefo.com/api/10/reviews/summary/product?merchant_identifier=worktop-express&parent_product_sku=${this.productNumber}`
        )
            .then((response) => response.json())
            .then((data) => {
                this.summaryData = data;
                console.log(this.summaryData);
                this.setHead();
            });
    };
    getNewPage = (pageNo) => {
        this.pageNumber = pageNo;
        this.getReviews();
    };
    setHead = () => {
        const headString = `<div class="reviews-head__index col-md-auto col-md px-0 font-12 font-md-15 colour-grey3">(${this.summaryData.meta.count} customer reviews)</div>`;
        this.locations.head.insertAdjacentElement('afterbegin', this.getStars(this.summaryData.rating.rating));
        this.locations.head.innerHTML += headString;
    };
    getStars = rating => {
        const starWrapper = document.createElement('div')
        starWrapper.className = "review-stars-wrapper"
        // starWrapper.innerHTML += `<div class="review-stars-wrapper__cover" style="width:${(5 - this.summaryData.rating.rating) * 2 * 20}%"></div>`
        const starMarkup = `<svg class="review-star" xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 9.4 9.4">
                <g transform="translate(-70.6 -160.6)">
                    <path d="M5.434,7.794,2.529,9.4,3.084,6,.734,3.59l3.248-.5L5.434,0,6.887,3.094l3.248.5L7.784,6l.555,3.4Z" transform="translate(69.866 160.6)" fill="#f7b538"></path>
                </g>
            </svg>`;
        for (let i = 0; i < 5; i++) {
            if (rating > i + .75) {
                // Add whole star
                starWrapper.innerHTML += starMarkup;
            } else if (rating > i + .25) {
                // Add half star
                starWrapper.innerHTML += 'half';
            } else {
                // Add grey star
                starWrapper.innerHTML += 'empty';
            }
        }
        return starWrapper
    }
    setMain = () => {
        const reviews = this.reviewsData.reviews;
        let reviewsMarkup;
        for (const review of reviews) {
            console.log(review)
            const name = review.customer ? review.customer.display_name : 'Trusted Customer'
            const id = review.products[0].id
            const url = review.url
            const date = review.products[0].created_at
            const rating = review.products[0].rating.rating
            const product = review.products[0].product.title
            const comment = review.products[0].review
            reviewsMarkup += 
            `<div class="review-card card p-4 my-2" data-review="${id}">
                <a href="${url}">
                    <div class="row-bs">
                        <div class="col-md-3 col-xl-2 d-flex flex-wrap align-content-center">
                            <div class="review-card__name font-weight-6 w-100">${name}</div>
                            <div class="review-card__time colour-grey3">${date}</div>
                        </div>
                        <div class="col-md-9 col-xl-10">
                            <div class="review-card__stars">${this.getStars(rating).innerHTML}</div>
                            <div class="review-card__product font-14 colour-grey3">${product}</div>
                            ${comment ? '<div class="review-card__comment">' + comment + '</div>' : ''}
                        </div>
                    </div>
                </a>
            </div>`
        }
        console.log(this.locations)
        this.locations.main.innerHTML = reviewsMarkup
    };
    init() {
        this.getSummary();
        this.getReviews();
    }
}

export default Reviews;
