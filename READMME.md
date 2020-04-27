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