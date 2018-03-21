function Utility() {
    
}

Utility.DrawDimensionCallback = function(dis, canvas, seg, seg2, distance, direction) {
    if (seg && seg2) {
        Utility.doubleLineCallback(dis, canvas, seg, seg2, distance, direction);
    } else {
        seg = seg || seg2;
        Utility.singleLineCallback(dis, canvas, seg, seg2, distance, direction);
    }
}

Utility.singleLineCallback = function(dis, canvas, seg, seg2, distance, direction) {
    var newStart = seg.mStart.mPosition.clone();
    var newEnd = seg.mEnd.mPosition.clone();
    
    var offset = new Vec2(direction * Math.sign(distance) * (dis - Math.abs(distance)), 
                          (1- direction) * Math.sign(distance) * (dis - Math.abs(distance)));
    newStart.addBy(offset);
    newEnd.addBy(offset);

    
    canvas._mFloor.updatePosition([seg.mStart, seg.mEnd] , [newStart, newEnd]);
    
    canvas.render();
}

Utility.doubleLineCallback = function(dis, canvas, seg, seg2, distance, direction) {
    var newStart = seg.mStart.mPosition.clone();
    var newEnd = seg.mEnd.mPosition.clone();
    
    var offset = new Vec2(direction * 0.5 * Math.sign(distance) * (dis - Math.abs(distance)), 
                          (1- direction) * 0.5 * Math.sign(distance) * (dis - Math.abs(distance)));
    
    newStart.addBy(offset);
    newEnd.addBy(offset);

    var newStart2 = seg2.mStart.mPosition.clone();
    var newEnd2   = seg2.mEnd.mPosition.clone();
    
    var offset = new Vec2(-direction * 0.5 * Math.sign(distance) * (dis - Math.abs(distance)), 
                          -(1- direction) * 0.5 * Math.sign(distance) * (dis - Math.abs(distance)));
    
    newStart2.addBy(offset);
    newEnd2.addBy(offset);
    
    canvas._mFloor.updatePosition([seg.mStart, seg.mEnd, seg2.mStart, seg2.mEnd], [newStart, newEnd, newStart2, newEnd2]);
    
    canvas.render();
}

Utility.DrawCurveHeightCallback = function(dis, canvas, curve) {
    var pt0 = curve.getCenter();
    var pt1 = curve.getTheStartEndEdge().getCenter();
    
    var dir = new Vec2(pt0.mX - pt1.mX, pt0.mY - pt1.mY);
    dir.normalize();
    
    pt1.addBy(dir.mulBy(dis));

    canvas._mFloor.updatePosition(curve, pt1);
    
    canvas.render();
}

Utility.DrawCircleRadiusCallback = function(dis, canvas) {
    var edge = canvas._mEdge;
    var pt1 = edge.getCenter();
    
    var dir = new Vec2(edge.mEnd.mX - edge.mStart.mX, edge.mEnd.mY - edge.mStart.mY);
    dir.normalize();
    
    edge.mEnd.mX = edge.mStart.mX + dir.mX * dis;
    edge.mEnd.mY = edge.mStart.mY + dir.mY * dis;

    canvas.createElement();
    canvas.render();
}

Utility.DrawLineCallback = function(dis, canvas, edge) {
    var dir = new Vec2(edge.mEnd.mX - edge.mStart.mX, edge.mEnd.mY - edge.mStart.mY);
    dir.normalize();
    
    var end = new Vec2(edge.mStart.mX + dir.mX * dis, edge.mStart.mY + dir.mY * dis);

    end.mX = end.mX * Globals.Scale + Globals.Offset.mX;
    end.mY = end.mY * Globals.Scale + Globals.Offset.mY;
    
    canvas.snapMouse(end.mX, end.mY, true);
    canvas.setEndPoint();
    canvas.setStartPoint();
    canvas.render();
}

Utility.DrawRectCallback1 = function(dis, canvas, edge) {
    
}

Utility.DrawRectCallback2 = function(dis, canvas, edge) {
    var xDir = canvas._mEdge.mStart.mX - canvas._mEdge.mEnd.mX > 0 ? -1 : 1;
    var yDir = canvas._mEdge.mStart.mY - canvas._mEdge.mEnd.mY > 0 ? -1 : 1;
    canvas._mEdge.mEnd.mY = canvas._mEdge.mStart.mY + yDir * dis;
    canvas.createElement();
    canvas.render();
}