import axios from "axios";
import { parseTimeString } from "../utils/common";

/**
 * 获取页面信息
 * type = GitHub/Gitee
 * page = 0-n
 */
export async function getPageData(type, page) {
    var config = {
        method: "get",
        url: "https://each-star.com:3050/api/card?" +
        "type=" + type + "&" +
        "start=" + (page - 1) * 10,
    };
    var res = await axios(config);
    
    console.log(res.data.data);
    
    var count = res.data.count; // 卡片数量

    var list = [];
    var index = 0;
    var start = (page - 1) * 10;
    // 一页只刷新10个卡片 && 防止下标越界
    while (index < 10 && start < count) {
        if(res.data.data[index]){
            let nowData = res.data.data[index];
            nowData.createdAt = parseTimeString(nowData.createdAt);
            list.push(nowData);
        }
        index++; start++;
    }
    res.data.data = list;
    return res.data;
}