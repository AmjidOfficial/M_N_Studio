{
    "path": "api/services.js",
    "text": "import { db } from 'hatchable';\nexport const access = 'public';\nexport const methods = ['GET'];\nexport default async function(req,res){\n const r=await db.query(\"SELECT id,name,category,description,price_amount,price_note,image_url FROM studio_services WHERE is_published=true ORDER BY sort_order,id\");\n res.json({services:r.rows});\n}",
    "hash": "7fda3a129cf026ca0ff5619ca87b9ca924498942335e587d87a2fa4102834fbf",
    "total_lines": 7
}