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
    });

    $('.header_mobile__burger_open').on('click',function(){
      $(this).css('display','none');
      $('.header__right').css('display','block');
      $('.header_mobile__burger_close').css('display','block');
    });

    $('.header_mobile__burger_close').on('click',function(){
        $(this).css('display','none');
        $('.header__right').css('display','none');
        $('.header_mobile__burger_open').css('display','block');
    });
});