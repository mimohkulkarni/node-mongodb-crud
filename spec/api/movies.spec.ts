import supertest from "supertest";
import { startDBServer, stopDBServer } from "../utils/server";
import app from "../../app";

describe("Movies API", () => {
  const request = supertest(app);
  beforeAll(async () => {
    await startDBServer();
  });

  afterEach(async () => {
    await stopDBServer();
  });

  it("Should add a new movie", async () => {
    const { status: adminStatus, body: adminBody } = await request.get(
      "/get-admin-token"
    );

    expect(adminStatus).toBe(200);
    expect(adminBody.token).toBeDefined();
    const token = adminBody.token;

    const { status, body } = await request
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Mimoh",
        genre: "Comedy1",
        year: 2024,
        streamingLink: "google.com",
      });

    expect(status).toBe(201);
    expect(body._id).toBeDefined();
    expect(body.title).toBe("Mimoh");
    expect(body.genre).toBe("Comedy1");
    expect(body.year).toBe(2024);
    expect(body.streamingLink).toBe("google.com");
  });

  it("Should show all the movies", async () => {
    const { status: adminStatus, body: adminBody } = await request.get(
      "/get-admin-token"
    );

    expect(adminStatus).toBe(200);
    expect(adminBody.token).toBeDefined();
    const token = adminBody.token;

    const { status: status1 } = await request
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Mimoh",
        genre: "Comedy",
        year: 2024,
        streamingLink: "google.com",
      });

    expect(status1).toBe(201);

    const { status: status2 } = await request
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Mimoh1",
        genre: "Comedy1",
        year: 2023,
        streamingLink: "google1.com",
      });

    expect(status2).toBe(201);

    const { status, body } = await request.get("/movies");

    expect(status).toBe(200);
    expect(body.length).toBe(2);
    expect(body[0].title).toBe("Mimoh");
    expect(body[1].title).toBe("Mimoh1");
  });

  it("Should update a movie", async () => {
    const { status: adminStatus, body: adminBody } = await request.get(
      "/get-admin-token"
    );

    expect(adminStatus).toBe(200);
    expect(adminBody.token).toBeDefined();
    const token = adminBody.token;

    const { status: status1 } = await request
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Mimoh",
        genre: "Comedy",
        year: 2024,
        streamingLink: "google.com",
      });

    expect(status1).toBe(201);

    const { status: status2, body: body2 } = await request.get("/movies");

    expect(status2).toBe(200);
    expect(body2.length).toBe(1);
    expect(body2[0].title).toBe("Mimoh");

    const { status, body } = await request
      .put(`/movies/${body2[0]._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Mimoh1",
        genre: "Comedy1",
        year: 2024,
        streamingLink: "google.com",
      });

    expect(status).toBe(200);
    expect(body.title).toBe("Mimoh1");
  });

  it("Should delete a movie", async () => {
    const { status: adminStatus, body: adminBody } = await request.get(
      "/get-admin-token"
    );

    expect(adminStatus).toBe(200);
    expect(adminBody.token).toBeDefined();
    const token = adminBody.token;

    const { status: status1 } = await request
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Mimoh",
        genre: "Comedy",
        year: 2024,
        streamingLink: "google.com",
      });

    expect(status1).toBe(201);

    const { status: status2, body: body2 } = await request.get("/movies");

    expect(status2).toBe(200);
    expect(body2.length).toBe(1);
    expect(body2[0].title).toBe("Mimoh");

    const { status } = await request
      .delete(`/movies/${body2[0]._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(status).toBe(200);

    const { status: status3, body: body3 } = await request.get("/movies");

    expect(status3).toBe(200);
    expect(body3.length).toBe(0);
  });

  it("Should search a movie", async () => {
    const { status: adminStatus, body: adminBody } = await request.get(
      "/get-admin-token"
    );

    expect(adminStatus).toBe(200);
    expect(adminBody.token).toBeDefined();
    const token = adminBody.token;

    const { status: status1 } = await request
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Mimoh",
        genre: "Comedy",
        year: 2024,
        streamingLink: "google.com",
      });

    expect(status1).toBe(201);

    const { status: status2, body: body2 } = await request.get("/movies");

    expect(status2).toBe(200);
    expect(body2.length).toBe(1);

    const { status, body } = await request.get(`/movies?query=mim`);

    expect(status).toBe(200);
    expect(body.length).toBe(1);
    expect(body[0].title).toBe("Mimoh");
  });

  it("Should throw error if create a movie for invalid data", async () => {
    const { status: adminStatus, body: adminBody } = await request.get(
      "/get-admin-token"
    );

    expect(adminStatus).toBe(200);
    const token = adminBody.token;

    const { status, body } = await request
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        genre: "Comedy",
        year: 2024,
        streamingLink: "google.com",
      });

    expect(status).toBe(400);
    expect(body.message).toBe("Invalid data");
  });

  it("Should throw error if movie not found for update", async () => {
    const { status: adminStatus, body: adminBody } = await request.get(
      "/get-admin-token"
    );

    expect(adminStatus).toBe(200);
    const token = adminBody.token;

    const { status: status1, body: body1 } = await request
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Mimoh",
        genre: "Comedy",
        year: 2024,
        streamingLink: "google.com",
      });

    expect(status1).toBe(201);

    const { status: status2, body: body2 } = await request
      .delete(`/movies/${body1._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(status2).toBe(200);
    expect(body2.message).toBe("Movie deleted successfully");

    const { status, body } = await request
      .put(`/movies/${body1._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Mimoh1",
        genre: "Comedy1",
        year: 2023,
        streamingLink: "google1.com",
      });

    expect(status).toBe(400);
    expect(body.message).toBe("Movie not found");
  });
});
