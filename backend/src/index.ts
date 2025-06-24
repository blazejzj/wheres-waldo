import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"],
    })
);

app.get("/", (req, res) => {
    res.json({ status: "backend up!" });
});

app.post("/api/score", async (req, res) => {
    const { name, time, imageId } = req.body;
    if (!name || !time || !imageId) {
        res.status(400).json({ error: "Missing fields." });
        return;
    }
    const score = await prisma.score.create({
        data: { name, time, imageId },
    });
    res.json({ success: true, score });
});

app.get("/api/leaderboard", async (req, res) => {
    const imageId = Number(req.query.imageId as string);
    if (!imageId) {
        res.status(400).json({ error: "Missing imageId" });
        return;
    }
    const scores = await prisma.score.findMany({
        where: { imageId },
        orderBy: { time: "asc" },
        take: 10,
    });
    res.json({ scores });
});

app.post("/api/check", async (req, res) => {
    const { imageId, x, y } = req.body;
    if (!imageId || typeof x !== "number" || typeof y !== "number") {
        res.status(400).json({ error: "Missing fields" });
        return;
    }
    const image = await prisma.image.findUnique({ where: { id: imageId } });
    if (!image) {
        res.status(404).json({ error: "Image not found" });
        return;
    }
    const RADIUS = 0.03;
    const dx = image.waldoX - x;
    const dy = image.waldoY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    res.json({ correct: distance < RADIUS });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("Server running");
});

// waldo locations:
// id 1: Clicked image at (natural px): 3248 1239
// id 2: Clicked image at (natural px): 557 1840
// id 3: Clicked image at (natural px): 3083 907
// id 4: Clicked image at (natural px): 182 1598

// img dims
// id 1:  3538 x 2223
// id 2: 3536 x 2227
// id 3: 3566 x 2257
// id 4: 3549 x 2224
