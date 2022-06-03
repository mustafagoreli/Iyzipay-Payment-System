import ApiError from "../error/ApiError";
import * as Cards from "../services/iyzico/methods/cards";
import Users from "../db/users";
import nanoid from "../utils/nanoid";
import Session from "../middlewares/Session";
import Iyzipay from "iyzipay";

export default (router) => {
    //Kart Ekleme
    router.post("/cards", Session, async (req, res) => {
        const { card } = req.body;
        console.log(req.user);
        let result = await Cards.createUserCard({
            locale: req.user.locale,
            conversationId: nanoid(),
            externalId: nanoid(),
            email: req.user.email,
            ...req.user?.cardUserKey && {
                cardUserKey: req.user.cardUserKey
            },
            card: card,
        });
        if (!req.user.cardUserKey) {
            if (result?.status === "success" && result?.cardUserKey) {
                const user = await Users.findOne({
                    _id: req.user?._id
                });
                user.cardUserKey = result?.cardUserKey;
                await user.save();
            }
        }
        res.json(result);
    });


    //Kart okuma
    router.get("/cards", Session, async (req, res) => {
        if (!req.user?.cardUserKey) {
            throw new ApiError("User has no credit card", 403, "userHasNoCard");
        }
        let cards = await Cards.getUserCards({
            locale: Iyzipay.LOCALE.TR,
            conversationId: nanoid(),
            cardUserKey: req.user?.cardUserKey
        })
        res.status(200).json(cards);
    });

    //Kart  Silme - Token
    router.delete("/cards/delete-by-token", Session, async (req, res) => {
        const { cardToken } = req.body;
        if (!cardToken) {
            throw new ApiError("Card is required", 400, "cardTokenRequired");
        }
        let deleteResult = await Cards.deleteUserCard({
            locale: Iyzipay.LOCALE.TR,
            conversationId: nanoid(),
            cardUserKey: req.user?.cardUserKey,
            cardToken: cardToken
        })
        res.status(200).json(deleteResult);
    });

    //Kart Silme-index
    router.delete("/cards/:cardIndex/delete-by-index", Session, async (req, res) => {
        if (!req.params?.cardIndex) {
            throw new ApiError("Card Index is required", 400, "cardIndexRequired");
        }
        let cards = await Cards.getUserCards({
            locale: req.user.locale,
            conversationId: nanoid(),
            cardUserKey: req.user?.cardUserKey
        })
        const index = parseInt(req.params?.cardIndex);
        if(index >= cards?.cardDetails.length){
            throw new ApiError("card doesnt existis, check index number", 400, "cardIndexInValid");
        }
        const {cardToken} = cards?.cardDetails[index];
        let deleteResult = await Cards.deleteUserCard({
            locale: Iyzipay.LOCALE.TR,
            conversationId: nanoid(),
            cardUserKey: req.user?.cardUserKey,
            cardToken: cardToken
        })
        res.json(cards);
    })
}