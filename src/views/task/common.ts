export const directions = {
    inside: {label: "入向", color: "green"},
    outside: {label: "出向", color: "blue"},
}
export const actions = {
    deny: {label: "新增配置", color: "green"},
    permit: {label: "已有配置", color: "blue"}
}
export const execStatus = {
    init: {label: "初始化", color: "default"},
    ready: {label: "待执行", color: "processing"},
    success: {label: "执行成功", color: "success"},
    failed: {label: "执行失败", color: "error"}
}
export const execStatusColors = {
    init: "processing",
    ready: "processing",
    review: "purple",
    executing: "orange",
    success: "success",
    failed: "error",
    reject: "error",
}
export const execStatusCn = {
    reject: "驳回",
    init: "初始化",
    ready: "配置获取成功",
    review: "审核中",
    executing: "执行中",
    success: "执行成功",
    failed: "执行失败"
}
export const taskStatus = {
    reject: "驳回",
    init: "初始化",
    ready: "待执行",
    executing: "执行中",
    failed: "执行失败",
    success: "执行成功"
}
export const jiraStatusColors = {
    "关闭": "pink",
    "验收中": "green",
    "网络运维实施": "orange",
    "编写方案": "blue",
    "安全中心审批": "purple",
    "技术风险一号位审核": "purple",
    "驳回": "red",
    "执行方审批": "purple",
    "送LEADER审核": "cyan"
}
