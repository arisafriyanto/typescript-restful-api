import supertest from "supertest";
import { AddressTest, ContactTest, UserTest } from "./test-util";
import { app } from "../src/applications/app";
import { logger } from "../src/applications/logging";

describe("POST /api/contact/:contactId/addresses", () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to create address", async () => {
        const contact = await ContactTest.get();

        const response = await supertest(app)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "Jln. Jendral Sudirman",
                city: "Bandung",
                province: "Jawa Barat",
                country: "Indonesia",
                postal_code: "12345",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.street).toBe("Jln. Jendral Sudirman");
        expect(response.body.data.city).toBe("Bandung");
        expect(response.body.data.province).toBe("Jawa Barat");
        expect(response.body.data.country).toBe("Indonesia");
        expect(response.body.data.postal_code).toBe("12345");
    });

    it("should be able to create address with only field required", async () => {
        const contact = await ContactTest.get();

        const response = await supertest(app)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set("X-API-TOKEN", "test")
            .send({
                country: "Indonesia",
                postal_code: "12345",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.country).toBe("Indonesia");
        expect(response.body.data.postal_code).toBe("12345");
    });

    it("should reject create address if request is invalid", async () => {
        const contact = await ContactTest.get();

        const response = await supertest(app)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "Jln. Jendral Sudirman",
                city: "Bandung",
                province: "Jawa Barat",
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject create address if token is invalid", async () => {
        const contact = await ContactTest.get();

        const response = await supertest(app)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set("X-API-TOKEN", "salah")
            .send({
                street: "Jln. Jendral Sudirman",
                city: "Bandung",
                province: "Jawa Barat",
                country: "Indonesia",
                postal_code: "12345",
            });

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject create address if contact id is not found", async () => {
        const contact = await ContactTest.get();

        const response = await supertest(app)
            .post(`/api/contacts/${contact.id + 1}/addresses`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "Jln. Jendral Sudirman",
                city: "Bandung",
                province: "Jawa Barat",
                country: "Indonesia",
                postal_code: "12345",
            });

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe("GET /api/contact/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to get address", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(app)
            .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.street).toBe(address.street);
        expect(response.body.data.city).toBe(address.city);
        expect(response.body.data.province).toBe(address.province);
        expect(response.body.data.country).toBe(address.country);
        expect(response.body.data.postal_code).toBe(address.postal_code);
    });

    it("should reject get address if contact id is not found", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(app)
            .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject get address if address id is not found", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(app)
            .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject get address if request is invalid", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(app)
            .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "salah");

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});

describe("PUT /api/contact/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to update address", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(app)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "Jln. Pasar Baru",
                city: "Jakarta",
                province: "DKI Jakarta",
                country: "Indonesia",
                postal_code: "54321",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(address.id);
        expect(response.body.data.street).toBe("Jln. Pasar Baru");
        expect(response.body.data.city).toBe("Jakarta");
        expect(response.body.data.province).toBe("DKI Jakarta");
        expect(response.body.data.country).toBe("Indonesia");
        expect(response.body.data.postal_code).toBe("54321");
    });

    it("should reject update address if contact id is not found", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(app)
            .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "Jln. Pasar Baru",
                city: "Jakarta",
                province: "DKI Jakarta",
                country: "Indonesia",
                postal_code: "54321",
            });

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject update address if address id is not found", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(app)
            .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "Jln. Pasar Baru",
                city: "Jakarta",
                province: "DKI Jakarta",
                country: "Indonesia",
                postal_code: "54321",
            });

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject update address if data is invalid", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(app)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "Jln. Pasar Baru",
                city: "Jakarta",
                province: "DKI Jakarta",
                country: "",
                postal_code: "",
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe("DELETE /api/contact/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to remove address", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(app)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");
    });

    it("should reject remove address if contact id is not found", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(app)
            .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject remove address if address id is not found", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(app)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe("GET /api/contact/:contactId/addresses", () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to list addresses", async () => {
        const contact = await ContactTest.get();

        const response = await supertest(app)
            .get(`/api/contacts/${contact.id}/addresses`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
    });

    it("should reject list addresses if contact id is not found", async () => {
        const contact = await ContactTest.get();

        const response = await supertest(app)
            .get(`/api/contacts/${contact.id + 1}/addresses`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});
