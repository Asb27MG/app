(function setupContact() {
  console.log("contacto.js cargado");
  const form = document.getElementById("contactForm");
  if (!form) {
    console.warn("No se encontró el formulario de contacto");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    console.log("Enviando contacto:", { nombre, correo, mensaje });

    if (!nombre || !correo || !mensaje) {
      alert("Por favor completa todos los campos antes de enviar.");
      return;
    }

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, descripcion: mensaje })
      });

      const text = await response.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch (err) {
        console.error('JSON inválido de /api/contacto:', text, err);
        alert('Ocurrió un error inesperado. Revisa la consola.');
        return;
      }

      if (response.ok && data && data.success) {
        alert(data.message || 'Mensaje enviado correctamente');
        form.reset();
      } else {
        console.error('Error enviando contacto:', response.status, data);
        alert((data && data.message) || 'Ocurrió un error al enviar el mensaje');
      }

    } catch (error) {
      console.error('Error de red al enviar contacto:', error);
      alert('No se pudo conectar con el servidor');
    }
  });
})();