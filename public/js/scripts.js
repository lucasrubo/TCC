$(document).ready(function($) {
    var timer = 0;
    var d = new Date();

    var monthd = ("00" + d.getMonth()).slice(-2);
    var dayd = ("00" + d.getDate()).slice(-2);;

    var output = d.getFullYear() + '-' +monthd + '-' +dayd;
    $("#cpfcnpj").keydown(function(){
        try {
            $("#cpfcnpj").unmask();
        } catch (e) {}
    
        var tamanho = $("#cpfcnpj").val().length;
    
        if(tamanho < 11){
            $("#cpfcnpj").mask("999.999.999-99");
        } else {
            $("#cpfcnpj").mask("99.999.999/9999-99");
        }
    
        // ajustando foco
        var elem = this;
        setTimeout(function(){
            // mudo a posição do seletor
            elem.selectionStart = elem.selectionEnd = 10000;
        }, 0);
        // reaplico o valor para mudar o foco
        var currentValue = $(this).val();
        $(this).val('');
        $(this).val(currentValue);
    });
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
        if (timer) {
            clearTimeout(timer);
            timer = 0;
        }
        $("#ModelNotificacao").css('display','none'); 
        $("#LoginModal").css('display','block');
        $("#navbarSupportedContent").removeClass('show');
        $("#full-tela").removeClass("invisible");
        $("html").css('overflow','hidden');
        $("#full-tela").css("pointer-events" ,"auto");
        $("#full-tela").css("z-index" ,"101");
    });
    
    $("#closeModelx,#closeModelCancel").click(function() {
        $("#full-tela").addClass("invisible");
        $("#LoginModal").css('display','none');
        $("#Model").css('display','none');
        $("html").css('overflow','auto');
        $("#full-tela").css("pointer-events" ,"none");
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
        if (timer) {
            clearTimeout(timer);
            timer = 0;
        }
        $("#conteudoModelCadastro").css('display','none'); 
        $("#conteudoModel").css('display','block'); 
        $("#ModelNotificacao").css('display','none'); 
        $("#full-tela").css("pointer-events" ,"auto");
        $("#full-tela").css("z-index" ,"101");
        var data = table.row(this).data();
        // console.log(data);
        $("#full-tela").removeClass("invisible");
        $("#Model").css('display','block');
        $("html").css('overflow','hidden');
        
        $("#id_delete").val(data[1]);
        $("#model_id").val(data[1]);
        $("#model_name").val(data[2]);
        $("#model_username").val(data[3]);
        $("#model_email").val(data[4]);
        $("#model_level").val(data[5]);
        if(data[10] == "Desativado"){
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
        
        let data_criada = data[7].split('/');
        var day = ("00" + data_criada[0]).slice(-2);
        var month = ("00" + (data_criada[1])).slice(-2);
        let dataFormatada_criada = data_criada[2]+"-"+month+"-"+day; 
        $("#model_att").val(dataFormatada_criada);    
        // console.log(output);
        $("#model_att_now").val(output);  
        if(data[8]){
            $('#AvatarUser').attr("src",`../upload/${data[8]}`);
        }else{
            $('#AvatarUser').attr("src",`../images/usuario-branco.png`);
        }
          
    // $("#conteudoModel").html(conteudo);
    });
    $('#tabela #vacina').on('click', 'tr', function () {
            if (timer) {
                clearTimeout(timer);
                timer = 0;
            }
            $("#conteudoModelCadastro").css('display','none'); 
            $("#conteudoModel").css('display','block'); 
            $("#ModelNotificacao").css('display','none'); 
            $("#full-tela").css("pointer-events" ,"auto");
            $("#full-tela").css("z-index" ,"101");
            var data = table.row(this).data();
            // console.log(data);
            $("#full-tela").removeClass("invisible");
            $("#Model").css('display','block');
            $("html").css('overflow','hidden');
            
            $("#id_delete").val(data[1]);
            $("#model_id").val(data[1]);
            $("#model_name").val(data[2]);
            $("#model_estoque").val(data[3]);
            $("#model_att_now").val(output);  
            
    });
    
    $("#cadastroModel").click(function() {
        if (timer) {
            clearTimeout(timer);
            timer = 0;
        }
        $("#model_att_now").val(output);  
        $("#conteudoModelCadastro").css('display','block'); 
        $("#conteudoModel").css('display','none'); 
        $("#ModelNotificacao").css('display','none'); 
        $("#full-tela").css("pointer-events" ,"auto");
        $("#full-tela").css("z-index" ,"101");
        $("#navbarSupportedContent").removeClass('show');
        $("#full-tela").removeClass("invisible");
        $("#Model").css('display','block');
        $("html").css('overflow','hidden');
        $("#conteudoModelCadastro").html(conteudoCadastro);
    });
    
    $('#tabela #animais').on('click', 'td#editar', function (e) {
        if (timer) {
            clearTimeout(timer);
            timer = 0;
        }
        $("#ModelNotificacao").css('display','none'); 
        $("#full-tela").css("pointer-events" ,"auto");
        $("#full-tela").css("z-index" ,"101");
        var data = table.row(this).data();
        // console.log(data);
        $("#full-tela").removeClass("invisible");
        $("#Model").css('display','block');
        $("html").css('overflow','hidden');   
        
        $("#model_id").val(data[1]);
        $("#id_delete").val(data[1]);
        $("#model_dogname").val(data[2]);
        $("#model_raça").val(data[3]);
        var obs = data[5].replace('<textarea readonly="" style="border: 0px;resize: none;">','');
        obs = obs.replace('</textarea>','');
        $("#obs_dog").val(obs);
        $("#model_att_now").val(output);  
        if($("#"+data[4]).length){
            $("animalTipo").prop('checked',false);
            $("#"+data[4]).prop('checked',true);
            $("#OutroSubmit").css('display','none');
            $("#OutroSubmit").val('');
        }else{
            $("#Outro").prop('checked',true);
            $("#OutroSubmit").css('display','block');
            $("#OutroSubmit").val(data[4]);
        }

        if(data[11] == "Desativado"){
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
        
        
        // console.log(data[7]);
        if(data[7]){
            $('#AvatarDog').attr("src",`../upload/${data[7]}`);
        }else{
            $('#AvatarDog').attr("src",`../images/usuario-branco.png`);
        }
        $('#mapa-cachorro').attr("src",`https://maps.google.com.br/maps?q=${data[8]},${data[9]}&output=embed&dg=oo`);   
                    
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

    if((window.location.href).split('msg=')[1]){
        var msg_atual = ((window.location.href).split('msg='))[1].replaceAll('-',' ');
        //check for Navigation Timing API support
         if (window.performance) {
             console.info("window.performance works fine on this browser");
         }
         console.info(performance.navigation.type);
         if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
            console.info( "This page is reloaded" );        
            location.href = (document.referrer).split('msg=')[0];
         } else {
             console.info( "This page is not reloaded");
         }
    }
    if(msg_atual){
            conteudo = '<div id="msgModel" class="w3-container model-msg">'+msg_atual+'</div>';
            $("#full-tela").removeClass("invisible");
            $("#ModelNotificacao").addClass('sem-fundo'); 
            $("#ModelNotificacao").css('display','block'); 
            $("#ModelNotificacao").css('padding-top','60px'); 
            $("#full-tela").css("pointer-events" ,"none");
            $("#full-tela").css("z-index" ,"1");
            

            $("#conteudoModelNotificacao").html(conteudo);
            if(msg_atual.includes('Erro:')){
                $("#msgModel").addClass("erro-model");   
            }else{
                $("#msgModel").addClass("sucess-model");   
            }

            timer = setTimeout(function(){            
                $("#ModelNotificacao").removeClass('sem-fundo'); 
                $("#ModelNotificacao").css('padding-top',''); 
                $("#full-tela").addClass("invisible");
                $("#ModelNotificacao").css('display','none');
                $("#ModelNotificacaoInicio").css('width','auto');  
                $("#full-tela").css("pointer-events" ,"auto");
                $("#full-tela").css("z-index" ,"101");
            },3000);
    }
});