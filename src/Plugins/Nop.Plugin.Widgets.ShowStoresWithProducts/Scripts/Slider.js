if (window.screen.width > 600) {
    var swiper = new Swiper(".store_products_swiper", {
        slidesPerView: 5,
        spaceBetween: 30,
        //autoplay: {
        //    delay: 2500,
        //    disableOnInteraction: false,
        //},
        pagination: {
            el: ".swiper-pagination",
            dynamicBullets: true,
        },
        breakpoints: {
            100: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            280: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            640: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 4,
                spaceBetween: 10,
            },
            850: {
                slidesPerView: 4,
                spaceBetween: 20,
            },
            1124: {
                slidesPerView: 5,
                spaceBetween: 10,
            },
            1224: {
                slidesPerView: 5,
                spaceBetween: 30,
            }
        }
    });
}