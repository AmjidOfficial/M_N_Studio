import { db } from 'hatchable';
export const access = 'public';
export const methods = ['POST'];
export default async function(req,res){
  const b=req.body||{};
  const name=typeof b.name==='string'?b.name.trim():'';
  const phone=typeof b.phone==='string'?b.phone.trim():'';
  const interest=typeof b.interest==='string'?b.interest.trim():'';
  const notes=typeof b.notes==='string'?b.notes.trim():'';
  const date=typeof b.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(b.date)?b.date:null;
  if(name.length<2||name.length>80) return res.status(400).json({error:'Please enter a valid name.'});
  if(phone.length<7||phone.length>24) return res.status(400).json({error:'Please enter a valid phone number.'});
  if(!['Makeup enquiry','Nails enquiry','General beauty enquiry'].includes(interest)) return res.status(400).json({error:'Please choose a valid enquiry type.'});
  if(notes.length>1000) return res.status(400).json({error:'Notes are too long.'});
  const r=await db.query('INSERT INTO studio_bookings (customer_name,phone,interest,preferred_date,notes) VALUES ($1,$2,$3,$4,$5) RETURNING id,created_at',[name,phone,interest,date,notes]);
  res.status(201).json({ok:true,booking_id:r.rows[0].id,created_at:r.rows[0].created_at,notice:'Enquiry received. The studio must confirm availability separately.'});
}