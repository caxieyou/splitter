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
    });

    $(document).on('mouseup', '#main_container', function (event) {
        event = event || window.event;
        if (canvas.getDrawType() == null) {
            var elementType = canvas.getFocusElement();
            if (elementType == null) {
                $('#props_wrap').hide();
                var btnNum = event.button;
                if (btnNum == 0) {
                    canvas.renderAreaPicked(event.offsetX, event.offsetY);
                }
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
                
                //console.log($('#props_wrap').find('.props.line').children('.iconfont'));
                //console.log($('#props_wrap').find('.props.line').children('.iconfont').eq(0));
                if (elementType instanceof MyCurve) {
                    if(!$('#props_wrap').find('.props.line').children('.iconfont').eq(0).hasClass('none'))
                    {
                        $('#props_wrap').find('.props.line').children('.iconfont').toggleClass('none');
                    }
                    
                    $('#props_wrap').find('.props.line').data('type','curve');
                    $('#props_wrap').find('.props.line').find('.pup').html('转为直线<i></i>');
    
                } else if (elementType instanceof MyEdge) {
                    if($('#props_wrap').find('.props.line').children('.iconfont').eq(0).hasClass('none'))
                    {
                        $('#props_wrap').find('.props.line').children('.iconfont').toggleClass('none');
                    }
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
        } else if(event.which == 0) {
            //没按住拖动
            canvas.setEndPoint(event.offsetX, event.offsetY);
            canvas.render(event.offsetX, event.offsetY, true);
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