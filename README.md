# PDP 2020 - functionality

## Zoom slider
The slider is capable of both mouse and touch control either directly or though the preview images/dots.

Double touch to zoom (500ms), once zoomed a single touch will move the center point of the zoom, double touch again to zoom out.
Only when zoomed out can the slider be swiped, however the preview and arrow controls will still move to the desired slide.

Initialize the slider:
`new ZoomSlider("[CSS-SELECTOR]");`
The slider can be assigned to a variable to access later, for example if you want to trigger a slider function when clicking on something else on page.

A configuration object can be passed as the second argument.
To have the script build the preview for you pass `{buildImagePreviews: true}` in the config object.
Pass an array of image urls to `{previewImages: [URLS]}` as an additional option to manually override all preview images.
The default action of `buildPreviewImages` is to create them from the current image urls using cloudinary image pararmeters to reduce the image size. If the images do not use cloudinary links, one of the manual options will need to be used, either by hard coding the preview markup, or by passing an array of urls to `{previewImages: []}`.


## Collapse box
Most pages will contain more than one collapse box, to initialize, loop over all elements creating a new instance of `collapseBox`.
```js
const collapseBoxes = document.querySelectorAll(".collapse-box");
for (const el of collapseBoxes) new CollapseBox(el);
```
To set the default state of any collapse box, add `data-open` to the element:
`<div class="collapse-box my-2" data-open id="product-description">...`
The default state is closed but adding this will open the box on load.

## Reviews
Reviews are initialized by passing the product number as the first parameter:
```js
new Reviews('WS-WO-OAK-UK-RANGE')
```
There is an optional second parameter which takes the locations as arguments, two css selectors, one for the head and one for the main area.
```js
new Reviews('WS-WO-OAK-UK-RANGE', {head: '.review-head', main: '.reviews-main'})
```
If reviews are not found or an error occurs, all reviews markup will be removed from the page.


## Filters
Products can be filters by specified options, usually various thicknesses, accessories or all. All shown products can be sorted in and ascending or descending fashion.

Default filter can be set by initializing the filters with a specific filter number:
```js
new ProductFilters('.tab-filter', 1)
```
Note: the default filter is zero indexed, so `0` will trigger the first filter.

Sorting on load can be done through URL parameters. The URL `...?filter=accessories&sort=price&order=asc` will show all accessories, with a descending price sort.