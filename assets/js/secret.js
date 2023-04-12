const imageBox = document.querySelector(".image-box");
const spinner = document.getElementById("spinner");
let ready = false;
let loadedImage = 0;
let total = 0;
let imageArray = [];
const apiUrl = `https://api.unsplash.com/photos/random?client_id=${API_KEY}&count=30`;
function imageLoaded() {
  loadedImage++;
  if (loadedImage === total) {
    ready = true;
    spinner.hidden = true;
  }
}
const setAttribute = (element, attributes) => {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
};
function showImages() {
  loadedImage = 0;
  total = imageArray.length;
  imageArray.forEach((image) => {
    // create <a> tag
    const item = document.createElement("a");
    setAttribute(item, {
      href: image.links.html,
      target: "_blank",
    });
    // create image
    const img = document.createElement("img");
    setAttribute(img, {
      src: image.urls.regular,
      alt: image.alt_description,
      title: image.alt_description,
    });
    img.addEventListener("load", imageLoaded);
    // <a> and image put inside container
    item.appendChild(img);
    imageBox.appendChild(item);
  });
}
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    imageArray = await response.json();
    // everything ok run showImage
    showImages();
  } catch (error) {
    // error occured
    alert("something went wrong");
  }
}

// config infinite scroll
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});
getPhotos();
