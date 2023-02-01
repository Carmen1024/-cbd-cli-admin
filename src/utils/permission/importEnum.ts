// 链接-文件对照

//首页
 const dashboard = () =>
  import('@/views/main/dashboard/index.vue')

// 用户中心
const user_user= () =>
  import('@/views/main/user/user/index.vue')



export const pageObjData = [
    {value:'/dashboard',importObj : dashboard},
    
    {value:'/user/user',importObj : user_user},
]
