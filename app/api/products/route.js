import { connectToDB } from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connectToDB();

    try {
        const { searchParams } = new URL(req.url);;
        const productId = searchParams.get("productId");
        const searchQuery = searchParams.get('search');

        if (productId) {
            //Get single product by Id
            const product = await Product.findById(productId);
            if (!product) {
                return new Response({error:`Product with id ${productId} not found`}, { status: 404 });
            }
            return NextResponse.json(product);
        }

        if (searchQuery) {
            //Search products by name
            const products = await Product.find({
                name: { $regex: searchQuery, $options: 'i' }
            });
            return NextResponse.json(products);
        }

        //Get all products
        const products = await Product.find();
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse({error: error.message}, { status: 500 });
    }
}

export async function POST(req) {
    await connectToDB();
    try {
        const { name, category, image } = await req.json();
        //Check if product already exists
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return new Response({ error: `Product with name ${name} already exists` }, { status: 400 });
        }
        //Create new product
        const product = new Product({ name, category, image });
        await product.save();
        return NextResponse.json(product,{status:201});
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    await connectToDB();

    try {
        const { productId, name, category, image } = await req.json();

        const product = await Product.findByIdAndUpdate(productId,
            { name, category, image },
            { new: true }
        );

        if (!product) {
            return NextResponse.json({ error: `Product not found ${product}` }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectToDB();

    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');

        //check if any containers are using this product
        const Container = (await import('@/models/container')).default;
        const containerUsingProduct = await Container.countDocuments({ productId });

        if (containerUsingProduct > 0) {
            return NextResponse.json({ error: `Product is in use by ${containerUsingProduct} containers` }, { status: 400 });
        }

        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return NextResponse.json({ error: `Product not found ${product}` }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}