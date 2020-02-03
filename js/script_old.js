
jQuery(document).ready(function ($) {

        var jssor_1_options = {
            $Idle: 2000,
            $SlideEasing: $Jease$.$InOutSine,
            $DragOrientation: 3,
            $ArrowNavigatorOptions: {
                $Class: $JssorArrowNavigator$
            },
            $BulletNavigatorOptions: {
                $Class: $JssorBulletNavigator$
            }
        };

        var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);

        //make sure to clear margin of the slider container element
        jssor_1_slider.$Elmt.style.margin = "";

        /*#region responsive code begin*/

        var MAX_WIDTH = 3000;
        var MAX_HEIGHT = 3000;
        var MAX_BLEEDING = 0.128;

        function ScaleSlider() {
            var containerElement = jssor_1_slider.$Elmt.parentNode;
            var containerWidth = containerElement.clientWidth;

            if (containerWidth) {
                var originalWidth = jssor_1_slider.$OriginalWidth();
                var originalHeight = jssor_1_slider.$OriginalHeight();

                var containerHeight = containerElement.clientHeight || originalHeight;

                var expectedWidth = Math.min(MAX_WIDTH || containerWidth, containerWidth);
                var expectedHeight = Math.min(MAX_HEIGHT || containerHeight, containerHeight);

                //scale the slider to expected size
                jssor_1_slider.$ScaleSize(expectedWidth, expectedHeight, MAX_BLEEDING);

                //position slider at center in vertical orientation
                jssor_1_slider.$Elmt.style.top = ((containerHeight - expectedHeight) / 2) + "px";

                //position slider at center in horizontal orientation
                jssor_1_slider.$Elmt.style.left = ((containerWidth - expectedWidth) / 2) + "px";
            } else {
                window.setTimeout(ScaleSlider, 30);
            }
        }

        function OnOrientationChange() {
            ScaleSlider();
            window.setTimeout(ScaleSlider, 800);
        }

        ScaleSlider();

        $(window).bind("load", ScaleSlider);
        $(window).bind("resize", ScaleSlider);
        $(window).bind("orientationchange", OnOrientationChange);
        /*#endregion responsive code end*/

        $(".lounge_wrap > div").click(function () {
            var lounge_index = $(this).index() + 1;

            $("body").css({
                'height': '100vh',
                'overflow': 'hidden'
            });
            $("#lounge_desk").html('<h1>' + $(this).attr('loc') + '</h1>');
            $("#lounge_desk").append('<p>' + $(this).find('.sqst').text() + '</p>');

            $("#jssor_1 > div:first-child > div > div:last-child > div:nth-child(1) > div:first-child > img")
                .attr('src', '/sites/all/themes/main/img/imgdr/allp/lounge_' + lounge_index + '_poto_1.jpg');
            $("#jssor_1 > div:first-child > div > div:last-child > div:nth-child(2) > div:first-child > img")
                .attr('src', '/sites/all/themes/main/img/imgdr/allp/lounge_' + lounge_index + '_poto_2.jpg');
            $("#jssor_1 > div:first-child > div > div:last-child > div:nth-child(3) > div:first-child > img")
                .attr('src', '/sites/all/themes/main/img/imgdr/allp/lounge_' + lounge_index + '_poto_3.jpg');

            $(".lounge_full").css('display', 'block');

        });

        $("#close_button").click(function () {
            $(".lounge_full").css('display', 'none');
            $("body").removeAttr('style');
        });

    });