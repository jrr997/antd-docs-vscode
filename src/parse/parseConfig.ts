export interface ComponentParseConfig {
  name: string; // name will be stored in docsMap, which is always lowercase.
  heading: string; // md heading text before target table
}

export interface ParseConfigMap {
  [componentName: string]: ComponentParseConfig[];
}

// TODO: version
export const parseConfigMap: ParseConfigMap = {
  typography: [
    {
      name: 'typography.text',
      heading: 'Typography.Text',
    },
    {
      name: 'typography.title',
      heading: 'Typography.Title',
    },
    {
      name: 'typography.paragraph',
      heading: 'Typography.Paragraph',
    }
  ],
  grid: [
    {
      name: 'row',
      heading: 'Row',
    },
    {
      name: 'col',
      heading: 'Col',
    },
  ],
  layout: [
    {
      name: 'layout',
      heading: 'Layout'
    },
    {
      name: 'layout.sider',
      heading: 'Layout.Sider'
    },
  ],
  space: [
    {
      name: 'space',
      heading: 'Space'
    },
    //  antd@4.24.0
    {
      name: 'space.compact',
      heading: 'Space.Compact'
    },
  ],
  dropdown: [
    {
      name: 'dropdown',
      heading: 'API'
    },
    {
      name: 'dropdown.button',
      heading: 'Dropdown.Button'
    },
  ],
  // TODO: Checkbox.group是API后的第二个表格
  // TODO: DatePicker的picker属性不同时API不同，且与RangePicker有共用表格
  // TODO: Button属性不同时API不同
  form: [
    {
      name: 'form',
      heading: 'Form'
    },
    {
      name: 'form.item',
      heading: 'Form.Item'
    },
    {
      name: 'form.list',
      heading: 'Form.List'
    },
    {
      name: 'form.errorlist',
      heading: 'Form.ErrorList'
    },
    {
      name: 'form.provider',
      heading: 'Form.Provider'
    },
  ],
  input: [
    {
      name: 'input',
      heading: 'Input'
    },
    // TODO: 共用API，没有heading
    {
      name: 'input.textarea',
      heading: 'Input.TextArea'
    },
    {
      name: 'input.search',
      heading: 'Input'
    }, {
      name: 'input.password',
      heading: 'Input'
    },
  ],
  radio: [
    {
      name: 'radio',
      heading: 'API',
    },
    {
      name: 'radio.button',
      heading: 'API',
    },
    {
      name: 'radio.group',
      // TODO: zh 是'Radio.Group' 而 en 是 RadioGroup
      heading: 'Radio.Group',
    },
  ],
  timepicker: [
    {
      name: 'timepicker',
      heading: 'API',
    },
    // TODO: 共用表格
    {
      name: 'timepicker.rangepicker',
      heading: 'RangePicker',
    },
  ],
  avatar: [
    {
      name: 'avatar',
      heading: 'Avatar',
    },
    //4.5.0+
    {
      name: 'avatar.group',
      heading: 'Avatar.Group (4.5.0+)',
    },
  ],
  badge: [
    {
      name: 'badge',
      heading: 'Badge',
    },
    //4.5.0+
    {
      name: 'badge.ribbon',
      heading: 'Badge.Ribbon (4.5.0+)',
    },
  ],
  card: [
    {
      name: 'card',
      heading: 'Card'
    },
    {
      name: 'card.grid',
      heading: 'Card.Grid'
    },
    {
      name: 'card.meta',
      heading: 'Card.Meta'
    },
  ],
  collapse: [
    {
      name: 'collapse',
      heading: 'Collapse'
    },
    {
      name: 'collapse.panel',
      heading: 'Collapse.Panel'
    },
  ],
  descriptions: [
    {
      name: 'descriptions',
      heading: 'Descriptions',
    },
    {
      name: 'descriptions.item',
      heading: 'DescriptionItem',
    },
  ],
  list: [
    {
      name: 'list',
      heading: 'List',
    },
    {
      name: 'list.item',
      heading: 'List.Item',
    }, {
      name: 'list.item.meta',
      heading: 'List.Item.Meta',
    },
  ],
  statistic: [
    {
      name: 'statistic',
      heading: 'API',
    },
    // TODO: Statistic.Countdown无countdown
  ],
  tabs: [
    {
      name: 'tabs',
      heading: 'Tabs',
    },
    {
      name: 'tabs.item',
      heading: 'TabItemType',
    },
  ],
  tag: [
    {
      name: 'tag',
      heading: 'Tag'
    },
    {
      name: 'tag.checkabletag',
      heading: 'Tag.CheckableTag'
    }
  ],
  timeline: [
    {
      name: 'timeline',
      heading: 'Timeline'
    },
    {
      name: 'timeline.item',
      heading: 'Items'
    },
  ],
  // TODO: tooltip无heading
  // TODO: tree共用
  tree: [
    {
      name: 'tree',
      heading: 'Tree props'
    },
    {
      name: 'directorytree',
      heading: 'DirectoryTree props'
    }
  ],
  alert: [
    {
      name: 'alert',
      heading: 'API'
    },
    {
      name: 'alert.errorboundary',
      heading: 'Alert.ErrorBoundary'
    }
  ],
  // TODO:  Progress type不同table不同
  'float-button': [
    {
      name: 'float-button',
      heading: 'API',
    },
    {
      name: 'floatbutton.group',
      heading: 'FloatButton.Group',
    },
    {
      name: 'floatbutton.backtop',
      heading: 'FloatButton.BackTop',
    },
  ]
};