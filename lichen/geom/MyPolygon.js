function MyPolygon(param1) {
    if(param1 == null || param1 == undefined)
    {
        this.mVertices = [];
    }
    else
    {
        this.mVertices = param1.concat();
    }
    this.m_IsClockWise;
}


MyPolygon.TOLERENCE = 1.0E-6;
MyPolygon.const_ONE = 1;
MyPolygon.CONST_0_01 = 0.01;

MyPolygon.getX_Intersections1 = function(param1, param2, param3, param4)
{
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    
    var polygons = param1;
    var y = param2;
    var includeEnds = param3;
    var tolerance = param4;
    var intersections = [];
    for(var i = 0; i < polygons.length; i++)
    {
        ArrayHelperClass.ifHaveSameTheLaterOne(intersections,polygons[i].getX_Intersections1(y,includeEnds,tolerance));
    }
    intersections.sort(function(param1, param2)
    {
        return MyMath.sign(param1 - param2);
    });
    return intersections;
}

MyPolygon.isSamePixel = function(param1, param2)
{
    return param1.isClose(param2,1);
}

MyPolygon.getPolygonArea = function(param1)
{
    var _loc2_ = 0;
    var _loc3_ = param1.length;
    if(_loc3_ < 3)
    {
        return 0;
    }
    var _loc4_ = 0;
    var _loc5_ = 1;
    while(_loc4_ < _loc3_)
    {
        _loc2_ = _loc2_ + param1[_loc4_].mX * param1[_loc5_].mY - param1[_loc4_].mY * param1[_loc5_].mX;
        _loc4_++;
        _loc5_ = (_loc4_ + 1) % _loc3_;
    }
    return 0.5 * _loc2_;
}

MyPolygon.isDegenerate = function(param1)
{
    return MyPolygon.getPolygonArea(param1) == 0;
}

MyPolygon.isClockWise = function(param1)
{
    return MyPolygon.getPolygonArea(param1) < 0;
}

MyPolygon.isCountClockWise = function(param1)
{
    return MyPolygon.getPolygonArea(param1) > 0;
}

MyPolygon.prototype.isClockWise = function()
{
    this.m_IsClockWise = MyPolygon.getPolygonArea(this.mVertices) < 0;
    return this.m_IsClockWise;
}

MyPolygon.prototype.isDegenerate = function()
{
    return MyPolygon.getPolygonArea(this.mVertices) == 0;
}

MyPolygon.prototype.clear = function()
{
    this.mVertices = [];
    this.mVertices.length = 0;
}

MyPolygon.prototype.getSize = function()
{
    return this.mVertices.length;
}

MyPolygon.prototype.addVertex = function(param1)
{
    ArrayHelperClass.addItem(this.mVertices,param1);
    return this;
}

MyPolygon.prototype.addVertices = function(param1)
{
    ArrayHelperClass.addItems(this.mVertices,param1);
    return this;
}


MyPolygon.prototype.getBoundingBox = function()
{
    if(this.mVertices == null || this.getSize() == 0)
    {
        return null;
    }
    var _loc1_ = new MyRect();
    _loc1_.includeValues(this.mVertices);
    return _loc1_;
}
/*

*/

MyPolygon.prototype.getGravity = function()
{
    var _loc8_ = NaN;
    var _loc1_ = 0;
    var _loc2_ = 0;
    var _loc3_ = this.mVertices.concat();
    var _loc4_ = MyPolygon.getPolygonArea(_loc3_);
    var _loc5_ = _loc3_.length;
    if(_loc5_ < 3)
    {
        return new Vec2();
    }
    var _loc6_ = 0;
    var _loc7_ = 1;
    while(_loc6_ < _loc5_)
    {
        _loc8_ = _loc3_[_loc6_].mX * _loc3_[_loc7_].mY - _loc3_[_loc7_].mX * _loc3_[_loc6_].mY;
        _loc1_ = _loc1_ + (_loc3_[_loc6_].mX + _loc3_[_loc7_].mX) * _loc8_;
        _loc2_ = _loc2_ + (_loc3_[_loc6_].mY + _loc3_[_loc7_].mY) * _loc8_;
        _loc6_++;
        _loc7_ = (_loc6_ + 1) % _loc5_;
    }
    return new Vec2(_loc1_,_loc2_).mulBy(1 / (_loc4_ * 6));
}

MyPolygon.prototype.getPolyCenter = function()
{
    return edgePointHelperClass.getCenter(this.mVertices);
}

MyPolygon.prototype.getValidGravityCenter = function()
{
    var longestPart = null;
    var i = 0;
    var x = NaN;
    var interval = null;
    var gravity = this.getGravity();
    
    if(this.containsExclusive(gravity))
    {
        return gravity;
    }
    
    var intersects = [];
    var y = gravity.mY;
    
    var edges = this.getEdges();
    for(var j = 0; j < edges.length; j++){
        x = edges[j].getXFromY(y);
        if(!isNaN(x))
        {
            intersects.push(x);
        }
    }
    
    intersects.sort(function(param1, param2)
    {
        return MyMath.sign(param1 - param2);
    });
    
    longestPart = null;
    i = 0;
    while(i < intersects.length - 1)
    {
        if(intersects[i] != intersects[i + 1])
        {
            interval = new Interval(intersects[i],intersects[i + 1]);
            if(longestPart == null || interval.getLength() > longestPart.getLength())
            {
                longestPart = interval;
            }
        }
        i = i + 2;
    }
    if(longestPart == null)
    {
        return this.getPolyCenter();
    }
    return new Vec2(longestPart.getCenter(),gravity.mY);
}

MyPolygon.prototype.getX_Intersections1 = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 1.0E-6;
    }

    var start = null;
    var end = null;
    var xValue = NaN;
    var y = param1;
    var includeEnds = param2;
    var tolerance = param3;
    var points = this.mVertices;
    var pointSize = points.length;
    var intersections = [];
    var i = 0;
    while(i < pointSize)
    {
        start = points[i];
        end = points[(i + 1) % pointSize];
        xValue = MyEdge.getXFromY(start,end,y,includeEnds,tolerance);
        if(!isNaN(xValue))
        {
            ArrayHelperClass.ifHasAndSave(intersections,xValue);
        }
        i++;
    }
    intersections.sort(function(param1, param2)
    {
        return MyMath.sign(param1 - param2);
    });
    return intersections;
}

MyPolygon.prototype.getX_Intersections2 = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 1.0E-6;
    }
    var start = null;
    var end = null;
    var xValue = NaN;
    var y = param1;
    var includeEnds = param2;
    var tolerance = param3;
    var points = this.mVertices;
    var pointSize = points.length;
    var intersections = []; 
    var i = 0;
    while(i < pointSize)
    {
        start = points[i];
        end = points[(i + 1) % pointSize];
        xValue = MyEdge.getXFromY(start,end,y,includeEnds,tolerance);
        if(!isNaN(xValue))
        {
            ArrayHelperClass.ifHasAndSave(intersections,xValue);
        }
        i++;
    }
    intersections.sort(function(param1, param2)
    {
        return MyMath.sign(param1 - param2);
    });
    
    var j = intersections.length - 1;
    while(j - 1 >= 0)
    {
        if(MyNumber.isEqual(intersections[j],intersections[j - 1],0.0001))
        {
            ArrayHelperClass.removeItemAt(intersections,j);
        }
        j--;
    }
    return intersections;
}

MyPolygon.prototype.getSignedArea = function()
{
    return MyPolygon.getPolygonArea(this.mVertices);
}

MyPolygon.prototype.getEdges = function()
{
    var _loc4_ = 0;
    var _loc1_ = [];
    var _loc2_ = this.getSize();
    var _loc3_ = 0;
    while(_loc3_ < _loc2_)
    {
        _loc4_ = (_loc3_ + 1) % _loc2_;
        _loc1_.push(new MyEdge(this.mVertices[_loc3_],this.mVertices[_loc4_]));
        _loc3_++;
    }
    return _loc1_;
}

MyPolygon.prototype.polygonRemoveSame = function()
{
    edgePointHelperClass.removeSamePoint(this.mVertices, 1);
    return this;
}

MyPolygon.prototype.contains = function(param1)
{
    var _loc2_ = 0;
    var _loc3_ = 0;
    var _loc4_ = false;
    var _loc5_ = this.mVertices.length;
    _loc2_ = 0;
    _loc3_ = _loc5_ - 1;
    while(_loc2_ < _loc5_)
    {
        if( this.mVertices[_loc2_].mY > param1.mY != this.mVertices[_loc3_].mY > param1.mY && 
            param1.mX < (this.mVertices[_loc3_].mX - this.mVertices[_loc2_].mX) * (param1.mY - this.mVertices[_loc2_].mY) / (this.mVertices[_loc3_].mY - this.mVertices[_loc2_].mY) + this.mVertices[_loc2_].mX)
        {
            _loc4_ = !_loc4_;
        }
        _loc3_ = _loc2_++;
    }
    return _loc4_;
}

MyPolygon.prototype.containsInclusive = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    //param2 = param2 || 1.0E-6;
    var _loc5_ = 0;
    var _loc3_ = this.getSize();
    var _loc4_ = 0;
    while(_loc4_ < _loc3_)
    {
        _loc5_ = (_loc4_ + 1) % _loc3_;
        if(MyEdge.distanceSmallThan(this.mVertices[_loc4_],this.mVertices[_loc5_],param1,param2))
        {
            return true;
        }
        _loc4_++;
    }
    return this.contains(param1);
}

MyPolygon.prototype.containsExclusive = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    
    var _loc5_ = 0;
    var _loc3_ = this.getSize();
    var _loc4_ = 0;
    while(_loc4_ < _loc3_)
    {
        _loc5_ = (_loc4_ + 1) % _loc3_;
        if(MyEdge.distanceSmallThan(this.mVertices[_loc4_],this.mVertices[_loc5_],param1,param2))
        {
            return false;
        }
        _loc4_++;
    }
    return this.contains(param1);
}

MyPolygon.prototype.isIncludedPolygon = function(param1)
{
    var _loc2_ = null;
    var _loc3_ = 0;
    var _loc4_ = 0;
    var _loc5_ = 0;
    var _loc6_ = null;
    var _loc7_ = 0;
    var _loc8_ = null;
    for (var i = 0; i < param1.mVertices.length; i++)
    {
        if(!this.containsInclusive(param1.mVertices[i]))
        {
            return false;
        }
    }
    
    _loc3_ = param1.getSize();
    _loc4_ = this.getSize();
    _loc5_ = 0;
    while(_loc5_ < _loc3_)
    {
        _loc6_ = new MyEdge(param1.mVertices[_loc5_],param1.mVertices[(_loc5_ + 1) % _loc3_]);
        if(!this.containsInclusive(_loc6_.getCenter()))
        {
            return false;
        }
        _loc7_ = 0;
        while(_loc7_ < _loc4_)
        {
            _loc8_ = new MyEdge(this.mVertices[_loc7_],this.mVertices[(_loc7_ + 1) % _loc4_]);
            if(LineRelationHelper.isInterSect(_loc6_,_loc8_,false))
            {
                return false;
            }
            _loc7_++;
        }
        _loc5_++;
    }
    return true;
}

MyPolygon.prototype.isIntersected = function(param1)
{
    var _loc7_ = null;
    var _loc8_ = 0;
    var _loc9_ = null;
    var _loc2_ = this.getBoundingBox();
    var _loc3_ = param1.getBoundingBox();
    if(_loc2_ == null || _loc3_ == null || !_loc2_.isIntersected(_loc3_))
    {
        return false;
    }
    if(this.containsInclusive(param1.vertices[0]) || param1.containsInclusive(this.vertices[0]))
    {
        return true;
    }
    var _loc4_ = this.getSize();
    var _loc5_ = param1.getSize();
    var _loc6_ = 0;
    while(_loc6_ < _loc4_)
    {
        _loc7_ = new MyEdge(this.mVertices[_loc6_],this.mVertices[(_loc6_ + 1) % _loc4_]);
        _loc8_ = 0;
        while(_loc8_ < _loc5_)
        {
            _loc9_ = new MyEdge(param1.vertices[_loc8_],param1.vertices[(_loc8_ + 1) % _loc5_]);
            if(_loc7_.length != 0 && _loc9_.length != 0 && LineRelationHelper.isIntersectedInHelper(_loc7_,_loc9_,true, 0.01))
            {
                return true;
            }
            _loc8_++;
        }
        _loc6_++;
    }
    return false;
}

MyPolygon.prototype.clone = function()
{
    var _loc2_ = null;
    var _loc1_ = new MyPolygon();
    for(var i = 0; i < this.mVertices.length; i++)
    {
        _loc1_.addVertex(this.mVertices[i].clone());
    }
    return _loc1_;
}

MyPolygon.prototype.equals = function(param1)
{
    var _loc6_ = 0;
    var _loc7_ = 0;
    var _loc2_ = this.getSize();
    var _loc3_ = param1.getSize();
    var _loc4_ = this.vertices;
    var _loc5_ = param1.vertices;
    if(_loc2_ != _loc3_)
    {
        return false;
    }
    var _loc8_ = -1;
    var _loc9_ = -1;
    _loc6_ = 0;
    while(_loc6_ < _loc2_)
    {
        _loc7_ = 0;
        while(_loc7_ < _loc3_)
        {
            if(MyPolygon.isSamePixel(_loc4_[_loc6_],_loc5_[_loc7_]))
            {
                _loc8_ = _loc6_;
                _loc9_ = _loc7_;
                break;
            }
            _loc7_++;
        }
        _loc6_++;
    }
    if(_loc8_ < 0 || _loc9_ < 0)
    {
        return false;
    }
    _loc6_ = (_loc8_ + 1) % _loc2_;
    _loc7_ = (_loc9_ + 1) % _loc3_;
    while(!(_loc6_ == _loc8_ || _loc7_ == _loc9_))
    {
        if(!MyPolygon.isSamePixel(_loc4_[_loc6_],_loc5_[_loc7_]))
        {
            return false;
        }
        _loc6_ = (_loc6_ + 1) % _loc2_;
        _loc7_ = (_loc7_ + 1) % _loc3_;
    }
    return true;
}

MyPolygon.prototype.move = function(param1)
{
    var _loc4_ = null;
    var _loc2_ = this.getPolyCenter();
    var _loc3_ = Vec2.sub(param1,_loc2_);
    for(var i = 0; i < this.mVertices.length; i++)
    {
        this.mVertices[i].add(_loc3_);
    }
}

MyPolygon.prototype.translate = function(param1)
{
    var _loc2_ = null;
    for(var i = 0; i < this.mVertices.length; i++)
    {
        this.mVertices[i].add(param1);
    }
}

MyPolygon.prototype.rotate = function(param1, param2)
{
    param2 = param2 || null;
    var _loc4_ = null;
    var _loc3_ = !!param2 ? param2:this.getPolyCenter();
    for(var i = 0; i < this.mVertices.length; i++)
    {
        this.mVertices[i].rotateBy(param1,_loc3_);
    }
}

MyPolygon.prototype.getVertices = function()
{
    return this.mVertices;
}

