const products = [
  {
    userName: "User 1",
    name: "Product 1",
    price: "₹3,000",
    image: "/video/product_img.webp",
    videoSrc: "/video/whatmore.mp4",
  },
  {
    userName: "User 2",
    name: "Product 2",
    price: "₹4,500",
    image: "/video/product_img.webp",
    videoSrc: "/video/whatmore.mp4",
  },
  {
    userName: "User 3",
    name: "Product 3",
    price: "₹5,500",
    image: "/video/product_img.webp",
    videoSrc: "/video/whatmore.mp4",
  },
  {
    userName: "User 4",
    name: "Product 4",
    price: "₹6,500",
    image: "/video/product_img.webp",
    videoSrc: "/video/whatmore.mp4",
  },
  // ... add more products as needed
];
const icons = {
  share: {
    viewBox: "0 0 24 24",
    path: "M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z",
  },
  volumeOff: {
    viewBox: "0 0 24 24",
    path: "M3.63 3.63c-.39.39-.39 1.02 0 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0z",
  },
};

function createSvgHtml(iconName) {
  const icon = icons[iconName];
  if (!icon) return "";

  return `
          <svg
            class="svgIcon ${iconName}"
            focusable="false"
            aria-hidden="true"
            viewBox="${icon.viewBox}"
            data-testid="${iconName}Icon"
          >
            <path d="${icon.path}"></path>
          </svg>
        `;
}

// Function to create a swiper slide
function createSwiperSlide(product, index) {
  const slide = document.createElement("div");
  slide.classList.add("swiper-slide");

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const sizeButtonsHtml = sizes
    .map(
      (size) => `<button class="size-btn" data-size="${size}">${size}</button>`
    )
    .join("");

  slide.innerHTML = `
            <div class="video-progress-bar"></div>
            <div class="profileContainer">
              <div class="leftProfile">
                  <div class="profileIcon"></div>
                  <div class="profileName"><p>${product.userName}</p></div>
              </div>
              <div class="rightProfile">
                  ${createSvgHtml("share")}
                  ${createSvgHtml("volumeOff")}
              </div>
            </div>
            <video muted>
              <source src="${product.videoSrc}" type="video/mp4" />
            </video>
            <div class="product-info">
              <div class="product-details">
                <div style="flex:0.3"><img class="item-image" src="${
                  product.image
                }" alt="#"></div>
                <div class="item-details">
                  <p>${product.name}</p>
                  <div class="cart-container">
                     <p>${product.price}</p>
                     <div class="quantity-controls">
                       <button class="decrease-quantity" data-index="${index}">-</button>
                       <span class="quantity-display" data-index="${index}">1</span>
                       <button class="increase-quantity" data-index="${index}">+</button>
                     </div>
                  </div>
                </div>
              </div>
              <div class="size-selection" style="display: none">
                <h4 style="margin: 0px; color: black">Sizes</h4>
                  <div class="sizes">
                    ${sizeButtonsHtml}
                  </div>
              </div>
              <a class="add-to-cart">Add to Cart</a>
            </div>
        `;

  // Add event listeners for this slide if needed

  return slide;
}
// Append new slides to the swiper-wrapper
const swiperWrapper = document.querySelector(".swiper-wrapper");
products.forEach((product, index) => {
  swiperWrapper.appendChild(createSwiperSlide(product, index));
});
// After appending slides
products.forEach((product, index) => {
  // Add event listeners for quantity controls
  const decreaseButtons = swiperWrapper.querySelectorAll(
    `.decrease-quantity[data-index="${index}"]`
  );
  const increaseButtons = swiperWrapper.querySelectorAll(
    `.increase-quantity[data-index="${index}"]`
  );

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", changeQuantity);
  });

  increaseButtons.forEach((button) => {
    button.addEventListener("click", changeQuantity);
  });
});

document.getElementById("openModal").addEventListener("click", function () {
  document.getElementById("swiperModal").style.display = "block";

  // Initialize Swiper after a slight delay to ensure the modal is fully visible
  setTimeout(function () {
    var swiper = new Swiper(".mySwiper", {
      loop: true,
      effect: "coverflow",
      centeredSlides: true,
      slidesPerView: 3,
      spaceBetween: -100,
      autoplay: false,
      coverflowEffect: {
        rotate: 0,
        stretch: -35,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      pagination: {
        el: ".swiper-pagination",
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      on: {
        init: function () {
          playCurrentVideo(this);
        },
        slideChangeTransitionEnd: function () {
          var videos = document.querySelectorAll(".swiper-slide video");
          videos.forEach(function (video) {
            video.pause();
            video.currentTime = 0; // Optional: reset video time
          });
          playCurrentVideo(this);
        },
      },
    });
  }, 20);
});

document.getElementById("closeModal").addEventListener("click", function () {
  document.getElementById("swiperModal").style.display = "none";
});

function playCurrentVideo(swiper) {
  let currentVideo = swiper.slides[swiper.activeIndex].querySelector("video");
  let progressBar = swiper.slides[swiper.activeIndex].querySelector(
    ".video-progress-bar"
  );
  if (currentVideo) {
    currentVideo.currentTime = 0; // Reset the video
    let playPromise = currentVideo.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Listen to the ended event to slide to the next slide
          currentVideo.onended = function () {
            swiper.slideNext();
          };
          currentVideo.ontimeupdate = function () {
            let percentage =
              (currentVideo.currentTime / currentVideo.duration) * 100;
            progressBar.style.width = percentage + "%";
          };
        })
        .catch((error) => {
          console.error("Error attempting to play", error);
        });
    }
  }
}
// Function to handle quantity changes
function changeQuantity(event) {
  // Get the index of the card this button is associated with
  const index = parseInt(event.target.getAttribute("data-index"));

  // Get the current quantity display element and its current quantity
  const quantityDisplay = document.querySelector(
    `.quantity-display[data-index="${index}"]`
  );
  let currentQuantity = parseInt(quantityDisplay.textContent);

  // Determine if we are increasing or decreasing the quantity
  if (event.target.classList.contains("increase-quantity")) {
    // Increase the quantity, but ensure it doesn't exceed the maximum (10)
    if (currentQuantity < 10) {
      currentQuantity++;
    }
  } else if (event.target.classList.contains("decrease-quantity")) {
    // Decrease the quantity, but ensure it doesn't go below the minimum (0)
    if (currentQuantity > 0) {
      currentQuantity--;
    }
  }

  // Update the quantity display element with the new quantity
  quantityDisplay.textContent = currentQuantity;
}

// Add event listeners to the increase and decrease buttons
document.querySelectorAll(".increase-quantity").forEach((button) => {
  button.addEventListener("click", changeQuantity);
});

document.querySelectorAll(".decrease-quantity").forEach((button) => {
  button.addEventListener("click", changeQuantity);
});
document.querySelectorAll(".size-btn").forEach((button) => {
  button.addEventListener("click", function () {
    // Remove 'selected' class from all buttons in this product-info section
    this.closest(".product-info")
      .querySelectorAll(".size-btn")
      .forEach((btn) => btn.classList.remove("selected"));
    // Add 'selected' class to the clicked button
    this.classList.add("selected");
  });
});
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", function () {
    const productInfo = this.closest(".product-info");
    const sizeSelection = productInfo.querySelector(".size-selection");
    const cartBtn = this;

    if (cartBtn.textContent === "Add to Cart") {
      // Show size selection and change button text to "Done"
      sizeSelection.style.display = "flex";
      sizeSelection.style.flexDirection = "column";
      sizeSelection.style.alignItems = "center";
      cartBtn.textContent = "Done";
    } else if (cartBtn.textContent === "Done") {
      const selectedSize = sizeSelection.querySelector(".size-btn.selected");
      if (selectedSize) {
        sizeSelection.style.display = "none"; // Hide the size buttons
        cartBtn.textContent = "Sold Out";
        cartBtn.style.backgroundColor = "white";
        cartBtn.style.color = "black";
        cartBtn.disabled = true; // Disable the button
      } else {
        alert("Please select a size."); // Prompt the user to select a size
      }
    }
  });
});