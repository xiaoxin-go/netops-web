import { Dict } from "@/interface/common";

const SsoUserInfoKey = "NETOPS_USER_INFO";
const MenuKey = "NETOPS_MENU_LIST";
const MenuPermissionsKey = "NETOPS_MENU_PERMISSIONS"

export const SetUserInfo = (data: Dict) => {
  localStorage.setItem(SsoUserInfoKey, JSON.stringify(data))
}
export const getUserInfo = () => {
  const result = localStorage.getItem(SsoUserInfoKey)
  if (result) {
    return JSON.parse(result)
  }
  return {}
}
export const SetMenuPermissions = (menu: string, permissions?: string[]) => {
  if (permissions) {
    localStorage.setItem(`${MenuPermissionsKey}:${menu}`, JSON.stringify(permissions))
  }
}
export const GetMenuPermissions = (menu: string) => {
  const result = localStorage.getItem(`${MenuPermissionsKey}:${menu}`)
  if (result) {
    return JSON.parse(result)
  }
  return null
}
export const SetStorageMenu = (data: Dict[]) => {
  localStorage.setItem(MenuKey, JSON.stringify(data))
}
export const GetStorageMenu = () => {
  const result = localStorage.getItem(MenuKey)
  if (result) {
    return JSON.parse(result)
  }
  return []
}
export const delUserInfo = () => {
  localStorage.removeItem(SsoUserInfoKey)
}
export const delMenu = () => {
  localStorage.removeItem(MenuKey)
}
export const clearPublicInfo = () => {
  delUserInfo();
  delMenu();
}
