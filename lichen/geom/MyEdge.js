function MyEdge(param1, param2) {
    this.mStart = param1;
    this.mEnd = param2;
};

MyEdge.THRESHOLD = 1.0E-6;
MyEdge.CONST_1 = 1;

MyEdge.getValidHorizontalSection = function(edge0, edge1, markLine) {
    var a = [edge0.mStart.mX, edge0.mEnd.mX, edge1.mStart.mX, edge1.mEnd.mX];
    a.sort(function(a, b) {
        return a - b;
        });
    if (a[3] - a[0] >= Math.abs(edge0.mEnd.mX - edge0.mStart.mX) + Math.abs(edge1.mEnd.mX - edge1.mStart.mX)) {
        return false;
    } else {
        
        markLine.mStart.mX = (a[1] + a[2])/2;
        markLine.mStart.mY = edge0.mStart.mY;
        markLine.mEnd.mX = markLine.mStart.mX;
        markLine.mEnd.mY = edge1.mStart.mY;
        
        return true;
    }
}

MyEdge.getValidVerticalSection = function(edge0, edge1, markLine) {
    var a = [edge0.mStart.mY, edge0.mEnd.mY, edge1.mStart.mY, edge1.mEnd.mY];
    
    a.sort(function(a, b) {
        return a - b;
        });
    
    if (a[3] - a[0] >= Math.abs(edge0.mEnd.mY - edge0.mStart.mY) + Math.abs(edge1.mEnd.mY - edge1.mStart.mY)) {
        return false;
    } else {
        
        markLine.mStart.mX = edge0.mStart.mX;
        markLine.mStart.mY = (a[1] + a[2])/2;
        markLine.mEnd.mX = edge1.mStart.mX;
        markLine.mEnd.mY = markLine.mStart.mY;
        
        return true;
    }
}

MyEdge.isPointWithinHorizontal = function(x, edge) {
    var min = Math.min(edge.mStart.mX, edge.mEnd.mX);
    var max = Math.max(edge.mStart.mX, edge.mEnd.mX);
    
    if (x < max && x > min) {
        return true;
    } else {
        return false;
    }
}

MyEdge.isPointWithinVertical = function(y, edge) {
    var min = Math.min(edge.mStart.mY, edge.mEnd.mY);
    var max = Math.max(edge.mStart.mY, edge.mEnd.mY);
    
    if (y < max && y > min) {
        return true;
    } else {
        return false;
    }
}

MyEdge.isValidAngleDiff = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 1;
    }
    
    var _loc4_ = param1.getVecEndMinusStart();
    var _loc5_ = param2.getVecEndMinusStart();
    var _loc6_ = Vec2.IncludedAngleValue(_loc4_,_loc5_);
    var _loc7_ = Angle.toDegrees(_loc6_);
    return _loc7_ < param3 || 180 - _loc7_ < param3;
}

MyEdge.isWithinPI = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 1;
    }
    
    var _loc4_ = param1.getVecEndMinusStart();
    var _loc5_ = param2.getVecEndMinusStart();
    var _loc6_ = Vec2.IncludedAngleValue(_loc4_,_loc5_);
    var _loc7_ = Angle.toDegrees(_loc6_);
    return Math.abs(90 - _loc7_) < param3;
}

MyEdge.getIntersection = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 1;
    }
    
    if(MyEdge.isValidAngleDiff(param1,param2,param3))
    {
        return null;
    }
    var _loc4_ = param1.mStart;
    var _loc5_ = param1.mEnd;
    var _loc6_ = param2.mStart;
    var _loc7_ = param2.mEnd;
    var _loc8_ = _loc4_.clone();
    var _loc9_ =  ((_loc4_.mX - _loc6_.mX) * (_loc6_.mY - _loc7_.mY) - (_loc4_.mY - _loc6_.mY) * (_loc6_.mX - _loc7_.mX)) 
                / ((_loc4_.mX - _loc5_.mX) * (_loc6_.mY - _loc7_.mY) - (_loc4_.mY - _loc5_.mY) * (_loc6_.mX - _loc7_.mX));
    _loc8_.mX = _loc8_.mX + (_loc5_.mX - _loc4_.mX) * _loc9_;
    _loc8_.mY = _loc8_.mY + (_loc5_.mY - _loc4_.mY) * _loc9_;
    return _loc8_;
}

MyEdge.getDiff = function(param1, param2, param3) {
    if (param3 == null || param3 == undefined) {
        param3 = 1;
    }
    
    var angle1 = param1.getAngle();
    var angle2 = param2.getAngle();
    
    if(!MyEdge.isValidAngleDiff(param1,param2,param3))
    {
        return param1;
    }
    
    var isStartInterSect = param2.distanceSmallThan(param1.mStart);
    var isEndInterSect = param2.distanceSmallThan(param1.mEnd);
    
    
    //contains
    if (isStartInterSect && isEndInterSect) {
        return null;
    }
    
    //no relationship
    if (!isStartInterSect && !isEndInterSect) {
        return param1;
    }
    
    //
    if (isStartInterSect) {
        if (Vec2.distance(param1.mEnd, param2.mStart) < Vec2.distance(param1.mEnd, param2.mEnd)) {
            return new MyEdge(param1.mEnd.clone(), param2.mStart.clone());
        } else {
            return new MyEdge(param1.mEnd.clone(), param2.mEnd.clone());
        }
    }
    
    if (isEndInterSect) {
        if (Vec2.distance(param1.mStart, param2.mStart) < Vec2.distance(param1.mStart, param2.mEnd)) {
            return new MyEdge(param1.mStart.clone(), param2.mStart.clone());
        } else {
            return new MyEdge(param1.mStart.clone(), param2.mEnd.clone());
        }
    }
} 


MyEdge.getDistanceBy2Points = function(param1, param2, param3, param4)
{
    var _loc5_ = new MyEdge(param1,param2);
    return _loc5_.getDistance(param3,param4);
}

MyEdge.distancePointToCurve = function(param1, param2, param3)
{
    return Vec2.dot(Vec2.sub(param3,param1),new Vec2(param1.mY - param2.mY,param2.mX - param1.mX).normalize());
}

MyEdge.distanceSmallThan = function(param1, param2, param3, param4)
{
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    
    var _loc5_ = MyEdge.getDistanceBy2Points(param1,param2,param3,true);
    return _loc5_ < param4;
}

MyEdge.pointInEdgeOrOnEdge = function(param1, param2, param3, param4)
{
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    
    return      MyEdge.distanceSmallThan(param1,param2,param3,param4) 
            && !param3.isClose(param1,param4) 
            && !param3.isClose(param2,param4);
}

MyEdge.getPointVectorEdge = function(param1, param2)
{
    return new MyEdge(param1,param1.add(param2));
}

MyEdge.getXFromY = function(param1, param2, param3, param4, param5)
{
    if (param4 == null || param4 == undefined) {
        param4 = false;
    }
    
    if (param5 == null || param5 == undefined) {
        param5 = 1.0E-6;
    }
    
    if(MyNumber.isEqual(param1.mY,param2.mY,param5))
    {
        return NaN;
    }
    var _loc6_ = Math.min(param1.mY,param2.mY);
    var _loc7_ = Math.max(param1.mY,param2.mY);
    if(param3 < _loc7_ && param3 > _loc6_ || param4 && (MyNumber.isEqual(param3,_loc7_,param5) || MyNumber.isEqual(param3,_loc6_,param5)))
    {
        return param1.mX - (param1.mY - param3) * (param1.mX - param2.mX) / (param1.mY - param2.mY);
    }
    return NaN;
}

MyEdge.prototype.contains = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }

    if(param1.distanceSquareFunc() > this.distanceSquareFunc())
    {
        return false;
    }
    return this.distanceSmallThan(param1.mStart,param2) && this.distanceSmallThan(param1.mEnd,param2);
}

//removePointsNotInsideCurve
MyEdge.prototype.removePointsNotInside = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    
    var _loc3_ = null;
    var _loc4_ = param1.length - 1;
    var ret = false;
    while(!ret) {
        ret = true;
        for(var i = 0; i < param1.length; i++) {
            if (!this.pointInEdgeOrOnEdge(param1[i],param2)) {
                param1.splice(i, 1);
                ret = false;
                break;
            }
        }
    }
}

MyEdge.prototype.pointOnLineButNoNeedToBeWithin = function(param1)
{
    return MyNumber.isZeroOrOrigin(Vec2.crossByPoint(this.mStart,this.mEnd,param1));
}

MyEdge.prototype.distanceSmallThan = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    
    var _loc3_ = this.getDistance(param1,true);
    return _loc3_ < param2;
}

MyEdge.prototype.pointInEdgeOrOnEdge = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    var res = this.distanceSmallThan(param1,param2) && !this.isSameAsEdgeStartOrEnd(param1,param2);
    return res;
}

MyEdge.prototype.isSameAsEdgeStartOrEnd = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    //param2 = param2 || 1.0E-6;
    return param1.isClose(this.mStart,param2) || param1.isClose(this.mEnd,param2);
}

MyEdge.prototype.decideSide = function(param1)
{
    var _loc2_ = Vec2.crossByPoint(this.mStart,this.mEnd,param1);
    if(_loc2_ > 0)
    {
    return Line2DPointSide.ON_LEFT;
    }
    if(_loc2_ < 0)
    {
    return Line2DPointSide.ON_RIGHT;
    }
    return Line2DPointSide.ON_LINE;
}

MyEdge.prototype.project = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = false;
    }
    //param2 = param2 || false;
    if(MyNumber.isZeroOrOrigin(this.getLength()))
    {
        return null;
    }
    var _loc3_ = Vec2.sub(param1,this.mStart);
    var _loc4_ = Vec2.sub(this.mEnd,this.mStart);
    var _loc5_ = Vec2.dot(_loc3_,_loc4_) / this.distanceSquareFunc();
    if(param2 && (_loc5_ < 0 || _loc5_ > 1))
    {
        return null;
    }
    return this.interpolate(_loc5_);
}

MyEdge.prototype.getIntersectionPointByPoint = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = false;
    }
    //param2 = param2 || false;
    if(MyNumber.isZeroOrOrigin(this.getLength()))
    {
        return this.mStart;
    }
    var _loc3_ = Vec2.sub(param1,this.mStart);
    var _loc4_ = Vec2.sub(this.mEnd,this.mStart);
    var _loc5_ = Vec2.dot(_loc3_,_loc4_) / this.distanceSquareFunc();
    if(param2)
    {
        if(_loc5_ < 0)
        {
            return this.mStart.clone();
        }
        if(_loc5_ > 1)
        {
            return this.mEnd.clone();
        }
    }
    return this.interpolate(_loc5_);
}

MyEdge.prototype.enlarge_xx = function(param1)
{
    return this.mStart.distance(this.mEnd) * param1;
}

MyEdge.prototype.getSplitPosByRatio = function(param1)
{
    return this.mEnd.sub(this.mStart).mulBy(param1).add(this.mStart);
}

MyEdge.prototype.getPointByDistanceOnEdge = function(param1)
{
    return this.interpolate(param1 / this.mStart.distance(this.mEnd));
}

MyEdge.prototype.interpolate = function(param1)
{
    if (param1 == null || param1 == undefined) {
        param1 = 0.5;
    }

    //param1 = param1 || 0.5;
    return Vec2.interpolate(this.mStart,this.mEnd,param1);
}

//垂直距离的平方,bool值代表要不要考虑在线段外面的情况
MyEdge.prototype.verticalDistanceSquare = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = false;
    }

    if(MyNumber.isZeroOrOrigin(this.getLength()))
    {
        return Vec2.distance(param1,this.mStart);
    }
    var _loc3_ = ((param1.mX - this.mStart.mX) * (this.mEnd.mX - this.mStart.mX) + (param1.mY - this.mStart.mY) * (this.mEnd.mY - this.mStart.mY)) / this.distanceSquareFunc();
    if(param2)
    {
        if(_loc3_ < 0)
        {
            return Vec2.distanceSquare(param1,this.mStart);
        }
        if(_loc3_ > 1)
        {
            return Vec2.distanceSquare(param1,this.mEnd);
        }
    }
    var _loc4_ = this.interpolate(_loc3_);
    return param1.distanceSquare(_loc4_);
}

MyEdge.prototype.getDistance = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = false;
    }
    //param2 = param2 || false;
    var _loc3_ = this.verticalDistanceSquare(param1,param2);
    return Math.sqrt(_loc3_);
}

MyEdge.prototype.distancePointToCurve = function(param1)
{
    return Vec2.dot(Vec2.sub(param1,this.mStart),this.rotate_minus_90_degree().normalize());
}

MyEdge.prototype.translate = function(param1)
{
    return new MyEdge(Vec2.add(this.mStart,param1),Vec2.add(this.mEnd,param1));
}

MyEdge.prototype.reverse = function()
{
    var _loc1_ = this.mEnd;
    this.mEnd = this.mStart;
    this.mStart = _loc1_;
    return this;
}

MyEdge.prototype.isWithinPI = function()
{
    return Angle.isWithinPI(this.getAngle());
}

MyEdge.prototype.isHorizontal = function()
{
    return Angle.isHorizontal(this.getAngle());
}

MyEdge.prototype.isVertical = function()
{
    return Angle.isVertical(this.getAngle());
}

MyEdge.prototype.getXFromY = function(param1)
{
    if(this.mStart.mY == this.mEnd.mY)
    {
        return NaN;
    }
    var _loc2_ = Math.min(this.mStart.mY,this.mEnd.mY);
    var _loc3_ = Math.max(this.mStart.mY,this.mEnd.mY);
    if(param1 < _loc3_ && param1 > _loc2_)
    {
        return this.mStart.x - (this.mStart.mY - param1) * (this.mStart.x - this.mEnd.mY) / (this.mStart.mY - this.mEnd.y);
    }
    return NaN;
}

MyEdge.prototype.getCenter = function()
{
    return this.interpolate(0.5);
}

MyEdge.prototype.getVecEndMinusStart = function()
{
    return Vec2.sub(this.mEnd,this.mStart);
}

MyEdge.prototype.rotate_90_degree = function()
{
    return this.mEnd.sub(this.mStart).rotate_90_degree();
}

MyEdge.prototype.rotate_minus_90_degree = function()
{
    return this.mEnd.sub(this.mStart).rotate_minus_90_degree();
}

MyEdge.prototype.toVector = function()
{
    var ret = [];
    ret.push(this.mStart);
    ret.push(this.mEnd);
    return ret;
}


MyEdge.prototype.getBoundingBox = function()
{
    var ret = new MyRect();
    ret.includeValues(this.toVector());
    return ret;
}

MyEdge.prototype.getExpanded = function(param1, param2)
{
    return new MyEdge(this.interpolate(param1),this.interpolate(param2));
}

MyEdge.prototype.clone = function()
{
    return new MyEdge(this.mStart.clone(),this.mEnd.clone());
}

MyEdge.prototype.equals = function(param1)
{
    return this.mStart.equals(param1.mStart) && this.mEnd.equals(param1.mEnd);
}

MyEdge.prototype.getLength = function()
{
    return Vec2.distance(this.mStart,this.mEnd);
}

MyEdge.prototype.distanceSquareFunc = function()
{
    return Vec2.distanceSquare(this.mStart,this.mEnd);
}

MyEdge.prototype.getAngle = function()
{
    return Math.atan2(this.mEnd.mY - this.mStart.mY, this.mEnd.mX - this.mStart.mX);
}