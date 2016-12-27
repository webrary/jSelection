import {XText, XSelection} from "./xSelection";
import {XString} from "./xString";

export class XWindow {
    private nodes: Array<XText>;
    private text: string;
    private selection_: XSelection = null;
    private document_: Document;

    constructor(root: Element) {
        this.document_ = root.ownerDocument;
        this.init(root);
    }

    /**
     * @param {string=} opt_text
     * @param {number=} opt_nth
     * @param {boolean=} opt_select = false whether to select the range
     * @return {XSelection}
     */
    public select(opt_text?: string, opt_nth: number = 1, opt_select: boolean = false): XSelection {
        this.selection_ && this.selection_.cancel() && this.selection_.getSelection().empty();
        this.selection_ = null;
        let window_ = this.getWindow();
        let selection = window_.getSelection();
        if (!opt_text) {
            return (selection.rangeCount > 0) ? (this.selection_ = new XSelection(window_.getSelection().getRangeAt(0), this)) : null;
        }
        let range = this.rangeFrom_(opt_text, opt_nth);
        if (opt_select) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
        return this.selection_ = new XSelection(range, this);
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
            let i = 0, j = 0;
            for (; i < count + isStart; j++) {
                if (!/\s+/m.test(str[j])) {
                    i++;
                }
            }
            return j - isStart;
        }

        if (!text) {
            return this.document_.createRange();
        } else {
            let bText: string = this.text;
            let bNodes: Array<XText> = this.nodes;
            let range: Range = this.document_.createRange();
            let cText: string = XString.from(text).compact();
            let index: number = XString.from(bText).indexOf(cText, nth || 1);
            if (index > -1) {
                let cStartPos: number = index + bNodes[0].startPosition;//include the first character
                let cEndPos: number = cStartPos + cText.length;//exclude the last character

                let startContainer: XText = null, endContainer: XText = null;
                for (let i = 0; i < bNodes.length; i++) {
                    let node: XText = bNodes[i];
                    if (!startContainer && node.endPosition >= cStartPos) {
                        startContainer = bNodes[i];
                    }
                    if (node.startPosition >= cEndPos) {
                        endContainer = bNodes[i - 1];
                        break;
                    }
                }
                if (startContainer !== null) {
                    endContainer = endContainer || bNodes[bNodes.length - 1];
                    let startOffset = offset(startContainer.data, cStartPos - startContainer.startPosition, 1);
                    let endOffset = offset(endContainer.data, cEndPos - endContainer.startPosition, 0);
                    range.setStart(startContainer, startOffset);
                    range.setEnd(endContainer, endOffset);
                }
            }
            return range;
        }
    }

    private init(root: Element): void {
        function getTextNodes(element: Element): XText[] {
            let nodes: Array<XText> = [];
            let elesToSkip = {
                elements: ['applet', 'area', 'base', 'basefont', 'bdo', 'button', 'frame', 'frameset', 'iframe',
                    'head', 'hr', 'img', 'input', 'link', 'map', 'meta', 'noframes', 'noscript', 'optgroup',
                    'option', 'param', 'script', 'select', 'style', 'textarea', 'title'],
                /**
                 * @param {Element} node
                 * @param {Array.<string>|null} list
                 * @return {boolean}
                 */
                test: function (node: Element, list: Array<string>) {
                    let elements = list || this.elements;
                    return elements.indexOf(node.tagName.toLowerCase()) > -1;
                }
            };

            function filter(element: Text|Node) {
                if (element.nodeType === 3 && /\S/.test((<Text>element).data)) {
                    nodes.push(<XText>element);
                } else if (element.nodeType === 1 && !elesToSkip.test(<Element>element, null)) {
                    for (let i = 0, len = element.childNodes.length; i < len; ++i) {
                        filter(element.childNodes[i]);
                    }
                }
            }

            filter(element);
            return nodes;
        }

        let xTextNodes: Array<XText> = getTextNodes(root), position = 0;
        let xText: string = '';
        xTextNodes.forEach(function (node: XText) {
            node.startPosition = position;
            let cText = XString.from(node.data).compact();
            xText += cText;
            position += cText.length;
            node.endPosition = position - 1;
        });
        this.text = xText;
        this.nodes = xTextNodes;
    }

    public static from(root: Element = document.body): XWindow {
        return new XWindow(root);
    }

    public getNodes(): Array<XText> {
        return this.nodes;
    }

    public getText(): String {
        return this.text;
    }

    public getWindow(): Window {
        return this.document_.defaultView;
    }
}
