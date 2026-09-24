# TurnosRed API

Proyecto de Integraciones Web para administrar turnos y médicos. La API está hecha con Node.js, TypeScript, Express y Zod. Los datos de los ejemplos son ficticios. También se conservan los avisos de turnos mediante Socket.IO.

## Cómo instalar y ejecutar

Se necesita Node.js 22 y npm. Desde la carpeta del proyecto (donde está `package.json`):

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

En Linux o macOS se usa `cp .env.example .env`. La API queda disponible en `http://localhost:3000`. Para comprobarla, abrir esa dirección en el navegador: debe responder con el nombre, el estado y la versión. Si el puerto 3000 está ocupado, cerrar el otro servidor antes de iniciar este. Para compilar se usa `npm run build`; para ejecutar lo compilado, `npm start`.

La carga inicial lee `data/turnos.json`. Los cambios hechos mediante HTTP se guardan en memoria y se pierden al reiniciar. `.env.example` muestra `PORT` y `DATA_FILE`; el archivo `.env` real no se incluye en la entrega.

## Rutas disponibles

| Método | Ruta | Entrada | Respuesta correcta |
| --- | --- | --- | --- |
| GET | `/` | Ninguna | 200, estado de la API |
| GET | `/turnos` | Query opcional: `especialidad`, `fecha`, `medicoId` | 200, arreglo de turnos |
| GET | `/turnos/:id` | ID entero positivo en la ruta | 200, turno |
| POST | `/turnos` | JSON de turno | 201, turno creado con ID |
| PUT | `/turnos/:id` | ID en la ruta y JSON completo del turno | 200, turno actualizado |
| DELETE | `/turnos/:id` | ID en la ruta | 204, sin cuerpo |
| GET | `/medicos` | Query opcional: `especialidad`, `disponible` (`true` o `false`) | 200, arreglo de médicos |
| GET | `/medicos/:id` | ID entero positivo en la ruta | 200, médico |
| POST | `/medicos` | JSON de médico | 201, médico creado con ID |
| PUT | `/medicos/:id` | ID en la ruta y JSON completo del médico | 200, médico actualizado |
| DELETE | `/medicos/:id` | ID en la ruta | 204, sin cuerpo |

GET lista todos si no se mandan filtros. Los filtros válidos pueden combinarse; si no hay coincidencias devuelve `200` y `[]`. El `id` lo asigna el servidor. Para los PUT hay que enviar todos los campos obligatorios.

### JSON para crear o actualizar un médico

```json
{
  "nombre": "Medico Demo Uno",
  "documento": "DEMO-MED-004",
  "especialidad": "Pediatría",
  "disponible": true
}
```

Los cuatro campos son obligatorios. `documento` es texto y `disponible` es booleano. Ejemplo de filtro: `GET /medicos?especialidad=Pediatria&disponible=true`.

### JSON para crear o actualizar un turno

```json
{
  "paciente": "Paciente Demo Tres",
  "documento": "DEMO-PAC-003",
  "especialidad": "Pediatría",
  "medicoId": 1,
  "fecha": "2026-08-14",
  "hora": "14:00",
  "confirmado": true,
  "observaciones": "Control"
}
```

`observaciones` es opcional. Los demás campos son obligatorios. `medicoId` debe señalar a un médico existente y disponible, con la misma especialidad. Se acepta fecha válida en formato `AAAA-MM-DD` o `DD/MM/AAAA`, y hora `HH:mm`. Ejemplo de filtro: `GET /turnos?medicoId=1&fecha=2026-08-14`. No se puede eliminar un médico que tenga turnos asociados.

### Errores

Los datos incorrectos o filtros no admitidos devuelven 400; un turno, médico o ruta inexistente devuelve 404. Los conflictos de negocio pueden devolver 409 y los errores internos 500. El formato general de error es:

```json
{
  "status": 404,
  "message": "No existe un turno con ID 9999.",
  "code": "NOT_FOUND",
  "details": []
}
```

Por ejemplo, `GET /turnos/9999` y `GET /medicos/9999` devuelven 404 si esos ID no existen. Las validaciones muestran en `details` los campos con problemas.

## Pruebas con Postman

La colección `turnos-red.postman_collection.json` y el entorno `postman/turnos-red.postman_environment.json` incluyen `baseUrl` con el valor `http://localhost:3000`. Importarlos en Postman, seleccionar el entorno local y arrancar el servidor con `npm run dev`. Las solicitudes locales guardadas usan `{{baseUrl}}`, por ejemplo `{{baseUrl}}/turnos`. Al pulsar **Send**, la respuesta permite comprobar que Postman resolvió la variable. La colección también guarda ejemplos y pruebas automatizadas de la API local y una carpeta separada de mock.

`postman/TurnosRed.postman_collection.json` es una colección anterior con peticiones básicas que también usan `{{baseUrl}}`. El mock de Postman simula respuestas guardadas; sus resultados no prueban que el servidor local haya ejecutado el código.

## Propuesta de pacientes y turnos

`pacientes-turnos.md` describe los datos de paciente, la relación del turno mediante `pacienteId` y los contratos propuestos de `POST /pacientes` y una versión nueva de `POST /turnos`. **Esta propuesta todavía no está implementada**: el POST `/turnos` que funciona hoy utiliza `paciente` y `documento` como texto. Los JSON de la propuesta son ejemplos de diseño, no capturas de pruebas reales.

## Organización y entrega

`src/` contiene rutas, controladores, esquemas Zod, servicios y eventos; `data/turnos.json` contiene los registros iniciales ficticios; `public/` contiene la página de eventos. `.gitignore` excluye `node_modules/`, `dist/` y `.env`. En la raíz están `package.json`, este README y `pacientes-turnos.md`. La captura del mockup corresponde a la vista previa de Markdown; las demás capturas para el PDF deben tomarse en Postman y en GitHub una vez publicada la entrega.
