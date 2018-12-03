import axios from 'axios';
import * as object from "./object.js";
import md5 from 'js-md5';
import {BASE_URL} from "../../config/index.js";


/**
 * 全局http调用
 * @param {*} options
 */
function http(options) {

    let defaults = {
        method: 'get',

        // add to url
        params: {},

        // add to request body
        data: {},
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        }
    };

    options = object.extend(defaults, options);
    options.data = JSON.stringify(options.data);

    // 如果是post请求, 删除查询字符串, 一般都是这样,
    // 如果有另外的情况, 直接在url上拼
    // if (/post/i.test(options.method)) {
    //     delete options.params;
    // } else if (/get/i.test(options.method)) {
    //     delete options.data;
    // }

    try {
        return axios(options).then(res => {
            return res.data; // axios会多封闭一层, res.data才是真正的数据
        });
    } catch (err) {
        return Promise.resolve({
            code: -100, // 全局通用错误处理
            msg: err.msg || 'error',
            data: null
        });
    }
}

/**
 * 简单post请求
 *
 * pathIsUrl: path是不是看作url, 这样会自动域名, 简单一些
 */
async function simplePost(url, data, pathIsUrl = false) {
    let res = await http({
        url: pathIsUrl ? BASE_URL + url : url,
        method: 'POST',
        data: data
    });
    return res;
}

/**
 * get请求封装
 */
async function simpleGet(url, params, pathIsUrl = false) {
    console.log(url)
    let res = await http({
        url: pathIsUrl ? BASE_URL + url : url,
        method: 'GET',
        params: params
    });
    return res;
}

/*
 * put method
 */
async function simplePut(url, data, pathIsUrl = false) {
    console.log(url)
    let res = await http({
        url: pathIsUrl ? BASE_URL + url : url,
        method: 'PUT',
        data: data
    });
    return res;
}

/*
 * delete method
 */
async function simpleDelete(url, data, pathIsUrl = false) {
    let res = await http({
        url: pathIsUrl ? BASE_URL + url : url,
        method: 'DELETE',
        data: data
    });
    return res;
}


/*
 * post method
 */
async function simpleMicroPost(url, serviceName, methodName, hData, pathIsUrl = false) {
    console.log("http req", hData);
    let res = await http({
        url: pathIsUrl ? BASE_URL + url : url,
        method: 'post',
        data: (function () {
            let httpObject = new Object();
            httpObject.Version = 1;
            httpObject.ServiceName = serviceName;
            httpObject.MethodName = methodName;
            httpObject.AppKey = "test1";
            let token = sessionStorage.getItem('ms_token');
            httpObject.Token = token ? token : "";
            httpObject.Data = hData;
            let userid = sessionStorage.getItem('ms_userid');
            httpObject.UserID = userid ? parseInt(userid) : 0;
            httpObject.TimeStamp = parseInt(new Date().getTime().toString().slice(0, 10));
            httpObject.SrcIP = "192.168.199.40";
            let beforeSing = "test1" + httpObject.TimeStamp + httpObject.Data + "micro@159357";
            httpObject.Sign = md5(beforeSing);
            return httpObject;
        })()
    });
    if (typeof(res) == 'string') {
        if (res.indexOf("MessageResponse(") != -1) {
            res = res.substr(30);
            res = res.substr(0, res.length - 2);
            res = JSON.parse(res)
        }
    }
    console.log("http res", res);
    return res;
}

export {
    http,
    simplePost,
    simplePut,
    simpleDelete,
    simpleGet,
    simpleMicroPost
};
