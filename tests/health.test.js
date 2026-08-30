import test from "node:test";
import assert from "node:assert";
import request from "supertest";

import { app } from "../index.js";


// =====================================
// Health Check Test
// =====================================

test("GET /api/health should return healthy status", async () => {

    const response =
        await request(app)
            .get("/api/health");

    assert.strictEqual(
        response.statusCode,
        200
    );

    assert.strictEqual(
        response.body.status,
        "UP"
    );

    assert.strictEqual(
        response.body.message,
        "Application is healthy"
    );

});


// =====================================
// Root API Test
// =====================================

test("GET /api should return application information", async () => {

    const response =
        await request(app)
            .get("/api");

    assert.strictEqual(
        response.statusCode,
        200
    );

    assert.strictEqual(
        response.body.application,
        "DevOps Dashboard"
    );

});


// =====================================
// Message API Test
// =====================================

test("GET /api/message should return success", async () => {

    const response =
        await request(app)
            .get("/api/message");

    assert.strictEqual(
        response.statusCode,
        200
    );

    assert.strictEqual(
        response.body.status,
        "success"
    );

});


// =====================================
// 404 Test
// =====================================

test("Unknown route should return 404", async () => {

    const response =
        await request(app)
            .get("/does-not-exist");

    assert.strictEqual(
        response.statusCode,
        404
    );

    assert.strictEqual(
        response.body.status,
        "error"
    );

});
