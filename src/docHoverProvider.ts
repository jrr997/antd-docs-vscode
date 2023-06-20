// 导入必要的模块
import { HoverProvider, TextDocument, Position, Hover, ProviderResult } from 'vscode';

// 自定义 HoverProvider 类
export default class DocHoverProvider implements HoverProvider {
  constructor() {
    console.log('DocHoverProvider');
    
  }
  provideHover(document: TextDocument, position: Position, token): ProviderResult<Hover> {
    // 根据位置信息分析代码并生成悬停提示信息
    const wordRange = document.getWordRangeAtPosition(position);
    const word = document.getText(wordRange);
    console.log(position, token);
    
    // 构建悬停提示信息的 Markdown 格式文本
    const markdownText = `This is a hover for the word **${word}**.`;
    
    // 返回一个 Hover 对象，用于显示悬停提示
    return new Hover(markdownText);
  }
}

