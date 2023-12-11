// Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}


// Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        // Extrayendo los valores
        const { presupuesto, restante } = cantidad;

        // Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        // Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar1 en el HTMl
        document.querySelector('.primario').insertBefore(divMensaje, formulario); // insertBefore(QueVamosAInsertar, EnQueParteInsertaremos)

        // Quitar mensaje del HTML
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos) {
        this.limpiarHTML(); // Elimina el HTML previo

        // Iterar sobre los gastos
        gastos.forEach(gasto => {
            const {cantidad, nombre, id} = gasto;

            // Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            console.log(nuevoGasto);


            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> ${cantidad} </span>`;

            //  Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times'; // &times es una entidad de innerHTML por lo que no funcionaria con textContent.
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto); // Recordemos que appendChild() NO borra los registros previos, por lo que es necesaria la función de limpiar.
        });
    }

    limpiarHTML() {
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        // Comprobar 25%
        if( (presupuesto / 4) > restante ) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if( (presupuesto / 2) > restante ) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // Si el total es menor o igual a 0
        if(restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }

}


// Instanciar
const ui = new UI();
let presupuesto;

// Funciones
function preguntarPresupuesto() {
    const presupuestoUsurio = prompt('¿Cual es tu presupuesto?');

    if (presupuestoUsurio === '' || presupuestoUsurio === null || isNaN(presupuestoUsurio) || presupuestoUsurio <= 0) { // isNaN es una función de JS que significar Is Not a Number.
        window.location.reload();
    }

    // Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsurio);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
    e.preventDefault();

    // Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // Validar
    if (nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;

    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no válida', 'error');
        return;
    }

    // Generar un objeto con el gasto
    const gasto = {nombre, cantidad, id: Date.now()}; // nombre y cantidad se deja solo porque se llaman de la misma manera, id se coloca como llave y Date.now como valor porque se nombran diferentes.

    // Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // Mostrar mensaje de confirmación
    ui.imprimirAlerta('Gasto Agregado Correctamente');

    // Imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    // Reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id) {
    // Elimina los gastos del objeto
    presupuesto.eliminarGasto(id);

    // Elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}