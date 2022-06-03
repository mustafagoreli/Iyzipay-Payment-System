import iyzipay from "../connection/iyzipay";


export const refundPayments = (data)  =>{
    return new Promise((resolve, reject) => {
        iyzipay.refund.create(data, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}