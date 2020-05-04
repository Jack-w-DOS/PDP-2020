import CollapseBox from './modules/collapseBox'
import ZoomSlider from './modules/slider'
import ProductFilters from './modules/productFilters'
import sticky from './modules/sticky'
import Reviews from './modules/reviews'
// import FormControl from './modules/formControl'

import "./style.css";

const mainProductSlider = document.querySelector(".zoom-slider");
const zoomSlider = new ZoomSlider(".zoom-slider", {
    buildImagePreview: true
});

const collapseBoxes = document.querySelectorAll(".collapse-box");
for (const el of collapseBoxes) new CollapseBox(el);

new Reviews('WS-WO-OAK-UK-RANGE')

sticky(".tab-filter", ".tab-filter__cart", 155);

// const formInputs = document.querySelectorAll('.increment-input')
// for (const el of formInputs) new FormControl(el)

new ProductFilters('.tab-filter')