/////////////////// Funciones para crear el diagrama de dispersion evaluacion continua ////////////////////////

var grupos;
var datos=[];
var nombreGrupos=obtenerNombresGrupos();
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        grupos= JSON.parse(this.responseText);
        var gruposId=_.map(grupos,'id');
        for (var i=0;i<gruposId.length;i++){
            var resultadosExamen=resultados(gruposId[i]); //Obtiene los resultados de los alumnos de un examen
            if (resultadosExamen.length>0){ //Si se ha devuelto una lista vacia se debe a que el grupo no era de un examen
                var nombreGrupo=_.filter(nombreGrupos, { 'id': gruposId[i]});
                //Agrupamos a los alumnos por su nota media
                var mediasExamen= _(resultadosExamen).countBy("resultado")
                    .map((count, nota) => ({
                        'examen': _.head(nombreGrupo).nombre,
                        'notaMedia': parseFloat(nota),
                        'numAlumnos': count
                    })).value();
                datos=_.concat(datos, mediasExamen);
            }
        }
        dibujarScatterPlot(datos);
    }
};
xhttp.open("GET", "https://hypothes.is/api/groups?", true);
xhttp.setRequestHeader("Authorization", "Bearer 6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA");
xhttp.send();

//Funcion que obtiene la ID y los nombres de los grupos
function obtenerNombresGrupos(){
    var gruposNombreID=[];
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
    xhttp.open("GET", "https://hypothes.is/api/groups?limit=200", false);
    xhttp.setRequestHeader("Authorization", "Bearer 6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA");
    xhttp.send();

    return gruposNombreID;
}

//Funcion que obtiene las anotaciones (como maximo 200) ignorando las primeras n anotaciones (offset) del grupo pasado como parametro
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

//Devuelve TRUE si el array de tags tiene longitud 2 y la primera es la pregunta y la segunda la nota
function filtradoTags(tags) {
    return (tags.length==2) && tags[0].includes("isCriteriaOf") && tags[1].includes("mark");
}

//Dada una nota lo pasa sobre 10
function normalizar (anotacionesGrupo, nota) {
    //Se obtienen las primeras anotaciones del grupo que fueron generados automaticamente
    var criteriosDeRubrica = _.filter(anotacionesGrupo, function(value, key) {return filtradoTags2(value.tags);})

    //Se agrupan por pregunta y se obtiene el valor maximo de cada una
    var puntuacionMaximaEjercicios = _(criteriosDeRubrica ).groupBy((d)=>d.tags[1]).map((puntuaciones, pregunta) => ({
        'pregunta': pregunta,
        'puntuacionMayor':  parseInt(_.maxBy(puntuaciones, function(o) { return parseInt(o.tags[0].slice(10)) }).tags[0].slice(10))
    })).value();

    //Suma las puntuaciones maximas
    var valorExamen=_.sumBy(puntuacionMaximaEjercicios, 'puntuacionMayor');

    return (nota*10)/valorExamen;
}

//Devuelve TRUE si el array de tags tiene longitud 2 y la primera es la nota y la segunda la la pregunta. Estos corresponden a los criterios de rubrica que se crean al principio
function filtradoTags2(tags) {
    return (tags.length==2) && tags[0].includes("mark") && tags[1].includes("isCriteriaOf");
}

//Obtiene los resultados de cada alumno en un examen concreto, es decir, si aprobaron o suspendieron
function resultados(grupo){

    //Se obtiene la primera anotacion de cada grupo para comprobar si es de un examen o no
    var primeraAnotacion;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            primeraAnotacion= JSON.parse(this.responseText);
        }
    };
    xhttp.open("GET", "https://hypothes.is/api/search?group="+grupo+"&limit=1&order=asc", false);
    xhttp.setRequestHeader("Authorization", "Bearer 6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA");
    xhttp.send();
    var resultadoFinalAlumnos=[];
    //Comprobamos si el tag de la primera anotacion tiene el prefijo exam
    if (primeraAnotacion.total>0 && primeraAnotacion.rows[0].tags.length>0 && primeraAnotacion.rows[0].tags[0].substring(0, 4)=="exam"){

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                anotacionesGrupo= JSON.parse(this.responseText);

            }
        };
        xhttp.open("GET", "https://hypothes.is/api/search?group="+grupo+"&limit=200&order=asc", false);
        xhttp.setRequestHeader("Authorization", "Bearer 6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA");
        xhttp.send();

        var numAnotacionesTotal= anotacionesGrupo.total;
        var numAnotacionesAcumuladas= anotacionesGrupo.rows.length;
        anotacionesGrupo=anotacionesGrupo.rows;
        while (numAnotacionesTotal!=numAnotacionesAcumuladas){
            var offset=numAnotacionesAcumuladas;
            obtenerAnotacionesAjaxGrupo(grupo,offset);
            numAnotacionesAcumuladas= anotacionesGrupo.length;
        }

        var anotFiltradas = _.filter(anotacionesGrupo, (anotacion) => (filtradoTags(anotacion.tags)));

        var preguntasAlumnosRep = _.map(anotFiltradas, (anotacion) => ({
            'uri': anotacion.uri,
            'pregunta': anotacion.tags[0].slice(18),
            'nota': parseInt(anotacion.tags[1].slice(10))
        }));
        var preguntasAlumnos = _.uniqBy(preguntasAlumnosRep, (alumno) => (alumno.uri.concat(alumno.pregunta)));   //Se eliminan los repetidos

        //Se obtienen los resultados de cada alumno
        resultadoFinalAlumnos = _(preguntasAlumnos).groupBy('uri')
            .map((preguntas, alumno) => ({
                'uri': alumno,
                'resultado': normalizar(anotacionesGrupo, _.sumBy(preguntas, 'nota')).toFixed(2)
            })).value();
    }
    return resultadoFinalAlumnos;
}

//Funcion que dibuja el diagrama
function dibujarScatterPlot(datos){
    //Margenes
    var margins = {
        "left": 40,
        "right": 35,
        "top": 55,
        "bottom": 30
    };

    //Dimensiones
    var width = 550;
    var height = 500;

    var x = d3.scale.ordinal() //Escala del eje x
        .rangeRoundPoints([0, width - margins.left - margins.right], 1)
        .domain(datos.map(function(d) { return d.examen; }));

    var y = d3.scale.linear()  //Escala del eje Y
        .domain(d3.extent(datos, function (d) {
            return d.notaMedia;
        }))
        .range([height - margins.top - margins.bottom, 0]).nice();

    var r= d3.scale.linear() //Escala del radio
        .domain([1, d3.max(datos, function(d) { return d.numAlumnos; })])
        .range([5, 25]);

    //Ejes
    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
    var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);

    d3.select("#svg").remove(); //Eliminar el SVG si lo hubiera (Se realiza para quitar el grafico que habia)

    var svg = d3.select(".search-results__total") // Crear e insertar el SGV
        .append("svg")
        .attr("id", "svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    svg.append("text")
        .attr("x", ((width - margins.left - margins.right) / 2))
        .attr("y", 0 - (margins.top / 1.5))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Resultados examenes evaluacion continua");


    var tooltip = d3.tip() //Creacion del tooltip
        .attr('class', 'd3tip')
        .offset([-10, 0])
        .html(function(d) {
            return "Nota "+d.notaMedia+": <br><strong>" + d.numAlumnos+" Alumnos</strong>"; //Mensaje del tooltip
        });

    svg.call(tooltip);

    //Eje X
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + y.range()[0] + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width- margins.left - margins.right)
        .attr("y", -6)
        .style("text-anchor", "end")
        .attr("textLength", "70")
        .text("Examenes");

    //Eje Y
    svg.append("g")
        .attr("class", "axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Nota");


    //Añadir los puntos
    svg.selectAll("dot")
        .data(datos)
        .enter().append("circle")
        .attr("r", function(d) { return r(d.numAlumnos);  })
        .attr("cx", function(d) { return x(d.examen);})
        .attr("cy", function(d) { return y(d.notaMedia); })
        .style("fill", function(d) { //Segun la nota media los puntos tendran un color u otro
            if (d.notaMedia<3.0) {return "#ef5a3c";}
            else if ((d.notaMedia>=3.0) && (d.notaMedia<5.0)){
                return "#ee8c2b";
            } else if ((d.notaMedia>=5.0) && (d.notaMedia<7.0)) {
                return "#f1e738";
            } else if ((d.notaMedia>=7.0) && (d.notaMedia<9.0)){
                return "#7bee22";
            } else {return "#24ee34"; }
        })
        .on('mouseover', tooltip.show) //Al pasar por encima de una barra aparece el tooltip
        .on('mouseout', tooltip.hide);

}

