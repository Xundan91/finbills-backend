/*
  Warnings:

  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - Added the required column `itemName` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `op_stock_date` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opening_stock` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GstRate" AS ENUM ('ZERO', 'ZERO_POINT_ONE', 'ZERO_POINT_TWO_FIVE', 'ONE_POINT_FIVE', 'THREE', 'FIVE', 'SIX', 'TWELVE', 'THIRTEEN_POINT_EIGHT', 'FOURTEEN', 'EIGHTEEN', 'TWENTY_EIGHT', 'TAX_EXEMPTED');

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('PIECE', 'BOX', 'PACKET', 'PETI', 'BOTTLE', 'PACK', 'SET', 'GRAM', 'KG', 'BORA', 'ML', 'LITRE', 'MILLIMETER', 'CM', 'M', 'KM', 'INCH', 'FEET', 'SQ_INCH', 'SQ_FEET', 'SQ_MT', 'DOZEN', 'BUNDLE', 'POUCH', 'CARAT', 'POUND', 'PAIR', 'QUNITAL', 'TON', 'RATTI', 'TROLLEY_TRUCK');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "name",
DROP COLUMN "price",
DROP COLUMN "stock",
ADD COLUMN     "alert_quantity" DOUBLE PRECISION,
ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "gst_rate" "GstRate",
ADD COLUMN     "hsn" TEXT,
ADD COLUMN     "img_url" TEXT,
ADD COLUMN     "itemName" TEXT NOT NULL,
ADD COLUMN     "mrp" DOUBLE PRECISION,
ADD COLUMN     "op_stock_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "opening_stock" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "p_price" DOUBLE PRECISION,
ADD COLUMN     "p_w_gst" BOOLEAN DEFAULT false,
ADD COLUMN     "s_price" DOUBLE PRECISION,
ADD COLUMN     "s_w_gst" BOOLEAN DEFAULT false,
ADD COLUMN     "unit" "Unit" NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
