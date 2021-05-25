import CollapseBox from './modules/collapseBox'
import ZoomSlider from './modules/slider'
import ProductFilters from './modules/productFilters'
import sticky from './modules/sticky'
import Reviews from './modules/reviews'
import SmoothScroll from './modules/smoothScroll'
import Modal from './modules/modal'
import RelativeModal from './modules/relativeModal'
import ReadMore from './modules/readMore'
import SingleInputControl from './modules/singleInputControl'

// import "./style.css";

// const mainProductSlider = document.querySelector(".zoom-slider");
// const zoomSlider = new ZoomSlider(".zoom-slider", {
//     buildImagePreview: true
// });

// const collapseBoxes = document.querySelectorAll(".collapse-box");
// for (const el of collapseBoxes) new CollapseBox(el);

// new Reviews("WS-WO-OAK-UK-RANGE")
// new Reviews('WA-OIL-RU-1', {merchantID: 'worktop-express-gmbh'})

// sticky(".tab-filter", ".tab-filter__cart", 155);

// new ProductFilters('.tab-filter', { defaultFilter: 1, updateSummary: false} )

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
    ReadMore,
    SingleInputControl
}