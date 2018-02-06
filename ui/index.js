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

    var moveStart = new Vec2(0, 0);
    var moveEnd = new Vec2(0, 0);
    var savedOffset = new Vec2(0, 0);
    savedOffset.copy(Globals.Offset);
    Globals.IsDragging = false;
    
    $(document).on('mousedown', '#canvas', function(event) {
        event = event || window.event;
        var btnNum = event.button;
        $('#props_wrap').hide();
        if(btnNum == 0) {
            //左键
            if (canvas.isDraggable()) {
                moveStart.set(event.offsetX, event.offsetY);
            } 
            canvas.setStartPoint();
        } else if(btnNum == 2) {
            //右键
            canvas.resetType();
        }
    });

    $(document).on('mouseup', '#canvas', function(event) {
        event = event || window.event;
        
        if (Globals.IsDragging) {
            var isMoved = true;
            if (Vec2.distance(moveStart, new Vec2(event.offsetX, event.offsetY)) < 4) {
                isMoved = false;
            }
            
            moveStart.set(0, 0);
            moveEnd.set(0, 0);
            savedOffset.copy(Globals.Offset);
            Globals.IsDragging = false;
            document.body.style.cursor = "default";
            if (isMoved) {
                return;
            }
        } 
        
        if(canvas.getType() == null) {
            var elementType = canvas.getFocusElement();
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

                } else if(elementType instanceof Edge) {
                    $('#props_wrap .props.line .iconfont.curve').removeClass('none').siblings('.straight').addClass('none');
                    $('#props_wrap').find('.props.line').data('type', 'straight');
                    $('#props_wrap').find('.props.line').find('.pup').html('转为曲线<i></i>');
                }
                if (!canvas.isMouseMoved(event.offsetX, event.offsetY) && event.button == 0) {
                    $('#props_wrap').show();
                    canvas.setOperationCurve();
                } else {
                    $('#props_wrap').hide();
                }
            }
        } else {
            canvas.createElement();
            canvas.render();
        }
        
        canvas.recordMouseUp(event.offsetX, event.offsetY);
        
    });

    $(document).on('mousemove', '#canvas', function(event) {
        event = event || window.event;
        if(event.which == 1) {
            //按住拖动
            if (canvas.isDraggable()) {
                Globals.IsDragging = true;
                moveEnd.set(event.offsetX, event.offsetY);
                
                Globals.Offset.copy(moveEnd);
                Globals.Offset.addBy(savedOffset).sub(moveStart);
                
                document.body.style.cursor = "move";
                canvas.render();
            } else {
                canvas.updateElement(event.offsetX, event.offsetY);
            }
        } else if(event.which == 0) {
            //没按住拖动
            canvas.snapMouse(event.offsetX, event.offsetY, true);
            canvas.setEndPoint();
            canvas.render();
        }
    });
    // mousewheel 监听鼠标滚轮滚动次数
    // 鼠标滚轮滚动次数
    var mouseWheelIndex = 0;
    $(document).on('mousewheel', '#canvas', function(event) {
        event = event || window.event;
        var e = event.originalEvent;
        var newScale = Globals.Scale + e.wheelDelta * 0.0001;
        newScale = Math.min(Math.max(newScale, 0.2), 2);
        
        Globals.Offset.addBy(Globals.Size.mul((Globals.Scale - newScale) / 2));
        savedOffset.copy(Globals.Offset);
        Globals.Scale = newScale;
        canvas.render();
    });
    
    // 选中线段事件
    $('#props_wrap').on('click', '.props', function() {
        var type = $(this).data('type');
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
    
    $('#crown_height').on('ifChecked', function(event) {
        canvas.setCrownHeight(true);
        console.log("圆弧高度 选中");
    });
    
    $('#crown_height').on('ifUnchecked', function(event) {
        canvas.setCrownHeight(false);
        console.log("圆弧高度 取消选中");
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
        canvas.clear();
        return false;
    });
    /**
     *区域属性的数据更新方法
     *name: String 区域名称
     *value: Number 凸出/凹进的值(包含正负号，负号为凹进)
     *ifShow: Boolean 是否显示区域属性
     */
    var refreshAreaData = function(name, value, ifShow) {
        if(!ifShow) {
            $('#bottom_props').hide();
            return false;
        }
        $('#bottom_props').css('display', 'flex');
        $('#bottom_props .bottom-props-name-input').val(name);
        // 小于0 或者 等于-0时为凹进，否则为凸出
        if(value < 0 || (value === 0 && 1 / value < 0)) {
            $('#bottom_props #bulge_backoff_selects').val(1).trigger('change.select2');
        } else {
            $('#bottom_props #bulge_backoff_selects').val(0).trigger('change.select2');
        }
        $('#bottom_props .bottom-props-depth-input').val(Math.abs(value));
    };
    canvas.toggleHeightUICallback = refreshAreaData;
    
    /**
     * 设置提示框的信息
     * message: String 不合法的数值
     */
    var setMessageData = function(message) {
        $('.message-box').css('display', 'flex');
        $('.message-box span').text(message);
        setTimeout(function() {$('.message-box').fadeOut();}, 2000);
    };

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
            var sign = 0;
            if($('#bulge_backoff_selects').val() === '1') {
                console.log('凹进');
                sign = -1;
            } else {
                console.log('凸出');
                sign = 1;
            }
            canvas.setAreaHeight(sign, $(this).val());
            //alert($(this).val());
            $(this).blur();
        }
    });
    // 区域名称输入框回车事件  
    $('.bottom-props-name-input').on('keyup', function(e) {
        if(e.keyCode === 13) {
            canvas.setAreaName($(this).val());
            $(this).blur();
        }
    });
    // selects 初始化
    $('#bulge_backoff_selects').select2({minimumResultsForSearch: Infinity, fireSelected: true});
    // 凹进、凸出select的change事件
    $('#bulge_backoff_selects').on('change',function() {
        var sign = 1;
        var val = $(this).val();
        if(val === '1') sign = -1;
        canvas.setAreaHeight(sign, $('.bottom-props-depth-input').val());
    });
    var container = $('.canvas-container')[0],
        $canvas = $("#canvas");

    window.onresize = function(e){
        canvas.resize($('.canvas-container').width(), $('.canvas-container').height());
        savedOffset.copy(Globals.Offset);
        canvas.render();
    }
});