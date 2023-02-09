/**
 * ajax请求处理方法封装
 * 使用前需要设置环境变量env和用户token，did
 * 引入后使用requestHandler.getHeaderAndBody方法获取加密后请求头和请求体
 * 调用requestHandler.decryptByAES方法解密
 */
import CryptoJS from './crypto-js.js';

export const requestHandler = {
    env: process.env.NODE_ENV,
    token: "",//用户登录凭证
    did: 0,
    _AK: 6,
    _randomStr: '',
    _ECBOptions: {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    },
    /**
     * 生成密钥
     */
    _getKey: function () {
        return CryptoJS.enc.Utf8.parse(this._getSK());
    },
    /**
     * 根据环境获取SK
     */
    _getSK: function () {
        return this.env === 'production' ? '' : '';
    },
    /**
     * AES解密
     * @param {String} word 解密字符串
     */
    decryptByAES: function (word) {
        let decrypt = CryptoJS.AES.decrypt(word, this._getKey(), this._ECBOptions);
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    },
    /**
     * AES加密
     * @param {String} word 加密字符串
     */
    encryptByAES: function (word) {
        return CryptoJS.AES.encrypt(word, this._getKey(), this._ECBOptions).toString();
    },
    /**
     * 请求头
     * @param {Object} body 请求体
     */
    headers: function (body) {
        const signAndTimestamp = this._getSignature(body)
        const headers = {
            'token': this.token,
            'Content-Type': 'application/json; charset=utf-8',
            'AK': this._AK,
            'Signature': signAndTimestamp[0],
            'UTC-Timestamp': signAndTimestamp[1],
            'Random': this._randomStr,
        };
        return headers;
    },
    /**
     * 随机生成指定长度的字符串，A-Za-z0-9规则
     * @param {String} n 需要生成的字符串长度
     */
    _getRandomStr: function (n) {
        let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let temp = '',
            i = 0,
            l = str.length;
        for (i = 0; i < n; i++) {
            temp += str.charAt(Math.floor(Math.random() * l));
        }
        this._randomStr = temp;
        return temp;
    },
    /**
     * 获取当前时间戳
     */
    _getTimestamp: function () {
        let timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        return timestamp;
    },
    /**
     * 生成加密后签名
     * @param {Object} body 请求体
     */
    _getSignature: function (body) {
        const bodyStr = JSON.stringify(body);
        const timestamp = this._getTimestamp().toString()
        const str = bodyStr + timestamp + this._getRandomStr(8).toString() + this._getSK();
        return [CryptoJS.SHA1(str).toString(), timestamp];
    },
    /**
     * 获取处理和加密后的请求头和请求体
     * @param {Object} body 请求体
     */
    getHeaderAndBody(body) {
        const bodyStr = JSON.stringify(body);
        let encryptedBody = this.encryptByAES(bodyStr);
        let headers = this.headers(body);
        this._randomStr = ''; // 随机字符串置空
        return {
            encryptedBody,
            headers
        };
    },
};