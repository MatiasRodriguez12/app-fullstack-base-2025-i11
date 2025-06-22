
class Main implements EventListenerObject{
 
    handleEvent(object: Event): void{
        console.log(object)
        let elementoClick =<HTMLInputElement> object.target;
        
        
        if(elementoClick.id=="btnMostrar" && object.type=="click"){
            // Funcionalidad del boton para mostrar los dispositivosen pantalla
            // Llama a la funcion que consulta los elementos guardados en la base de datos
            this.consultarAlServidor(); 

        } else if(elementoClick.id.startsWith("cb_")){                
            // Funcionalidad para los botones de tipo Switch
            // Actualiza el valor actual del Switch en la base de datos
            console.log("pase por el check!!", elementoClick.checked, elementoClick.id)

            let xmlReq = new XMLHttpRequest();

            xmlReq.onreadystatechange = function() {
                if (xmlReq.readyState === 4) {
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
            // Funcionalidad para los botones de tipo Slider
            // Actualiza el valor actual del Slider en la base de datos
            console.log("pase por el check!!", elementoClick.value, elementoClick.id)

            let xmlReq = new XMLHttpRequest();

            xmlReq.onreadystatechange = function() {
                if (xmlReq.readyState === 4) {
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

            // Funcionalidad para el boton Crear Dispositivos
            // En primer lugar chequea que todos los campos del formulario no esten vacios
            // Luego Chequea que el nombre este disponible (no exista otro dispositivo con el nombre que se quiere crear)
            // Finalmente realiza la solicitud GET para crear el nuevo dispositivo en la base de datos y llama a consultar servidor para refrescar pantalla

            console.log("pase por el check crear!!", elementoClick.value, elementoClick.id)

            const nombre_dispositivo_crear = document.getElementById("nombre_dispositivo_crear") as HTMLInputElement;
            const descripcion_dispositivo_crear = document.getElementById("descripcion_dispositivo_crear") as HTMLInputElement;
            const tipo_dispositivo_crear = document.getElementById("tipo_dispositivo_crear") as HTMLInputElement;

            if (!nombre_dispositivo_crear.value.trim() || !descripcion_dispositivo_crear.value.trim() || !tipo_dispositivo_crear.value) {
                alert("Por favor, completa todos los campos.");
                return;
            }
        
            /*if (tipo_dispositivo_crear.value !== "0" && tipo_dispositivo_crear.value !== "1") {
                alert("Tipo inválido. Debe ser 0 o 1.");
                return;
            }*/

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

            // Funcionalidad para el boton Editar Dispositivos
            // En primer lugar chequea que todos los campos del formulario no esten vacios
            // Luego Chequea que el nombre este disponible (no exista otro dispositivo con el nuevo nombre que se quiere setear) o bien que el nombre siga siendo el mismo que poseia el dispositivo (se quiere actualizar algun otro campo)
            // Finalmente realiza la solicitud GET para actualizar el nuevo dispositivo en la base de datos y llama a consultar servidor para refrescar pantalla
            

            const input_nombre = document.getElementById("nombre_dispositivo") as HTMLInputElement;
            const input_descripcion = document.getElementById("descripcion_dispositivo") as HTMLInputElement;
            const input_tipo = document.getElementById("tipo_dispositivo") as HTMLInputElement;

            let xmlReq = new XMLHttpRequest();

            if (!input_nombre.value.trim() || !input_descripcion.value.trim() || !input_tipo.value) {
                alert("Por favor, completa todos los campos.");
                return;
            }
        
            /*if (input_tipo.value !== "0" && input_tipo.value !== "1") {
                alert("Tipo inválido. Debe ser 0 o 1.");
                return;
            }*/
            this.consultarDisponibilidadNombre(input_nombre.value).then(disponible => {
                
                if (!disponible && input_nombre.value !== input_nombre.placeholder) {
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
                            console.error("Error al actualizar dispositivo:", xmlReq.status, xmlReq.responseText);
                        }
                    }
                };

                xmlReq.open("GET", "http://localhost:8000/devices_update/"+input_nombre.placeholder+"/"+input_nombre.value+"/"+input_descripcion.value+"/"+input_tipo.value, true);
                xmlReq.send();

            });

        }

    }
    
    public consultarDisponibilidadNombre(nombre: string): Promise<boolean> {

        // Funcion que consulta disponibilidad de nombres en la base de datos
        // Realiza una solicitud GET que ejecuta una funcion que consulta si existe algun dispositivo con el nombre que se le pasa por parametro

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

        // Funcion para eliminar un dispositivo
        // Realiza una solicitud GET para eliminar el dispositivo de la base de datos

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

        // Funcion que realiza la consulta al servidor
        // Realiza una solicitud GET para traer todos los dispositivos almacenados en la base de datos
        // Crea dinamicamente un CARD por cada elemento con su simbolo, Switch y botones de Editar y Eliminar correspondiente
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
                                                
                        listado += `<div class="col s12 m6 l4 xl3" >`
                            listado += `<div class="card" style="border-radius: 15px; padding: 10px;background-color:#124580;">`
                                listado += `<div class="row valign-wrapper" style="margin: 0;">`
                    
                                    // Para imagen
                                    listado += `<div class="col s4">`
                                        if (o.type == 0) {
                                            listado += `<i class="material-icons white-text" style="font-size: 32px;">lightbulb</i>`;
                                        } else if (o.type == 1) {
                                            listado += `<i class="material-icons white-text" style="font-size: 32px;">window</i>`;
                                        } else if (o.type == 2) {
                                            listado += `<i class="material-icons white-text" style="font-size: 32px;">tv</i>`;
                                        } else if (o.type == 3) {
                                            listado += `<i class="material-icons white-text" style="font-size: 32px;">music_note</i>`;
                                        } else if (o.type == 4) {
                                            listado += `<i class="material-icons white-text" style="font-size: 32px;">air</i>`;
                                        } else if (o.type == 5) {
                                            listado += `<i class="material-icons white-text" style="font-size: 32px;">ac_unit</i>`;
                                        } else if (o.type == 6) {
                                            listado += `<i class="material-icons white-text" style="font-size: 32px;">power</i>`;
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
                                    if (o.type==0 || o.type==2 || o.type==3 || o.type==6) {
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

                    // Se inicializan los modales y select
                    const modales = document.querySelectorAll<HTMLElement>(".modal");
                    M.Modal.init(modales);
                    
                    const elems = document.querySelectorAll("select");
                    M.FormSelect.init(elems);

                    // Se da un valor inicial a los Switchs de cada elemento y se registra en Listener
                    for (let o of devices) {
                        if(o.type==0 || o.type==2 || o.type==3 || o.type==6){
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

                    // Se agrega los Listener de los botones de Editar y Eliminar correspondientes a cada elemento
                    for (let o of devices) {
                        const boton_editar = document.getElementById("Button_edit_" + o.id);
                        const input_nombre = document.getElementById("nombre_dispositivo") as HTMLInputElement;
                        const input_descripcion = document.getElementById("descripcion_dispositivo") as HTMLInputElement;
                        const input_tipo = document.getElementById("tipo_dispositivo") as HTMLInputElement;
                        
                        boton_editar?.addEventListener("click", () => {
                            // Campos del formulario de Edicion de elemento
                            // Los placeholder siempre contienen el nombre y descripción actual del dispositivo
                            // Los inputs se inicializan con un string vacio
                            // El select se inicializa con el tipo actual del dispositivo
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
    
    // Se crea el objeto Main principal
    let main: Main = new Main();
    
    // Se inicializan los modales
    const modales = document.querySelectorAll<HTMLElement>(".modal");
    M.Modal.init(modales);

    const elems = document.querySelectorAll("select");
    M.FormSelect.init(elems);

    // Se agregan los Listener des boton mostrar dispositivos, y los botones Crear y Eliminar dispositivo
    let btnM = document.getElementById("btnMostrar");
    let btn_create = document.getElementById("btnCrearDispositivo");
    let btn_delete = document.getElementById("btnActualizarDispositivo");

    btnM.addEventListener("click", main);
    btn_create.addEventListener("click", main);
    btn_delete.addEventListener("click", main);     
   
});

