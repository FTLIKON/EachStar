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
      url: "http://www.each-star.com:3050/api/card",
      data: param,
    };
    
    var res = await axios(config)
    if (res) {
        return true;
    } else {
        return false;
    }
}
// let param = new URLSearchParams();
// param.append("title", that.cardTitle);
// param.append("context", that.cardDiscription);
// param.append("starPrice", that.starPrice);
// param.append("starNum", that.starNum);
// param.append("expireTime", that.getExpireTime());
// var config = {
//   method: "post",
//   url: "server/api/card",
//   data: param,
// };
// axios(config)
// .then(function (response) {
//   ElMessage({
//     message: "发布成功! 为您重定向至第一页...",
//     type: "success",
//   });
//   bus.emit("refreshUserInfo");
//   bus.emit("refreshPageData");
// })
// .catch(function (error) {
//   console.log(error);
// });