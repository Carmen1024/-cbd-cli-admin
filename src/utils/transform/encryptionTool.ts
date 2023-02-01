import CryptoJS from 'crypto-js'

/**
 * AES加密
 * @param plainText 明文
 * @param keyInBase64Str base64编码后的key
 * @param ivInBase64Str base64编码后的初始化向量(只有CBC模式下才支持)
 * @return base64编码后的密文
 */
export function encryptByAES(plainText, keyInBase64Str, ivInBase64Str) {
    let key = CryptoJS.enc.Base64.parse(keyInBase64Str)
    let iv = CryptoJS.enc.Base64.parse(ivInBase64Str)
    let encrypted = CryptoJS.AES.encrypt(plainText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    // 这里的encrypted不是字符串，而是一个CipherParams对象
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
}

/**
 * AES解密
 * @param cipherText 密文
 * @param keyInBase64Str base64编码后的key
 * @param ivInBase64Str base64编码后的初始化向量(只有CBC模式下才支持)
 * @return 明文
 */
export function decryptByAES(cipherText, keyInBase64Str, ivInBase64Str) {
    let key = CryptoJS.enc.Base64.parse(keyInBase64Str)
    let iv = CryptoJS.enc.Base64.parse(ivInBase64Str)
    // 返回的是一个Word Array Object，其实就是Java里的字节数组
    let decrypted = CryptoJS.AES.decrypt(cipherText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })

    return decrypted.toString(CryptoJS.enc.Utf8)
}
