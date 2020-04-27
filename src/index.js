import CollapseBox from './modules/collapseBox'
import ZoomSlider from './modules/slider'
import filters from './modules/filters'
import sticky from './modules/sticky'
import Reviews from './modules/reviews'

import "./style.css";

const mainProductSlider = document.querySelector(".zoom-slider");
const zoomSlider = new ZoomSlider(".zoom-slider", {
    buildImagePreview: true
});

const collapseBoxes = document.querySelectorAll(".collapse-box");
for (const el of collapseBoxes) new CollapseBox(el);

new Reviews('WS-WO-OAK-UK-RANGE')

filters.init();

sticky(".tab-filter", ".tab-filter__cart", 155);