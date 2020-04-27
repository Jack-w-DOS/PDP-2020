class Reviews {
    constructor(productNumber, locations) {
        this.productNumber = productNumber,
        this.pageSize = 5;
        this.pageNumber = 1;
        this.locations = locations
        this.init();
    }
    getReviews = () => {
        this.reviews = fetch(`https://api.feefo.com/api/10/reviews/product?merchant_identifier=worktop-express&parent_product_sku=${this.productNumber}&full_thread=include&empty_product_comments=include&page_size=${this.pageSize}&page=${this.pageNumber}`)
        .then(response => {
            return response.json()
        })
        .then(data => console.log(data))
        .catch(e => {
            alert(e)
        })
    }
    init() {
        console.log(this)
        this.getReviews()
    }
}

export default Reviews