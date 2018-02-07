function AuxiliarySort(param1) {
    this.mMap1 = null;
    this.mMap2 = new Map();
    
    for (var i = 0; i < param1.length; i++)
    {
        this.addElement(param1[i]);
    }
         
}
AuxiliarySort.CONST_STRING_ARROW = ">>";

AuxiliarySort.prototype.addCorner = function(param1)
{
    if(!this.mMap2.hasKey(param1))
    {
        this.mMap2.add(param1, []);
    }
}
      
AuxiliarySort.prototype.getElementsByCorner = function(param1)
{
    return this.mMap2.itemFor(param1);
}

AuxiliarySort.prototype.addElement = function(param1)
{
    var _loc2_ = param1.mStart;
    var _loc3_ = param1.mEnd;
    this.addCorner(_loc2_);
    this.addCorner(_loc3_);
    MyArray.ifHasAndSave(this.getElementsByCorner(_loc2_),param1);
    MyArray.ifHasAndSave(this.getElementsByCorner(_loc3_),param1);
}

AuxiliarySort.prototype.sortElements = function(param1)
{
    var angle = NaN;
    
    var approxPoints = null;
    var _reverse = false;
    var corner = param1;
    var connections = this.getElementsByCorner(corner);
    var ordered = [];
    
    for (var i = 0; i < connections.length; i++)
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
      
      
AuxiliarySort.prototype.getRightOrder = function()
{
    var _loc1_ = null;
    var _loc2_ = this.mMap2.keysToArray();
    for (var i = 0; i < _loc2_.length; i++)
    {
        _loc1_ = _loc2_[i];
        this.sortElements(_loc1_);
    }
    this.mMap1 = new Map();
}
      
AuxiliarySort.prototype.addToMap1 = function(param1, param2)
{
    var _loc3_ = param1.mId + AuxiliarySort.CONST_STRING_ARROW + param2.mId;
    this.mMap1.add(_loc3_,true);
}
      
AuxiliarySort.prototype.getPathByCornerCurve = function(param1, param2, param3)
{
    if(this.containsCurve1AndCurve2(param1,param2))
    {
        return;
    }
    param3.addElement(param2);
    this.addToMap1(param1,param2);
    var _loc4_ = param2.getStartOrEndOrNull(param1);
    var _loc5_ = this.getElementsByCorner(_loc4_);
    var _loc6_ = _loc5_.indexOf(param2);
    var _loc7_ = (_loc6_ + 1) % _loc5_.length;
    var _loc8_ = _loc5_[_loc7_];
    this.getPathByCornerCurve(_loc4_,_loc8_,param3);
}
      
AuxiliarySort.prototype.clearMap1 = function()
{
    this.mMap1 = null;
}

AuxiliarySort.prototype.containsCurve1AndCurve2 = function(param1, param2)
{
    var _loc3_ = param1.mId + AuxiliarySort.CONST_STRING_ARROW + param2.mId;
    return this.mMap1.hasKey(_loc3_);
} 
      
AuxiliarySort.prototype.getPaths = function()
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
        _loc4_ = this.getElementsByCorner(_loc1_);
        for (var j = 0; j < _loc4_.length; j++)
        {
            _loc6_ = new Path();
            _loc6_.mStart = _loc1_;
            this.getPathByCornerCurve(_loc1_,_loc4_[j],_loc6_);
            if(_loc6_.getSize() > 1)
            {
                _loc6_.buildCurveAndCorner();
                _loc2_.push(_loc6_);
            }
        }
    }
    this.clearMap1();
    return _loc2_;
}
