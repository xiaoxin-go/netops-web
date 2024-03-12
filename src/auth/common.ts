import { store } from "@/store";
import netops from "./netops"

import { ref, Ref, computed} from "vue";
import {RestfulUris} from "modules/typing";

interface Api {
  method: string,
  uri: string
}

interface Permission {
  desc: string,
  apis: Api[]
}

type Permissions = { [key: string]: { [key: string]: Permission } } // {string: {string: Permission}}

const permissions: Permissions = {
  ...netops
}

const authEnabled = true

export class Auth {
  private readonly _menu: string
  private _permissions?: { [key: string]: Permission }
  private _menuPermissions: Ref<Array<Api>> = ref([])

  constructor(menu?: string) {
    this._menu = menu || store.currentPath
    this.initPermission()
    this.initMenuPermissions().then()
  }
  private initMenuPermissions = async () => {
    if (this._menuPermissions.value.length > 0) {
      return
    }
    this._menuPermissions.value = store.auths[this._menu]
  }
  private initPermission = () => {
    if (!this._menu) {
      console.warn(`${store.currentPath}对应的menu信息不存在`)
      return
    }
    if (!permissions[this._menu]) {
      console.warn(`${this._menu}对应的权限信息不存在`)
      return
    }
    this._permissions = permissions[this._menu]
  }
  private _checkAuth = (operate: string) =>{
    if(this._menu.startsWith("/admin"))return true    // 临时规则
    if (!this._permissions) {
      return false
    }
    const permission = this._permissions[operate]     // 获取预定义auth目录下当前菜单下操作的apis
    if (!permission) {
      console.warn(`${this._menu}-${operate}对应的权限信息不存在`)
      return false
    }
    for (const api of permission.apis) {              // 循环当前操作需要的所有apis
      if (this._menuPermissions.value.findIndex(item => item.method == api.method && item.uri == api.uri) == -1) {   // 如果返回的权限列表里有一个不存在则返回false
        return false
      }
    }
    return true
  }
  public useIsAuth = (operate: string) => {
    if (!authEnabled){
      return true
    }
    return computed(()=>{
      return this._menuPermissions.value.length > 0 && this._checkAuth(operate);
    })
  }
  public _getRestfulUris = (uris: RestfulUris) =>{
    const result = {} as any
    let k: keyof RestfulUris
    for (k in uris){          // 此k = [list, create, update, get, delete]
      if (this._checkAuth(k)){
        result[k] = uris[k]       // 有权限则追加进去
      }
    }
    return result
  }
  // 根据当前页面的权限来控制uris, uris={list: '', get: '', create: '', update: '', delete: ''}
  // 对比auth预定义的当前菜单operate(预定义的也有list,create,update,delete)，来判断每个的权限，如果存在则添加到结果里
  public useRestfulUris = (uris: RestfulUris) => {
    if (!authEnabled)return uris
    return computed(()=>{
      return this._menuPermissions?.value?.length > 0?this._getRestfulUris(uris):{}
    })
  }
}
