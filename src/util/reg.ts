/**
 * 手机号校验
 */
export const PhoneReg = /^((\+86)|(86))?[1][0-9]\d{9}$/;
//身份证校验
export const IdCardReg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

// 真实姓名校验
export const NameReg = /^(((?!女士|小姐|男士|先生)[\u4e00-\u9fa5]){2,10}|[a-zA-Z]{1,16})$/;