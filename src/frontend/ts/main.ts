
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
                                                
                        listado += `<div class="col s12 m6 l3" >`
                            listado += `<div class="card" style="border-radius: 15px; padding: 10px;background-color:#124580;">`
                                listado += `<div class="row valign-wrapper" style="margin: 0;">`
                    
                                    // Para imagen
                                    listado += `<div class="col s4">`
                                        if (o.type == 0) {
                                            listado += `<img src="./static/images/lightbulb.png" alt="" class="circle responsive-img">`
                                        } else {
                                            listado += `<img src="./static/images/window.png" alt="" class="circle responsive-img">`
                                        }
                                    listado += `</div>`
                    
                                    // Para texto
                                    listado += `<div class="col s8">`
                                        listado += `<span class="title" style="font-weight: bold;color: white;">${o.name}</span><br>`
                                        listado += `<p style="margin: 0;color: white;">${o.description}</p>`
                                    listado += `</div>`
                                listado += `</div>`
                                
                                // Para controlador (switch, deslizable)
                                listado += `<div class="center-align"  style="margin-top: 10px;">`
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
                                
                                listado += `<div class="center-align" style="margin-top: 10px;">`;
                                        listado += `<a class="waves-effect waves-teal btn-flat modal-trigger" id="Button_edit_${o.id}" style="font-weight: bold;color: white;" href="#modal1">Editar</a>`;
                                        listado += `<a class="waves-effect waves-teal btn-flat" id="Button_delete_${o.id}" style="font-weight: bold;color: white;">Eliminar</a>`
                                listado += `</div>`
                            listado += `</div>`
                    
                        listado += `</div>`  
                        
                    }
                    listado += `</div>`
                    
                    div.innerHTML = listado;
                    const modales = document.querySelectorAll<HTMLElement>(".modal");
                    M.Modal.init(modales);
                    
                    const elems = document.querySelectorAll("select");
                    M.FormSelect.init(elems);

                    for (let o of devices) {
                        let checkbox = document.getElementById("cb_" + o.id);
                        checkbox.addEventListener("click", this);
                    }
                    for (let o of devices) {
                        const boton_editar = document.getElementById("Button_edit_" + o.id);
                        const input_nombre = document.getElementById("nombre_dispositivo") as HTMLInputElement;
                        const input_descripcion = document.getElementById("descripcion_dispositivo") as HTMLInputElement;
                        const input_tipo = document.getElementById("tipo_dispositivo") as HTMLInputElement;
                        
                        boton_editar?.addEventListener("click", () => {
    
                            input_nombre.placeholder = o.name;
                            input_nombre.value = ""; 
                            input_descripcion.placeholder = o.description;
                            input_descripcion.value="";
                            input_tipo.value=o.type.toString();
                            M.FormSelect.init(input_tipo);
                          
                        });
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

