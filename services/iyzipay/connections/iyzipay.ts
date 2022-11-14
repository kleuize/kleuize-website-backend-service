//@ts-ignore
import Iyzipay from "iyzipay";
//@ts-ignore
import config from "../config/config.json";

const iyzipay = new Iyzipay(config);

export default iyzipay;
