
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
  }
]
