let nombre;
let tiradas = 0;
let recordTiradas = localStorage.getItem("recordTiradas");

function introducirNombre() {
  nombre = document.getElementById("name").value.trim();

  if (nombre.length < 4) {
    alert("El nombre debe tener 4 o más letras");
  } else if (/\d/.test(nombre)) {
    alert("Números no permitidos en el nombre");
  } else {
    document.getElementById("mensaje-bloque").innerHTML = `A luchar heroe: ${nombre}`;
    document.getElementById("jugar-btn").disabled = false;
  }
}

function jugar() {
  document.getElementById("name-form").style.display = "none";
  document.getElementById("jugar-btn").style.display = "none";
  document.getElementById("tirar-btn").style.display = "block";
  document.getElementById("dado-img").src = "dado1.jpg";
  inicializarTabla();
  document.getElementById("tirar-btn").disabled = false; // Agregado para habilitar el botón Tirar dado
}

function inicializarTabla() {
  const table = document.getElementById("game-table");

  for (let i = 0; i < 10; i++) {
    const row = table.insertRow();

    for (let j = 0; j < 10; j++) {
      const cell = row.insertCell();
      cell.onclick = function() { moverHeroe(i, j); };
    }
  }

  table.rows[0].cells[0].classList.add("hero");
  table.rows[9].cells[9].classList.add("cofre");
}

function tirarDado() {
  const dadoImg = document.getElementById("dado-img");
  const numeroDado = Math.floor(Math.random() * 6) + 1;
  dadoImg.src = `dado${numeroDado}.jpg`;

  actualizarContador();
  actualizarMovimientos(numeroDado);
}

function actualizarContador() {
  tiradas++;
  document.getElementById("mensaje-bloque").innerHTML = `Tiradas realizadas: ${tiradas}`;
}

function actualizarMovimientos(numero) {
    const table = document.getElementById("game-table");
    const heroCell = buscarHeroe();
    const cofreCell = [9, 9]; // Coordenadas de la celda del cofre
  
    // Restablecer todas las celdas a suelo.jpg y eliminar la clase "mover"
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        table.rows[i].cells[j].classList.remove("mover");
        table.rows[i].cells[j].style.backgroundImage = 'url("suelo.jpg")';
      }
    }
  
    // Resaltar las celdas a las que puede moverse el héroe en horizontal
    for (let j = Math.max(heroCell[1] - numero, 0); j <= Math.min(heroCell[1] + numero, 9); j++) {
      if (Math.abs(heroCell[1] - j) === numero) {
        table.rows[heroCell[0]].cells[j].classList.add("mover");
        table.rows[heroCell[0]].cells[j].style.backgroundImage = 'url("mover.jpg")';
      }
    }
  
    // Resaltar las celdas a las que puede moverse el héroe en vertical
    for (let i = Math.max(heroCell[0] - numero, 0); i <= Math.min(heroCell[0] + numero, 9); i++) {
      if (Math.abs(heroCell[0] - i) === numero) {
        table.rows[i].cells[heroCell[1]].classList.add("mover");
        table.rows[i].cells[heroCell[1]].style.backgroundImage = 'url("mover.jpg")';
      }
    }
  
    // Asegurar que la celda del héroe no tenga la imagen de movimiento
    table.rows[heroCell[0]].cells[heroCell[1]].style.backgroundImage = 'url("heroe.jpg")';
  
    // Asegurar que la celda del cofre no tenga la imagen de movimiento
    table.rows[cofreCell[0]].cells[cofreCell[1]].style.backgroundImage = 'url("cofre.jpg")';
  }
  
  
  

  function moverHeroe(i, j) {
    const table = document.getElementById("game-table");
    const heroCell = buscarHeroe();
  
    if (table.rows[i].cells[j].classList.contains("mover")) {
      // Restablecer la celda anterior a suelo.jpg y eliminar la clase "mover"
      table.rows[heroCell[0]].cells[heroCell[1]].classList.remove("hero");
      table.rows[heroCell[0]].cells[heroCell[1]].style.backgroundImage = 'url("suelo.jpg")';
  
      // Mover al héroe a la nueva celda
      table.rows[i].cells[j].classList.add("hero");
      table.rows[i].cells[j].classList.remove("mover");
      table.rows[i].cells[j].style.backgroundImage = 'url("heroe.jpg")';
  
      if (table.rows[i].cells[j].classList.contains("cofre")) {
        alert(`¡Héroe, has llegado al cofre en ${tiradas} tiradas!`);
        gestionarRecord();
        reiniciarJuego();
      }
    }
  }

function buscarHeroe() {
  const table = document.getElementById("game-table");

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (table.rows[i].cells[j].classList.contains("hero")) {
        return [i, j];
      }
    }
  }

  return null;
}

function gestionarRecord() {
  if (!recordTiradas || tiradas < recordTiradas) {
    localStorage.setItem("recordTiradas", tiradas);
    alert(`¡Héroe, has establecido un récord de tiradas con ${tiradas} tiradas!`);
  } else {
    alert(`Récord no superado. El actual récord es ${recordTiradas} tiradas.`);
  }
}

function reiniciarJuego() {
  tiradas = 0;
  recordTiradas = localStorage.getItem("recordTiradas");
  document.getElementById("mensaje-bloque").innerHTML = "";
  document.getElementById("jugar-btn").disabled = true;
  document.getElementById("name-form").style.display = "block";
  document.getElementById("jugar-btn").style.display = "block";
  document.getElementById("tirar-btn").style.display = "none";
  document.getElementById("dado-img").src = "dado1.jpg";
  document.getElementById("tirar-btn").disabled = true; // Agregado para deshabilitar el botón Tirar dado
  document.getElementById("game-table").innerHTML = "";
}
