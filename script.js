var params = {"id": "geoapp","appName": "3d", "width": 1000, "height": 1000, "showToolBar": true, "showAlgebraInput": true, "showMenuBar": true ,"enableCAS": true};
params.appletOnLoad= ()=>console.log("Applet injected",geoapp.evalCommandCAS("f(x):=3x^2"))

var applet = new GGBApplet(params, true);
window.addEventListener("load", function() { 
    applet.inject('ggb-element');
});
const functionForm = document.querySelector(".function-form");
const derivadasCont = document.querySelector(".derivadas-container");

functionForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const fn = e.target.elements.function.value;
    //const fn = "14x^2-2x^3+2y^2+4x*y";
    geoapp.evalCommand(`f(x,y)=${fn}`);
    //derivadas 1er orden CAS
    let derivadaX = await geoapp.evalCommandCAS(`Derivative(${fn},x)`);
    let derivadaY = await geoapp.evalCommandCAS(`Derivative(${fn},y)`);

    

       //derivada 2do orden CAS
    let derivadaXX = await geoapp.evalCommandCAS(`Derivative(${derivadaX},x)`);
    let derivadaYY = await geoapp.evalCommandCAS(`Derivative(${derivadaY},y)`);
    let derivadaXY = await geoapp.evalCommandCAS(`Derivative(${derivadaX},y)`);

    


    //Solve dx y dy de 1er orden igualadas a 0
    let puntosCriticos = await geoapp.evalCommandCAS(`Solve({${derivadaX}=0,${derivadaY}=0},{x,y})`);
    var regex = /x = ([-\d]+), y = ([-\d]+)/g;

    var puntos = [];
    var match;

    while ((match = regex.exec(puntosCriticos)) !== null) {
        var x = parseInt(match[1]);
        var y = parseInt(match[2]);
        puntos.push({ x, y });
    }
    var x1 = puntos[0].x;
    var x2 = puntos[1].x;
    var y1 = puntos[0].y;    
    var y2 = puntos[1].y;

    //sustituir los puntos en la funcion original
    let z1 = await geoapp.evalCommandCAS(`Substitute(${fn},{x=${x1},y=${y1}} )`);
    let z2 = await geoapp.evalCommandCAS(`Substitute(${fn},{x=${x2},y=${y2}} )`);

    console.log("z1",z1);
    console.log("z2",z2);

    //graficar punto 1 
    geoapp.evalCommand(`A=(${x1},${y1},${z1})`);

    //graficar punto 2
    geoapp.evalCommand(`B=(${x2},${y2},${z2})`);

    derivadasCont.innerHTML= `
        <h3>1ra Derivada en X </h3>
        <p>g(x,y)= ${derivadaX}</p>
        <h3>1ra Derivada en Y </h3>
        <p>h(x,y)= ${derivadaY}</p>
        <h3>Derivada en XX </h3>
        <p>g2(x,y)= ${derivadaXX}</p>
        <h3>Derivada en YY </h3>
        <p>h2(x,y)= ${derivadaYY}</p>
        <h3>Derivada en XY </h3>
        <p>g3(x,y)= ${derivadaXY}</p>

        <h3>Puntos Críticos </h3>
        <p>A=(${x1},${y1},${z1})</p>
        <p>B=(${x2},${y2},${z2})</p>

    `;
    console.log("finish")
});