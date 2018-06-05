var anotacionesGrupo;
var data=[];
var puntuacionMaximaGrupos=[];
var grupos=[];
var medias=[];
var anotaciones;
var anotFiltradas;
var LegendOptions = ['Alumno', 'Media de la clase'];
var reloadInterval;
var loc = document.location.href;
if (loc.includes("https://drive.google.com/drive/folders/")){ //Comprobar de que se trata de una carpeta
     //esAlumno(loc);
    spiderChart()
}
setInterval(function(){ comprobarURL(); }, 2000); //Comprobar si se ha cambiado de url

function comprobarURL() {
    var locActual=document.location.href;
    if(loc!=locActual) {
        if (locActual.includes("https://drive.google.com/drive/folders/")){
            //esAlumno(loc);
            spiderChart();
        }
        loc=locActual;
    }
}

/*
//Funcion para saber si la carpeta des de un alumno
function esAlumno(url) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var anotacionUrl= JSON.parse(this.responseText);
            if (anotacionUrl.total>0 && anotacionUrl.rows[0].tags.length>0 && anotacionUrl.rows[0].tags[0].includes("exam:")){
                spiderChart();
            }
        }
    };
    xhttp.open("GET", "https://hypothes.is/api/search?uri="+url+"&limit=1", true);
    xhttp.setRequestHeader("Authorization", "Bearer 6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA");
    xhttp.send();
}
*/
//Funcion principal
function spiderChart() {
    data=[];
    medias=[];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var anotaciones = JSON.parse(this.responseText);
            // Se filtran las anotaciones para obtener solo las que tienen 2 tags -> "isCriteriaOf" y "mark"
            var anotFiltradas = _.filter(anotaciones.rows, (anotacion) => (filtradoTags(anotacion.tags)));
            //Se crea una estructura con el nombre del eje, el valor del alumno y el examen
            var preguntasAlumnosRep = _.map(anotFiltradas, (anotacion) => ({
                'axis': anotacion.tags[0].slice(18),
                'value': parseInt(anotacion.tags[1].slice(10)),
                'group': anotacion.group
            }));
            //Se eliminan los objetos repetidos
            var preguntasAlumno = _.uniqBy(preguntasAlumnosRep, 'axis');
            //Se obtienen los grupos del alumno
            grupos = _(anotFiltradas).map("group").uniq().value();
            //Por cada grupo se obtiene la nota media de la clase en cada pregunta
            for (var i = 0; i < grupos.length; i++) {
                medias = _.concat(medias, obtenerMedias(grupos[i]));
            }
            //A cada nota del alumno se añade sobre cuanto era esa pregunta para poder calcular los porcentajes
            data.push(_.sortBy(medias, 'axis'));
            var preguntasAlumnoMaximo = _.map(preguntasAlumno, function (pregunta) {
                return _.assign(pregunta, _.find(puntuacionMaximaGrupos, {
                    pregunta: pregunta.axis
                }));
            });
            //Estructura final: Eje (nombre de la pregunta), value (porcentaje sobre 100), maximumValue (valor maximo de la pregunta), mark (nota del alumno) y group (grupo del examen al que pertenece la pregunta)
            var preguntasAlumnoTotal = _.map(preguntasAlumnoMaximo, (pregunta) => ({
                'axis': pregunta.axis,
                'value': (pregunta.value / pregunta.puntuacionMayor),
                'maximumValue': pregunta.puntuacionMayor,
                'mark': pregunta.value,
                'group': pregunta.group
            }));

            data.unshift(_.sortBy(preguntasAlumnoTotal, 'axis'));
            //Comprobar que se ha creado el div donde se va a insertar el diagrama
            reloadInterval = setInterval(function () {
                myFunction();
            }, 3000);
        }
    };
    xhttp.open("GET", "https://hypothes.is/api/search?uri=https%3A%2F%2Fdrive.google.com%2Fdrive%2Ffolders%2F1vJ28UJpWi6srnI-abN-Wcb5CsMp_wNmV&limit=200", false);
    xhttp.setRequestHeader("Authorization", "Bearer 6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA");
    xhttp.send();
}

//Comprueba que se ha creado el div donde se va a insertar el diagrama
function myFunction (){

    if (document.getElementsByClassName("a-gd-x")[0]) {
        clearInterval(reloadInterval);
        console.log("listaclases",document.getElementsByClassName("a-gd-x"));
        dibujarSpiderChart(data);
    }
}

//Devuelve TRUE si el array de tags tiene longitud 2 y la primera es la pregunta y la segunda la nota
function filtradoTags(tags) {
    return (tags.length==2) && tags[0].includes("isCriteriaOf") && tags[1].includes("mark");
}

//Obtiene las notas medias de cada pregunta de un examen
function obtenerMedias(grupo) {

    //Obtener las anotaciones del grupo
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            anotacionesGrupo= JSON.parse(this.responseText);
        }
    };
    xhttp.open("GET", "https://hypothes.is/api/search?group="+grupo+"&limit=200&order=asc", false);
    xhttp.setRequestHeader("Authorization", "Bearer 6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA");
    xhttp.send();
    var numAnotacionesTotal= anotacionesGrupo.total; //Anotaciones totales
    var numAnotacionesAcumuladas= anotacionesGrupo.rows.length; //Anotaciones obtenidas en la primera llamada
    anotacionesGrupo=anotacionesGrupo.rows; //Nos quedamos solo con las anotaciones (Quitamos el total)
    while (numAnotacionesTotal!=numAnotacionesAcumuladas){
        var offset=numAnotacionesAcumuladas;
        obtenerAnotacionesAjaxGrupo(grupo,offset);
        numAnotacionesAcumuladas= anotacionesGrupo.length;
    }
    // Se filtran las anotaciones para obtener solo las que tienen 2 tags -> "isCriteriaOf" y "mark"
    var anotGrupoFiltradas = _.filter(anotacionesGrupo, (anotacion) => (filtradoTags(anotacion.tags)));
    //De cada anotacion se guarda la uri del alumno, la pregunta y la nota
    var preguntasAlumnosGrupoRep = _.map(anotGrupoFiltradas, (anotacion) => ({
        'uri': anotacion.uri,
        'pregunta': anotacion.tags[0].slice(18),
        'nota': parseInt(anotacion.tags[1].slice(10))
    }));
    //Se eliminan los objetos repetidos
    var preguntasAlumnosGrupo = _.uniqBy(preguntasAlumnosGrupoRep, (alumno) => (alumno.uri.concat(alumno.pregunta)));
    //Se obtiene por cada pregunta la media
    var mediaPreguntas = _(preguntasAlumnosGrupo).groupBy('pregunta')
        .map((alumnos, pregunta) => ({
            'axis': pregunta,
            'value': _.sumBy(alumnos, 'nota')/ alumnos.length
        })).value();
    //Se obtiene la puntuacion maxima de cada pregunta
    var puntuacionMaxima= puntuacionMaximaGrupo(anotacionesGrupo);
    puntuacionMaximaGrupos= _.concat(puntuacionMaximaGrupos,puntuacionMaxima);

    //Se asigna como atributo nuevo la puntuacion maxima a las medias de cada preguntas obtenidas previamente
    var preguntasAlumnosConResultado = _.map(mediaPreguntas, function (pregunta) {
        return _.assign(pregunta, _.find(puntuacionMaxima, {
            pregunta: pregunta.axis
        }));
    });


    var mediaPreguntasPorcentajes = _.map(mediaPreguntas,(pregunta)=>({
        'axis': pregunta.axis,
        'value': ( pregunta.value/ pregunta.puntuacionMayor),
        'maximumValue':pregunta.puntuacionMayor,
        'mark': pregunta.value,
        'group': grupo
    }));

    //Estructura final: Eje (nombre de la pregunta), value (porcentaje sobre 100), maximumValue (valor maximo de la pregunta), mark (nota media de la clase) y group (grupo del examen al que pertenece la pregunta)
    return _.orderBy(mediaPreguntasPorcentajes,'axis');
}

//Obtiene la puntuacion maxima de cada pergunta de un examen
function puntuacionMaximaGrupo (anotacionesGrupo) {
    //Se obtienen las primeras anotaciones del grupo que fueron generados automaticamente
    var criteriosDeRubrica = _.filter(anotacionesGrupo, function(value, key) {return filtradoTags2(value.tags);});

    //Se agrupan por pregunta y se obtiene el valor maximo de cada una
    var puntuacionMaximaEjercicios = _(criteriosDeRubrica ).groupBy((d)=>d.tags[1]).map((puntuaciones, pregunta) => ({
        'pregunta': pregunta.slice(18),
        'puntuacionMayor':  parseInt(_.maxBy(puntuaciones, function(o) { return parseInt(o.tags[0].slice(10)) }).tags[0].slice(10))
    })).value();

    return puntuacionMaximaEjercicios;
}

//Devuelve TRUE si el array de tags tiene longitud 2 y la primera es la nota y la segunda la la pregunta. Estos corresponden a los criterios de rubrica que se crean al principio
function filtradoTags2(tags) {
    return (tags.length==2) && tags[0].includes("mark") && tags[1].includes("isCriteriaOf");
}

//Funcion que obtiene las anotaciones (como maximo 200) ignorando las primeras n anotaciones (offset)
function obtenerAnotacionesAjaxGrupo(grupo,offset){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var anotacionesResto= JSON.parse(this.responseText);
            anotacionesGrupo=anotacionesGrupo.concat(anotacionesResto.rows);

        }
    };
    xhttp.open("GET", "https://hypothes.is/api/search?group="+grupo+"&offset="+offset+"&limit=200&order=asc", false);
    xhttp.setRequestHeader("Authorization", "Bearer 6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA");
    xhttp.send();
}

//Funcion que dibuja el diagrama
function dibujarSpiderChart(data){
    var w = 350,
        h = 350;
console.log("datadibujar",data);
    var colorscale = d3.scale.category10();

//Titulos de las leyendas
    var mycfg = {
        w: w,
        h: h,
        maxValue: 1,
        levels: 5,
        ExtraWidthX: 300
    }

    d3.select("#chart").remove();
    d3.select("#body").remove();
    d3.select("#divSelect").remove();
    d3.select(".a-gd-x").append("div").attr("id","divSelect");
    d3.select(".a-gd-x").append("div").attr("id","body");
    d3.select("#body").append("div").attr("id","chart");
    console.log("pass1");
    RadarChart.draw("#chart", data, mycfg);
    console.log("pass2");
    var gruposNombreID;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var groups= JSON.parse(this.responseText);
            gruposNombreID=_.map(groups,(grupo)=>({
                'id': grupo.id,
                'nombre': grupo.name
            }));
            gruposNombreID=_.filter(gruposNombreID, (grupo)=>(grupos.includes(grupo.id)));

        }
    };
    xhttp.open("GET", "https://hypothes.is/api/groups?", false);
    xhttp.setRequestHeader("Authorization", "Bearer 6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA");
    xhttp.send();
    console.log("pass2");
    var gruposLista=_.concat(gruposNombreID,{'id':"Total",'nombre':"Total"});

    d3.select("#divSelect")
        .append("select")
        .attr("class","desplegable")
        .attr("id","desplegable")
        .on('change',function (d,i) {
            var grupoSeleccionado = d3.select("#desplegable").node().value; //Examen seleccionado

            if (grupoSeleccionado=="Total"){ //Vision general de los examenes
                LegendOptions = ['Alumno', 'Media de la clase'];
                dibujarSpiderChart(data);
                console.log("entro");

            } else { //Vision de un examen en concreto
                var notasAlumnoExamen=_.filter(data[0],{'group':grupoSeleccionado});
                var notasMediasExamen=_.filter(data[1],{'group':grupoSeleccionado});
                var dataGrupo=[];
                dataGrupo.push(notasAlumnoExamen);
                dataGrupo.push(notasMediasExamen);
                //Leyenda con las notas medias del alumno y la clase
                var notaAlumno = _.sumBy(notasAlumnoExamen, 'mark');
                var notaClase = _.sumBy(notasMediasExamen, 'mark').toFixed(2);
                var valorExamen=_.sumBy(notasAlumnoExamen, 'maximumValue');
                var porcentajeAlumno = ((notaAlumno / valorExamen)*100).toFixed(2);
                var porcentajeClase = ((notaClase / valorExamen)*100).toFixed(2);
                console.log("medalu", porcentajeAlumno);
                console.log("medcla", porcentajeClase);
                var leyendaAlumno = 'Alumno: '+notaAlumno+'/'+valorExamen+" ("+porcentajeAlumno+"%)";
                var leyendaGrupo = 'Media de la clase: '+notaClase+'/'+valorExamen+" ("+porcentajeClase+"%)";
                LegendOptions = [leyendaAlumno, leyendaGrupo];

                dibujarSpiderChart(dataGrupo);
                d3.select('#desplegable')
                    .property('value',grupoSeleccionado)
            }
            ;})
        .selectAll("option")
        .data(gruposLista)
        .enter()
        .append("option")
        .attr("value", function (d) { return d.id; })
        .text(function (d) { return d.nombre; });

    d3.select('#desplegable')
        .property('value', "Total")
    ;

    console.log("pass3");


//Crear leyenda

    var svg = d3.select("#body")
        .append("svg")
        .attr("id", "svg")
        .attr("width", w+300 )
        .attr("height", h)
    ;

//Creael titulo de la leyenda
    svg.append("text")
        .attr("class", "title")
        .attr('transform', 'translate(90,0)')
        .attr("x", w - 70)
        .attr("y", 10)
        .attr("font-size", "12px")
        .attr("fill", "#404040")
        .text("Resultado del alummo en comparacion con la media de clase");

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr('transform', 'translate(90,20)')
    ;

    legend.selectAll('rect')
        .data(LegendOptions)
        .enter()
        .append('rect')
        .attr("x", w - 65)
        .attr("y", function(d, i){ return i * 20;})
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d, i){ return colorscale(i);})

    legend.selectAll('text')
        .data(LegendOptions)
        .enter()
        .append("text")
        .attr("x", w - 52)
        .attr("y", function(d, i){ return i * 20 + 9;})
        .attr("font-size", "11px")
        .attr("fill", "#737373")
        .text(function(d) { return d; })
    ;
    console.log("pass4");
}

