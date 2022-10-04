$(document).ready(function() {
    $("#login").click(function() {
        $("#navbarSupportedContent").removeClass('show');
        $("#full-tela").removeClass("invisible");
        $("#centerLogin").removeClass("none");
    });
    $("#userL").click(function() {
        $("#navbarSupportedContent").removeClass('show');
        $("#full-tela").removeClass("invisible");
        $("#centeUser").removeClass("none");
    });
    $("#model-close,#reveal-modal-bg").click(function() {
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
    
    var table = $('#tabela').DataTable({
        "oLanguage": {
            "sEmptyTable":   "Não foi encontrado nenhum registro",
            "sLoadingRecords": "A carregar...",
            "sProcessing":   "A processar...",
            "sLengthMenu":   "Mostrar _MENU_ registros",
            "sZeroRecords":  "Não foram encontrados resultados",
            "sInfo":         "Mostrando de _START_ a _END_ de _TOTAL_ registros",
            "sInfoEmpty":    "-",
            "sInfoFiltered": "(filtrado de _MAX_ registros no total)",
            "sInfoPostFix":  "",
            "sSearch":       "Procurar:",
            "sUrl":          "",
            "oPaginate": {
                "sFirst":    "Primeiro",
                "sPrevious": "Anterior",
                "sNext":     "Próxima",
                "sLast":     "Último"
            },
            "oAria": {
                "sSortAscending":  ": Ordenar colunas de forma ascendente",
                "sSortDescending": ": Ordenar colunas de forma descendente"
            }
        },
        "columnDefs": [ {
              "targets": 'no-sort',
              "orderable": false,
        } ],
         "lengthMenu": [[ -1, 10, 25, 50, 100], [ "Todos",10, 25, 50, 100]]
        });
});
    $('#tabela #usuario').on('click', 'tr', function () {
        var data = table.row(this).data();
        // alert('You clicked on ' + data);
        $('#userL').click();
        // data-reveal-id="loginModel" data-animation="fade"
    });