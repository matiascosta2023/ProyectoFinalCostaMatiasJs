// Declaraciones
let accion
let nombre;
let documento;
let tipoDocumento;
let tipoDocumentoAux;
let tipoSocio = '';
let socio;
let continuar;
let continuarCheck;
let cantCuotas;
let idCuota;
let nroCuota;
let importe = 0;
let contador = 0;
let ciBusqueda;
let encontroSocio;
let arrayCuotas = [];
let clavesObtenidas = [];


//////SECCION CREACION DE USUARIO
//////SECCION CREACION DE USUARIO


///Funcion para validacion y asignacion tipoSocio + importe

function obtenerTipoSocio (tipoSocio){
    console.log('Obteniendo TipoSocio del servidor...');
    switch (tipoSocio) {
        case '1':
            importe = 500;
            socio = 'Básico';
            break;
        case '2':
            importe = 800;
            socio = 'Extra';
            break;
        case '3':
            importe = 1000;
            socio = 'Plus';
            break;
        default: 
            alert ('El tipo de socio ingresado no es válido');
    }
}

/// Funcion para validacion y asignacion tipoDocumento

function obtenerTipoDocumento (tipoDocumento){
    if (tipoDocumento == 1){
        tipoDocumentoAux = 'DNI';
    } else if (tipoDocumento == 2){
        tipoDocumentoAux = 'Pasaporte'
    } else {
        alert('Ingrese un documento válido');
    }
}

///Funcion Validacion nombre

function validarNombre (nombre){
    const alertaNombre = document.getElementById('alertaNombre');
    alertaNombre.classList.add ('alertaNombre');
    alertaNombre.classList.remove ('warnings-nombre');
    const bordeNombre = document.getElementById('nombre');
    bordeNombre.classList.remove('bordeNombre');
    if (nombre.length < 4){
        console.log ("el largo del nombre debe ser mayor a 3");        
        alertaNombre.classList.remove ('alertaNombre');
        alertaNombre.classList.add ('warnings-nombre');
        bordeNombre.classList.add ('bordeNombre');
        ///se setea continuar en false para no crear el objeto si no valida
        continuar = 'no';
    }
}

///funcion que busca el documento ingresado y de existir lo agrega a un array con claves

function buscarClave (claveDocumento){
    console.log('Buscando coincidencia de Socio...');
    clavesObtenidas = [];
    for (let i=0; i < localStorage.length; i++){
        let claveIn = localStorage.key(i);
        if (claveIn.includes(claveDocumento)){
            clavesObtenidas.push(claveIn);
        }
    }
}

///Funcion Validacion documento

function validarDocumento (documento){
    const alertaNombre = document.getElementById('alertaDocumento');
    alertaNombre.classList.add ('alertaDocumento');
    alertaNombre.classList.remove ('warnings-documento');
    const bordeNombre = document.getElementById('documento');
    bordeNombre.classList.remove('bordeDocumento');
    if (documento.length < 4){
        console.log ("el largo del documento debe ser mayor a 3");        
        alertaNombre.classList.remove ('alertaDocumento');
        alertaNombre.classList.add ('warnings-documento');
        bordeNombre.classList.add ('bordeDocumento');
        ///se setea continuar en false para no crear el objeto si no valida
        continuar = 'no';
    } else {
        //se valida si el socio ya existe
        buscarClave(documento);
        if (clavesObtenidas.length > 0){
            continuar = 'no';
            console.log('El socio ya existe');
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El socio ya existe!',
            }) 
        } else {
            console.log('Ok..No se encontraron coincidencias');
        }
    }
}

//Funcion que muestra creacion OK del socio

function creacionOK(creacionSocio){   
    console.log('Socio creado correctamente');
    creacionSocio.classList.remove('creacionNoOK');
    creacionSocio.classList.add('creacionOK');
}

//Funcion para guardar el objeto en localStorage

function guardarObjeto (idCuota, objeto){
    let clave = idCuota;    
    console.log (`Guardando cuota clave ${clave}...`);
    let objetoJSON =JSON.stringify(objeto);
    localStorage.setItem(clave, objetoJSON);
    console.log('Cuota guardada correctamente');
}


//Funcion submit que tomará los datos del formulario para armar las cuotas

function submit (e){
    console.log('Se seleccionó crear socio');
    e.preventDefault();
    //Seteamos continuar en si para que se guarde el socio en el storage
    continuar = 'si';
    //Obtenemos los datos del formulario
    tipoSocio = document.getElementById('tipoSocio').value;
    obtenerTipoSocio (tipoSocio);
    tipoDocumento = document.getElementById('tipoDocumento').value;
    obtenerTipoDocumento (tipoDocumento);
    cantCuotas = document.getElementById('cantCuotas').value;    
    //Se validan los datos
    documento = document.getElementById('documento').value
    validarDocumento (documento);
    if (continuar != 'no'){
        nombre = document.getElementById('nombre').value;
        validarNombre(nombre);
    }
    const creacionSocio = document.getElementById('creacionSocio');
    creacionSocio.classList.add('creacionNoOK');
    creacionSocio.classList.remove('creacionOK');
    //Se crea el socio y las cuotas
    if(continuar !== 'no'){
        creacionOK(creacionSocio);
        for (i=1 ; i<= cantCuotas; i++){
            nroCuota = i;
            cuotaPaga = false;
            idCuota = documento + '_' + nroCuota
            const cuotaSocio1 = new CuotaSocio (nombre, tipoDocumentoAux, documento, socio, importe, nroCuota, cuotaPaga, idCuota);
            console.log (`Cuota creada:`);
            console.log(cuotaSocio1);
            guardarObjeto(idCuota, cuotaSocio1);
        }
        console.log('Se han guardado todas las cuotas');
        Toastify({
            text: "Socio Creado",
            duration: 2000,
            close: true,
            gravity: 'bottom',
            stopOnFocus: true,
            onClick: function (){
                Swal.fire({
                    position: 'center',
                    title: `Se creó el socio ${documento}`,
                    icon: 'info',
                    timer: 2000,
                    showConfirmButton: false,
                });
            }        
        }).showToast();    
    }
    formulario.reset ();
}

const boton = document.querySelector('#btnSubmit');
boton.addEventListener ('click',submit);




////////SECCION BUSQUEDA DE USUARIO
////////SECCION BUSQUEDA DE USUARIO
////////SECCION BUSQUEDA DE USUARIO



///funcion que crea el HTML mostrando el listado de cuotas a pagar

function dibujarTabla (array){
    //cambio de clases
    const cuotasID = document.getElementById('cuotasID');
    cuotasID.innerHTML= ``;
    let cuotasListado = document.getElementById('cuotasListado');
    cuotasListado.classList.add('cuotasListadoNo');
    cuotasListado.classList.remove('cuotasListado')
    if (array.length === 0){
        //sin coincidencias no dibuja tabla
        console.log('Se dibuja en tabla que no hay coincidencia');
        let sinCuotas = document.getElementById('sinCuotas');
        sinCuotas.classList.remove ('sinCuotasNo');
        sinCuotas.classList.add ('sinCuotas');
    } else {
        //con coincidencias dibuja tabla
        console.log('Se dibuja tabla');
        sinCuotas.classList.add ('sinCuotasNo');
        sinCuotas.classList.remove ('sinCuotas');
        cuotasListado.classList.remove('cuotasListadoNo');
        cuotasListado.classList.add('cuotasListado');
        array.forEach((item) => {        
            ////////Dibuja boton a pagar si esta en false y pago si esta en false
            if (item.cuotaPaga === true){
                cuotasID.innerHTML = cuotasID.innerHTML + 
                `
                <tr>
                    <th scope="row">${item.nroCuota}</th>
                    <td>${item.documento}</td>
                    <td>${item.nombre}</td>
                    <td>${item.socio}</td>
                    <td>${item.importe}</td>
                    <td class = "cuota-paga">PAGO</td>    
                <tr>
                `;
            }else {
                cuotasID.innerHTML = cuotasID.innerHTML + 
                `
                <tr>
                    <th scope="row">${item.nroCuota}</th>
                    <td>${item.documento}</td>
                    <td>${item.nombre}</td>
                    <td>${item.socio}</td>
                    <td>${item.importe}</td>
                    <td><button type="button" class="btn btn-outline-danger" id="${item.documento}_${item.nroCuota}">PAGAR</button></td> 
                <tr>
                `;  
            }
        })
    }
    console.log('Tabla dibujada');
}


//FUNCION PARA PAGAR CUOTA UNA VEZ CREADOS LOS BOTONES

function pagarCuota(event){
    let botonE = event.target;
    let botonId = botonE.id;
    // si se presiona un boton recorre todo el array y busca el boton apretado
    for (i = 0; i < arrayCuotas.length; i++){
        if((arrayCuotas[i].idCuota) === (botonId)){
            //Se cambia el estado a true para identificar que se pago la cuota
            console.log(`Pagando cuota ${i}...`);
            arrayCuotas[i].cuotaPaga = true;
            objeto = arrayCuotas[i];
            console.log(arrayCuotas[i]);
            console.log('Cuota paga');
            //Se pushea la nueva cuota paga al local storage
            guardarObjeto (botonId, objeto);
            //Alerta de Pago
            Swal.fire({
                title: `Pagaste la cuota número ${objeto.nroCuota}`,
                icon: 'success'
            }).then(()=> {
                Toastify({
                    text: "Cuota Paga",
                    duration: 2000,
                    close: true,
                    gravity: 'bottom',
                    stopOnFocus: true,
                    onClick: function (){
                        Swal.fire({
                            position: 'center',
                            title:`Socio ${objeto.documento}` ,
                            text: `Pagaste la cuota número ${objeto.nroCuota}`,
                            icon: 'info',
                            timer: 3000,
                            showConfirmButton: false,
                        });
                    }        
                }).showToast();
            });
        } 
    }
    //Se presiona de nuevo el boton para dibujar nuevamente la tabla con los cambios
    btnBuscarUsuario.click();
}


//FUNCION QUE VALIDA EL DOCUMENTO QUE SE INGRESA PARA LA BUSQUEDA

function validarClaveDocumento (clave){
    const bordeDocumento = document.getElementById('claveDocumento');
    bordeDocumento.classList.remove('bordeDocumento');
    if (clave.length < 4){
        console.log ("El largo del documento debe ser mayor a 3");        
        bordeDocumento.classList.add ('bordeDocumento');
        ///se setea continuar en false para no crear el objeto si no valida
        continuarCheck = 'no';
    }
}

///FUNCION PARA BUSCAR USUARIOS
function buscarUsuario (e2){
    //seteamos las condiciones iniciales
    continuarCheck = 'si';
    e2.preventDefault();
    arrayCuotas = [];
    console.log('Se seleccionó buscar socio')
    //obtenemos el documento ingresado
    let claveDocumento = document.getElementById('claveDocumento').value;
    validarClaveDocumento(claveDocumento);
    console.log(`Documento leido: ${claveDocumento}`);    
    if (continuarCheck == 'no'){
        console.log('Se aborta busqueda');
    }else {
        buscarClave(claveDocumento);
        console.log('Cuotas encontradas:');
        console.log(clavesObtenidas);
        /// recorremos el array con las calves encontradas y obtendremos los objetos JSON del localStorage
        console.log('Generando objeto cuotas...')
        for (let i = 0; i < clavesObtenidas.length; i++){
            let claveOut = clavesObtenidas[i];
            let objetoJSON = localStorage.getItem(claveOut);
            cuotaSocio2 = JSON.parse(objetoJSON);
            arrayCuotas.push(cuotaSocio2);
        }
        //ordenamos las cuotas
        arrayCuotas.sort ((item1,item2) => {return item1.nroCuota - item2.nroCuota})
        console.log('Objeto cuotas:');
        console.log(arrayCuotas);     
        ///Escribimos el HTML agregando el listado y los botones
        dibujarTabla(arrayCuotas);
        //Se obtienen todos los botones generados para poder escucharlos para cuando se paguen
        const botones = document.querySelectorAll('.btn-outline-danger');
        botones.forEach((boton) => {
        boton.addEventListener('click', pagarCuota);        
        });
    }
}
///BOTON BUSCAR USUARIO
const btnBuscarUsuario = document.querySelector('#btnBuscarUsuario');
btnBuscarUsuario.addEventListener('click', buscarUsuario);



///BOTON LOGIN ADMIN PARA ELIMINAR BASE
const botonAdmin = document.getElementById('btnAdmin');
botonAdmin.addEventListener('click', () => {
    console.log('Se seleccionó Vaciar Socios');
    //Obtenemos el listado de administradores
    console.log('Obteniendo usuarios adminsitradores...');
    fetch('./js/administradores.json')
        .then((response) => {
            if (response.ok) {
                // si la respuesta es válidaconvierto los objetos de json a JS
                console.log('Se obtuvo el listado de administradores correctamente:');
                return response.json();
            } else {
                throw new Error('Ocurrió un error al conectarse con el servidor ' + response.status);
            }
        })
        .then((administradores) => {
            console.log(administradores);
            usuariosAdmin = administradores;
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                text: 'En este momento no se puede procsesar la información, reintente en unos minutos',
            })
        });
    Swal.fire({
        title: 'Vaciar Socios',
        text: 'Para vaciar la lista de socios debe contar con permisos administrativos, ingrese su usuario para continuar.',
        inputPlaceholder: 'Usuario',
        input: 'text',
        confirmButtonText: 'Enviar' ,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#FF0000',
        background: 'rgba(182, 153, 117)',
        color: 'black',
    }).then((result) => {
        if (result.isConfirmed){  
            ///Ingresa usuario y lo valida
            const validarUsuario = usuariosAdmin.find (admin => admin.usuarioA == result.value);
            if (validarUsuario){              
                ///Si es válido pide password
                console.log('Usuario válido');
                Swal.fire({
                    title: 'Login de Administrador',
                    text: 'Ingrese su contraseña para vaciar la lista de socios',
                    inputPlaceholder: 'Password',
                    input: 'password',
                    confirmButtonText: 'Enviar' ,
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    cancelButtonColor: '#FF0000',
                    background: 'rgba(182, 153, 117)',
                    color: 'black',
                }).then ((result) => {
                    if (result.isConfirmed){
                        //Ingresa password y la valida                        
                        const validarPassword = usuariosAdmin.find (admin => admin.passwordA == result.value);
                        if (validarPassword){
                            //Si válida preguntamos si quiere borrar el usuario
                            console.log('Password válida');
                            Swal.fire ({
                                title: `Acceso correcto! \n Bienvenido ${validarUsuario.usuarioA}`,
                                icon: 'success',
                                showDenyButton: true,
                                confirmButtonText: 'SI',
                                denyButtonText: `NO`,     
                                timer: 30000,
                                timerProgressBar: true,
                                html: `¿Desea eliminar la base de usuarios? \n La ventana se cerrará en <b>30</b> segundos`,
                                background: 'rgba(182, 153, 117)',
                                color: 'black',
                                iconColor: 'darkgreen',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    //Vacia la lista de usuarios
                                    localStorage.clear();
                                    Swal.fire('Usuarios eliminados', '', 'success').then(() => {location.reload()})
                                    console.log('Se eliminan los usuario');
                                } else if (result.isDenied) {
                                    //Cancela el vaciado
                                    Swal.fire('Operación cancelada', '', 'error')
                                    console.log('Cancela eliminación de usuarios');
                                }
                            })
                        } else {
                            console.log('Ingreso de contraseña fallida');
                            Swal.fire({                                
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Contraseña Incorrecta',
                            })                            
                        }
                    }
                })
            } else {
                //Si es inválido, muestra error
                console.log('Usuario inválido')
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Usuario Incorrecto',
                })
            }
        }
    })
})