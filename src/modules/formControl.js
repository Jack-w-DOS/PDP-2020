class FormControl {
    constructor(block) {
        this.block = block;
        this.input = this.block.querySelector('.increment-input__input')
        this.inputValue = 0;
        this.init();
    }
    addButtons = () => {
        const buttons = {
            add: `<div class="increment-input__button increment-input__button--add">+</div>`,
            subtract: `<div class="increment-input__button increment-input__button--subtract">-</div>`,
        };
        this.block.insertAdjacentHTML("afterbegin", buttons.subtract);
        this.block.insertAdjacentHTML("beforeend", buttons.add);

        const add = this.block.querySelector('.increment-input__button--add')
        const subtract = this.block.querySelector('.increment-input__button--subtract')
        add.addEventListener('click', this.increment)
        subtract.addEventListener('click', this.decrement)
    };
    increment = () => {
        this.inputValue += 1;
        this.input.value = this.inputValue;
    };
    decrement = () => {
        this.inputValue = this.inputValue <= 0 ? this.inputValue = 0 : this.inputValue -= 1;
        this.input.value = this.inputValue;
    };
    handleChange = () => {
        this.inputValue = parseInt(this.input.value)
    }
    init = () => {
        this.addButtons();
        this.block.addEventListener('change', this.handleChange)
    };
}

export default FormControl;
