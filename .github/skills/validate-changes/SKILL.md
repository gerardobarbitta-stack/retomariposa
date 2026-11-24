---
name: validate-changes
description: Selecciona y ejecuta validaciones apropiadas para los cambios actuales; úsala antes de entregar una implementación o revisar un cambio.
---

# Validar cambios

1. Inspecciona el diff para entender su alcance y detectar cambios accidentales.
2. Identifica los comandos de pruebas, lint, formato y build definidos por el propio repositorio.
3. Ejecuta primero las comprobaciones más específicas que cubran el cambio; amplía la validación si hace falta.
4. Si una comprobación falla, determina si la causa está relacionada con el cambio antes de modificar código.
5. Informa los comandos ejecutados, los resultados y las comprobaciones que no se pudieron ejecutar. No declares éxito sin evidencia.
