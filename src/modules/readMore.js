// TODO: Add full responsive options, not just max viewport.

class ReadMore {
    constructor(content, options) {
        this.content = content;
        this.wrapper = null;
        this.button = null;
        this.open = false;
        this.options = {
            transitionSpeed: null,
            show: true,
            moreText: 'Read more.',
            lessText: 'Read less.',
            maxViewPortWidth: null,
            responsive: null,
        }
        this.options = Object.assign(this.options, options)
        this.init()
    }
    addWrapper = () => {
        const wrappedContent = document.createElement('div');
        wrappedContent.classList.add('read-more__wrapper');
        wrappedContent.innerHTML = this.content.innerHTML;
        if (this.options.transitionSpeed) wrappedContent.style.transition = this.options.transitionSpeed + 's';
        this.content.innerHTML = '';
        this.content.appendChild(wrappedContent);
        this.wrapper = wrappedContent
    }
    addButton = () => {
        const button = document.createElement('button')
        button.classList.add('read-more__button');
        button.innerHTML = this.options.moreText;
        this.content.appendChild(button)
        this.button = button;
    }
    buttonUpdate = () => {
        this.button.innerHTML = this.open ? this.options.lessText : this.options.moreText;
    }
    toggleState = () => {
        if (this.open) {
            this.wrapper.style.height = '0px';
            this.content.classList.remove('read-more--open')
            this.open = false
        } else {
            this.wrapper.style.height = this.wrapper.scrollHeight + 'px';
            this.content.classList.add('read-more--open')
            this.open = true
        }
        this.buttonUpdate()
    }
    hideElements = () => {
        this.content.classList.add('read-more--inactive')
        this.wrapper.style.height = null;
    }
    showElements = () => {
        this.content.classList.remove('read-more--inactive')
        this.wrapper.style.height = this.open ? this.wrapper.scrollHeight + 'px' : '0px';
    }
    handleResize = () => {
        if (window.innerWidth >= this.options.maxViewPortWidth || !this.options.maxViewPortWidth) {
            this.hideElements()
        }
        if (window.innerWidth < this.options.maxViewPortWidth || !this.options.maxViewPortWidth) {
            this.showElements()
        }
    }
    init = () => {
        this.addWrapper()
        this.addButton()
        this.button.addEventListener('click', this.toggleState)
        window.addEventListener('resize', this.handleResize)
        this.handleResize()
    }
}

export default ReadMore