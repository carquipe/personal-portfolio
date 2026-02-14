---
title: "La importancia de un Handbook en una compañía"
slug: "handbook-compañia"
description: "Explicación de los beneficios así como aspectos claves de un handbook en una compañía"
date: "2024-07-04"
published: true
coverImage: "https://images.unsplash.com/photo-1472905981516-5ac09f35b7f4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=6000"
tags:
  - "Management"
---
# Contexto

Las áreas tecnológicas son un eje central de información y documentación que obligatoriamente debe trascender al resto de la compañía de forma automática para conseguir la **sincronización entre todas las personas con el mínimo esfuerzo**: *Flujos de Negocio, Estructuras de Atribuciones, Demostraciones Funcionales…*

# El problema a resolver

Cuando no existe un proceso estandarizado que favorezca la redacción y transmisión de la información transversal, **se genera un entorno de: preguntas repetitivas, dudas y consultas alrededor del mismo conocimiento** que **convierten en ineficientes a los equipos.**

Por no hablar de la dependencia a nivel compañía de que solo escasos empleados conozca como funciona una determinada arquitectura, proceso ó _ese fichero batch que mágicamente llega a nuestro partner de integración todas las semanas._

Hay distintos **comportamientos corporativos que denotan la misma problemática**:

- Cada vez que se realiza un proceso de **Onboarding** de Talento en la compañía se **requiere de pedir información actualizada** a distintas áreas corporativas.

- Existe un elevado número de **consultas repetitivas en canales de comunicación corporativos** (chats, emails) sobre los mismos aspectos.

- La **información procedimental** que genera cada área (políticas, manuales, estándares) **no mantiene un formato común de versionado, almacenamiento, visibilidad**.

- Se generan **bloqueos de tareas en los empleados por falta de información** que debe resolver un compañero que sí sabe como funciona o tiene almacenado el documento que lo aclara.

**Si algo he aprendido con el paso del tiempo, es que no hay nada más óptimo que la información única centralizada, El dato único que dirían algunos [vendedores de lechugas](https://www.mercadona.es/)**. Es por ello que tras analizar distintas soluciones, decidí probar con el sistema de Handbook.

# Handbook

El término Handbook puede asociarse a distintos elementos, es por ello que primero de todo hay que indicar qué es un Handbook a los términos de esta prueba:

1. Repositorio central de información en el que se encuentran los manuales, estándares y procedimientos de la compañía.

2. No limitamos la información a los Handbook de empleados donde sólo se incluye información de onboarding, cultura y legal, sino que aprovechamos para, además de incluir esta información mencionada, añadir los procedimientos operativos.

### Características

A continuación, se definen las características que debe tener este repositorio para asegurar el correcto funcionamiento:

- **Información del propietario y colaboradores**
    Toda página debe tener unos responsables. Son las personas que se encargan de que su apartado asignado se mantenga siempre actualizado y las que se encargan de validar en última instancia cualquier cambio en los mismos. Normalmente son las personas a las que acudir en cualquier duda sobre el contenido.
- **Control de versiones**
    
    Los apartados son vivos, cambian con el tiempo al igual que la compañía. Por lo tanto debe existir un histórico de cambios que indiquen su última fecha de actualización así como la variación que ha sufrido en cada momento.
    
- **Enlaces entre apartados**
    
    Siempre se evita duplicar la misma información en dos apartados distintos ([DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)). Dado que muchos procesos dependen de otros, debe existir la posibilidad de navegar entre apartados.
    
- **Sistema de comentarios**
    
    Los debates sobre los cambios existen sobre la misma información y no en canales separados. De esta forma siempre mantenemos una trazabilidad de por qué se tomaron las distintas decisiones.
    
- **Migrable**
    
    Este repositorio contiene gran cantidad de información específica de la compañía, así que evita el _vendor lock-in._
    
- **Sistema de permisos**
    
    No todo el mundo puede editar el contenido a su discreción y también hay ciertos apartados que deben de ser, por seguridad, visibles por ciertos roles de la compañía.
    
    A pesar de esta característica, **siempre hay que buscar que la información sea lo más transparente posible** y vista por el mayor número de personas para aportar el máximo contexto.
    

### Organización de la información

La estructura de la información, como la compañía es viva y podrá cambiar con el tiempo, por lo que tampoco esperes tener la estructura perfecta desde el inicio y no te preocupes por ello.

La primera pregunta que nos hacemos cuando empezamos es cómo estructurar los apartados de información del más alto nivel. Cada organización se distribuye de forma distinta, en función de su tamaño, cultura y producto a ofrecer.

**La recomendación es agruparlo en zonas funcionales**, es decir, establecer un primer nivel general donde exista la información genérica de la compañía (Misión, Valores, Objetivos…) y un segundo nivel en función del área donde impacta dicha información (Personal, Tecnología, Producto, Marketing, Financiero…). **Haz uso de cuantos niveles jerárquicos te sean necesarios.**

En nuestro caso establecimos la siguiente estructura (_Se ponen unas páginas de ejemplo_):

**Estructura de ejemplo**

---

- General
    - Compañía
        - Valores
        - Misión
        - Organigrama
        - Sedes
        - KPIs
    - Operaciones
        - Personal
            - Código de conducta
            - Política Horaria
            - Liderazgo
            - Onboarding
        - Comercial
            - Comunicación externa
            - Proceso de fidelización
        - Desarrollo
            - Nomenclatura de términos
            - Arquitectura del software
                - Backend
                    - Estándar Back-End
                    - Integración continua
                - Frontend
                    - Estándar Front-end
                    - Guías visuales
        - Marketing
            - Brand Toolkit
        - Producto
            - Plan de ruta del producto
            - Releases

# Herramientas en las que gestionarlo

Esto puede construir en una gran variedad de herramientas, depende de qué stack utilicéis actualmente para incluso aprovechar alguna licencia que utilicéis. Por ejemplo, nosotros aprovechamos que ya utilizábamos Notion como base de conocimiento técnica para incluirlo en dicho sitio.

1. [Notion](https://notion.so/)
2. [Confluence](https://www.atlassian.com/es/software/confluence)
3. [OneNote](https://www.microsoft.com/es-es/microsoft-365/onenote/digital-note-taking-app)
4. [Obsidian](https://obsidian.md/)
5. [Github](https://github.com/) (Mediante repositorio con archivos Markdown)
6. [AirMason](https://www.airmason.com/enterprise)

# Handbooks públicos en los que inspirarse

Recuerda que cada compañía tiene su idiosincrasia, la estructura que le funcione a una compañía no asegura que funcione en la tuya, y por ello debes mantener la mentalidad de amoldarlo a lo que a vuestra compañía le funcione.

[The GitLab Handbook](https://handbook.gitlab.com/)

[Employee Manual](https://trello.com/b/HbTEX5hb/employee-manual)

# Disclaimer Final

Las herramientas y frameworks de trabajo no se aplican con sólo configurarlas. Es como decir:

> _Somos Agile porque utilizamos Jira._

Cometí el error en los inicios de redactar y migrar toda una serie de procedimientos, manuales, guías de cultura, de diseño, de tecnología sin prestar atención en cómo hacía parte al equipo de la construcción y evolución del Handbook. Me encontré con páginas y páginas de información a la que nadie acudía y obviamente no se aplicaban en el día a día.

Sólo hay un ingrediente que, si no existe, nunca funcionará este sistema: **Todo el equipo debe ser partícipe de la evolución y el mantenimiento del Handbook**, y esto pasa por hacerles ver el beneficio que puede conllevar.