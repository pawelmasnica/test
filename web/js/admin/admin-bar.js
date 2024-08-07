function isDisplayBar() {

    if(getCookie("bar-hide") === 'true'){
        $("#admin-bar").addClass('bar-hidden')
    }
}


/**
 * Created by hp on 2016-01-15.
 */

$(document).ready(function(){

    $('.ajax-url').on('click',function (e) {
        e.preventDefault();
        var that = $(this);

        $.ajax({
            url: $(this).attr('href'),
            beforeSend: function( xhr ) {

                that.append(' <i class="fa fa-spinner fa-spin"></i>');
                $('body').addClass('ajax-running');
                $('.ajax-progress-bg').css('zIndex', '9999').fadeIn();
            },
            success:function (data, textStatus,xhr) {
                if(xhr.status == 200){
                    setFlash(data.message,true);
                }else{
                    setFlash("Błąd serwera!",false);
                }
            }
        }).always(function() {
            that.find('.fa-spinner').remove();
            $('body').removeClass('ajax-running');
            $('.ajax-progress-bg').fadeOut(function () {
                $(this).css('zIndex', '0');
            });
        });

        return false;
    });


    isDisplayBar();
    $("#admin-bar-hide-button").click(function(){
        if(!$("#admin-bar").hasClass('bar-hidden')){
            $("#admin-bar").addClass('bar-hidden');
            setCookie('bar-hide', true);
        }else{
            $("#admin-bar").removeClass('bar-hidden');
            setCookie('bar-hide', false);
        }
        return false;
    });
});


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";path=/; " + expires;
}