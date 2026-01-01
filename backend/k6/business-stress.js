import http from "k6/http";
import { check, sleep } from "k6";

// CONFIGURACIÓN - STRESS TEST
export const options = {
  scenarios: {
    stress_business: {
      executor: "ramping-vus",
      stages: [
        { duration: "30s", target: 20 },   // calentamiento
        { duration: "30s", target: 50 },   // carga alta
        { duration: "30s", target: 100 },  // estrés
        { duration: "30s", target: 150 },  // ruptura
        { duration: "30s", target: 0 },    // enfriamiento
      ],
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.10"],        // permitimos hasta 10% en estrés
    http_req_duration: ["p(95)<2000"],     // p95 < 2s bajo estrés
  },
};

// VARIABLES
const BASE_URL = "http://localhost:3000/api/business";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicm9sIjoyLCJjb3JyZW8iOiJidXNjYW9mZXJ0YXNwcnVlYmFAZ21haWwuY29tIiwiaWF0IjoxNzY3MTExMTQxLCJleHAiOjE3NjcxOTc1NDF9.WnrbjAp2Dvs7bwJNXV8igSqK6b6dU0L9vrxGbRiC5WY";

const headers = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
};

// TEST PRINCIPAL
export default function () {

  // GET todos los negocios
  const resGetAll = http.get(`${BASE_URL}`, headers);
  check(resGetAll, {
    "GET /business 200": (r) => r.status === 200,
  });

  // GET por categoría
  const categoriaId = 1;
  const resCategoria = http.get(
    `${BASE_URL}/categoria/${categoriaId}`,
    headers
  );
  check(resCategoria, {
    "GET /business/categoria 200": (r) => r.status === 200,
  });

  // GET mi negocio
  const resMyBusiness = http.get(`${BASE_URL}/me`, headers);
  check(resMyBusiness, {
    "GET /business/me 200": (r) => r.status === 200,
  });

  // GET negocio por ID
  const negocioId = 10;
  const resById = http.get(`${BASE_URL}/${negocioId}`, headers);
  check(resById, {
    "GET /business/:id 200": (r) => r.status === 200,
  });

  sleep(1);
}
