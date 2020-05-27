class FormControl {
    constructor() {
        this.control = document.querySelector('.prodopt-control')
        this.multiadd = document.querySelector('.prodvar-multiadd')
        this.select = this.control.querySelector('.prodopt-control__select')
        this.selectLabel = this.control.querySelector('.prodopt-control__label')
        this.cartBtn = this.multiadd.querySelector('.prodvar-multiadd__btn')
        this.input = {
            main: this.control.querySelector('.increment-input'),
            label: this.control.querySelector('.increment-input__label'),
            input: this.control.querySelector('.increment-input__input'),
            add: this.control.querySelector('.increment-input__button--add'),
            subtract: this.control.querySelector('.increment-input__button--subtract'),
        }
        this.relative = {
            id: null,
            product: null,
            input: null
        }
        this.allInputs = this.multiadd.querySelectorAll('.prodvar-multiadd__input')
        this.inputValue = 0;
        this.relative = {
            id: null,
            product: null,
            input: null
        }
        this.productSelected = false;
        this.quantitySelected = false;
        this.init()
    }
    handleSelectChange = () => {
        this.productSelected = true;
        this.quantitySelected = true
        let currentQuantity = parseInt(this.input.input.value);
        if (!currentQuantity) {
            this.input.input.value = 1;
            currentQuantity = 1;
        }
        this.zeroInputs()
        this.relative.id = event.target.value
        this.relative.product = this.multiadd.querySelector('div[name="' + this.relative.id + '"]')
        this.relative.input = this.relative.product.querySelector('input')
        if (currentQuantity > 1) {
            this.relative.input.value = currentQuantity
        } else {
            this.relative.input.value = 1
        }
    }
    buttonClass = index => {
        if (index > 0) {
            this.cartBtn.classList.add('cart__btn--active')
            this.cartBtn.removeEventListener('click', this.preventSubmit)
        } else {
            this.cartBtn.classList.remove('cart__btn--active')
            this.cartBtn.addEventListener('click', this.preventSubmit)
        }
        this.clearErrorClasses()
    }
    preventSubmit = () => {
        event.preventDefault()
        if (!this.productSelected) {
            this.select.classList.add('prodopt-control__select--error');
            this.selectLabel.classList.add('colour-red')
        }
        if (!this.quantitySelected || this.input.input.value <= 0) {
            this.input.main.classList.add('increment-input--error');
            this.input.label.classList.add('colour-red')
        }
    }
    clearErrorClasses = () => { 
        this.input.main.classList.remove('increment-input--error')
        this.select.classList.remove('prodopt-control__select--error');
        this.selectLabel.classList.remove('colour-red')
        this.input.label.classList.remove('colour-red')
    }
    handleInputChange = () => {
        if (!this.relative.input) {
            this.preventSubmit()
            return event.target.value = 0
        }
        this.inputValue = event.target.value
        if (this.inputValue < 0) {
            this.inputValue = 0
            event.target.value = 0
        }
        this.inputValue > 0 ? this.quantitySelected = true : this.quantitySelected = false;
        this.relative.input.value = this.inputValue
        this.buttonClass(this.inputValue)
    }
    increment = () => {
        if (!this.relative.input) return this.preventSubmit()
        this.input.input.value = parseInt(this.input.input.value) + 1
        this.relative.input.value = this.input.input.value
        this.quantitySelected = true;
        this.buttonClass(this.input.input.value)
    }
    decrement = () => {
        if (!this.relative.input) return this.preventSubmit()
        if (this.input.input.value < 1) return
        this.input.input.value = parseInt(this.input.input.value) - 1
        this.relative.input.value = this.input.input.value
        this.inputValue > 0 ? this.quantitySelected = true : this.quantitySelected = false;
        this.buttonClass(this.input.input.value)
    }
    zeroInputs = () => {
        for (const inp of this.allInputs) inp.value = 0;
        // this.input.input.value = 0;
        this.buttonClass(this.input.input.value)
    }
    init() {
        this.select.addEventListener('change', this.handleSelectChange)
        this.input.input.addEventListener('change', this.handleInputChange)
        this.input.add.addEventListener('click', this.increment)
        this.input.subtract.addEventListener('click', this.decrement)
        window.addEventListener('load', () => {
            this.relative.id = this.select.value
            if (this.relative.id) {
                this.relative.product = this.multiadd.querySelector('div[name="' + this.relative.id + '"]')
                this.relative.input = this.relative.product.querySelector('input')
                this.productSelected = true;
                if (this.input.input.value > 0) this.quantitySelected = true;
            }
            this.buttonClass(this.input.input.value)
        })
    }
}
new FormControl()