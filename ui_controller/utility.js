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
                                            
    var oriStart = seg.mStart.mPosition.clone();
    var oriEnd = seg.mEnd.mPosition.clone();
    
    var newStart = seg.mStart.mPosition.clone();
    var newEnd = seg.mEnd.mPosition.clone();
    
    newStart.mX = newStart.mX + direction * Math.sign(distance) * (dis - Math.abs(distance));
    newEnd.mX = newEnd.mX + direction * Math.sign(distance) * (dis - Math.abs(distance));

    newStart.mY = newStart.mY + (1- direction) * Math.sign(distance) * (dis - Math.abs(distance));
    newEnd.mY = newEnd.mY + (1- direction) * Math.sign(distance) * (dis - Math.abs(distance));
    
    canvas._mFloor.updatePosition([seg.mStart, seg.mEnd] , [newStart, newEnd], [oriStart, oriEnd]);
    
    canvas.render();
    
}

Utility.doubleLineCallback = function(dis, canvas, seg, seg2, distance, direction) {
    var oriStart = seg.mStart.mPosition.clone();
    var oriEnd = seg.mEnd.mPosition.clone();
    
    var newStart = seg.mStart.mPosition.clone();
    var newEnd = seg.mEnd.mPosition.clone();
    
    newStart.mX = newStart.mX + direction * 0.5 * Math.sign(distance) * (dis - Math.abs(distance));
    newEnd.mX = newEnd.mX + direction * 0.5 * Math.sign(distance) * (dis - Math.abs(distance));
    newStart.mY = newStart.mY + (1- direction) * 0.5 * Math.sign(distance) * (dis - Math.abs(distance));
    newEnd.mY = newEnd.mY + (1- direction) * 0.5 * Math.sign(distance) * (dis - Math.abs(distance));
    
    var oriStart2 = seg2.mStart.mPosition.clone();
    var oriEnd2 = seg2.mEnd.mPosition.clone();
    
    var newStart2 = seg2.mStart.mPosition.clone();
    var newEnd2 = seg2.mEnd.mPosition.clone();
    
    newStart2.mX = newStart2.mX - direction * 0.5 * Math.sign(distance) * (dis - Math.abs(distance));
    newEnd2.mX = newEnd2.mX - direction * 0.5 * Math.sign(distance) * (dis - Math.abs(distance));
    newStart2.mY = newStart2.mY - (1- direction) * 0.5 * Math.sign(distance) * (dis - Math.abs(distance));
    newEnd2.mY = newEnd2.mY - (1- direction) * 0.5 * Math.sign(distance) * (dis - Math.abs(distance));
    
    
    canvas._mFloor.updatePosition([seg.mStart, seg.mEnd, seg2.mStart, seg2.mEnd] , 
                                     [newStart, newEnd, newStart2, newEnd2], 
                                     [oriStart, oriEnd, oriStart2, oriEnd2]);
    
    canvas.render();
}

Utility.DrawCurveHeightCallback = function(dis, canvas, curve) {
    var originalCurvePoint = curve.mCurvePoint.clone();
    
    var pt0 = curve.getCenter();
    var pt1 = curve.getTheStartEndEdge().getCenter();
    
    var dir = new Vec2(pt0.mX - pt1.mX, pt0.mY - pt1.mY);
    dir.normalize();
    
    pt1.addBy(dir.mulBy(dis));

    that._mFloor.updatePosition(curve.mCurvePoint, pt1, originalCurvePoint);
    
    canvas.render();
}