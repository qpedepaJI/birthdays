$(document).ready(function() {

    let btn = $('.additional_btn').text();
    console.log(btn);

    var mySwiper = new Swiper ('.swiper-container', {
        // Optional parameters
        loop: true,
        speed: 700,
        setWrapperSize:true,
        centeredSlides:true,
        slidesPerView:1,


        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
        },

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

    })
});