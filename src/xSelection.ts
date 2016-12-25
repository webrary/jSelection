namespace jSelection {
    let xString = jSelection.xString;

    export interface XText extends Text {
        startPosition: number;
        endPosition: number;
    }

    export class XSelection {
        private range_: Range = null;
        private window_: XWindow = null;

        constructor(range: Range, xWindow: XWindow) {
            this.range_ = range;
            this.window_ = xWindow;
        }

        /**
         * @export
         * @return {Array.<XText>}
         */
        public getTextNodes(): Array<XText> {
            /**
             * @export
             * @param {Text|{startPosition, endPosition}} container
             * @param {number} offset
             * @return {Text}
             */
            function split(container, offset) {
                var rp: XText = container.splitText(offset);
                rp.startPosition = container.startPosition + xString.compact(container.data).length;
                rp.endPosition = container.endPosition;
                container.endPosition = rp.startPosition - 1;
                return rp;
            }

            let sc: XText = <XText>(this.range_.startContainer), ec: XText = <XText>(this.range_.endContainer),
                so = this.range_.startOffset, eo = this.range_.endOffset;
            var bNodes = this.window_.getNodes();
            var si = bNodes.indexOf(sc);
            var srp = split(sc, so);
            if (srp.length > 0) {
                bNodes.splice(si + 1, 0, srp);
            }
            if (ec === sc) {
                ec = srp;
                eo = eo - so;
            }
            var ei = bNodes.indexOf(ec);
            var erp = split(ec, eo);
            if (erp.length > 0) {
                bNodes.splice(ei + 1, 0, erp);
            }
            return bNodes.slice(si + 1, ei + 1);
        }


        /**
         * @return {{nth:number,position:number,text:string}|null}
         */
        public getOccurrence(): {nth: number,position: number,text: string} {
            let container: XText = <XText>this.range_.endContainer;
            if (container.nodeType != 3 || this.range_.startContainer.nodeType != 3) {
                throw new Error('illegal selection');
            }
            let offset: number = this.range_.endOffset;
            let cHead: String = xString.compact(container.substringData(0, offset));
            let cLength: number = cHead ? cHead.length : 0;
            if (cLength < 1) {
                throw new Error('illegal selection');
            }
            let cText: String = xString.compact(this.range_.toString());
            let occurrence = xString.times(this.window_.getText().substr(0, container.startPosition + cLength), cText);
            occurrence.text = cText;
            return occurrence;
        }

        /**
         * @export
         * @return {XSelection}
         */
        public getSelection(): Selection {
            let selection: Selection = this.window_.getWindow().getSelection();
            if (selection.rangeCount < 1) {
                selection.addRange(this.range_);
            }
            return selection;
        }

        public empty() {
            var window_ = this.window_.getWindow();
            if (window_.getSelection().empty) {  // Chrome
                window_.getSelection().empty();
            } else if (window_.getSelection().removeAllRanges) {  // Firefox
                window_.getSelection().removeAllRanges();
            }
        }
    }
}