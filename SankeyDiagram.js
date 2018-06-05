/////////////////// Funciones para crear el diagrama Alluvial ////////////////////////
var graphOriginal=[]; //Grafo original al que regresar a la hora de refrescar
var linksRestoExamenes=[]; //Linsks que relacionan los examenes de la asignatura
var nodesRestoExamenes=[]; //Nodos de los examenes de la asignatura
var resultadoFinalAlumnos=[]; //Notas finales de los alumnos en el examen actual
var preguntasExamen=[]; //Preguntas del examen actual
var restoExamenes=[]; //Examenes restantes de la asignatura
var resultadosAlumnos=[]; //Resultados de los alumnos en cada examen
//Resultados de examenes inventados para hacer pruebas con varios examenes
var notas3Examen=[{"uri":"https://drive.google.com/drive/folders/1qSCgez-lz_I2CSY-5COAjYOhPA1k6ApM","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1FfkaAf2HRG7PptJh-l7Qhfv5iQR1kzs1","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1VFM9owwIPJCI47iCbuB1rvUS-Lm8dqe4","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1DOOt3dkqQyAUUgcOsWg2YHqzQT1-xkx7","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1Pr5leYattk3yKs_qUhmQDiA2R8BU_xP8","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1wsgN0v3i9NosgOnTFQaU1wJVr051V6iT","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1Qa16WkTU_K9CotHM8A3ZMtTKZf5lFwDV","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1DamHogp2kuQXZSvAAKqQsQJNaJo3Haz-","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1DUNAAFAiaRswFG1wFh4q36kXPdEsS4u-","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1-korOkRoiKcHMUNW2dHuX2eijTt8dVbU","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1XQSpLTREapIS2B2g7fqlZ2DTnykIO_xh","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/16WG5iiw2bnEQJc64xV8cgNk_nDM725GE","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1eybszglP6mae8SkrcVOERfAwessGQ2cV","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1Cz4RSdblk_B5G2gXuJt2f8wD3R1aqXvN","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1TQh7Vxjui1-1g0QfzX30OBAAzIvkr7NZ","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1ODmpIAQckxqoszt4HLDsPyuDIKaERM83","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1cPCzGm8HoOnjLqERhINap8xHbdWv7nuT","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/12xrZhqgUU4B_AkhBXZ1kuItAyjGpSRSA","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1LCEVg0iVVTdaiqok7Sn2gn19wYeCH6XM","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1Z003VSjNFWpj4izTfXAIp7KXJtxOiBd7","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1wRuRJLbcsKWKTR66kbmYqqiGkBeoVq_H","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1cppGhAvZRu8XPfbkpfeRkoneRV8SZT3w","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1HMrpnfmFPUyC4ivC_RKmN4M7WwPmq1XJ","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1vJ28UJpWi6srnI-abN-Wcb5CsMp_wNmV","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1zvxyL04Ps_ftaV_N36KfcsDnhPlgAdhe","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1vPPAgTfzfRuxxMmSzcEtymIB41sHu6mR","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1g4ioXYFnHkLmuXq8I7ZirMVR5FWhvdi9","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1-64G_ecm0IwhlIgM0UkF3vcZ7TbAoZFf","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1rs3mXH5rYRfAHF310jlFBS6y2NlqawZA","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1H0BIKzx-JA4oJ76sN8uKGnePRacaPRMN","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1P3HO9be8dpTrfu9h3h_kPzBUiB0ftsao","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1_jvib58lLXxXZfpUcaJgmdXlEQ3tw-75","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1lOLT-X7CPIdBQCG0KJft7dxek_HVJWt0","resultado":"Suspenso"}];
var notas4Examen=[{"uri":"https://drive.google.com/drive/folders/1qSCgez-lz_I2CSY-5COAjYOhPA1k6ApM","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1FfkaAf2HRG7PptJh-l7Qhfv5iQR1kzs1","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1VFM9owwIPJCI47iCbuB1rvUS-Lm8dqe4","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1DOOt3dkqQyAUUgcOsWg2YHqzQT1-xkx7","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1Pr5leYattk3yKs_qUhmQDiA2R8BU_xP8","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1wsgN0v3i9NosgOnTFQaU1wJVr051V6iT","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1Qa16WkTU_K9CotHM8A3ZMtTKZf5lFwDV","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1DamHogp2kuQXZSvAAKqQsQJNaJo3Haz-","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1DUNAAFAiaRswFG1wFh4q36kXPdEsS4u-","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1-korOkRoiKcHMUNW2dHuX2eijTt8dVbU","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1XQSpLTREapIS2B2g7fqlZ2DTnykIO_xh","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/16WG5iiw2bnEQJc64xV8cgNk_nDM725GE","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1eybszglP6mae8SkrcVOERfAwessGQ2cV","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1Cz4RSdblk_B5G2gXuJt2f8wD3R1aqXvN","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1TQh7Vxjui1-1g0QfzX30OBAAzIvkr7NZ","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1ODmpIAQckxqoszt4HLDsPyuDIKaERM83","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1cPCzGm8HoOnjLqERhINap8xHbdWv7nuT","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/12xrZhqgUU4B_AkhBXZ1kuItAyjGpSRSA","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1LCEVg0iVVTdaiqok7Sn2gn19wYeCH6XM","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1Z003VSjNFWpj4izTfXAIp7KXJtxOiBd7","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1wRuRJLbcsKWKTR66kbmYqqiGkBeoVq_H","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1cppGhAvZRu8XPfbkpfeRkoneRV8SZT3w","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1HMrpnfmFPUyC4ivC_RKmN4M7WwPmq1XJ","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1vJ28UJpWi6srnI-abN-Wcb5CsMp_wNmV","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1zvxyL04Ps_ftaV_N36KfcsDnhPlgAdhe","resultado":"Suspenso"},{"uri":"https://drive.google.com/drive/folders/1vPPAgTfzfRuxxMmSzcEtymIB41sHu6mR","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1g4ioXYFnHkLmuXq8I7ZirMVR5FWhvdi9","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1-64G_ecm0IwhlIgM0UkF3vcZ7TbAoZFf","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1rs3mXH5rYRfAHF310jlFBS6y2NlqawZA","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1H0BIKzx-JA4oJ76sN8uKGnePRacaPRMN","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1P3HO9be8dpTrfu9h3h_kPzBUiB0ftsao","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1_jvib58lLXxXZfpUcaJgmdXlEQ3tw-75","resultado":"Aprobado"},{"uri":"https://drive.google.com/drive/folders/1lOLT-X7CPIdBQCG0KJft7dxek_HVJWt0","resultado":"Suspenso"}];
var gruposNombreID=[]; //Nombres e ID de los grupos de los examenes

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var groups= JSON.parse(this.responseText);
        gruposNombreID=_.map(groups,(grupo)=>({
            'id': grupo.id,
            'nombre': grupo.name
        }));
    }
};
xhttp.open("GET", "https://hypothes.is/api/groups?limit=200", true);
xhttp.setRequestHeader("Authorization", "Bearer 6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA");
xhttp.send();

function obtenerAnotacionesSankey() {
    // Filtramos las anotaciones para obtener solo las que tienen 2 tags -> "isCriteriaOf" y "mark"
    var anotFiltradas = _.filter(anotaciones, (anotacion) => (filtradoTags(anotacion.tags)));

    //Obtenemos los tags de las anotaciones filtradas previamente
    var tags = _.map(anotFiltradas,'tags');

    //Obtenemos una lista con las preguntas del examen
    preguntasExamen=  _(tags).map(d =>
        d[0].slice(18)
    ).uniq().value();

    //Obtenemos los nodos
    var nodes=obtenerNodos(tags);

    //Obtenemos los enlaces de las preguntas
    var links=obtenerLinks(preguntasExamen,anotFiltradas);
    //Creamos el grafo con los nodos y los enlaces (sin el resto de examenes)
    var graphSinRestoExamenes = {nodes:  nodes, links: links};
    //Obtener el resto de enlaces para dibujar el nuevo diagrama
    obtenerLinksRestoExamenes(graphSinRestoExamenes);
    //Se realizan copias para evitar cualquier problema
    var preguntasCopia= _.clone(preguntasExamen);
    var examenesCopia=  _.clone(restoExamenes);
    dibujarGraficoSankey(graphSinRestoExamenes,preguntasCopia,examenesCopia);
}

//Funcion que obtiene los nodos
function obtenerNodos(tags){
    //Creamos la lista de nodos. Cada nodo tendra un name que sera la nota que se visualizara en el grafico y una id para distinguirla del resto que se forma con la concatenacion de la pregunta y el valor
    var nodosRep = _.map(tags, (tags) => ({
        'id': tags[0].slice(18).concat(tags[1].slice(10)),
        'name': tags[1].split(':').pop()
    }));

    //Ya que pueden existir anotaciones repetidas, se pueden formar nodos repetidos y por ello eliminamos los repetidos
    var nodos = _.uniqBy(nodosRep, (nodo) =>(nodo.id));

    //Ademas de los nodos previamente creados, tambien añadimos los nodos 'aprobado' y 'suspenso'
    var nodes=_.concat(nodos, [{'id': group.concat("Aprobado"),'name':"Aprobado"},{'id': group.concat("Suspenso"),'name':"Suspenso"}
    ]);
    return nodes;
}

//Funcion que obtiene los enlaces
function obtenerLinks(preguntas,anotFiltradas) {
//A raiz de las anotaciones creamos una lista de objetos que contienen la uri del alumno, una pregunta y la nota obtenida. Pueden existir objetos repetidos ya que para varias preguntas existen varias anotaciones
    var preguntasAlumnosRep = _.map(anotFiltradas, (anotacion) => ({
        'uri': anotacion.uri,
        'pregunta': anotacion.tags[0].slice(18),
        'nota': parseInt(anotacion.tags[1].slice(10))
    }));


//Filtramos la lista previamente obtenida para eliminar los objetos repetidos
    var preguntasAlumnos = _.uniqBy(preguntasAlumnosRep, (alumno) => (alumno.uri.concat(alumno.pregunta)));

//Creamos una lista y añadimos a cada alumno y si ha aprobado o no. Obtenemos la nota media, la pasamos sobre 10 y segun la nota sera aprobado o suspenso.
    resultadoFinalAlumnos = _(preguntasAlumnosRep).groupBy('uri')
        .map((preguntas, alumno) => ({
            'uri': alumno,
            'resultadoFinal': (normalizar(anotaciones,_.sumBy(preguntas, 'nota')) >= 5) ? "Aprobado" : "Suspenso" //Nos servira para saber de color pintar los links
        })).value();

//Cogemos las preguntas de cada alumno de 'preguntasAlumnos' y le indicamos si al final aprobaron o no
    var preguntasAlumnosConResultado = _.map(preguntasAlumnos, function (obj) {
        return _.assign(obj, _.find(resultadoFinalAlumnos, {
            uri: obj.uri
        }));
    });

//Agrupamos por preguntas. Cada pregunta tendra una lista de las nota de cada alumno en ese ejercicio
    var preguntasNotas = _.groupBy(preguntasAlumnos, 'pregunta');
    var links=[];
    //Recorremos cada pregunta del examen para saber las relaciones entre una pregunta y la siguiente
    for (var i = 0; i < preguntas.length - 1; i++) {
        var ejercicioOrigen = _.get(preguntasNotas, preguntas[i]); //Cogemos las notas de los alumnos de una pregunta
        var ejercicioDestino = _.get(preguntasNotas, preguntas[i + 1]); //Cogemos las notas de los alumnos de la siguiente pregunta
        var notas = _(ejercicioOrigen).map("nota").uniq().value(); //Cogemos las distintas notas que ha habido en el primer ejercicio
        var nota;

        //Por cada nota distinta del primer ejercicio, comprobamos que nota se ha obtenido en el siguiente
        for (var j = 0; j < notas.length; j++) {
            nota = notas[j];
            //Cogemos los alumnos que han sacado esa nota en el primer ejercicio
            var alumnosNotaEjercicioOrigen = _(ejercicioOrigen).filter({'nota': nota}).map((anotacion) => ({'uri': anotacion.uri})).value();

            //Obtenemos los alumnos (y sus notas) del segundo ejercicio que han sacado esa nota en el primer ejercicio
            var alumnosNotaEjercicioDestino = _(ejercicioDestino).intersectionBy(alumnosNotaEjercicioOrigen, 'uri').value();

            //Filtramos y nos quedamos con los alumnos que han aprobado, contamos cuantos hay por cada nota y creamos un link siendo el origen la nota del
            // primer ejercicio (se guarda la pregunta concatenada con la nota), el objetivo la nota en el siguiente ejercicio, el valor cuantos alumnos
            // han sacado la nota del segundo ejercicio habiendo sacado la nota del primer ejercicio. Tambien se guarda que son los que han aprobado para saber de color pintar el link
            var linkAprobados = _(alumnosNotaEjercicioDestino).filter({'resultadoFinal': "Aprobado"}).countBy("nota")
                .map((count, mark) => ({
                    'source': preguntas[i].concat(nota),
                    'target': preguntas[i + 1].concat(mark),
                    'value': count,
                    'resultadoFinal': "Aprobado"
                })).value();

            //Igual que el anterior pero quedandonos con los alumnos suspendidos
            var linkSuspendidos = _(alumnosNotaEjercicioDestino).filter({'resultadoFinal': "Suspenso"}).countBy("nota")
                .map((count, mark) => ({
                    'source': preguntas[i].concat(nota),
                    'target': preguntas[i + 1].concat(mark),
                    'value': count,
                    'resultadoFinal': "Suspenso"
                })).value();

            //Los añadimos a la lista de links
            links = _.concat(links, linkAprobados);
            links = _.concat(links, linkSuspendidos);

        }
    }

    var ultimoEjercicio=_.last(preguntas);
    var anotUltimoEjercicio=  _.get(preguntasNotas , ultimoEjercicio); //Cogemos las notas de los alumnos de la siguiente pregunta
    var notas= _(anotUltimoEjercicio).map("nota").uniq().value();
    //Por cada nota en el ultimo ejercicio, si aprobaron o no el examen
    for (var i = 0; i < notas.length; i++) {
        var nota=notas[i];
        var r = _.filter(anotUltimoEjercicio, {'nota':nota});

        var aprobados = _(r).filter({  'resultadoFinal': "Aprobado" }).countBy("nota")
            .map((count, mark) => ({
                'source': ultimoEjercicio.concat(nota),
                'target': group.concat("Aprobado"),
                'value': count,
                'resultadoFinal': "Aprobado"
            })).value();

        var suspensos = _(r).filter({  'resultadoFinal': "Suspenso" }).countBy("nota")
            .map((count, mark) => ({
                'source': ultimoEjercicio.concat(nota),
                'target': group.concat("Suspenso"),
                'value': count,
                'resultadoFinal': "Suspenso"
            })).value();

        links= _.concat(links, aprobados);
        links= _.concat(links, suspensos);
    }
    return links;
}

//Funcion que dibuja el grafico Sankey/Alluvial
function dibujarGraficoSankey(grafo, preguntas,examenes){
    var units = "Alumnos"; //Unidad/valor de la anchura de las lineas

    //Recalcular la anchura del diagrama segun el numero de columnas
    var plusAnchura;
    if ((preguntas.length+examenes.length)>6) {plusAnchura=130;} else {plusAnchura=70;}

    //Margenes, altura y anchura
    var margin = {top: 6, right: 70, bottom: 5, left: 20},
        width = 700+(preguntas.length+examenes.length)*plusAnchura - margin.left - margin.right,
        height = 560 - margin.top - margin.bottom;

    var formatNumber = d3.format(",.0f"),    // Elimina los decimales
        format = function(d) { return formatNumber(d) + " " + units; }, //Dado un numero le da un formato
        color = d3.scale.category20(); //Da acceso a una escala de colores
    var graphCopy=_.clone(grafo);
    d3.select("#dv").remove();
    d3.select("#dvdesplegables").remove();
    d3.select("#svgbotonesEliminar").remove();
    d3.select("#dvsankey").remove();
    d3.select("#divGrafico").append("div").attr("id","dv");

    var dvsankey=d3.select("#divGrafico").append("div").attr("id","dvsankey");
    var dvdesplegables=d3.select("#dvsankey").append("div").attr("id","dvdesplegables").style("width", (width + margin.left + margin.right)+'px');
    var svgbotonesEliminar=d3.select("#dvsankey").append("svg").attr("id","svgbotonesEliminar").attr("width", width + margin.left + margin.right)
        .attr("height",'18px');
    d3.select("#dv").append("button").attr("id","refrescar").text("Refrescar").on("click", (d) => dibujarGraficoSankey(_.clone(graphOriginal),_.clone(preguntasExamen),examenes));


    // Insertamos el SGV y establecemos sus medidas

    d3.select("#svg").remove();
    d3.select(".d3tip").remove();
    var svg = d3.select("#dvsankey")
        .append("svg")
        .attr("id", "svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")"); //Posicion donde se va a situar

    // Establecemos las propiedades del grafico Sankey (anchura de nodos, distancia entre nodos y dimensiones del diagrama)
    var sankey = d3.sankey()
        .nodeWidth(12)
        .nodePadding(25)
        .size([width, height]);

    var path = sankey.link(); //un puntero a la función de sankey que hace que los enlaces entre los nodos se curven. en los lugares correctos.

    // Cargamos los datos obtenidos previamente para su posterior visualizacion
    (function(grafo) {

        //Este codigo es debido a que se han utilizado la id de los nodos (un string en vez de un entero) en el source y target de los links -> https://stackoverflow.com/questions/14629853/json-representation-for-d3-force-directed-networks
        var nodeMap = {};
        grafo.nodes.forEach(function(x) { nodeMap[x.id] = x; });
        console.log('graph', grafo);
        grafo.links = grafo.links.map(function(x) {
            return {
                source: nodeMap[x.source],
                target: nodeMap[x.target],
                value: x.value,
                resultadoFinal: x.resultadoFinal
            };});


        sankey
            .nodes(grafo.nodes)
            .links(grafo.links)
            .layout(12);

        //Se obtienen las posiciones de las columnas de nodos
        var posicion= _.sortBy(_.uniq(_.map(grafo.nodes,"x")));
        var distancia=posicion[1]-posicion[0];

        var tooltip = d3.tip() //Creacion del tooltip
            .attr('class', 'd3tip')
            .offset([-10, 0])
            .html(function(d) {
                return "Eliminar pregunta";
            });

        //Crear un imagen con forma de cruz que servira para eliminar una pregunta
        var imgUrl = "https://png.icons8.com/metro/1600/delete-sign.png";
        svg.append("defs")
            .append("pattern")
            .attr("id", "venus")
            .attr("width",30)
            .attr("height", 20)
            .append("image")
            .attr("xlink:href", imgUrl)
            .attr("width", 30)
            .attr("height", 20);

        svg.call(tooltip);

        //Se añade una lista desplegable en cada columna de nodos correspondientes a las preguntas
        dvdesplegables
        /*.selectAll("div")
         .data(preguntas)
         .enter()
         .append("div")
         .attr("class","columName")
         .attr("id",function (d,i) { return "columnName"+i;})
         .style("float","left")*/
            .selectAll("select.desplegablePreguntas")
            .data(preguntas)
            .enter()
            .append("select")
            .attr("class","desplegablePreguntas")
            .attr("id",function (d,i) { return "desplegable"+i;})
            .style("width", function (d,i) { return (distancia<180)? ((distancia*0.7)+'px') : "180px"})
            .style("margin-right", function (d,i) { return (distancia<180)? ((distancia*0.3)+'px') : (distancia-180)+'px'})
            .on('change',function (d,i) { return intercambiar(preguntas[i]);})
            .selectAll("option")
            .data(preguntas)
            .enter()
            .append("option")
            .attr("value", function (d) { return d; })
            .text(function (d) { return d; })
        ;

        //Se establece el valor de cada una de las listas desplegables
        for (var i=0;i<preguntas.length;i++) {
            d3.select('#desplegable'+i)
                .property('value', preguntas[i])
                .append("title")
                .text(preguntas[i]);
        }
        var gruposNombre=_.filter(gruposNombreID, (grupo)=>(examenes.includes(grupo.id)));

        //Se añade una lista desplegable en cada columna de nodos correspondiente al resto de examenes
        dvdesplegables
            .selectAll("select.desplegableExamenes")
            .data(examenes)
            .enter()
            .append("select")
            .attr("class","desplegableExamenes")
            .attr("id",function (d,i) { return "desplegableExamen"+i;})
            .style("width", function (d,i) { return (distancia<180)? ((distancia*0.7)+'px') : "180px"})
            .style("margin-left", function (d,i) { if (distancia<180){ if(i==0) {return distancia*0.7+'px';} else {return ((distancia*0.3)+'px');}} else { if(i==0) {return (distancia*1.25-180)+'px';} else {return (distancia-180)+'px';}}})
            .on('change',function (d,i) { return intercambiarExamen(examenes[i]);})
            .selectAll("option")
            .data(gruposNombre)
            .enter()
            .append("option")
            .attr("value", function (d) { return d.id; })
            .text(function (d) { return d.nombre; })
        ;

        //Se establece el valor de cada una de las listas desplegables
        for (var i=0;i<examenes.length;i++) {
            d3.select('#desplegableExamen'+i)
                .property('value', examenes[i])
                .append("title")
                .text(examenes[i]);
        }

        //Intercambia la posicion de dos preguntas y actualiza el diagrama
        function intercambiar(defecto) {
            var pos1=preguntas.indexOf(defecto)
            var selectValue =d3.select('#desplegable'+pos1).property('value');
            var pos2=preguntas.indexOf(selectValue);
            preguntas[pos1]=selectValue;
            preguntas[pos2]=defecto;
            var anotFiltradas = _.filter(anotaciones, (anotacion) => (filtradoTags(anotacion.tags)));
            var links=obtenerLinks(preguntas,anotFiltradas);
            var grafoNuevo = {nodes: _.clone(graphCopy.nodes), links: _.concat(links,_.clone(linksRestoExamenes))};
            dibujarGraficoSankey(grafoNuevo,preguntas,examenes);
        };

        //Intercambia la posicion de dos examenes y actualiza el diagrama
        function intercambiarExamen(examen) {
            var pos1=examenes.indexOf(examen);
            var selectValue =d3.select('#desplegableExamen'+pos1).property('value');
            var pos2=examenes.indexOf(selectValue);
            examenes[pos1]=selectValue;
            examenes[pos2]=examen;
            var grupos=_.concat(_.clone(group),_.clone(_.clone(restoExamenes)));
            var enlacesEjercicios= _.filter(graphCopy.links, (link) => (!_.includes(grupos,link.source.slice(0,8))));
            var enlacesExamenes=actualizarLinksExamenes(examenes);
            var grafoNuevo= {nodes: _.clone(graphCopy.nodes), links: _.concat(enlacesEjercicios,enlacesExamenes)};
            linksRestoExamenes= _.clone(enlacesExamenes);
            dibujarGraficoSankey(grafoNuevo,preguntas,examenes);
        };


        //Añade un boton con la imagen previa para eliminar una columna de nodos
        svgbotonesEliminar.selectAll('rect')
            .data(preguntas)
            .enter()
            .append("rect")
            .attr("class","button")
            .attr("fill", "url(#venus)")
            .attr("x", (d,i)=>posicion[i]+10)
            .attr("width", 30)
            .attr("height", 20)
            .attr("rx", 10)
            .attr("ry", 10)
            .on('mouseover', tooltip.show)
            .on('mouseout', tooltip.hide)
            .on("click", function (d,i) {
                if (preguntas.length>1){
                    _.remove(preguntas, function(n) {
                        return n ==d ;
                    });
                    var nodes= _.filter(grafo.nodes, (nodo) => (!nodo.id.includes(d)));
                    var anotFiltradas = _.filter(anotaciones, (anotacion) => (filtradoTags(anotacion.tags)));
                    var links=obtenerLinks(preguntas,anotFiltradas);
                    var nuevoGrafo= {nodes: nodes, links: _.concat(links,_.clone(linksRestoExamenes))};
                    dibujarGraficoSankey(nuevoGrafo,preguntas,examenes);
                }else {
                    alert("Es necesario que haya al menos una pregunta.");
                }
            });



        // Añadimos los enlaces (links) en el diagrama
        var link = svg.append("g").selectAll(".link")
            .data(grafo.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke", function(d){
                return d.resultadoFinal == "Aprobado" ? "green" : "red";
            })
            .style("stroke-width", function(d) { return Math.max(1, d.dy); })
            .sort(function(a, b) { return b.dy - a.dy; });

        // Añade un mensaje de texto que aparece al pasar el raton por encima de los enlaces (indica el origen, el destino y el valor)
        link.append("title")
            .text(function(d) {
                return d.source.name + " → " +
                    d.target.name + "\n" +
                    d.resultadoFinal+": "+format(d.value) ;
            });


        // Añade los nodos (no los rectangulos ni el texto)
        var node = svg.append("g").selectAll(".node")
            .data(grafo.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; })
            .call(d3.behavior.drag()
                .origin(function(d) { return d; })
                .on("dragstart", function() {
                    this.parentNode.appendChild(this); })
                .on("drag", dragmove));

        // Añadir los rectangulos a los nodos
        node.append("rect")
            .attr("height", (d) => d.dy)
            .attr("width", sankey.nodeWidth())
            .style("fill", function(d) {
                return d.color = color(d.name.replace(/ .*/, "")); })
            .style("stroke", function(d) {
                return d3.rgb(d.color).darker(2); })
            .append("title")
            .text(function(d) {
                return d.name + "\n" + format(d.value); });

        // Añadir titulo a los nodos
        node.append("text")
            .attr("x", -6)
            .attr("y", (d) => d.dy / 2)
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text((d) => d.name)
            .filter((d) =>d.x < width / 2)
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        // Funcion para mover los nodos
        function dragmove(d) {
            d3.select(this).attr("transform",
                "translate(" + (
                    d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
                ) + "," + (
                    d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                ) + ")");
            sankey.relayout();
            link.attr("d", path);
        }

    })(grafo);
}

//Funcion que obtiene los enlaces del resto de examenes y actualiza el diagrama
function obtenerLinksRestoExamenes (grafo){
    var grupos;
    var xhttp = new XMLHttpRequest();
    var enlaces=[];
    var nodos=[];
    var grupoActual=group;
    var graph=_.clone(grafo);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            grupos= JSON.parse(this.responseText);
            var gruposId=_.map(grupos,'id');
            _.pull(gruposId, grupoActual); //Elimina el grupo actual de la lista de grupos
            var resultadosExamenOrigen=_.clone(resultadoFinalAlumnos);
            resultadosAlumnos.push({examen:grupoActual,resultados:_.clone(resultadoFinalAlumnos)});
            for (var i=0;i<gruposId.length;i++){
                var resultadosExamenDestino=resultados(gruposId[i]); //Obtiene los resultados de los alumnos de un examen
                if (resultadosExamenDestino.length>0){ //Si se ha devuelto una lista vacia se debe a que el grupo no era de un examen
                    //Añade a cada alumno en la lista resultadosExamenOrigen el resultado del examen obtenidos en resultadosExamenDestino.
                    //Para diferenciar el nombre de los atributos, al resultado del origen se le llama "resultadoFinal" y al de destino "resultado"
                    var preguntasAlumnosConResultado = _.map(resultadosExamenOrigen, function (alumno) {
                        return _.assign(alumno, _.find(resultadosExamenDestino, {
                            uri: alumno.uri
                        }));
                    });
                    //Obtiene los aprobados en el examen de origen y cuenta los distintos resultados en el examen de destino.
                    //Puede ocurrir que en el de destino no se haya presentado un alumno y en ese caso en el countBy se genera un atributo undefined que hay que omitir.
                    var linkAprobados = _(preguntasAlumnosConResultado).filter({'resultadoFinal': "Aprobado"}).countBy("resultado").omit('undefined')
                        .map((count, mark) => ({
                            'source': grupoActual.concat("Aprobado"),
                            'target': gruposId[i].concat(mark),
                            'value': count,
                            'resultadoFinal': mark
                        })).value();


                    var linkSuspensos = _(preguntasAlumnosConResultado).filter({'resultadoFinal': "Suspenso"}).countBy("resultado")
                        .omit('undefined').map((count, mark) => ({
                            'source': grupoActual.concat("Suspenso"),
                            'target': gruposId[i].concat(mark),
                            'value': count,
                            'resultadoFinal': mark
                        })).value();

                    enlaces= _.concat(enlaces, linkAprobados);
                    enlaces = _.concat(enlaces, linkSuspensos);

                    //El grupo de destino pasa a ser el grupo actual y los resultados del examen destino se convierten en origen
                    //(se cambia el nombre del atributo 'resultado' a 'resultadoFinal').
                    if(enlaces.length>0) {
                        nodos = _.concat(nodos, [{
                            'id': gruposId[i].concat("Aprobado"),
                            'name': "Aprobado"
                        }, {'id': gruposId[i].concat("Suspenso"), 'name': "Suspenso"}]);

                        resultadosAlumnos.push({examen:gruposId[i],resultados:_.clone(resultadosExamenDestino)});

                        grupoActual = gruposId[i];
                        resultadosExamenOrigen = _.map(resultadosExamenDestino, resultado => ({
                            'uri': resultado.uri,
                            'resultadoFinal': resultado.resultado
                        }));
                        restoExamenes.push(gruposId[i]);
                    }
                }

            }
            graph.nodes=_.concat(graph.nodes,nodos);
            graph.links= _.concat(graph.links,enlaces);
            nodesRestoExamenes=nodos; // Se guardan los enalces del resto de examenes
            linksRestoExamenes=enlaces; //Se guardan nos nodos del resto de examenes
            graphOriginal= {nodes: graph.nodes, links: graph.links}; //Se guarda el grafo original
            var preguntasCopia= _.clone(preguntasExamen);
            dibujarGraficoSankey(graph,preguntasCopia,_.clone(restoExamenes));
        }
    };
    xhttp.open("GET", "https://hypothes.is/api/groups?", true);
    xhttp.setRequestHeader("Authorization", "Bearer 6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA");
    xhttp.send();
}

//Funcion que actualiza los enlaces del resto de examenes y el diagrama
function actualizarLinksExamenes(examenes) {
    var enlaces = [];
    var grupoOrigen=group;
    var resultadosExamenOrigen = _.find(resultadosAlumnos,{'examen':grupoOrigen});
    resultadosExamenOrigen=resultadosExamenOrigen.resultados;
    for (var i = 0; i < examenes.length; i++) {
        var resultadosExamenDestino = _.find(resultadosAlumnos,{'examen': examenes[i]});
        resultadosExamenDestino=resultadosExamenDestino.resultados;
        //Añade a cada alumno en la lista mediasOrigen el resultado del examen obtenidos en mediasDestino.
        //Para diferenciar el nombre de los atributos, al resultado del origen se le llama "resultadoFinal" y al de destino "resultado"
        var preguntasAlumnosConResultado = _.map(resultadosExamenOrigen, function (alumno) {
            return _.assign(alumno, _.find(resultadosExamenDestino, {
                uri: alumno.uri
            }));
        });

        //Obtiene los aprobados en el examen de origen y cuenta los distintos resultados en el examen de destino.
        //Puede ocurrir que en el de destino no se haya presentado un alumno y en ese caso en el countBy se genera un atributo undefined que hay que omitir.
        var linkAprobados = _(preguntasAlumnosConResultado).filter({'resultadoFinal': "Aprobado"}).countBy("resultado").omit('undefined')
            .map((count, mark) => ({
                'source': grupoOrigen.concat("Aprobado"),
                'target': examenes[i].concat(mark),
                'value': count,
                'resultadoFinal': mark
            })).value();


        var linkSuspensos = _(preguntasAlumnosConResultado).filter({'resultadoFinal': "Suspenso"}).countBy("resultado")
            .omit('undefined').map((count, mark) => ({
                'source': grupoOrigen.concat("Suspenso"),
                'target': examenes[i].concat(mark),
                'value': count,
                'resultadoFinal': mark
            })).value();

        enlaces = _.concat(enlaces, linkAprobados);
        enlaces = _.concat(enlaces, linkSuspensos);
        //El grupo de destino pasa a ser el grupo actual y los resultados del examen destino se convierten en origen
        //(se cambia el nombre del atributo 'resultado' a 'resultadoFinal').
        resultadosExamenOrigen = _.map(resultadosExamenDestino, resultado => ({
            'uri': resultado.uri,
            'resultadoFinal': resultado.resultado
        }));
        grupoOrigen=examenes[i];
    }
    return enlaces;
}