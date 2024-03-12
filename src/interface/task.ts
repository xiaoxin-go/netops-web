export interface Task{
    id: number,
    jira_key: string,
    jira_status: string,
    jira_region: string,
    jira_environment: string,
    creator: string,
    template_id: number,
    summary: string,
    region: string,
    environment: string,
}
export interface TaskInfo{
    id: number,
    direction: string,
    src: string,
    dst: string,
    dport: string,
    protocol: string,
    line_type_id: number,
    static_ip: string,
    static_port: string,
    command: string,
    action: string,
}
export interface JiraFlow{
    name: string,
    next_name: string,
    btn_name: string,
    step: number
}
