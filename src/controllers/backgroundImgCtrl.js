import locale from '../locale/locale';
import { replaceHtml } from '../utils/util';
import { modelHTML } from './constant';
import Store from '../store';
import method from '../global/method';
import { luckysheetrefreshgrid } from '../global/refresh';
import { mmConversionPx } from '../global/api';

const backgroundImgCtrl = {

    createDialog: function(){
        let _this = this;

        const _locale = locale();
        const backgroundImgText = _locale.customBackgroudImg;
        const toolbarText = _locale.toolbar;
        const buttonText = _locale.button;

        $("#luckysheet-modal-dialog-mask").show();
        $("#luckysheet-custom-backgroundImg-dialog").remove();

        let content =  `<div class="box">
                            <div class="box-item">
                                <label for="luckysheet-custom-backgroundImg-dialog-image">${backgroundImgText.image}：</label>
                                <input id="luckysheet-custom-backgroundImg-dialog-image" type="file" accept="image/*" style="border: 0px;"></input>
                            </div>
                            <div class="box-item">
                            <label for="luckysheet-custom-backgroundImg-dialog-width">${backgroundImgText.width}：</label>
                                <input type="text" id="luckysheet-custom-backgroundImg-dialog-width"/>
                            </div>
                            <div class="box-item">
                            <label for="luckysheet-custom-backgroundImg-dialog-height">${backgroundImgText.height}：</label>
                                <input type="text" id="luckysheet-custom-backgroundImg-dialog-height"/>
                            </div>
                        </div>`;

        $("body").append(replaceHtml(modelHTML, { 
            "id": "luckysheet-custom-backgroundImg-dialog", 
            "addclass": "luckysheet-custom-backgroundImg-dialog", 
            "title": toolbarText.customBackgroudImg, 
            "content": content, 
            "botton":  `<button id="luckysheet-custom-backgroundImg-dialog-confirm" class="btn btn-primary">${buttonText.confirm}</button>
                        <button class="btn btn-default luckysheet-model-close-btn">${buttonText.cancel}</button>`, 
            "style": "z-index:100003" 
        }));
        let $t = $("#luckysheet-custom-backgroundImg-dialog").find(".luckysheet-modal-dialog-content").css("min-width", 350).end(), 
            myh = $t.outerHeight(), 
            myw = $t.outerWidth();
        let winw = $(window).width(), 
            winh = $(window).height();
        let scrollLeft = $(document).scrollLeft(), 
            scrollTop = $(document).scrollTop();
        $("#luckysheet-custom-backgroundImg-dialog").css({ 
            "left": (winw + scrollLeft - myw) / 2, 
            "top": (winh + scrollTop - myh) / 3 
        }).show();
    },
    init: function (){
        let _this = this;
        // $(document).off("change.imageUploaded").on("change.imageUploaded", "#luckysheet-custom-backgroundImg-dialog-image", function(e){
        //     let sourceFile = e.currentTarget.files[0];

        //     $("#luckysheet-custom-backgroundImg-dialog-width").val();
        //     $("#luckysheet-custom-backgroundImg-dialog-height").val();
        // })

        //确认按钮
        $(document).off("click.confirm").on("click.confirm", "#luckysheet-custom-backgroundImg-dialog-confirm", function(e){

            //文本
            const width = $("#luckysheet-custom-backgroundImg-dialog-width").val();
            const height = $("#luckysheet-custom-backgroundImg-dialog-height").val();
            const sourceFileName =  $("#luckysheet-custom-backgroundImg-dialog-image").val();
            const sourceFile = $("#luckysheet-custom-backgroundImg-dialog-image")[0].files[0];
            const sheetFile = Store.luckysheetfile[Store.currentSheetIndex];

            if (sourceFile) {
                if (!sheetFile) {
                    return;
                }
                if (!method.createHookFunction("customBackgroudImgBefore", sourceFile, sheetFile)) {
                    return;
                }
                let render = new FileReader();
                render.readAsDataURL(sourceFile);
        
                render.onload = function(event){
                    let src = event.target.result;
    
                    var img = new Image();
                    img.src = src
                    //img.src = src
                    img.onload = imgfn;
                    function imgfn() {
                        sheetFile.backgroudImg = {
                            sourceFileName: sourceFileName,
                            src : img,
                            x : Store.rowHeaderWidth,
                            y : Store.columnHeaderHeight,
                            width : mmConversionPx(width ? width : img.width), 
                            height : mmConversionPx(height ? height : img.height)
                        }
                        _this.ref();
                    }
                    method.createHookFunction("customBackgroudImgAfter", sourceFile, sheetFile)                    
                }    
            }

            $("#luckysheet-modal-dialog-mask").hide();
            $("#luckysheet-custom-backgroundImg-dialog").hide();
        })
    },
    ref: function(){
        //背景图片只是用来做套打辅助的，所以不需要通过Store.jfredo.push(redo)进行推送
        setTimeout(function () {
            luckysheetrefreshgrid();
        }, 1);
    }
}
export default backgroundImgCtrl;