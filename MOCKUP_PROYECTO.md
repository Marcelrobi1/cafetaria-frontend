# 🍽️ Sistema de Gestión para Cafetería - Mockup del Proyecto

## 📋 Información del Proyecto

**Nombre del Proyecto:** Cafetaria Frontend  
**Repositorio GitHub:** [https://github.com/Marcelrobi1/cafetaria-frontend](https://github.com/Marcelrobi1/cafetaria-frontend)  
**Tecnologías:** React 19, Vite, React Router DOM  
**Tipo de Aplicación:** Single Page Application (SPA)

---

## 🎯 Descripción General

Sistema web completo para la gestión integral de una cafetería, que incluye funcionalidades tanto para clientes como para administradores. La aplicación permite visualizar el menú, realizar pedidos, gestionar ingredientes, platos, menús y usuarios.

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
cafetaria-frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/           # Imágenes y recursos estáticos
│   ├── components/       # Componentes reutilizables
│   │   ├── Auth/        # Sistema de autenticación
│   │   ├── Cart/        # Carrito de compras
│   │   ├── DishImage/   # Visualización de platos
│   │   ├── Footer/      # Pie de página
│   │   ├── Gestao/      # Panel de administración
│   │   │   ├── GestaoCompras/
│   │   │   ├── GestaoIngredientes/
│   │   │   ├── GestaoMenu/
│   │   │   ├── GestaoPratos/
│   │   │   └── GestaoUtilizadores/
│   │   ├── Homepage/    # Secciones de la página principal
│   │   │   ├── About/
│   │   │   ├── BestSellers/
│   │   │   ├── Features/
│   │   │   ├── Hero/
│   │   │   └── MenuHighlights/
│   │   └── navbar/      # Barra de navegación
│   ├── context/         # Gestión de estado global
│   │   └── CartContext.jsx
│   ├── pages/           # Páginas principales
│   │   ├── AdminDashboard/
│   │   ├── Home/
│   │   ├── MenuPage/
│   │   ├── Profile/
│   │   └── Register/
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── package.json
└── vite.config.js
```

---

## ✨ Funcionalidades Principales

### 👥 Para Usuarios/Clientes

#### 1. **Página de Inicio (Home)**
- **Hero Section:** Presentación visual atractiva del negocio
- **Acerca de Nosotros:** Información sobre la cafetería
- **Productos Destacados:** Los platos más vendidos
- **Características del Servicio:** Beneficios y ventajas
- **Vista Previa del Menú:** Muestra de los menús disponibles

#### 2. **Menú Digital**
- Visualización completa del catálogo de productos
- Imágenes de alta calidad de los platos
- Información detallada (nombre, descripción, precio)
- Filtrado y búsqueda de productos

#### 3. **Sistema de Carrito de Compras**
- Agregar/eliminar productos
- Ajustar cantidades
- Cálculo automático del total
- Sidebar desplegable para revisión rápida
- Persistencia del carrito (Context API)

#### 4. **Autenticación y Perfiles**
- Registro de nuevos usuarios
- Inicio de sesión seguro
- Gestión de perfil personal
- Roles de usuario (Cliente/Administrador)

### 🔧 Para Administradores

#### Panel de Administración Completo

**5. Gestión de Ingredientes**
- Crear, editar y eliminar ingredientes
- Control de inventario
- Información nutricional
- Precios y proveedores

**6. Gestión de Platos**
- CRUD completo de platos
- Asignación de ingredientes
- Gestión de imágenes
- Precios y disponibilidad
- Categorización

**7. Gestión de Menús**
- Creación de menús del día
- Combinación de platos
- Precios especiales
- Programación temporal

**8. Gestión de Compras**
- Registro de pedidos
- Historial de transacciones
- Control de pagos
- Estadísticas de ventas

**9. Gestión de Usuarios**
- Listado de usuarios registrados
- Modificación de roles y permisos
- Administración de cuentas
- Control de accesos

---

## 🛠️ Stack Tecnológico

### Frontend Framework
- **React 19.2.6** - Última versión estable
- **React DOM 19.2.6** - Renderizado del DOM

### Routing
- **React Router DOM 7.15.1** - Navegación SPA

### Build Tool
- **Vite 8.0.12** - Build tool ultrarrápido
- Hot Module Replacement (HMR)
- Optimización automática

### Code Quality
- **ESLint 10.3.0** - Linting de código
- **eslint-plugin-react-hooks** - Reglas para Hooks
- **eslint-plugin-react-refresh** - Soporte para Fast Refresh

---

## 🎨 Diseño y UX

### Principios de Diseño
- **Responsive Design:** Adaptable a móviles, tablets y desktop
- **UI Intuitiva:** Navegación clara y sencilla
- **Accesibilidad:** Cumplimiento de estándares WCAG
- **Performance:** Carga rápida y optimizada

### Componentes Visuales
- Navbar responsiva con menú hamburguesa
- Footer informativo
- Cards de productos con imágenes atractivas
- Formularios validados
- Sidebar para carrito
- Dashboard administrativo con navegación lateral

---

## 🔄 Flujo de Usuario

### Cliente
```
1. Visita la página principal
2. Explora el menú disponible
3. Agrega productos al carrito
4. Se registra o inicia sesión
5. Visualiza su perfil
6. Completa la compra
```

### Administrador
```
1. Inicia sesión con credenciales de admin
2. Accede al panel de administración
3. Gestiona ingredientes, platos, menús
4. Revisa y procesa compras
5. Administra usuarios del sistema
```

---

## 🔐 Sistema de Autenticación

### Características
- **Registro de usuarios** con validación de datos
- **Login seguro** con tokens de autenticación
- **Almacenamiento local** de sesión (localStorage)
- **Protección de rutas** según rol de usuario
- **Cierre de sesión** con limpieza de datos

### Roles
- **Cliente:** Acceso a menú, carrito y perfil
- **Administrador:** Acceso completo al panel de gestión

---

## 📱 Características Técnicas

### Estado Global
- **Context API de React** para gestión del carrito
- Compartición de estado entre componentes
- Actualización reactiva del UI

### Persistencia
- LocalStorage para autenticación
- Mantenimiento de sesión entre recargas

### Routing
- **Rutas públicas:** Home, Menu, Login, Register
- **Rutas protegidas:** Profile
- **Rutas de administrador:** Todo el panel /admin/*
- Navegación programática
- Rutas anidadas en dashboard

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview

# Ejecutar linter
npm run lint
```

### URLs de Desarrollo
- **Desarrollo local:** http://localhost:5173
- **Repositorio GitHub:** https://github.com/Marcelrobi1/cafetaria-frontend

---

## 📊 Métricas del Proyecto

### Estadísticas de Código
- **Componentes:** 20+ componentes React
- **Páginas:** 5 páginas principales
- **Contextos:** 1 (CartContext)
- **Rutas:** 10+ rutas configuradas

### Organización
- **Separación de responsabilidades:** Componentes, páginas, contextos
- **Código modular:** Componentes reutilizables
- **Estilos aislados:** CSS por componente
- **Estructura escalable:** Fácil de mantener y expandir

---

## 🎓 Objetivos Pedagógicos Alcanzados

### Conceptos Implementados

✅ **React Fundamentals**
- Componentes funcionales
- Hooks (useState, useEffect)
- Props y composición
- Eventos y manejo de formularios

✅ **React Avanzado**
- Context API para estado global
- Custom Hooks
- Render condicional
- Listas y keys

✅ **Routing y Navegación**
- React Router DOM
- Rutas anidadas
- Navegación programática
- Protección de rutas

✅ **Gestión de Estado**
- Estado local (useState)
- Estado global (Context)
- Persistencia (localStorage)

✅ **Autenticación**
- Sistema de login/registro
- Manejo de tokens
- Roles y permisos

✅ **Mejores Prácticas**
- Estructura de carpetas organizada
- Separación de concerns
- Componentes reutilizables
- Code splitting

---

## 🔮 Futuras Mejoras

### Backend Integration
- [ ] Conectar con API REST o GraphQL
- [ ] Base de datos real (MySQL, MongoDB)
- [ ] Sistema de pagos online

### Funcionalidades Adicionales
- [ ] Sistema de notificaciones
- [ ] Chat de soporte en vivo
- [ ] Programa de fidelización
- [ ] Reservas de mesas
- [ ] Valoraciones y comentarios

### Optimizaciones
- [ ] PWA (Progressive Web App)
- [ ] Caché de imágenes
- [ ] Lazy loading de componentes
- [ ] Internacionalización (i18n)

---

## 👨‍💻 Información de Desarrollo

### Buenas Prácticas Aplicadas
- Nomenclatura clara y descriptiva
- Componentes pequeños y enfocados
- DRY (Don't Repeat Yourself)
- Código comentado en español
- Estructura predecible

### Control de Versiones
- Repository Git configurado
- Commits descriptivos
- Branches para features
- GitHub como repositorio remoto

---

## 📸 Capturas de Pantalla

> **Nota:** Para incluir capturas de pantalla, ejecutar la aplicación y tomar screenshots de:
> - Página principal
> - Menú
> - Carrito de compras
> - Panel de administración
> - Formularios de login/registro

---

## 📞 Contacto y Recursos

- **Repositorio:** [https://github.com/Marcelrobi1/cafetaria-frontend](https://github.com/Marcelrobi1/cafetaria-frontend)
- **Documentación React:** [https://react.dev](https://react.dev)
- **Documentación Vite:** [https://vitejs.dev](https://vitejs.dev)
- **React Router:** [https://reactrouter.com](https://reactrouter.com)

---

## 🏆 Conclusión

Este proyecto demuestra competencia en el desarrollo de aplicaciones web modernas usando React y sus ecosistemas. Implementa patrones de diseño actuales, gestión de estado efectiva, y una arquitectura escalable que podría fácilmente integrarse con un backend real.

El sistema cubre tanto las necesidades del cliente final como las del administrador del negocio, proporcionando una solución completa para la gestión de una cafetería.

---

**Fecha de Entrega:** Mayo 2026  
**Versión del Mockup:** 1.0  
**Estado del Proyecto:** ✅ Completado y Funcional
