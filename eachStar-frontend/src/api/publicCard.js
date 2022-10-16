import axios from "axios";
import { getExpireTime } from "../utils/common.js";

export async function publicCard(type, title, context, price, num){
    let param = new URLSearchParams();
    param.append("type", type);
    param.append("title", title);
    param.append("context", context);
    param.append("starPrice", price);
    param.append("starNum", num);
    param.append("expireTime", getExpireTime());
    var config = {
      method: "post",
      url: "https://each-star.com:3050/api/card",
      data: param,
    };
    
    var res = await axios(config)
    if (res) {
        return true;
    } else {
        return false;
    }
}
