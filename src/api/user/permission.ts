import request from '@/utils/system/request'
// 获取数据api
export function menuQuery(data: object) {
    return request({
        url: '/g/sys_menu/list_tree',
        method: 'post',
        data
    })
}

//新增菜单
export function menuAdd(data: object) {
    return request({
        url: '/g/sys_menu/insert',
        method: 'post',
        data
    })
}
// 查询菜单详情
export function menuInfo(data: object) {
    return request({
        url: '/g/sys_menu/info',
        method: 'post',
        data
    })
}
// 修改菜单
export function menuUpdate(data: object) {
    return request({
        url: '/g/sys_menu/update',
        method: 'post',
        data
    })
}
// 删除菜单
export function menuDelete(data: object) {
    return request({
        url: '/g/sys_menu/del',
        method: 'post',
        data
    })
}

// 角色列表
export function rolePage(data: object) {
    return request({
        url: '/g/sys_role/page',
        method: 'post',
        data
    })
}
// 角色列表
export function roleList() {
    return request({
        url: '/g/sys_role/list',
        method: 'get',
    })
}
// 新增角色
export function roleAdd(data: object) {
    return request({
        url: '/g/sys_role/insert',
        method: 'post',
        data
    })
}
// 修改角色
export function roleUpdate(data: object) {
    return request({
        url: '/g/sys_role/update',
        method: 'post',
        data
    })
}
// 删除角色
export function roleDelete(data: object) {
    return request({
        url: '/g/sys_role/del',
        method: 'post',
        data
    })
}
// 更新角色权限
export function rolePermission(data: object) {
    return request({
        url: '/g/sys_role/save_permission',
        method: 'post',
        data
    })
}
// 获取菜单列表
export function menuListQuery(data: object) {
    return request({
        url: '/g/sys_menu/list',
        method: 'post',
        data
    })
}