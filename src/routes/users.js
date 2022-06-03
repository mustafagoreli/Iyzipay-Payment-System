import Users from "../db/users";
import ApiError from "../error/ApiError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default (router) => {
    router.post("/login", async (req, res) => {
        const { email, password } = req.body;
        const user = await Users.findOne({ email: email });
        if (user == null) {
            throw new ApiError("InCorrect password or email", 401, "userOrPasswordIncorrect");
        }
        const passwordConfirmed = await bcrypt.compare(password, user.password);
        if (passwordConfirmed) {
            const UserJson = user.toJSON();
            const token = jwt.sign(UserJson, process.env.JWT_SECRET);
            res.json({
                token: `Bearer ${token}`,
                user: UserJson
            })
        } else {
            throw new ApiError("InCorrect password or email", 401, "userOrPasswordIncorrect");
        }
    });
}