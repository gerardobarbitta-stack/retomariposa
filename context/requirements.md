# Requisitos: prueba de concepto

## Objetivo

Crear una experiencia web para parejas durante 30 días. Cada integrante participa desde su propio dispositivo y raspa una tarjeta para descubrir el mismo reto diario. La interacción debe transmitir la emoción y la sorpresa de una tarjeta para raspar, sin que eso implique apuestas reales.

## Requisitos confirmados

- La interfaz debe ser sencilla, moderna, atractiva y visualmente cuidada.
- Debe ser una interfaz HTML adaptable a móviles.
- La identidad visual debe usar colores rosas e iconos de mariposa.
- La experiencia debe abarcar 30 días de retos para parejas.
- Cada integrante debe poder raspar con el dedo su propia tarjeta para revelar el mismo reto de cada día desde su dispositivo.
- Una persona inicia el reto y comparte un enlace con la otra, sin necesidad de cuentas.
- Se desbloquea un reto cada día de calendario según UTC; los días futuros se muestran con candado y los anteriores siguen disponibles.
- El progreso debe guardarse en el dispositivo.
- Se propondrán 30 retos para que el responsable del proyecto los revise.
- Ejemplo de reto: «Decirle al otro lo que más disfruta haciendo juntos».
- Se busca una prueba de concepto con intención de publicarla.

## Criterios de aceptación iniciales

- En un móvil, la interfaz se adapta a la pantalla y permite interactuar sin depender de un ratón.
- Al raspar una tarjeta con el dedo, la capa que oculta el contenido se elimina siguiendo el movimiento y deja ver el reto.
- Ambos integrantes pueden descubrir el mismo reto del día desde sus respectivos dispositivos.
- El enlace compartido permite a la otra persona acceder al reto de la pareja sin crear una cuenta.
- Los días futuros aparecen con candado y no permiten revelar su reto antes de desbloquearse.
- Los días se desbloquean al cambiar la fecha en UTC y los retos de días anteriores siguen disponibles.
- Al volver a abrir la experiencia en el mismo dispositivo, el progreso guardado permanece disponible.
- El contenido revelado se puede leer con claridad y la interacción comunica qué debe hacer la persona.
- La experiencia representa los 30 días y mantiene la estética rosa y de mariposas solicitada.
- La interfaz se puede abrir como página web; el entorno concreto de publicación queda por definir.

## Recomendaciones por validar

- Ofrecer una alternativa accesible para revelar el reto sin arrastrar, además de soporte de teclado y texto legible.
- Considerar una revelación automática cuando se haya raspado una parte suficiente de la tarjeta, para evitar que el gesto se vuelva tedioso. El umbral y la respuesta visual deben probarse; no son requisitos acordados.
- Mantener la experiencia de sorpresa sin dinero, premios económicos ni mecánicas de apuestas reales.

## Decisiones pendientes

- ¿Cómo debe comportarse el enlace si la segunda persona se une después del primer día o si se comparte con alguien más?
- ¿Qué forma parte del progreso guardado: días revelados, retos completados o ambos? ¿Qué ocurre al cambiar de dispositivo o borrar los datos del navegador?
- ¿Cómo se indican o confirman los retos completados? ¿Se pueden volver a leer?
- ¿Qué idiomas se necesitan y dónde se publicará la prueba de concepto?
- ¿Se esperan datos personales, analítica, sonido, vibración o notificaciones? Estos elementos no están definidos.

## Referencias de interacción

- [Paragon UI: Scratch Reveal](https://www.paragon-ui.com/docs/scratch-reveal): ejemplo de capa Canvas que se borra con el puntero y puede completar la revelación al superar un umbral. Es una referencia de interacción, no una dependencia elegida.
- [W3C: alternativa a movimientos de arrastre](https://www.w3.org/WAI/WCAG22/Techniques/general/G219.html): orientación para ofrecer la misma función mediante pulsaciones sin arrastrar.
