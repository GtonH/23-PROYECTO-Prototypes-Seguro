// CONSTRUCTORES

function Seguro(marca, year, tipoSeguro) {
  this.marca = marca;
  this.year = year;
  this.tipoSeguro = tipoSeguro;
}
//REALIZA COTIZACION CON LOS DATOS

Seguro.prototype.cotizarSeguros = function () {
  let cantidad;

  const base = 2000;

  switch (this.marca) {
    case "1":
      cantidad = base * 1.15;
      break;
    case "2":
      cantidad = base * 1.05;
      break;
    case "3":
      cantidad = base * 1.35;
      break;
    default:
      break;
  }

  //LEER EL AÑO
  const diferencia = new Date().getFullYear() - this.year;

  //CADA AÑO QUE LA DIFERECIA EN MAYOR EL COSTO SE REDUCIRA UN 3%

  cantidad -= (diferencia * 3 * cantidad) / 100;

  //SI EL SEG. ES BASICO SE MULTIPLICA POR UN 30% MAS
  //SI EL SEG. ES COMPLETO SE MULTIPLICA POR UN 50% MAS

  if (this.tipoSeguro === "basico") {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }
  return cantidad;
};

function UI() {}

//LLENA LAS OPCIONES DE LOS AÑOS

UI.prototype.llenarOpciones = () => {
  const max = new Date().getFullYear(), // LE ESTAMOS DICIENDO QUE CREE UN CONSTRUCTOR CON LA FECHA ACTUAL DE LA REGION QUE ME ENCUENTRO
    min = max - 20; // LE VA A RESTAR 20

  const selectYear = document.querySelector("#year");

  for (let i = max; i > min; i--) {
    // SI MAX ES 2023 Y ES MAYOR A MIN QUE VAYA RESTANDO UNA ITERACION(SACANDO UN NUMERO)
    let option = document.createElement("option"); // CREAMOS UN ELEMENTO HTML OPTION
    option.value = i; // VA A TENER EL VALOR DE I(MAX) POR CADA ITERACION QUE REALICE
    option.textContent = i; // VA A TENER EL CONTENIDO DEL TEXTO DE CADA ITERACION REALIZADA
    selectYear.appendChild(option); // ESTAMOS AGREGANDO OPTION(ES EL HIJO) A SELECYEAR(ES EL PADRE)
  }
};

// MUESTRA ALERTAS EN PANATALLA
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
  const MOSTRARMENSAJE = document.querySelector("#mostrarMensaje");
  limpiarHTML(MOSTRARMENSAJE);

  const div = document.createElement("div");

  if (tipo === "error") {
    div.classList.add("error");
  } else if (tipo === "correcto") {
    div.classList.add("correcto");
  }

  div.classList.add("mensaje", "nt-10");
  div.style.marginTop = "20px";
  div.textContent = mensaje;

  // INSERTAR EN EL HTML
  MOSTRARMENSAJE.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
};

UI.prototype.mostrarResultado = (seguro, total) => {
  //Crear el resultado

  const { marca, year, tipoSeguro } = seguro;

  switch (marca) {
    case "1":
        textoMarcar = 'Americano'
      break;
    case "2":
        textoMarcar = 'Asiatico'
      break;
    case "3":
        textoMarcar = 'Europeo'
      break;
    default:
      break;
  }

  const div = document.createElement("div");
  div.classList.add("nt-10");
  div.style.marginTop = "20px";

  div.innerHTML = `
    <p class="header">Tu Resumen</p>
    <p class="font-bold">Marca: <span class="font-normal"> ${textoMarcar}</span></p>
    <p class="font-bold">Año: <span class="font-normal"> ${year}</span></p>
    <p class="font-bold">Tipo de Seguro: <span class="font-normal capitalize"> ${tipoSeguro}</span></p>
    <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p>
    
    `;
  const resultado = document.querySelector("#resultado");

  // MOSTRAR SPINNER
  const spinner = document.querySelector("#cargando");
  spinner.style.display = "block";

  setTimeout(() => {
    spinner.style.display = "none"; // SE BORRA EL SPINER
    resultado.appendChild(div); // SE AGREGA EL CONTENIDO DEL DIV QUE CREAMOS CON EL RESULTADO DEL RESUMEN
  }, 3000);
};

function eliminarChild(elemento) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
}

function limpiarHTML(elemento) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
}

//INSTANCIAR IU

const ui = new UI(); // CREAMOS UN NUEVO OBJETO CONSTRUCTOR LLAMADO ui TENIENDO LOS VALORES DE UI

document.addEventListener("DOMContentLoaded", () => {
  ui.llenarOpciones(); // LLENA EL SELECT CON LOS AÑOS QUE VA ITERANDO EL FOR.
});

eventListeners();
function eventListeners() {
  const FORMULARIO = document.querySelector("#cotizar-seguro");
  FORMULARIO.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
  e.preventDefault();

  //LEER LA MARCA SELECCIONADA
  const marca = document.querySelector("#marca").value;
  //LEER EL AÑO SELECCIONADO
  const year = document.querySelector("#year").value;
  //LEER EL TIPO SELECCIONADO
  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  if (marca === "" || year === "" || tipo === "") {
    ui.mostrarMensaje("Todos los campos son obligatorios", "error");
    return;
  }

  ui.mostrarMensaje("Cotizando...", "correcto");

  //OCULTAR LAS COTIZACIONES PREVIAS

  const resultados = document.querySelector("#resultado div");

  if (resultados != null) {
    resultados.remove();
  }

  //INSTANCIAR EL SEGURO

  const seguro = new Seguro(marca, year, tipo);
  const total = seguro.cotizarSeguros();

  // UTILIZAR UN PROTOTYPE QUE COTIZA
  ui.mostrarResultado(seguro, total);
}
