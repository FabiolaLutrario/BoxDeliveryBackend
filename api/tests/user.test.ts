import supertest from "supertest";
import app from "../../server";

const api = supertest(app);

describe("Test endpoints user", () => {
  test("should return a status 200 and a message", async () => {
    const response = await api.get("/health");
    expect(response.status).toBe(200);
    expect(response.text).toBe("The server is up and healthy 😀");
  });
});
