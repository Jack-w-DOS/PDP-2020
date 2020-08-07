import CollapseBox from './modules/collapseBox'
import ZoomSlider from './modules/slider'
import ProductFilters from './modules/productFilters'
import sticky from './modules/sticky'
import Reviews from './modules/reviews'
import SmoothScroll from './modules/smoothScroll'
import Modal from './modules/modal'
import RelativeModal from './modules/relativeModal'
import ReadMore from './modules/readMore'

// import "./style.css";

// const mainProductSlider = document.querySelector(".zoom-slider");
// const zoomSlider = new ZoomSlider(".zoom-slider", {
//     buildImagePreview: true
// });

// const collapseBoxes = document.querySelectorAll(".collapse-box");
// for (const el of collapseBoxes) new CollapseBox(el);

// new Reviews('SNK-CR-RE-INSET-1/5-RL301CW')

// sticky(".tab-filter", ".tab-filter__cart", 155);

// new ProductFilters('.tab-filter')

// new SmoothScroll()

// const modals = document.querySelectorAll('.modal');
// for (const mod of modals) new Modal(mod)

export default {
    CollapseBox,
    ZoomSlider,
    ProductFilters,
    sticky,
    Reviews,
    SmoothScroll,
    Modal,
    RelativeModal,
    ReadMore
}