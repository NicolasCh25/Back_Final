const request = require("supertest");
const app = require("../app.cjs"); // ahora te explico esto

describe("Login administrador", () => {
  test("Debe devolver token al loguearse correctamente", async () => {
    const res = await request(app)
      .post("/api/administrador/login")
      .send({
        email: "edison.escobar01@epn.edu.ec",
        password: "123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
