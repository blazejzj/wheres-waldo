-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "waldoX" DOUBLE PRECISION NOT NULL,
    "waldoY" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);
