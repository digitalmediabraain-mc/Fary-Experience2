# Para Fary ❤️🌪️ — experiencia interactiva

Sitio estático (HTML, CSS y JS) listo para Vercel.

## Lo que debes personalizar
1. **Fotos**: agrégalas en `public/photos/` como `recuerdo-1.jpg`, `recuerdo-2.jpg`, `recuerdo-3.jpg`.
2. **Canciones de Spotify** (debajo de cada foto): abre `public/script.js`, arriba está el bloque `SONGS`.
   Pega el link (Spotify → Compartir → Copiar enlace de la canción), el título y el artista.
   Si dejas `url` vacío, ese enlace no aparece.
3. **Recibir su elección de día y hora**: en `public/script.js` pon tu número en `WHATSAPP_NUMBER`
   (con código de país, sin + ni espacios, ej. `"573001234567"`). Al confirmar, ella verá un botón que abre
   WhatsApp con el mensaje ya escrito.
4. **El lugar**: sigue como sorpresa. Cuando lo decidas, edita el bloque `.plan-card` en `index.html`.

## Ajustes opcionales (`public/script.js`)
- `DATE_YEAR`: año del calendario (solo se muestra diciembre).
- `HOURS`: horas que ella puede elegir.

## Publicar en Vercel
Sube la carpeta a GitHub, impórtala en https://vercel.com/new y pulsa Deploy.
