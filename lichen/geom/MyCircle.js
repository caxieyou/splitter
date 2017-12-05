function MyCircle(param1, param2) {
    if (param1 == null || param1 == undefined) {
        param1 = null;
    }

    if (param2 == null || param2 == undefined) {
        param2 = 0;
    }

    this.mCenter = param1;
    this.mRadius = param2;
}

MyCircle.prototype.getCenterIntersectAngle = function(param1)
{
    var p = new Vec2(param1.mX, param1.mY, param1.mW);
    return p.sub(this.mCenter).getAngle();
}

MyCircle.prototype.isInsideCircle = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    
    return Math.abs(this.mCenter.distance(param1) - this.mRadius) < param2;
}