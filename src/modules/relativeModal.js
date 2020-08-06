class RelativeModal {
    constructor(container, element, contentOverlay, options) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        this.contentOverlay = typeof contentOverlay === 'string' ? document.querySelector(contentOverlay) : contentOverlay;
        this.innerContent = null;
        this.relativeContent = {
            outer: null,
            inner: null
        };
        this.closeButton = null;

        this.options = {
            buttonText: 'Close'
        }
        this.options = Object.assign(this.options, options)
        this.init()
    }

    open = () => {
        this.setContent()
        this.container.classList.add('rel-modal--open')
        this.relativeContent.outer.classList.add('rel-modal__content--active')
        document.addEventListener('click', this.outerClick, true)
    }
    close = () => {
        document.removeEventListener('click', this.outerClick)
        this.container.classList.remove('rel-modal--open')
        this.relativeContent.outer.classList.remove('rel-modal__content--active')
    }
    outerClick = () => {
        this.close()
    }

    addContentWrapper = () => {
        const outer = document.createElement('div');
        const inner = document.createElement('div');
        outer.className = ('rel-modal__content')
        inner.className = ('rel-modal__content__inner')
        inner.innerHTML = this.innerContent
        outer.appendChild(inner)
        outer.appendChild(this.getCloseButton())
        this.container.appendChild(outer)
        this.relativeContent.outer = outer;
        this.relativeContent.inner = inner;
    }

    setContent = () => {
        this.relativeContent.inner.innerHTML = this.innerContent
    }

    getCloseButton = () => {
        const button = document.createElement('div')
        button.classList.add('rel-modal__close')
        button.innerHTML = this.options.buttonText;
        this.closeButton = button;
        return button
    }

    init = () => {
        this.innerContent = this.contentOverlay.outerHTML
        this.element.addEventListener('click', this.open)
        this.addContentWrapper()
        this.closeButton.addEventListener('click', this.close)
        this.contentOverlay.style.display = 'none';
    }
}

// const relModals = document.querySelectorAll('.rel-modal__item')
// Array.from(relModals).forEach(modal => {
//     new RelativeModal('.rel-modal', modal, modal.querySelector('.rel-modal__item__overlay'))
// })

export default RelativeModal