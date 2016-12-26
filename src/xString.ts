export class XString {
    private str_: string;

    public static from(origin: string): XString {
        return new XString(origin);
    }

    private constructor(origin: string) {
        this.str_ = origin;
    }

    /**
     * the position of the nth occurrence of searchString
     * @param {string} searchString
     * @param {number} nth = 1
     * @return {number} start position of the nth occurrence of <em>searchString</em>
     */
    public indexOf(searchString: string, nth: number = 1): number {
        let times = 0, index = -2;
        while (times < nth && index !== -1) {
            index = this.str_.indexOf(searchString, index + 1);
            times++;
        }
        return index;
    }

    /**
     * the occurrences(include the positions) of searchString
     * @param searchString
     * @returns {Array<Occurrence>}
     */
    public find(searchString: string): Array<Occurrence> {
        let times = 0, position = -2, result: Array<Occurrence> = [];
        if (searchString.length < 1) {
            return result;
        }
        while (position !== -1) {
            position = this.str_.indexOf(searchString, position + 1);
            if (position < 0) {
                break;
            }
            result.push({nth: ++times, position: position});
        }
        return result;
    }

    /**
     * @return {string} compacted string
     */
    public compact(): string {
        return this.str_.replace(/\s+/gm, '');
    }

    /**
     * @return {string} trimmed string
     */
    public trim(): string {
        return this.str_.replace(/(^\s*)|(\s*$)/g, '');
    }
}

export interface Occurrence {
    nth: number;
    position: number;
}