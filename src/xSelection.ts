import {XWindow} from "./xWindow";
import {XString, Occurrence} from "./xString";

export interface XText extends Text {
    startPosition: number;
    endPosition: number;
}

export class XSelection {
    private range_: Range = null;
    private window_: XWindow = null;
    private nodes_: Array<XText>;

    constructor(range: Range, xWindow: XWindow) {
        this.range_ = range;
        this.window_ = xWindow;
    }

    public getTextNodes(): Array<XText> {
        if(this.nodes_)
            return this.nodes_;
        function split(container: XText, offset: number): XText {
            let rp: XText = <XText>container.splitText(offset);
            rp.startPosition = container.startPosition + XString.from(container.data).compact().length;
            rp.endPosition = container.endPosition;
            container.endPosition = rp.startPosition - 1;
            return rp;
        }

        let sc: XText = <XText>(this.range_.startContainer), ec: XText = <XText>(this.range_.endContainer),
            so = this.range_.startOffset, eo = this.range_.endOffset;
        let bNodes = this.window_.getNodes();
        let si = bNodes.indexOf(sc);
        let srp = split(sc, so);
        if (srp.length > 0) {
            bNodes.splice(si + 1, 0, srp);
        }
        if (ec === sc) {
            ec = srp;
            eo = eo - so;
        }
        let ei = bNodes.indexOf(ec);
        let erp = split(ec, eo);
        if (erp.length > 0) {
            bNodes.splice(ei + 1, 0, erp);
        }
        this.nodes_ = bNodes.slice(si + 1, ei + 1);
        return this.nodes_;
    }

    public getOccurrence(): Occurrence {
        let container: XText = <XText>this.range_.endContainer;
        if (container.nodeType != 3 || this.range_.startContainer.nodeType != 3) {
            throw new Error('illegal selection');
        }
        let offset: number = this.range_.endOffset;
        let cHead: String = XString.from(container.substringData(0, offset)).compact();
        let cLength: number = cHead ? cHead.length : 0;
        if (cLength < 1) {
            throw new Error('illegal selection');
        }
        let cText: string = XString.from(this.range_.toString()).compact();
        let content: string = this.window_.getText().substr(0, container.startPosition + cLength);
        let occurrences: Array<Occurrence> = XString.from(content).find(cText);
        if (occurrences && occurrences.length > 0) {
            return occurrences[occurrences.length - 1];
        }
        throw new Error('illegal selection');
    }

    public getContent(): string {
        return this.range_.toString();
    }

    public getSelection(): Selection {
        let selection: Selection = this.window_.getWindow().getSelection();
        if (selection.rangeCount < 1) {
            selection.addRange(this.range_);
        }
        return selection;
    }

    public empty() {
        let window_ = this.window_.getWindow();
        if (window_.getSelection().empty) {  // Chrome
            window_.getSelection().empty();
        } else if (window_.getSelection().removeAllRanges) {  // Firefox
            window_.getSelection().removeAllRanges();
        }
    }

    public cancel() {
        let nodes = this.getTextNodes();
        let first = nodes[0], last = nodes[nodes.length - 1];
        first && first.parentNode && first.parentNode.normalize();
        last && last.parentNode && last.parentNode.normalize();
    }
}