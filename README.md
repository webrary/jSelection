# jSelection
__Extended `Selection` series allows selecting by content and index__

[![NPM version](https://img.shields.io/npm/v/jSelection.svg)](https://www.npmjs.com/package/jselection)

## Installation
``` shell
   npm install jselection --save
```
``` shell
   bower install jselection  --save
```

## Usage
* __with `<script>`(in browser)__
``` html
<script type="application/javascript" src="node_modules/jselection/dist/jSelection.browser.js"></script>
```
* __with `import`(in Typescript / ES6)__
``` typescript
import {XWindow, XSelection} from "jSelection";
// XWindow.from(...);
```
``` typescript
import * as jSelection from "jSelection";
// jSelection.XWindow.from(...);
```
* __with `require`__
``` javascript
const jSelection = require("jSelection");
```

## API
### **`XWindow`**: Extended **`Window`** class 

#### `XWindow.from`
__create instance from a html `Element`(a `XWindow` instance is created and returned)__
``` typescript
public static from(root: Element = document.body): XWindow;
```
* create `XWindow` from element with ID `body`
``` javascript
let xWindow = XWindow.from(document.querySelector('#body'));
```

#### `XWindow.select`
__select by content and index (a `XSelection` instance is created and returned)__
``` typescript
public select(opt_text?: string, opt_nth: number = 1, opt_select: boolean = false): XSelection;
```
* select the 5th `hello` (create `XSelection` instance from the 5th `hello`)
``` javascript
let xSelection = xWindow.select("hello", 5);
```
* select by Mouse (create `XSelection` instance from the Mouse selected text)
``` javascript
let xSelection = xWindow.select();
```

### __`XSelection`__: Extended __`Selection`__ class

#### `XSelection.getTextNodes`
__get `Text` Nodes of the `XSelection`__
``` typescript
public getTextNodes(): Array<XText>;
interface XText extends Text {...}
```

#### `XSelection.getOccurrence`
__get the `Occurrence` of the selected text from `XSelection` instance__
``` typescript
public getOccurrence(): Occurrence;

interface Occurrence {
    nth: number; //the content is the `nth` occurrence
    position: number; //the content starts at `position`
}
```

## Example
``` html
<html lang="en">
<head>
    <script type="application/javascript" src="dist/jSelection.browser.js"></script>
    <script type="application/javascript" src="bower_components/jQuery/dist/jquery.min.js"></script>
    <style type="text/css">
        .markup {
            background-color: yellowgreen;
        }
    </style>
</head>
<body>
text start: 
<div id="body">
    this is a test
    <span>this is a test</span>
    this is a test
    <p> this is a test </p>
    this is a test
</div>
text end: 
<script type="application/javascript">
    var xWindow = jSelection.XWindow.from(document.querySelector("#body"));
    var xSelection = xWindow.select("test", 5);
    var nodes = xSelection.getTextNodes();
    console.log(nodes);
    var markup = $(nodes).wrapAll("<span class='markup'/>");
</script>
</body>
</html>
```
