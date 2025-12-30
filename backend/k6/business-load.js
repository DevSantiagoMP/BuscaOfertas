import http from "k6/http";
import { check, sleep } from "k6";

// ---------------------------
// CONFIGURACIÓN
// ---------------------------
export const options = {
  scenarios: {
    stress_business: {
      executor: "constant-vus",
      vus: 20,          // usuarios concurrentes
      duration: "30s",  // duración
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.05"],   // menos del 5% de errores
    http_req_duration: ["p(95)<1000"] // 95% < 1s
  }
};

// ---------------------------
// VARIABLES
// ---------------------------
const BASE_URL = "http://localhost:3000/api/business";

// ⚠️ Usa un token REAL generado previamente
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicm9sIjoyLCJjb3JyZW8iOiJidXNjYW9mZXJ0YXNwcnVlYmFAZ21haWwuY29tIiwiaWF0IjoxNzY3MTExMTQxLCJleHAiOjE3NjcxOTc1NDF9.WnrbjAp2Dvs7bwJNXV8igSqK6b6dU0L9vrxGbRiC5WY";

const headers = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
};

// ---------------------------
// TEST PRINCIPAL
// ---------------------------
export default function () {

  // 1️⃣ Obtener todos los negocios
  const resGetAll = http.get(`${BASE_URL}`, headers);
  check(resGetAll, {
    "GET /business status 200": (r) => r.status === 200,
  });

  // 2️⃣ Obtener negocios por categoría
  const categoriaId = 1;
  const resCategoria = http.get(
    `${BASE_URL}/categoria/${categoriaId}`,
    headers
  );
  check(resCategoria, {
    "GET /business/categoria status 200": (r) => r.status === 200,
  });

  // 3️⃣ Obtener mi negocio
  const resMyBusiness = http.get(`${BASE_URL}/me`, headers);
  check(resMyBusiness, {
    "GET /business/me status 200": (r) => r.status === 200,
  });

  // 4️⃣ Obtener negocio por ID
  const negocioId = 10;
  const resById = http.get(`${BASE_URL}/${negocioId}`, headers);
  check(resById, {
    "GET /business/:id status 200": (r) => r.status === 200,
  });

  sleep(1);
}
