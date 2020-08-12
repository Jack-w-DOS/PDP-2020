class SingleInputControl {
    constructor() {
        this.main = document.querySelector(".increment-input")
        this.input = {
                label: document.querySelector(".increment-input__label"),
                input: this.main.querySelector(".increment-input__input"),
                add: this.main.querySelector(".increment-input__button--add"),
                subtract: this.main.querySelector(".increment-input__button--subtract"),
            };
        this.quantitySelected = true;
        this.inVal = function () {
            return parseInt(this.input.input.value);
        };
        this.cartBtn = document.querySelector(".cart-button");
        this.form = document.querySelector(".add-to-cart > form");
        this.init();
    }
    buttonClass = () => {
        this.removeErrorClasses();

        if (this.inVal() > 0) {
            this.cartBtn.classList.add("cart-button--active");
        } else {
            this.cartBtn.classList.remove("cart-button--active");
        }
    };
    handleInputChange = () => {
        var targetValue = parseInt(event.target.value);
        if (targetValue > 0) {
            this.input.input.value = targetValue;
        } else {
            this.input.input.value = 0;
        }

        this.input.input.value > 0
            ? (this.quantitySelected = true)
            : (this.quantitySelected = false);

        this.buttonClass();
    };
    increment = () => {
        this.input.input.value = this.inVal() + 1;
        this.quantitySelected = true;

        this.buttonClass();
    };
    decrement = () => {
        if (this.inVal() > 0) {
            this.input.input.value = this.inVal() - 1;
        } else {
            this.quantitySelected = false;
        }

        this.buttonClass();
    };
    removeErrorClasses = () => {
        this.main.classList.remove("increment-input--error");

        this.input.label.classList.remove("colour-red");
    };
    submitCheck = () => {
        if (this.inVal() <= 0) {
            this.main.classList.add("increment-input--error");

            this.input.label.classList.add("colour-red");

            event.preventDefault();
        }
    }
    init = () => {
        this.input.input.addEventListener("change", this.handleInputChange);
        this.input.add.addEventListener("click", this.increment);
        this.input.subtract.addEventListener("click", this.decrement);
        this.form.addEventListener("submit", this.submitCheck);
        this.buttonClass();
    };
}

export default SingleInputControl;