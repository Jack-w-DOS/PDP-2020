import CollapseBox from './modules/collapseBox'
import ZoomSlider from './modules/slider'
import ProductFilters from './modules/productFilters'
import sticky from './modules/sticky'
import Reviews from './modules/reviews'
import SmoothScroll from './modules/smoothScroll'
// import FormControl from './modules/formControl'

import "./style.css";

const mainProductSlider = document.querySelector(".zoom-slider");
const zoomSlider = new ZoomSlider(".zoom-slider", {
    buildImagePreview: true
});

const collapseBoxes = document.querySelectorAll(".collapse-box");
for (const el of collapseBoxes) new CollapseBox(el);

new Reviews('SNK-CR-RE-INSET-1/5-RL301CW')

sticky(".tab-filter", ".tab-filter__cart", 155);

// const formInputs = document.querySelectorAll('.increment-input')
// for (const el of formInputs) new FormControl(el)

new ProductFilters('.tab-filter')

new SmoothScroll()