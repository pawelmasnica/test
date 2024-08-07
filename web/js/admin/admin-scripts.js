var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();
function outputUpdate (vol, element) {
    document.querySelector('#' + element).value = vol;
}

function addSection() {
    var sectionArea = $('#section-area');
    var ajaxUrl = $("#ajax-add-section").data("ajax-url");
    var sectionNb = 0;
    $('#add-section-button').on("click", function () {
        if ($('#section-area').length) {
            sectionNb = $('#section-area > div').length;
        }
        $.post(ajaxUrl, {num: sectionNb, page_id: $("#ajax-page-id").data("ajax-page-id")})
            .done(function (data) {
                sectionArea.append(data);
            });
    })


    $('#add-section-select').on("change", function () {

        $.post(ajaxUrl, {section_id: this.value, page_id: $("#ajax-page-id").data("ajax-page-id")})
            .done(function (data) {
                sectionArea.append(data);
            });
    })

}





function sortAccordionSectionList() {

    if ($("#section-forms").length) {


        $("#section-forms").sortable({
            handle: '.handle',
            placeholder: "ui-state-highlight",
            axis: 'y',
            update: function (event, ui) {
                var data = $(this).sortable('serialize');
                var ajaxUrl = $("#ajax-sort-section").data("ajax-url");
                // POST to server using $.post or $.ajax
                $.ajax({
                    data: data,
                    type: 'POST',
                    url: ajaxUrl
                }).success(function (data) {
                    console.log(data);
                    setFlash(data, true)
                })
                    .error(function (data) {
                        setFlash(data, false)
                    });
            }
        });
        //function disableSelection destroy grideditor
        //$("#section-forms").disableSelection();

    }
}
function log(data) {
    console.log(data);
}
function joinSection() {
    $('#ajax-join-section').on('click', function () {


        return false;
    })
}


function getFieldValueByClass(css_class, lang) {

    var obj = $(css_class);
    var fieldValue = '';
    obj.each(function (k, v) {
        var objInner = $(v);
        var objId = objInner.attr('id');


        if(objId){

            var strArr = objId.split("_");
            if (strArr[1] == 'Page') {
                if (strArr[2] == lang) {
                    fieldValue = objInner.val();
                }
            } else {
                if (strArr[1] == lang) {
                    fieldValue = objInner.val();
                }
            }
        }else{
            fieldValue = $(css_class).text()
        }
    });

    return fieldValue;
}

function simulateGoogleSearchPosition() {
    var obj = $('.rewriting-data');


    obj.each(function () {

        var objInner = $(this);

        var objId = objInner.attr('id');
        var strArr = objId.split("-");
        var lang = strArr[1];

        if (lang) {

            var metTitleValue = getFieldValueByClass('.meta-title', lang);
            var defTitleValue = getFieldValueByClass('.default-title', lang);
            var metDescriptionValue = getFieldValueByClass('.meta-description', lang);

            var gSimulation = $('.google-simulation.' + lang);
            gSimulation.find('.g-header').html('').append(metTitleValue +' '+defTitleValue);
            gSimulation.find('.g-description').html('').append(metDescriptionValue);

            objInner.keyup(function () {

                gSimulation.find('.g-header').html(getFieldValueByClass('.meta-title', lang) +'  '+defTitleValue);
                gSimulation.find('.g-description').html('').append(getFieldValueByClass('.meta-description', lang));
            });
        }

    });
}
function openPopup() {
    $('body').on('click', 'a.showModal', function (e) {
        var title = $(this).html();
        if ($(this).hasClass('confirm')) {
            var result = confirm('Are you sure?');

            if (result === false) {
                return null;
            }
        }
        e.preventDefault();
        var popupHead = $('#myModal').find(".modal-header");

        var span = $('<span>');
        span.html(title);
        popupHead.find('span').remove();
        popupHead.prepend(span);


        $('#myModal').modal('show');

        $.get($(this).attr("href"), function (data) {
            $('#myModal').find(".modal-body").html(data);
            if ($(data).find('#bootstrap-table')) {

                $('#bootstrap-table').bootstrapTable();
            }
        });

    })


    // Fill modal with content from link href
    $("#myModal").on("show.bs.modal", function (e) {
        var link = $(e.relatedTarget);


        // AJAX request
        $.ajax({
            url: link.attr("href"),
            type: 'get',

            success: function(response){
                // Add response in Modal body
                $(this).find(".modal-body").html(response);

                // Display Modal
                $('#empModal').modal('show');
            }
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
    container.prepend(button).fadeIn().delay(8000).fadeOut();
    $('.flash-messages').append(container);
}


function findErrorInTab() {
    if ($('.tab-content .has-error').length) {
        if ($('.tab-content .has-error').parents('.tab-pane').parents('.tab-pane').length) {
            // zagnieżdzone taby

            var tabId = $('.tab-content .has-error').parents('.tab-pane').attr('id');

        } else {
            var tabId = $('.tab-content .has-error').parents('.tab-pane').attr('id');
        }
        $('.nav a[href="#' + tabId + '"]').tab('show');
    }
}
$(document).ready(function () {

    /* $('.sidebar').height($(window).height()).css({
     'overflow-y':'auto',
     'display':'block'
     });*/

    $('body').on('click', '.confirmation', function () {
        var result = confirm('Are you sure?');
        if (result) {
            return false;
        }

    });
    if ($('.flash-messages').find('.alert').length) {
        $('.flash-messages').find('.alert').delay(5000).fadeOut(function () {
            $(this).remove();
        });
    }


    $('#myModal').on('hidden.bs.modal', function () {
        $(this).removeData('bs.modal');
    });



    $('#myModal').on('submit', 'form', function (e) {
        var btnSubmit = $(this).find('button[type="submit"]');
        btnSubmit.prop('disabled', true);
        e.preventDefault();

        $.ajax({
            url: $(this).attr('action'), //this is the submit URL
            type: 'POST', //or POST
            data: $(this).serialize(),
            success: function (data) {

                //$('#myModal').find('.modal-content').html(data);

                var group_list = $('#page_group_page_has_page_list');
                if (data.new_object) {

                    var option = $('<option>').attr('value', data.new_object.id).attr('selected', 'selected').text(data.new_object.name)
                    group_list.append(option);
                    group_list.selectpicker('destroy');
                    group_list.selectpicker({
                        liveSearch: true,
                        noneSelectedText: " "
                    });
                }
                if (data.edited_object) {
                    group_list.find('option').each(function (i, v) {
                        if (v.value == data.edited_object.id) {
                            $(v).text(data.edited_object.name)
                        }
                    })
                    group_list.selectpicker('destroy');
                    group_list.selectpicker({
                        liveSearch: true,
                        noneSelectedText: " "
                    });
                }


                if (data.errors.length) {
                    $('#myModal').find('.alert').remove();

                    $.each(data.errors, function (k, v) {
                        var alert = $('<div>').addClass('alert alert-danger').html(v.message)
                        $("#" + v.field).after(alert);
                    })

                } else {
                    //http://stackoverflow.com/questions/2405117/difference-between-window-location-href-window-location-href-and-window-location
                    //window.location.href

                    $('#myModal').modal('hide');
                    if (data.message) {
                        setFlash(data.message, true)
                    }
                    if (data.url_redirect) {
                        window.location.href = data.url_redirect;
                    }
                    //window.location.reload();
                }


            }
        }).always(function () {
            btnSubmit.prop('disabled', false);
        });
    });


    openPopup();
    findErrorInTab();
    simulateGoogleSearchPosition()

    joinSection();
    sortAccordionSectionList();


    addSection();
    slugifyLabel();
    setInputCounter("meta-title", 55);

    setInputCounter("meta-description", 160);


    if ($('.selectpicker').length) {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            $('.selectpicker').selectpicker('mobile');
        }
        $('.selectpicker').selectpicker({
            liveSearch: true,
            noneSelectedText: " "

        });
    }


    navigation();


});


function counteMetaTitleText(fieldCounter, text_length, text_max) {

    var remaining = text_max - text_length;
    if (remaining <= 0) {
        remaining = 0;
        fieldCounter.css({
            color: 'red'
        })
    } else {
        fieldCounter.css({
            color: 'black'
        })
    }
    fieldCounter.html('Ilość pozostałych znaków: ' + remaining);
}
function setInputCounter(className, text_max) {

    var obj = $('.' + className);
    obj.each(function () {

        if ($(this).length) {
            var text_length = $(this).val().length;
            var fieldCounter = $('<div>').addClass('pull-right');
            counteMetaTitleText(fieldCounter, text_length, text_max);
            $(this).keyup(function () {
                text_length = $(this).val().length;
                counteMetaTitleText(fieldCounter, text_length, text_max)
            });

            $(this).after(fieldCounter);
            fieldCounter.after('<div class="clearfix"></div>');
        }
    });
}
function slugifyLabel() {
    var obj = $('.slugify');
    var ajaxUrl = $("#ajax-slugify-url").data("ajax-url");

    obj.each(function () {

        var ajaxUrlContainer = $('<p>');
        var objInner = $(this);
        objInner.keyup(function () {


            delay(function () {
                var objId = objInner.attr('id');
                var strArr = objId.split("_");

                var lang = strArr[1];
                if (lang == 'Page') {
                    lang = strArr[2];
                }
                $.post(ajaxUrl, {lang: lang, page_label: objInner.val()})
                    .done(function (data) {
                        ajaxUrlContainer.html("").append('<em>' + data + '</em>');
                        var target = $('.google-simulation.' + lang + ' .g-url a');
                        target.html('').append(data);
                        target.attr('href', data);
                    });
            }, 1000);


        });
        objInner.before(ajaxUrlContainer)
    });

}


function navigation() {
    $('.navigation-opener').saveState('navigation-open', '.page-container');
}


/**write state of divs*/

(function ($) {
    $.fn.saveState = function (className, place) {

        if (getCookie(className) == 'true') {
            $(place).addClass(className)
        }

        $(this).on('click', function () {
            if (!$(place).hasClass(className)) {
                $(place).addClass(className);

                setCookie(className, true);
            } else {
                $(place).removeClass(className);

                setCookie(className, false);
            }
        });
        return this;
    };
})(jQuery);

(function ($) {
    $.fn.toggleAttr = function (attrName) {
        var attr = $(this).attr(attrName);
        // For some browsers, `attr` is undefined; for others, `attr` is false. Check for both.


        if (typeof attr !== typeof undefined && attr !== false) {
            // Element has this attribute

            $(this).attr(attrName, false);
        } else {

            console.log(attr);
            $(this).attr(attrName, true);
        }
        return this;
    };
})(jQuery);


/*
 *Version: 1.1.11 - last update: 04.07.2016;
 *Author: Steelu;
 */
(function ($) {
    $.fn.cmsImageBrowser = function (options) {
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            uploadText: 'Upload',
            fileHasBeenUploaded: 'Plik został zuploadowany',
            clickToAddImage: 'Kliknij aby dodać zdjęcie',
            chooseFileText: 'Wybierz plik',
            uploadInProgressText: 'Uploaduję zdjęcie',
            modalWindowTitle: 'Wybierz zdjęcia',
            removeImageText: 'Usuń zdjęcie',
            imagePath: 'uploads/files/images/300w_',
            galleryListUrl: '',
            imagesListByGalleryUrl: '',
            uploadUrl: '',
            ratioJson: ''


        }, options);


        /***
         * ustawia unikalne id na rodzicu przycisku
         */

        var setIdOnParent = function (button, id) {
            return button.parent().attr('id', id);
        };

        /**
         * generuje unikalne id
         * */
        var generateId = function () {
            var id = Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            return id;
        };
        /**
         * ustawia obrazek jeśli już jest wybrany,
         * chowa listę wyboru obrazków,
         * ustawia kliknięcie na obrazku
         * */
        var setImageInPlacement = function (select, imgPlacement) {
            select.hide();
            imgName = select.find('option:selected').text();
            if (imgName != '') {
                var currentImg = $('<img>').attr('src', settings.imagePath + imgName);
                imgPlacement.html(
                    currentImg.attr('title', settings.removeImageText)
                        .addClass('img-responsive img-thumbnail')
                        .css('cursor', 'pointer')
                        .on('click', function () {
                            select.prop('selectedIndex', 0);
                            $(this).fadeOut(function () {
                                imgPlacement.html('<i class="fa fa-image"></i>');
                            })
                        })
                );
            }
        };

        var createImgHtml = function (v, mainSelect, imgPlacement) {
            var col = $('<div class="col-sm-4 col-xs-6">');
            var currentImg = $('<img>').attr('src', v.thumbnailUrl)
                .addClass('img-responsive img-thumbnail')
                .css('cursor', 'pointer')
                .attr('title', settings.clickToAddImage)

            currentImg.on('click', function () {
                $('#myModal').modal('hide');
                mainSelect.val(v.id);
                imgPlacement.html(
                    currentImg.attr('title', settings.removeImageText)
                        .addClass('img-responsive img-thumbnail')
                        .css('cursor', 'pointer')
                        .on('click', function () {
                            mainSelect.prop('selectedIndex', 0);
                            $(this).fadeOut(function () {
                                imgPlacement.html('<i class="fa fa-image"></i>');
                            })
                        })
                );
            })
            col.append(currentImg);
            return col;
        };
        /**
         * Ładuje zdjęcia z wybranej galerii do popupa
         * */
        var loadPopupImages = function (gallery_id, imgPlacement, mainSelect) {
            var url = settings.imagesListByGalleryUrl + "&filter=" + gallery_id;
            var popupBody = $('#myModal').find(".modal-body");
            $.get(url, function (data) {
                var row = $('<div class="row">');

                $.each(data.files, function (i, v) {
                    var col = createImgHtml(v, mainSelect, imgPlacement);
                    row.append(col);

                });

                if (popupBody.find('.form-and-imgs').length) {
                    popupBody.find('.form-and-imgs').remove();
                }


                var progress = $('<div class="progress"></div>');
                var progressBar = $('<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>');
                progress.append(progressBar);

                var form = $('<form class="form-inline" style="padding: 10px 0;">').attr('method', 'post').attr('action', settings.uploadUrl).attr('enctype', 'multipart/form-data');
                var uploadControl = $('<input type="file" id="file" name="files[0]" class="inputfile">');
                var uploadControlLabel = $('<label for="file"   class="btn btn-success"><i class="fa fa-search"></i> ' + settings.chooseFileText + '</label>');


                var buttonSubmit = $('<button type="button" class="btn btn-primary">').attr('disabled', 'disabled');

                buttonSubmit.append('<i class="fa fa-upload"></i> ' + settings.uploadText);


                uploadControl.on('change', function (e) {

                    if ($(this).val()) {
                        buttonSubmit.attr('disabled', null)
                    } else {
                        buttonSubmit.attr('disabled', 'disabled')
                    }
                });
                form.append(progress);

                form.append(uploadControl)
                form.append(uploadControlLabel)
                form.append(buttonSubmit);

                buttonSubmit.on('click', function (e) {
                    e.preventDefault();
                    form.ajaxSubmit({
                        beforeSend: function () {
                            window.onbeforeunload = confirmExit;
                            var percentVal = '0%';
                            progressBar.width(percentVal)
                            progressBar.html(percentVal);
                            $('.ajax-progress-bg').css('zIndex', '9999').fadeIn();
                        },
                        uploadProgress: function (event, position, total, percentComplete) {
                            var percentVal = percentComplete + '%';
                            progressBar.width(percentVal)
                            progressBar.html(percentVal);
                            //console.log(percentVal, position, total);
                        },
                        success: function () {
                            var percentVal = '100%';
                            progressBar.width(percentVal)
                            progressBar.html(percentVal);
                        },
                        complete: function (xhr) {
                            setFlash(settings.fileHasBeenUploaded, true);
                            $('.ajax-progress-bg').fadeOut(function () {
                                $(this).css('zIndex', '0');
                            });
                            window.onbeforeunload = null;
                            // debug(xhr.responseJSON.files)
                            var jsonFile = xhr.responseJSON.files;
                            var col = createImgHtml(jsonFile, mainSelect, imgPlacement);
                            row.append(col);
                            //dodaje nową opcję w liście
                            var newOption = $('<option>').val(jsonFile.id).text(jsonFile.name);
                            mainSelect.append(newOption);

                            $("#galleryListSelectBox").remove();
                            var internalSelect = setGalleryListInModal(gallery_id);
                            internalSelect.on("change", function () {
                                loadPopupImages($(this).val(), imgPlacement, mainSelect)
                            })

                        }
                    });
                })


                var group_media_id = $('<input name="media[0][group_media_id][]" class="hidden">').val(gallery_id);
                form.append(group_media_id)

                var ratioSelect = $('<select name="media[0][ratio]" class="form-control">');
                var ratioSelectTablet = $('<select name="media[0][ratio_tablet]" class="form-control">');
                var ratioSelectPhone = $('<select name="media[0][ratio_phone]" class="form-control">');

                $.each($.parseJSON(settings.ratioJson), function (i, v) {
                    var option = $('<option>').attr('value', i).text(v);
                    ratioSelect.append(option);
                });
                $.each($.parseJSON(settings.ratioJson), function (i, v) {
                    var option = $('<option>').attr('value', i).text(v);
                    ratioSelectTablet.append(option);
                })
                $.each($.parseJSON(settings.ratioJson), function (i, v) {
                    var option = $('<option>').attr('value', i).text(v);
                    ratioSelectPhone.append(option);
                })

                form.append(ratioSelect)
                form.append(ratioSelectTablet)
                form.append(ratioSelectPhone)


                var colForm = $('<div class="col-sm-12">');
                colForm.append(form)
                var rowForm = $('<div class="row">');
                rowForm.append(colForm);

                var formAndImgs = $('<div style="padding: 10px;">').addClass('form-and-imgs');
                formAndImgs.append(rowForm)
                formAndImgs.append(row)

                popupBody.append(formAndImgs);
            });
        };


        /***
         *pobiera json z galeriami
         * listę z galeriami wstawia do popupa
         */
        var setGalleryListInModal = function (selectedIndex) {
            var popupBody = $('#myModal').find(".modal-body");
            var select = $('<select>');
            $.get(settings.galleryListUrl, function (data) {
                $.each(data, function (i, v) {
                    var option = $('<option>');
                    if (v.id) {
                        option.val(v.id);
                        option.text(v.name + " (" + v.nb_file + ")");
                        option.attr('data-url', v.url);
                    } else {
                        option.val(v.id);
                        option.text(v.name);

                    }

                    if (selectedIndex == v.id) {
                        option.attr('selected', 'selected')
                    }
                    select.append(option);
                });


                var col = $('<div class="col-sm-12">');
                var row = $('<div class="row" id="galleryListSelectBox">');


                col.append(select);

                // TODO: zaimplementować dodaqwanie galerii w popupie
                //col.append($('<a>').attr('href','/').addClass('showModal').text('Add gallery'));

                row.append(col);
                popupBody.prepend(row)

                select.addClass('selectpicker');
                select.selectpicker('destroy');
                select.selectpicker({
                    liveSearch: true,
                    noneSelectedText: " "
                });


            })

            return select;
        };
        return this.each(function (i, v) {
            var id = generateId() + i;

            var parent = setIdOnParent($(this), id);

            var mainSelect = parent.find('select');
            var imgPlacement = parent.find('.img-browser-placement');


            setImageInPlacement(mainSelect, imgPlacement)


            $(this).on('click', function (e) {
                openModal();
                window.cmsImageBrowserId = id;
                var internalSelect = setGalleryListInModal(0);
                internalSelect.on("change", function () {
                    loadPopupImages($(this).val(), imgPlacement, mainSelect)
                })

            })

        });

        function confirmExit() {
            return confirm(settings.uploadInProgressText);
        }

        function openModal() {
            $('#myModal').modal('show');
            $('#myModal').find('.modal-dialog');

            var popupBody = $('#myModal').find(".modal-body");
            var popupHead = $('#myModal').find(".modal-header");

            var span = $('<span>');

            span.html(settings.modalWindowTitle);
            popupHead.find('span').remove();
            popupHead.prepend(span);

            popupBody.html('');
            return $('#myModal');
        }

        // Private function for debugging.
        function debug(obj) {
            if (window.console && window.console.log) {
                window.console.log(obj);
            }
        };
    }
})(jQuery)

