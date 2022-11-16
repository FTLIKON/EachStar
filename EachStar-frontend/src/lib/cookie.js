// 设置 cookie
export function setCookie(cname, cvalue) {
  document.cookie = cname + "=" + cvalue;
}

// 获取 cookie
export function getCookie(cname) {
  var name = cname + "=";
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var item = cookies[i].trim();
    if (item.indexOf(name) == 0)
      return item.substring(name.length, item.length);
  }
  return "";
}
