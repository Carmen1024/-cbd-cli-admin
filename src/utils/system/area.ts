import store from '@/store'

export function getAreaStr(params: any) {
    let group1,group2,group3
    let {pro_code='',city_code='',area_code=''} = params
    const areaList = store.state.area.areaList
    group1 = areaList.find(item=>item.code == pro_code)
    if(!group1) return ''
    
    pro_code = group1.name
    group2 = group1.children.find(item=>item.code == city_code)
    if(!group2) return pro_code

    city_code = group2.name
    group3 = group2.children.find(item=>item.code == area_code)
    if(!group3) return pro_code + city_code

    area_code = group3.name
    return pro_code + city_code + area_code
  }

