# PDP 2020 - functionality

## Set up
- Make sure you have node.js installed. Can be installed [here](https://nodejs.org/en/)
- Clone the repository into a suitable folder with `git clone git@github.com:Jack-w-DOS/PDP-2020.git` in the terminal/command prompt. You can do this be either navigating to the folder in your OS terminal/command and running the command, or you can open an inbuilt editor in certain code editors, VScode has one of these and it should open the correct folder in the terminal assuming you have it opened as your working directory.
- Open this folder in your code editor.
- Once you have the folder opened run the command `npm install` in the terminal.
- Create a new branch with `git branch BRANCH_NAME` and the checkout (switch to) the branch with `git checkout BRANCH_NAME`. There is a shorthand for these two commands: `git checkout -b BRANCH_NAME` I would advise this command to prevent accidentally making changes to the master branch. Note: name the branch something relevant to the changes such as `git checkout -b reviews-localisation-update`
- If at any time you are unsure of what branch you are working on you can enter the command `git branch` in your terminal.
- Once on your new branch make all the appropriate changes to the code.
- If you need to see a live preview of your changes enter the command `npm run start` this will open a live development server in a browser window.
- To show a review of your changes, you run `git diff` in the terminal to show a log of all your changes, press enter to scroll down the log. To exit the log just type `q`.
- If you are happy you need to compile the script in the development build, to do this run `npm run build`. This will compile the script in a file called `main.bundle.js`
- Add you changes to the staging area by running `git add .` this will add all updated files to be committed. To only add specific files run `git add FILES_LOCATION/FILE_NAME`
- Commit all of your staged files with `git commit -m "Commit message here"` Try to be descriptive in your commit message.
- Now you need to push your changes to git hub. Run the command `git push origin BRANCH_NAME`.
- Now you need to open a pull request in git hub. You can learn more about that [here](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests).

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
new Reviews("WS-WO-OAK-UK-RANGE");
```

There is an optional second parameter which takes the locations as arguments, two css selectors, one for the head and one for the main area.

```js
new Reviews("WS-WO-OAK-UK-RANGE", {
    head: ".review-head",
    main: ".reviews-main",
});
```

If reviews are not found or an error occurs, all reviews markup will be removed from the page.

## Filters

Products can be filters by specified options, usually various thicknesses, accessories or all. All shown products can be sorted in and ascending or descending fashion.

Options can be set as an object parameter:
```js
new ProductFilters('.tab-filter', { defaultFilter: 1, updateSummary: false} )
```

Note: the default filter is zero indexed, so `0` will trigger the first filter.

Sorting on load can be done through URL parameters. The URL `...?filter=accessories&sort=price&order=asc` will show all accessories, with a descending price sort.

## Smooth scrolling

using data attributes you can attach a target element using a query selector to an element on the page. The second element `data-scroll-callback` can be used to trigger a callback on click.

```html
<div
    data-scroll="#product-reviews"
    data-scroll-callback="
                    (function () {
                        var box = document.getElementById('product-reviews');
                        var head = box.querySelector('.collapse-box__head');
                        if (box.className.indexOf('--open') === -1) head.click();
                    })();
                    "
></div>
```

## Read more

Any content of a read more should be wrapped in a `<span>`. Any paragraph styling inside should be done with break tags or spans, not with additional `<p>` tags.

```html
<p>Heal superficial micro-scratches at home to maintain that new-kitchen look. <span class="read-more"> <span class="d-block" style="margin-bottom:16px;"></span>FENIX NTM&reg; can recover from superficial micro-scratches. FENIX NTM&reg; is also highly resistant to UV light and household cleaning agents, maintaining the colour - meaning it is an investment in the future of your kitchen.</span></p>
```

```js
var readMores = document.querySelectorAll(".read-more");
Array.from(readMores).forEach(
    (item) =>
        new util.ReadMore(item, {
            maxViewPortWidth: 768,
            responsive: {
                768: {
                    show: false,
                },
                1000: {
                    show: true,
                },
            },
        })
);
```

## Modal
```html
<div class="modal">
    <div>Content</div>
    <div class="modal__window">
        Modal content
    </div>
</div>
```
```js
var modal = document.querySelector(".modal");
new utilModal(modal);
```

## Relative Modal

## Compiling script

Script can be accessed through the library 'util', for example `new util.CollapseBox()`.
