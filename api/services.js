import { db } from 'hatchable';
export const access = 'public';
export const methods = ['GET'];
export default async function(req,res){
 const r=await db.query("SELECT id,name,category,description,price_amount,price_note,image_url FROM studio_services WHERE is_published=true ORDER BY sort_order,id");
 res.json({services:r.rows});
}