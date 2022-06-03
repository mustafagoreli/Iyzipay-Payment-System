import { Types } from "mongoose";
import moment from "moment";
import Session from "../middlewares/Session";
import nanoid from "../utils/nanoid";
import * as Installments from "../services/iyzico/methods/installments";
import ApiError from "../error/ApiError";
import Carts from "../db/carts";

const { ObjectId } = Types;

export default (router) => {

    //Fiyata göre Taksit Kontrolü
    router.post("/installments", Session, async (req, res) => {
        const { binNumber, price } = req.body;
        if (!binNumber || !price) {
            throw new ApiError("Missing Parameters", 400, "missingParameters");

        }
        const result = await Installments.checkInstallment({
            locale: req.user.locale,
            conversationId: nanoid(),
            binNumber: binNumber,
            price: price
        })
        res.json(result);
    })

    //Sepetin Fiyatına Göre Taksit Modülü
    router.post("/Installments/:cartId", Session, async (req, res) => {
        const { binNumber } = req.body;
        const { cartId } = req.params;
        if (!cartId) {
            throw new ApiError("cart id is required", 400, "cartRequired");
        }
        const cart = await Carts.findOne({
            _id: ObjectId(cartId)
        }).populate("products", {
            _id: 1,
            price: 1
        })
        const price = cart.products.map((product) => product.price).reduce((a, b) => a + b, 0);
        if (!binNumber || !price) {
            throw new ApiError("Missing parameters", 400, "missingParameters");

        }
        const result = await Installments.checkInstallment({
            locale: req.user.locale,
            conversationId: nanoid(),
            binNumber: binNumber,
            price: price
        })
        res.json(cart);
    })
}