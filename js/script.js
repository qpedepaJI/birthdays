$(document).ready(function() {

    let btn = $('.additional_btn').text();
    $('.left_items__item_select').selectric();

    var mySwiper = new Swiper ('.swiper-container', {
        // Optional parameters
        loop: true,
        speed: 700,
        setWrapperSize:true,
        centeredSlides:true,
        slidesPerView:1,
        dots:false,

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        breakpoints: {
            // when window width is >= 320px
            320: {

            },
            // when window width is >= 480px
            480: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            // when window width is >= 640px
            640: {
                slidesPerView: 4,
                spaceBetween: 40
            }
        }

    })

});