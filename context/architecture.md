# Arquitectura

## Estado actual

La prueba de concepto es una aplicación web estática en HTML, CSS y JavaScript, sin framework ni backend. Se sirve mediante HTTP(S); los módulos no están pensados para abrirse directamente desde `file:`.

## Componentes

- `index.html` y `styles.css`: estructura y diseño adaptable.
- `app.js`: interacción, raspado con Canvas, enlace y almacenamiento local.
- `core.mjs`: cálculo de días UTC, validación del enlace y del progreso.
- `challenges.mjs`: 30 textos propuestos, compartidos por todas las parejas.
- `tests/core.test.mjs`: pruebas de las reglas principales con el ejecutor integrado de Node.js.

El enlace incluye la fecha de inicio y un identificador aleatorio, sin datos personales. Cualquiera que lo posea puede acceder; no hay autenticación. Los días revelados se guardan en `localStorage` por enlace y dispositivo, sin sincronización. Una persona que se une más tarde ve los días ya desbloqueados. El desbloqueo utiliza el reloj del dispositivo y la capa de raspado no protege el contenido frente a una persona que inspeccione el código.

El entorno de publicación todavía está pendiente de elegir.
