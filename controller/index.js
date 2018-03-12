/**
 * Created by admin on 2017/8/21.
 */
$(function() {
    $('#left_wrap').on('click', '.shape-obj', function() {
        var type = $(this).data('type');
        alert(type);
    });
    $(document).on('click', '#main_container', function(event) {
        event = event || window.event;
        if (event.clientX < 475 && event.clientY < 110) return false;
        if (!$('#main_container .display').data('ifshow')) return false;
        var clientWidth = parseInt($('#container').css('width'));
        var clientHeight = parseInt($('#container').css('height'));
        var selfLength = parseInt($('#container #props_wrap').css('width'));
        var selfHeight = parseInt($('#container #props_wrap').css('height'));
        // console.log(clientWidth, clientHeight, selfLength);
        var left = event.clientX + 20;
        var top = event.clientY + 20;
        if (left + selfLength >= clientWidth) {
            left = clientWidth - 20 - selfLength;
        }
        if (top + selfHeight >= clientHeight) {
            top = clientHeight - 20 - selfHeight;
        }
        $('#props_wrap').css('left', left).css('top', top);
    });
    $(document).on('click', '#main_container .display', function(event) {
        var ifShow = $(this).data('ifshow');
        if (ifShow) {
            $(this).html('隐藏');
            $(this).data('ifshow', false);
            $('#props_wrap').hide();
        } else {
            $(this).html('显示');
            $(this).data('ifshow', true);
            $('#props_wrap').show();
        }
    });
    $('#props_wrap').on('click', '.props', function() {
        var type = $(this).data('type');
        if ($(this).hasClass('line')) {
            $(this).children('.iconfont').toggleClass('none');
            if (type === 'straight') {
                $(this).data('type', 'curve');
                $(this).find('.pup').html('转为曲线<i></i>');
            } else {
                $(this).data('type', 'straight');
                $(this).find('.pup').html('转为直线<i></i>');
            }
        }
        alert(type);
    });
});