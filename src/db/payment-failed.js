import mongoose from "mongoose";
import nanoid from "../utils/nanoid";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const PaymentFailedSchema = new Schema({
    uid: {
        type: String,
        default: nanoid(),
        unique: true,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["failure"]
    },
    conversationId: {
        type: String,
        required: true
    },
    errorCode: {
        type:String,
        required:true
    },
    errorMessage: {
        type:String,
        required:true
    },
    log:{
        type: Schema.Types.Mixed,
        required:true
    }
},{
    _id: true,
    collection: "payment-failed",
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.__v;
            return {
                ...ret
            }
        }
    }
})

const PaymentsFailed = mongoose.model("PaymentsFailed",PaymentFailedSchema);

export default PaymentsFailed;