import mongoose, { Document, Schema } from "mongoose";

interface Item extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
    item_id:string,
    reason?: string;
    User?: mongoose.Types.ObjectId;
}

export const itemSchema : Schema<Item> = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }, 
    
    category: {
        type: String,
        required: true,
        enum: {
            values: ["electronics", "clothing", "home", "books", "toys", "sports", "beauty", "automotive", "music", "gaming", "health"],
            message: '{VALUE} is not a valid category'
        }
    },
    imageUrl: {
        public_id:{
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        // required: true
   
    },
    stock: {
        type: Number,
        default: 0
    },
    reason:{
        type: String,
        default: "No reason provided"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }, 
      item_id:{
        type: String,
        default: function(){ 
           return "abcdefghijklmnopqrstuvwxyz"+Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        }
    },
     User:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    }
})


export const ItemModel = mongoose.models.Item || mongoose.model<Item>("Item",itemSchema);