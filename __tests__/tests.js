const app = require("../app");
const request = require("supertest");
const db = require("../models/index");
let server, agent;

describe("THE TESTS FOR LMS APPLICATION ", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });
  
  test("TEST FOR SUCCESSFUL CREATION OF A USER", async () => {
    const response = await agent.post("/user-signup").send({
      userName: "hello",
      firstName: "sagun",
      lastName: "Varma",
      email: "hselssldgmail.com",
      password: "1234565"
    });
    expect(response.status).toBe(200);
    const userData = response.body;
    expect(userData.userName).toBe("hello");
  });
  


});
