import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("Server running");
});
