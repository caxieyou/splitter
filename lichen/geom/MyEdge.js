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
    //param2 = param2 || 1.0E-6;
    var _loc3_ = this.getDistance(param1,true);
    //console.log("!!!!!!!!!!!!");
    //console.log(_loc3_);
    return _loc3_ < param2;
}

MyEdge.prototype.pointInEdgeOrOnEdge = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    var res = this.distanceSmallThan(param1,param2) && !this.isSameAsEdgeStartOrEnd(param1,param2);
    //console.log(res);
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
/*
MyEdge.prototype.§-_-___-----_§(param1:my2D_Edge) : Interval
{
var _loc2_:Interval = new Interval();
_loc2_.includeValue(this.§-____--_-_-_-§(param1.start,false));
_loc2_.includeValue(this.§-____--_-_-_-§(param1.end,false));
return _loc2_;
}

MyEdge.prototype.§-_---__-_§(param1:Vector.<Vec2>) : Interval
{
var _loc3_:Vec2 = null;
var _loc2_:Interval = new Interval();
for each(_loc3_ in param1)
{
_loc2_.includeValue(this.§-____--_-_-_-§(_loc3_,false));
}
return _loc2_;
}

MyEdge.prototype.§-_-_-____-___§(param1:Vec2, param2:Boolean = false) : Vec2
{
var _loc3_:Vec2 = this.project(param1,param2);
return !!_loc3_?Vec2.sub(_loc3_,param1):null;
}
*/

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
/*
MyEdge.prototype.§-____--_-_-_-§(param1:Vec2, param2:Boolean = false) : Number
{
if(my_number.isZeroOrOrigin(this.length))
{
return 0;
}
var _loc3_:Vec2 = Vec2.sub(param1,this.mStart);
var _loc4_:Vec2 = Vec2.sub(this.mEnd,this.mStart);
var _loc5_:Number = Vec2.dot(_loc3_,_loc4_) / this.distanceSquareFunc();
if(param2)
{
if(_loc5_ < 0)
{
return 0;
}
if(_loc5_ > 1)
{
return 1;
}
}
return _loc5_;
}
*/
MyEdge.prototype.enlarge_xx = function(param1)
{
    return this.mStart.distance(this.mEnd) * param1;
}

MyEdge.prototype.getSplitPosByRatio = function(param1)
{
    return this.mEnd.sub(this.mStart).mulBy(param1).add(this.mStart);
}

/*
MyEdge.prototype.§--______----§(param1:Number) : Number
{
return param1 / this.mStart.distance(this.mEnd);
}


*/

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

    //param2 = param2 || false;
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
/*
MyEdge.prototype.§-------____--§(param1:Vec2) : Vec2
{
var _loc2_:Number = Vec2.crossByPoint(this.mStart,this.mEnd,param1);
if(_loc2_ > 0)
{
return this.rotate_90_degree().normalize();
}
if(_loc2_ < 0)
{
return this.rotate_minus_90_degree().normalize();
}
return null;
}

MyEdge.prototype.§-____-_--_--§(param1:Number) : Vec2
{
return this.interpolate(param1 / this.length);
}

MyEdge.prototype.§-_-_-_-_____§(param1:Vec2, param2:Vec2) : int
{
return Vec2.crossByPoint(this.mStart,this.mEnd,param1) * Vec2.crossByPoint(this.mStart,this.mEnd,param2);
}
*/


MyEdge.prototype.translate = function(param1)
{
    return new MyEdge(Vec2.add(this.mStart,param1),Vec2.add(this.mEnd,param1));
}
/*
MyEdge.prototype.§-_----_---_--§(param1:Number) : my2D_Edge
{
return this.translate(this.rotate_minus_90_degree().normalize().mulBy(param1));
}

MyEdge.prototype.§---___--___-§(param1:Number) : my2D_Edge
{
return this.translate(this.rotate_90_degree().normalize().mulBy(param1));
}

MyEdge.prototype.§-_-___-_-_--§(param1:Vec2) : my2D_Edge
{
return this.§-_----_---_--§(this.distancePointToCurve(param1));
}
*/

MyEdge.prototype.reverse = function()
{
    var _loc1_ = this.mEnd;
    this.mEnd = this.mStart;
    this.mStart = _loc1_;
    return this;
}
/*
MyEdge.prototype.clamp(param1:my2D_Edge) : my2D_Edge
{
    var _loc2_:Number = NaN;
    var _loc3_:Number = NaN;
    if(param1.distanceSquareFunc() > this.distanceSquareFunc())
    {
        return param1.clone();
    }
    _loc2_ = this.§-____--_-_-_-§(param1.start);
    _loc3_ = this.§-____--_-_-_-§(param1.end);
    var _loc4_:Number = _loc3_ - _loc2_;
    var _loc5_:Number = Interval.clamp(_loc2_,0,1);
    var _loc6_:Number = _loc5_ + _loc4_;
    _loc6_ = Interval.clamp(_loc6_,0,1);
    _loc5_ = _loc6_ - _loc4_;
    return new my2D_Edge(this.interpolate(_loc5_),this.interpolate(_loc6_));
}
*/

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
/*
MyEdge.prototype.§---_--_----_-§(param1:my2D_Edge) : Boolean
{
return this.mStart.equals(param1.start) && this.mEnd.equals(param1.end) || this.mStart.equals(param1.end) && this.mEnd.equals(param1.end);
}

MyEdge.prototype.getXFromY(param1:Number) : Number
{
if(this.mStart.y == this.mEnd.y)
{
return NaN;
}
var _loc2_:Number = Math.min(this.start.y,this.end.y);
var _loc3_:Number = Math.max(this.start.y,this.end.y);
if(param1 < _loc3_ && param1 > _loc2_)
{
return this.mStart.x - (this.mStart.y - param1) * (this.mStart.x - this.mEnd.x) / (this.mStart.y - this.mEnd.y);
}
return NaN;
}

MyEdge.prototype.§-__-_--_-_§(param1:Number) : Number
{
if(this.mStart.x == this.mEnd.x)
{
return NaN;
}
var _loc2_:Number = Math.min(this.start.x,this.end.x);
var _loc3_:Number = Math.max(this.start.x,this.end.x);
if(param1 < _loc3_ && param1 > _loc2_)
{
return this.mStart.y - (this.mStart.x - param1) * (this.mStart.y - this.mEnd.y) / (this.mStart.x - this.mEnd.x);
}
return NaN;
}

MyEdge.prototype.§-___-_____§(param1:Number) : Number
{
if(this.mStart.y == this.mEnd.y)
{
return this.mStart.x;
}
return this.mStart.x - (this.mStart.y - param1) * (this.mStart.x - this.mEnd.x) / (this.mStart.y - this.mEnd.y);
}

MyEdge.prototype.§--_-_-__--__-§(param1:Number) : Number
{
if(this.mStart.x == this.mEnd.x)
{
return this.mStart.y;
}
return this.mStart.y - (this.mStart.x - param1) * (this.mStart.y - this.mEnd.y) / (this.mStart.x - this.mEnd.x);
}
*/
MyEdge.prototype.getCenter = function()
{
    return this.interpolate(0.5);
}

MyEdge.prototype.getVecEndMinusStart = function()
{
    return Vec2.sub(this.mEnd,this.mStart);
}
/*
MyEdge.prototype.§-_____________§() : Vec2
{
return this.mEnd.sub(this.mStart).normalize();
}
*/
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
/*
MyEdge.prototype.hashCode() : int
{
var _loc1_:int = 31;
_loc1_ = 37 * _loc1_ + this.mStart.hashCode();
_loc1_ = 37 * _loc1_ + this.mEnd.hashCode();
return _loc1_;
}

MyEdge.prototype.toString() : String
{
return "(Start:" + this.start + ", End:" + this.end + ")";
}

MyEdge.prototype.toJSON(param1:String) : Object
{
return {
"start":this.mStart,
"end":this.mEnd
};
}
*/
/*
MyEdge.prototype.get start() : Vec2
{
return this.mStart;
}

MyEdge.prototype.set start(param1:Vec2) : void
{
this.mStart = param1;
}

MyEdge.prototype.get end() : Vec2
{
return this.mEnd;
}

MyEdge.prototype.set end(param1:Vec2) : void
{
this.mEnd = param1;
}
*/
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
/*
MyEdge.prototype.get §-__-_--___--_§() : Number
{
return Math.atan2(this.mEnd.x - this.mStart.x,this.mEnd.y - this.mStart.y);
}
*/
