import supertest from "supertest";
import { app } from "../src/applications/app";
import { logger } from "../src/applications/logging";
import { UserTest } from "./test-util";
import bcrypt from "bcrypt";

describe("POST /api/users", function () {
    afterEach(async () => {
        await UserTest.delete();
    });

    it("should reject register new user if request is invalid", async () => {
        const response = await supertest(app).post("/api/users").send({
            username: "",
            password: "",
            name: "",
        });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it("should register new user", async () => {
        const response = await supertest(app).post("/api/users").send({
            username: "test",
            password: "secret",
            name: "Test",
        });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("Test");
    });
});

describe("POST /api/users/login", function () {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it("should be able to login", async () => {
        const response = await supertest(app).post("/api/users/login").send({
            username: "test",
            password: "secret",
        });

        logger.debug(response);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.token).toBeDefined();
    });

    it("should reject login user if username is wrong", async () => {
        const response = await supertest(app).post("/api/users/login").send({
            username: "salah",
            password: "secret",
        });

        logger.debug(response);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject login user if password is wrong", async () => {
        const response = await supertest(app).post("/api/users/login").send({
            username: "test",
            password: "wrong-secret",
        });

        logger.debug(response);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});

describe("GET /api/users/current", function () {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it("should be able to get user", async () => {
        const response = await supertest(app).get("/api/users/current").set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("Test");
    });

    it("should reject get user if token is invalid", async () => {
        const response = await supertest(app).get("/api/users/current").set("X-API-TOKEN", "salah");

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});

describe("PATCH /api/users/current", function () {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it("should reject update user if request is invalid", async () => {
        const response = await supertest(app)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "test")
            .send({
                password: "",
                name: "",
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject update user if token is wrong", async () => {
        const response = await supertest(app)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "salah")
            .send({
                password: "new-secret",
                name: "Aris",
            });

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

    it("should be able to update user name", async () => {
        const response = await supertest(app)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "test")
            .send({
                name: "Test",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("Test");
    });

    it("should be able to update user password", async () => {
        const response = await supertest(app)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "test")
            .send({
                password: "new-password",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);

        const user = await UserTest.get();
        expect(await bcrypt.compare("new-password", user.password)).toBe(true);
    });
});

describe("DELETE /api/users/current", function () {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it("should be able to logout user", async () => {
        const response = await supertest(app)
            .delete("/api/users/current")
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");

        const user = await UserTest.get();
        expect(user.token).toBeNull();
    });

    it("should reject logout user if token is wrong", async () => {
        const response = await supertest(app)
            .delete("/api/users/current")
            .set("X-API-TOKEN", "salah");

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});
