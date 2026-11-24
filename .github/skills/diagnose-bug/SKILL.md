---
name: diagnose-bug
description: Investiga y corrige un fallo reportado, rastreando el comportamiento y reproduciendo el problema antes de cambiar código.
---

# Diagnosticar un fallo

1. Lee `AGENTS.md` y el contexto pertinente.
2. Localiza el flujo afectado y sigue el comportamiento a través del código y las pruebas existentes.
3. Formula una hipótesis basada en evidencia y busca una forma segura y acotada de reproducir el fallo.
4. Corrige la causa raíz con un cambio enfocado; evita ocultar errores o añadir valores de reserva silenciosos.
5. Añade una prueba que falle antes del arreglo y cubra el caso reportado.
6. Ejecuta la prueba enfocada y las validaciones relacionadas; informa los resultados.
