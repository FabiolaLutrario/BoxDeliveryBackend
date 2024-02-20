import supertest from "supertest";
import app from "../../server";

const api = supertest(app);

test("primer test example", async () => {
  await api.get("/health").expect(200);
});
