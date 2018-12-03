/**
 * 自定义网页交互对话框
 * Created by jiangrongtao on 2017-9-27.
 */
function setAleartStyle() {
    var shield = document.createElement("DIV");
    shield.id = "shield";
    shield.style.position = "absolute";
    shield.style.left = "50%";
    shield.style.top = "50%";
    shield.style.width = "280px";
    shield.style.height = "150px";
    shield.style.marginLeft = "-140px";
    shield.style.marginTop = "-110px";
    shield.style.zIndex = "25";
    var alertFram = document.createElement("DIV");
    alertFram.id = "alertFram";
    alertFram.style.position = "absolute";
    alertFram.style.width = "280px";
    alertFram.style.height = "150px";
    alertFram.style.left = "50%";
    alertFram.style.top = "50%";
    alertFram.style.marginLeft = "-140px";
    alertFram.style.marginTop = "-110px";
    alertFram.style.textAlign = "left";
    alertFram.style.lineHeight = "150px";
    alertFram.style.zIndex = "300";
    alertFram.style.borderRadius = "4px";
    return {shield: shield, alertFram: alertFram};
}

/**
 * @param infomation 提示信息
 * @param imgUrl 提示图标路径
 */
function commonDialog(infomation, imgUrl) {
    var __ret = setAleartStyle();
    var shield = __ret.shield;
    var alertFram = __ret.alertFram;
    if (typeof(imgUrl) == "undefined") {
        imgUrl = 'static/img/alert_blue.png';
    }
    let strHtml = "<ul style=\"list-style:none;margin:0px;padding:0px;width:100%; \">\n";
    strHtml += " <li style=\"background:#99CCFF;text-align:center;font-size:15px;height:100px;line-height:100px;border:2px solid #0099CC;border-radius :6px 6px 6px 6px;color:#ffffff\"><img src='" + imgUrl + "' align='center' style=\"width:60px; height:60px;margin-right: 16px;\">" + infomation + "</li>\n";
    strHtml += "</ul>\n";
    alertFram.innerHTML = strHtml;
    document.body.appendChild(alertFram);
    document.body.appendChild(shield);
    document.body.onselectstart = function () {
        return false;
    };
    alertFram.focus();
    setInterval(function () {
        alertFram.style.display = "none";
        shield.style.display = "none";
    }, 1000);
}

/**
 * 确认对话框
 * @param title
 * @param infomation
 */
function showConfirmDialog(title, infomation) {
    var __ret = setAleartStyle();
    var shield = __ret.shield;
    var alertFram = __ret.alertFram;
    let strHtml = "<ul style=\"list-style:none;margin:0px;padding:0px;width:100%\">\n";
    strHtml += " <li style=\"background:#334455;text-align:left;padding-left:20px;font-size:14px;font-weight:bold;height:30px;line-height:30px;border:1px solid #F9CADE;border-radius :6px 6px 0px 0px;color:white\">" + title + "</li>\n";
    strHtml += " <li style=\"background:#334455;text-align:center;font-size:12px;height:95px;line-height:95px;border-left:1px solid #F9CADE;border-right:1px solid #F9CADE;color:#ffffff\">" + infomation + "</li>\n";
    strHtml += " <li style=\"background:#334455;text-align:center;font-weight:bold;height:30px;padding:5px;line-height:25px;border-radius :0px 0px 6px 6px; border:1px solid #F9CADE;\"><input type=\"button\" value=\"确 定\" onclick=\"doOk()\" style=\"width:80px;background:#334455;color:white;border:1px solid white;border-radius:4px;cursor:pointer;cufont-size:14px;line-height:25px;outline:none;margin-top: 2px\"/></li>\n";
    strHtml += "</ul>\n";
    alertFram.innerHTML = strHtml;
    document.body.appendChild(alertFram);
    document.body.appendChild(shield);
    this.doOk = function () {
        alertFram.style.display = "none";
        shield.style.display = "none";
    }
    alertFram.focus();
    document.body.onselectstart = function () {
        return false;
    };

}

/**
 * 提交或者请求成功
 * @param infomation 提示信息
 * @param imgUrl 提示图标路径
 */
function showOKDialog(infomation, imgUrl) {
    if (typeof(imgUrl) == "undefined") {
        imgUrl = 'static/img/alert_green.png';
    }
    commonDialog(infomation, imgUrl);
}

/**
 * 提交或者请求成功
 * @param infomation 提示信息
 * @param imgUrl 提示图标路径
 */
function showWaringDialog(infomation, imgUrl) {
    if (typeof(imgUrl) == "undefined") {
        imgUrl = 'static/img/alert_red.png';
    }
    commonDialog(infomation, imgUrl);
}

export {
    commonDialog,
    showConfirmDialog,
    showOKDialog,
    showWaringDialog
}
