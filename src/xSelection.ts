import { IOccurrence, XString } from './xString';
import { XWindow } from './xWindow';

export interface IXText extends Text {
  startPosition: number;
  endPosition: number;
}

export class XSelection {
  private readonly xRange: Range;
  private xWindow: XWindow;
  private xNodes: IXText[]|undefined;

  constructor(range: Range, xWindow: XWindow) {
    this.xRange = range;
    this.xWindow = xWindow;
  }

  public getTextNodes(): IXText[] {
    if (this.xNodes) {
      return this.xNodes;
    }

    function split(container: IXText, offset: number): IXText {
      const rp: IXText = container.splitText(offset) as IXText;
      rp.startPosition = container.startPosition + XString.from(container.data).compact().length;
      rp.endPosition = container.endPosition;
      container.endPosition = rp.startPosition - 1;
      return rp;
    }

    const sc: IXText = this.xRange.startContainer as IXText;
    let ec: IXText = this.xRange.endContainer as IXText;
    const so = this.xRange.startOffset;
    let eo = this.xRange.endOffset;
    const bNodes = this.xWindow.getNodes();
    const si = bNodes.indexOf(sc);
    const srp = split(sc, so);
    if (srp.length > 0) {
      bNodes.splice(si + 1, 0, srp);
    }
    if (ec === sc) {
      ec = srp;
      eo = eo - so;
    }
    const ei = bNodes.indexOf(ec);
    const erp = split(ec, eo);
    if (erp.length > 0) {
      bNodes.splice(ei + 1, 0, erp);
    }
    this.xNodes = bNodes.slice(si + 1, ei + 1);
    return this.xNodes;
  }

  public getOccurrence(): IOccurrence {
    const container: IXText = this.xRange.endContainer as IXText;
    if (container.nodeType !== 3 || this.xRange.startContainer.nodeType !== 3) {
      throw new Error('illegal selection');
    }
    const offset: number = this.xRange.endOffset;
    const cHead: string = XString.from(container.substringData(0, offset)).compact();
    const cLength: number = cHead ? cHead.length : 0;
    if (cLength < 1) {
      throw new Error('illegal selection');
    }
    const cText: string = XString.from(this.xRange.toString()).compact();
    const content: string = this.xWindow.getText().substr(0, container.startPosition + cLength);
    const occurrences: IOccurrence[] = XString.from(content).find(cText);
    if (occurrences && occurrences.length > 0) {
      return occurrences[occurrences.length - 1];
    }
    throw new Error('illegal selection');
  }

  public getContent(): string {
    return this.xRange.toString();
  }

  public getSelection(): Selection {
    const selection: Selection = this.xWindow.getWindow().getSelection();
    if (selection.rangeCount < 1) {
      selection.addRange(this.xRange);
    }
    return selection;
  }

  public empty() {
    if (this.getSelection().empty) {
      this.getSelection().empty();
    }
    if (this.getSelection().removeAllRanges) {
      this.getSelection().removeAllRanges();
    }
  }

  public cancel() {
    const nodes = this.getTextNodes();
    const first: IXText = nodes[0];
    const last: IXText = nodes[nodes.length - 1];
    if (first && first.parentNode) {
      first.parentNode.normalize();
    }
    if (last && last.parentNode) {
      last.parentNode.normalize();
    }

    const bNodes: IXText[] = this.xWindow.getNodes();
    const fi = bNodes.indexOf(first);
    const li = bNodes.indexOf(last);

    if (li < bNodes.length - 1 && last.nextSibling === bNodes[li + 1]) {
      last.endPosition = bNodes[li + 1].endPosition;
      bNodes.splice(li + 1, 1);
    }
    if (fi > 0 && first.previousSibling === bNodes[fi - 1]) {
      bNodes[fi - 1].endPosition = first.endPosition;
      bNodes.splice(fi, 1);
    }
  }
}
