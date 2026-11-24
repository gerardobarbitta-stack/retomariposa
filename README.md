# retomariposa

Una prueba de concepto de 30 días de retos para parejas. Cada persona abre el mismo enlace en su dispositivo y raspa para descubrir el reto diario.

## Ejecutar localmente

Se necesita un servidor web estático; por ejemplo, con Python 3:

```sh
python3 -m http.server 8000
```

Abre `http://localhost:8000`. Los módulos de JavaScript requieren un servidor, no abrir directamente el archivo HTML. Para compartir el enlace entre dispositivos, publica la carpeta en un servidor HTTPS accesible por ambos; `localhost` solo funciona en el dispositivo donde se abre.

Una persona inicia el reto y comparte el enlace generado. Se desbloquea un día a las 00:00 UTC y los anteriores siguen disponibles. Los días revelados se guardan por separado en el navegador de cada persona; no se sincronizan y se perderán si se borran los datos del sitio. El enlace contiene un identificador y la fecha de inicio: cualquiera que lo tenga puede abrir el mismo reto. El desbloqueo usa el reloj del dispositivo y no es una restricción segura. Los textos son propuestas pendientes de revisión.

## Pruebas

Con Node.js instalado, ejecuta `node --test tests/*.test.mjs`.

## Trabajo con agentes

- [AGENTS.md](./AGENTS.md): instrucciones generales para agentes de código.
- [context/](./context/): contexto del proyecto y decisiones.
- [.github/skills/](./.github/skills/): skills para tareas comunes de desarrollo.
