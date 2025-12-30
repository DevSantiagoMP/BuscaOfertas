import http from "k6/http";
import { check, sleep } from "k6";
import { randomString } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

export const options = {
  stages: [
    { duration: "20s", target: 10 },
    { duration: "20s", target: 25 },
    { duration: "20s", target: 50 },
    { duration: "20s", target: 75 },
    { duration: "20s", target: 0 },
  ],
};

const BASE_URL = "http://localhost:3000/api/auth";

export default function () {
  const email = `stress_${randomString(10)}@mail.com`;

  const payload = JSON.stringify({
    nombre: "Stress",
    apellidos: "Test",
    rol_id: 2,
    correo: email,
    password: "Password123",
  });

  const res = http.post(`${BASE_URL}/register`, payload, {
    headers: { "Content-Type": "application/json" },
  });

  check(res, {
    "status 201": (r) => r.status === 201,
  });

  sleep(1);
}
