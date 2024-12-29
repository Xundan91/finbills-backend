// import { Request, Response } from 'express';
//todo : request and response sei error aa rha hai  


import { z } from 'zod';
import client from "../utils/client";


const GstRateEnum = z.enum(['ZERO'             
    , 'ZERO_POINT_ONE' ,  
    'ZERO_POINT_TWO_FIVE' ,
    'ONE_POINT_FIVE',
    'THREE',            
    'FIVE'  ,          
    'SIX' ,            
    'TWELVE'   ,        
    'THIRTEEN_POINT_EIGHT',
    'FOURTEEN'   ,     
    'EIGHTEEN'  ,       
    'TWENTY_EIGHT'   , 
    'TAX_EXEMPTED' ]);
const UnitEnum = z.enum( [
    'PIECE',
    'BOX',
    'PACKET',
    'PETI',
    'BOTTLE',
    'PACK',
    'SET',
    'GRAM',
    'KG',
    'BORA',
    'ML',
    'LITRE',
    'MILLIMETER',
    'CM',
    'M',
    'KM',
    'INCH',
    'FEET',
    'SQ_INCH',
    'SQ_FEET',
    'SQ_MT',
    'DOZEN',
    'BUNDLE',
    'POUCH',
    'CARAT',
    'POUND',
    'PAIR',
    'QUNITAL',
    'TON',
    'RATTI',
    'TROLLEY_TRUCK'
  ]);


const ProductSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  description: z.string().min(1, "Description is required"),
  p_price: z.number().optional().default(0),  
  p_w_gst: z.boolean().optional().default(false),
  s_price: z.number().optional().default(0), 
  s_w_gst: z.boolean().optional().default(false), 
  mrp: z.number().optional().default(0),     
  gst_rate: GstRateEnum.optional().default('ZERO'),
  barcode: z.string().min(1, "Barcode is required"),
  unit: UnitEnum.optional().default('PIECE'), 
  alert_quantity: z.number().optional().default(0), 
  opening_stock: z.number().optional().default(0), 
  op_stock_date: z.string().min(1, "Stock date is required"),  
  img_url: z.string().url("Invalid image URL"),
});


export const addProducts = async (req: any, res: any) => {
  try {
    const businessId = req.params.businessId; 
    const Id = Number(businessId);
    const data = req.body;

    const validatedData = ProductSchema.parse(data);
    const opStockDate = new Date(validatedData.op_stock_date);
    
    const addedItem = await client.product.create({
      data: {
        business: { connect: { id: Id } },
        itemName: validatedData.itemName,
        description: validatedData.description,
        p_price: validatedData.p_price,  
        p_w_gst: validatedData.p_w_gst,  
        s_price: validatedData.s_price,  
        s_w_gst: validatedData.s_w_gst,  
        mrp: validatedData.mrp,          
        gst_rate: validatedData.gst_rate,  
        barcode: validatedData.barcode,
        unit: validatedData.unit,        
        alert_quantity: validatedData.alert_quantity, 
        opening_stock: validatedData.opening_stock,  
        op_stock_date: opStockDate,
        img_url: validatedData.img_url,
      },
    });

    
    console.log('Product added:', addedItem);
    return res.status(201).json(addedItem);
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log('Validation error:', err.errors);
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }

    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
