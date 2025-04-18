import SafeString from "@/middleware/security";
import verifySession from "@/middleware/session/verifySession";
import { Category, StripeProduct } from "@/types";
import Mongo from "@/utils/mongo";
import { ObjectId, WithId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getAllProducts } from "./products";

const sizeOrder = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

function formatString(input: string) {
  return input
    .toLowerCase()               // Convert to lowercase
    .replace(/[^a-z\s]/g, '')    // Remove non-alphabetic characters
    .replace(/\s+/g, '_');       // Replace spaces with underscores
}

async function handlePostRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {

  const userAuth = verifySession(req);
  if (!userAuth) return res.status(401).json({ message: 'Usage' });

  try {
    const mongo = await Mongo.getInstance();

    const data = req.body;

    if (!data.name || !data.type || !data.products) {
      return res.status(500).json({ message: "No product." })
    }

    const newFile = {
      name: data.name,
      type: data.type,
      slug: formatString(data.name),
      parent_id: null,
      is_on_menu: null
    }

    const newCategory = await mongo.clientPromise.db('products').collection('categories').insertOne(newFile)

    if (data.products) {

      console.log(data.products)

      const update = await mongo.clientPromise
        .db('products')
        .collection('products')
        .updateMany(
          { id: { $in: data.products } },
          {
            $addToSet: { categories: newCategory.insertedId }
          }
        );

      console.log(update);
    }


    res.status(200).json({
      message: "Success",
      category: {
        ...newFile,
        _id: newCategory.insertedId,
      }
    })

    try {
      let affectedCategories = new Set<string>();

      const theProducts = await mongo.clientPromise.db('products').collection('products').find({
        categories: newCategory.insertedId
      }).toArray();

      const categories: WithId<any>[] = await mongo.clientPromise.db('products').collection('categories').find({}).toArray();

      for (const theProduct of theProducts) {
        try {
          if (!theProduct.categories) {
            continue;
          }
          theProduct.categories.forEach((c: string) => {
            affectedCategories.add(c);
          })
        }
        catch (err) {
          console.log("theProduct.categories probably did not exist.")
        }
      }

      for (const category of affectedCategories) {
        const theCategory = categories.find(c => c._id.toString() === category);
        if (!theCategory) {
          continue;
        }
        await res.revalidate(`/${theCategory.slug}`)
        console.log({
          message: "Revalidation complete",
          category
        })
      }
    }
    catch (err) {
      console.log("Did not revalidate something it should have")
      console.log(err);
      return;
    }

    return;

  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong.");
  }
}


async function deleteProductById(productId: string): Promise<boolean> {
  return false;
}

async function getProductById(productId: string): Promise<any | null> {
  try {
    const mongo = await Mongo.getInstance();

    const [product] = await mongo.clientPromise.db('products').collection('products').find({
      id: productId
    }).toArray()

    return product
  } catch (error) {
    console.error("Error retrieving product:", error);
    return null;
  }
}

export async function getAllCategories(query: Partial<{
  [key: string]: string | string[];
}>, select? : {
  getProductsIfVariant?: boolean,
  getProducts?: boolean
}) : Promise<WithId<Category>[]> {

  select = {
    ...{
      getProductsIfVariant: false,
      getProducts: false
    },
    ...select
  }

  console.log({ query, select })
  try {
    const mongo = await Mongo.getInstance();

    if (query.cat_ids && Array.isArray(query.cat_ids)) {

      const categories : WithId<Category>[] = await mongo.clientPromise.db('products').collection<WithId<Category>>('categories').find({
        _id: { $in: query.cat_ids.map(id => new ObjectId(id)) as any }
      }).toArray();

      if (select.getProductsIfVariant) {
        for (const cat of categories) {
          if (cat.type != 'variant') {
            continue;
          }
          const products = await getAllProducts({
            category: cat._id.toString()
          })
          cat.products = products;
        }
      }
      else if (select.getProducts) {
        for (const cat of categories) {
          const products = await getAllProducts({
            category: cat._id.toString()
          })
          cat.products = products;
        }
      }

      return categories || [];
    }

    const categories = await mongo.clientPromise.db('products').collection<WithId<Category>>('categories').find().toArray()

    return categories || [];

  } catch (error) {
    console.error('Error retrieving categories:', error);
  }

  return [];
}


async function handleDeleteRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {

  const userAuth = verifySession(req);
  if (!userAuth) return res.status(401).json({ message: 'Usage' });

  const cat_id = req.query.id;

  if (!cat_id) {
    return res.status(400).json({ message: "No category provided." })
  }

  try {

    const mongo = await Mongo.getInstance();

    const theCategory = await mongo.clientPromise.db('products').collection('categories').findOne({
      _id: new ObjectId(String(cat_id))
    })


    if (!theCategory || !theCategory._id) {
      throw Error("No category in the database to delete.")
    }

    await mongo.clientPromise
      .db('products')
      .collection('products')
      .updateMany(
        {},
        {
          $pull: { categories: theCategory._id as any }
        }
      );


    await mongo.clientPromise.db('products').collection('categories').deleteOne({
      _id: theCategory._id
    })

    res.revalidate(`/${theCategory.slug}`)

    return res.status(200).json({
      message: "Deleted category."
    })
  }
  catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Failure" })
  }
}

const allowedFields: (keyof Category)[] = ['media', 'name', 'description', 'categories'];

async function handlePatchRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {

  const userAuth = verifySession(req);
  if (!userAuth) return res.status(401).json({ message: 'Usage' });

  const data: Category = req.body;
  const revalidate = req.query.revalidate ? new SafeString(req.query.revalidate).isTrue() : false;
  const cat_id = String(req.query.id);

  const mongo = await Mongo.getInstance();

  
  if (revalidate) {
    try {
      console.log(cat_id)
      const theCategory = await mongo.clientPromise.db('products').collection('categories').findOne({
        _id: new ObjectId(cat_id)
      });

      if (!theCategory) {
        throw Error("No category found.")
      }

      await res.revalidate(`/${theCategory.slug}`)
      return res.status(200).json({ message: "Success" })
    }
    catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Not revalidated." })
    }
  }

  try {
    const updateData: Record<string, any> = {};

    for (const key of allowedFields) {
      if (key in data) {
        if (key === 'categories') {
          const ids = data[key]?.map(id => {

            if (typeof id != 'string') {
              return new ObjectId(id._id);
            }
            return new ObjectId(id);
          })
          updateData[key] = ids;
        }
        else {
          updateData[key] = data[key]!;
        }
      }
    }

    if (Object.keys(updateData).length != 0) {
      await mongo.clientPromise.db('products').collection('categories').updateOne({
        _id: new ObjectId(String(cat_id))
      }, {
        $set: updateData
      })
    }

    return res.status(200).json({ message: "Success" })
  }
  catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Could not update" })
  }
}



export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {

  if (req.method === 'POST') {
    return handlePostRequest(req, res);
  }

  if (req.method === 'DELETE') {
    return handleDeleteRequest(req, res);
  }

  if (req.method === 'PATCH') {
    return handlePatchRequest(req, res);
  }

  if (req.method != 'GET') {
    res.status(405).end('Method Not Allowed');
  }

  const product_id = req.query.id;
  const doNotCache = new SafeString(req.query.doNotCache);

  //   if (product_id) {
  //     const product = await getProductById(String(product_id))
  //     if (!product) {
  //       throw Error("No product found by that id.")
  //     }
  //     return res.status(200).json({
  //       message: "Success. Got one product.",
  //       product
  //     })
  //   }

  try {
    const categories = await getAllCategories(req.query);

    if (!categories) {
      throw Error("No categories.")
    }

    if (doNotCache.isTrue()) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }

    res.status(200).json({
      message: "Success",
      categories
    })
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong.");
  }
}