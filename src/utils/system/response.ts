// 相应格式：
// {
//     "code":"",  //响应代号
//     "desc":"",  //响应描述
//     "count":-1,  //响应数据计数，如查询返回了10条。
//     "total":"",  //数据总数，如果查询总数
//     "is_list":false,  //是否是列表
//     "ext":{},  //可选，扩展字段，被用
//     "data":{}  //业务数据内容
// }
interface responseInterface{
    code:string,
    desc?:string,
    data:object,
    count?:number,
    total?:number,
    ext?:object,
    is_list?:boolean
}

export const getContent = (response:responseInterface)=>{
    return response.data;
}

