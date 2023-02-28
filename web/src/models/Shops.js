import mongoose from "mongoose";

const shopSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    shopID: String,
    shopOrigin: String,
    shopState: String,
    shopStatus: Boolean,
    shopScopes: String,
    accessToken: String,
    created_at: String,
    updated_at: String
})

const Shop = mongoose.model("Shops", shopSchema); 

export default Shop;




