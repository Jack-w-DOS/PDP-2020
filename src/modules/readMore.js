class ReadMore {
    constructor(content, options) {
        this.content = content;
        this.wrapper = null;
        this.button = null;
        this.open = false;
        this.transitionSpeed = 0.4;
        this.options = {
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
        const wrappedContent = '<div class="read-more__wrapper" style="transition:height ' + this.transitionSpeed + 's;">' + this.content.innerHTML + '</div>';
        this.content.innerHTML = wrappedContent;
        this.wrapper = this.content.querySelector('.read-more__wrapper');
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
            this.wrapper.style.display = 'none';
            this.content.classList.remove('read-more--open')
            this.open = false
        } else {
            this.wrapper.style.height = this.wrapper.scrollHeight + 'px';
            this.wrapper.style.display = null
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
        console.log(this)
    }
}

export default ReadMore