/**
 * Created by admin on 2017/8/21.
 */

// 支持的三种类型
var TYPE = {
    RECTANGLE   : 0,
    CIRCLE      : 1,
    LINE        : 2
}

// 初始化canvas
var canvas = new Canvas("canvas");


$(function () {
    $('#left_wrap').on('click', '.shape-obj', function () {
        var type = $(this).data('type');
        if (type == "rectangle") {
            canvas.setType(TYPE.RECTANGLE);
        } else if (type == "circle") {
            canvas.setType(TYPE.CIRCLE);
        } else if (type == "division") {
            canvas.setType(TYPE.LINE);
        }
    });
    $('#props_wrap').hide();
    
    $(document).on('mousedown', '#main_container', function (event) {
        event = event || window.event;
        var btnNum = event.button;
        if (btnNum == 0) {
            //左键
            canvas.setStartPoint(event.offsetX, event.offsetY);
        } else if (btnNum == 2) {
            //右键
            canvas.resetType();
        }
        canvas.recordMouseDown(event.offsetX, event.offsetY);
    });

    $(document).on('mouseup', '#main_container', function (event) {
        event = event || window.event;
        canvas.recordMouseUp(event.offsetX, event.offsetY);
        if (canvas.getDrawType() == null) {
            var elementType = canvas.getFocusElement();
            if (elementType == null) {
                $('#props_wrap').hide();
                var btnNum = event.button;
                if (btnNum == 0) {
                    canvas.renderAreaPicked(event.offsetX, event.offsetY);
                }
            } else if (elementType instanceof Vec2) {
                console.log("set corner");
            } else {
                var clientWidth = parseInt($('#container').css('width'));
                var clientHeight = parseInt($('#container').css('height'));
                var selfLength = parseInt($('#container #props_wrap').css('width'));
                var selfHeight = parseInt($('#container #props_wrap').css('height'));
                var left = event.clientX + 20;
                var top = event.clientY + 20;
                if (left + selfLength >= clientWidth) {
                    left = clientWidth - 20 - selfLength;
                }
                if (top + selfHeight >= clientHeight) {
                    top = clientHeight - 20 - selfHeight;
                }
                $('#props_wrap').css('left', left).css('top', top);
                
                if (elementType instanceof MyCurve) {
                    $('#props_wrap .props.line .iconfont.straight').removeClass('none').siblings('.curve').addClass('none');
                    $('#props_wrap').find('.props.line').data('type','curve');
                    $('#props_wrap').find('.props.line').find('.pup').html('转为直线<i></i>');
    
                } else if (elementType instanceof MyEdge) {
                    $('#props_wrap .props.line .iconfont.curve').removeClass('none').siblings('.straight').addClass('none');
                    $('#props_wrap').find('.props.line').data('type','straight');
                    $('#props_wrap').find('.props.line').find('.pup').html('转为曲线<i></i>');
                }
                
                $('#props_wrap').show();
                canvas.setOperationCurve();
            }
        } else if (canvas.checkStatus()) {
            canvas.createElement();
            canvas.render(event.offsetX, event.offsetY);
        }
    });

    $(document).on('mousemove', '#main_container', function (event) {
        event = event || window.event;

        if (event.which == 1) {
            //按住拖动
            canvas.updateElement(event.offsetX, event.offsetY);
            
        } else if(event.which == 0) {
            //没按住拖动
            canvas.setEndPoint(event.offsetX, event.offsetY);
            canvas.render(event.offsetX, event.offsetY);
        }
    });
    
    $('#props_wrap').on('click', '.props', function () {
        var type = $(this).data('type');
        //console.log(type);
        if (type === 'division') {
            canvas.onSplitCurve();
        }
        
        if (type === 'delete') {
            canvas.onDelete();
        }
        
        if ($(this).hasClass('line')) {
            $(this).children('.iconfont').toggleClass('none');
            if (type === 'straight') {
                $(this).data('type', 'curve');
                $(this).find('.pup').html('转为曲线<i></i>');
                canvas.onToArc();
            } else {
                $(this).data('type', 'straight');
                $(this).find('.pup').html('转为直线<i></i>');
                canvas.onToLine();
            }
            
        }
        $('#props_wrap').hide();
    });
});