import axios from "axios";

export async function deleteCard(type, cardId){
    var that = this;
    that.cardRemoving = true;
    var config = {
        method: "delete",
        url: "server/api/card?" 
        + "type=" + type + "&cardId=" + cardId,
    };
    var res = await axios(config)
    .then(function (response) {
        return true;
    })
    .catch(function (error) {
        return false;
    });
}

// deleteButton: function(){
//     var that = this;
//     that.cardRemoving = true;
//     var config = {
//       method: "delete",
//       url: "server/api/card?cardId=" + that.cardId,
//     };
//     axios(config)
//     .then(function (response) {
//       ElMessage({
//         message: "已成功删除：" + that.cardTitle,
//         type: "success",
//       });
//       bus.emit("refreshUserInfo");
//       that.$parent.getMyPageData(that.$parent.currentPage);
//       that.dialogVisible = false;
//       that.cardRemoving = false;
//     })
//     .catch(function (error) {
//       console.log(error);
//       that.cardRemoving = false;
//     });
//   },