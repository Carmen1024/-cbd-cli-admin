// 高级校验

export const validatePhone = (rule: any, value: any, callback: any) => {
  if (value.length!=11) {
    callback(new Error('请填写11位手机号'))
  } else {
    const TEL_REGEXP = /^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/;
    // const TEL_REGEXP = /^1\d{10}$/;
    if(!TEL_REGEXP.test(value)){
      callback(new Error('请填写正确的手机号'))
    }
    callback()
  }
}
export const validateCode = (rule: any, value: any, callback: any) => {
  if (value.length > 11) {
    callback(new Error('请填写11位以内的编号'))
  } else {
    const TEL_REGEXP = /^(?:[1-9]\d*)$/;
    if(!TEL_REGEXP.test(value)){
      callback(new Error('请填写正确的编号'))
    }
    callback()
  }
}
export const validateIdCode = (rule: any, value: any, callback: any) => {
  if (value.length > 18) {
    callback(new Error('请填写正确的身份证'))
  } else {
    const TEL_REGEXP = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
    if(!TEL_REGEXP.test(value)){
      callback(new Error('请填写正确的身份证'))
    }
    callback()
  }
}
export const validateCode11 = (rule: any, value: any, callback: any) => {
  if (value.length != 11) {
    callback(new Error('请填写11位的编号'))
  } else {
    const TEL_REGEXP = /^(?:[1-9]\d*)$/;
    if(!TEL_REGEXP.test(value)){
      callback(new Error('请填写正确的编号'))
    }
    callback()
  }
}
export const validateCode16 = (rule: any, value: any, callback: any) => {
  if (value.length > 16) {
    callback(new Error('请填写16位以内的编号'))
  } else {
    const TEL_REGEXP = /^(?:[1-9]\d*)$/;
    if(!TEL_REGEXP.test(value)){
      callback(new Error('请填写正确的编号'))
    }
    callback()
  }
}
export const validateEmail = (rule: any, value: any, callback: any) => {
  console.log(value)
  // if (value??''==''){
  //   callback()
  //   return;
  // }
  var reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$");
  if(!reg.test(value)){
    callback(new Error('请填写正确的邮箱'))
  }else{
    callback()
  }
  
}

//
export const isEmptyObj=(msg:string="不能为空")=>{
  return { required: true, message: msg, trigger: 'blur' }
}
export const wordSizeObj=(wordMax:Number=0,wordMin:Number=0)=>{
  
  return { min: wordMin, max: wordMax, message: `${wordMin && '不得小于'+wordMin+'字'}`, trigger: 'blur' }
}
export const isEmpty=(msg:string="不能为空",wordSize:Number=0)=>{
  const arr = [isEmptyObj(msg)]
  if(wordSize>0){
    arr.push({ min: 1, max: wordSize, message: `不得超过${wordSize}字`, trigger: 'blur' })
  }
  return arr
}

export const isEmptyTime= (msg:string="不能为空") => {
  const validateTime = (rule, value, callback) => {
    const time = Date.parse(new Date(value).toString())-600000
    if (time <= Date.now()) {
      callback(new Error('生效时间需要在当前时间十分钟后，请重新填写 !'));
    } else {
      callback();
    }
  };
  const arr = [isEmptyObj(msg)]
  arr.push(
      { validator:validateTime , trigger: 'blur' },
  )
  return arr
}
export const isEmptyNumber=(msg:string="不能为空")=>{
  return [
    { required: true, message: msg, trigger: 'blur' },
    { type: "number", message: msg },
  ]
}
export const isNumber=(msg:string="不能为空")=>{
  return [
    { required: true, message: msg, trigger: 'blur' },
    { validator: validateCode, trigger: 'blur' }
  ]
}
export const isNumber11=(msg:string="不能为空")=>{
  return [
    { required: true, message: msg, trigger: 'blur' },
    { validator: validateCode11, trigger: 'blur' }
  ]
}
export const isNumber16=(msg:string="不能为空")=>{
  return [
    { required: true, message: msg, trigger: 'blur' },
    { validator: validateCode16, trigger: 'blur' }
  ]
}
export const isPhone=(msg:string="请填写手机号")=>{
  return [
    { required: true, message: msg, trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' }
  ]
}
export const isEmail=(msg:string="请填写邮箱")=>{
  return [
    { required: true, message: msg, trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' }
  ]
}
export const isCard=(msg:string="请填写身份证")=>{
  return [
    { required: true, message: msg, trigger: 'blur' },
    { validator: validateIdCode, trigger: 'blur' }
  ]
}