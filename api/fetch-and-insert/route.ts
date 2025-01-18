import { NextResponse } from "next/server";
import axios from "axios";
import { createClient } from "next-sanity";

// 1. Create a Sanity client with your write token
export const sanityClient = createClient({
  projectId: "",
  dataset: "production",
  apiVersion: "2023-10-01",
  useCdn: false,  // must be false if you're writing data
  // Keep your token in an .env file, e.g. process.env.SANITY_WRITE_TOKEN
  token: process.env.SANITY_WRITE_TOKEN || "add token here",
});

export async function GET() {
  try {
    // 2. Fetch data from your external API
    const { data } = await axios.get("https://your data api .app/api/product");
    // data is an array of products

    // 3. Insert each product into Sanity as per your scehma 
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


// how to run it 
// 1. Run the server with `next dev` or `next start`
// 2. Visit http://localhost:3000/api/fetch-and-insert
// 3. It will fetch data from your external API and insert it into Sanity