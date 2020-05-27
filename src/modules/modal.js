class Modal {
    constructor(modal) {
        this.modal = modal
        this.window = this.modal.querySelector('.modal__window')
        this.closeButton = null
        this.back = null;
        this.state = {
            open: false,
        }
        this.init()
    }
    addElements = () => {
        this.modal.insertAdjacentHTML('afterbegin', '<div class="modal__back"></div>')
        this.window.insertAdjacentHTML('afterbegin', '<div class="modal__close">&times;</div>')
        this.closeButton = this.window.querySelector('.modal__close')
        this.back = this.modal.querySelector('.modal__back')
    }
    open = () => {
        this.modal.classList.toggle('modal--active')
        this.modal.removeEventListener('click', this.open)
    }
    close = () => {
        event.stopPropagation()
        this.modal.classList.remove('modal--active')
        this.modal.addEventListener('click', this.open)
    }
    init() {
        this.addElements()
        this.modal.addEventListener('click', this.open)
        this.closeButton.addEventListener('click', this.close)
        this.back.addEventListener('click', this.close)
    }
}

export default Modal