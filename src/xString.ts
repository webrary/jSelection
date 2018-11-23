export class XString {
  public static from(origin: string): XString {
    return new XString(origin);
  }

  private valStr: string;

  private constructor(origin: string) {
    this.valStr = origin;
  }

  /**
   * the position of the nth occurrence of searchString
   * @param {string} searchString
   * @param {number} nth = 1
   * @return {number} start position of the nth occurrence of <em>searchString</em>
   */
  public indexOf(searchString: string, nth: number = 1): number {
    let times = 0;
    let index = -2;
    while (times < nth && index !== -1) {
      index = this.valStr.indexOf(searchString, index + 1);
      times++;
    }
    return index;
  }

  /**
   * the occurrences(include the positions) of searchString
   * @param searchString
   * @returns {Array<IOccurrence>}
   */
  public find(searchString: string): IOccurrence[] {
    let times = 0;
    let position = -2;
    const result: IOccurrence[] = [];
    if (searchString.length < 1) {
      return result;
    }
    while (position !== -1) {
      position = this.valStr.indexOf(searchString, position + 1);
      if (position < 0) {
        break;
      }
      result.push({ nth: ++times, position });
    }
    return result;
  }

  /**
   * @return {string} compacted string
   */
  public compact(): string {
    return this.valStr.replace(/\s+/gm, '');
  }

  /**
   * @return {string} trimmed string
   */
  public trim(): string {
    return this.valStr.replace(/(^\s*)|(\s*$)/g, '');
  }
}

export interface IOccurrence {
  nth: number;
  position: number;
}
