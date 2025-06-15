
class Main implements EventListenerObject{
    nombre: string = "Matias";
    per: Persona = new Persona("", 3);
    
    
    public mostrarEnConsola( mensaje: string) {
        console.log(mensaje);
    }
    handleEvent(object: Event): void{
        console.log(object)
        let elementoClick =<HTMLInputElement> object.target;

        if(elementoClick.id=="btn_1"){
            let tiluto = document.getElementById("titulo1");
            let texto =<HTMLInputElement> document.getElementById("texto1");
            
            tiluto.innerHTML = " titulo nuevo";
            let nombre = texto.value;
            texto.hidden = true;
            console.log(texto.setAttribute("otro","otro valor!"));
            alert("el usuario es " + nombre);
            let div = document.getElementById("lista");
            div.hidden = true;

            
        } else if(elementoClick.id=="btnMostrar" && object.type=="click"){
            this.consultarAlServidor();                                    
        } else if(elementoClick.id.startsWith("cb_")){                
                         // <input id='cb_1' type="checkbox"> // true //cb_1
            console.log("pase por el check!!", elementoClick.checked, elementoClick.id)

            let xmlReq = new XMLHttpRequest();

            xmlReq.onreadystatechange = function() {
                if (xmlReq.readyState === 4) { // DONE
                    if (xmlReq.status === 200) {
                        console.log("Dispositivo actualizado:", xmlReq.responseText);
                    } else {
                        console.error("Error al actualizar:", xmlReq.status, xmlReq.responseText);
                    }
                }
            };

            xmlReq.open("GET", "http://localhost:8000/devices_update/"+elementoClick.id+"/"+elementoClick.checked, true);
            xmlReq.send();


            //console.log(elementoClick.id.substring(3, elementoClick.id.length));
            //console.log(elementoClick)
            //console.log(elementoClick.getAttribute("miIdBd"));
            //console.log(elementoClick.getAttribute("miIdBd"));
            // TODO para la semana que viene
            // llegar al backend y hacer un update a la tabla devices Con el id y el state;
        }

    }
    
    public consultarAlServidor() {
        let xmlReq = new XMLHttpRequest();

        xmlReq.onreadystatechange = () => {
            if (xmlReq.readyState == 4) {
                if (xmlReq.status == 200) {
                    console.log(xmlReq.responseText);
                    
                    
                    let devices: Array<Device> = JSON.parse(xmlReq.responseText);
                    let div = document.getElementById("lista");
                    div.innerHTML = "";
                    let listado: string = ""
                    listado += `<div class="row">`
                    for (let o of devices) {
                                                
                        listado += `<div class="col s4" >`
                            listado += `<div class="card" style="border-radius: 15px; padding: 10px;background-color:#124580;">`
                                listado += `<div class="row valign-wrapper" style="margin: 0;">`
                    
                                    // Para imagen
                                    listado += `<div class="col s2">`
                                        if (o.type == 0) {
                                            listado += `<img src="./static/images/lightbulb.png" alt="" class="circle responsive-img">`
                                        } else {
                                            listado += `<img src="./static/images/window.png" alt="" class="circle responsive-img">`
                                        }
                                    listado += `</div>`
                    
                                    // Para texto
                                    listado += `<div class="col s5">`
                                        listado += `<span class="title" style="font-weight: bold;color: white;">${o.name}</span><br>`
                                        listado += `<p style="margin: 0;color: white;">${o.description}</p>`
                                    listado += `</div>`
                    
                                    // Para controlador (switch, deslizable)
                                    listado += `<div class="col s5 right-align">`
                                        if (o.state) {
                                            listado += `<div class="switch">
                                                            <label>
                                                                Off
                                                                <input id='cb_${o.id}' miIdBd='${o.id}' checked type="checkbox">
                                                                <span class="lever"></span>
                                                                On
                                                            </label>
                                                        </div>`
                                        } else {
                                            listado += `<div class="switch">
                                                            <label>
                                                                Off
                                                                <input id='cb_${o.id}' type="checkbox">
                                                                <span class="lever"></span>
                                                                On
                                                            </label>
                                                        </div>`
                                        }
                                    listado += `</div>`
                                listado += `</div>`
                            listado += `</div>`
                    
                        listado += `</div>`  // cierra row
                        
                    }
                    listado += `</div>`
                    div.innerHTML = listado;

                    for (let o of devices) {
                        let checkbox = document.getElementById("cb_" + o.id);
                        checkbox.addEventListener("click", this);
                    }
                } else {
                    
                    alert("fallo la consulta");
                }
            }
        }
   
        xmlReq.open("GET", "http://localhost:8000/devices", true);
        xmlReq.send();

    }
    
}

window.addEventListener("load", () => {
   let main: Main = new Main();
     
    //let btn = document.getElementById("btn_1");
   // let o: EventListenerObject = main;
    //btn.addEventListener("click", main);
    let btnM = document.getElementById("btnMostrar");

   // btnM.addEventListener("mouseover", main);
    btnM.addEventListener("click", main);


     let xmlReq = new XMLHttpRequest();

 
    xmlReq.onreadystatechange = () => {
        if (xmlReq.readyState == 4) {
            if (xmlReq.status == 200) {
                console.log(xmlReq.responseText);
            } else {
                alert(xmlReq.responseText);
            }
        }
    }
    let body = { 'nombre': "Matias!"}
    xmlReq.open("POST", "http://localhost:8000/algoInfoBody/", true);

    xmlReq.setRequestHeader("Content-Type", "application/json");

    xmlReq.send(JSON.stringify(body));
        
   
});

