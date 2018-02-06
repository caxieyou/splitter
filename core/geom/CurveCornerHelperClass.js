function curveCornerHelperClass(param1) {
    this.mMap1 = null;
    this.mMap2 = new MyMap();
    
    for (var i = 0; i < param1.length; i++)
    {
        this.addSection(param1[i]);
    }
         
}
curveCornerHelperClass.CONST_STRING_ARROW = ">>";

curveCornerHelperClass.prototype.addCorner = function(param1)
{
    if(!this.mMap2.hasKey(param1))
    {
        this.mMap2.add(param1, []);
    }
}
      
curveCornerHelperClass.prototype.getCurvesByCorner = function(param1)
{
    return this.mMap2.itemFor(param1);
}

curveCornerHelperClass.prototype.addSection = function(param1)
{
    var _loc2_ = param1.mStart;
    var _loc3_ = param1.mEnd;
    this.addCorner(_loc2_);
    this.addCorner(_loc3_);
    ArrayHelperClass.ifHasAndSave(this.getCurvesByCorner(_loc2_),param1);
    ArrayHelperClass.ifHasAndSave(this.getCurvesByCorner(_loc3_),param1);
}

curveCornerHelperClass.prototype.orderCurves = function(param1)
{
    var angle = NaN;
    
    var approxPoints = null;
    var _reverse = false;
    var corner = param1;
    var connections = this.getCurvesByCorner(corner);
    var ordered = [];
    
    for (var i = 0; i < connections.length; i++)
    //for (connection in connections)
    {
        var curve = connections[i];
        _reverse = curve.mStart != corner;
        approxPoints = curve.switchOrder(_reverse);
        if(approxPoints.length < 2 || approxPoints[0] == null || approxPoints[1] == null)
        {
            console.error("Curve approxPoints illegal. curve mId:{0}",[curve.mId]);
        }
        else
        {
            angle = Vec2.getAngleByTan(approxPoints[0],approxPoints[1]);
            ordered.push({
            "curve":curve,
            "angle":angle
            });
        }
    }
    ordered.sort(function(param1, param2)
    {
        return MyMath.sign(param2.angle - param1.angle);
    });
    connections = [];
    for (var i = 0; i < ordered.length; i++)
    {
        connections.push(ordered[i].curve);
    }
    
    this.mMap2.replaceFor(corner, connections);
}
      
      
curveCornerHelperClass.prototype.getRightOrder = function()
{
    var _loc1_ = null;
    var _loc2_ = this.mMap2.keysToArray();
    for (var i = 0; i < _loc2_.length; i++)
    {
        _loc1_ = _loc2_[i];
        this.orderCurves(_loc1_);
    }
    this.mMap1 = new MyMap();
}
      
curveCornerHelperClass.prototype.addOne_to_map = function(param1, param2)
{
    var _loc3_ = param1.mId + curveCornerHelperClass.CONST_STRING_ARROW + param2.mId;
    this.mMap1.add(_loc3_,true);
}
      
curveCornerHelperClass.prototype.getPathByCornerCurve = function(param1, param2, param3)
{
    if(this.containsCurve1AndCurve2(param1,param2))
    {
        return;
    }
    param3.addSection(param2);
    this.addOne_to_map(param1,param2);
    var _loc4_ = param2.getStartOrEndOrNull(param1);
    var _loc5_ = this.getCurvesByCorner(_loc4_);
    var _loc6_ = _loc5_.indexOf(param2);
    var _loc7_ = (_loc6_ + 1) % _loc5_.length;
    var _loc8_ = _loc5_[_loc7_];
    this.getPathByCornerCurve(_loc4_,_loc8_,param3);
}
      
curveCornerHelperClass.prototype.clearMap_1 = function()
{
    this.mMap1 = null;
}

curveCornerHelperClass.prototype.containsCurve1AndCurve2 = function(param1, param2)
{
    var _loc3_ = param1.mId + curveCornerHelperClass.CONST_STRING_ARROW + param2.mId;
    return this.mMap1.hasKey(_loc3_);
} 
      
curveCornerHelperClass.prototype.getPaths_eh = function()
{
    var _loc4_ = null;
    var _loc5_ = null;
    var _loc6_ = null;
    this.getRightOrder();
    var _loc1_ = null;
    var _loc2_ = [];

    var _loc3_ = this.mMap2.keysToArray();

    for (var i = 0; i < _loc3_.length; i++)
    {
        
        _loc1_ = _loc3_[i];
        _loc4_ = this.getCurvesByCorner(_loc1_);
        for (var j = 0; j < _loc4_.length; j++)
        //for(_loc5_ in _loc4_)
        {
            _loc6_ = new MyPath();
            _loc6_.mStart = _loc1_;
            this.getPathByCornerCurve(_loc1_,_loc4_[j],_loc6_);
            if(_loc6_.getSize() > 1)
            {
                _loc6_.buildCurveAndCorner();
                _loc2_.push(_loc6_);
            }
        }
    }
    this.clearMap_1();
    return _loc2_;
}
