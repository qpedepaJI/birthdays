
function phf(id) {
    $(id).attr('placeholder', '');
}

function phb(id, val) {
    $(id).attr('placeholder', val);
}

// video top resize
$(function () {

    var $allVideos = $("iframe[src*='//player.vimeo.com'], iframe[src*='//www.youtube.com'], object, embed"),
        $fluidEl = $(".s_vid");
    $allVideos.each(function () {
        $(this).attr('data-aspectRatio', this.height / this.width).removeAttr('height width');
    });

    $(window).resize(function () {

        // header
        $("body").removeAttr('style');
        $('.right_menu').removeAttr('style');

        // video top resize
        var newWidth = $fluidEl.width();
        $allVideos.each(function () {
            var $el = $(this);
            $el
                .width(newWidth)
                .height(newWidth * $el.attr('data-aspectRatio'));
            var newHeight = newWidth * $el.attr('data-aspectRatio');
            $("#video_but").attr('style', '--box-height: ' + newHeight + 'px');
        });

        // leadform resize
        var wh = $(window).height(), ww = $(window).width();
        if (wh <= 780) $("#order_form > div").addClass('lip');
        else $("#order_form > div").removeAttr('class');

        // lounge <p> height
        if (ww <= 920) {
            $(".l_desc > div").each(function () {
                $(this).parent().attr('style', '--height: ' + ($(this).height() + 54) + 'px'); // 54 т.к. 14px padding + 40px
            });
        }

    }).resize();

});
