document.addEventListener('DOMContentLoaded', () => {
  const divContenedor = document.getElementById("divContenedor");
  const btnCarrito = document.getElementById("carrito"); 
  const inputSearch = document.getElementById("inputSearch");
  const spanCarrito = document.getElementById("productosEnCarrito");
  const clearSearchButton = document.getElementById("clear-search");
  const carrito = JSON.parse(localStorage.getItem("carritoCompras")) ?? [];
  const productos = [];

  //UTILIZACION DE API MOCKAPI
  const URLProductosJSON = "https://667b6177bd627f0dcc926ac6.mockapi.io/productos";

  //CARGAR CARD CON DATOS FORMADOS EN MOCKAPI
  function retornarCardHTML(producto) {
    return `<div class="div-card">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen"/>
                <p class="id">Art. ${producto.id}</p>
                <h5 class="nombre">${producto.nombre}</h5>
                <p class="descripcion">${producto.descripcion}</p>
                <h5 class="precio">$ ${producto.precio}</h5>
                <p class="stock">${producto.stock}</p>
                <button id="${producto.id}" class="button-compra">Comprar</button>
            </div>`;
  };
  function retornarCardError() {
    return `<div class="div-card-error">
                <h2>Se ha producido un error al cargar los productos</h2>
                <h3>Intenta nuevamente en unos instantes...</h3>
            </div>`;
  };
  //PETICION FETCH PARA TRAER PRODUCTOS
  function descargarProductos() {
    fetch(URLProductosJSON)
    .then((response) => response.json())
    .then((datos)=>  productos.push(...datos))
    .then(() => cargarProductos(productos))
    .catch((error) => {
      console.log(error);
      divContenedor.innerHTML = retornarCardError();
    });
  };
  //CARGAR PRODUCTOS EN EL CONTENEDOR
  function cargarProductos(array) {
    if (array.length > 0) {
      divContenedor.innerHTML = "";
      array.forEach((producto) => {
        divContenedor.innerHTML += retornarCardHTML(producto);
      });
      activarEventosClick();
      carrito.length > 0 && actualizarTotalCarrito();
    } 
  };
  function actualizarTotalCarrito() {
    spanCarrito.textContent = carrito.length;
  };
  function activarEventosClick() {
    const botonesAgregar = document.querySelectorAll("button.button-compra");
    if (botonesAgregar.length > 0) {
      botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", () => {
          Toastify({
            text: "El producto se agrego al Carrito",
            duration: 3000,
            newWindow: false,
            close: true,
            gravity: "top", 
            position: "center", 
            stopOnFocus: true, 
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast();
          const productoSeleccionado = productos.find(
            (producto) => producto.id == boton.id
          );
          carrito.push(productoSeleccionado);
          actualizarTotalCarrito();
          localStorage.setItem("carritoCompras", JSON.stringify(carrito));
        });
      });
    }
  };
  descargarProductos(productos);

  btnCarrito.addEventListener("click", (event) => {
    event.preventDefault();
    if (carrito.length > 0) {
      location.href = "./html/carrito.html";
    } else {
      Toastify({
        text: "El carrito está vacío.",
        duration: 3000,
        newWindow: false,
        close: true,
        gravity: "top", 
        position: "center", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #ffa500, #96c93d)",
        },
      }).showToast();
    }
  });
  btnCarrito.addEventListener("mousemove", () => {
    if (carrito.length > 0) {
      btnCarrito.title = "Productos en carrito: " + carrito.length;
    }
  });
  //BUSQUEDA DE PRODUCTOS POR CARACTERES
  clearSearchButton.addEventListener("click", () => {
    inputSearch.value = ""; 
    cargarProductos(productos); 
  });
  
  inputSearch.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (inputSearch.value.trim() === "") {
      cargarProductos(productos);
    } else {
        let resultado = productos.filter((producto) => 
            producto.nombre.toLowerCase().includes(inputSearch.value.toLowerCase())
        );
        if (resultado.length > 0) {
            cargarProductos(resultado);
        } else {
            Toastify({
                text: "No se encontró ningún producto.",
                duration: 3000,
                newWindow: false,
                close: true,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #ffa501, #96c93d)",
                },
            }).showToast();
        }
    }
    localStorage.setItem("ultimaBusqueda", inputSearch.value);
  });
});
