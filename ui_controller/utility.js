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