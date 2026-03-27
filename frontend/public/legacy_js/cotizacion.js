document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("formCotizacion");

  form.addEventListener("submit", async function (e) {

    e.preventDefault();

    // helper to try multiple id variants (cot_* then fallback to unprefixed)
    const getVal = (ids, fallback = '') => {
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) return el.value;
      }
      return fallback;
    };

    const nombre = getVal(['cot_nombre', 'nombre'], '');
    const correo = getVal(['cot_correo', 'correo'], '');
    const telefono = getVal(['cot_telefono', 'telefono'], null);
    const servicio = getVal(['cot_servicio', 'servicio'], null);
    const descripcion = getVal(['cot_descripcion', 'descripcion'], null);

    try {

      const response = await fetch("/api/cotizacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: nombre,
          correo: correo,
          telefono: telefono,
          servicio: servicio,
          descripcion: descripcion
        })
      });

        // Read response as text first to robustly handle non-JSON errors
        const text = await response.text();
        let data;
        try {
          data = text ? JSON.parse(text) : {};
        } catch (err) {
          console.error('No se pudo parsear JSON de respuesta:', text, err);
          window.showAlert && window.showAlert('Respuesta inválida del servidor. Revisa la consola.', 'danger');
          return;
        }

        // parsed response available in `data`

        if (response.ok && data && data.success) {
          // hide the offcanvas if present
          const offcanvasElement = document.getElementById('cotizacionPanel');
          try {
            const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
            offcanvas.hide();
          } catch (e) {
            // ignore if bootstrap isn't available
          }
          window.showAlert && window.showAlert(data.message || 'Cotización enviada correctamente', 'success');
          form.reset();
        } else {
          console.error('Error al enviar cotización, response.ok=', response.ok, 'data=', data);
          window.showAlert && window.showAlert((data && data.message) || 'Ocurrió un error al enviar la cotización', 'danger');
        }

    } catch (error) {
      console.error("ERROR:", error);
    }

  });

});