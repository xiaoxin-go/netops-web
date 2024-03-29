import {computed, Ref, ref} from "vue";
import {VATableRecord} from "../../VATable/extends/typing";
import {VAFormItem} from "../../VAForm/extends/typing";
import {create, update} from "../../../utils/requests";
import { notify } from "@kyvg/vue3-notification";
import {KeyValueType, RestfulUris} from "../../../typing";
import {post} from "@/api";

export const useFormDrawer = (items: Array<VAFormItem>, defaultData: KeyValueType) =>{
    const title = ref("添加")
    const visible = ref(false)
    const data = ref({})

    const cancel = () =>{
        visible.value = false
        data.value = {...defaultData}
    }

    // 初始化表单元数据, 设置默认值
    const initData = () =>{
        const source = {...defaultData} as any
        items.forEach(item => {
            // 初始化默认值
            if (item.default) {
                source[item.key] = item.default;
            }
        });
        data.value = source
    }

    const add = () =>{
        title.value = '添加'
        initData()
        visible.value = true
    }

    const edit = (record: VATableRecord, key: string) =>{
        title.value = "修改" + record[key]
        data.value = {...record}
        visible.value = true
    }

    const submit = (params: any, emit: any, uris: RestfulUris, reload: any) =>{
        const beforeCreate = (params: any) =>{
            emit('beforeCreate', params, (val: any) => params=val)
            return params
        }
        const afterCreate = (params: any, res: any) =>{
            emit('afterCreate', params, res)
        }
        const beforeUpdate = (params: any) =>{
            emit('beforeUpdate', params, (val: any) => params=val)
            return params
        }
        const afterUpdate = (params: any) =>{
            emit('afterUpdate', params)
        }
        const run = async () =>{
            let res: any;
            let newParams: any;
            if (title.value === "添加") {
                newParams = beforeCreate(params);
                console.log("params----------->", newParams)
                if (!newParams){
                    return
                }
                if (uris?.create) {
                    res = await create(uris.create, newParams);
                }
            } else {
                newParams = beforeUpdate(params)
                console.log("new params------>", newParams)
                if(!newParams){
                    return
                }
                if (uris?.update) {
                    res = await update(uris.update, newParams);
                }
            }
            if (res && res.data.code === 0) {
                notify({type: 'success', text: res.data.msg})
                // 点击表单提交成功，调用后续事件
                visible.value = false;  // 关闭抽屉
                reload();   // 重载表格数据
                visible.value = false
            }
            (title.value === '添加'?afterCreate:afterUpdate)(newParams, res)
        }
        run()
    }

    return {title, visible, data, cancel, add, edit, submit}
}

export const useTableRef = (uris: RestfulUris, defaultParams: any, emit: any) =>{
    const beforeDelete = (params: any) =>{
        emit('beforeDelete', params, (val: any) => params=val)
        return params
    }
    const table: Ref = ref({reload: ()=>{return}})
    const reload = (params: any) =>{
        table.value.reload(params)
    }
    const remove = (record: VATableRecord) =>{
        const run = async () =>{
            if(uris.delete) {
                const params = beforeDelete(record)
                const res = await post(uris.delete, params)
                if (res && res.data.code === 0) {
                    notify({type: 'success', text: res.data.msg})
                    // 点击表单提交成功，调用后续事件
                    reload(defaultParams || {});   // 重载表格数据
                }
            }
        }
        run()
    }
    return {table, reload, remove}
}

export const useInitDrawerItems = (title: string, items: Array<VAFormItem>) => {
    const newItems = computed(()=>{
        if (title.toString() === '添加')
            return items
        return (items as Array<VAFormItem>).map(item=>{
            if (item.update === false)
                item.disabled = true
            return item
        })
    })
    return {newItems}
}
