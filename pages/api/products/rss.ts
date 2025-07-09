import { NextApiRequest, NextApiResponse } from 'next';
import { getAllProducts } from '.';
import { formatPrice } from '@/components/ProductCard';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const products = await getAllProducts();

    console.log(products);
    const xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Terandina</title>
    <link>https://terandina.com/</link>
    <description>Terandina, a proudly Native-owned business, offers curated, authentic indigeneous pieces: clothing, blankets, and jewelry.</description>

    ${products.map(product => {

        const image = product.media && product.media.length > 0 ? product.media[0].medium : null;
        product.selectedPrice = product.prices ? product.prices[0] : null;

        return (
            `
            <item>
                <g:id>${product.id}</g:id>
                <g:title>${product.name}</g:title>
                <g:description>${product.description}</g:description>
                <g:link>https://terandina.com/item/${product.id}</g:link>
                <g:image_link>${image}</g:image_link>
                <g:condition>new</g:condition>
                <g:availability>in stock</g:availability>
                <g:price>${product.selectedPrice?.unit_amount ? formatPrice(product.selectedPrice?.unit_amount, 'usd').slice(1) : '$59.99'} USD</g:price>
                <g:shipping>
                    <g:country>US</g:country>
                    <g:service>Standard</g:service>
                    <g:price>8.95 USD</g:price>
                </g:shipping>
                <g:brand>Terandina</g:brand>
            </item>
            `
        )
    })}
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
}
