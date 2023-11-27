// Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
}


// Clases



// Funciones
function preguntarPresupuesto() {
    const presupuestoUsurio = prompt('¿Cual es tu presupuesto?');

    console.log(Number(presupuestoUsurio));

    if (presupuestoUsurio === '' || presupuestoUsurio === null || isNaN(presupuestoUsurio) || presupuestoUsurio <= 0) { // isNaN es una función de JS que significar Is Not a Number.
        window.location.reload();
    }
}