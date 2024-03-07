window.addEventListener("load", () => {
  const carouselWrapp = document.querySelector(".weekly-inner__wrapper");
  const carousel = carouselWrapp.querySelector(".carousel");
  const arrowBtns = document.querySelectorAll(".weekly-inner__wrapper i");
  const firstCardWidth = carousel.querySelector(".card").offsetWidth;
  console.log(firstCardWidth);
  //const carouselChildren = [...carousel.children];

  const slides = document.querySelectorAll(".carousel .card");
  const totalWidth = slides.length * firstCardWidth;
  let currentSlide = 0;

  let isDragging = false,
    startX,
    startScrollLeft;

  //let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

  // carouselChildren
  //   .slice(-cardPerView)
  //   .reverse()
  //   .forEach((card) => {
  //     carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  //   });
  // carouselChildren.slice(0, cardPerView).forEach((card) => {
  //   carousel.insertAdjacentHTML("beforeend", card.outerHTML);
  // });

  arrowBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      carousel.scrollLeft +=
        btn.id === "left"
          ? -carousel.querySelector(".card").offsetWidth
          : carousel.querySelector(".card").offsetWidth;
    })
  );

  const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
  };

  const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
  };

  const dragging = (e) => {
    if (!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
  };

  carousel.addEventListener("mousedown", dragStart);
  carousel.addEventListener("mousemove", dragging);
  carousel.addEventListener("mouseup", dragStop);
});
