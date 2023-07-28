import { ComponentParseConfig } from "../types";
import { datePickerParser, timePickerParser, tooltipParser, progressParser } from "./parseUtil";


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

  // DatePicker and RangePicker share a common table and have their own table as well.
  "date-picker": [
    {
      name: 'datepicker',
      parser: datePickerParser,
    }, {
      name: 'datepicker.rangepicker',
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
    {
      name: 'input.textarea',
      heading: 'Input.TextArea',
      // parser: textAreaParser
    },
    {
      name: 'input.search',
      heading: 'Input.Search',
      merge: {
        name: 'input',
        table: false,
      }
    },
     {
      name: 'input.password',
      heading: 'Input.Password'
    },
    {
      name: 'input.group',
      heading: 'Input.Group'
    }
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
    {
      name: 'timepicker.rangepicker',
      parser: timePickerParser
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
  tooltip: [
    {
      name: 'tooltip',
      parser: tooltipParser,
    }
  ],
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
  'progress': [
  {
    name: 'progress',
    parser: progressParser,
  },
  ],
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