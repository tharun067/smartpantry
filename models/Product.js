import mongoose, { model, models } from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default:'unCategorized'
    },
    image: {
        type: String,
    }
});

const Product = models.Product || model('Product', productSchema);
export default Product;