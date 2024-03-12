export const APIUri = {
    auth: {
        login: '/auth/login',
        getMenu: '/auth/menus',
        getUserInfo: '/auth/user_info',
        getPublicKey: '/auth/public_key'
    },
    Device: {
        restful: {
            list: "/device/firewalls",
            create: "/device/firewall",
            update: "/device/firewall",
            delete: "/device/firewall"
        },
        policy: "/device/firewall/policy",
        policyLog: "/device/firewall/policy_log",
        backup: "/device/firewall/backup"
    },
    NLBDevice: {
        restful: {
            list: "/device/nlbs",
            create: "/device/nlb",
            update: "/device/nlb",
            delete: "/device/nlb"
        },
        policy: "/device/nlb/policy",
        policyLog: "/device/nlb/policy_log"
    },
    Backup: {
      list: "/device/backups",
      download: "/device/backup/download"
    },
    Task: {
        restful: {
            list: "/tasks",
            get: "/task",
            create: "/task",
            delete: "/task"
        },
        info: {
            restful: {
                list: '/task/infos',
                create: '/task/info',
                delete: '/task/info',
            }
        },
        addInfos: '/task/infos',
        geneConfig: '/task/gene_config',
        exec: '/task/exec',
        isOperate: '/task/is_operate',
        operateLog: '/task/operate_log',
        syncJiraStatus: '/task/sync_jira',
        verifyPass: '/task/verify_pass',
        toLeader: '/task/to_leader',
        reject: '/task/reject',
        toExecutor: '/task/to_executor'
    },
    Policy: {
        firewall: {
            restful: {
                list: '/policy/firewall'
            }
        },
        nlb: {
            restful: {
                list: '/policy/nlb'
            }
        },
        firewallNat: {
            restful: {
                list: '/policy/firewall_nat'
            }
        },
    },

    PublicWhitelist: {
        restful: {
            list: '/tools/public_whitelists',
            create: '/tools/public_whitelist',
            update: '/tools/public_whitelist',
            delete: '/tools/public_whitelist',
        },
        parse: '/tools/public_whitelist/parse',
        parseAll: '/tools/public_whitelist/parse_all'
    },
    InvalidPolicy: {
        restful: {
            list: '/tools/invalid_policy_tasks',
            create: '/tools/invalid_policy_task',
            update: '/tools/invalid_policy_task',
            delete: '/tools/invalid_policy_task',
        },
        parse: '/tools/invalid_policy_task/parse',
        policyHitCountList: '/tools/invalid_policy_task/policy_hit_counts',
    },
    // admin
    DeviceType: {
        restful: {
            list: '/admin/device_types',
            delete: '/admin/device_type',
            update: '/admin/device_type',
            create: '/admin/device_type'
        }
    },
    NLBDeviceType: {
        restful: {
            list: '/admin/nlb_device_types',
            delete: '/admin/nlb_device_type',
            update: '/admin/nlb_device_type',
            create: '/admin/nlb_device_type'
        }
    },
    ImplementType: {
        restful: {
            list: '/admin/implement_types',
            create: '/admin/implement_type',
            delete: '/admin/implement_type',
            update: '/admin/implement_type',
        }
    },
    Region: {
        restful: {
            list: '/admin/regions',
            get: '/admin/region',
            create: '/admin/region',
            update: '/admin/region',
            delete: '/admin/region',
        }
    },
    OutboundNetworkType: {
        restful: {
            list: '/admin/outbound_network_types',
            get: '/admin/outbound_network_type',
            create: '/admin/outbound_network_type',
            update: '/admin/outbound_network_type',
            delete: '/admin/outbound_network_type',
        }
    },
    IssueType: {
        restful: {
            list: '/admin/issue_types',
            get: '/admin/issue_type',
            create: '/admin/issue_type',
            update: '/admin/issue_type',
            delete: '/admin/issue_type',
        }
    },
    Subnet: {
        restful: {
            list: '/admin/subnets',
            get: '/admin/subnet',
            create: '/admin/subnet',
            update: '/admin/subnet',
            delete: '/admin/subnet'
        }
    },
    DeviceAddressGroup: {
        restful: {
            list: '/admin/device_address_groups',
        }
    },
    NatAddress: {
        restful: {
            list: '/admin/nat_addresses',
            get: '/admin/nat_address',
            create: '/admin/nat_address',
            update: '/admin/nat_address',
            delete: '/admin/nat_address'
        }
    },
    DeviceNatPool: {
        restful: {
            list: '/admin/device_nat_pools',
        }
    },
    FirewallSubnet: {
        restful: {
            list: '/admin/firewall_subnets',
            get: '/admin/firewall_subnet',
            create: '/admin/firewall_subnet',
            update: '/admin/firewall_subnet',
            delete: '/admin/firewall_subnet'
        }
    },
    NLBSubnet: {
        restful: {
            list: '/admin/nlb_subnets',
            get: '/admin/nlb_subnet',
            create: '/admin/nlb_subnet',
            update: '/admin/nlb_subnet',
            delete: '/admin/nlb_subnet'
        }
    },
    F5SnatPool: {
        restful: {
            list: '/admin/f5_snat_pools',
            get: '/admin/f5_snat_pool',
            create: '/admin/f5_snat_pool',
            update: '/admin/f5_snat_pool',
            delete: '/admin/f5_snat_pool'
        }
    },
    TaskStatus: {
        restful: {
            list: '/admin/task_statuses',
            get: '/admin/task_status',
            create: '/admin/task_status',
            update: '/admin/task_status',
            // delete: '/admin/task_status'
        }
    },
    TaskTemplate: {
        restful: {
            list: '/admin/task_templates',
            get: '/admin/task_template',
            create: '/admin/task_template',
            update: '/admin/task_template',
            delete: '/admin/task_template'
        }
    },
    Log: {
        restful: {
            list: '/system/logs',
        }
    },
    User: {
        restful: {
            list: '/system/users',
            get: '/system/user',
            create: '/system/user',
            update: '/system/user',
            delete: '/system/user'
        }
    },
    Menu: {
        restful: {
            list: '/admin/menus',
            get: '/admin/menu',
            create: '/admin/menu',
            update: '/admin/menu',
            delete: '/admin/menu'
        },
        relationApi: "/admin/menu/relation_api",
        getRelationApiIds: '/admin/menu/relation_api_ids',
    },
    Api: {
        restful: {
            list: '/admin/apis',
            get: '/admin/api',
            create: '/admin/api',
            update: '/admin/api',
            delete: '/admin/api'
        },
    },
    Role: {
        restful: {
            list: '/system/roles',
            get: '/system/role',
            create: '/system/role',
            update: '/system/role',
            delete: '/system/role'
        },
        permission: '/system/role/permission',
    },
}
