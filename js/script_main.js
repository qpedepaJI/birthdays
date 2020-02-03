$(document).ready(function () {

    window.dataLayer = window.dataLayer || [];

    function promotion() {

        let DateTime = luxon.DateTime;
        let questDate = $("#ve_d option:selected").val();
        let date = DateTime.fromFormat(questDate, "dd.MM.yy");
        if ($("#ve_q").val() == 680) {
            let pricePacket = $("#ve_p option:selected").val();
            let month = date.toFormat("L");
            if (month == 2) {
                $("#ve_q option:selected").attr("prc_1b", 6000);
                $("#ve_q option:selected").attr("prc_1v", 6000);
                $("#ve_q").attr("prc_1b", 6000);
                $("#ve_q").attr("prc_1v", 6000);
            } else {
                $("#ve_q option:selected").attr("prc_1b", 7500);
                $("#ve_q option:selected").attr("prc_1v", 8000);
                $("#ve_q").attr("prc_1b", 7500);
                $("#ve_q").attr("prc_1v", 8000);
            }
        }
    }


    let win_form = $("#of_quest_table").html();
    let animator = {
        '1115': '',  // Головоломка
        '1110': '',  // Время приключений
        '662': ''    // Как приручить драконов
    };
    let date_of_holydays = [
        '24.02.20',
        '09.03.20'
    ];
    let holidays = {
        /* декабрь */
        '2018-12-30': '',
        '2018-12-31': '',
        /* январь */
        '2019-01-1': '',
        '2019-01-2': '',
        '2019-01-3': '',
        '2019-01-4': '',
        '2019-01-5': '',
        '2019-01-6': '',
        '2019-01-7': '',
        '2019-01-8': '',
        /* февраль, март */
        '2019-02-23': '',
        '2019-03-8': '',
        /* май */
        '2019-05-1': '',
        '2019-05-2': '',
        '2019-05-3': '',
        '2019-05-9': '',
        /* июнь */
        '2019-06-12': '',
        /* ноябрь */
        '2019-11-4': ''
    }
    let quest_arr = {
        '15': 'Пираты в Карибском море',
        '923': 'Алькатрас',
        '25': 'Мумия',
        '64': 'Гарри и последний крестраж',
        '453': 'Звездные воины',
        '670': 'Супергерои: Новое поколение',
        '157': 'Хоббит: путешествие в средиземье',
        '60': 'Чужой',
        '451': 'Динозавры: Парк юрского периода',
        '443': 'Бессознательное',
        '71': 'Морской бой',
        '646': 'Алиса в стране чудес',
        '662': 'Как приручить драконов',
        '662': 'Игры престолов',
        '1115': 'Головоломка',
        '1110': 'Время приключений',
        '680': 'Иллюзия обмана',
        '670': 'Мстители: темные времена',
        '17': 'Пила',
        '65': 'Цирк дю Сатан',
        '871': 'Последняя тайна да Винчи',
        '18': 'Код да Винчи',
    };
    $(".l_desc > div").each(function () {
        $(this).parent().attr('style', '--height: ' + ($(this).height() + 54) + 'px'); // 54 т.к. 14px padding + 40px
    });
    $("#of_phone").mask("8(999) 999-9999");
    let json_data, datetime, order = {};

    function getQuestsTime(data) {

        $(".pem").remove();
        $("#ve_v").removeAttr('disabled style').prev().removeAttr('style');

        let path = $("#ve_d"), cd = '', i = 1;
        $("#ve_v").append('<option value="0">Выберите время</option>'); // true
        data.forEach(function (e) {
            let d = new Date(e.date),
                d_day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate(),
                d_month = d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1,
                d_year = d.getFullYear().toString().slice(2),
                full_date = d_day + '.' + d_month + '.' + d_year;
            let disabled_time = e.time.split(':');

            if (path.val() == full_date) {
                if (e.is_free) {
                    if (disabled_time[0] < 22 && disabled_time[0] > 4) {
                        $("#ve_v").append('<option value="' + e.time + '">' + e.time + '</option>'); // true
                    }
                } else {
                    $("#ve_v").append('<option disabled value="' + e.time + '">' + e.time + '</option>'); // false
                }
            }
        });

        let qty_all = 0, qty_dis = 0;
        $("#ve_v").children('option').each(function () {
            qty_all++;
            if ($(this).attr('disabled')) qty_dis++;
        });
        if (qty_all == qty_dis) {
            $("#double_dts").after('<p class="comnt pem">Нету сеансов</p>');
            $("#ve_v").css('cursor', 'auto').attr('disabled', '').prev().css('background', '#9a6f43');
        }
    }

    function form_up(pack_id, quest_id) {

        if ($("#of_quest_table").attr('pf') == '1') {
            $("#of_quest_table").attr('pf', '0');
            $("#serv_mes").remove();
            $("#of_quest_table > div > div > div:first-child > button").css('opacity', '1');
            $("#of_quest_table > div > div > div:first-child > div").css('opacity', '1');
            $("#of_quest_table > div > div > div:first-child > ul").css('opacity', '1');
            $("#of_quest_table > div > div > div:first-child > p").css('opacity', '1');
        }

        $("#order_form").css('display', 'block');
        $("body").css({
            'height': '100vh',
            'overflow': 'hidden'
        });
        $("#sec_wrap").css('overflow-y', 'scroll');
        let of_height = $("#order_form > div").height();
        if ((of_height + 80) >= $(window).height() && $(window).width() >= 700) { // + 80 т.к. padding: 40px 0px;
            $("#order_form > div").addClass('lip');
        }

        $("#ve_d").removeAttr('disabled style').prev().removeAttr('style');
        $("#ve_d").html('<option value="">ВЫБЕРИТЕ ДАТУ</option>');
        $("#ve_v").html('<option value="">ВЫБЕРИТЕ ВРЕМЯ</option>');
        $("#com_ad").text('').removeAttr('style');
        if (pack_id === undefined || pack_id == '') {

            $("#ve_q > option").each(function () {
                if (
                    $(this).attr('value') == '17' ||
                    $(this).attr('value') == '65' ||
                    $(this).attr('value') == '871'
                ) {
                    $(this).removeAttr('disabled');
                }
            });
            if (
                quest_id == '17' ||
                quest_id == '65' ||
                quest_id == '871'
            ) {
                $("#ve_p > option").each(function () {
                    if (
                        $(this).attr('value') == '6500' ||
                        $(this).attr('value') == '8500' ||
                        $(this).attr('value') == '12500'
                    ) {
                        $(this).attr('disabled', '');
                    }
                });
            } else if (quest_id == '64') {
                $("#ve_p > option").each(function () {
                    if (
                        $(this).attr('value') == '8500' ||
                        $(this).attr('value') == '12500'
                    ) {
                        $(this).attr('disabled', '');
                    }
                });
            } else {
                $("#ve_p > option").each(function () {
                    if (
                        $(this).attr('value') == '6500' ||
                        $(this).attr('value') == '8500' ||
                        $(this).attr('value') == '12500'
                    ) {
                        $(this).removeAttr('disabled');
                    }
                });
            }

            if (quest_id == '670' || quest_id == '1110') {
                $("#ve_k").html(
                    '<option value="2">2 человека</option>' +
                    '<option value="3">3 человека</option>' +
                    '<option value="4">4 человека</option>' +
                    '<option value="5">5 человек</option>' +
                    '<option value="6">6 человек</option>' +
                    '<option value="7">7 человек</option>' +
                    '<option value="8">8 человек</option>'
                );
            } else if (quest_id == '157') {
                $("#ve_k").html(
                    '<option value="2">2 человека</option>' +
                    '<option value="3">3 человека</option>' +
                    '<option value="4">4 человека</option>' +
                    '<option value="5">5 человек</option>' +
                    '<option value="6">6 человек</option>' +
                    '<option value="7">7 человек</option>'
                );
            } else {
                $("#ve_k").html(
                    '<option value="2">2 человека</option>' +
                    '<option value="3">3 человека</option>' +
                    '<option value="4">4 человека</option>' +
                    '<option value="5">5 человек</option>' +
                    '<option value="6">6 человек</option>'
                );
            }

            if (quest_id == '157') {

            }

            $("#ve_p").val('0');
            $("#ve_q").val(quest_id);

            $("#ve_q").prev().css('background', '#714417');

            $(".pac_price").text('0');
            $(".pac_title > span").text('Выберите пакет').css('color', '#e80f0f');
            $(".wiip").html('').css({'opacity': '0', 'margin-bottom': '-14px'});

            let v = $("#ve_q").val();
            $("#ve_q > option").each(function () {
                if ($(this).attr('value') == v)
                    $("#com_ad").html('<i class="fas fa-map-marker-alt"></i>' + $(this).attr('loc'));
            });

            let q_api = '/booking/' + quest_id + '/world_of_quest.json';
            $.getJSON(q_api, function (data) {
                json_data = data;
                let cd = '', i = 1;
                data.forEach(function (e) {
                    if (i < 29) {
                        if (cd == '' || cd != e.date) {
                            i++;
                            cd = e.date;

                            let d = new Date(e.date),
                                d_day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate(),
                                d_month = d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1,
                                d_year = d.getFullYear().toString().slice(2),
                                full_date = d_day + '.' + d_month + '.' + d_year;

                            let nac = '',
                                dnn = d.getDay(),
                                dnr = {
                                    '1': 'пн',
                                    '2': 'вт',
                                    '3': 'ср',
                                    '4': 'чт',
                                    '5': 'пт',
                                    '6': 'сб',
                                    '0': 'вс'
                                };

                            if (dnn == 6 || dnn == 0) {
                                nac = 'class="nac" ';
                            }
                            if (holidays[e.date] !== undefined) {
                                nac = 'class="nac" ';
                            }
                            $("#ve_d").removeAttr("disabled").append('<option ' + nac + 'utc="' + e.date + '" value="' + full_date + '">' + full_date + ' ' + dnr[dnn] + '</option>');
                        }
                    }
                });
            });

        } else if (quest_id === undefined || quest_id == '') {

            $("#ve_p > option").each(function () {
                if (
                    $(this).attr('value') == '6500' ||
                    $(this).attr('value') == '8500' ||
                    $(this).attr('value') == '12500'
                ) {
                    $(this).removeAttr('disabled');
                }
            });

            if (pack_id == '5000') {
                $("#ve_q > option").each(function () {
                    if (
                        $(this).attr('value') == '17' ||
                        $(this).attr('value') == '65' ||
                        $(this).attr('value') == '871' ||
                        $(this).attr('value') == '64'
                    ) {
                        $(this).removeAttr('disabled');
                    }
                });
            } else if (pack_id == '6500') {
                $("#ve_q > option").each(function () {
                    if (
                        $(this).attr('value') == '64'

                    ) {
                        $(this).removeAttr('disabled');
                    }
                });
            } else {
                $("#ve_q > option").each(function () {
                    if (
                        $(this).attr('value') == '17' ||
                        $(this).attr('value') == '65' ||
                        $(this).attr('value') == '871' ||
                        $(this).attr('value') == '64'
                    ) {
                        $(this).attr('disabled', '');
                    }
                });
            }

            $("#ve_p").val(pack_id);
            $("#ve_q").val('0');

            $("#ve_p").prev().css('background', '#714417');

            $("#ve_d").css('cursor', 'auto').attr('disabled', '').prev().css('background', '#9a6f43');
            $("#ve_v").css('cursor', 'auto').attr('disabled', '').prev().css('background', '#9a6f43');
            $("#com_ad").text('Выберите квест').css('color', '#e80f0f');

            $(".button_order").each(function () {

                console.log('Форма работает');
                console.log(quest_id);
                if ($(this).attr('prc') == pack_id) {
                    $(".pac_price").text(pack_id);
                    let lis = $(this).parent().prev().children('ul').html(),
                        pnm = $(this).parent().prev().prev().text();

                    $(".wiip").html(lis);
                    $(" .wiip >li").each(function (index, element) {
                        if ($(element).html().indexOf('Торт в подарок имениннику') > -1) {
                            $(element).html('');
                        }
                    });
                    $(".wiip").removeAttr('style');

                    if (pack_id == '6500') {
                        $(".wiip > li:last-child").remove();
                        $(".wiip").append(
                            '<li class="dops"><input type="checkbox" id="dy_tort" value="Торт в подарок именнинику" checked="checked"><label id="tort" for="dy_tort">торт в подарок имениннику</label></li>' +
                            '<li class="dops"><input type="checkbox"  disabled value="аниматор в квесте" checked id="dy_ani"><label for="dy_ani" id="anim">аниматор в квесте</label></li>' +
                            '<li class="dops"><input type="checkbox" value="Мастер-класс" id="dy_master_class"><label for="dy_master_class" id="master_class">мастер-класс</label></li>' +
                            '<li class="dops"><input type="checkbox" value="Мастер-класс" id="dy_him"><label for="dy_him" id="him_show">химическое шоу</label></li>' +
                            '<li class="dops" style="display: none;"><input type="checkbox" value="аниматор в квесте Человек паук" id="dy_ani_p"><label for="dy_ani_p" id="anim_p">аниматор в квесте Человек паук</label></li>' +
                            '<li class="dops" style="display: none;"><input type="checkbox" value="VIP лаунж" id="dy_big_launzh"><label for="dy_big_launzh" id="big_launzh">VIP лаунж</label></li>'
                        );
                    }
                    if (pack_id == '8500' || pack_id == '12500') {
                        console.log(quest_id);
                        $(".wiip > li.met_mc").remove();
                        $(".wiip").append(
                            '<li class="dops"><input type="checkbox" id="dy_tort" value="Торт в подарок именнинику" checked="checked"><label for="dy_tort" id="tort">торт в подарок имениннику</label></li>' +
                            '<ul class="master_class">На выбор:' +
                            '<li><input type="radio" id="mc_list_1" name="mc_list" value="изготовление лизунов" value="Лизуны" checked><label for="mc_list_1"> изготовление лизунов</label></li>' +
                            '<li><input type="radio" id="mc_list_3" name="mc_list" value="Химическое шоу" value="Хим"><label for="mc_list_3"> химическое шоу</label></li>' +
                            '</ul>' +
                            '<li class="dops" style="display: none;"><input type="checkbox" value="аниматор в квесте Человек паук" id="dy_ani_p"><label for="dy_ani_p" id="anim_p">аниматор в квесте Человек паук</label></li>' +
                            '<li class="dops" style="display: none;"><input type="checkbox" value="VIP лаунж" id="dy_big_launzh"><label for="dy_big_launzh" id="big_launzh">VIP лаунж</label></li>'
                        );
                    }
                    if (pack_id == '5000') {

                        $(".wiip").append(
                            '<li class="dops"><input type="checkbox" id="dy_tort" value="Торт в подарок именнинику" checked="checked"><label for="dy_tort" id="tort">торт в подарок имениннику</label></li>' +
                            '<li class="dops"><input type="checkbox" value="Аниматор в квесте" id="dy_ani"><label for="dy_ani" id="anim">аниматор в квесте</label></li>' +
                            '<li class="dops"><input type="checkbox" value="Мастер-класс" id="dy_master_class"><label for="dy_master_class" id="master_class">мастер-класс</label></li>' +
                            '<li class="dops"><input type="checkbox" value="Мастер-класс" id="dy_him"><label for="dy_him" id="him_show">химическое шоу</label></li>' +
                            '<li class="dops" style="display: none;"><input type="checkbox" value="аниматор в квесте Человек паук" id="dy_ani_p"><label for="dy_ani_p" id="anim_p">аниматор в квесте Человек паук</label></li>' +
                            '<li class="dops" style="display: none;"><input type="checkbox" value="VIP лаунж" id="dy_big_launzh"><label for="dy_big_launzh" id="big_launzh">VIP лаунж</label></li>'
                        );
                    }
                    if (
                        pack_id == '5000' ||
                        pack_id == '6500' ||
                        pack_id == '8500'
                    ) {
                        $(".wiip").append(
                            '<li class="dops"><input type="checkbox" value="Фотограф в квест" id="dy_photo"><label for="dy_photo" id="foto">фотограф в квест</label></li>'
                        );
                    }
                    $(".pac_title > span").html('<span>Состав пакета ' + pnm + ':</span>').removeAttr('style');
                }
            });

        } else {

        }

        $("#ve_v").change(function () {

            promotion();
            let time = $(this).val();
            let amount = $('#ve_k').val();
            let qid = $("#ve_q").val();
            let date = $('#ve_d').val();
            let type = $('#ve_q option:selected').attr('type_quest');

            time = time.split(':');
            let day_value = $("#ve_d").val(), dow, vib;
            $("#ve_d > option").each(function () {
                if ($(this).attr('value') == day_value) {
                    dow = new Date($(this).attr('utc')).getDay();
                }
            });

            if (date_of_holydays.indexOf(date) !== -1) {
                vib = 'v'
            } else {
                if ((dow == 5 && time[0] > 16) || (dow == 6 || dow == 0)) {
                    vib = 'v';
                } else {
                    vib = 'b'
                }
            }

            let pid = {
                '5000': 1,
                '6500': 2,
                '8500': 3,
                '12500': 4
            };

            let pack_id = $(this).parent().parent().parent().parent().parent().parent().find('#ve_p').val();
            let iep = $('#ve_q option:selected').attr('prc_' + pid[pack_id] + vib);

            if (amount == 7) {
                iep = Number(iep) + 1000;
            } else if (amount == 8) {
                iep = Number(iep) + 2000;
            } else {
                iep = iep;
            }
            if ($('#ve_p').val() == '5000' && $('#dy_ani').prop('checked') && qid != 1110) {
                if (qid == 662 && type == '2') {

                } else {
                    iep = Number(iep) + 2000;
                }

            }
            if (($('#ve_p').val() == '5000' || $('#ve_p').val() == '6500') && $('#dy_master_class').prop('checked')) {
                iep = Number(iep) + 3500;
            }
            if (($('#ve_p').val() == '5000' || $('#ve_p').val() == '6500') && $('#dy_him').prop('checked')) {
                iep = Number(iep) + 3500;
            }

            if ($('#dy_ani_p').prop('checked')) {
                iep = Number(iep) + 3000;
            }

            if ($('#dy_big_launzh').prop('checked')) {
                iep = Number(iep) + 2000;
            }

            if (animator[$("#ve_q").val()] !== undefined) {
                $('#dy_ani').css('disabled', 'true');
            }
            $(".pac_price").text(iep);

        });

        $("#ve_p").change(function () {

            $("#ve_k").val(6);

            if ($('#ve_v').val() != 0) {
                console.log('якорь внутри');
                $('#ve_v').val(0);
            }
            if ($(this).val() == '5000') {
                $("#ve_q > option").each(function () {
                    if (
                        $(this).attr('value') == '17' ||
                        $(this).attr('value') == '65' ||
                        $(this).attr('value') == '871' ||
                        $(this).attr('value') == '64'
                    ) {
                        $(this).removeAttr('disabled');
                    }
                });
            } else if ($(this).val() == '6500') {
                $("#ve_q > option").each(function () {
                    if (
                        $(this).attr('value') == '64'

                    ) {
                        $(this).removeAttr('disabled');
                    }
                });
            } else {
                $("#ve_q > option").each(function () {
                    if (
                        $(this).attr('value') == '17' ||
                        $(this).attr('value') == '65' ||
                        $(this).attr('value') == '871' ||
                        $(this).attr('value') == '64'
                    ) {
                        $(this).attr('disabled', '');
                    }
                });
            }

            $(this).prev().css('background', '#714417');
            $(".error_message").remove();
            let pack_id = $(this).val();
            $(".button_order").each(function () {
                if ($(this).attr('prc') == pack_id) {
                    if ($("#ve_q").val() !== null) {
                        let v = $("#ve_q").val();
                        $("#ve_q > option").each(function () {
                            if ($(this).attr('value') == v) {
                                let pid = {
                                    '5000': 1,
                                    '6500': 2,
                                    '8500': 3,
                                    '12500': 4
                                };
                                if ($("#ve_d").val() == '') {
                                    let iep = $(this).attr('prc_' + pid[pack_id] + 'b');
                                    if (pid[pack_id] == 1) {
                                        iep = iep;
                                    } else if (animator[$("#ve_q").val()] !== undefined) {
                                        iep = iep;
                                        console.log('аниматор2');
                                        $('#dy_ani').css('disabled', 'true');
                                    }
                                    $(".pac_price").text(iep);
                                    console.log(iep);
                                } else {
                                    let day_value = $("#ve_d").val(), dow, vib;
                                    $("#ve_d > option").each(function () {
                                        if ($(this).attr('value') == day_value) {
                                            dow = new Date($(this).attr('utc')).getDay();
                                        }
                                    });
                                    let time = $('#ve_v').val();
                                    let date = $('#ve_d').val();
                                    if (date_of_holydays.indexOf(date) !== -1) {
                                        vib = 'v'
                                    } else {
                                        if ((dow == 5 && time[0] > 16) || (dow == 6 || dow == 0)) {
                                            vib = 'v';
                                        } else {
                                            vib = 'b'
                                        }
                                    }
                                    let iep = $(this).attr('prc_' + pid[pack_id] + vib);
                                    if (pid[pack_id] == 1) {
                                        iep = iep;
                                    } else if (animator[$("#ve_q").val()] !== undefined) {
                                        iep = iep;
                                        console.log('аниматор3');
                                        $('#dy_ani').css('disabled', 'true');
                                    }
                                    $(".pac_price").text(iep);
                                }
                            }
                        });
                    } else {
                        $(".pac_price").text(pack_id);
                    }

                    let lis = $(this).parent().prev().children('ul').html(),
                        pnm = $(this).parent().prev().prev().text();
                    $(".wiip").html(lis);
                    $(" .wiip >li").each(function (index, element) {
                        if ($(element).html().indexOf('Торт в подарок имениннику') > -1) {
                            $(element).html('');
                        }
                    });
                    $(".wiip").removeAttr('style');


                    if (pack_id == '6500') {
                        $(".wiip > li:last-child").remove();

                        $(".wiip").append(
                            '<li class="dops"><input type="checkbox" value="Торт в подарок именнинику" id="dy_tort" checked="checked"><label for="dy_tort"  for="dy_tort">торт в подарок имениннику</label></li>' +
                            '<li class="dops"><input type="checkbox"  disabled value="Аниматор в квесте" checked id="dy_ani"><label for="dy_ani" id="anim">аниматор в квесте</label></li>' +
                            '<li class="dops"><input type="checkbox" value="Мастер-класс" id="dy_master_class"><label for="dy_master_class" id="master_class">мастер-класс</label></li>' +
                            '<li class="dops"><input type="checkbox" value="Мастер-класс" id="dy_him"><label for="dy_him" id="him_show">химическое шоу</label></li>' +
                            '<li class="dops" style="display: none;"><input type="checkbox" value="аниматор в квесте Человек паук"  id="dy_ani_p" style="display: none;"><label for="dy_ani_p" id="anim_p">аниматор в квесте Человек паук</label></li>' +
                            '<li class="dops" style="display: none;"><input type="checkbox" value="VIP лаунж" id="dy_big_launzh"><label for="dy_big_launzh" id="big_launzh">VIP лаунж</label></li>'
                        );
                    }
                    if (pack_id == '8500' || pack_id == '12500') {
                        $(".wiip > li.met_mc").remove();
                        $(".wiip").append(
                            '<li class="dops"><input type="checkbox" value="Торт в подарок именнинику" id="dy_tort" checked="checked"><label for="dy_tort"  for="dy_tort">торт в подарок имениннику</label></li>' +
                            '<ul class="master_class">На выбор:' +
                            '<li><input type="radio" id="mc_list_1" name="mc_list" value="изготовление лизунов" value="Лизуны" checked><label for="mc_list_1"> изготовление лизунов</label></li>' +

                            '<li><input type="radio" id="mc_list_3" name="mc_list" value="Химическое шоу" value="Хим"><label for="mc_list_3"> химическое шоу</label></li>' +
                            '</ul>' +
                            '<li class="dops" style="display: none;"><input type="checkbox" value="аниматор в квесте Человек паук"  id="dy_ani_p" style="display: none;"><label for="dy_ani_p" id="anim_p">аниматор в квесте Человек паук</label></li>' +
                            '<li class="dops" style="display: none;"><input type="checkbox" value="VIP лаунж" id="dy_big_launzh"><label for="dy_big_launzh" id="big_launzh">VIP лаунж</label></li>'
                        );
                    }
                    if (pack_id == '5000') {
                        $(".wiip").append(
                            '<li class="dops"><input type="checkbox" id="dy_tort" value="Торт в подарок именнинику" checked="checked"><label for="dy_tort"  for="dy_tort">торт в подарок имениннику</label></li>' +
                            '<li class="dops"><input type="checkbox" value="Аниматор в квесте" id="dy_ani"><label for="dy_ani" id="anim">аниматор в квесте</label></li>' +
                            '<li class="dops"><input type="checkbox" value="Мастер-класс" id="dy_master_class"><label for="dy_master_class" id="master_class">мастер-класс</label></li>' +
                            '<li class="dops"><input type="checkbox" value="Мастер-класс" id="dy_him"><label for="dy_him" id="him_show">химическое шоу</label></li>' +
                            '<li class="dops" style="display: none;"><input type="checkbox" value="аниматор в квесте Человек паук" id="dy_ani_p" style="display: none;"><label for="dy_ani_p" id="anim_p">аниматор в квесте Человек паук</label></li>' +
                            '<li class="dops" style="display: none;"><input type="checkbox" value="VIP лаунж" id="dy_big_launzh"><label for="dy_big_launzh" id="big_launzh">VIP лаунж</label></li>'
                        );
                    }
                    if (
                        pack_id == '5000' ||
                        pack_id == '6500' ||
                        pack_id == '8500'
                    ) {
                        $(".wiip").append(
                            '<li class="dops"><input type="checkbox" value="Фотограф в квест" id="dy_photo"><label for="dy_photo" id="foto">фотограф в квест</label></li>'
                        );
                    }
                    $(".pac_title > span").html('<span>Состав пакета ' + pnm + ':</span>').removeAttr('style');
                }
            });
            let v = $('#ve_q').val();

            if (v == '1110' && pack_id == '5000') {
                $('#dy_ani').prop('checked', true);
                $('#dy_ani').prop('disabled', true);
            } else {
                if (pack_id == '5000') {
                    $('#dy_ani').prop('checked', false);
                    $('#dy_ani').prop('disabled', false);
                }
            }
            let pirat = '<li id="pirat-master"><input type="radio" id="mc_list_2" name="mc_list" value="Пиратский мастер-класс" value="Пиратский"><label for="mc_list_2"> пиратский мастер-класс</label></li>';

            if ($('#ve_q').val() == '15') {
                $('.master_class').append(pirat);
            } else {
                $('#pirat-master').remove();
            }

            if ($('#ve_q').val() == '670') {
                $('#dy_ani_p').parent().css('display', 'block');
            } else {
                $('#dy_ani_p').parent().css('display', 'none');
            }

            let quest = $('#ve_q').val();

            if (quest == '670' || quest == '646' || quest == '680' || quest == '1110') {
                $('#dy_big_launzh').parent().css('display', 'block');
            } else {
                $('#dy_big_launzh').parent().css('display', 'none');
            }
        });

    }


    /*-------------------Пофиксить-----------------------------*/

    // $("#of_quest_table").on('click', '#dy_tort', function () {
    //     if ($(this).is(':checked')) let psd = parseInt($(".pac_price").text()) + 500;
    //     else let psd = parseInt($(".pac_price").text()) - 500;
    //     $(".pac_price").text(psd);
    // });

    /*-------------------------------------------------*/

    $("#of_quest_table").on('click', '#dy_ani', function () {
        let is_checked = $(this).prop("checked");
        qid = $("#ve_q").val();
        console.log(qid);


        let sel_pa = $("#ve_p");
        let price_sel = $('.pac_price').html();
        if (is_checked == false) {
            console.log(qid);
            if ($.inArray(qid, ['1115', '662']) == -1) {
                price_sel = parseInt(price_sel) - 2000;
            }
        } else {
            if ($.inArray(qid, ['1115', '662']) == -1) {
                price_sel = parseInt(price_sel) + 2000;
            }

        }
        console.log(price_sel);
        $(".pac_price").text(price_sel);
        $(" .wiip >li").each(function (index, element) {
            if ($(element).html().indexOf('Торт в подарок имениннику') > -1) {
                $(element).html('');


            }
        });
    });
    $("#of_quest_table").on('click', '#dy_master_class', function () {
        let is_checked = $(this).prop("checked");
        qid = $("#ve_q").val();

        let sel_pa = $("#ve_p");
        let price_sel = $('.pac_price').html();
        if (is_checked == false) {
            price_sel = parseInt(price_sel) - 3500;
        } else {
            price_sel = parseInt(price_sel) + 3500;
        }
        $(".pac_price").text(price_sel);
        $(" .wiip >li").each(function (index, element) {
            if ($(element).html().indexOf('Торт в подарок имениннику') > -1) {
                $(element).html('');
            }
        });
    });
    $("#of_quest_table").on('click', '#dy_him', function () {
        let is_checked = $(this).prop("checked");
        qid = $("#ve_q").val();
        let sel_pa = $("#ve_p");
        let price_sel = $('.pac_price').html();
        if (is_checked == false) {
            price_sel = parseInt(price_sel) - 3500;
        } else {
            price_sel = parseInt(price_sel) + 3500;
        }
        $(".pac_price").text(price_sel);
    });

    $("#of_quest_table").on('click', '#dy_ani_p', function () {
        let is_checked = $(this).prop("checked");
        qid = $("#ve_q").val();
        let sel_pa = $("#ve_p");
        let price_sel = $('.pac_price').html();
        if (is_checked == false) {
            price_sel = parseInt(price_sel) - 3000;
        } else {
            price_sel = parseInt(price_sel) + 3000;
        }
        $(".pac_price").text(price_sel);
    });

    $("#of_quest_table").on('click', '#dy_big_launzh', function () {
        let is_checked = $(this).prop("checked");
        qid = $("#ve_q").val();
        let sel_pa = $("#ve_p");
        let price_sel = $('.pac_price').html();
        if (is_checked == false) {
            price_sel = parseInt(price_sel) - 2000;
        } else {
            price_sel = parseInt(price_sel) + 2000;
        }
        $(".pac_price").text(price_sel);
    });

    /*-----------------------Пофиксить---------------------------------*/

    // $("#of_quest_table").on('click', '#dy_photo', function () {
    //     if ($(this).is(':checked')) let psd = parseInt($(".pac_price").text()) + 2500;
    //     else let psd = parseInt($(".pac_price").text()) - 2500;
    //     $(".pac_price").text(psd);
    // });

    // $("#of_quest_table").on('click', '#dy_lounge', function () {
    //     if ($(this).is(':checked')) let psd = parseInt($(".pac_price").text()) + 1500;
    //     else let psd = parseInt($(".pac_price").text()) - 1500;
    //     $(".pac_price").text(psd);
    // });

    // $("#ve_q").change(function () {
    //
    //     let tinkoff_array = ['17', '18', '65', '25', '60', '71', '15', '443', '1115', '871', '157', '662', '680', '451', '453', '773', '670', '646', '1110', '64', '66', '928'];
    //     let tinkoff_quest = $(this).val();
    //     console.log('tinkoff_quest = ' + tinkoff_quest);
    //
    //     if (tinkoff_array.indexOf(tinkoff_quest) != -1) {
    //
    //         $('#button_d2').css('display', 'inline-block');
    //         $('#button_d3').css('display', 'inline-block');
    //
    //     } else {
    //         $('#button_d2').css('display', 'none');
    //         $('#button_d3').css('display', 'none');
    //     }
    //
    //     if (($('#ve_p').val() == '5000') || $('#ve_p').val() == '6500') $('#dy_master_class').removeAttr("checked");
    //     if (($('#ve_p').val() == '5000') || $('#ve_p').val() == '6500') $('#dy_him').removeAttr("checked");
    //     if ($(this).val() == '670') {
    //         $('#dy_ani_p').parent().css('display', 'block');
    //     } else {
    //         $('#dy_ani_p').parent().css('display', 'none');
    //     }
    //
    //     let quest = $(this).val();
    //
    //     if (quest == '670' || quest == '646' || quest == '680' || quest == '1110') {
    //         $('#dy_big_launzh').parent().css('display', 'block');
    //     } else {
    //         $('#dy_big_launzh').parent().css('display', 'none');
    //     }
    //
    //     $('#pirat-master').remove();
    //     let v = $(this).val();
    //
    //     let pirat = '<li id="pirat-master"><input type="radio" id="mc_list_2" name="mc_list" value="Пиратский мастер-класс" value="Пиратский"><label for="mc_list_2"> пиратский мастер-класс</label></li>';
    //
    //     if (v == '15') $('.master_class').append(pirat);
    //
    //     if (v == '871' || v == '65' || v == '17') {
    //         $('#anim').css('display', 'none');
    //     } else {
    //         $('#anim').css('display', 'inline');
    //     }
    //     if (
    //         v == '17' ||
    //         v == '65' ||
    //         v == '871'
    //     ) {
    //         $("#ve_p > option").each(function () {
    //             if (
    //                 $(this).attr('value') == '6500' ||
    //                 $(this).attr('value') == '8500' ||
    //                 $(this).attr('value') == '12500'
    //             ) {
    //                 $(this).attr('disabled', '');
    //             }
    //         });
    //     } else if (
    //         v == '64') {
    //         $("#ve_p > option").each(function () {
    //             if (
    //                 $(this).attr('value') == '8500' ||
    //                 $(this).attr('value') == '12500'
    //             ) {
    //                 $(this).attr('disabled', '');
    //             }
    //         });
    //     } else {
    //         $("#ve_p > option").each(function () {
    //             if (
    //                 $(this).attr('value') == '6500' ||
    //                 $(this).attr('value') == '8500' ||
    //                 $(this).attr('value') == '12500'
    //             ) {
    //                 $(this).removeAttr('disabled');
    //             }
    //         });
    //     }
    //
    //     $(this).prev().css('background', '#714417');
    //
    //     $(".error_message").remove();
    //
    //     $("#ve_d").html('<option value="">ВЫБЕРИТЕ ДАТУ</option>');
    //     $("#ve_v").html('<option value="">ВЫБЕРИТЕ ВРЕМЯ</option>');
    //     $("#ve_q > option").each(function () {
    //         if ($(this).attr('value') == v) {
    //             $("#com_ad").html('<i class="fas fa-map-marker-alt"></i>' + $(this).attr('loc')).removeAttr('style');
    //
    //             if ($("#ve_p").val() !== null) {
    //                 let pp = $("#ve_p").val(),
    //                     pid = {
    //                         '5000': 1,
    //                         '6500': 2,
    //                         '8500': 3,
    //                         '12500': 4
    //                     };
    //                 if (pid[pp] === undefined) pp = '5000';
    //                 let iep = $(this).attr('prc_' + pid[pp] + 'b');
    //                 if (pid[pp] == 1) {
    //                     iep = iep;
    //                 } else if (animator[v] !== undefined) {
    //                     iep = iep;
    //                     console.log('аниматор4');
    //                     $('#dy_ani').css('disabled', 'true');
    //                 }
    //
    //                 if ($("#ve_p").val() != null) {
    //                     if ($("#dy_photo").is(':checked')) {
    //                         iep = parseInt(iep) + 2500;
    //                     }
    //                     if ($("#dy_lounge").is(':checked')) {
    //                         iep = parseInt(iep) + 1500;
    //                     }
    //                 }
    //                 if ((v == '1110' || v == '662') && $("#ve_p").val() == '5000') {
    //                     $('#dy_ani').prop('checked', true);
    //                     $('#dy_ani').prop('disabled', true);
    //                 } else {
    //                     if ($("#ve_p").val() == '5000') {
    //                         $('#dy_ani').prop('checked', false);
    //                         $('#dy_ani').prop('disabled', false);
    //                     }
    //                 }
    //                 $(".pac_price").text(iep);
    //             }
    //         }
    //     });
    //
    //     if (v == '670' || v == '1110') {
    //         $("#ve_k").html(
    //             '<option value="2">2 человека</option>' +
    //             '<option value="3">3 человека</option>' +
    //             '<option value="4">4 человека</option>' +
    //             '<option value="5">5 человек</option>' +
    //             '<option value="6">6 человек</option>' +
    //             '<option value="7">7 человек</option>' +
    //             '<option value="8">8 человек</option>'
    //         );
    //     } else if (v == '157') {
    //         $("#ve_k").html(
    //             '<option value="2">2 человека</option>' +
    //             '<option value="3">3 человека</option>' +
    //             '<option value="4">4 человека</option>' +
    //             '<option value="5">5 человек</option>' +
    //             '<option value="6">6 человек</option>' +
    //             '<option value="7">7 человек</option>'
    //         );
    //     } else {
    //         $("#ve_k").html(
    //             '<option value="2">2 человека</option>' +
    //             '<option value="3">3 человека</option>' +
    //             '<option value="4">4 человека</option>' +
    //             '<option value="5">5 человек</option>' +
    //             '<option value="6">6 человек</option>'
    //         );
    //     }
    //
    //     $('#ve_k').change(function () {
    //         console.log('изменение колличества человек!!!');
    //         let time = $('#ve_v').val();
    //         let qid = $("#ve_q").val();
    //         time = time.split(':');
    //         let day_value = $("#ve_d").val(), vib;
    //         let dow = $('#ve_d').val();
    //         dow = dow.split(".");
    //         let day = "20" + dow[2] + "-" + dow[1] + "-" + dow[0];
    //         day = new Date(day).getDay();
    //         let date = $('#ve_d').val();
    //         if (date_of_holydays.indexOf(date) !== -1) {
    //             vib = 'v'
    //         } else {
    //             if ((day == 5 && time[0] > 16) || (day == 6 || day == 0)) {
    //                 vib = 'v';
    //             } else {
    //                 vib = 'b'
    //             }
    //         }
    //
    //         let pid = {
    //             '5000': 1,
    //             '6500': 2,
    //             '8500': 3,
    //             '12500': 4
    //         };
    //         let amount = $(this).val();
    //         let pack_id = $(this).parent().parent().parent().parent().parent().parent().find('#ve_p').val();
    //         let iep = $('#ve_q option:selected').attr('prc_' + pid[pack_id] + vib);
    //         if (amount == 7) {
    //             iep = Number(iep) + 1000;
    //         } else if (amount == 8) {
    //             iep = Number(iep) + 2000;
    //         } else {
    //             iep = iep;
    //         }
    //         if ($('#ve_p').val() == '5000' && $('#dy_ani').prop('checked') && qid != 1110) {
    //             iep = Number(iep) + 2000;
    //         }
    //         if (($('#ve_p').val() == '5000' || $('#ve_p').val() == '6500') && $('#dy_master_class').prop('checked')) {
    //             iep = Number(iep) + 3500;
    //         }
    //         if (($('#ve_p').val() == '5000' || $('#ve_p').val() == '6500') && $('#dy_him').prop('checked')) {
    //             iep = Number(iep) + 3500;
    //         }
    //         if ($('#dy_ani_p').prop('checked')) {
    //             iep = Number(iep) + 3000;
    //         }
    //
    //         if ($('#dy_big_launzh').prop('checked')) {
    //             iep = Number(iep) + 2000;
    //         }
    //         $('.pac_price').html(iep);
    //
    //
    //     });
    //
    //     let q_api = '/booking/' + $(this).val() + '/world_of_quest.json';
    //     $.getJSON(q_api, function (data) {
    //         json_data = {};
    //         json_data = data;
    //         let cd = '', i = 1;
    //         data.forEach(function (e) {
    //             if (i < 29) {
    //                 if (cd == '' || cd != e.date) {
    //                     i++;
    //                     cd = e.date;
    //                     let d = new Date(e.date),
    //                         d_day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate(),
    //                         d_month = d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1,
    //                         d_year = d.getFullYear().toString().slice(2),
    //                         full_date = d_day + '.' + d_month + '.' + d_year;
    //
    //                     let nac = '',
    //                         dnn = d.getDay(),
    //                         dnr = {
    //                             '1': 'пн',
    //                             '2': 'вт',
    //                             '3': 'ср',
    //                             '4': 'чт',
    //                             '5': 'пт',
    //                             '6': 'сб',
    //                             '0': 'вс'
    //                         };
    //
    //                     if (dnn == 6 || dnn == 0) {
    //                         nac = 'class="nac" ';
    //                     }
    //                     if (holidays[e.date] !== undefined) {
    //                         nac = 'class="nac" ';
    //                     }
    //                     $("#ve_d").removeAttr("disabled").append('<option ' + nac + 'utc="' + e.date + '" value="' + full_date + '">' + full_date + ' ' + dnr[dnn] + '</option>');
    //                 }
    //             }
    //         });
    //         $("#ve_d").removeAttr('disabled style').prev().removeAttr('style');
    //         getQuestsTime(data);
    //     });
    //
    // });

    /*-----------------------------------------------------------------*/

    $("#ve_d").change(function () {

        promotion();

        $(this).prev().css('background', '#714417');
        $(".error_message").remove();
        $("#ve_v").html('');
        $("#ve_k").val(6);

        getQuestsTime(json_data);
        let dow,
            utc,
            m = $(this).val(),
            dpng = {
                '2018-12-24': '',
                '2018-12-25': '',
                '2018-12-26': '',
                '2018-12-27': '',
                '2018-12-28': '',
                '2018-12-29': ''
            };
        $("#ve_d > option").each(function () {
            if ($(this).attr('value') == m) {
                dow = new Date($(this).attr('utc')).getDay();
                utc = $(this).attr('utc');
            }
        });
        let nez = '0',
            qid = $("#ve_q").val(),
            conceptName = $('#ve_q :selected').text();


        if (dow == 6 || dow == 0 ||
            holidays[utc] !== undefined ||
            (qid == '64' && dpng[utc] !== undefined) ||
            (qid == '451' && dpng[utc] !== undefined) ||
            (qid == '453' && dpng[utc] !== undefined) ||
            (qid == '646' && dpng[utc] !== undefined) ||
            (qid == '670' && dpng[utc] !== undefined) ||
            (qid == '923' && dpng[utc] !== undefined)
        ) {

            $("#ve_q > option").each(function () {
                console.log(conceptName);
                if (conceptName == 'Как приручить драконов (6+)') {
                    console.log('notName');
                    if ($(this).attr('value') == qid && $(this).attr('type_quest') == "2") {
                        let pack = $("#ve_p").val();
                        if (pack == '5000') {
                            nez = $(this).attr('prc_1v');
                        } else if (pack == '6500') {
                            nez = $(this).attr('prc_2v');
                        } else if (pack == '8500') {
                            nez = $(this).attr('prc_3v');
                        } else if (pack == '12500') {
                            nez = $(this).attr('prc_4v');
                        } else {
                            console.log('Такой цены нет');
                        }
                    }
                } else {
                    if ($(this).attr('value') == qid) {
                        let pack = $("#ve_p").val();
                        if (pack == '5000') {
                            nez = $(this).attr('prc_1v');
                        } else if (pack == '6500') {
                            nez = $(this).attr('prc_2v');
                        } else if (pack == '8500') {
                            nez = $(this).attr('prc_3v');
                        } else if (pack == '12500') {
                            nez = $(this).attr('prc_4v');
                        } else {
                            console.log('Такой цены нет');
                        }
                    }
                }

            });
        } else { // Будни
            $("#ve_q > option").each(function () {
                if (conceptName == 'Как приручить драконов (6+)') {
                    console.log('notName');
                    if ($(this).attr('value') == qid && $(this).attr('type_quest') == "2") {
                        let pack = $("#ve_p").val();
                        if (pack == '5000') {
                            nez = $(this).attr('prc_1b');
                        } else if (pack == '6500') {
                            nez = $(this).attr('prc_2b');
                        } else if (pack == '8500') {
                            nez = $(this).attr('prc_3b');
                        } else if (pack == '12500') {
                            nez = $(this).attr('prc_4b');
                        } else {
                            console.log('Такой цены нет');
                        }
                    }
                } else {
                    if ($(this).attr('value') == qid) {
                        let pack = $("#ve_p").val();
                        if (pack == '5000') {
                            nez = $(this).attr('prc_1b');
                        } else if (pack == '6500') {
                            nez = $(this).attr('prc_2b');
                        } else if (pack == '8500') {
                            nez = $(this).attr('prc_3b');
                        } else if (pack == '12500') {
                            nez = $(this).attr('prc_4b');
                        } else {
                            console.log('Такой цены нет');
                        }
                    }

                }
            });
        }
        if ($("#ve_p").val() == '5000') {
            nez = nez;
        } else if (animator[qid] !== undefined) {
            nez = nez;
            $('#dy_ani').css('disabled', 'true');
        }
        if ($("#ve_p").val() != null) {
            if ($("#dy_photo").is(':checked')) {
                nez = parseInt(nez) + 2500;
            }
            if (qid == '662') {
                if ($("#dy_ani").is(':checked')) {
                    nez = parseInt(nez) + 0;
                }
            }
            if ($("#dy_lounge").is(':checked')) {
                nez = parseInt(nez) + 1500;
            }
        }
        if ($('#ve_p').val() == '5000' && $('#dy_ani').prop('checked') && qid != 1110) {
            nez = Number(nez) + 2000;
        }
        if (($('#ve_p').val() == '5000' || $('#ve_p').val() == '6500') && $('#dy_master_class').prop('checked')) {

            nez = Number(nez) + 3500;
        }
        if (($('#ve_p').val() == '5000' || $('#ve_p').val() == '6500') && $('#dy_him').prop('checked')) {

            nez = Number(nez) + 3500;
        }
        if ($('#dy_ani_p').prop('checked')) {

            nez = Number(nez) + 3000;
        }

        if ($('#dy_big_launzh').prop('prop')) {
            nez = Number(nez) + 2000;
        }
        $(".pac_price").text(nez);
    });
    $('#ve_q').on('change', function () {
        $('#dy_photo').prop('checked', false);
        $('#dy_lounge').prop('checked', false);
    });

    $(".button_order").click(function () {
        let tar = $(this).attr('prc');
        form_up(tar, '');
    });

    $(".quest_img").click(function () {
        let tar = $(this).attr('qid');
        form_up('', tar);
    });

    function errorClean(tar) {
        tar.css('background', '#714417').next('.of_error_mes').css({
            'margin-top': '-55px',
            'margin-bottom': '0px',
            'color': 'transparent'
        });
    }

    $("#order_form .of_close").click(function () {
        $("#order_form").css('display', 'none');
        $("body").removeAttr('style');
        $("#sec_wrap").removeAttr('style');
        if ($("#order_form > div").attr('position') == '0') {
            console.log('Обнов.');
        }
        json_dat = {};
        json_data = '';
    });

    $("#of_quest_table").on('click', '.return_button', function () {
        $("#order_form").css('display', 'none');
        $("#content_wrap").css({
            'height': 'auto',
            'overflow': 'auto'
        });
        if ($("#order_form > div").attr('position') == '0') {
            console.log('Обнов.');
        }
        json_dat = {};
        json_data = '';
    });


    $("#of_name").keypress(function (key) {
        if (key.charCode > 48 && key.charCode < 57) return false;
    });

    $("#button_d1").click(function () {
        console.log('type = ' + $('#ve_q option:selected').html());
        let addopt_string = '';
        $(this).parent().find('.addopts').each(function () {
            addopt_string += $(this).html() + ',';
        });
        addopt_string = ' ' + addopt_string.substring(13);

        let photo = 'фотограф в квест, ';
        let tort = 'торт, ';
        let animator = 'аниматор, ';
        let master_lizun = 'мастер-класс по изготовлению лизунов';
        let lounge = 'доп. аренда лаунжа, ';
        let addopts_title = '';
        let new_addopts;

        if ($("#dy_photo").is(':checked')) {
            addopts_title += photo;
        }
        if ($("#dy_tort").is(':checked')) {
            addopts_title += tort;
        }
        if ($("#dy_ani").is(':checked')) {
            addopts_title += animator;
        }
        if ($("#dy_master_class").is(':checked')) {
            addopts_title += master_lizun;
        }


        if ($("#dy_lounge").is(':checked')) {
            addopts_title += lounge;
        }
        if (addopts_title != '') {
            new_addopts = '  Доп. услуги: ' + addopts_title + ',';
        } else {
            new_addopts = addopts_title;
        }

        $(".error_message").remove();

        function errorMassageSel(tar) {
            tar.prev().css('background', '#bb4428');
        }

        if ($("#ve_q").val() === null) {
            errorMassageSel($("#ve_q"));
        }
        ;
        if ($("#ve_v").val() == 0) {
            errorMassageSel($("#ve_v"));
        }
        ;

        if ($("#ve_p").val() === null) {
            errorMassageSel($("#ve_p"));
        }
        ;

        if ($("#ve_d").val() == '') {
            errorMassageSel($("#ve_d"));
        }
        ;

        function errorMassage(tar) {
            tar.css('background', '#bb4428').next('.of_error_mes').css({
                'margin-top': '-40px',
                'margin-bottom': '4px',
                'color': '#e40000'
            }).text('Пустое поле');
        }

        if ($("#of_name").val() == '') {
            errorMassage($("#of_name"));
        }
        ;

        if ($("#of_phone").val() == '') {
            errorMassage($("#of_phone"));
        }
        ;

        if ($("#of_email").val() == '') {
            errorMassage($("#of_email"));
        }
        ;

        let pn = $("#ve_p").val();
        $("#ve_p > option").each(function () {
            if ($(this).attr('value') == pn)
                order['pack_name'] = 'Пакет: ' + $(this).text();
        });

        let sad = $("#ve_d").val();
        $("#ve_d > option").each(function () {
            if ($(this).attr('value') == sad) {
                let nd = new Date($(this).attr('utc')),
                    nd_day = nd.getDate() < 10 ? '0' + nd.getDate() : nd.getDate(),
                    nd_month = nd.getMonth() < 9 ? '0' + (nd.getMonth() + 1) : nd.getMonth() + 1,
                    nd_year = nd.getFullYear();
                let nt = $("#ve_v").val().slice(0, -3);
                console.log(nt);
                nt = parseInt(nt);
                if (nt == 0 || nt < 5) {
                    nd_day = parseInt(nd_day);
                    nd_day--;
                    console.log(nd_day);
                }

                order['datetime'] = nd_day + '.' + nd_month + '.' + nd_year + ' ' + $("#ve_v").val();
            }
            ;
        });

        order['pack_price'] = $(".pac_price").text();
        order['quest_id'] = $("#ve_q").val();
        order['name'] = $("#of_name").val();
        order['phone'] = $("#of_phone").val();
        order['email'] = $("#of_email").val();
        order['qty'] = $("#ve_k").val();

        console.log(order);
        let mc_val = $(".master_class input[name='mc_list']:checked").val();
        if (mc_val === undefined) {
            mc_val = '';
        } else {
            mc_val = '  Мастер-класс: ' + mc_val;
        }

        function validateEmail(email) {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        if (
            $("#ve_v").val() === null || $("#ve_v").val() == '' ||
            order['pack_price'] == '0' || order['pack_price'] === null ||
            order['pack_name'] == 'Пакет: ' || order['pack_name'] == '' ||
            order['quest_id'] == '' || order['quest_id'] === null ||
            order['datetime'] === undefined ||
            order['name'] == '' ||
            order['phone'] == '' ||
            order['email'] == '' ||
            order['qty'] == '' || $("#ve_v").val() == 0
        ) {
            $(".pac_prw").after('<p class="error_message">Пожалуйста, заполните все поля</p>');
        } else if (!validateEmail(order['email'])) {
            $(".pac_prw").after('<p class="error_message">Некорректный адрес электронной почты</p>');
            errorMassage($("#of_email"));
            $("#of_email").next('.of_error_mes').text('Некорректная почта');
        } else {
            let name_paket = '';
            console.log(order['quest_id']);
            let quests_name = $('#ve_q option:selected').html();
            if (quests_name == 'Как приручить драконов (6+)' || quests_name == 'Игры престолов (6+, 14+)' || quests_name == 'Мстители: темные времена (14+)' || quests_name == 'Супергерои: Новое поколение (5+)') {
                name_paket = quests_name + ' ';
            }

            let manager_comment = '';
            if ($('#button_d1').hasClass('payment')) {
                manager_comment = 'незавершённая оплата тинькофф';
                console.log('незавершенная оплата');
            }

            let referer = null;
            $('#referer').val() !== undefined ? referer = $('#referer').val() : referer = null;
            $('#utm_medium').val() !== undefined ? medium = $('#utm_medium').val() : medium = null;
            $('#utm_campaign').val() !== undefined ? campaign = $('#utm_campaign').val() : campaign = null;
            $('#utm_term').val() !== undefined ? term = $('#utm_term').val() : term = null;


            let data_server = {
                quest: order['quest_id'],
                time: order['datetime'],
                name: order['name'],
                phone: order['phone'],
                email: order['email'],
                pa: order['qty'],
                subject: 'all',
                url: 'http://',
                price: order['pack_price'],
                comment: name_paket + order['pack_name'] + addopt_string + new_addopts + mc_val,
                can_join: 'no',
                alread_played: 'no',
                part: '',
                promocode: '',
                loyal_cart: '',
                loyal_skydka: 0,
                mcomment: manager_comment,
                coupon: '',
                is_payment: false,
                referer: referer,
                medium: medium,
                campaign: campaign,
                term: term,
            };


            $.ajax({
                url: Drupal.settings.basePath + 'book/add',
                type: "POST",
                data: data_server,
                success: function (data) {
                    if (data.status == true) {

                        $('#button_d1').removeClass('payment');
                        $('#orderNumber_tin').val(data.bid);
                        $('#tin_paiment')[0].disabled = false;
                        $('#no')[0].disabled = false;
                        let pack_name,
                            pack_price = $("#ve_p").val();
                        $("#ve_p > option").each(function () {
                            if ($(this).attr('value') == pack_price)
                                pack_name = $(this).text();
                        });
                        let message = 'Пакет День Рождения "' + pack_name + '" успешно забронирован! Мы с Вами свяжемся в ближайшее время!';

                        dataLayer.push({
                            "event": "purchase",
                            "ecommerce": {
                                "purchase": {
                                    "actionField": {
                                        "id": 'dr' + order['quest_id'] + '-' + order['datetime'],
                                        "affiliation": "",
                                        "revenue": order['pack_price'],
                                    },
                                    "products": [{
                                        "name": pack_name,
                                        "id": order['quest_id'],
                                        "price": order['pack_price'],
                                        "quantity": 1,
                                    }]
                                }
                            }
                        });

                    } else {
                        let message = data.message;
                    }
                    $("#of_quest_table").attr('pf', '1');
                    $(".lp_pad").after('<div id="serv_mes" style=""><p>' + message + '<button class="return_button">ВЕРНУТЬСЯ</button></p></div>');
                    $("#of_quest_table > div > div > div:first-child > button").css('opacity', '0');
                    $("#of_quest_table > div > div > div:first-child > div").css('opacity', '0');
                    $("#of_quest_table > div > div > div:first-child > ul").css('opacity', '0');
                    $("#of_quest_table > div > div > div:first-child > p").css('opacity', '0');
                    $("#of_name").val('');
                    $("#of_phone").val('');
                    $("#of_email").val('');
                    $(".wiip").html('');

                }
            });
            let my_paket = order['pack_name'];
            my_paket = my_paket.split(':');
            let quest_name = '';
            let quest_names = order['quest_id'];
            for (let i in quest_arr)
                if (i == quest_names) quest_name = (quest_arr[i]);
            let my_data = {
                quest: quest_name,
                time: order['datetime'],
                name: order['name'],
                phone: order['phone'],
                email: order['email'],
                pa: order['qty'],
                subject: 'all',
                url: 'http://',
                price: order['pack_price'],
                comment: my_paket[1],
                can_join: 'no',
                alread_played: 'no',
                part: '',
                promocode: '',
                loyal_cart: '',
                loyal_skydka: 0,
                coupon: '',
                is_payment: false
            }
            $.ajax({
                url: '/sites/all/modules/ilocked_booking/includes/sender.php',
                type: "POST",
                data: my_data,
                success: function (data) {
                    console.log(data);
                }
            });
        }
    });

    $("#of_name").focus(function () {
        errorClean($("#of_name"));
        $(".error_message").remove();
    });
    $("#of_phone").focus(function () {
        errorClean($("#of_phone"));
        $(".error_message").remove();
    });
    $("#of_email").focus(function () {
        errorClean($("#of_email"));
        $(".error_message").remove();
    });

    $(".slider_buttons").on('click', 'div', function () {
        $(".slider_buttons > div").each(function () {
            $(this).removeClass('sb_on');
        });
        $(this).addClass('sb_on');
        let m = $(this).attr('gn');

        $(".reviews_wrap > div:first-child img").each(function () {
            if (m == $(this).attr('gn'))
                $(this).attr('class', 'vo');
            else
                $(this).attr('class', 'ho');
        });

        $(".reviews_wrap > div:last-child p").each(function () {
            if (m == $(this).attr('gn'))
                $(this).attr('class', 'vo');
            else
                $(this).attr('class', 'ho');
        });

        $(".reviews_wrap > div:first-child p").each(function () {
            if (m == $(this).attr('gn'))
                $(this).attr('class', 'vo');
            else
                $(this).attr('class', 'ho');
        });
    });

    function phf(id) {
        $(id).attr('placeholder', '');
    }

    function phb(id, val) {
        $(id).attr('placeholder', val);
    }


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