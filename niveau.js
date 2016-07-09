/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open inf template in inf editor.
 */

//recupère l'id  d'un produit sur attribut id d'un element du DOM
//dispo sur matche[0]
function matchid(id) {
    var matche = id.match(/[0-9]+/);
    return matche;
}

$(document).ready(function () {
    // objet melange => contient les id et la quantité de chaque element du sachet
    var melange = {
        inf: [],
        sup: [],
    };

    // evenements
    function addListeners() {
        window.addEventListener('resize', resize);
    }

    // initialise les elements
    var height_win = $(window).height();
    var ratioinf = 0.5;
    var box_sachet_height = height_win - 50;
    var inf_empty = 1;
    var height_box_sup;

    $('#box-clear').height(box_sachet_height);
    $('#box-sachet-sup').height(box_sachet_height * (1 - ratioinf));
    $('#box-sachet-inf').height(box_sachet_height * ratioinf);
    $('#container-infs').height(box_sachet_height * ratioinf);
    $('#container-sups').height(box_sachet_height * (1 - ratioinf));
    height_box_sup = (box_sachet_height * (1 - ratioinf));
    var sachet_sup_size = parseFloat(box_sachet_height * (1 - ratioinf));

    addListeners();

    function resize() {
        height_win = $(window).height();
        box_sachet_height = height_win - 50;
        $('#box-clear').height(box_sachet_height);
        $('#box-sachet-sup').height(box_sachet_height * (1 - ratioinf));
        sachet_sup_size = parseFloat(box_sachet_height * (1 - ratioinf));
        $('#box-sachet-inf').height(box_sachet_height * ratioinf);
        $('#container-infs').height(box_sachet_height * ratioinf);
        $('#container-sups').height(box_sachet_height * (1 - ratioinf));
        re_size_inf($("#half-sachet"));
        height_box_sup = (box_sachet_height * (1 - ratioinf));
    }

    $(".vignette-arome").on('click', function () {
        var id = matchid($(this).attr('id'));
        var findding = -1;
        for (i = 0; i < melange.arome.length; i++) {
            if (melange.arome[i].id == id[0]) {
                findding = i;
            }
        }
        if (findding !== -1 && melange.arome[findding].quantite < 3) {
            melange.arome[findding].quantite++;
            $("#box-arome .panel-body #quantite_arome" + id).prepend("<i id=\"quant_" + id + "_aro_" + melange.arome[findding].quantite + "\" class=\"glyphicon glyphicon-tint green-inf\"></i>");
        }
        if (melange.arome.length < 3) {
            if (findding === -1) {
                melange.arome.push({id: id[0], quantite: 1});
                var dom_export = $("#arome-item" + id).clone().attr({'id': 'arome-item-new' + id, 'class': 'new_arome col-xs-4 col-sm-4 col-md-4 col-lg-4'});
                dom_export.find(("img")).attr('id', 'arome-image-new' + id);
                $("#box-arome .panel-body").append(dom_export);
                $("#box-arome #arome-item-new" + id).prepend("<div class=\"text-center\" id=\"quantite_arome" + id + "\"><i id=\"quant_" + id + "_aro_1\" class=\"glyphicon glyphicon-tint green-inf\"></i></div>");
            }
        }
        stat();
    });

    $('#box-arome').on('click', '.new_arome', function () {
        var id = matchid($(this).attr('id'));
        var findding = -1;
        for (i = 0; i < melange.arome.length; i++) {
            if (melange.arome[i].id == id[0]) {
                findding = i;
            }
        }
        if (findding == -1) {
            alert('erreur');
            return false;
        }
        if (melange.arome[findding].quantite <= 1) {
            melange.arome.splice(findding, 1);
            $("#arome-item-new" + id).remove();
        }
        else {
            $("#quant_" + id + "_aro_" + melange.arome[findding].quantite).remove();
            melange.arome[findding].quantite--;
        }
        stat();
    });

// --------TEST--------  lire array de commande 
    $("#box-sachet").on('click', function () {
        console.log(melange);
        console.log(inf_empty);
    });

//initialise drag sur la barre ratio sup/thé
    $("#half-sachet").draggable({
        axis: "y",
        containment: "parent"
    });
//gestion du drag sur la barre ratio sup/thé
    $("#half-sachet").on('drag', function (event) {
        size_inf($(this));
    });

//contole erreur browser
    $("#half-sachet").on('dragstop', function (event) {
        size_inf($(this));
        stat();
    });

    //gestion du ratio thé/sup
    function size_inf(element) {
        var taille_sachet = ($('#box-clear').height());
        var top_barre = (element.position()['top']);
        ratioinf = 1 - (top_barre / taille_sachet);
        $('#box-sachet-sup').height(box_sachet_height * (1 - ratioinf));
        $('#box-sachet-inf').height(box_sachet_height * ratioinf);
        $('#container-infs').height(box_sachet_height * ratioinf);
        $('#container-sups').height(box_sachet_height * (1 - ratioinf));
        sachet_sup_size = parseFloat(box_sachet_height * (1 - ratioinf));
        //$('#infs-empty').height((inf_empty * 100) + "%");
    }
    //ajuste barre ratio sup/thé en cas de resize
    function re_size_inf(element) {
        element.css('top', $('#box-sachet-sup').height() + 'px');
    }

    $('.vignette-inf').draggable({
        appendTo: "body",
        helper: "clone",
        revert: "invalid",
        scroll: false,
        start: function (e, ui) {
            $(ui.helper).addClass("ui-draggable-helper");
        }
    });

    var id_inf_move;
    //id du thé en mouvement

    //var inf_in_melange = [];
    $("#box-sachet-inf").droppable({
        accept: $('.vignette-inf'),
        hoverClass: "active-drop-inf",
        drop: function (e, ui) {
            var id = matchid(ui.draggable.attr('id'));
            var findding = -1;
            for (i = 0; i < melange.inf.length; i++) {
                if (melange.inf[i].id == id[0]) {
                    findding = i;
                }
            }
            if (melange.inf.length < 2) {
                if (findding === -1) {
                    var quantite_inf;
                    if (melange.inf.length == 0) {
                        melange.inf.push({id: id[0], quantite: 0.6});
                        quantite_inf = 0.6;
                        var name_inf = $(ui.draggable).children("p").text();
                        var dom_inf = gen_dom_inf(id, name_inf, quantite_inf, true);
                        $("#infs-empty").after(dom_inf);
                        stat();
                        //active scroll sur slideinf
                        $("#slideinf" + id).draggable({
                            axis: "y",
                            containment: "parent",
                            start: function (e, ui) {
                                //contient l'id de la barre slide du inf en mouvement
                                id_inf_move = id[0];
                            },
                            stop: function (e, ui) {
                                //converti top de slideinf: px => %
                                var pourcent = parseInt($(this).css("top")) / ($(this).parent().height() / 100);
                                $(this).css("top", pourcent + "%");
                                melange.inf[0].quantite = (100 - pourcent) / 100;
                                if (melange.inf.length > 1) {
                                    melange.inf[1].quantite = (pourcent) / 100;
                                }
                                stat();
                            }
                        });
                    }
                    else if (melange.inf.length !== 0 && melange.inf[0].quantite < 0.9) {
                        var quant_new_inf = 1 - melange.inf[0].quantite;
                        melange.inf.push({id: id[0], quantite: quant_new_inf});
                        quantite_inf = quant_new_inf;
                        var name_inf = $(ui.draggable).children("p").text();
                        var dom_inf = gen_dom_inf(id, name_inf, quantite_inf, false);
                        $("#infs-empty").after(dom_inf);
                        stat();
                    }
                }
            }
        }
    });

    //génère dom pour l'inserer dans le sachet de thé après un drag/drop valide
    function gen_dom_inf(id, name_inf, quantite, slideinf) {
        inf_empty -= quantite;
        var slide;
        if (slideinf === true) {
            slide = "<div class='slideinf slideinf_active' id='slideinf" + id + "'></div>";
        }
        else {
            slide = "<div class='slideinf' id='slideinf" + id + "'></div>";
        }
        $('#infs-empty').height((inf_empty * 100) + "%");
        var dom = slide + "<div class='gen_inf tac' id='gen_inf" + id + "' style='height:" + quantite * 100 + "%;'>\n\
                   <p>" + name_inf + "         <span class='glyphicon glyphicon-remove remove-inf'></span></p>\n\
                   </div>";
        return dom;
    }

//gestion du drag sur la barre ratio thés
    $("#container-infs").on('drag', ".slideinf", function (event, ui) {
        size_infs($(this));
    });

//contole erreur browser du drag sur la barre ratio thés
    $("#container-infs").on('dragstop', ".slideinf", function (event, ui) {
        size_infs($(this));
        stat();
    });

    //gestion du ratio thé/sup
    function size_infs(element) {
        var top_barre = (element.position()['top']);
        var container_infs = ($('#container-infs').height());
        var ratio_barre = 1 - (top_barre / container_infs);
        $("#gen_inf" + id_inf_move).height((ratio_barre * 100) + "%");
        if (melange.inf.length < 2) {
            inf_empty = top_barre / container_infs;
            $('#infs-empty').height((inf_empty * 100) + "%");
        }
        else {
            var id_oinfr_inf = melange.inf[1].id;
            $('#gen_inf' + id_oinfr_inf).height((100 - (ratio_barre * 100)) + "%");
        }
    }

    $('#box-clear').on('click', '.remove-inf', function () {
        var id = matchid($(this).parent().parent().attr('id'));
        id = parseInt(id[0]);
        var findding = -1;
        for (i = 0; i < melange.inf.length; i++) {
            if (melange.inf[i].id == id) {
                findding = i;
            }
        }
        if (findding === -1) {
            alert("erreur");
        }
        else {
            var height_inf = $('#gen_inf' + id).height();
            $('#slideinf' + id).remove();
            $('#gen_inf' + id).remove();
            inf_empty += melange.inf[findding].quantite;
            melange.inf.splice(findding, 1);
            $('#infs-empty').height((inf_empty * 100) + "%");
        }
        if (melange.inf.length === 1) {
            var oinfr_inf = melange.inf[0].id;
            $("#slideinf" + oinfr_inf).addClass("slideinf_active");
            $("#slideinf" + oinfr_inf).draggable({
                axis: "y",
                containment: "parent",
                start: function (e, ui) {
                    id_inf_move = matchid(ui.helper.attr("id"))[0];
                },
                stop: function (e, ui) {
                    //converti top de slideinf: px => %
                    var pourcent = parseInt($(this).css("top")) / ($(this).parent().height() / 100);
                    $(this).css("top", pourcent + "%");
                    melange.inf[0].quantite = (100 - pourcent) / 100;
                    if (melange.inf.length > 1) {
                        melange.inf[1].quantite = (pourcent) / 100;
                    }
                    stat();
                }
            });
        }
        stat();
    });

//initialise sup_empty => pourcentages de la partie du sachet qui contient le vide
    var sup_empty = 1;
    //id de l'sup en mouvement
    var id_sup_move;
    //id de l'sup en mouvement dans l'objet melange
    var id_sup_move_a;
    var height_ingr_tmp;
    var height_barre_tmp;

// active drag sur .vignette-sup
    $('.vignette-sup').draggable({
        appendTo: "body",
        helper: "clone",
        revert: "invalid",
        scroll: false,
        start: function (e, ui) {
            $(ui.helper).addClass("ui-draggable-helper");
        }
    });

//recherche correspondance id dom et id sur objet melange{sup:[]}
    function find_id(id) {
        //flag témoin : si findding reste à -1 => l'sup est deja dans le sachet
        var findding = -1;
        for (i = 0; i < melange.sup.length; i++) {
            if (melange.sup[i].id == id) {
                findding = i;
            }
        }
        return findding;
    }

// active drop sur #box-sachet-sup
    $("#box-sachet-sup").droppable({
        accept: $('.vignette-sup'),
        hoverClass: "active-drop-sup",
        drop: function (e, ui) {
            //recupère l'id de l'sup qui se fait deplacer accessible sur [0]
            var id = matchid(ui.draggable.attr('id'));
            //flag témoin : si findding reste à -1 => l'sup est deja dans le sachet
            var findding = find_id(id[0]);
            //s'il y a moins de 6 sups et si l'sup n'est pas deja ajouté et s'il y a de la place dans le sachet sup
            if (findding === -1 && melange.sup.length < 6 && sup_empty > 0) {
                //quantité du nouveau sup à l'insertion %
                var quantite_sup;
                //s'il reste moins de 15% dans le sachet sup...
                if (sup_empty > 0.15) {
                    //quantite_sup ajouter = 0.15;
                    var quantite_sup = 0.15;
                }
                else {
                    //quantite_sup ajouter = l'espace libre;
                    var quantite_sup = sup_empty;
                }
                //s'il reste 5% au minimum dans le sachet sup ...
                if (sup_empty > 0.05) {
                    // pourcentage de hauteur restante dans le seachet
                    var height = (1 - sup_empty) * 100;
                    // name_sup => nom de l'sup
                    var name_sup = $(ui.draggable).children("p").text();
                    //recupère l'indice de l'element ajouter dans le tableau mélange en vu de connaitre sa parité
                    var parite_element;
                    if (melange.sup.length % 2 === 1) {
                        parite_element = "paire";
                    }
                    else {
                        parite_element = "impaire";
                    }
                    //s'il y a moin de 15% de place dans la partie ingrédient
                    if (sup_empty < 0.15) {
                        melange.sup.push({id: id[0], quantite: sup_empty});
                    }
                    else {
                        // ... on ajoute 15% de l'sup
                        melange.sup.push({id: id[0], quantite: 0.15});
                    }
                    //genère le dom a inserer
                    var dom_sup = create_item_sup(id[0], name_sup, quantite_sup, parite_element);
                    //ajuste la variable de la hauteur empty
                    sup_empty -= quantite_sup;
                    // applique changement barre empty sur le dom
                    $('#sups-empty').height((sup_empty * 100) + "%");
                    //insert le dom
                    $("#sups-empty").after(dom_sup);
                    size_margin_all();
                    stat();
                    //active scroll sur le nouveau dom
                    $("#contenair_slide" + id[0]).draggable({
                        axis: "y",
                        containment: $("#container-sups"),
                        cancel: ".margintop, .marginbottom",
                        start: function (e, ui) {
                            height_barre_tmp = $(this).position()['top'];
                            //variable glogale = contient l'id de la barre slide de l'sup en mouvement
                            id_sup_move = id[0];
                            //variable glogale = contient l'id de la barre slide de l'sup en mouvement
                            for (i = 0; i < melange.sup.length; i++) {
                                if (melange.sup[i].id == id[0]) {
                                    //variable glogale = correspondance de l'sup en mouvement dans l'Objet melange{sup:[]}
                                    id_sup_move_a = i;
                                }
                            }
                        },
                        drag: function (e, ui) {
                            //gestion du drag sur la barre ratio sup en mouvement
                            size_sups($(this));
                        },
                        stop: function (e, ui) {
                            melange.sup[id_sup_move_a].quantite = height_ingr_tmp / 100;
                            size_margin_all();
                            $(this).css("top", (sup_empty * 100) + "%");
                            stat();
                        }
                    });
                }
            }
        }
    });

    // retourne la taille des blocs au dessous et au dessus de d'sup en mouvement
    function size_margin_all() {
        //Pour tout les elements qui se trouvent en dessous
        for (i = 0; i < melange.sup.length; i++) {
            var total_top = 0;
            var total_bottom = 0;
            for (j = 0; j < i; j++) {
                //var id_tmp= stockid[j];
                total_bottom += parseFloat(melange.sup[j].quantite);
            }
            for (j = i + 1; j < melange.sup.length; j++) {
                total_top += parseFloat(melange.sup[j].quantite);
            }
            var new_height = parseFloat((total_top + total_bottom));
            $("#contenair_slide" + melange.sup[i].id).attr("style", "height: calc(" + ((total_top + total_bottom) * 100) + "%); top: " + (sup_empty * 100) + "%;");
            $("#margintop" + melange.sup[i].id).attr("style", "height: " + (total_top * 100 / (new_height)) + "%");
            $("#marginbottom" + melange.sup[i].id).attr("style", "height: " + (total_bottom * 100 / (new_height)) + "%");
            if (i % 2 === 1) {
                $("#removingr" + melange.sup[i].id).addClass('paire');
            }
            else {
                $("#removingr" + melange.sup[i].id).removeClass('paire');
            }
        }
    }

    function matchprc(txt) {
        var matche = txt.match(/([0-9.]+)%/);
        return matche;
    }

    // retourne la taille des blocs au dessous et au dessus en %, le nombre d'element et 
    function size_margin_bottom() {
        var bottom = 0;
        // recupère la hauteur des autres blocs au dessus de d'sup créé
        for (i = 0; i < melange.sup.length; i++) {
            bottom = bottom + parseFloat(melange.sup[i].quantite);
        }
        return bottom;
    }

    //génère dom pour l'inserer dans le sachet d'sup après un drag/drop valide
    function create_item_sup(id, name_sup, quantite, parite_element) {
        var margin = size_margin_bottom();
        //nouveau dom =>barre pour drag
        var slide = "   <div class='contenair_slide' id='contenair_slide" + id + "' style='height:calc(" + margin * 100 + "%);'>\n\
                             <div class='margintop' id='margintop" + id + "' ></div>\n\
                             <hr class='slidesup slidesup_active'  id='slidesup" + id + "' >\n\
                             <div class='marginbottom'  id='marginbottom" + id + "'  ></div>\n\
                         </div>";
        // dom => nouvel sup dans sachet
        var dom = slide + "<div class='gen_sup tac' id='gen_sup" + id + "' style='height:" + quantite * 100 + "%;'>\n\
                   <p>" + name_sup + "         <div class='glyphicon glyphicon-remove remove-sup " + parite_element + "' id= 'removingr" + id + "'></div></p>\n\
                   </div>";
        return dom;
    }

    //gestion du ratio thé/sup
    function size_sups(element, id) {
        //top barre => distance du top de l'sup en deplacement en px
        var top_barre = (element.position()['top']);
        // stock_height_oinfr_... => taille des blocs deja installer en %
        var stock_height_up = 0;
        var stock_height_down = 0;
        // recupère la hauteur des autres blocs au dessus et en dessus de d'sup en mouvement
        for (i = 0; i < melange.sup.length; i++) {
            //exclu l'element en mouvement
            if (i !== parseInt(id_sup_move_a)) {
                if (i > parseInt(id_sup_move_a)) {
                    stock_height_up = stock_height_up + parseFloat(melange.sup[i].quantite);
                    $("#contenair_slide" + melange.sup[i].id).css("top", (sup_empty * 100) + "%");
                }
                else if (i < parseInt(id_sup_move_a)) {
                    stock_height_down = stock_height_down + parseFloat(melange.sup[i].quantite);
                }
            }
        }
        // hauteur element en deplacement en %
        var height_element = parseFloat(sachet_sup_size - top_barre - (stock_height_down * sachet_sup_size) - (stock_height_up * sachet_sup_size)) * 100 / sachet_sup_size;
        height_ingr_tmp = height_element;
        //ajuste le bloc attacher à l'element sup en mouvement
        $("#gen_sup" + id_sup_move).height((height_element) + "%");
        sup_empty = (1 - height_element / 100 - stock_height_up - stock_height_down);
        //sup_empty = (top_barre+1) / container_sups;
        //ajuste la partie vide du sachet sup
        $('#sups-empty').height(sup_empty * 100 + "%");
    }

    $('#box-clear').on('click', '.remove-sup', function () {

        var id = matchid($(this).attr('id'));
        id = parseInt(id[0]);
        var findding = -1;
        for (i = 0; i < melange.sup.length; i++) {
            if (melange.sup[i].id == id) {
                findding = i;
            }
        }
        console.log(sup_empty);
        if (findding === -1) {
            alert("erreur: sup introuvable");
        }
        else {
            $('#slidesup' + id).remove();
            $('#gen_sup' + id).remove();
            $('#contenair_slide' + id).remove();
            sup_empty += melange.sup[findding].quantite;
            console.log(melange.sup[findding].quantite);
            $('#sups-empty').height((sup_empty * 100) + "%");
            melange.sup.splice(findding, 1);
            size_margin_all();
        }
        stat();
    });

    function stat() {
        $("#box_detail_sup").empty();
        for (i = 0; i < melange.sup.length; i++) {
            var quantite_element = melange.sup[i].quantite;
            var new_dom = "<p> element n°" + melange.sup[i].id + ":      <span class='flr'>" + (Math.round((1 - ratioinf) * quantite_element * 100)) + "%</span></p>";
            $("#box_detail_sup").append(new_dom);
        }
        $("#box_detail_inf").empty();
        for (i = 0; i < melange.inf.length; i++) {
            var quantite_element = melange.inf[i].quantite;
            var new_dom = "<p> element n°" + melange.inf[i].id + ":      <span class='flr'>" + (Math.round((ratioinf) * quantite_element * 100)) + "%</span></p>";
            $("#box_detail_inf").append(new_dom);
        }
    }
});