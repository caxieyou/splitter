/**
 * Created by admin on 2017/8/21.
 */

// 支持的三种类型
var TYPE = {
    RECTANGLE: 0,
    CIRCLE: 1,
    LINE: 2
};

$("#canvas")[0].width = $('#main_container').width();
$("#canvas")[0].height = $('#main_container').height();
// 初始化canvas
var canvas = new Canvas("canvas");

$(function() {
    $('#left_wrap').on('click', '.shape-obj', function() {
        var type = $(this).data('type');
        if(type == "rectangle") {
            canvas.setType(TYPE.RECTANGLE);
        } else if(type == "circle") {
            canvas.setType(TYPE.CIRCLE);
        } else if(type == "division") {
            canvas.setType(TYPE.LINE);
        }
    });
    $('#props_wrap').hide();

    $(document).on('mousedown', '#canvas', function(event) {
        event = event || window.event;
        var btnNum = event.button;
        if(btnNum == 0) {
            //左键
            canvas.setStartPoint(event.offsetX, event.offsetY);
        } else if(btnNum == 2) {
            //右键
            canvas.resetType();
        }
        canvas.recordMouseDown(event.offsetX, event.offsetY);
    });

    $(document).on('mouseup', '#canvas', function(event) {
        event = event || window.event;

        if(canvas.getDrawType() == null) {
            var elementType = canvas.getFocusElement();
            console.log(elementType);
            if(elementType == null) {
                $('#props_wrap').hide();
                var btnNum = event.button;
                if(btnNum == 0) {
                    canvas.renderAreaPicked(event.offsetX, event.offsetY);
                }
            } else if(elementType instanceof Vec2) {
                console.log("set corner");
            } else {
                var clientWidth = parseInt($('#container').css('width'));
                var clientHeight = parseInt($('#container').css('height'));
                var selfLength = parseInt($('#container #props_wrap').css('width'));
                var selfHeight = parseInt($('#container #props_wrap').css('height'));
                var left = event.clientX + 20;
                var top = event.clientY + 20;
                if(left + selfLength >= clientWidth) {
                    left = clientWidth - 20 - selfLength;
                }
                if(top + selfHeight >= clientHeight) {
                    top = clientHeight - 20 - selfHeight;
                }
                $('#props_wrap').css('left', left).css('top', top);

                if(elementType instanceof MyCurve) {
                    $('#props_wrap .props.line .iconfont.straight').removeClass('none').siblings('.curve').addClass('none');
                    $('#props_wrap').find('.props.line').data('type', 'curve');
                    $('#props_wrap').find('.props.line').find('.pup').html('转为直线<i></i>');

                } else if(elementType instanceof MyEdge) {
                    $('#props_wrap .props.line .iconfont.curve').removeClass('none').siblings('.straight').addClass('none');
                    $('#props_wrap').find('.props.line').data('type', 'straight');
                    $('#props_wrap').find('.props.line').find('.pup').html('转为曲线<i></i>');
                }

                $('#props_wrap').show();
                canvas.setOperationCurve();
            }
        } else if(canvas.checkStatus()) {
            canvas.createElement();
            canvas.render(event.offsetX, event.offsetY);
        }
        canvas.recordMouseUp(event.offsetX, event.offsetY);
    });

    $(document).on('mousemove', '#canvas', function(event) {
        event = event || window.event;
        if(event.which == 1) {
            //按住拖动
            canvas.updateElement(event.offsetX, event.offsetY);

        } else if(event.which == 0) {
            //没按住拖动
            canvas.setEndPoint(event.offsetX, event.offsetY);
            canvas.render(event.offsetX, event.offsetY);
        }
    });

    $('#props_wrap').on('click', '.props', function() {
        var type = $(this).data('type');
        //console.log(type);
        if(type === 'division') {
            canvas.onSplitCurve();
        }

        if(type === 'delete') {
            canvas.onDelete();
        }

        if($(this).hasClass('line')) {
            $(this).children('.iconfont').toggleClass('none');
            if(type === 'straight') {
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
    // icheck初始化
    $('#main_container .settings .setting-display .setting-display-check').iCheck({
        checkboxClass: 'icheckbox_minimal',
        radioClass: 'iradio_minimal',
        increaseArea: '20%' // optional
    });
    // 绝对边距和区域尺寸默认选中
    $('#relative_distance').iCheck('uncheck');
    $('#absolute_margin').iCheck('check');
    $('#zone_size').iCheck('check');
    
    // 绝对边距和相对距离二选一事件
    $('#relative_distance').on('ifChecked', function(event) {
        console.log("相对距离 选中");
        canvas.setRelativeDistance(true);
        $('#absolute_margin').iCheck('uncheck');
    });
    
    $('#relative_distance').on('ifUnchecked', function(event) {
        console.log("相对距离 取消选中");
        canvas.setRelativeDistance(false);
    });
    
    $('#absolute_margin').on('ifChecked', function(event) {
        console.log("绝对距离 选中");
        canvas.setAbsoluteMargin(true);
        $('#relative_distance').iCheck('uncheck');
    });
    
    $('#absolute_margin').on('ifUnchecked', function(event) {
        canvas.setAbsoluteMargin(false);
        console.log("绝对距离 取消选中");
    });
    
    $('#zone_size').on('ifChecked', function(event) {
        canvas.setZoneSize(true);
        console.log("区域边界 选中");
    });
    
    $('#zone_size').on('ifUnchecked', function(event) {
        canvas.setZoneSize(false);
        console.log("区域边界 取消选中");
    });
    
    // 显示菜单栏折叠与展开事件
    $('#main_container').on('click', '#setting_display_menu', function() {
        $('#setting-display').slideToggle();
        $(this).toggleClass('on');
        return false;
    });
    // 撤销
    $('#main_container').on('click', '#setting_goback', function() {
        alert('setting_goback');
        return false;
    });
    // 恢复
    $('#main_container').on('click', '#setting_goforward', function() {
        alert('setting_goforward');
        return false;
    });
    // 清空
    $('#main_container').on('click', '#setting_empty', function() {
        //alert('setting_empty');
        canvas.clear();
        return false;
    });
    // 输入框change事件
    $('body').on('keyup change', 'input.number', function() {
        var $this = $(this),
            val = $this.val(),
            newval = parseFloat(val) ? parseFloat(val) : '';
        if($this.data('negative') == true) {
            if(val !== '-' && isNaN(val)) {
                $this.val(newval);
            }
        } else {
            if(isNaN(val) || newval < 0) {
                $this.val(Math.abs(newval));
            }
        }
        if($this.val().length > 4) $this.val(Number(String($this.val()).substr(0, 4)));
    });
    // 区域深度输入框回车事件  
    $('.bottom-props-depth-input.number').on('keyup', function(e) {
        if(e.keyCode === 13) {
            if($('#bulge_backoff_selects').val() === '1') {
                console.log('凹进');
            } else {
                console.log('凸出');
            }
            alert($(this).val());
            $(this).blur();
        }
    });
    // 区域名称输入框回车事件  
    $('.bottom-props-name-input').on('keyup', function(e) {
        if(e.keyCode === 13) {
            alert($(this).val());
            $(this).blur();
        }
    });
    // selects 初始化
    $('#bulge_backoff_selects').select2({minimumResultsForSearch: Infinity, fireSelected: true});
    var container = $('.canvas-container')[0],
        $canvas = $("#canvas"),
        mousePos = {};
        
    canvas.sWidth = $canvas.width();
    canvas.sHeight = $canvas.height();
    container.addEventListener("mousedown", onmousedown);
    container.addEventListener("mousewheel", onmousewheel);
    
    canvas.scale = 1;
    function onmousedown(e) {
        if(e.target.localName == "input") return;
        if (!canvas.getFocusElement()) {
            container.addEventListener("mousemove", onmousemove);
            container.addEventListener("mouseup", onmouseup);
            mousePos = {x:e.clientX ,y:e.clientY};

        }
    }

    function onmousemove(e) {
        if (!canvas.getFocusElement()) {
            var offset = $canvas.position();
            $canvas.css({left:offset.left + e.clientX  - mousePos.x,top:offset.top + e.clientY - mousePos.y});
            document.body.style.cursor = "move";
            canvas._renderer.updateTextInputs(e.clientX  - mousePos.x, e.clientY - mousePos.y);
            mousePos = {x:e.clientX ,y:e.clientY};
        }
    }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
    
    function onmouseup(e) {
        if (!canvas.getFocusElement()) {
            container.removeEventListener("mousemove", onmousemove);
            container.removeEventListener("mouseup", onmouseup);
            document.body.style.cursor = "default";
        }
    }
    
    function onmousewheel(e){
        canvas.scale += e.wheelDelta * 0.0001;
        if(canvas.scale < 0.2) canvas.scale = 0.2;
        else if(canvas.scale > 2) canvas.scale = 2;
        
        var pos = $canvas.position(),    
            offsetX = ( canvas.sWidth * canvas.scale - $canvas.width() ) / 2 * -1,
            offsetY = ( canvas.sHeight * canvas.scale - $canvas.height() ) / 2 * -1;
        $canvas.css({left:pos.left + offsetX,top:pos.top + offsetY});
        canvas._canvas.width = canvas.sWidth * canvas.scale;
        canvas._canvas.height = canvas.sHeight * canvas.scale;


    }
    
    window.onresize = function(e){
        canvas._canvas.width = $('.canvas-container').width();
        canvas._canvas.height = $('.canvas-container').height();
    }
});