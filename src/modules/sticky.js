var sticky = function sticky(con, el, topgap, wait) {
    var wrap,
        stick,
        stickRect,
        stickEl,
        wrapRect,
        elem,
        container,
        gap,
        view,
        dist;

    stickEl = function stickEl() {
        wrap = document.querySelector(con);
        stick = document.querySelector(el);
        !topgap ? (gap = 0) : (gap = topgap);
        stickRect = stick.getBoundingClientRect();
        wrapRect = wrap.getBoundingClientRect();
        view = {
            height: window.innerHeight,
            bottom: window.pageYOffset + window.innerHeight,
            top: window.pageYOffset,
        };
        elem = {
            height: stick.offsetHeight,
            bottom: window.pageYOffset + stickRect.bottom,
            top: stickRect.top,
        };
        container = {
            bottom: window.pageYOffset + wrapRect.bottom,
            top: wrapRect.top,
        };
        dist = container.bottom - view.bottom;
        if (window.innerWidth < 767) dist = 0;

        if (container.bottom > view.bottom) {
            if (view.height - container.top > elem.height + gap) {
                stick.classList.add("sticky");
                stick.style.transform = "translateY(-" + dist + "px)";
            } else {
                stick.classList.remove("sticky");
                stick.style.transform = "translateY(0px)";
            }
        } else {
            stick.classList.remove("sticky");
            stick.style.transform = "translateY(0px)";
        }
    };

    if (wait) {
        document.addEventListener("scroll", throttle(stickEl, wait));
    } else {
        var animFrameStick = function animFrameStick() {
            window.requestAnimationFrame(function () {
                stickEl();
            });
        };

        window.addEventListener("scroll", animFrameStick);
    }

    document.addEventListener("click", stickEl);
};

export default sticky