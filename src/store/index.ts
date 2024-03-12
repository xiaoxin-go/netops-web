import {reactive} from "vue";

export const store = reactive({
    userInfo: {username: ""},
    menuList: [],
    menuPermissions: [] as any,
    currentPath: "",
    auths: {} as any,
    spinning: false,
})
//
