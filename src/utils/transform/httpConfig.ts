// request response处理
// 相应格式：
// request：{
//    "token":"",   //可选，请求token
//    "platform":"", //可选，平台id
//    "data":{}   //请求内容
// }
// response：{
//     "code":"",  //响应代号
//     "desc":"",  //响应描述
//     "count":-1,  //响应数据计数，如查询返回了10条。
//     "total":"",  //数据总数，如果查询总数
//     "is_list":false,  //是否是列表
//     "ext":{},  //可选，扩展字段，被用
//     "data":{}  //业务数据内容
// }
import store from '@/store'
interface requestInterface{
    token:string,
    platform?:string,
    data:object,
    // params?:object,
    [propName: string]: any
}
interface responseInterface{
    code:string,
    desc?:string,
    data:object,
    count?:number,
    total?:number,
    ext?:object,
    is_list?:boolean,
    [propName: string]: any
}

// 获取全部返回值
export const getResContent = (response:responseInterface)=>{
    return response.data;
}

//拼接请求config data
export const getConfigData = (config:object)=>{
    let configData:requestInterface = {
        data :( config?.data ? config.data : {})
    }
    if(config?.url.indexOf("login/login")<0){
        configData.token = store.state.user.token
    }
    if(config?.params){
       const params = config.params
       Object.keys(params).map(i=>{
        configData[i] = params[i]
       })
    }
    return configData;
}

export const getConfigSevenData = (config:object)=>{
    let configData:requestInterface = config?.data ? config.data : {}
    if(config?.url.indexOf("login/login")<0){
        configData.token = store.state.user.token
    }
    if(config?.params){
       const params = config.params
       Object.keys(params).map(i=>{
        configData[i] = params[i]
       })
    }
    return configData;
}
// 拼接data
export const getData = (shouldKey:object,params:object)=>{
    let dataParams = {};
    Object.keys(shouldKey).map(index=>{
        const item = shouldKey[index];
        let indexMap = {};
        item.map((n) => {
            let vValue = null
            if(index === 'gte' && n.match(/_time$/ig)){
                vValue = params["createTime"];
            }else if(index === 'lte' && n.match(/_time$/ig)){
                vValue = params["endTime"];
            }else{
                vValue = params[n];
            }
            if((vValue??'')!=='') indexMap[n] = vValue
        });
        dataParams[index] = indexMap;
    })
    return dataParams
}

export const getFields = (shouldKey:Array<string>,params:object)=>{
    let dataParams = {};
    shouldKey.map(i=>{
        if((params[i]??'')!=='') dataParams[i] = params[i]
    })
    return dataParams
}