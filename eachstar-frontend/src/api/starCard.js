import axios from "axios";
export async function starCard(card, type) {
    let param = new URLSearchParams();
    param.append("type", type)
    param.append("cardId", card.id);

    var config = {
      method: "post",
      url: "https://each-star.com/api/card/quickstar",
      data: param,
    };

    var access = false;
    var res = await axios(config)
    .then(function (response) {
        access = true;
    })
    .catch(function (error) {
        access = false;
    });

    return access;
}

/**
 * 原数据 starButton
 */

// starButton: function (card) {
// var that = this;
// let param = new URLSearchParams();
// param.append("cardId", card.id);
// var config = {
//     method: "post",
//     url: "server/api/card/quickstar",
//     data: param,
// };

// that.buttonLoading = true;
// setTimeout(() => {
//     that.buttonLoading = false;
// }, 2000);
// card.starring = true;
// axios(config)
//     .then(function (response) {
//     setTimeout(() => {
//         ElMessage({
//         message: "一键star成功! 获得星币:" + card.starPrice,
//         type: "success",
//         });
//         card.starNum -= 1;
//         card.starred = true;
//         bus.emit("refreshUserInfo");
//         if (card.starNum == 0) {
//         // 如果悬赏次数为0->刷新页面
//         that.getPageData(that.currentPage);
//         }
//     }, 1000);
//     })
//     .catch(function (error) {
//     if (error.response.status == 400) {
//         ElMessage({
//         message: "一键star失败, 请稍后再试试~",
//         type: "warning",
//         });
//     }
//     card.starred = false;
//     });
// }