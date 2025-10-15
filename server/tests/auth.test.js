
import request from "supertest";
import app from "../server.js"; 
describe("Auth", () => {
  it("should respond 400 without body", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.statusCode).toBe(400);
  });
});
