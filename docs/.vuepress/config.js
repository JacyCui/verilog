module.exports = {
    title: 'Verilog教程', // 网站标题
    description: '基于Verilog的芯片设计教程', // 网站描述

    // 插入html头
    head: [
        ['link', { rel: 'icon', href: '/favicon.png' }]
    ],

    // 插件
    plugins: [
        ['@maginapp/vuepress-plugin-katex', { // katex公式
          delimiters: 'dollars'
        }],

        ['vuepress-plugin-container', {
            type: 'definition',
            before: info => `<div class="definition"><p class="title">${info}</p>`,
            after: '</div>',
        }],

        ['vuepress-plugin-container', {
            type: 'theorem',
            before: info => `<div class="theorem"><p class="title">${info}</p>`,
            after: '</div>',
        }],

        ['vuepress-plugin-container', {
            type: 'conclusion',
            before: info => `<div class="conclusion"><p class="title">${info}</p>`,
            after: '</div>',
        }],

        ['@vuepress/back-to-top'],

        ['vuepress-plugin-mygitalk', {
            // 是否启用(关闭请设置为false)(default: true)
            enable: false,
            // 是否开启首页评论(default: true)
            home: false,
            // Gitalk配置
            gitalk: {
                // GitHub Application Client ID.
                clientID: 'd82b318c0c7bcc30fc72',
                // GitHub Application Client Secret.
                clientSecret: 'c1d713026e3dc925bf0afa184fc2339ce730c3ca',
                // GitHub repository. 存储评论的 repo
                repo: 'static-analysis',
                // GitHub repository 所有者，可以是个人或者组织。
                owner: 'JacyCui',
                // 设置语言(default: zh-CN)
                language: 'zh-CN',
            }
        }]
    ],
    
    markdown: { // markdown渲染设置
        lineNumbers: true
    },
    locales: {  // 网站语言设置
        '/': {
            lang: 'zh-CN'
            // title: 'VuePress',
            // description: 'Vue-powered Static Site Generator'
        }
    },
    themeConfig: { // 主题设置
        // 关于导航栏
        logo: '/favicon.png', // 导航栏logo
        navbar: true, // 启用导航栏
        nav: [ // 导航栏内容设置
            {
                text: '目录',
                items: [
                    {
                        text: '导论',
                        items: [
                            {text: 'Verilog是什么？', link: '/1-1-what-is-verilog/'},
                            {text: 'Verilog引入', link: '/1-2-introduction-to-verilog/'},
                            {text: '芯片的设计流程', link: '/1-3-chip-design-flow/'},
                            {text: '芯片的抽象层次', link: '/1-4-chip-abstraction-layers/'}
                        ]
                    },
                    {
                        text: '数据类型',
                        items: [
                            {text: 'Verilog 语法', link: '/2-1-syntax/'},
                            {text: 'Verilog 数据类型', link: '/2-2-data-types/'},
                            {text: 'Verilog 标量与向量', link: '/2-3-scalar-and-vector/'},
                            {text: 'Verilog 数组与内存', link: '/2-4-array/'}
                        ]
                    },
                    {
                        text: '块构建',
                        items: [
                            {text: 'Verilog 模块', link: '/3-1-module/'},
                            {text: 'Verilog 端口', link: '/3-2-ports/'},
                            {text: 'Verilog 模块实例化', link: '/3-3-module-instantiation/'},
                            {text: 'Verilog assign语句', link: '/3-4-assign-statement/'},
                            {text: 'assign 与组合逻辑', link: '/3-5-assign-examples/'},
                            {text: 'Verilog 操作符', link: '/3-6-operator/'},
                            {text: 'Verilog 拼接', link: '/3-7-concatenation/'},
                            {text: 'Verilog always语句块', link: '/3-8-always-block/'},
                            {text: 'always 语句块与组合逻辑', link: '/3-9-combinational-logic-with-always/'},
                            {text: 'always 语句块与时序逻辑', link: '/3-10-sequential-logic-with-always/'},
                            {text: 'Verilog initial 语句块', link: '/3-11-initial-block/'},
                            {text: 'Verilog 简而言之', link: '/3-12-in-a-nut-shell/'},
                            {text: 'Verilog generate 语句块', link: '/3-13-generate-block/'},
                            {text: 'Verilog 检测器', link: '/3-14-detector/'}
                        ]
                    },
                    {
                        text: '行为建模',
                        items: [
                            {text: 'Verilog 块语句', link: '/4-1-block-statements/'}
                        ]
                    }
                ]
            },
            { text: '笔者博客', link: 'https://blog.cuijiacai.com' },
        ],
        // repo: 'JacyCui/static-analysis', // 文档项目的github仓库

        // 关于侧边栏
        displayAllHeaders: false, // 显示所有页面的标题链接，否则只显示当前页面的
        activeHeaderLinks: false, // 活动的标题链接
        sidebarDepth: 3, // 
        sidebar: [
            '/preface/',
            {
                title: '导论',   
                // path: '/1-1-what-is-verilog/',
                collapsable: false,
                sidebarDepth: 1,
                children: [
                    '/1-1-what-is-verilog/',
                    '/1-2-introduction-to-verilog/',
                    '/1-3-chip-design-flow/',
                    '/1-4-chip-abstraction-layers/'
                ]
            },
            {
                title: '数据类型',   
                // path: '/2-1-syntax/',
                collapsable: false,
                sidebarDepth: 1,
                children: [
                    '/2-1-syntax/',
                    '/2-2-data-types/',
                    '/2-3-scalar-and-vector/',
                    '/2-4-array/'
                ]
            },
            {
                title: '块构建',   
                // path: '/06-pta-intro/',
                collapsable: false,
                sidebarDepth: 1,
                children: [
                    '/3-1-module/',
                    '/3-2-ports/',
                    '/3-3-module-instantiation/',
                    '/3-4-assign-statement/',
                    '/3-5-assign-examples/',
                    '/3-6-operator/',
                    '/3-7-concatenation/',
                    '/3-8-always-block/',
                    '/3-9-combinational-logic-with-always/',
                    '/3-10-sequential-logic-with-always/',
                    '/3-11-initial-block/',
                    '/3-12-in-a-nut-shell/',
                    '/3-13-generate-block/',
                    '/3-14-detector/'
                ]
            },
            {
                title: '行为建模',   
                // path: '/11-ifds/',
                collapsable: false,
                sidebarDepth: 1,
                children: [
                    '/4-1-block-statements/'
                ]
            }
            // ['/demo', 'Explicit link text'], // 显示地指定文字
        ],

        // 关于页脚
        nextLinks: true, // 下一篇
        prevLinks: true, // 上一篇
        lastUpdated: '最后更新', // string | boolean 最后更新时间
        repoLabel: '查看源码',
        // docsRepo: 'vuejs/vuepress', // 文档仓库，默认为项目仓库
        docsDir: 'docs', // 文档目录
        docsBranch: 'main', // 文档分支
        editLinks: true,
        editLinkText: '帮助我改善此页面！',

        smoothScroll: true // 页面滚动 
    }
}

