
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

            xmlReq.open("GET", "http://localhost:8000/devices_set_state/"+elementoClick.id+"/"+elementoClick.checked, true);
            xmlReq.send();
        }
        else if(elementoClick.id.startsWith("cbs_")){                
  
            console.log("pase por el check!!", elementoClick.value, elementoClick.id)

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

            xmlReq.open("GET", "http://localhost:8000/devices_set_state/"+elementoClick.id+"/"+elementoClick.value, true);
            xmlReq.send();
        }
        else if(elementoClick.id=="btnCrearDispositivo" && object.type=="click"){
            console.log("pase por el check crear!!", elementoClick.value, elementoClick.id)

            const nombre_dispositivo_crear = document.getElementById("nombre_dispositivo_crear") as HTMLInputElement;
            const descripcion_dispositivo_crear = document.getElementById("descripcion_dispositivo_crear") as HTMLInputElement;
            const tipo_dispositivo_crear = document.getElementById("tipo_dispositivo_crear") as HTMLInputElement;

            if (!nombre_dispositivo_crear.value.trim() || !descripcion_dispositivo_crear.value.trim() || !tipo_dispositivo_crear.value) {
                alert("Por favor, completa todos los campos.");
                return;
            }
        
            if (tipo_dispositivo_crear.value !== "0" && tipo_dispositivo_crear.value !== "1") {
                alert("Tipo inválido. Debe ser 0 o 1.");
                return;
            }

            this.consultarDisponibilidadNombre(nombre_dispositivo_crear.value).then(disponible => {
                if (!disponible) {
                    alert("El nombre ya está en uso.");
                    return;
                }
        
                let xmlReq = new XMLHttpRequest();
        
                xmlReq.onreadystatechange = () => {
                    if (xmlReq.readyState === 4) {
                        if (xmlReq.status === 200) {
                            console.log("Dispositivo creado:", xmlReq.responseText);
                            const modalElem = document.getElementById("modal_agregar");
                            const modalInstance = M.Modal.getInstance(modalElem);
                            if (modalInstance) {
                                modalInstance.close();
                            }
        
                            this.consultarAlServidor();
                        } else {
                            console.error("Error al crear dispositivo:", xmlReq.status, xmlReq.responseText);
                        }
                    }
                };

                xmlReq.open("GET", "http://localhost:8000/devices_create/"+nombre_dispositivo_crear.value+"/"+descripcion_dispositivo_crear.value+"/"+tipo_dispositivo_crear.value, true);
                xmlReq.send();

            });
        }
        else if(elementoClick.id=="btnActualizarDispositivo" && object.type=="click"){
            const input_nombre = document.getElementById("nombre_dispositivo") as HTMLInputElement;
            const input_descripcion = document.getElementById("descripcion_dispositivo") as HTMLInputElement;
            const input_tipo = document.getElementById("tipo_dispositivo") as HTMLInputElement;

            let xmlReq = new XMLHttpRequest();

            if (!input_nombre.value.trim() || !input_descripcion.value.trim() || !input_tipo.value) {
                alert("Por favor, completa todos los campos.");
                return;
            }
        
            if (input_tipo.value !== "0" && input_tipo.value !== "1") {
                alert("Tipo inválido. Debe ser 0 o 1.");
                return;
            }
            this.consultarDisponibilidadNombre(input_nombre.value).then(disponible => {
                
                if (!disponible) {
                    alert("El nombre ya está en uso.");
                    return;
                }
                
                xmlReq.onreadystatechange = () => {
                    if (xmlReq.readyState === 4) {
                        if (xmlReq.status === 200) {
                            console.log("Dispositivo creado:", xmlReq.responseText);
                            const modalElem = document.getElementById("modal_edicion");
                            const modalInstance = M.Modal.getInstance(modalElem);
                            if (modalInstance) {
                                modalInstance.close();
                            }
        
                            this.consultarAlServidor();
                        } else {
                            console.error("Error al crear dispositivo:", xmlReq.status, xmlReq.responseText);
                        }
                    }
                };

                xmlReq.open("GET", "http://localhost:8000/devices_update/"+input_nombre.placeholder+"/"+input_nombre.value+"/"+input_descripcion.value+"/"+input_tipo.value, true);
                xmlReq.send();

            });

        }

    }
    
    public consultarDisponibilidadNombre(nombre: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const xmlReq = new XMLHttpRequest();
    
            xmlReq.onreadystatechange = () => {
                if (xmlReq.readyState === 4) {
                    if (xmlReq.status === 200) {
                        try {
                            const respuesta = JSON.parse(xmlReq.responseText);
                            resolve(respuesta.disponible === true);
                        } catch (e) {
                            console.error("Error al parsear JSON:", e);
                            resolve(false);
                        }
                    } else {
                        console.error("Fallo en la consulta:", xmlReq.status);
                        resolve(false);
                    }
                }
            };
    
            xmlReq.open("GET", "http://localhost:8000/devices_check_name/" + nombre, true);
            xmlReq.send();
        });
    }

    public eliminarDispositivo(nombre: string) {
     
            const xmlReq = new XMLHttpRequest();
    
            xmlReq.onreadystatechange = () => {
                if (xmlReq.readyState === 4) {
       
                        if (xmlReq.status == 200) {
                            console.log(xmlReq.responseText);
                        } else {
                            alert(xmlReq.responseText);
                        }

                }
            };
    
            xmlReq.open("GET", "http://localhost:8000/devices_delete/" + nombre, true);
            xmlReq.send();
        
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
                                listado += `<div class="center-align"  style="margin-top: 10px; min-height: 35px;">`
                                    if (!o.type) {
                                        listado += `<div class="switch">
                                                        <label>
                                                            Off
                                                            <input id='cb_${o.id}' miIdBd='${o.id}' checked type="checkbox">
                                                            <span class="lever"></span>
                                                            On
                                                        </label>
                                                    </div>`
                                    } else {
                                        listado += `<div class="row" style="margin-top: 0; margin-bottom: 0;">
                                                      <div class="col s6 offset-s3">
                                                        <div class="range-field" style="margin: 0;" >
                                                          <input type="range" id='cbs_${o.id}' min="0" max="100" />
                                                        </div>
                                                      </div>
                                                    </div>`;
                                    }
                                listado += `</div>`
                                
                                listado += `<div class="center-align" style="margin-top: 10px;">`;
                                        listado += `<a class="waves-effect waves-teal btn-flat modal-trigger" id="Button_edit_${o.id}" style="font-weight: bold;color: white;" href="#modal_edicion">Editar</a>`;
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
                        if(o.type==0){
                            let checkbox = document.getElementById("cb_" + o.id) as HTMLInputElement;
                            if(checkbox){
                                checkbox.checked = !!o.state;
                                checkbox.addEventListener("click", this);
                            }                            
                        }
                        else{
                            let slider = document.getElementById("cbs_" + o.id) as HTMLInputElement;
                            if(slider){
                                slider.addEventListener("input", this);
                                slider.value=o.state.toString();
                            }                            
                        }

                        
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

                        let btn_delete = document.getElementById("Button_delete_" + o.id);

                        btn_delete.addEventListener("click", ()=>{
                            this.eliminarDispositivo(o.name);
                            this.consultarAlServidor();
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
     
    const modales = document.querySelectorAll<HTMLElement>(".modal");
    M.Modal.init(modales);

    const elems = document.querySelectorAll("select");
    M.FormSelect.init(elems);

    let btnM = document.getElementById("btnMostrar");
    let btn_create = document.getElementById("btnCrearDispositivo");
    let btn_delete = document.getElementById("btnActualizarDispositivo");

    btnM.addEventListener("click", main);
    btn_create.addEventListener("click", main);
    btn_delete.addEventListener("click", main);


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

