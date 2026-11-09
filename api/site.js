import { db } from 'hatchable';
export const access='public';
export const methods=['GET'];
export default async function(req,res){
 const [settings,services,offers,gallery,reviews]=await Promise.all([
  db.query('SELECT setting_value FROM studio_settings WHERE setting_key=$1',['brand']),
  db.query('SELECT id,name,category,description,price_amount,price_note,image_url FROM studio_services WHERE is_published=true ORDER BY sort_order,id'),
  db.query('SELECT id,title,details,starts_at,ends_at FROM studio_offers WHERE is_published=true AND (starts_at IS NULL OR starts_at<=CURRENT_DATE) AND (ends_at IS NULL OR ends_at>=CURRENT_DATE) ORDER BY id DESC'),
  db.query('SELECT id,title,image_url,category,is_real_studio_work FROM studio_gallery WHERE is_published=true ORDER BY sort_order,id'),
  db.query('SELECT id,customer_name,review_text,rating FROM studio_reviews WHERE is_published=true ORDER BY id DESC')
 ]);
 res.json({settings:settings.rows[0]?.setting_value||null,services:services.rows,offers:offers.rows,gallery:gallery.rows,reviews:reviews.rows});
}