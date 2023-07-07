import { ComponentParseConfig } from "../types";
import { datePickerParser } from "./parseUtil";


export interface ParseConfigMap {
  [componentName: string]: ComponentParseConfig[];
}

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
      heading: 'API'
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
  checkbox: [
    {
      name: 'checkbox',
      heading: 'API'
    },
    {
      name: 'checkbox.group',
      heading: 'API',
      index: 1
    },
  ],

  // TODO: DatePicker的picker属性不同时API不同，且与RangePicker有共用表格
  "date-picker": [
    {
      name: 'datepicker',
      parser: datePickerParser,
    }, {
      name: 'rangepicker',
      parser: datePickerParser
    }
  ],
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
      heading: ['Radio.Group', 'RadioGroup'],
    },
  ],
  "time-picker": [
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
      heading: ['Avatar', 'API'],
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
      heading: ['Badge', 'API'],
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
    {
      name: 'statistic.countdown',
      heading: 'API',
      index: 1,
    },
  ],
  tabs: [
    {
      name: 'tabs',
      heading: 'Tabs',
    },
    {
      name: 'tabs.tabPane',
      heading: 'Tabs.TabPane'
    }
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
      heading: ['Items', 'Timeline.Item']
    },
  ],
  // TODO: tooltip无heading,应显示API下所有内容
  tree: [
    {
      name: 'tree',
      heading: 'API'
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
  // TODO:  Progress type不同table不同，应显示API下所有内容
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