import moment from "moment";
import Iyzipay from "iyzipay";
import Carts from "../db/carts";
import Users from "../db/users";
import ApiError from "../error/ApiError";
import Session from "../middlewares/Session";
import * as Checkout from "../services/iyzico/methods/checkouts";
import * as Cards from "../services/iyzico/methods/cards";
import nanoid from "../utils/nanoid";
import { CompletePayment } from "../utils/payments";
import { Router } from "express";

export default (router) => {
    // CHECKOUT FORM COMPLETE PAYMENT
    router.post("/checkout/complete/payment", async (req, res) => {
        let result = await Checkout.getFromPayment({
            locale: "tr",
            conversationId: nanoid(),
            token: req.body.token
        });
        await CompletePayment(result);
        res.json(result);
    })

    //CHECKOUT FORM INITIALİZE
    router.post("/checkout/:cartId", Session, async (req, res) => {
        if (!req.user?.cardUserKey) {
            throw new ApiError("No registered card available", 400, "cardUserKeyRequired");
        }
        if (!req.params?.cartId) {
            throw new ApiError("Cart id is required", 400, "cartIdRequired");
        }
        const cart = await Carts.findOne({ _id: req.params?.cartId }).populate("buyer").populate("products");
        if (!cart) {
            throw new ApiError("Cart not found", 404, "cartNotFound");
        }
        if (cart?.completed) {
            throw new ApiError("Cart is completed", 400, "cartCompleted");
        }
        const paidPrice = cart.products.map((product) => product.price).reduce((a, b) => a + b, 0);

        const data = {
            locale: req.user.locale,
            conversationId: nanoid(),
            price: paidPrice,
            paidPrice: paidPrice,
            currency: Iyzipay.CURRENCY.TRY,
            installments: '1',
            basketId: String(cart?._id),
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
            enabledInstallments: [1,2,3,4,6,9],
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: `${process.env.END_POINT}/checkout/complete/payment`,
            ...req.user?.cardUserKey && {
                cardUserKey: req.user?.cardUserKey
            },
            buyer: {
                id: String(req.user._id),
                name: req.user?.name,
                surname: req.user?.surname,
                gsmNumber: req.user?.phoneNumber,
                email: req.user?.email,
                identityNumber: req.user?.identityNumber,
                lastLoginDate: moment(req.user?.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationDate: moment(req.user?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationAddress: req.user?.address,
                ip: req.user?.ip,
                city: req.user?.city,
                country: req.user?.country,
                zipCode: req.user?.zipCode
            },
            shippingAddress: {
                contactName: req.user?.name + " " + req.user?.surname,
                city: req.user?.city,
                country: req.user?.country,
                address: req.user?.address,
                zipCode: req.user?.zipCode
            },
            billingAddress: {
                contactName: req.user?.name + " " + req.user?.surname,
                city: req.user?.city,
                country: req.user?.country,
                address: req.user?.address,
                zipCode: req.user?.zipCode
            },
            basketItems: cart.products.map((product, index) => {
                return {
                    id: String(product?._id),
                    name: product?.name,
                    category1: product.categories[0],
                    category2: product.categories[1],
                    itemType: Iyzipay.BASKET_ITEM_TYPE[product?.itemType],
                    price: product?.price
                }
            })
        }
        let result = await Checkout.initialize(data);
        const html = `<!DOCTYPE html>
<html>
<head>
<title>Ödeme yap</title>
<meta charset="UTF-8" />
${result?.checkoutFormContent}
</head>
</html>`
        res.send(html);
        /*
        let result = await PaymentsThreeDS.initializePayments(data);
        const html = Buffer.from(result?.threeDSHtmlContent, "base64").toString();
        res.send(html);
        */
    })
}