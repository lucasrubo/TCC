$("#login").click(function() {
    $("#navbarSupportedContent").removeClass('show');
    $("#full-tela").removeClass("no-pointer");
});

$("#login-close,#reveal-modal-bg").click(function() {
    $("#full-tela").addClass("no-pointer");
});

