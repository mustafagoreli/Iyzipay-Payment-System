import { Types } from "mongoose";
import ApiError from "../error/ApiError";
import Session from "../middlewares/Session";
import * as CancelPayments from "../services/iyzico/methods/cancel-payment";
import nanoid from "../utils/nanoid";
import PaymentSuccess from "../db/payment-success";

const { ObjectId } = Types;

const reasonEnum = ["double_payment", "buyer_request", "fraud", "other"];

export default (router) => {
    //CANCEL PAYMENT
    router.post("/payments/:paymentSuccessId/cancel", Session, async (req, res) => {
        const { reason, description } = req.body;
        const { paymentSuccessId } = req.params;
        const reasonObj = {};

        if (!paymentSuccessId) {
            throw new ApiError("PaymentSuccessId is required", 400, "paymentSuccessIdRequired");
        }
        if (reason && description) {
            if (!reasonEnum.includes(reason)) {
                throw new ApiError("Invalid cancel payment reason", 400, "invalidCancelPaymentReason");
            }
            reasonObj.reason = reason;
            reasonObj.description = description;
        } 
        const payment = await PaymentSuccess.findOne({ _id: ObjectId(paymentSuccessId) });
        const result = await CancelPayments.cancelPayment({
            locale: req.user.locale,
            conversationId: nanoid(),
            paymentId: payment?.paymentId,
            ip: req.user?.ip,
            ...reasonObj
        })
        res.json(result);
    })
}