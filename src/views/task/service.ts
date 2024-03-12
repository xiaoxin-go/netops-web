import {ref} from "vue";
import {APIUri, create, list} from "@/api";
import {notify} from "@kyvg/vue3-notification";


export const isOperate = (taskId: number) => {
    const isEdit = ref(false);
    const isToLeader = ref(false);
    const isGeneConfig = ref(false);
    const isVerifyPass = ref(false);
    const isExec = ref(false);
    const isReject = ref(false)
    const load = async (taskId: number) => {
        if (!taskId){
            return
        }
        const res = await list(APIUri.Task.isOperate, {task_id: taskId})
        if (res.data.code === 0){
            isEdit.value = res.data.data.is_edit
            isToLeader.value = res.data.data.is_to_leader
            isGeneConfig.value = res.data.data.is_gene_config
            isVerifyPass.value = res.data.data.is_verify_pass
            isExec.value = res.data.data.is_exec
            isReject.value = res.data.data.is_reject
        }
        return
    }
    load(taskId)
    return {isEdit, isToLeader, isGeneConfig, isVerifyPass, isExec, isReject, load}
}
export const GeneConfig = async(taskId: number) =>{
    const res = await create(APIUri.Task.geneConfig.replace(/:id/, taskId.toString()), {})
    if(res.data.code === 0){
        notify({type: 'success', text: res.data.message})
    }
    return
}
