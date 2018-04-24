//全局变量记录

var Globals = {};

Globals.SNAPPING_THRESHOLD = 3;
Globals.DISTANCE_THRESHOLD = 3;
Globals.Scale = 1;
Globals.Size = new Vec2(800, 800);
Globals.Offset = new Vec2(0, 0);
Globals.IsDragging = false;
Globals.UpdateStatus = -1;

//风格配置

var Style = {};

// 绘制线条时，已经相交后，超出部分的Style
// 以及调整点的位置，有相交后的指示线Style
// 虚线，红色
Style.OverLine = {
    isDash : true,
    color : 'red'
};

// 调整点位置有相交后的错误指示点Style
// 红色 半径10（和鼠标十字型一样大）
Style.ErrorCorner = {
    radius : 10,
    color : 'red'
};

// 调整Corner点位置时的Style
// 半径 8， 橙色
Style.UpdateCorner = {
    radius : 8,
    color : '#f57208'
};

// 鼠标移动区域Corner，边的中点，区域重心位置时的Style
// 半径8 橙色
Style.FocusCorner = {
    radius : 8,
    color : '#f57208'
};

// 垂直和水平的鼠标移动，于其他图形有snapping时的颜色
// 蓝色
Style.RulerSnap = {
    color : 'blue'
};

// 绘制过程中，尤其是绘制Rect的时候，和现有的Rect有Corner点的重叠时的Style
// 橙色，半径6，略小于正常Corner的8
Style.OverlapCorner = {
    radius : 6,
    color : '#f57208'
};

// 绘制线的过程中，交点的Style，由两个圈组成，内圈实心，外圈空心
// 橙色，半径6，略小于正常Corner的8
Style.IntersectCorner = {
    radius : 6,
    innerColor : "#699acc",
    outColor : "#1371d1"
};

// 默认线条被选中时的Style
// 蓝色
Style.FocusLine = {
    color : 'blue'
};

// 默认线条普通的Style
// 灰色
Style.DefaultLine = {
    color : "#888"
};


// 区域填充颜色
// 蓝绿色
Style.Fill = {
    color : 'rgba(153, 255, 255, 0.2)'
};


// 带高度的阴影线条颜色
// 黑色，半透明
Style.Shadow = {
    color : 'rgba(0, 0, 0, 0.5)'
};


// 选中区域边界点的Style
// 深蓝，半径3
Style.PickeDot = {
    radius : 3,
    color : '#2693FF'
};


Style.BoundryLine = {
    color : 'black'
}