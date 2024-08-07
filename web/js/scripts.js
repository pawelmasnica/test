var timeoutID;


var gMapsLoaded = false;
jQuery.event.special.touchstart = {
    setup: function (_, ns, handle) {
        this.addEventListener("touchstart", handle, {passive: true});
    }
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function findErrorInTab() {
    if ($('.tab-content .has-error').length) {
        var tabId = $('.tab-content .has-error').parents('.tab-pane').attr('id');
        $('.nav a[href="#' + tabId + '"]').tab('show');
    }
}

function capitalize(el) {
    $(el).each(function (k, v) {
        var str = $.trim($(v).html());
        var firstLetter = '<span class="capitalize">' + str.charAt(0) + '<span>';
        var newText = firstLetter + '' + str.substr(1);
        $(v).html(newText);
    })
}

function grayImg() {

    $('.group-media-tiles figure img').each(function () {
        var el = $(this);
        el.clone().css({"position": "absolute"}).addClass('grayscale').css({
            "position": "absolute",
            "z-index": "2"
        }).insertBefore(el).queue(function () {
            var el = $(this);

            el.dequeue();
        });

    });


}


function setFlash(message, success) {

    var container = $('<div class="alert text-center">');
    if (success) {
        container.addClass('alert-success');
    } else {
        container.addClass('alert-danger');
    }
    container.html(message);
    var button = $('<button type="button" class="close" data-dismiss="alert">&times;</button>');

    container.prepend(button).fadeIn().delay(8000).fadeOut(function () {
        container.remove()
    });
    $('.flash-messages').append(container);
}


var loadContent = function (url, isObject) {
    var ajaxContainer = $('.ajax-container');
    var request = $.ajax({
        url: url,
        method: "GET",
        dataType: "html"
    });
    request.done(function (msg) {
        if (isObject) {
            console.log('jest obiektem');
            var content = $(msg).find('#main');
            ajaxContainer.html(content);
            window.history.pushState(url, null, url);

        } else {
            window.history.pushState(url, null, null);
            ajaxContainer.html(msg);
            runSlider();
        }
    });
    request.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
};


function copyToClipboard(elem) {
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.getAttribute('data-content');
    }
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);


    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch (e) {
        succeed = false;
    }
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        target.textContent = "";
    }
    return succeed;
}

function vibrate() {

    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
    if (navigator.vibrate) {
        navigator.vibrate(40);
    }
}


function rmWidthClass(element) {
    $(element).removeClass('width-xxs').removeClass('width-xs').removeClass('width-sm').removeClass('width-md').removeClass('width-lg').removeClass('width-xl').removeClass('width-xxl');
}

function setResponsiveWidth(element) {
    $(element).each(function () {
        rmWidthClass(element);
        if ($(this).width() < 360) {

            $(this).addClass('width-xxs');
        }
        if ($(this).width() > 360 && $(this).width() < 576) {
            $(this).addClass('width-xs');
        }
        if ($(this).width() > 576 && $(this).width() < 767) {
            $(this).addClass('width-sm');
        }
        if ($(this).width() > 767 && $(this).width() < 992) {
            $(this).addClass('width-md');
        }

        if ($(this).width() > 992 && $(this).width() < 1200) {
            $(this).addClass('width-lg');
        }

        if ($(this).width() > 1200 && $(this).width() < 1400) {
            $(this).addClass('width-xl');
        }

        if ($(this).width() > 1400) {
            $(this).addClass('width-xxl');
        }
    });

}

function replaceAndLoadImg(number, bgImgSizes, imgWidth, that, bgImg) {

    var imgPath = bgImgSizes[0] + '/' + number + 'w_' + bgImgSizes[1];
    var path = imgPath.replace(/(url\(|\)|")/g, '');


    if (path !== bgImg) {


        //console.log(bgImg);
        /*console.log(imgPath);
        console.log(bgImg);
        console.log('---------');*/

        var img = new Image();
        img.src = path;
        img.onload = function () {
            that.css('background-image', 'url(' + path + ')');
        };
    }
}

function setResponsiveBackgroundImage() {


    $('.responsive-background').each(function () {

        if ($(this).width() === 0) {
            return;
        }


        var bgImg = $(this).css('background-image');
        var path = bgImg.replace(/(url\(|\)|")/g, '');

        if (path && path==='' || path==='none') {
            return false;
        }
        var founded = path.search("-webkit-cross-fade");
        if (!founded) {
            return false;
        }

        var reg = new RegExp('\/\\d+w_');
        var bgImgSizes = bgImg.split(reg);

        pieces = bgImgSizes[0].split('/');
        imgWidth = pieces.slice(-1).pop();

        if (imgWidth !== 'none') {


            if ($(this).width() <= 300) {
                replaceAndLoadImg(300, bgImgSizes, imgWidth, $(this), path);
            }
            if ($(this).width() > 300 && $(this).width() <= 578) {
                replaceAndLoadImg(578, bgImgSizes, imgWidth, $(this), path);
            }

            if ($(this).width() > 578 && $(this).width() <= 992) {
                replaceAndLoadImg(992, bgImgSizes, imgWidth, $(this), path);
            }

            if ($(this).width() > 992 && $(this).width() <= 1400) {
                replaceAndLoadImg(1400, bgImgSizes, imgWidth, $(this), path);
            }


            if ($(this).width() > 1400 && $(this).width() <= 1920) {
                replaceAndLoadImg(1920, bgImgSizes, imgWidth, $(this), path);
            }

            if ($(this).width() > 1920) {
                replaceAndLoadImg(2560, bgImgSizes, imgWidth, $(this), path);
            }
        }
    });


}

$(document).ready(function () {


    $('.counter-wrapper').waypoint(function() {
        $('.counter').addClass('timer');
        $('.timer').countTo();
    }, {
        offset: '100%',
        triggerOnce: false
    });

    $('.timer').countTo();

    var links = document.querySelectorAll('a');

    [].forEach.call(links, function (link) {

        link.addEventListener("mouseenter", function () {

            var newPreLoadLink = document.createElement("link");
            newPreLoadLink.rel = "prerender";
            newPreLoadLink.href = link.href;


            document.head.appendChild(newPreLoadLink);
        })
    });


    $(document).ajaxStart(function () {
        $(".loader-wrapper, .loader-wrapper-container").fadeIn();
    });
    $(document).ajaxError(function () {
        $(".loader-wrapper, .loader-wrapper-container").fadeOut();
    });
    $(document).ajaxStop(function () {
        $(".loader-wrapper, .loader-wrapper-container").fadeOut();
    });


    $('.popup-section-ajax').on('click', function (e) {
        e.preventDefault();
        var url = $(this).attr('href');

        $.ajax({
            url: url,
            cache: false
        })
            .done(function (html) {
                $(".popupContentContainer").html(html);


                $('#contentContainerPopup').bPopup({
                    position: ['auto', 'auto'],
                    easing: 'easeOutBack',
                    modal: true,
                    speed: 450,
                    zIndex: 999,
                    transition: 'fadeIn',
                    transitionClose: 'fadeOut',
                    closeClass: 'close'
                }).reposition(100);
                ;
            });


        return false;
    });


    setResponsiveBackgroundImage();
    setInterval(setResponsiveBackgroundImage, 1000);

    document.addEventListener('touchstart', scrolling, {passive: true});


    function scrolling() {
        $(window).scroll(function () {

            //console.log($(window).height());
            var hHigh = $('header#header').height();
            if ($(this).scrollTop() > hHigh && $(this).scrollTop() <= (hHigh * 3)) {
                $('body').addClass('scrolled');
            } else {
                $('body').removeClass('scrolled');
            }
            if ($(this).scrollTop() > (hHigh * 3)) {
                $('body').addClass('inView');
            } else {
                $('body').removeClass('inView');
            }
        });
    }

    scrolling();

    $('[data-toggle="tooltip"]').tooltip();

    $('a').on('click', function (e) {
        vibrate();
    });


    $('.copy-link').on('click', function (e) {
        e.preventDefault();
        if (copyToClipboard(this)) {
            alert($(this).data('confirmation'))
        }

        return false;
    });


    jarallax(document.querySelectorAll('.jarallax'));


    runSlider();


    var sticky = $(".sticky").sticky({
        topSpacing: 0,
        responsiveWidth: true
    });

    sticky.on('sticky-end', function () {
        $(".sticky").css('marginTop', 0)
        setTimeout(function () {
            sticky.sticky('update');
        }, 300);
    });

    var footerBottomAdjust;
    var pos = $('.sticky-column').position();
    if(pos){
        footerBottomAdjust = $('.sticky-column').height()-pos.top;
    }else{
        footerBottomAdjust = $('.sticky-column').height();
    }

    if ($(window).width() >= 992) {
        var stickyFlow = $(".sticky-flow").sticky({
            topSpacing: 100,
            bottomSpacing: footerBottomAdjust,
            responsiveWidth: true
        });

        var stickyFlowColumn = $(".sticky-flow-column .ge-content").sticky({
            topSpacing: 146,
            bottomSpacing: 400,
            responsiveWidth: true
        });


    }


    $('a.button[href^="#"]').on('click', function (e) {
        e.preventDefault();

        var target = this.hash;
        var $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 900, 'swing', function () {

        });
    });


    $(".navbar").on('click', function (e) {
        if ($(e.target).hasClass('navbar')) {
            $('body').removeClass('navigation-opened');
        }
    });

    if ($(window).width() <= 992) {

        $("ul.navigation > li.parent").on('click', function (e) {


            var that = $(this);
            $("ul.navigation > li.parent").each(function (index, element) {

                if (!$(e.currentTarget).is($(element))) {
                    $(this).removeClass('opened');
                }
            });

            if (!$(e.currentTarget).hasClass('opened')) {

                $(e.currentTarget).addClass('opened');
                return false;

            } else {

                $(e.currentTarget).removeClass('opened');
            }


        });

    }
    $('.close-nav').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('body').removeClass('navigation-opened');
        return false;
    });

    $(".hamburger-nav").on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).toggleClass('active');
        $('body').toggleClass('navigation-opened');
        var cltxt = $(this).find('span').data('closetext');
        var mtxt = $(this).find('span').data('menutext');

        if ($('body').hasClass('navigation-opened')) {
            $(this).find('span').text(cltxt);
        } else {
            $(this).find('span').text(mtxt);
        }

        return false;
    });


    findErrorInTab();

    $('body').on('click', '.lightbox, *[rel="lightbox"]', function () {
        blueimp.Gallery($(this));
        return false;
    });

});

function closeMenu() {
    var top_offset = $('#header').height() - 1;
    $("body").removeClass('navigation-opened');
    $('.hamburger-nav').removeClass('active');
}


/**slider*/
function runSlider() {
    if ($('.carousel').length) {

        $('.carousel').owlCarousel({
            navigation: true,
            pagination: true,
            slideSpeed: 800,
            paginationSpeed: 400,
            singleItem: true,
            autoPlay: 6000,

            navigationText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>']
        });
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";path=/; " + expires;
}

function closeCookieInfo() {
    var days = 180;
    var value = true;
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
    document.cookie = "cookieInfo=" + value + expires + "; path=/";
    $('#cookie-container').remove();
}

new WOW().init();

$(window).bind("resize", function () {
    setResponsiveBackgroundImage();

    $('.sticky').on('sticky-update', function () {
        $(".sticky").unstick();
        var sticky = $(".sticky").sticky({
            topSpacing: 0,
            responsiveWidth: true
        });
    });
});


$(window).on('load', function (e) {
    setResponsiveBackgroundImage();


    $('nav ul, .scroll-dots ul').onePageNav({
        filter: ':not(.external)',
        currentClass: 'current',
        easing: 'easeInOutExpo',
        topPadding: $(window).width() <= 980 ? 0 : '90',
        changeHash: false,
        begin: closeMenu
    });


    $("img.popup").each(function () {
        var link = $('<a>').attr('href', $(this).attr('src'));
        $(this).appendTo(link);
        link.replaceWith($(this));
        blueimp.Gallery(link);
    });


    if (window.location.hash) {
        var hash = window.location.hash.substring(1);
        if (jQuery('a[href="/#' + hash + '"]').length > 0) {

            jQuery('html, body').animate({
                scrollTop: jQuery("#" + hash).offset().top
            }, 1000);
        }
    }
});


var win = $(window),
    doc = $(document);

function createLightbox() {

    var lightbox = $("#pop-up");

    if (!lightbox.length) {
        lightbox = $("<div></div>", {
            "id": "pop-up",
            "class": "pop-up"
        }).appendTo("body");

        var close = $("<span></span>", {
            "class": "pop-up__close",
            "on": {
                "click": function () {
                    closeOverlay();
                    closeLightbox();
                }
            }
        });

        lightbox.append(close);
    }

    return lightbox;

}

function createOverlay() {

    var overlay = $("#pop-up-overlay");

    if (!overlay.length) {
        overlay = $("<div></div>", {
            "id": "pop-up-overlay",
            "class": "pop-up-overlay",
            on: {
                click: function () {
                    closeOverlay();
                    closeLightbox();
                }
            }
        }).appendTo("body");
    }

    return overlay;

}

function showOverlay() {

    var overlay = createOverlay();

    overlay.css({
        width: doc.width(),
        height: doc.height()
    });

    overlay.fadeIn(500);

}

function closeOverlay() {
    var overlay = $("#pop-up-overlay");
    overlay.fadeOut(500);

}

function closeLightbox() {

    var lightbox = $("#pop-up");

    lightbox.fadeOut(500);
    lightbox.remove();

}

function resizeLightbox() {

    var overlay = createOverlay(),
        lightbox = createLightbox();

    overlay.css({
        "width": doc.width(),
        "height": doc.height()
    });

    var width = lightbox.outerWidth(),
        height = lightbox.outerHeight();

    lightbox.css({

        "top": (win.height() / 2) - (height / 2) + doc.scrollTop(),
        "left": (win.width() / 2) - (width / 2) + doc.scrollLeft()
    });

}

function showLightbox(txt) {

    showOverlay();
    var lightbox = createLightbox();

    var textDiv = $("<div>", {
        "class": "text-injected"
    });

    textDiv.html(txt);

    lightbox.append(textDiv);

    setTimeout(function () {

        var width = (lightbox.outerWidth() > 1170) ? 1170 : lightbox.outerWidth(),
            height = lightbox.outerHeight();
        lightbox.css({
            'width': width,
            'height': height,
            "top": (win.height() / 2) - (height / 2) + doc.scrollTop(),
            "left": (win.width() / 2) - (width / 2)
        });

    }, 0);

    lightbox.fadeIn(500);

}

win.on("resize", resizeLightbox);
doc.on("keyup", function (e) {

    if (e.which === 27) {
        closeOverlay();
        closeLightbox();
    }

});

function lightbox(txt) {
    return showLightbox(txt);
};


!function () {
    var $q = function (q, res) {
            if (document.querySelectorAll) {
                res = document.querySelectorAll(q);
            } else {
                var d = document
                    , a = d.styleSheets[0] || d.createStyleSheet();
                a.addRule(q, 'f:b');
                for (var l = d.all, b = 0, c = [], f = l.length; b < f; b++)
                    l[b].currentStyle.f && c.push(l[b]);

                a.removeRule(0);
                res = c;
            }
            return res;
        }
        , addEventListener = function (evt, fn) {
            window.addEventListener
                ? this.addEventListener(evt, fn, false)
                : (window.attachEvent)
                    ? this.attachEvent('on' + evt, fn)
                    : this['on' + evt] = fn;
        }
        , _has = function (obj, key) {
            return Object.prototype.hasOwnProperty.call(obj, key);
        }
    ;

    function loadImage(el, fn) {
        var img = new Image()
            , src = el.getAttribute('data-src');
        img.onload = function () {
            el.src = src;
            if (!el.classList.contains('loaded')) {
                el.className = el.getAttribute('class') + " loaded";
            }


            fn ? fn() : null;

        };

        if (!el.classList.contains('loaded')) {
            if (src !== null) {
                img.src = src;
            }
        }
    }

    function elementInViewport(el) {
        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0
            && rect.left >= 0
            && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    addEventListener('load', function () {
        var images = new Array()
            , query = $q('img.lazy')
            , processScroll = function () {
                for (var i = 0; i < images.length; i++) {
                    if (elementInViewport(images[i])) {
                        loadImage(images[i], function () {
                            images.splice(i, i);
                        });
                    }
                }
                ;
            }
        ;

        for (var i = 0; i < query.length; i++) {
            images.push(query[i]);
        }


        processScroll();
        addEventListener('scroll', processScroll);
    });
}();


/**=====================route map functions===================*/





function showMapPopup(result, directionsDisplay) {

    var modal = $("#myModal");

    var modalContent = modal.find('.modal-content');

    modalContent.css({'position': 'relative'});
    modal.find(".modal-dialog").addClass("modal-lg");


    var popupHtml = "<div class='row'>\n\
            <div class='col-md-12'>\n\
                <div id='map_content_popup' style='height:50vh;width:100%'></div>\n\
            </div>\n\
            <div class='col-md-12'>\n\
                <div id='dirs'></div>\n\
            </div>\n\
        </div>";
    modalContent.html(popupHtml);
    myOptionsPopup = {
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };


    var map = new google.maps.Map(document.getElementById('map_content_popup'), myOptionsPopup);
    directionsDisplay.setMap(map);
    directionsDisplay.setDirections(result);

    directionsDisplay.setPanel(document.getElementById("dirs"));
    google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {
        computeTotalDistance(directionsDisplay.directions);
    });
    computeTotalDistance(directionsDisplay.directions);

    var myModal = new bootstrap.Modal(document.getElementById('myModal'))
    myModal.show();


    setTimeout(function () {
        var currentCenter = map.getCenter();
        map.fitBounds(result.routes[0].bounds);

        google.maps.event.trigger(map, "resize");
        map.setCenter(currentCenter);
    }, 300);


}

function calcRoute(start, end, directionsService, directionsDisplay, selectedMode) {


    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode[selectedMode]
    };


    directionsService.route(request, function (result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            showMapPopup(result, directionsDisplay);

        } else {
            alert("Błąd wytyczania trasy!")

        }
    });
}

var DISTANCE = "Odległość: ";


function computeTotalDistance(result) {

    var total = 0;
    var duration = "";
    var myroute = result.routes[0];
    for (i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
        duration += myroute.legs[i].duration.text;
    }
    total = total / 1000;

    $("#myModal .modal-title").text('').text(DISTANCE + total + " km (" + duration + ")");
}