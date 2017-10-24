function MyPolytree(param1, param2) {
    this.mOutLines = param1;
    this.mHoles = param2;
};

MyPolytree.TOLERENCE = 1.0E-4;

MyPolytree.getX_Intersections1 = function(param1, param2, param3, param4)
{
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-4;
    }

    //param4 = param4 || 1.0E-4;
    //var polygon:my_polygon = null;
    var polygons = param1;
    var y = param2;
    var includeEnds = param3;
    var tolerance = param4;
    var intersections = [];//:Vector.<Number> = new Vector.<Number>();
    for(var i = 0; i < polygons.length; i++)
    {
        intersections = intersections.concat(polygons[i].getX_Intersections2(y,includeEnds,tolerance));
        //ArrayHelperClass.addItems(intersections,polygons[i].getX_Intersections2(y,includeEnds,tolerance));
    }
    intersections.sort(function(param1, param2)
    {
        return MyMath.sign(param1 - param2);
    });
    if (intersections.length === 0) {
        debugger;
    }
    return intersections;
}



MyPolytree.prototype.containsHole = function()
{
    return this.mHoles != null && this.mHoles.length != 0;
}

MyPolytree.prototype.contains = function(param1)
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


/*
MyPolytree.prototype.§-----_-__-_--§(param1:my_polygon) : Boolean
{
var _loc2_:my_polygon = null;
if(!this.mOutLines.isIntersected(param1))
{
return false;
}
if(this.containsHole())
{
for each(_loc2_ in this.mHoles)
{
if(_loc2_.isIncludedPolygon(param1))
{
return false;
}
}
}
return true;
}
*/


MyPolytree.prototype.containsInclusive = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-4;
    }
    //param2 = param2 || 1.0E-4;
    //var _loc3_:my_polygon = null;
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

MyPolytree.prototype.containsExclusive = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-4;
    }
    //param2 = param2 || 1.0E-4;
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

MyPolytree.prototype.getValidGravityCenter = function()
{
    //var yValue:Number = NaN;
    var xIntersections;//:Vector.<Number> = null;
    var intersectionsIntervals;//:Vector.<Interval> = null;
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
    var tempPoly = [];//:Vector.<my_polygon> = new Vector.<my_polygon>();
    tempPoly = tempPoly.concat(this.mHoles);
    tempPoly = tempPoly.concat(this.mOutLines);
    //ArrayHelperClass.addItems(tempPoly,this.mHoles);
    //ArrayHelperClass.addItem(tempPoly,this.mOutLines);
    var yInterval = this.getBoundingBox().getHeightRange();
    var yVector   = [y,(y + yInterval.mMax) * 0.5,(y + yInterval.mMin) * 0.5];
    
    for(var j = 0; j < yVector.length; j++) {
        xIntersections = MyPolytree.getX_Intersections1(tempPoly,yVector[j],true, MyPolytree.TOLERENCE);
        if(xIntersections.length < 2 || isNaN(xIntersections[0]) || isNaN(xIntersections[1]))
        {
            console.error("xIntersections error!");
        }
        else
        {
            intersectionsIntervals = [];//new Vector.<Interval>();
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
//////////////////////////////////////////////////////////////////////////////////////

MyPolytree.prototype.getProfilePoints = function()
{
    var _loc2_ = null;
    var _loc1_ = [];//:Vector.<Vec2> = new Vector.<Vec2>();
    if(this.mOutLines == null)
    {
        return _loc1_;
    }
    _loc1_ = _loc1_.concat(this.mOutLines.vertices);
    //ArrayHelperClass.addItems(_loc1_,this.mOutLines.vertices);
    if(this.containsHole())
    {
        for(var i = 0; i < this.mHoles.length; i++)// each(_loc2_ in this.mHoles)
        {
            _loc1_ = _loc1_.concat(this.mHoles[i].vertices);
            //ArrayHelperClass.addItems(_loc1_,_loc2_.vertices);
        }
    }
    return _loc1_;
}

MyPolytree.prototype.getProfile = function()
{
    var _loc2_ = null;
    var _loc1_ = [];//:Vector.<my2D_Edge> = new Vector.<my2D_Edge>();
    if(this.mOutLines == null)
    {
        return _loc1_;
    }
    _loc1_ = _loc1_.concat(this.mOutLines.getEdges());
    //ArrayHelperClass.addItems = function(_loc1_,this.mOutLines.getEdges());
    if(this.containsHole())
    {
        for(var i = 0; i < this.mHoles.length; i++) {
            _loc1_ = _loc1_.concat(this.mHoles[i].getEdges());
        }
    }
    return _loc1_;
}

MyPolytree.prototype.getVertices = function()
{
    var _loc2_ = null;
    var _loc1_ = [];//:Vector.<my2D_Edge> = new Vector.<my2D_Edge>();
    if(this.mOutLines == null)
    {
        return _loc1_;
    }
    _loc1_ = _loc1_.concat(this.mOutLines.mVertices);
    //ArrayHelperClass.addItems = function(_loc1_,this.mOutLines.getEdges());
    if(this.containsHole())
    {
        for(var i = 0; i < this.mHoles.length; i++) {
            _loc1_ = _loc1_.concat(this.mHoles[i].mVertices);
        }
    }
    return _loc1_;
}
/*
MyPolytree.prototype.§-_____--_____§ = function() : Number
{
var _loc2_:my_polygon = null;
if(this.mOutLines == null)
{
return 0;
}
var _loc1_:Number = this.mOutLines.§-_____--_____§();
if(this.containsHole())
{
for each(_loc2_ in this.mHoles)
{
_loc1_ = _loc1_ - _loc2_.getSize();
}
}
return _loc1_;
}
*/
MyPolytree.prototype.getBoundingBox = function()
{
    return this.mOutLines.getBoundingBox();
}

MyPolytree.prototype.getOutline = function()
{
    return this.mOutLines;
}
/*
MyPolytree.prototype.set outline = function(param1:my_polygon) : void
{
this.mOutLines = param1;
}

MyPolytree.prototype.get holes = function() : Vector.<my_polygon>
{
return this.mHoles;
}

MyPolytree.prototype.set holes = function(param1:Vector.<my_polygon>) : void
{
this.mHoles = param1;
}
*/
