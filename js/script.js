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

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    })
});