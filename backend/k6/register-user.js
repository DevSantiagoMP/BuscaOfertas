import http from "k6/http";
import { check, sleep } from "k6";
import { randomString } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

export const options = {
  vus: 5,
  duration: "20s",
};

const BASE_URL = "http://localhost:3000/api/auth";

export default function () {
  const email = `test_${randomString(8)}@mail.com`;

  const payload = JSON.stringify({
    nombre: "Usuario",
    apellidos: "Prueba",
    rol_id: 2,
    correo: email,
    password: "Password123",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(`${BASE_URL}/register`, payload, params);

  check(res, {
    "status es 201": (r) => r.status === 201,
    "respuesta < 1s": (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
