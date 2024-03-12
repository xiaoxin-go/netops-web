import {list, APIUri} from "@/api";
import {ref} from "vue";
import {store} from "@/store";
import {SetStorageMenu, SetUserInfo} from "@/utils/storage";

export const GetMenu = () => {
    const data = ref([])
    const run = async () => {
        const res = await list(APIUri.auth.getMenu, {})
        if (res.data.code === 0) {
            data.value = res.data.data
            store.menuList = res.data.data
            SetStorageMenu(res.data.data)
        }
    }
    run()
    return {data, run}
}

export const GetUserInfo = () => {
    const data = ref({})
    const run = async () => {
        const res = await list(APIUri.auth.getUserInfo, {})
        if (res.data.code === 0) {
            data.value = res.data.data
            store.userInfo = res.data.data
            SetUserInfo(res.data.data)
        }
    }
    run()
    return {data, run}
}
