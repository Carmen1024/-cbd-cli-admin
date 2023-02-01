import { dictQuery } from '@/api/system/dictionary'
import { getData } from '@/utils/transform/httpConfig';

export const getAreaList=()=>{
    return new Promise((resolve,reject)=>{
        const params = {"dict_name":"地区","dict_key":"area",dict_val_type:6}
        dictQueryBy(params).then(data=>{
            resolve(data)
        })
    })
}

export const dictQueryBy = (d:object)=>{
    return new Promise((resolve,reject)=>{
        const dataFormat = {
            "eq":["dict_val_type"],
            "like":["dict_key","dict_name"]
        }
        const params = getData(dataFormat,d)
        dictQuery(params).then(res=>{
            const data = res.data ? res.data[0].dict_val : null
            resolve(data)
        },rej=>{
            resolve(null)
        })
    })

} 