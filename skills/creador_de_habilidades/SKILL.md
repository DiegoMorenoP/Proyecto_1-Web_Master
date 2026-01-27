---
name: creador_de_habilidades
description: Instrucciones para crear nuevas habilidades (skills) siguiendo los estándares oficiales de Google Antigravity. Úsala cuando necesites crear una nueva habilidad o herramienta para el agente.
---

# Creador de Habilidades

Esta habilidad te guía en el proceso de creación de nuevas habilidades para el agente Antigravity.

## Pasos para crear una habilidad

1.  **Crear la estructura de carpetas**:
    *   Cada habilidad debe tener su propia carpeta.
    *   El nombre de la carpeta debe ser descriptivo (kebab-case preferiblemente).
    *   Ubicación:
        *   Para **este espacio de trabajo**: `/Users/diego.morenop95/Library/Mobile Documents/com~apple~CloudDocs/IA/Proyecto 1 - Web Master/Proyecto_1-Web_Master/skills/<nombre-de-la-habilidad>/`.
        *   Para **uso global** (si se solicita): `~/.gemini/antigravity/global_skills/<nombre-de-la-habilidad>/`.

2.  **Crear el archivo `SKILL.md`**:
    *   Este es el archivo obligatorio que define la habilidad.
    *   Debe estar en la raíz de la carpeta de la habilidad.
    *   **Formato obligatorio**:
        *   Debe comenzar con un bloque YAML frontmatter.
        *   Debe contener `name` (nombre único) y `description` (cuándo usarla).
        *   El resto del archivo son instrucciones en Markdown.

    **Plantilla de `SKILL.md`:**

    ```markdown
    ---
    name: nombre-de-la-habilidad
    description: Descripción corta de qué hace y cuándo debe usarla el agente.
    ---

    # Título de la Habilidad

    Instrucciones detalladas de cómo debe comportarse el agente cuando usa esta habilidad.
    1. Paso 1...
    2. Paso 2...
    
    ## Recursos
    (Opcional: Enlaces o referencias)
    ```

3.  **Archivos adicionales (Opcional)**:
    *   Puedes añadir scripts (Python, JS) o archivos de texto dentro de la misma carpeta.
    *   El agente puede leer estos archivos para ejecutar tareas complejas.

## Lista de verificación de calidad

*   [ ] ¿El nombre en el frontmatter es único y descriptivo?
*   [ ] ¿La descripción explica claramente *cuándo* activar la habilidad?
*   [ ] ¿Las instrucciones son claras y paso a paso?
*   [ ] ¿La carpeta está en la ubicación correcta?

## Ejemplo

Si el usuario pide una habilidad para "Revisar PRs", crearías:
`skills/revisor-pr/SKILL.md` con instrucciones sobre qué buscar en el código (estilo, bugs, seguridad).
