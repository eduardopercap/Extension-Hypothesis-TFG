/////////////////// Funciones para crear el diagrama de dispersion ////////////////////////

function obtenerAnotacionesScatter() {
    // Filtramos las anotaciones para obtener solo las que tienen 2 tags -> "isCriteriaOf" y "mark"
    var anotFiltradas = _.filter(anotaciones, (anotacion) => (filtradoTags(anotacion.tags)));

//A raiz de las anotaciones creamos una lista de objetos que contienen la uri del alumno, una pregunta y la nota obtenida. Pueden existir objetos repetidos ya que para varias preguntas existen varias anotaciones
    var preguntasAlumnosRep = _.map(anotFiltradas, (anotacion) => ({
        'uri': anotacion.uri,
        'pregunta': anotacion.tags[0].slice(18),
        'nota': parseInt(anotacion.tags[1].slice(10))
    }));
//Filtramos la lista previamente obtenida para eliminar los objetos repetidos
    var preguntasAlumnos = _.uniqBy(preguntasAlumnosRep, (alumno) =>(alumno.uri.concat(alumno.pregunta)));

//Agrupamos a los alumnos por ejercicio y nota
    var agrupadosEjercicioNota=_.groupBy(preguntasAlumnos,(d)=>d.pregunta+d.nota);

//Agrupamos a los alumnos por su nota media
    var datos=_.map(agrupadosEjercicioNota,(objs, key) => ({
        'pregunta': _.first(objs).pregunta,
        'nota': _.first(objs).nota,
        'numAlumnos': objs.length }));

    dibujarScatterPlot(datos);
}


function dibujarScatterPlot(datos){
    //Margenes
    var margins = {
        "left": 40,
        "right": 35,
        "top": 35,
        "bottom": 30
    };

    //Dimensiones
    var width = 850;
    var height = 500;

    var x = d3.scale.ordinal() //Escala del eje x
        .rangeRoundPoints([0, width - margins.left - margins.right], 1)
        .domain(datos.map(function(d) { return d.pregunta; }));

    var y = d3.scale.linear()  //Escala del eje Y
        .domain(d3.extent(datos, function (d) {
            return d.nota;
        }))
        .range([height - margins.top - margins.bottom, 0]).nice();

    var r= d3.scale.linear() //Escala del radio
        .domain([1, d3.max(datos, function(d) { return d.numAlumnos; })])
        .range([5, 25]);

    //Ejes
    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
    var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);

    d3.select("#dv").remove();
    d3.select("#dvdesplegables").remove(); //Eliminar el SVG si lo hubiera (Se realiza para quitar el grafico que habia)
    d3.select("#svg").remove();
    d3.select("#svgbotonesEliminar").remove();

    var svg = d3.select("#divGrafico") // Crear e insertar el SGV
        .append("svg")
        .attr("id", "svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    var tooltip = d3.tip() //Creacion del tooltip
        .attr('class', 'd3tip')
        .offset([-10, 0])
        .html(function(d) {
            return "Nota "+d.nota+": <br><strong>" + d.numAlumnos+" Alumnos</strong>"; //Mensaje del tooltip
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
        .attr("cx", function(d) { return x(d.pregunta);})
        .attr("cy", function(d) { return y(d.nota); })
        .style("fill", "lightsalmon")
        .on('mouseover', tooltip.show) //Al pasar por encima de una barra aparece el tooltip
        .on('mouseout', tooltip.hide)
    ;

}