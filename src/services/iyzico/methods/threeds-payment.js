import iyzipay from "../connection/iyzipay";

export const initializePayments = (data) => {
    return new Promise((resolve, reject) => {
        iyzipay.threedsInitialize.create(data, (err, result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}

export const completePayment = (data) => {
    return new Promise((resolve, reject) => {
        iyzipay.threedsPayment.create(data, (err, result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}