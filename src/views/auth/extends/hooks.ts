import {reactive} from "vue";
import {APIUri, list, post} from "@/api";
import {notify} from "@kyvg/vue3-notification";
import {Encrypt, GeneOperateId} from "@/utils/encrypt";
import {LoginRequest} from "@/views/auth/extends/typings";
import {store} from "@/store";
import {SetStorageMenu, SetUserInfo} from "@/utils/storage";

export const useLogin = (finish: () => void) => {
    const data = reactive<LoginRequest>({
        username: '',
        password: '',
        operate_id: '',
    })
    const checks = reactive({
        username: {
            state: true, msg: ''
        },
        password: {
            state: true, msg: ''
        },
    })
    const validate = (): boolean => {
        let flag = true
        if (data.username === '') {
            checks.username.state = false
            checks.username.msg = '用户名不能为空'
            flag = false
        }else{
            checks.username.state = true
        }
        if (data.password === '') {
            checks.password.state = false
            checks.password.msg = '密码不能为空'
            flag = false
        }else{
            checks.password.state = true
        }
        return flag
    }
    const getUserInfo = async() =>{
        const res = await list(APIUri.auth.getUserInfo, {})
        if(res.data.code === 0){
            store.userInfo = res.data.data
            SetUserInfo(res.data.data)
        }
    }
    const getMenu = async () =>{
        const res = await list(APIUri.auth.getMenu, {})
        if (res.data.code === 0) {
            SetStorageMenu(res.data.data)
            store.menuList = res.data.data
        }
    }
    const submit = async () => {
        if(!validate()){
            console.log(checks)
            return
        }
        const res = await list(APIUri.auth.getPublicKey, {operate_id: data.operate_id})
        if(res.data.code !== 0){
            notify({type: 'error', text: res.data.msg})
            return
        }
        // 3. 使用公钥加密密码
        const publicKey = res.data.data
        const enPwd = Encrypt(publicKey, data.password)

        // 4. 调用登录接口
        const params = {...data, password: enPwd}
        const loginRes = await post(APIUri.auth.login, params)
        if(loginRes.data.code === 0){
            notify({type: 'success', text: '登录成功, 跳转到平台首页'})
            // 设置用户信息
            store.userInfo = loginRes.data.data
            // 获取菜单信息
            await getMenu()
            await getUserInfo()
            finish()
        }
    }
    const init = () =>{
        data.operate_id = GeneOperateId()
    }
    init()
    return {data, submit, checks}
}
