let archivoHTML = window.location.pathname.split('/').pop();

if (archivoHTML == "index.html") {

  async function traerDatos() {
    try {
      let respuesta = await fetch('/js/apiSimulada.json');
      respuesta = await respuesta.json();
      let productosHTML = document.getElementById("productos");

      for (let i = 0; i < respuesta.length; i++) {
        productosHTML.innerHTML += `
        <div class="card" style="width: 18rem;">
          <img src="${respuesta[i].imagen}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${respuesta[i].nombre}</h5>
            <h6 class="card-text mt-3 mb-3">$${respuesta[i].precio}</h6>
            <a href="/pages/producto.html?id=${respuesta[i].id}" class="btn btn-primary">Ver</a>
          </div>
        </div>
        `
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  traerDatos()

} else if (archivoHTML == "categoria.html") {

  let categoria = new URLSearchParams(window.location.search).get("categoria");

  if (categoria == "computacion") {
    document.getElementById("navComputacion").classList.add("active");
  } else if (categoria == "electronica") {
    document.getElementById("navElectronica").classList.add("active");
  } else {
    document.getElementById("navElectrodomesticos").classList.add("active");
  }

  async function traerDatosCategoria() {
    try {
      let respuesta = await fetch('/js/apiSimulada.json');
      respuesta = await respuesta.json();
      let productosCategoriaHTML = document.getElementById("productosCategoria");

      for (let i = 0; i < respuesta.length; i++) {
        if (respuesta[i].categoria == categoria) {
          productosCategoriaHTML.innerHTML += `
          <div class="card" style="width: 18rem;">
            <img src="${respuesta[i].imagen}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${respuesta[i].nombre}</h5>
              <h6 class="card-text mt-3 mb-3">$${respuesta[i].precio}</h6>
              <a href="/pages/producto.html?id=${respuesta[i].id}" class="btn btn-primary">Ver</a>
            </div>
          </div>
          `
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  traerDatosCategoria()

} else if (archivoHTML == "producto.html") {

  async function traerPorductoID() {
    try {
      let productoID = new URLSearchParams(window.location.search).get("id");

      let respuesta = await fetch('/js/apiSimulada.json');
      respuesta = await respuesta.json();
      let productoHTML = document.getElementById("productoID");

      for (let i = 0; i < respuesta.length; i++) {
        if (respuesta[i].id == productoID) {
          productoHTML.innerHTML = `
          <div>  
            <img src="${respuesta[i].imagen}" style="width: 100%" />
            <h3 class="card-title">${respuesta[i].nombre}</h3>
            <h4 class="mt-3 mb-3">$${respuesta[i].precio}</h4>
            <h4 class="mb-3">Color: ${respuesta[i].color}</h4>
            <button id="agregarCarrito" data-id="${respuesta[i].id}" class="btn btn-primary agregarCarrito">Agregar al carrito</button>
          </div>
          <div>
            <h3 class="mt-4 mb-4">Descripción</h3>
            <h4>${respuesta[i].descripción}</h4>
          </div>
          `
        }
      }

      document.getElementById("agregarCarrito").addEventListener("click", () => {
        let idProducto = document.getElementById("agregarCarrito").getAttribute("data-id");

        async function agregarCarritoID() {
          try {
            let respuesta = await fetch('/js/apiSimulada.json');
            respuesta = await respuesta.json();
            respuesta = respuesta.find(objeto => objeto.id == idProducto);

            if (localStorage.getItem("carrito") == null) {
              localStorage.setItem("carrito", JSON.stringify([respuesta]));

            } else {
              let carrito = JSON.parse(localStorage.getItem("carrito"));
              carrito.push(respuesta);
              localStorage.setItem("carrito", JSON.stringify(carrito));
            }
          }
          catch (error) {
            console.error(error);
          }
        }
        agregarCarritoID()
      })
    }
    catch (error) {
      console.error(error);
    }
  }

  traerPorductoID()

} else {
  if (localStorage.getItem("carrito") == null) {
    document.getElementById("carritoHTML").innerHTML = `<h1 class="mt-4">No hay ningún producto en el carrito</h1>`;
  } else {
    let carritoTraido = JSON.parse(localStorage.getItem("carrito"));

    if (carritoTraido.length === 0) {
      document.getElementById("carritoHTML").innerHTML = `<h1 class="mt-4">No hay ningún producto en el carrito</h1>`;
    } else {
      document.getElementById("carritoHTML").innerHTML = "";

      for (let i = 0; i < carritoTraido.length; i++) {
        document.getElementById("carritoHTML").innerHTML += `
      <div class="card" style="width: 18rem;">
        <img src="${carritoTraido[i].imagen}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${carritoTraido[i].nombre}</h5>
          <p class="card-text"> ${carritoTraido[i].precio} </p>
          <button data-id="${carritoTraido[i].id}" class="eliminarProducto btn btn-primary">Eliminar</button>
        </div>
      </div>
    `;
      }

      let botonesEliminar = document.getElementsByClassName("eliminarProducto");
      for (let i = 0; i < botonesEliminar.length; i++) {
        botonesEliminar[i].removeEventListener("click", eliminarProducto);
      }

      for (let i = 0; i < botonesEliminar.length; i++) {
        botonesEliminar[i].addEventListener("click", eliminarProducto);
      }
    }
  }

  function eliminarProducto(event) {
    let idProducto = event.target.getAttribute("data-id");

    let carrito = JSON.parse(localStorage.getItem("carrito"));

    let indice = carrito.findIndex(item => item.id == idProducto);

    if (indice !== -1) {
      carrito.splice(indice, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));

      actualizarCarrito();
    }
  }

  function actualizarCarrito() {
    let carritoTraido = JSON.parse(localStorage.getItem("carrito"));
    let carritoHTML = document.getElementById("carritoHTML");

    if (carritoTraido.length === 0) {
      carritoHTML.innerHTML = `<h1 class="mt-4">No hay ningún producto en el carrito</h1>`;
    } else {
      carritoHTML.innerHTML = "";
      for (let i = 0; i < carritoTraido.length; i++) {
        carritoHTML.innerHTML += `
      <div class="card" style="width: 18rem;">
        <img src="${carritoTraido[i].imagen}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${carritoTraido[i].nombre}</h5>
          <p class="card-text"> ${carritoTraido[i].precio} </p>
          <button data-id="${carritoTraido[i].id}" class="eliminarProducto btn btn-primary">Eliminar</button>
        </div>
      </div>
    `;
      }

      let botonesEliminar = document.getElementsByClassName("eliminarProducto");
      for (let i = 0; i < botonesEliminar.length; i++) {
        botonesEliminar[i].removeEventListener("click", eliminarProducto);
        botonesEliminar[i].addEventListener("click", eliminarProducto);
      }
    }
  }
}