document.addEventListener("DOMContentLoaded", () => {
  const historialDiv = document.getElementById('historialCompras');
  const historialCompras = JSON.parse(localStorage.getItem("historialCompras"))?? [];
  const btnEliminarLS = document.querySelector("#eliminarLS");
  const importeTotalCarrito = document.querySelector("#importeTotalCarrito");
  

  function calcularTotalCarrito() {
    if (historialCompras.length > 0) {
      let montoTotalCarrito = historialCompras.reduce((acc, prod) => acc + prod.precio, 0);
      importeTotalCarrito.textContent = `$ ${montoTotalCarrito.toLocaleString("es-AR")}`;
    } else {
      importeTotalCarrito.textContent = "$ 0.00"; 
    }
  };

  //CARGA DEL HISTORIAL DE COMPRAS
  if (historialCompras.length > 0) {
    const reverseHistorial = historialCompras.reverse(); 
    reverseHistorial.forEach(({ id, fecha, nombre, precio }) => {
      historialDiv.innerHTML += `<p>ID: ${id}, Fecha: ${fecha}, Producto: ${nombre}, Precio: $${precio}.</p>`;
    });
    calcularTotalCarrito();
  } else {
    historialDiv.innerHTML += '<p>No hay compras registradas.</p>';
  };
  //BOTON ELIMINAR HISTORIAL DE COMPRAS
  btnEliminarLS.addEventListener("click", () => {
    // Verifica si hay compras registradas en el localStorage
    if (localStorage.getItem("historialCompras") !== null && historialDiv.textContent.trim() !== '') {
        // Si hay compras, procede a eliminarlas
        Toastify({
            text: "Se eliminaron los datos del LocalStorage",
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
        // Limpia la lista y remueve el historial de compras del localStorage
        historialDiv.innerHTML = ""; 
        localStorage.removeItem("historialCompras");
        importeTotalCarrito.innerHTML = "$ 0.00";
        historialDiv.innerHTML += '<p>No hay compras registradas.</p>';
    } else {
        // Si no hay compras registradas, muestra el mensaje
        Swal.fire({
            icon: "info",
            title: "El historial de compras ya fue eliminado!"
        });
    }
  });
  //DESCARGAR HISTORIAL DE COMPRAS EN ARCHIVO EXEL
  document.getElementById('descargarHistorial').addEventListener('click', async () => {
    try {
        // Obtén el historial de compras desde localStorage
        const historialCompras = JSON.parse(localStorage.getItem("historialCompras")) ?? [];

        // Verifica si el historial de compras está vacío
        if (historialCompras.length === 0) {
            Swal.fire({
                icon: 'info',
                title: "No hay compras registradas.",
                text: "No hay datos disponibles para descargar."
            });
            return; // Detiene la ejecución de la función si no hay compras registradas
        }

        // Prepara los datos para el archivo Excel
        let datosParaExcel = historialCompras.map(({ id, fecha, nombre, precio }) => ({
            ID: id,
            Fecha: fecha,
            Producto: nombre,
            Precio: precio,
        }));

        // Agrega una fila adicional al final de los datos con el total de compras
        const totalCompras = datosParaExcel.reduce((acc, prod) => acc + parseFloat(prod.Precio), 0);
        datosParaExcel.push({
            ID: 'Total',
            Fecha: '',
            Producto: 'Total compras:',
            Precio: totalCompras.toFixed(2), // Asegúrate de convertir el total a número flotante para evitar problemas con números locales
        });

        const worksheet = XLSX.utils.json_to_sheet(datosParaExcel);

        // Crea un libro de trabajo con una hoja
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Historial Compras");

        // Genera el archivo Excel
        const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

        // Crea una URL temporal para el blob
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'HistorialCompras.xlsx'; // Nombre del archivo descargado
        document.body.appendChild(link);
        link.click();
        setTimeout(() => document.body.removeChild(link), 100); // Usa setTimeout para asegurar que el DOM tenga tiempo para actualizar

        Swal.fire({
            icon: "success",
            title: "El historial se descargo con éxito!"
        });
    } catch (error) {
        console.error('Error al generar o descargar el archivo:', error);
        Swal.fire({
            icon: "error",
            title: "Ocurrió un error al descargar el archivo."
        });
    }
  });

  //ENVIO DE HISTORIAL POR MAIL
  document.getElementById('enviarHistorialPorMail').addEventListener('click', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const nombre = document.getElementById('nombre').value;

    // Construye el historial de compras como una cadena de texto
    const historialCompras = JSON.parse(localStorage.getItem("historialCompras")) ?? [];
    let historialTexto = "";
    if (historialCompras.length > 0) {
        historialCompras.forEach(({ id, fecha, productoNombre , precio }) => {
            historialTexto += `ID: ${id}, Fecha: ${fecha}, Producto: ${productoNombre}, Precio: $${precio}\n`;
        });
        historialTexto += `\nImporte total Carrito: $${importeTotalCarrito.textContent}`;
    };
    // Define los parámetros del correo electrónico
    const templateParams = {
      to_name: nombre,
      from_name: "Nombre del Remitente", // Este campo es opcional y depende de tu configuración en EmailJS
      message: historialTexto, // Aquí insertas el historial de compras
      to_email: email // La dirección de correo electrónico del destinatario
    };
    // Inicializa EmailJS
    emailjs.init("w9bF-N0-sViCz5E16");

    // Verifica si hay compras registradas antes de intentar enviar el correo
    if (historialCompras.length > 0) {
    // Envía el correo electrónico
      emailjs.send('service_81u29n5', 'template_lfl9sjg', templateParams)

      .then((response) => {

          console.log('SUCCESS!', response.status, response.text);
          // Limpia los campos de entrada
          document.getElementById('email').value = '';
          document.getElementById('nombre').value = '';

          Swal.fire({
              icon: "success",
              title: "El historial se ha enviado exitosamente!"
          });
      }, (error) => {
          console.error('FAILED...', error);
          Swal.fire({
              icon: "error",
              title: "Ocurrió un error al enviar el correo electrónico."
          });
      });
    } else {
      Swal.fire({
          icon: "info",
          title: "No hay compras registradas.",
          text: "No hay datos disponibles para enviar por correo."
      });
    }
  });
});


