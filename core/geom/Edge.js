function Edge(param1, param2) {
    this.mStart = param1;
    this.mEnd = param2;
};

Edge.THRESHOLD = 1.0E-6;
Edge.CONST_1 = 1;

Edge.getValidHorizontalSection = function(edge0, edge1, markLine) {
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

Edge.getValidVerticalSection = function(edge0, edge1, markLine) {
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

Edge.isPointWithinHorizontal = function(x, edge) {
    var min = Math.min(edge.mStart.mX, edge.mEnd.mX);
    var max = Math.max(edge.mStart.mX, edge.mEnd.mX);
    
    if (x < max && x > min) {
        return true;
    } else {
        return false;
    }
}

Edge.isPointWithinVertical = function(y, edge) {
    var min = Math.min(edge.mStart.mY, edge.mEnd.mY);
    var max = Math.max(edge.mStart.mY, edge.mEnd.mY);
    
    if (y < max && y > min) {
        return true;
    } else {
        return false;
    }
}

Edge.isValidAngleDiff = function(param1, param2, param3)
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

Edge.isWithinPI = function(param1, param2, param3)
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

Edge.getIntersection = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 1;
    }
    
    if(Edge.isValidAngleDiff(param1,param2,param3))
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

Edge.getDiff = function(param1, param2, param3) {
    if (param3 == null || param3 == undefined) {
        param3 = 1;
    }

    var angle1 = param1.getAngle();
    var angle2 = param2.getAngle();
    
    if(!Edge.isValidAngleDiff(param1,param2,param3))
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
        var isStartInterSect2 = param1.distanceSmallThan(param2.mStart);
        var isEndInterSect2 = param1.distanceSmallThan(param2.mEnd);
        if (isStartInterSect2 && isEndInterSect2) {
            if (Vec2.distance(param1.mStart, param2.mStart) < Vec2.distance(param1.mStart, param2.mEnd)) {
                return [new Edge(param1.mStart.clone(), param2.mStart.clone()),
                        new Edge(param2.mEnd.clone(), param1.mEnd.clone())];
            } else {
                return [new Edge(param1.mStart.clone(), param2.mEnd.clone()),
                    new Edge(param2.mStart.clone(), param1.mEnd.clone())];
            }
        } else {
            return param1;
        }
        
    }
    
    //
    if (isStartInterSect) {
        if (Vec2.distance(param1.mEnd, param2.mStart) < Vec2.distance(param1.mEnd, param2.mEnd)) {
            return new Edge(param1.mEnd.clone(), param2.mStart.clone());
        } else {
            return new Edge(param1.mEnd.clone(), param2.mEnd.clone());
        }
    }
    
    if (isEndInterSect) {
        if (Vec2.distance(param1.mStart, param2.mStart) < Vec2.distance(param1.mStart, param2.mEnd)) {
            return new Edge(param1.mStart.clone(), param2.mStart.clone());
        } else {
            return new Edge(param1.mStart.clone(), param2.mEnd.clone());
        }
    }
} 


Edge.getDistanceBy2Points = function(param1, param2, param3, param4)
{
    var _loc5_ = new Edge(param1,param2);
    return _loc5_.getDistance(param3,param4);
}

Edge.distancePointToCurve = function(param1, param2, param3)
{
    return Vec2.dot(Vec2.sub(param3,param1),new Vec2(param1.mY - param2.mY,param2.mX - param1.mX).normalize());
}

Edge.distanceSmallThan = function(param1, param2, param3, param4)
{
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    
    var _loc5_ = Edge.getDistanceBy2Points(param1,param2,param3,true);
    return _loc5_ < param4;
}

Edge.pointInEdgeOrOnEdge = function(param1, param2, param3, param4)
{
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    
    return      Edge.distanceSmallThan(param1,param2,param3,param4) 
            && !param3.isClose(param1,param4) 
            && !param3.isClose(param2,param4);
}


Edge.getPointVectorEdge = function(param1, param2)
{
    return new Edge(param1,param1.add(param2));
}

Edge.getXFromY = function(param1, param2, param3, param4, param5)
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

Edge.prototype.contains = function(param1, param2)
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
Edge.prototype.removePointsNotInside = function(param1, param2)
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

Edge.prototype.pointOnLineButNoNeedToBeWithin = function(param1)
{
    return MyNumber.isZero(Vec2.crossByPoint(this.mStart,this.mEnd,param1));
}

Edge.prototype.distanceSmallThan = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    
    var _loc3_ = this.getDistance(param1,true);
    return _loc3_ < param2;
}

Edge.prototype.pointInEdgeOrOnEdge = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    var res = this.distanceSmallThan(param1,param2) && !this.isSameAsEdgeStartOrEnd(param1,param2);
    return res;
}

Edge.prototype.pointInEdge = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    var res = this.distanceSmallThan(param1,param2);
    return res;
}

Edge.prototype.isSameAsEdgeStartOrEnd = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    //param2 = param2 || 1.0E-6;
    return param1.isClose(this.mStart,param2) || param1.isClose(this.mEnd,param2);
}

Edge.prototype.decideSide = function(param1)
{
    var _loc2_ = Vec2.crossByPoint(this.mStart,this.mEnd,param1);
    if(_loc2_ > 0)
    {
    return 1; //Line2DPointSide.ON_LEFT;
    }
    if(_loc2_ < 0)
    {
    return -1; //Line2DPointSide.ON_RIGHT;
    }
    return 0; //Line2DPointSide.ON_LINE;
}

Edge.prototype.project = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = false;
    }
    //param2 = param2 || false;
    if(MyNumber.isZero(this.getLength()))
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

Edge.prototype.getIntersectionPointByPoint = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = false;
    }
    //param2 = param2 || false;
    if(MyNumber.isZero(this.getLength()))
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

Edge.prototype.enlarge_xx = function(param1)
{
    return this.mStart.distance(this.mEnd) * param1;
}

Edge.prototype.getPointByRatio = function(param1)
{
    return this.mEnd.sub(this.mStart).mulBy(param1).add(this.mStart);
}

Edge.prototype.getPointByDistanceOnEdge = function(param1)
{
    return this.interpolate(param1 / this.mStart.distance(this.mEnd));
}

Edge.prototype.interpolate = function(param1)
{
    if (param1 == null || param1 == undefined) {
        param1 = 0.5;
    }

    //param1 = param1 || 0.5;
    return Vec2.interpolate(this.mStart,this.mEnd,param1);
}

//垂直距离的平方,bool值代表要不要考虑在线段外面的情况
Edge.prototype.verticalDistanceSquare = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = false;
    }

    if(MyNumber.isZero(this.getLength()))
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

Edge.prototype.getDistance = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = false;
    }
    //param2 = param2 || false;
    var _loc3_ = this.verticalDistanceSquare(param1,param2);
    return Math.sqrt(_loc3_);
}

Edge.prototype.distancePointToCurve = function(param1)
{
    return Vec2.dot(Vec2.sub(param1,this.mStart),this.rotate_minus_90_degree().normalize());
}

Edge.prototype.translate = function(param1)
{
    return new Edge(Vec2.add(this.mStart,param1),Vec2.add(this.mEnd,param1));
}

Edge.prototype.reverse = function()
{
    var _loc1_ = this.mEnd;
    this.mEnd = this.mStart;
    this.mStart = _loc1_;
    return this;
}

Edge.prototype.isWithinPI = function()
{
    return Angle.isWithinPI(this.getAngle());
}

Edge.prototype.isHorizontal = function()
{
    return Angle.isHorizontal(this.getAngle());
}

Edge.prototype.isVertical = function()
{
    return Angle.isVertical(this.getAngle());
}

Edge.prototype.getXFromY = function(param1)
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

Edge.prototype.getCenter = function()
{
    return this.interpolate(0.5);
}

Edge.prototype.getVecEndMinusStart = function()
{
    return Vec2.sub(this.mEnd,this.mStart);
}

Edge.prototype.rotate_90_degree = function()
{
    return this.mEnd.sub(this.mStart).rotate_90_degree();
}

Edge.prototype.rotate_minus_90_degree = function()
{
    return this.mEnd.sub(this.mStart).rotate_minus_90_degree();
}

Edge.prototype.toVector = function()
{
    var ret = [];
    ret.push(this.mStart);
    ret.push(this.mEnd);
    return ret;
}


Edge.prototype.getBoundingBox = function()
{
    var ret = new Rect();
    ret.includeValues(this.toVector());
    return ret;
}

Edge.prototype.scale = function(s, oX, oY)
{
    return new Edge(this.mStart.clone().mul(s).add(new Vec2(oX, oY)), this.mEnd.clone().mul(s).add(new Vec2(oX, oY)));
}

Edge.prototype.getExpanded = function(param1, param2)
{
    return new Edge(this.interpolate(param1),this.interpolate(param2));
}

Edge.prototype.clone = function()
{
    return new Edge(this.mStart.clone(),this.mEnd.clone());
}

Edge.prototype.equals = function(param1)
{
    return this.mStart.equals(param1.mStart) && this.mEnd.equals(param1.mEnd);
}

Edge.prototype.getLength = function()
{
    return Vec2.distance(this.mStart,this.mEnd);
}

Edge.prototype.distanceSquareFunc = function()
{
    return Vec2.distanceSquare(this.mStart,this.mEnd);
}

Edge.prototype.getAngle = function()
{
    return Math.atan2(this.mEnd.mY - this.mStart.mY, this.mEnd.mX - this.mStart.mX);
}

Edge.getCorssAngle = function(edge1, edge2)
{
    var dir1 = new Vec2(edge1.mEnd.mX - edge1.mStart.mX, edge1.mEnd.mY - edge1.mStart.mY);
    var dir2 = new Vec2(edge2.mEnd.mX - edge2.mStart.mX, edge2.mEnd.mY - edge2.mStart.mY);
    
    var cosValue = Vec2.dot(dir1, dir2) / (dir1.getLength() * dir2.getLength());
    
    return Math.acos(MyMath.clamp(cosValue,-1,1));
}


Edge.prototype.toRectEdges = function()
{
    var edges = [];
    edges.push(new Edge(new Vec2(this.mStart.mX, this.mStart.mY), new Vec2(this.mEnd.mX,   this.mStart.mY)));
    edges.push(new Edge(new Vec2(this.mEnd.mX,   this.mStart.mY), new Vec2(this.mEnd.mX,   this.mEnd.mY)));
    edges.push(new Edge(new Vec2(this.mEnd.mX,   this.mEnd.mY),   new Vec2(this.mStart.mX, this.mEnd.mY)));
    edges.push(new Edge(new Vec2(this.mStart.mX, this.mEnd.mY),   new Vec2(this.mStart.mX, this.mStart.mY)));
    return edges;
}