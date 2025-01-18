import { NextResponse } from "next/server";
import axios from "axios";
import { createClient } from "next-sanity";

// 1. Create a Sanity client with your write token
export const sanityClient = createClient({
  projectId: "ckmfdvkv",
  dataset: "production",
  apiVersion: "2023-10-01",
  useCdn: false,  // must be false if you're writing data
  // Keep your token in an .env file, e.g. process.env.SANITY_WRITE_TOKEN
  token: process.env.SANITY_WRITE_TOKEN || "sk3kNiqgZiEq24BWQ85qPy9K5xNrJgxCAtMQ9Jzzf3QN6wOUx41OCQ9N6zK0J6XdLLNa4f8K3CwRlXfPzsrPey93wZTNben2JEStBSYKVdqSK4FPPjtClEvpVrdwmXEdiXGYesE9CzOOgiLjzYOtGCjpHVwJY2XYqLENytJavXbwT9mKxrCc",
});

export async function GET() {
  try {
    // 2. Fetch data from your external API
    const { data } = await axios.get("https://template-0-beta.vercel.app/api/product");
    // data is an array of products

    // 3. Insert each product into Sanity
    for (const product of data) {
      await sanityClient.create({
        _type: "product",
        // The rest must match your schema fields exactly
        id: product.id,
        name: product.name,
        imagePath: product.imagePath,
        price: Number(product.price), // parse from string if needed
        description: product.description,
        discountPercentage: product.discountPercentage,
        isFeaturedProduct: product.isFeaturedProduct,
        stockLevel: product.stockLevel,
        category: product.category,
      });
    }

    return NextResponse.json({ message: "Data inserted successfully!" });
  } catch (error) {
    console.error("Error inserting data into Sanity:", error);
    return NextResponse.json({ error: "Failed to fetch or insert data" }, { status: 500 });
  }
}
