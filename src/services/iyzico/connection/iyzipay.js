import Iyzipay from "iyzipay";
import config from "../config/config.json";

const iyzipay = new Iyzipay(config);

export default iyzipay;