# PROPUESTA DE PACIENTES Y TURNOS

Esta es una propuesta para ampliar TurnosRed. Los endpoints de pacientes y la relación por `pacienteId` todavía no están implementados: el documento define cómo los desarrollaría antes de modificar el código.

## DATOS NECESARIOS

Un paciente necesita DNI, nombre, apellido, fecha de nacimiento y al menos un medio de contacto. El DNI sirve para evitar pacientes duplicados. El ID lo asigna el servidor y permite relacionar al paciente con sus turnos sin repetir todos sus datos.

Un turno necesita el ID del paciente, el ID del médico, la fecha, la hora y el estado de confirmación. La especialidad se puede obtener del médico elegido. Antes de guardar un turno habría que comprobar que ambos IDs existan, que el médico esté disponible y que no tenga otro turno en el mismo horario.

```typescript
interface Paciente {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // AAAA-MM-DD
  email?: string;
  telefono?: string;
}

interface TurnoPropuesto {
  id: number;
  pacienteId: number;
  medicoId: number;
  fecha: string; // AAAA-MM-DD
  hora: string; // HH:mm
  confirmado: boolean;
  observaciones?: string;
}
```

En la API actual, el turno guarda `paciente` y `documento` como texto. La propuesta reemplaza esa repetición por `pacienteId`. No cambia por sí sola los turnos ya cargados: para usar este modelo habría que adaptar el servicio y los datos iniciales.

## ENDPOINT 1: REGISTRAR PACIENTE

**POST `/pacientes`**. Crea un paciente; no se envía `id` porque lo genera el servidor.

Body de ejemplo:

```json
{
  "dni": "30123456",
  "nombre": "Lucía",
  "apellido": "Pérez",
  "fechaNacimiento": "1992-04-17",
  "email": "lucia@example.com",
  "telefono": "3815551234"
}
```

Respuesta esperada: **201 Created**, con el paciente creado y su `id`.

```json
{
  "id": 1,
  "dni": "30123456",
  "nombre": "Lucía",
  "apellido": "Pérez",
  "fechaNacimiento": "1992-04-17",
  "email": "lucia@example.com",
  "telefono": "3815551234"
}
```

Si faltan datos obligatorios o los formatos no son válidos, respondería **400 Bad Request**. Si el DNI ya existe, **409 Conflict**.

## ENDPOINT 2: ASIGNAR TURNO

**POST `/turnos`**. Conserva el nombre de la ruta de turnos existente, pero propone un contrato nuevo basado en `pacienteId`. Este contrato requeriría adaptar el esquema y el servicio actuales antes de usarlo.

Body de ejemplo:

```json
{
  "pacienteId": 1,
  "medicoId": 2,
  "fecha": "2026-10-15",
  "hora": "09:30",
  "confirmado": false,
  "observaciones": "Primera consulta"
}
```

Respuesta esperada: **201 Created**, con el turno creado y su `id`.

```json
{
  "id": 104,
  "pacienteId": 1,
  "medicoId": 2,
  "fecha": "2026-10-15",
  "hora": "09:30",
  "confirmado": false,
  "observaciones": "Primera consulta"
}
```

Si el formato no es válido, respondería **400 Bad Request**. Si el paciente o el médico no existen, **404 Not Found**. Si el médico ya tiene un turno en esa fecha y hora, **409 Conflict**.

Un error de ejemplo mantendría el formato de la API:

```json
{
  "status": 404,
  "message": "No existe un paciente con ID 1.",
  "code": "NOT_FOUND",
  "details": []
}
```

## ORGANIZACIÓN PROPUESTA

En `routes` quedarían las URL y sus métodos HTTP. Los controladores recibirían la petición y prepararían la respuesta. Los esquemas Zod revisarían el body antes de continuar. Los servicios resolverían las reglas, como la existencia del paciente y la disponibilidad del médico. Los modelos definirían los tipos de datos. Esta separación permite cambiar cómo se guardan los datos sin rehacer las rutas.

Para probar el mockup primero crearía un paciente, guardaría el `id` devuelto y después enviaría ese `pacienteId` al crear el turno. Hasta implementar los dos endpoints nuevos y tomar capturas de Postman, estos JSON son ejemplos de diseño y no resultados de pruebas reales.
