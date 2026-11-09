import { db } from 'hatchable';
export const access='admin';
export const methods=['GET','PUT'];
const defaults={name:'Makeup & Nails Studio',location:'Hayatabad, Peshawar, Pakistan',whatsapp:'+92 317 5545838',tiktok:'https://www.tiktok.com/@makeup_nailsstudio987',primary:'#5b1124',accent:'#c9a054',background:'#f5f3f0',tagline:'Your beauty. Your moment. Your way.'};
export default async function(req,res){
 if(req.method==='GET'){
  const r=await db.query('SELECT setting_value FROM studio_settings WHERE setting_key=$1',['brand']);
  return res.json({settings:{...defaults,...(r.rows[0]?.setting_value||{})}});
 }
 const allowed=Object.keys(defaults);const clean={};
 for(const k of allowed)if(typeof req.body?.[k]==='string'&&req.body[k].length<500)clean[k]=req.body[k].trim();
 for(const k of ['primary','accent','background'])if(clean[k]&&!/^#[0-9a-fA-F]{6}$/.test(clean[k]))return res.status(400).json({error:'Use a valid six-digit HEX colour.'});
 const current=await db.query('SELECT setting_value FROM studio_settings WHERE setting_key=$1',['brand']);
 const merged={...defaults,...(current.rows[0]?.setting_value||{}),...clean};
 await db.query("INSERT INTO studio_settings(setting_key,setting_value,updated_at) VALUES($1,$2::jsonb,now()) ON CONFLICT(setting_key) DO UPDATE SET setting_value=$2::jsonb,updated_at=now()",['brand',JSON.stringify(merged)]);
 res.json({ok:true,settings:merged});
}