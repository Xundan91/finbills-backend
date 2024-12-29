import client from "../utils/client";

export const addBusiness = async (req: any, res: any) => {
  try {
    const { b_name, address, email, phone } = req.body;

   
    if (!email || !phone || !b_name) {
      return res.status(400).json({
        message: 'Mandatory fields are required!',
      });
    }

   
    const existingBusiness = await client.business.findUnique({
      where: { email },
    });

    if (existingBusiness) {
      return res.status(409).json({
        message: 'Business with the same email already exists!',
      });
    }

  
    const newBusiness = await client.business.create({
      data: {
        b_name,
        address,
        email,
        phone,
      },
    });

    return res.status(201).json({
      message: 'Business added successfully!',
      business: newBusiness,
    });
  } catch (error) {
    console.error('Error in addBusiness:', error);
    return res.status(500).json({
      message: 'Error adding business!',
    });
  }
};
