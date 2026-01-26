import http from "k6/http";
import { check, sleep } from "k6";

const BACKEN_URL = process.env.BACKEN_URL;

// CONFIGURACIÓN - PUT STRESS
export const options = {
  scenarios: {
    put_stress: {
      executor: "ramping-vus",
      stages: [
        { duration: "20s", target: 10 },   // calentamiento
        { duration: "20s", target: 30 },   // carga
        { duration: "20s", target: 60 },   // estrés
        { duration: "20s", target: 100 },  // ruptura
        { duration: "20s", target: 0 },    // enfriamiento
      ],
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.15"],      // permitimos más errores
    http_req_duration: ["p(95)<3000"],   // escrituras son más lentas
  },
};

// VARIABLES
const BASE_URL = `${BACKEN_URL}/api/business`;

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicm9sIjoyLCJjb3JyZW8iOiJidXNjYW9mZXJ0YXNwcnVlYmFAZ21haWwuY29tIiwiaWF0IjoxNzY3MTExMTQxLCJleHAiOjE3NjcxOTc1NDF9.WnrbjAp2Dvs7bwJNXV8igSqK6b6dU0L9vrxGbRiC5WY";

const headers = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
};

// GENERADOR DE PAYLOAD
function buildPayload() {
  return JSON.stringify({
    foto_url: "https://mis-fotos.com/stress.jpg",
    nombre: `Negocio PUT ${__VU}-${__ITER}`,
    descripcion: "Stress test PUT concurrente",
    ciudad: "Bogotá",
    direccion: "Calle stress 123",
    telefono: "3000000000",
    categoria_id: 10
  });
}

// TEST PRINCIPAL
export default function () {

  const payload = buildPayload();

  const res = http.put(
    `${BASE_URL}/mi-negocio`,
    payload,
    headers
  );

  check(res, {
    "PUT /mi-negocio 200": (r) => r.status === 200,
  });

  sleep(0.5);
}
