$(document).ready(function() {
    $("#login").click(function() {
        $("#navbarSupportedContent").removeClass('show');
        $("#full-tela").removeClass("invisible");
    });

    $("#login-close,#reveal-modal-bg").click(function() {
        $("#full-tela").addClass("invisible");
    });

    $(".link-direto").click(function(e) {
        var id = $(this).attr('href');
            menuHeight = $('nav').innerHeight();
            targetOffset = $(id).offset().top;
        $('html,body').animate({
            scrollTop: targetOffset - menuHeight
        }, 500);
    });
});
