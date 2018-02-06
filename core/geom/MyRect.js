function MyRect(param1, param2) {
    this.mMin;
    this.mMax;
    if(param1 == null || param2 == null || param1 == undefined || param2 == undefined)
    {
        this.invalidate();
    }
    else
    {
        var left    = Math.min(param1.mX, param2.mX);
        var right   = Math.max(param1.mX, param2.mX);
        var top     = Math.min(param1.mY, param2.mY);
        var bottom  = Math.max(param1.mY, param2.mY);
    
        this.mMax = new Vec2(left, top);
        this.mMin = new Vec2(right, bottom);
    }
}

MyRect.THRESHOLD = 1.0E-6;

MyRect.MAX = function() {
    return new MyRect(Vec2.MINVALUE(),Vec2.MAXVALUE());
};

MyRect.includeintomyrange = function(param1)
{
    var rect = new MyRect();
    rect.includeValues(param1);
    return rect;
};

MyRect.setRange = function(param1, param2)
{
    var rect = new MyRect(Vec2.min(param1,param2),Vec2.max(param1,param2));
    return rect;
};

MyRect.prototype.invalidate = function()
{
    this.mMin = Vec2.MAXVALUE();
    this.mMax = Vec2.MINVALUE();
    return this;
}

MyRect.prototype.includeValue = function(param1)
{
    this.mMin = Vec2.min(this.mMin,param1);
    this.mMax = Vec2.max(this.mMax,param1);
    return this;
}

MyRect.prototype.includeValues = function(param1)
{
    for (var i = 0; i < param1.length; i++) {
        this.includeValue(param1[i]);
    }
    return this;
}


MyRect.prototype.containsPoint = function(param1)
{
    return param1.mX >= this.mMin.mX && 
           param1.mX <= this.mMax.mX && 
           param1.mY >= this.mMin.mY && 
           param1.mY <= this.mMax.mY;
};

MyRect.prototype.containsBoundingBox = function(param1)
{
    return  param1.min.mX >= this.mMin.mX && 
            param1.min.mX <= this.mMax.mX && 
            param1.min.mY >= this.mMin.mY && 
            param1.min.mY <= this.mMax.mY && 
            param1.max.mX >= this.mMin.mX && 
            param1.max.mX <= this.mMax.mX && 
            param1.max.mY >= this.mMin.mY && 
            param1.max.mY <= this.mMax.mY;
}

MyRect.prototype.clamp = function(param1)
{
    return new Vec2(MyMath.clamp(param1.mX,this.mMin.mX,this.mMax.mX),
                    MyMath.clamp(param1.mY,this.mMin.mY,this.mMax.mY));
}

MyRect.prototype.getWidthRange = function()
{
    return new Interval(this.mMin.mX,this.mMax.mX);
}

MyRect.prototype.getHeightRange = function()
{
    return new Interval(this.mMin.mY,this.mMax.mY);
}


MyRect.prototype.isValid = function()
{
    return this.mMin.mX <= this.mMax.mX && this.mMin.mY <= this.mMax.mY;
}

MyRect.prototype.isIntersected = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    
    return this.intersect_sub(param1,param2);
}

MyRect.prototype.intersect_sub = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6;
    }
    
    if(param1.min.mX > this.mMax.mX + param2 || param1.max.mX + param2 < this.mMin.mX)
    {
        return false;
    }
    if(param1.min.mY > this.mMax.mY + param2 || param1.max.mY + param2 < this.mMin.mY)
    {
        return false;
    }
    return true;
}

MyRect.prototype. getIntersection = function(param1)
{
    var loc2 = new Vec2();
    var loc3 = new Vec2();
    loc2.mX = Math.max(this.mMin.mX,param1.mMin.mX);
    loc2.mY = Math.max(this.mMin.mY,param1.mMin.mY);
    loc3.mX = Math.min(this.mMax.mX,param1.mMax.mX);
    loc3.mY = Math.min(this.mMax.mY,param1.mMax.mY);
    return new myRect(loc2,loc3);
}

MyRect.prototype.getClosestPoint = function(param1)
{
    return Vec2.min(Vec2.max(this.mMin,param1),this.mMax);
}
//getExtent

MyRect.prototype.getRange = function()
{
    return this.mMax.sub(this.mMin);
}

MyRect.prototype.getArea = function()
{
    var loc1 = this.getRange();
    return loc1.mX * loc1.mY;
}

MyRect.prototype.getCenter = function()
{
    return Vec2.add(this.mMin,this.mMax).mulBy(0.5);
}

MyRect.prototype.getPoints = function()
{
    var loc1 = [];
    loc1.push(new Vec2(this.mMin.mX,this.mMin.mY));
    loc1.push(new Vec2(this.mMax.mX,this.mMin.mY));
    loc1.push(new Vec2(this.mMax.mX,this.mMax.mY));
    loc1.push(new Vec2(this.mMin.mX,this.mMax.mY));
    return loc1;
}

MyRect.prototype.getEdges = function()
{
    var loc1 = this.getPoints();
    loc2 = [];
    loc2.push(new Edge(loc1[0], loc1[1]));
    loc2.push(new Edge(loc1[1], loc1[2]));
    loc2.push(new Edge(loc1[2], loc1[3]));
    loc2.push(new Edge(loc1[3], loc1[0]));
    return loc2;
}
MyRect.prototype.toMyPolygon = function()
{
    return new MyPolygon(this.getPoints());
}


MyRect.prototype.clone = function()
{
    return new myRect(this.mMin.clone(),this.mMax.clone());
}
