var loc = document.location.href;
var urlSplit = loc.split('/');
urlSplit.pop();
var group = urlSplit.pop();


var divGrafico = document.createElement('div');
divGrafico.id = 'divGrafico';

var botonSankey = document.createElement('input');
botonSankey.type = 'button';
botonSankey.id = 'botonSankey';
botonSankey.value = 'Gráfico Alluvial';
botonSankey.title = "Puntuaciones por ejercicio";
botonSankey.onclick = function() {obtenerAnotacionesSankey()};

var botonScatter = document.createElement('input');
botonScatter.type = 'button';
botonScatter.id = 'botonScatter';
botonScatter.value = 'Gráfico de dispersión';
botonScatter.title = "Notas por examen";
botonScatter.onclick = function() {obtenerAnotacionesScatter()};

document.getElementsByClassName('search-results')[0].insertBefore(divGrafico, document.getElementsByClassName('search-results__list')[0]);


divGrafico.appendChild(botonSankey);
divGrafico.appendChild(botonScatter);




var anotacionesGrupo;
var anotaciones;
//Mediante Ajax obtenemos como maximo las primeras 200 anotaciones (200 es el limite que podemos obtener en una llamada)
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        anotaciones= JSON.parse(this.responseText);
    }
};
xhttp.open("GET", "https://hypothes.is/api/search?group="+group+"&limit=200&order=asc", false);
xhttp.setRequestHeader("Authorization", "Bearer 6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA");
xhttp.send();

var numAnotacionesTotal= anotaciones.total; //Anotaciones totales
var numAnotacionesAcumuladas= anotaciones.rows.length; //Anotaciones obtenidas en la primera llamada
var anotaciones=anotaciones.rows; //Nos quedamos solo con las anotaciones (Quitamos el total)
while (numAnotacionesTotal!=numAnotacionesAcumuladas){
    var offset=numAnotacionesAcumuladas; //Numero de anotaciones a ignorar
    obtenerAnotacionesAjax(offset);
}

//Funcion que obtiene las anotaciones (como maximo 200) ignorando las primeras n anotaciones (offset) del grupo actual
function obtenerAnotacionesAjax(offset){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var anotacionesResto= JSON.parse(this.responseText);
            anotaciones=anotaciones.concat(anotacionesResto.rows); //Añadimos las nuevas anotaciones a las que teniamos
            numAnotacionesAcumuladas=numAnotacionesAcumuladas+anotacionesResto.rows.length; //Actualizamos el numero de anotaciones obtenidas hasta el momento
        }
    };
    xhttp.open("GET", "https://hypothes.is/api/search?group="+group+"&offset="+offset+"&limit=200&order=asc", false);
    xhttp.setRequestHeader("Authorization", "Bearer 6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA");
    xhttp.send();
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

//Devuelve TRUE si el array de tags tiene longitud 2 y la primera es la nota y la segunda la la pregunta. Estos corresponden a los criterios de rubrica que se crean al principio
function filtradoTags2(tags) {
    return (tags.length==2) && tags[0].includes("mark") && tags[1].includes("isCriteriaOf");
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
                'resultado': (normalizar(anotacionesGrupo, _.sumBy(preguntas, 'nota')) >= 5) ? "Aprobado" : "Suspenso"
            })).value();
    }
    if (grupo=="78AJ6wx7"){
        resultadoFinalAlumnos=notas3Examen;
    } else if (grupo=="YjymyPqK"){
        resultadoFinalAlumnos=notas4Examen;
    }
    return resultadoFinalAlumnos;
}
