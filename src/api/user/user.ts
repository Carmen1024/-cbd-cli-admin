import request from '@/utils/system/request'
import requestSeven from '@/utils/system/requestSeven'
// 获取数据api
export function userQuery(data: object) {
	return request({
		url: '/g/user/query',
		method: 'post',
		data
	})
}

//获取全部后管账号
export function manageUserQuery(data: object) {
	return request({
		url: '/g/user/manage_list',
		method: 'post',
		data
	})
}

export function userFetch(data: object) {
	return request({
		url: '/g/user/fetch',
		method: 'post',
		data
	})
}

export function userValid(data: object) {
	return request({
		url: '/g/user/valid',
		method: 'post',
		data
	})
}

export function userUpdate(data: object) {
	return request({
		url: '/g/user/update',
		method: 'post',
		data
	})
}

export function userDelete(data: object) {
	return request({
		url: '/g/user/del',
		method: 'post',
		data
	})
}

export function userInsert(data: object) {
	return request({
		url: '/g/user/insert',
		method: 'post',
		data
	})
}

///g/reg/reg_with_admin
export function adminUserInsert(data: object) {
	return request({
		url: '/g/reg/reg_with_admin',
		method: 'post',
		data
	})
}

export function adminUserValid(data: object) {
	return request({
		url: '/g/user/valid_manage',
		method: 'post',
		data
	})
}
// 获取用户权限
export function userRoleQuery(data: object) {
	return request({
		url: '/g/sys_role/list_permission',
		method: 'post',
		data
	})
}
// 新增或修改用户数据权限
export function insertOrUpdate(data: object) {
	return request({
		url: '/g/userData/insertOrUpdate',
		method: 'post',
		data
	})
}

// 查询用户数据权限
export function dataRoleSelect(data: object) {
	return request({
		url: '/g/userData/select',
		method: 'post',
		data
	})
}
// 清空用户数据权限
export function dataRoleDelete(data: object) {
	return request({
		url: '/g/userData/delete',
		method: 'post',
		data
	})
}
// 服务费权限
export function userDataPermission(data: object) {
	return requestSeven({
		url: '/g/userDataPermission/findDetail',
		method: 'post',
		data
	})
}
// 服务费权限
export function userDataPermissionAdd(data: object) {
	return requestSeven({
		url: '/g/userDataPermission/add',
		method: 'post',
		data
	})
}