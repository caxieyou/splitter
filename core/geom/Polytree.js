function Polytree(param1, param2) {
    this.mOutLines = param1;
    this.mHoles = param2;
};

Polytree.TOLERENCE = 1.0E-4;

Polytree.getX_Intersections1 = function(param1, param2, param3, param4)
{
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-4;
    }

    var polygons = param1;
    var y = param2;
    var includeEnds = param3;
    var tolerance = param4;
    var intersections = [];
    for(var i = 0; i < polygons.length; i++)
    {
        intersections = intersections.concat(polygons[i].getX_Intersections2(y,includeEnds,tolerance));
    }
    intersections.sort(function(param1, param2)
    {
        return MyMath.sign(param1 - param2);
    });
    //if (intersections.length === 0) {
    //    debugger;
    //}
    return intersections;
}



Polytree.prototype.containsHole = function()
{
    return this.mHoles != null && this.mHoles.length != 0;
}

Polytree.prototype.contains = function(param1)
{
    var _loc2_ = null;
    if(!this.mOutLines.contains(param1))
    {
        return false;
    }
    if(this.containsHole())
    {
        for (var i = 0; i < this.mHoles.length; i++) {
            if(this.mHoles[i].contains(param1))
            {
                return false;
            }
        }
    }
    return true;
}

Polytree.prototype.containsInclusive = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-4;
    }
    
    if(!this.mOutLines.containsInclusive(param1,param2))
    {
        return false;
    }
    if(this.containsHole())
    {
        for (var i = 0; i < this.mHoles.length; i++) {
            if(this.mHoles[i].containsExclusive(param1,param2))
            {
                return false;
            }
        }
    }
    return true;
}

Polytree.prototype.containsExclusive = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-4;
    }
    
    var _loc3_ = null;
    if(!this.mOutLines.containsExclusive(param1,param2))
    {
        return false;
    }
    if(this.containsHole())
    {
        for (var i = 0; i < this.mHoles.length; i++)
        {
            if(this.mHoles[i].containsInclusive(param1,param2))
            {
                return false;
            }
        }
    }
    return true;
}

Polytree.prototype.getValidGravityCenter = function()
{

    var xIntersections;
    var intersectionsIntervals;
    var i = 0;
    var intervalPart = null;
    var interval = null;
    
    var result = null;
    var centriod = this.mOutLines.getValidGravityCenter();
    
    if(this.containsExclusive(centriod,0.01))
    {
        return centriod;
    }
    
    var y = centriod.mY;
    var tempPoly = [];
    tempPoly = tempPoly.concat(this.mHoles);
    tempPoly = tempPoly.concat(this.mOutLines);
    
    var yInterval = this.getBoundingBox().getHeightRange();
    var yVector   = [y,(y + yInterval.mMax) * 0.5,(y + yInterval.mMin) * 0.5];
    
    for(var j = 0; j < yVector.length; j++) {
        xIntersections = Polytree.getX_Intersections1(tempPoly,yVector[j],true, Polytree.TOLERENCE);
        if(xIntersections.length < 2 || isNaN(xIntersections[0]) || isNaN(xIntersections[1]))
        {
            //console.error("xIntersections error!");
        }
        else
        {
            intersectionsIntervals = [];
            i = 0;
            while(i < xIntersections.length - 1)
            {
                if(!MyNumber.isEqual(xIntersections[i],xIntersections[i + 1]))
                {
                    interval = new Interval(xIntersections[i],xIntersections[i + 1]);
                    interval && intersectionsIntervals.push(interval);
                }
                i = i + 2;
            }
            intersectionsIntervals.sort(function(param1, param2)
            {
                return param2.getLength() - param1.getLength();
            });
            for(var m = 0; m < intersectionsIntervals.length; m++) {
                result = new Vec2(intersectionsIntervals[m].getCenter(),yVector[j]);
                if(this.containsExclusive(result))
                {
                    return result;
                }
            }
        }
    }
    return centriod;
}

Polytree.prototype.getProfilePoints = function()
{
    var _loc2_ = null;
    var _loc1_ = [];
    if(this.mOutLines == null)
    {
        return _loc1_;
    }
    _loc1_ = _loc1_.concat(this.mOutLines.vertices);
    
    if(this.containsHole())
    {
        for(var i = 0; i < this.mHoles.length; i++)
        {
            _loc1_ = _loc1_.concat(this.mHoles[i].vertices);
        }
    }
    return _loc1_;
}

Polytree.prototype.getProfile = function()
{
    var _loc2_ = null;
    var _loc1_ = [];
    if(this.mOutLines == null)
    {
        return _loc1_;
    }
    _loc1_ = _loc1_.concat(this.mOutLines.getEdges());
    if(this.containsHole())
    {
        for(var i = 0; i < this.mHoles.length; i++) {
            _loc1_ = _loc1_.concat(this.mHoles[i].getEdges());
        }
    }
    return _loc1_;
}

Polytree.prototype.getVertices = function()
{
    var _loc2_ = null;
    var _loc1_ = [];
    if(this.mOutLines == null)
    {
        return _loc1_;
    }
    _loc1_ = _loc1_.concat(this.mOutLines.mVertices);
    
    if(this.containsHole())
    {
        for(var i = 0; i < this.mHoles.length; i++) {
            _loc1_ = _loc1_.concat(this.mHoles[i].mVertices);
        }
    }
    return _loc1_;
}

Polytree.prototype.getBoundingBox = function()
{
    return this.mOutLines.getBoundingBox();
}

Polytree.prototype.getOutline = function()
{
    return this.mOutLines;
}
