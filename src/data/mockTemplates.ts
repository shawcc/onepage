
export interface Template {
  id: string
  name: string
  description: string
  thumbnail: string
  category: 'marketplace' | 'documentation'
  tags: string[]
  conversionScore: number
  initialData: {
    layout: 'marketplace' | 'landing' | 'feishu'
    theme: {
      primaryColor: string
      secondaryColor: string
      backgroundColor: string
      textColor: string
    }
    appInfo: {
      icon: string // Emoji or URL
      name: string
      tagline: string
      vendor: string
      rating: number
      reviewCount: number
      installCount: string
      badge?: string // e.g. "Cloud Fortified"
    }
    media: {
      type: 'image' | 'video'
      url: string
      thumbnail?: string
    }[]
    tabs: {
        overview: {
            summary: string // "About this app" text
            features: {
                title: string
                description: string
            }[]
            benefits?: string[]
        }
        pricing?: any
    }
    sidebar: {
      title: string
      items: {
        label: string
        value?: string
        href?: string
        icon?: string
      }[]
    }[]
  }
}

export const mockTemplates: Template[] = [
  {
    id: 'feishu-change-management',
    name: '变更管理 (飞书/Lark 风格)',
    description: '飞书/Lark 开放平台插件详情页风格。干净、模块化，强调基本信息和多场景适用性。',
    thumbnail: 'https://placehold.co/500x320/3370ff/ffffff?text=Feishu+App+Detail',
    category: 'marketplace',
    tags: ['Project Management', 'Change Control', 'Feishu'],
    conversionScore: 96,
    initialData: {
      layout: 'feishu',
      theme: {
        primaryColor: '#3370ff', // Feishu Blue
        secondaryColor: '#eff3ff',
        backgroundColor: '#ffffff',
        textColor: '#1f2329'
      },
      appInfo: {
        icon: '🔄',
        name: '变更管理',
        tagline: '支持节点流工作项，在节点完成时触发飞书审批流程，并支持将飞书项目字段信息传入飞书审批单。适用于立项等严格项目管理流程。',
        vendor: '飞书项目',
        rating: 4.8,
        reviewCount: 120,
        installCount: '27721',
        badge: '新'
      },
      media: [
         // Used as the "Banner" in Feishu layout
        { type: 'image', url: 'https://placehold.co/800x450/eff3ff/3370ff?text=Feishu+Approval+Flow+Banner' }
      ],
      tabs: {
        overview: {
          summary: "Advanced time tracking, timesheets, and cost tracking. Automatic time tracker. Worklog Reports for Billing. Calendar integration\n\n### All-in-One Time and Cost Tracker\nSimplify project management and billing with a single, easy to use, affordable solution. Track time, costs and rates in one place.",
          features: [
            {
              title: "Time Tracking Flexibility",
              description: "Give teams a choice — electronic, manual or timer. Log hours based on issue status to track time passively, minimizing invasive interruptions. Add and view worklogs from issues, timesheet or calendar."
            },
            {
              title: "Maximize Project Efficiency",
              description: "Advanced reporting to accurately and easily measure time, costs, and rates. Track estimates and actuals for a zoomed out view of project progress. Configurable cost and rate settings for detailed breakdowns."
            }
          ]
        }
      },
      sidebar: [
        {
          title: '基本信息',
          items: [
            { label: '开发者', value: '飞书项目' },
            { label: '联系邮箱', value: 'contact@feishu.cn', href: 'mailto:contact@feishu.cn' },
            { label: '版本号', value: '5.2.1.2' },
            { label: '最近更新', value: '2026-01-27' },
            { label: '授权文件', value: '查看授权文件', href: '#' }
          ]
        },
        {
          title: '适用于以下位置',
          items: [
            { label: '统计', value: '2个控件可用' },
            { label: '详情页', value: '关联表单' },
            { label: '列表页', value: '支持' },
            { label: '审批单', value: '支持' },
            { label: '插件配置', value: '支持' }
          ]
        }
      ]
}
  },
  {
    id: 'feishu-time-management',
    name: '工时管理 (飞书/Lark 风格)',
    description: '专业的工时与资源管理插件详情页。展示了多维度的时间追踪、资源规划和团队协作功能。',
    thumbnail: 'https://placehold.co/500x320/6f5cf1/ffffff?text=Feishu+Time+Management',
    category: 'marketplace',
    tags: ['Time Management', 'Resource Planning', 'Feishu'],
    conversionScore: 97,
    initialData: {
      layout: 'feishu',
      theme: {
        primaryColor: '#6f5cf1', // Purple from the icon
        secondaryColor: '#f3f0ff',
        backgroundColor: '#ffffff',
        textColor: '#1f2329'
      },
      appInfo: {
        icon: '⏱️',
        name: '工时管理',
        tagline: '支持项目工时管理，统计每日或某段时间工时数据，并支持时间可视化图表和信息入门导览等，适用于企业内的项目管理流程。',
        vendor: '飞书项目',
        rating: 4.9,
        reviewCount: 210,
        installCount: '27721',
        badge: '官方'
      },
      media: [
        { type: 'image', url: 'https://placehold.co/800x450/6f5cf1/ffffff?text=Resource+Planning+Banner' }
      ],
      tabs: {
        overview: {
          summary: "Resource Management, Timesheet Reports, Resource Planning & Timelines, Capacity Planner, Tracker and Advanced Roadmaps Integration\n\n### Resource Planning & Time Tracking\nResource Allocation, Team Capacity & Team Calendar. Activity Timeline resource planning tool provides visibility for your resource capacity planning.",
          features: [
            {
              title: "Planner",
              description: "Resource & Capacity Management. Resource utilization & Team planning available in capacity planner. Check available capacity with our calendar for Jira tasks."
            },
            {
              title: "Workspace",
              description: "Personal Scheduling & Time Tracking. Personal time tracker, Time Tracking & Charts. Users can see the scheduled tasks & track time. Export tasks into personal Calendars."
            },
            {
              title: "Timesheets",
              description: "Timesheet Reports. Custom timesheet reports for Jira on team & individual levels. Get Planned vs Actual, Resource Utilization & Project Reports."
            }
          ]
        }
      },
      sidebar: [
        {
          title: '基本信息',
          items: [
            { label: '开发者', value: '飞书项目' },
            { label: '联系邮箱', value: 'contact@feishu.cn', href: 'mailto:contact@feishu.cn' },
            { label: '版本号', value: '5.2.12' },
            { label: '最近更新', value: '2026-01-27' },
            { label: '插件分类', value: '项目管理' },
            { label: '隐私协议', value: '查看隐私协议', href: '#' }
          ]
        },
        {
          title: '适用于以下位置',
          items: [
            { label: '协作', value: '支持部门' },
            { label: '项目管理', value: '人员规模 2 人以上' },
            { label: '效率提升', value: '大规模部署' },
            { label: '插件集成', value: '工作流集成' }
          ]
        }
      ]
    }
  }
]
