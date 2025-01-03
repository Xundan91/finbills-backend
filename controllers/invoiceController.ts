import client from "../utils/client";

export const genInvoice = async (req: any, res: any) => {
  try {
    const buisnessId = req.params;
    const {} = req.body;
  } catch (err) {}
};

export const sellItem = async (req: any, res: any) => {
  try {
    const { itemName, hsn, unit, s_price, gst_rate, phone, productId } =
      req.body;

    if (!phone || !productId || !s_price || !gst_rate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const customer = await client.customer.findUnique({
      where: {
        phone,
      },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const product = await client.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const discountMultiplier = 1 - customer.discount / 100;
    const totalCostPrice =
      product.p_price * product.p_w_gst * discountMultiplier;

    const gstMultiplier = 1 + gst_rate / 100;
    const totalSellingPrice = product.s_price * product.s_w_gst * gstMultiplier;

    const profit = totalSellingPrice - totalCostPrice;

    res.status(200).json({
      itemName,
      totalCostPrice,
      totalSellingPrice,
      profit,
    });
  } catch (e) {
    console.error("Error in sellItem:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addCostumer = async (req: any, res: any) => {
  try {
  } catch (err) {}
};

export const getCostumer = async (req: any, res: any) => {
  try {
  } catch (err) {}
};

export const getAllCostumer = async (req: any, res: any) => {
  try {
  } catch (err) {}
};
