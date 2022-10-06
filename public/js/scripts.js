$(document).ready(function() {
    // Animação no Inicio 
    $(".link-direto").click(function(e) {
        var id = $(this).attr('href');
            menuHeight = $('nav').innerHeight();
            targetOffset = $(id).offset().top;
        $('html,body').animate({
            scrollTop: targetOffset - menuHeight
        }, 500);
    });
    
    $("#login").click(function() {
        $("#LoginModal").css('display','block');
        $("#navbarSupportedContent").removeClass('show');
        $("#full-tela").removeClass("invisible");
    });
    $("#closeModelx,#closeModelCancel").click(function() {
        $("#full-tela").addClass("invisible");
        $("#LoginModal").css('display','none');
        $("#UsuarioModel").css('display','none');
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
         "lengthMenu": [[ -1, 10, 25, 50, 100], [ "Todos",10, 25, 50, 100]],
         "order":[[0,"desc"]]
        });
    $('#tabela #usuario').on('click', 'tr', function () {
        var data = table.row(this).data();
        // console.log(data);
        $("#full-tela").removeClass("invisible");
        $("#UsuarioModel").css('display','block');
        $("#model_id").val(data[0])
        $("#model_name").val(data[1])
        $("#model_username").val(data[2]) 
   });
});