

/**
 * 获取当前屏幕和像素的转换率
 */
 function conversion_getDPI() {
    var arrDPI = new Array;
    console.log('window.screen.deviceXDPI', window.screen.deviceXDPI);
    if (window.screen.deviceXDPI) {
        arrDPI[0] = window.screen.deviceXDPI;
        arrDPI[1] = window.screen.deviceYDPI;
    } else {
        var tmpNode = document.createElement("DIV");
        tmpNode.style.cssText = "width:1mm;height:1mm;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
        document.body.appendChild(tmpNode);
        arrDPI[0] = parseInt(tmpNode.offsetWidth);
        arrDPI[1] = parseInt(tmpNode.offsetHeight);
        console.log('window.screen.deviceXDPI', arrDPI);
        tmpNode.parentNode.removeChild(tmpNode);
    }
    return arrDPI;
};
/**
 * mm转换为px
 * @param {Number} value 毫米数
 */
 function mmConversionPx(value) {
    var c_value = value * conversion_getDPI()[0];
    return c_value;
}
let totalHeight = mmConversionPx(297);
let totalWidth = mmConversionPx(210);
let columnCount = parseInt(totalWidth / 72);
let rowCount = parseInt(totalHeight / 20);
let colWidthArray = new Array();
for (let index = 0; index < columnCount; index++) {
    colWidthArray[index] = 72;
}
let rowHeightArray = new Array();
for (let index = 0; index < rowCount; index++) {
    rowHeightArray[index] = 20;
}

if (totalWidth % 72 !== 0) {
    columnCount = columnCount + 1;
    const bufferColWidth = totalWidth - (columnCount - 1) * 72;
    if (bufferColWidth < 36) {
        colWidthArray[columnCount - 2] = colWidthArray[columnCount - 2] + bufferColWidth;
    } else {
        colWidthArray[columnCount - 1] = bufferColWidth;
    }
}

if (totalHeight % 20 !== 0) {
    rowCount = rowCount + 1;
    const bufferRowHeight = totalHeight - (rowCount - 1) * 20;
    if (bufferRowHeight < 36) {
        rowHeightArray[rowCount - 2] = rowHeightArray[rowCount - 2] + bufferRowHeight;
    } else {
        rowHeightArray[rowCount - 1] = bufferRowHeight;
    }

}

console.log('column', totalWidth, columnCount, colWidthArray);
console.log('row', totalHeight, rowCount, rowHeightArray);

window.sheetPrint = {
    "name": "sheetPrint",
    "defaultRowHeight": 20,
    "defaultColWidth": 72,
    "index": "11",
    "column": columnCount,
	"row": rowCount,
    "scrollLeft": 0,
    "scrollTop": 0,
    "config": {
        "columnlen" : colWidthArray,
        "rowlen" : rowHeightArray,
    }
}