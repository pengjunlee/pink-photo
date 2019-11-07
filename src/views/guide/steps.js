const steps = [
  {
    element: '#hamburger-container',
    popover: {
      title: '菜单栏',
      description: '折叠与展开侧边菜单栏',
      position: 'bottom'
    }
  },
  {
    element: '#breadcrumb-container',
    popover: {
      title: '当前页面',
      description: '指示了你当前所在的页面',
      position: 'bottom'
    }
  },
  {
    element: '#header-search',
    popover: {
      title: '搜索页面',
      description: '你可以在这里快速搜索想要打开的页面',
      position: 'left'
    }
  },
  {
    element: '#screenfull',
    popover: {
      title: '全屏显示',
      description: '全屏显示当前页面',
      position: 'left'
    }
  },
  {
    element: '#tags-view-container',
    popover: {
      title: '标签页',
      description: '你访问过的历史页面会在这里展示',
      position: 'bottom'
    },
    padding: 0
  }
]

export default steps
