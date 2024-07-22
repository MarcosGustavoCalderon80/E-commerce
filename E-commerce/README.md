Este es un pequeño E-commerce, venta regaleria con tres pantalla, hecho en Javascript Vanilla:
1_Pantalla Regaleria: seleccion de productos para agregar al carrito.

2_Pantalla Carrito: donde vemos la seleccion de productos hechos en la pantalla principal, con la posibilidad de eliminar productos, volver al inicio o realizar compra.

3_Pantalla historial de compras: veremos todos los productos comprados con la posibilidad de descargarlos en un archivo Excel o enviar al dueño del Ecommers el mail para registro y contacto de venta.

Se utilizo para la realizacion CDN:

a_Bootstrap (diseño)
b_Toastify (mensajes en pantalla) https://apvarun.github.io/toastify-js
c_Sweetalert (mensajes en pantalla) https://sweetalert2.github.io
d_EmailJS (envio de email). Nota: debe ser configurado mediante registro en la pagina para que lleguen los mails. https://www.emailjs.com

LocalStorage:
Se utilizaron dos localStorage para guardar los productos del Carrito y otro para guardar el Historial.

API para los productos:

Se utilizo https://mockapi.io/projects para guardar los productos del carrito en un JSON y traerlos para llenar las paginas. Se utilizo Fetch para traer dichos datos. Nota: Tambien se podria haber hecho con un JSON de forma local.

