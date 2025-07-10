import { NextApiRequest, NextApiResponse } from 'next';
import { getAllProducts } from '.';
import { formatPrice } from '@/components/ProductCard';
import { appendExtensionByContentType } from '@/utils/utapi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    return res.status(400).json({ message: "Not allowed during production."})
//     const products = await getAllProducts();

//     const renderedList : any = [];

//     let i = 0;
//     for (const product of products) {

//         console.log({
//             item: i,
//             of: products.length
//         })

//         const newObject : any = {...product}
//         const images: string[] = await appendExtensionByContentType(product.media.map(x => x.large));
        
//         if (images && images.length > 0) {
//             newObject.additional_images = images;
//             newObject.image = images[0];
//         }

//         renderedList.push(newObject);
//     }


//     const xml = `<?xml version="1.0"?>
// <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
//   <channel>
//     <title>Terandina</title>
//     <link>https://terandina.com/</link>
//     <description>Terandina, a proudly Native-owned business, offers curated, authentic indigeneous pieces: clothing, blankets, and jewelry.</description>

//     ${renderedList.map((product : any) => (
//         `
//             <item>
//                 <g:id>${product.id}</g:id>
//                 <g:title>${product.name}</g:title>
//                 <g:description>${product.description}</g:description>
//                 <g:link>https://terandina.com/item/${product.id}</g:link>
                
//                 ${product.image && `<g:image_link>${product.image}</g:image_link>`}
//                 ${product.additional_images && product.additional_images.map((img : string) => `<g:additional_image_link>${img}</g:additional_image_link>`)}

//                 <g:condition>new</g:condition>
//                 <g:availability>in stock</g:availability>
//                 <g:price>${product.selectedPrice?.unit_amount ? formatPrice(product.selectedPrice?.unit_amount, 'usd').slice(1) : '$59.99'} USD</g:price>
//                 <g:shipping>
//                     <g:country>US</g:country>
//                     <g:service>Standard</g:service>
//                     <g:price>8.95 USD</g:price>
//                 </g:shipping>
//                 <g:brand>Terandina</g:brand>
//                 <g:gender>unisex</g:gender>
//                 <g:age_group>adult</g:age_group>
//                 <g:color>${product.color}</g:color>
//             </item>
//             `
//     ))}
//   </channel>
// </rss>`;

//     res.setHeader('Content-Type', 'application/xml');
//     res.status(200).send(xml);
}
