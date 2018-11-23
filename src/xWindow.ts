import { Error } from 'tslint/lib/error';
import { IXText, XSelection } from './xSelection';
import { XString } from './xString';

export class XWindow {
  public static from(root: Element = document.body): XWindow {
    return new XWindow(root);
  }

  private readonly nodes: IXText[];
  private readonly text: string;
  private readonly doc: Document;
  private readonly root: Element;
  private selection: XSelection | null;

  constructor(root: Element) {
    const tempDoc = root.ownerDocument;
    if (tempDoc) {
      this.doc = tempDoc;
    } else if (root instanceof Document) {
      this.doc = root;
    } else {
      throw new Error('the owner document is not found');
    }
    this.selection = null;
    const rInit = this.init(root);
    this.text = rInit.text;
    this.nodes = rInit.nodes;
    this.root = root;
  }

  public getNodes(): IXText[] {
    return this.nodes;
  }

  public getText(): string {
    return this.text;
  }

  public getWindow(): Window {
    const window = this.doc.defaultView;
    if (!window) {
      throw new Error('the owner window is not found');
    }
    return window;
  }

  /**
   * @param {string=} optText
   * @param {number=} optNth
   * @param {boolean=} optSelect = false whether to select the range
   * @return {XSelection}
   */
  public select(optText?: string, optNth: number = 1, optSelect: boolean = false): XSelection | null {
    if (this.selection && optText) {
      this.selection.cancel();
      this.selection.getSelection().empty();
      this.selection = null;
    }
    const window = this.getWindow();
    const selection = window.getSelection();
    if (!optText) {
      return selection.rangeCount > 0
        ? (this.selection = new XSelection(window.getSelection().getRangeAt(0), this))
        : null;
    }
    const range = this.rangeFrom_(optText, optNth);
    if (range.startContainer === this.getWindow().document || range.endContainer === this.getWindow().document) {
      return null;
    }
    if (optSelect) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    return (this.selection = new XSelection(range, this));
  }

  public normalize(): void {
    this.root.normalize();
    let end = 0;
    this.nodes.reverse().forEach((node, index) => {
      if (!node.parentNode) {
        end = node.endPosition;
        this.nodes.splice(this.nodes.length - index, 1);
      } else if (end > 0) {
        node.endPosition = end;
      }
    });
  }

  private init(root: Element): { text: string; nodes: IXText[] } {
    function getTextNodes(element: Element): IXText[] {
      const nodes: IXText[] = [];

      function filter(ele: Text | Node) {
        if (ele.nodeType === 3 && /\S/.test((ele as Text).data)) {
          nodes.push(ele as IXText);
        } else if (ele.nodeType === 1 && !elesToSkip.test(ele as Element, null)) {
          for (let i = 0, len = ele.childNodes.length; i < len; ++i) {
            filter(ele.childNodes[i]);
          }
        }
      }

      filter(element);
      return nodes;
    }

    const xTextNodes: IXText[] = getTextNodes(root);
    let position = 0;
    let xText: string = '';
    xTextNodes.forEach(node => {
      node.startPosition = position;
      const cText = XString.from(node.data).compact();
      xText += cText;
      position += cText.length;
      node.endPosition = position - 1;
    });
    return { text: xText, nodes: xTextNodes };
  }

  /**
   *  return an empty range object that has both of its boundary points positioned at
   *  the beginning of the document when no parameters are given, else return an range
   *  object that contains the nth occurrence of the specified text
   *
   * @param {string} text the base text
   * @param {number} nth = 1 the nth index
   * @return {Range} the range created that contains the specified text
   * @private
   */
  private rangeFrom_(text: string, nth: number = 1): Range {
    function offset(str: string, count: number, isStart: number): number {
      let i = 0;
      let j = 0;
      for (; i < count + isStart; j++) {
        if (!/\s+/m.test(str[j])) {
          i++;
        }
      }
      return j - isStart;
    }

    if (!text) {
      return this.doc.createRange();
    } else {
      const bText: string = this.text;
      const bNodes: IXText[] = this.nodes;
      const range: Range = this.doc.createRange();
      const cText: string = XString.from(text).compact();
      const index: number = XString.from(bText).indexOf(cText, nth || 1);
      if (index > -1) {
        const cStartPos: number = index + bNodes[0].startPosition; // include the first character
        const cEndPos: number = cStartPos + cText.length; // exclude the last character

        let startContainer: IXText | undefined;
        let endContainer: IXText | undefined;
        for (let i = 0; i < bNodes.length; i++) {
          const node: IXText = bNodes[i];
          if (!startContainer && node.endPosition >= cStartPos) {
            startContainer = bNodes[i];
          }
          if (node.startPosition >= cEndPos) {
            endContainer = bNodes[i - 1];
            break;
          }
        }
        if (startContainer) {
          endContainer = endContainer || bNodes[bNodes.length - 1];
          const startOffset = offset(startContainer.data, cStartPos - startContainer.startPosition, 1);
          const endOffset = offset(endContainer.data, cEndPos - endContainer.startPosition, 0);
          range.setStart(startContainer, startOffset);
          range.setEnd(endContainer, endOffset);
        }
      }
      return range;
    }
  }
}

const elesToSkip = {
  elements: [
    'applet',
    'area',
    'base',
    'basefont',
    'bdo',
    'button',
    'frame',
    'frameset',
    'iframe',
    'head',
    'hr',
    'img',
    'input',
    'link',
    'map',
    'meta',
    'noframes',
    'noscript',
    'optgroup',
    'option',
    'param',
    'script',
    'select',
    'style',
    'textarea',
    'title',
  ],

  /**
   * @param {Element} node
   * @param {string[]|null} list
   * @return {boolean}
   */
  test(node: Element, list: string[] | null) {
    const elements = list || this.elements;
    return elements.indexOf(node.tagName.toLowerCase()) > -1;
  },
};
