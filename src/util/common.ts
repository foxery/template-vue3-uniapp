/**
 * 自动检查更新小程序版本
 */
export function UpdateApp() {
    const updateManager = uni.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate);
    });

    updateManager.onUpdateReady(function (res) {
        uni.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success(res) {
                if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate();
                }
            }
        });

    });

    updateManager.onUpdateFailed(function (res) {
        // 新的版本下载失败
    });
}

/**
 * Json2Form json对象转化成form格式
 * @param  json 
 */
export function Json2Form(json: any) {
    let str = [];
    for (let p in json) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
    }
    return str.join("&");
}

/**
 * Form2Json 序列化的form格式转化成json对象
 * @param  str 
 */
export function Form2Json(str: string) {
    let temp = str.split("&");
    let obj = {};
    temp.forEach(v => {
        let param = v.split("=");
        obj[param[0]] = param[1];
    });
    return obj;
}

/**
 *  微信小程序基础库版本号比较
 * @param  v1 
 * @param  v2 
 */
export function CompareVersion(v1: string, v2: string) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}

/**
 * 判断性别类型，返回文本值
 * @param gender 性别类型
 */
export function FormatGender(gender: number) {
    return +gender == 1 ? '男' : '女';
}

/**
 * 返回年龄与单位
 * @param value 年龄
 */
export function FormatAgeUnit(value: number) {
    if (value < 1 && value != 0) {
        return (value * 100).toFixed(0) + '月';
    } else {
        return (+value).toFixed(0) + '岁';
    }
}

/**
 * 格式化日期
 * @param  timeline 时间戳，精确到毫秒
 * @param  fmt 'yyyy-MM-dd hh:mm:ss'
 */
export function FormatDate(timeline: number, fmt = 'yyyy-MM-dd hh:mm:ss') {
    if (!timeline) {
        return;
    }
    if (timeline.toString().length < 13) {
        timeline = timeline * 1000;
    }
    let date = new Date(timeline);
    let padLeftZero = str => ('00' + str).substr(str.length)
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
        }
    }
    return fmt;
}

/**
 * @description 格式化金额
 * @param number：要格式化的数字
 * @param decimals：保留几位小数 默认2位
 * @param decPoint：小数点符号 默认.
 * @param thousandsSep：千分位符号 默认为,
 */
export const FormatMoney = (number: string | number, decimals = 2, decPoint = '.', thousandsSep = ',') => {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '')
    let n = !isFinite(+number) ? 0 : +number
    let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    let s = ''
    let toFixedFix = function (n, prec) {
        let k = Math.pow(10, prec)
        return '' + Math.round(n * k) / k
    }
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    if (thousandsSep) {
        let re = /(-?\d+)(\d{3})/
        while (re.test(s[0])) {
            s[0] = s[0].replace(re, '$1' + sep + '$2')
        }
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
}