document.addEventListener("DOMContentLoaded", () => {
  obtenerPlatosDelServidor()
    .then(platos => {
      funcionPlatos(platos);
    })
    .catch(error => {
      console.error("Error al obtener los datos:", error);
    });
});

async function obtenerPlatosDelServidor() {
  try {
    const response = await fetch('./platos.json');
    if (!response.ok) {
      throw new Error("Error al obtener los datos");
    }
    return response.json();
  } catch (error) {
    throw new Error("Error al obtener los datos: " + error.message);
  }
}

function funcionPlatos(platos) {
  let carritoJSON = localStorage.getItem("carrito");
  let carrito = carritoJSON ? JSON.parse(carritoJSON) : [];

  let contenedorPlatos = document.getElementById("contenedorPlatos");
  let btnDesayuno = document.getElementById("btnDesayuno");
  let btnAlmuerzo = document.getElementById("btnAlmuerzo");
  let btnCena = document.getElementById("btnCena");
  let carritoItems = document.getElementById("carritoItems");
  let finalizarCompraButton = document.getElementById("finalizarCompra");

  mostrarPlatos(platos, contenedorPlatos);

  btnDesayuno.addEventListener("click", () => filtrarPlatos(platos, "desayuno", contenedorPlatos));
  btnAlmuerzo.addEventListener("click", () => filtrarPlatos(platos, "almuerzo", contenedorPlatos));
  btnCena.addEventListener("click", () => filtrarPlatos(platos, "cena", contenedorPlatos));

  finalizarCompraButton.addEventListener("click", () => finalizarCompra(carrito));

  function mostrarPlatos(platos, contenedor) {
    contenedor.innerHTML = "";

    platos.forEach(plato => {
      let platoCard = document.createElement("div");
      platoCard.classList.add("plato-card");

      let platoImage = document.createElement("img");
      platoImage.src = plato.rutaImagen;
      platoCard.appendChild(platoImage);

      let platoPrecio = document.createElement("div");
      platoPrecio.classList.add("precio");
      platoPrecio.textContent = `Precio: ${plato.precio} pesos`;
      platoCard.appendChild(platoPrecio);

      let seleccionarButton = document.createElement("button");
      seleccionarButton.textContent = "Seleccionar";
      seleccionarButton.addEventListener("click", () => agregarAlCarrito(plato));
      platoCard.appendChild(seleccionarButton);

      contenedor.appendChild(platoCard);
    });
  }

  function filtrarPlatos(platos, categoria, contenedor) {
    const platosFiltrados = platos.filter(plato => plato.categoria === categoria);
    mostrarPlatos(platosFiltrados, contenedor);
  }

  function agregarAlCarrito(plato) {
    carrito.push(plato);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    Toastify({
      text: "El plato se ha agregado al carrito.",
      duration: 3000
    }).showToast();
  }

  function mostrarCarrito() {
    carritoItems.innerHTML = "";

    carrito.forEach(plato => {
      let carritoItem = document.createElement("div");
      carritoItem.classList.add("carrito-item");

      let nombrePlato = document.createElement("span");
      nombrePlato.textContent = plato.nombre;
      carritoItem.appendChild(nombrePlato);

      carritoItems.appendChild(carritoItem);
    });

    if (carrito.length > 0) {
      finalizarCompraButton.style.display = "block";
    } else {
      finalizarCompraButton.style.display = "none";
    }
  }

  function finalizarCompra(carrito) {
    if (carrito.length === 0) {
      Toastify({
        text: "El carrito de compras está vacío.",
        duration: 3000
      }).showToast();
      return;
    }

    let total = carrito.reduce((accumulator, plato) => accumulator + plato.precio, 0);

    Toastify({
      text: `Gracias por tu compra. Total a pagar: ${total} pesos.`,
      duration: 5000,
      gravity: "top",
      backgroundColor: "#4CAF50",
      stopOnFocus: true
    }).showToast();

    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  }
}

