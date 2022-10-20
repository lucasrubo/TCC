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
    
    $("#login,#login_footer").click(function() {
        $("#LoginModal").css('display','block');
        $("#navbarSupportedContent").removeClass('show');
        $("#full-tela").removeClass("invisible");
        $("html").css('overflow','hidden');
    });
    $("#closeModelx,#closeModelCancel").click(function() {
        $("#full-tela").addClass("invisible");
        $("#LoginModal").css('display','none');
        $("#UsuarioModel").css('display','none');
        $("#DogModel").css('display','none');
        $("html").css('overflow','auto');
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
            $("html").css('overflow','hidden');
    
            $("#model_id").val(data[0]);
            $("#model_name").val(data[1]);
            $("#model_username").val(data[2]);
            $("#model_email").val(data[3]);
            $("#model_level").val(data[4]);
            if(data[9] == "Desativado"){
                var status = 0;
                $("#statusUser").html('Desativado');
                $("#statusUser").addClass("w3-red");
                $("#statusUser").removeClass("w3-green");
            }else{
                var status = 1;
                $("#statusUser").html('Ativado');
                $("#statusUser").addClass("w3-green");
                $("#statusUser").removeClass("w3-red");
            }
            $("#statusUsuario").val(status);
            
            let data_criada = data[5].split('/');
            var day = ("00" + data_criada[0]).slice(-2);
            var month = ("00" + (data_criada[1])).slice(-2);
            let dataFormatada_criada = data_criada[2]+"-"+month+"-"+day; 
            $("#model_att").val(dataFormatada_criada);    
            var d = new Date();
    
            var monthd = ("00" + d.getMonth()).slice(-2);
            var dayd = ("00" + d.getDate()).slice(-2);;
    
            var output = d.getFullYear() + '-' +monthd + '-' +dayd;
            // console.log(output);
            $("#model_att_now").val(output);  
            if(data[7]){
                $('#AvatarUser').attr("src",`../upload/${data[7]}`);
            }else{
                $('#AvatarUser').attr("src",`../images/usuario-branco.png`);
            }
              
    });

    $('#tabela #dogs').on('click', 'tr', function () {
        var data = table.row(this).data();
        // console.log(data);
        $("#full-tela").removeClass("invisible");
        $("#DogModel").css('display','block');
        $("html").css('overflow','hidden');   
        $("#model_dogname").val(data[1]);
        $("#model_raça").val(data[2]);
        $("#model_doguser").val(data[9]);
    
        
        
        console.log(data[6]);
        if(data[6]){
            $('#AvatarDog').attr("src",`../upload/${data[6]}`);
        }else{
            $('#AvatarDog').attr("src",`../images/usuario-branco.png`);
        }
        $('#mapa-cachorro').attr("src",`https://maps.google.com.br/maps?q=${data[7]},${data[8]}&output=embed&dg=oo`);   
                    
   });   

    $('#statusUser').on('click', function () {
        $(this).toggleClass("w3-green");
        $(this).toggleClass("w3-red");
        var valor = $(this).html();
        if(valor == "Ativado"){
            $(this).html('Desativado');
            $("#statusUsuario").val(0);
        }else{
            $(this).html('Ativado');
            $("#statusUsuario").val(1);
        }
    });   
   
   $('.load').hide();   
   $("#full-tela").addClass("invisible");   
   
});