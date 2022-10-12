/**
 * 获取页面信息
 * type = GitHub/Gitee
 * page = 0-n
 */
export async function getPageData(type, page) {
    var config = {
        method: "get",
        url: "/server/api/card?" +
        "type" + type +
        "start=" + page * that.pageSize,
    };
    // axios(config)   
    // .then(function (response) {
    //     that.totalCard = parseInt(response.data.count);
    //     that.totalPage = Math.ceil(that.totalCard / 10);

    //     var list = [];
    //     var index = 0;
    //     var start = page * that.pageSize;
    //     while (index < that.pageSize && start < that.totalCard) {
    //         if (response.data.data[index] != undefined) {
    //         let nowData = response.data.data[index];
    //         nowData.createdAt = that.parseTimeString(nowData.createdAt);
    //         nowData.cardStatus = list.push(nowData);
    //         }
    //         index++;
    //         start++;
    //     }
    //     that.currentPageData = list;
    //     that.loading = false;
    // })
    // .catch(function (error) {
    //     console.log(error);
    // });
}