const express = require("express");
import { Request, Response } from "express";
const cors = require("cors");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.json({ status: "backend up!" });
});

// For simpilicty we're not going to add controllers or routers because not many paths.

app.post("/api/score", async (req: Request, res: Response) => {
    const { name, time, imageId } = req.body;
    if (!name || !time || !imageId)
        return res.status(400).json({ error: "Missing fields." });

    const score = await prisma.score.create({
        data: { name, time, imageId },
    });

    res.json({ success: true, score });
});

app.get("/api/leaderboard", async (req: Request, res: Response) => {
    const imageId = Number(req.query.imageId);
    if (!imageId) return res.status(400).json({ error: "Missing imadeId" });

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
