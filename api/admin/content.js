import { db } from 'hatchable';
export const access='admin';
export const methods=['GET','POST','PUT','DELETE'];
const tables={services:{table:'studio_services',fields:['name','category','description','price_amount','price_note','image_url','is_published','sort_order']},offers:{table:'studio_offers',fields:['title','details','starts_at','ends_at','is_published']},gallery:{table:'studio_gallery',fields:['title','image_url','category','is_real_studio_work','is_published','sort_order']},reviews:{table:'studio_reviews',fields:['customer_name','review_text','rating','is_published']}};
export default async function(req,res){
 const type=String(req.query.type||req.body?.type||'');
 const cfg=tables[type]; if(!cfg&&type!=='bookings')return res.status(400).json({error:'Unknown content type.'});
 if(req.method==='GET'){
  if(type==='bookings'){const b=await db.query('SELECT * FROM studio_bookings ORDER BY created_at DESC LIMIT 250');return res.json({items:b.rows});}
  const r=await db.query('SELECT * FROM '+cfg.table+' ORDER BY created_at DESC LIMIT 250');
  return res.json({items:r.rows});
 }
 if(type==='bookings'){
  if(req.method==='PUT'){
   const id=Number(req.body?.id),status=String(req.body?.status||'');
   if(!Number.isInteger(id)||!['new','contacted','confirmed','completed','cancelled'].includes(status))return res.status(400).json({error:'Invalid booking update.'});
   await db.query('UPDATE studio_bookings SET status=$1 WHERE id=$2',[status,id]);return res.json({ok:true});
  }
  return res.status(405).json({error:'Bookings can only be updated.'});
 }
 if(req.method==='POST'){
  const values=cfg.fields.map(k=>{const v=req.body?.[k]??null;if(['starts_at','ends_at'].includes(k)&&v==='')return null;return v;});
  const required=type==='services'?['name','category']:type==='offers'?['title']:type==='gallery'?['title','image_url']:['customer_name','review_text'];
  if(required.some(k=>!String(req.body?.[k]??'').trim()))return res.status(400).json({error:'Please complete the required fields.'});
  const cols=cfg.fields.join(',');
  const placeholders=cfg.fields.map((_,i)=>'$'+(i+1)).join(',');
  const r=await db.query('INSERT INTO '+cfg.table+' ('+cols+') VALUES ('+placeholders+') RETURNING *',values);
  return res.status(201).json({item:r.rows[0]});
 }
 if(req.method==='PUT'){
  const id=Number(req.body?.id);if(!Number.isInteger(id))return res.status(400).json({error:'A valid item ID is required.'});
  const fields=cfg.fields.filter(k=>Object.prototype.hasOwnProperty.call(req.body||{},k));
  if(!fields.length)return res.status(400).json({error:'No changes supplied.'});
  const vals=fields.map(k=>req.body[k]);vals.push(id);
  const stamp=['services','offers'].includes(type)?',updated_at=now()':'';
  await db.query('UPDATE '+cfg.table+' SET '+fields.map((k,i)=>k+'=$'+(i+1)).join(',')+stamp+' WHERE id=$'+vals.length,vals);
  return res.json({ok:true});
 }
 if(req.method==='DELETE'){
  const id=Number(req.body?.id);if(!Number.isInteger(id))return res.status(400).json({error:'A valid item ID is required.'});
  await db.query('DELETE FROM '+cfg.table+' WHERE id=$1',[id]);return res.json({ok:true});
 }
 res.status(405).json({error:'Method not allowed.'});
}