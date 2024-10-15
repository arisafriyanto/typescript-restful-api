import supertest from "supertest";
import { ContactTest, UserTest } from "./test-util";
import { app } from "../src/applications/app";
import { logger } from "../src/applications/logging";

describe("POST /api/contacts", function () {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should create new contact", async () => {
        const response = await supertest(app)
            .post("/api/contacts")
            .set("X-API-TOKEN", "test")
            .send({
                first_name: "aris",
                last_name: "apriyanto",
                email: "aris@example.com",
                phone: "08123456789",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe("aris");
        expect(response.body.data.last_name).toBe("apriyanto");
        expect(response.body.data.email).toBe("aris@example.com");
        expect(response.body.data.phone).toBe("08123456789");
    });

    it("should reject create new contact if data is invalid", async () => {
        const response = await supertest(app)
            .post("/api/contacts")
            .set("X-API-TOKEN", "test")
            .send({
                first_name: "",
                last_name: "",
                email: "",
                phone: "08876666666666666666666666",
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe("GET /api/contacts/:contactId", function () {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to get contact by id", async () => {
        const contact = await ContactTest.get();
        const response = await supertest(app)
            .get(`/api/contacts/${contact.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe(contact.first_name);
        expect(response.body.data.last_name).toBe(contact.last_name);
        expect(response.body.data.email).toBe(contact.email);
        expect(response.body.data.phone).toBe(contact.phone);
    });

    it("should reject get contact if contact is not found", async () => {
        const contact = await ContactTest.get();
        const response = await supertest(app)
            .get(`/api/contacts/${contact.id + 1}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe("PUT /api/contacts/:contactId", () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to update contact", async () => {
        const contact = await ContactTest.get();
        const response = await supertest(app)
            .put(`/api/contacts/${contact.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                first_name: "aris",
                last_name: "apriyanto",
                email: "aris@example.com",
                phone: "08123456789",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(contact.id);
        expect(response.body.data.first_name).toBe("aris");
        expect(response.body.data.last_name).toBe("apriyanto");
        expect(response.body.data.email).toBe("aris@example.com");
        expect(response.body.data.phone).toBe("08123456789");
    });

    it("should reject update contact if request is invalid", async () => {
        const contact = await ContactTest.get();
        const response = await supertest(app)
            .put(`/api/contacts/${contact.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                first_name: "",
                last_name: "",
                email: "aris",
                phone: "",
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe("DELETE /api/contacts/:contactId", () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to remove contact", async () => {
        const contact = await ContactTest.get();
        const response = await supertest(app)
            .delete(`/api/contacts/${contact.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");
    });

    it("should reject remove contact if contact is not found", async () => {
        const contact = await ContactTest.get();
        const response = await supertest(app)
            .delete(`/api/contacts/${contact.id + 1}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe("GET /api/contacts", function () {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to search contact", async () => {
        const response = await supertest(app).get("/api/contacts").set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
    });

    it("should be able to search contact using name", async () => {
        const response = await supertest(app)
            .get("/api/contacts")
            .query({
                name: "es",
            })
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
    });

    it("should be able to search contact using email", async () => {
        const response = await supertest(app)
            .get("/api/contacts")
            .query({
                email: ".com",
            })
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
    });

    it("should be able to search contact using phone", async () => {
        const response = await supertest(app)
            .get("/api/contacts")
            .query({
                phone: "123",
            })
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
    });

    it("should be able to search contact no result", async () => {
        const response = await supertest(app)
            .get("/api/contacts")
            .query({
                name: "salah",
            })
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(0);
        expect(response.body.paging.size).toBe(10);
    });

    it("should be able to search contact with paging", async () => {
        const response = await supertest(app)
            .get("/api/contacts")
            .query({
                page: 2,
                size: 1,
            })
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.current_page).toBe(2);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(1);
    });
});
