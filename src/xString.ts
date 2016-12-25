export class XString {

    /**
     * the position of the nth occurrence of searchString
     * @param {string} content
     * @param {string} searchString
     * @param {number} nth = 1
     * @return {number} start position of the nth occurrence of <em>searchString</em>
     */
    public static nthIndexOf(content: string, searchString: string, nth: number = 1) {
        var times = 0, index = -2;
        nth = (nth = parseInt('' + nth, 10)) && nth > 0 ? nth : 1;
        while (times < nth && index !== -1) {
            index = content.indexOf(searchString, index + 1);
            times++;
        }
        return index;
    }

    /**
     * the occurrences(include the positions) of searchString
     * @param {string} content
     * @param {string} searchString
     * @return {Array.<{nth,position}>} list of the occurrences
     */
    public static occurrences(content: string, searchString: string): Array<{nth: number,position: number}> {
        var times = 0, position = -2, result: Array<{nth: number,position: number}> = [];
        if (searchString.length < 1) {
            return [
                {nth: Number.POSITIVE_INFINITY, position: Number.POSITIVE_INFINITY},
                {nth: Number.POSITIVE_INFINITY, position: -1}
            ];
        }
        while (position !== -1) {
            position = content.indexOf(searchString, position + 1);
            if (position < 0) {
                break;
            }
            result.push({nth: ++times, position: position});
        }
        return result;
    }


    /**
     * the occurrences of searchString
     * @param {string} content
     * @param {string} searchString
     * @return {{nth,position}|null}
     */
    public static times(content: string, searchString: string) {
        var occurs = XString.occurrences(content, searchString);
        var temp = occurs[occurs.length - 1];
        return temp ? temp : null;
    }


    /**
     * @param {string} content content to be compact
     * @return {string} compacted string
     */
    public static compact(content: string) {
        return content.replace(/\s+/gm, '');
    }


    /**
     * @param {string} content string to be trimmed
     * @return {string} trimmed string
     */
    public static trim(content: string) {
        return content.replace(/(^\s*)|(\s*$)/g, '');
    }
}