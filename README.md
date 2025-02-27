# Descripción
Atahualpa Ferresys es un sistema web simple para la gestión del área de almacén y ventas de un negocio (enfocado en una ferretería). Desarrollado utilizando Laravel 11 y Angular 19.

## Características
- Gestión de productos (CRUD)
- Gestión de proveedores (CRUD)
- Gestión de clientes (CRUD)
- Gestión de presentaciones (CRU)
- Gestión de usuarios del sistema (Crear, eliminar, cambiar permisos y resetear credenciales)
- Módulo simple de ventas
- Visualización, búsqueda y descarga de comprobantes de pago (PDF)
- Recuperación de credenciales de acceso (Envío de e-mail)
- Permisos de acceso al sistema según roles (ADMINISTRADOR/VENDEDOR)

## Tecnologías y dependencias
- [Angular 19](https://angular.dev/) (Frontend)
- [Laravel 11](https://laravel.com/docs/11.x/installation) (Backend)
- [Angular Material](https://material.angular.io/) (Interfaces)
- [Bootstrap 5.3](https://getbootstrap.com/) (Interfaces)
- [Bootswatch Spacelab](https://bootswatch.com/spacelab/) (Tema para Bootstrap)
- [SweerAlert2](https://sweetalert2.github.io/) (Alertas)
- [PHP-Open-Source-Saver/jwt-auth](https://github.com/PHP-Open-Source-Saver/jwt-auth) (Librería JWT)

## Requisitos
- PHP Versión >=8.2
- [Extensiones necesarias para Laravel.](https://laravel.com/docs/11.x/deployment#server-requirements)
- [PHP GD Extension](https://www.webassist.com/tutorials/Enabling-the-GD-library-setting)
- [Composer](https://getcomposer.org/download/)
- NodeJS Version >= 18.19.1
- [AngularCLI](https://www.npmjs.com/package/@angular/cli)
- Base de Datos (MySQL recomendada).

## Uso
Cumplidos los requisitos para ejecutar Laravel y Angular puedes probar el sistema siguiendo estos pasos:

- Clonar el repositorio. `git clone https://github.com/zNahuelz/atahualpa-ferresys-angular.git`
----
### Configuración de backend
- Debes crear un archivo .env en el directorio rest-api usando como referencia el archivo .env.example del mismo directorio.
- Configura la conexión a la base de datos en él .env (MySQL recomendada): 
```DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=NOMBRE_BD
DB_USERNAME=USUARIO_BD
DB_PASSWORD=CONTRASEÑA_BD
```
- Configurar el servicio de correo para envío de emails en el .env (Se utilizo Gmail durante las pruebas). Debes generar una contraseña de aplicación, puedes seguir la guía oficial de Google [aquí](https://support.google.com/accounts/answer/185833?hl=es):
```
MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=CORREO_GMAIL
MAIL_PASSWORD=CONTRASEÑA_APP_GMAIL
MAIL_FROM_ADDRESS="noreply@atahualpasys.com"
MAIL_FROM_NAME="FERRETERIA ATAHUALPA - SISTEMAS"
```
- Añadir URL del frontend en la configuración.
`
ANGULAR_FRONTEND_URL="http://localhost:3000"
`
- Descargar dependencias del proyecto (en directorio rest-api): `composer install`
- Generar clave del proyecto: `php artisan key:generate`
- Generar clave para tokens JWT: `php artisan jwt:secret`
- Ejecutar inicialización de la base de datos: `php artisan migrate --seed` 
- Esto creará 2 cuentas de usuario por defecto; los datos de acceso de la cuenta de administrador son: usuario; ADMIN y contraseña; administrador. También crea datos de productos, presentaciones, proveedores y clientes de prueba. Pueden ser modificados en el sistema o con un gestor de bases de datos.
- Ejecutar el backend: `php artisan serve`
----
### Configuración de frontend
- En el directorio frontend ejecutar: `npm i`
- Ejecutar el frontend: `ng serve` (Requiere [AngularCLI](https://www.npmjs.com/package/@angular/cli))

## Imágenes
Listado de Productos
<img src="docs/public/product-list.png" alt="Listado de Productos"/>
Listado de Comprobantes

<img src="docs/public/voucher-list.png" alt="Listado de Comprobantes"/>
Detalle de Comprobante

<img src="docs/public/voucher-detail.png" alt="Detalle de Comprobante"/>
Comprobante en PDF

<img src="docs/public/voucher-pdf.png" alt="Comprobante en PDF"/>
Módulo de Ventas

<img src="docs/public/cart.png" alt="Módulo de Ventas"/>
Perfil de Usuario

<img src="docs/public/my-profile.png" alt="Perfil de Usuario"/>