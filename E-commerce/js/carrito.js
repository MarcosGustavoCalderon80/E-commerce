document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("tbody");
  const importeTotalCarrito = document.querySelector("#importeTotalCarrito");
  const btnComprar = document.querySelector("#btnComprar");
  const carrito = JSON.parse(localStorage.getItem("carritoCompras"))?? [];
  
  //CARGAS DE LOCALSTORGES PARA CARRITO Y HISTORIAL
  function completarCompra() {
    let carritoActual = JSON.parse(localStorage.getItem("carritoCompras"));
    
    if (carritoActual && carritoActual.length > 0) {
      const historial = JSON.parse(localStorage.getItem("historialCompras")) || [];
      
      const carritoConFechas = carritoActual.map(item => ({...item, fecha: new Date().toLocaleDateString() }));
      historial.push(...carritoConFechas);
      
      localStorage.setItem("historialCompras", JSON.stringify(historial));
      
      localStorage.setItem("carritoCompras", JSON.stringify([])); 
    }
  }
  function calcularTotalCarrito() {
    if (carrito.length > 0) {
      let montoTotalCarrito = carrito.reduce((acc, prod) => acc + prod.precio, 0);
      importeTotalCarrito.textContent = `$ ${montoTotalCarrito.toLocaleString("es-AR")}`;
    } else {
      importeTotalCarrito.textContent = "$ 0.00"; 
    }
  };
  function armarTablaCarrito(producto) {
    return `<tr>
                <td><h5 class ="art">Art.:${producto.id}</h5></td>
                <td><img src="${producto.imagen}" alt="${producto.nombre}" class="imagen"/></td>
                <td><h5 class="nombre">${producto.nombre}</h5>
                <p class="descripcion">${producto.descripcion}</p></td>
                <td><h5 class="Total">$ ${producto.precio}</h5></td>
                <td><button class="btn-eliminar" data-id="${producto.id}">Eliminar</button></td>
            </tr>`;
  };
  function cargarProductosDelCarrito() {
    tableBody.innerHTML = "";
    if (carrito.length > 0) {
      carrito.forEach((producto) => (tableBody.innerHTML += armarTablaCarrito(producto)));
      calcularTotalCarrito();
      
      tableBody.addEventListener("click", function (event) {
        if (event.target.matches(".btn-eliminar")) {
          const idProducto = event.target.dataset.id;
          eliminarProducto(event); 
        }
      });
    } else {
      const mjeCarritoVacio = document.getElementById("mjeCarritoVacio");
      mjeCarritoVacio.style.display = "block";
      Swal.fire({
        title: "El carrito está vacío.",
        text: "Vuelve al inicio para realizar una compra!",
        icon: "question"
      });
    }
  };
  cargarProductosDelCarrito(); 
  
  //BOTON REALIZAR COMPRA
  btnComprar.addEventListener("click", () => {
    if (carrito != "") {
      Swal.fire({
        icon: "success",
        title:"Su compra se registro con exito!"
      });
      window.scrollTo(0, 0);
    } else {
      const mjeCarritoVacio = document.getElementById("mjeCarritoVacio");
      mjeCarritoVacio.style.display = "block";
      Swal.fire({
        title: "El carrito está vacío.",
        text: "Vuelve al inicio para realizar una compra!",
        icon: "question"
      });
      window.scrollTo(0, 0);
    };
    tableBody.innerHTML = ""; 
    importeTotalCarrito.textContent = "$ 0.00"; 
    carrito.length = 0; 
    carrito.innerHTML = "";
    completarCompra();
    localStorage.removeItem("carritoCompras");
  });

  //ELIMINAR PRODUCTO DEL CARRITO INDIVIDUALMENTE
  function eliminarProducto(event) {
    const idProducto = event.target.dataset.id;
    const productoIndex = carrito.findIndex((prod) => String(prod.id) === String(idProducto));
  
    if (productoIndex!== -1) {
      carrito.splice(productoIndex, 1);
      localStorage.setItem("carritoCompras", JSON.stringify(carrito));
      actualizarCarritoUI();
    } else {
      console.log(`No se encontró el producto con ID: ${idProducto}`);
    }
  }
  function actualizarCarritoUI() {
    tableBody.innerHTML = "";
    if (carrito.length > 0) {
      carrito.forEach((producto) => {
        tableBody.innerHTML += armarTablaCarrito(producto);
      });
    } else {
      const mjeCarritoVacio = document.getElementById("mjeCarritoVacio");
      mjeCarritoVacio.style.display = "block";
      Swal.fire({
        title: "Se eliminaron todos los productos.",
        text: "Vuelve al inicio para realizar una compra!",
        icon: "question"
      });
    }
    calcularTotalCarrito();
  };
  });
  