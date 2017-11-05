function SegmentController(param1, param2) {
    if (param1 == null || param1 == undefined) {
        param1 = null;
    }
    if (param2 == null || param2 == undefined) {
        param2 = false;
    }
    //param1 = param1 || null;
    
    this.mStart = new MyCorner(param1);
    this.mEnd = new MyCorner(param1);
    this.mAreas = [];
    this.mWall = param1;
    //this.initialize();
    this.mId = ID.assignUniqueId();
    this.isBoundry = param2;
}

SegmentController.prototype.wallDleleteSame = function(param1)
{
    return ArrayHelperClass.removeItem(this.mAreas,param1);
}

SegmentController.createSegmentByMyEdge = function(param1)
{
    var _loc2_ = null;
    var _loc3_ = new SegmentController();
    _loc2_ = new MyCorner();
    _loc2_.mPosition = param1.mStart;
    //_loc3_.m_Start = _loc2_;
    _loc3_.updateStartCorner(_loc2_);
    _loc2_ = new MyCorner();
    _loc2_.mPosition = param1.mEnd;
    //_loc3_.m_End = _loc2_;
    _loc3_.updateEndCorner(_loc2_);
    return _loc3_;
}
/*
      public static function createSegmentByMyEdge(param1:my2D_Edge) : wallcurveSon
      {
         var _loc2_:cornerSonClass = null;
         var _loc3_:wallcurveSon = new wallcurveSon();
         _loc2_ = new cornerSonClass();
         _loc2_.position = param1.start;
         //_loc3_.m_Start = _loc2_;
         _loc3_.updateStartCorner(_loc2_);
         _loc2_ = new cornerSonClass();
         _loc2_.position = param1.end;
         //_loc3_.m_End = _loc2_;
         _loc3_.updateEndCorner(_loc2_);
         return _loc3_;
      }
      
      SegmentController.prototype.updateInfo(param1:cornerSonClass) : wallCurve
      {
         var _loc2_:wallcurveSon = new wallcurveSon();
         _loc2_.m_Start = param1;
         _loc2_.m_End = m_End;
         m_End = param1;
         _loc2_.cloneProperties(this);
         §-___--__-___-_§();
         invalidate();
         wall.addONE_PART(_loc2_);
         return _loc2_;
      }
*/

SegmentController.intersectSub = function(param1, param2, param3, param4, param5)
{
    if (param3 == null || param3 == undefined) {
        param3 = null;
    }
    if (param4 == null || param4 == undefined) {
        param4 = false;
    }
    if (param5 == null || param5 == undefined) {
        param5 = 1.0E-6;
    }
    var _loc5_ = param2;
    var _loc6_ = null;
    if(lineRelationHelper.isInterSect(_loc5_,param1,param4,param5))
    {
        if(param3 != null)
        {
            _loc6_ = lineRelationHelper.isInterSectAndGetPoint(_loc5_,param1);
            if(_loc6_ != null)
            {
                param3.push(_loc6_);
            }
        }
        return true;
    }
    return false;
}

SegmentController.prototype.isStart = function(param1)
{
    return this.mStart == param1;//§-_____-_-_--_§.isEqual(this.mm_start,param1);
}

SegmentController.prototype.isEnd = function(param1)
{
    return this.mEnd == param1;//§-_____-_-_--_§.isEqual(this.mm_end,param1);
}


SegmentController.prototype.getStartOrEndOrNull = function(param1)
{
    if(param1 == this.mStart)
    {
        return this.mEnd;
    }
    if(param1 == this.mEnd)
    {
        return this.mStart;
    }
    return null;
}

SegmentController.prototype.updateInfo = function(param1)
{
    var _loc2_ = new SegmentController();
    //_loc2_.mStart = param1;
    //_loc2_.mEnd = this.mEnd;
    //this.mEnd = param1;
    
    _loc2_.updateStartCorner(param1);
    _loc2_.updateEndCorner(this.mEnd);
    this.updateEndCorner(param1);
    //this.mEnd = param1;
    
    
    //先不要考虑这个
    //_loc2_.cloneProperties(this);
    //§-___--__-___-_§();
    //invalidate();
    this.mWall.addONE_PART(_loc2_);
    return _loc2_;
}
      
SegmentController.prototype.getTheStartEndEdge = function()
{
    return new MyEdge(this.mStart.mPosition,this.mEnd.mPosition);
}

SegmentController.prototype.isStartOrEnd = function(param1)
{
    return param1 == this.mStart || param1 == this.mEnd;
}

SegmentController.prototype.toCorners = function(param1)
{
    return [this.mStart, this.mEnd];
}
      
SegmentController.prototype.setCornerStartAndEndButHasToBeSame = function(param1, param2)
{
    if(param1 == this.mStart)
    {
        this.updateStartCorner(param2);
        //this.mStart = param2;
    }
    if(param1 == this.mEnd)
    {
        this.updateEndCorner(param2);
        //this.mEnd = param2;
    }
}
      
SegmentController.prototype.containsPoint = function(param1)
{
    return this.getTheStartEndEdge().pointInEdgeOrOnEdge(param1);
}

SegmentController.prototype.isValidAngleDiff = function(param1)
{
    return MyEdge.isValidAngleDiff(param1.getTheStartEndEdge(),this.getTheStartEndEdge());
}

SegmentController.prototype.isInsideMyArea = function(param1, param2, param3)
{
    if (param2 == null || param2 == undefined) {
        param2 = false;
    }

    if (param3 == null || param3 == undefined) {
        param3 = 1.0E-6;
    }

    //param2 = param2 || false;
    //param3 = param3 || 1.0E-6;
    if(param2)
    {
        return this.getTheStartEndEdge().distanceSmallThan(param1,param3);
    }
    return this.getTheStartEndEdge().pointInEdgeOrOnEdge(param1,param3);
}

SegmentController.prototype.getTheCurveStartEndEdgeToPointDistance = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = true;
    }
    //param2 = param2 || true;
    return this.getTheStartEndEdge().getDistance(param1,param2);
}


SegmentController.prototype.updateStartCorner = function(param1) {
    if(this.mStart != null)
    {
        this.mStart.removeSpecificCurve_AH(this);
    }
    this.mStart = param1;
    if(this.mStart != null)
    {
        this.mStart.addONE_PART(this);
    }
};

SegmentController.prototype.updateEndCorner = function(param1) {
    if(this.mEnd != null)
    {
        this.mEnd.removeSpecificCurve_AH(this);
    }
    this.mEnd = param1;
    if(this.mEnd != null)
    {
        this.mEnd.addONE_PART(this);
    }
};

SegmentController.prototype.isIntersectWith = function(param1, param2, param3, param4)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    var _loc6_ = null;
    var _loc7_ = null;
    var _loc8_ = null;
    var _loc5_ = null;
    if(param1 instanceof SegmentController)
    {
        _loc6_ = param1;
        _loc5_ = _loc6_.getTheStartEndEdge();
        return this.intersectSub(_loc5_,param2,param3,param4);
    }
    if(param1 instanceof CurveController)
    {
        _loc7_ = param1;
        _loc8_ = _loc7_.getCurveFromController();
        return this.isCurveIntersectByAreaAndGetIntersectPoint(_loc8_,param2,param3,param4);
    }
    return false;
}

SegmentController.prototype.isIntersectWithGeometry = function(param1, param2, param3, param4)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    var _loc6_ = null;
    var _loc7_ = null;
    var _loc8_ = null;
    var _loc5_ = null;
    if(param1 instanceof MyEdge)
    {
        _loc5_ = param1
        return this.intersectSub(_loc5_,param2,param3,param4);
    }
    if(param1 instanceof MyCurve)
    {
        _loc8_ = _loc7_;
        return this.isCurveIntersectByAreaAndGetIntersectPoint(_loc8_,param2,param3,param4);
    }
    return false;
}

SegmentController.prototype.intersectSub = function(param1, param2, param3, param4)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    var _loc5_ = this.getTheStartEndEdge();
    var _loc6_ = null;
    if(lineRelationHelper.isInterSect(_loc5_,param1,param3,param4))
    {
        if(param2 != null)
        {
            _loc6_ = lineRelationHelper.isInterSectAndGetPoint(_loc5_,param1);
            if(_loc6_ != null)
            {
                param2.push(_loc6_);
            }
        }
        return true;
    }
    return false;
}

SegmentController.prototype.dispose = function()
{
    var _loc2_ = null;
    var _loc3_ = null;
    //super.dispose();
    var _loc1_ = this.toCorners();
    for (var i = 0; i < _loc1_.length; i++) {
        _loc2_ = _loc1_[i];
        if (_loc2_) {
            _loc2_.removeSpecificCurve_AH(this);
            if(_loc2_.mCurves.length == 0)
            {
                _loc2_.dispose();
            }
        }
    }
    
    for (var i = 0; i < this.mAreas.length; i++) {
        _loc3_ = this.mAreas[i];
        _loc3_.removeSpecificCurve_AH(this);
    }
         
    if(this.mWall != null && !this.isBoundry)
    {
        this.mWall.removeSpecificCurve_AH(this);
    }
}
/*
SegmentController.prototype.§-_-_-_-____-_§(param1:curveBasicClass, param2:Vector.<Vec2> = null, param3:Boolean = false, param4:Number = 1.0E-6) : Boolean
{
var _loc6_:wallcurveSon = null;
var _loc7_:wallCurveSonClass_AH = null;
var _loc8_:myCurveClass = null;
var _loc5_:my2D_Edge = null;
if(param1 is wallcurveSon)
{
_loc6_ = param1 as wallcurveSon;
_loc5_ = _loc6_.getTheStartEndEdge();
return this.§-___________--§(_loc5_,param2,param3,param4);
}
if(param1 is wallCurveSonClass_AH)
{
_loc7_ = param1 as wallCurveSonClass_AH;
_loc8_ = _loc7_.§--_--_-_____-§();
return this.isCurveIntersectByAreaAndGetIntersectPoint(_loc8_,param2,param3,param4);
}
return false;
}

SegmentController.prototype.§-___________--§(param1:my2D_Edge, param2:Vector.<Vec2> = null, param3:Boolean = false, param4:Number = 1.0E-6) : Boolean
{
var _loc5_:my2D_Edge = getTheStartEndEdge();
var _loc6_:Vec2 = null;
if(lineRelationHelper.§--__-----_-_-§(_loc5_,param1,param3,param4))
{
if(param2 != null)
{
_loc6_ = lineRelationHelper.§-___---__--__§(_loc5_,param1);
if(_loc6_ != null)
{
  param2.push(_loc6_);
}
}
return true;
}
return false;
}
*/
/*
override public function §-___________--§(param1:my2D_Edge, param2:Vector.<Vec2> = null, param3:Boolean = false, param4:Number = 1.0E-6) : Boolean
{
    var _loc5_:my2D_Edge = getTheStartEndEdge();
    var _loc6_:Vec2 = null;
    if(lineRelationHelper.§--__-----_-_-§(_loc5_,param1,param3,param4))
    {
        if(param2 != null)
        {
            _loc6_ = lineRelationHelper.§-___---__--__§(_loc5_,param1);
            if(_loc6_ != null)
            {
                param2.push(_loc6_);
            }
        }
        return true;
    }
    return false;
}
*/

SegmentController.prototype.isCurveIntersectByEdgeAndGetIntersectPoint = function(param1, param2, param3, param4)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    var _loc5_ = this.getTheStartEndEdge();
    var _loc6_ = null;
    if(lineRelationHelper.isInterSectHarsh(_loc5_,param1,param3,param4))
    {
        if(param2 != null)
        {
            _loc6_ = lineRelationHelper.isInterSectAndGetPoint(_loc5_,param1);
            if(_loc6_ != null)
            {
                param2.push(_loc6_);
            }
        }
        return true;
    }
    return false;
}

SegmentController.prototype.isCurveIntersectByAreaAndGetIntersectPoint = function(param1, param2, param3, param4)
{
    if (param2 == null || param2 == undefined) {
        param2 = null;
    }
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 1.0E-6;
    }
    //param2 = param2 || null;
    //param3 = param3 || false;
    //param4 = param4 || 1.0E-6;
    
    var _loc5_ = someArcEdgeHelper_AEE.getValidIntersectionPointBetweenArcAndEdge(param1, this.getTheStartEndEdge());
    if(!param3)
    {
        param1.removePointsNotInsideCurve(_loc5_);
    }
    if(_loc5_.length == 0)
    {
        return false;
    }
    if(param2 != null)
    {
        ArrayHelperClass.addItems(param2,_loc5_);
    }
    return true;
}


SegmentController.prototype.isHasAndSaveOnCurve = function(param1)
{
    var _loc2_ = ArrayHelperClass.ifHasAndSave(this.mAreas, param1);
    return _loc2_;
}

SegmentController.prototype.getClosestPoint = function(param1)
{
    if(MyNumber.isZeroOrOrigin(this.length))
    {
        return mStart.position.clone();
    }
    return this.getTheStartEndEdge().getClosestPoint(param1,true);
}

SegmentController.prototype.switchOrder = function(param1)
{
    if (param1 == null || param1 == undefined) {
        param1 = false;
    }

    //param1 = param1 || false;
    if(!param1)
    {
        return [this.mStart.mPosition.clone(),this.mEnd.mPosition.clone()];
    }
    return [this.mEnd.mPosition.clone(),this.mStart.mPosition.clone()];
}

SegmentController.prototype.decideSide = function(param1)
{
    var _loc2_ = getTheStartEndEdge().decideSide(param1);
    if(_loc2_ == Line2DPointSide.ON_RIGHT)
    {
        return DecoCurvePointSide.ON_LEFT;
    }
    if(_loc2_ == Line2DPointSide.ON_LINE)
    {
        return DecoCurvePointSide.ON_CURVE;
    }
    return DecoCurvePointSide.ON_RIGHT;
}

SegmentController.prototype.getCenter = function()
{
    return this.getTheStartEndEdge().getCenter();
}
/*
SegmentController.prototype.§--_-__-_-_§(param1:cornerBasicClass) : Number
{
return Vec2.getAngleByTan(param1.position,getStartOrEndOrNull(param1).position);
}

SegmentController.prototype.§-____--_-__-__§(param1:MY_VEC4) : Vec2
{
var _loc2_:my2D_Edge = getTheStartEndEdge();
var _loc3_:Vec2 = _loc2_.§-_____________§().mulBy(param1.x);
var _loc4_:Boolean = §-__--___---_§.§---__-__-_-_-§(this);
var _loc5_:Boolean = §-__--___---_§.§-____--_-_§(this);
var _loc6_:Vec2 = _loc2_.rotate_minus_90_degree().normalize().mulBy(param1.z);
if(_loc4_ != _loc5_)
{
return end.sub(_loc3_).add(_loc6_);
}
return start.add(_loc3_).sub(_loc6_);
}

SegmentController.prototype.§-__-__-_----§(param1:Vec2) : MY_VEC4
{
var _loc2_:MY_VEC4 = new MY_VEC4();
var _loc3_:my2D_Edge = getTheStartEndEdge();
var _loc4_:Vec2 = _loc3_.project(param1);
var _loc5_:Vec2 = Vec2.sub(_loc4_,_loc3_.start);
var _loc6_:Number = _loc4_.distance(_loc3_.start);
var _loc7_:Number = _loc4_.distance(_loc3_.end);
var _loc8_:Number = _loc3_.length;
var _loc9_:Vec2 = _loc3_.getVecEndMinusStart();
_loc2_.x = _loc6_ * (Number(my_math.sign(_loc5_.x * _loc9_.x)) || Number(my_math.sign(_loc5_.y * _loc9_.y)));
var _loc10_:Boolean = §-__--___---_§.§---__-__-_-_-§(this);
var _loc11_:Boolean = §-__--___---_§.§-____--_-_§(this);
if(_loc10_ != _loc11_)
{
_loc2_.x = _loc8_ - _loc2_.x;
_loc2_.z = _loc3_.distancePointToCurve(param1);
}
else
{
_loc2_.z = -_loc3_.distancePointToCurve(param1);
}
return _loc2_;
}

SegmentController.prototype.§-____-_--_---§(param1:MY_VEC4) : Vec2
{
return getTheStartEndEdge().rotate_90_degree().normalize();
}
*/

SegmentController.prototype.getLength = function()
{
    return this.getTheStartEndEdge().getLength();
}
