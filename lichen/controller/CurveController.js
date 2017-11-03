function CurveController(param1) {
    if (param1 == null || param1 == undefined) {
        param1 = null;
    }
    //param1 = param1 || null;
    
    this.mStart = new MyCorner(param1);
    this.mEnd = new MyCorner(param1);
    this.mAreas = [];
    this.mWall = param1;
    this.mCurvePoint = new Vec2();
    //this.initialize();
    this.mId = ID.assignUniqueId();
}
CurveController.CONST_SPLIT = 0.3333333;
CurveController.TOLERANCE   = 1.0E-6;


CurveController.getSplitOneThirdCurve = function(param1)
{
    var _loc2_ = null;
    var _loc3_ = new CurveController();
    _loc2_ = new MyCorner();
    _loc2_.mPosition = param1.getSplitPosByRatio(0);
    _loc3_.updateStartCorner(_loc2_);
    //_loc3_.mStart = _loc2_;
    _loc2_ = new MyCorner();
    _loc2_.mPosition = param1.getSplitPosByRatio(1);
    
    _loc3_.updateEndCorner(_loc2_);
    
    //_loc3_.mEnd = _loc2_;
    //_loc3_.oneThirdPoint = param1.getSplitPosByRatio(CurveController.CONST_SPLIT);

    _loc3_.mCurvePoint = param1.getSplitPosByRatio(CurveController.CONST_SPLIT);
    return _loc3_;
}


//求圆心
CurveController.prototype.getInnerIntersectionPoint_XX = function()
{
    var _loc1_ = new MyEdge(this.mStart.mPosition.clone(),this.mEnd.mPosition.clone());
    var _loc2_ = new MyEdge(this.mStart.mPosition.clone(),this.mCurvePoint.clone());
    var _loc3_ = _loc1_.interpolate(0.5);
    var _loc4_ = _loc2_.interpolate(0.5);
    var _loc5_ = _loc1_.rotate_90_degree();
    var _loc6_ = _loc2_.rotate_90_degree();
    var _loc7_ = MyEdge.getPointVectorEdge(_loc3_,_loc5_);
    var _loc8_ = MyEdge.getPointVectorEdge(_loc4_,_loc6_);
    return MyEdge.getIntersection(_loc7_,_loc8_,0);
}
/*
public function getCurveFromController() : myCurveClass
{
    var _loc1_:Vec2 = this.getInnerIntersectionPoint_XX();
    if(isNaN(_loc1_.x) || isNaN(_loc1_.y))
    {
        return new myCurveClass(start,TOLERANCE,TOLERANCE,TOLERANCE);
    }
    var _loc2_:Number = start.sub(_loc1_).angle;
    var _loc3_:Number = end.sub(_loc1_).angle;
    var _loc4_:Number = _loc3_ - _loc2_;
    var _loc5_:Number = _loc1_.distance(start);
    var _loc6_:myCurveClass = new myCurveClass(_loc1_,_loc5_,_loc2_,_loc4_);
    if(!_loc6_.isInsideArcFan(this.mCurvePoint))
    {
        _loc6_.funcGetCurveAngle = -1 * my_math.sign(_loc4_) * (Angle.CONST_2_PI - Math.abs(_loc4_));
    }
    return _loc6_;
}
*/
      
CurveController.prototype.getCurveFromController = function()
{
    var _loc1_ = this.getInnerIntersectionPoint_XX();
    if(isNaN(_loc1_.mX) || isNaN(_loc1_.mY))
    {
        return new MyCurve(this.mStart.mPosition,CurveController.TOLERANCE,CurveController.TOLERANCE,CurveController.TOLERANCE);
    }
    var _loc2_ = this.mStart.mPosition.clone().sub(_loc1_).getAngle();
    var _loc3_ = this.mEnd.mPosition.clone().sub(_loc1_).getAngle();
    var _loc4_ = _loc3_ - _loc2_;
    var _loc5_ = _loc1_.distance(this.mStart.mPosition);
    var _loc6_ = new MyCurve(_loc1_,_loc5_,_loc2_,_loc4_);
  
    //console.log(_loc6_.mArcAngle);
    if(!_loc6_.isInsideArcFan(this.mCurvePoint.clone()))
    {
        
        _loc6_.mArcAngle = -1 * MyMath.sign(_loc4_) * (Angle.CONST_2_PI - Math.abs(_loc4_));
    }
    //console.log(_loc6_.mArcAngle);
    return _loc6_;
}


CurveController.prototype.setCornerStartAndEndButHasToBeSame = function(param1, param2)
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
      
CurveController.prototype.isHasAndSaveOnCurve = function(param1)
{
    var _loc2_ = ArrayHelperClass.ifHasAndSave(this.mAreas, param1);
    return _loc2_;
}

CurveController.prototype.updateInfo = function(param1)
{
    var _loc2_ = this.getCurveFromController();
    var _loc3_ = param1.mPosition.clone().sub(this.getInnerIntersectionPoint_XX()).getAngle();
    var _loc4_ = _loc2_.getAngleRatio(_loc3_);
    var _loc5_ = _loc2_.getSplitPosByRatio(_loc4_ * 0.33333333);
    var _loc6_ = _loc2_.getSplitPosByRatio(_loc4_ + (1 - _loc4_) * 0.33333333);
    var _loc7_ = wallCurveCornerHelper.getCornerByPos_XX(_loc2_.getSplitPosByRatio(1),[this.mStart, this.mEnd]);
    var _loc8_ = new CurveController();
    //_loc8_.cloneProperties(this);
    
    //_loc8_.mStart = param1;
    _loc8_.updateStartCorner(param1);
    
    _loc8_.updateEndCorner(_loc7_);
    //_loc8_.mEnd = _loc7_;
    _loc8_.mCurvePoint = _loc6_;
    if(_loc7_ == this.mEnd)
    {
        this.updateEndCorner(param1);
        //this.mEnd = param1;
    }
    else
    {
        this.updateStartCorner(param1);
        //this.mStart = param1;
    }
    this.mCurvePoint = _loc5_;
    //invalidate();
    this.mWall.addONE_PART(_loc8_);
    return _loc8_;
}

//CurveController.prototype.getStartOrEndOrNull = function(param1:cornerBasicClass) : cornerBasicClass
CurveController.prototype.getStartOrEndOrNull = function(param1)
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

CurveController.prototype.wallDleleteSame = function(param1)
{
    return ArrayHelperClass.removeItem(this.mAreas,param1);
}

CurveController.prototype.updateStartCorner = function(param1) {
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

CurveController.prototype.updateEndCorner = function(param1) {
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

CurveController.prototype.isStart = function(param1)
{
    return this.mStart == param1;//§-_____-_-_--_§.isEqual(this.mm_start,param1);
}

CurveController.prototype.isEnd = function(param1)
{
    return this.mEnd == param1;//§-_____-_-_--_§.isEqual(this.mm_end,param1);
}

CurveController.prototype.getTheStartEndEdge = function()
{
    return new MyEdge(this.mStart.mPosition,this.mEnd.mPosition);
}

CurveController.prototype.resetCurve = function(param1)
{
    if(this.mStart == null || this.mEnd == null || isNaN(param1))
    {
        return;
    }
    var _loc2_ = MyCurve.createCurveByEdgeNumber(this.getTheStartEndEdge(),param1);
    this.mCurvePoint = _loc2_.getSplitPosByRatio(0.3333333);
}

CurveController.prototype.isStartOrEnd = function(param1)
{
    return param1 == this.mStart || param1 == this.mEnd;
}

CurveController.prototype.toCorners = function(param1)
{
    return [this.mStart, this.mEnd];
}

CurveController.prototype.isIntersectWith = function(param1, param2, param3, param4)
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

    var _loc5_ = null;
    var _loc6_ = null;
    var _loc7_ = null;
    var _loc8_ = null;
    if(param1 instanceof CurveController)
    {
        _loc5_ = param1
        _loc6_ = _loc5_.getCurveFromController();
        return this.isCurveIntersectByAreaAndGetIntersectPoint(_loc6_,param2,param3,param4);
    }
    if(param1 instanceof SegmentController)
    {
        _loc7_ = param1;
        _loc8_ = _loc7_.getTheStartEndEdge();
        return this.intersectSub(_loc8_,param2,param3,param4);
    }
    return false;                   
}

CurveController.prototype.isIntersectWithGeometry = function(param1, param2, param3, param4)
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

    var _loc5_ = null;
    var _loc6_ = null;
    var _loc7_ = null;
    var _loc8_ = null;
    if(param1 instanceof MyCurve)
    {
        _loc6_ = param1;
        return this.isCurveIntersectByAreaAndGetIntersectPoint(_loc6_,param2,param3,param4);
    }
    if(param1 instanceof MyEdge)
    {
        _loc8_ = param1;
        return this.intersectSub(_loc8_,param2,param3,param4);
    }
    return false;                   
}

CurveController.prototype.intersectSub = function(param1, param2, param3, param4)
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
    var _loc5_ = this.getCurveFromController();
    var _loc6_ = someArcEdgeHelper_AEE.getValidIntersectionPointBetweenArcAndEdge(_loc5_,param1);
    if(!param3)
    {
        param1.removePointsNotInside(_loc6_);
        _loc5_.removePointsNotInsideCurve(_loc6_);
    }
    if(_loc6_.length == 0)
    {
        return false;
    }
    if(param2 != null)
    {
        ArrayHelperClass.addItems(param2,_loc6_);
    }
    return true;
}

CurveController.prototype.dispose = function()
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
    
    if(this.mWall != null)
    {
        this.mWall.removeSpecificCurve_AH(this);
    }
}
/*
override public function cloneProperties(param1:*) : void
{
var _loc2_:CurveController = param1 as CurveController;
mType = _loc2_.type;
§--__--__-___§ = _loc2_.profile.deepClone();
§--__--__-___§.curve = this;
this.mCurvePoint = _loc2_.oneThirdPoint;
§--_-____-_--§.cloneProperties(_loc2_.elevation);
}

public function §-___-__---_--§(param1:Number) : void
{
if(mm_start == null || mm_end == null || isNaN(param1))
{
return;
}
var _loc2_:MyCurve = MyCurve.createCurveByEdgeNumber(getTheStartEndEdge(),param1);
this.mCurvePoint = _loc2_.getSplitPosByRatio(CONST_0_3333333);
}

override public function §-_-__-----_§(param1:MyCorner) : wallCurve
{
var _loc2_:MyCurve = this.getCurveFromController();
var _loc3_:Number = param1.position.sub(this.getInnerIntersectionPoint_XX()).angle;
var _loc4_:Number = _loc2_.getAngleRatio(_loc3_);
var _loc5_:Vec2 = _loc2_.getSplitPosByRatio(_loc4_ * CONST_0_3333333);
var _loc6_:Vec2 = _loc2_.getSplitPosByRatio(_loc4_ + (1 - _loc4_) * CONST_0_3333333);
var _loc7_:MyCorner = wallCurveCornerHelper_AX.getCornerByPos_XX(_loc2_.getSplitPosByRatio(1),MyCorner.cloneParameter(cloneCurve()));
var _loc8_:CurveController = new CurveController();
_loc8_.cloneProperties(this);
_loc8_.m_Start = param1;
_loc8_.m_End = _loc7_;
_loc8_.oneThirdPoint = _loc6_;
if(_loc7_ == mm_end)
{
m_End = param1;
}
else
{
m_Start = param1;
}
this.oneThirdPoint = _loc5_;
invalidate();
wall.addONE_PART(_loc8_);
return _loc8_;
}

override public function §-_-__--____--§(param1:Vec2) : void
{
super.§-_-__--____--§(param1);
this.mCurvePoint.add(param1);
invalidate();
}
*/

CurveController.prototype.isInsideMyArea = function(param1, param2, param3)
{
    if (param2 == null || param2 == undefined) {
        param2 = false;
    }
    if (param3 == null || param3 == undefined) {
        param3 = 1.0E-6;
    }

    //param2 = param2 || false;
    //param3 = param3 || 1.0E-6;
    return !!param2 ? this.getCurveFromController().isInsideArcFan(param1,param3) : this.getCurveFromController().isInsideCurveAndNotOnCurve(param1,param3);
}

CurveController.prototype.getTheCurveStartEndEdgeToPointDistance = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = true;
    }

    //param2 = param2 || true;
    return this.getCurveFromController().getDistance(param1,param2);
}
/*
override public function §-_-_-_-____-_§(param1:curveBasicClass, param2:Vector.<Vec2> = null, param3:Boolean = false, param4:Number = 1.0E-6) : Boolean
{
var _loc5_:CurveController = null;
var _loc6_:MyCurve = null;
var _loc7_:wallcurveSon = null;
var _loc8_:MyEdge = null;
if(param1 is CurveController)
{
_loc5_ = param1 as CurveController;
_loc6_ = _loc5_.getCurveFromController();
return this.isCurveIntersectByAreaAndGetIntersectPoint(_loc6_,param2,param3,param4);
}
if(param1 is wallcurveSon)
{
_loc7_ = param1 as wallcurveSon;
_loc8_ = _loc7_.getTheStartEndEdge();
return this.intersectSub(_loc8_,param2,param3,param4);
}
return false;
}

override public function intersectSub(param1:MyEdge, param2:Vector.<Vec2> = null, param3:Boolean = false, param4:Number = 1.0E-6) : Boolean
{
var _loc5_:MyCurve = this.getCurveFromController();
var _loc6_:Vector.<Vec2> = someArcEdgeHelper_AEE.getValidIntersectionPointBetweenArcAndEdge(_loc5_,param1);
if(!param3)
{
param1.removePointsNotInsideCurve(_loc6_);
_loc5_.removePointsNotInsideCurve(_loc6_);
}
if(_loc6_.length == 0)
{
return false;
}
if(param2 != null)
{
ArrayHelperClass.addItems(param2,_loc6_);
}
return true;
}
*/
/*
override public function intersectSub(param1:my2D_Edge, param2:Vector.<Vec2> = null, param3:Boolean = false, param4:Number = 1.0E-6) : Boolean
{
var _loc5_:myCurveClass = this.getCurveFromController();
var _loc6_:Vector.<Vec2> = someArcEdgeHelper_AEE.getValidIntersectionPointBetweenArcAndEdge(_loc5_,param1);
if(!param3)
{
param1.removePointsNotInsideCurve(_loc6_);
_loc5_.removePointsNotInsideCurve(_loc6_);
}
if(_loc6_.length == 0)
{
return false;
}
if(param2 != null)
{
ArrayHelperClass.addItems(param2,_loc6_);
}
return true;
}
*/

CurveController.prototype.isCurveIntersectByEdgeAndGetIntersectPoint = function(param1, param2, param3, param4)
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
    
    var _loc5_ = this.getCurveFromController();
    var _loc6_ = someArcEdgeHelper_AEE.getValidIntersectionPointBetweenArcAndEdge(_loc5_,param1);
    if(!param3)
    {
        param1.removePointsNotInsideCurve(_loc6_);
        _loc5_.removePointsNotInsideCurve(_loc6_);
    }
    if(_loc6_.length == 0)
    {
        return false;
    }
    if(param2 != null)
    {
        ArrayHelperClass.addItems(param2,_loc6_);
    }
    return true;
}

CurveController.prototype.isCurveIntersectByAreaAndGetIntersectPoint = function(param1, param2, param3, param4)
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
    var _loc5_ = this.getCurveFromController();
    var _loc6_= someArcEdgeHelper_AEE.getCurveIntersectionPoints(_loc5_,param1,param4);
    if(!param3)
    {
        param1.removePointsNotInsideCurve(_loc6_);
        _loc5_.removePointsNotInsideCurve(_loc6_);
    }
    if(_loc6_.length == 0)
    {
        return false;
    }
    if(param2 != null)
    {
        ArrayHelperClass.addItems(param2,_loc6_);
    }
    return true;
}
/*
override public function §-____--_-__-__§(param1:MY_VEC4) : Vec2
{
var _loc2_:MyCurve = this.getCurveFromController();
var _loc3_:Number = _loc2_.§--______----§(param1.x);
var _loc4_:Vec2 = null;
var _loc5_:Boolean = §-__--___---_§.§---__-__-_-_-§(this);
var _loc6_:Boolean = §-__--___---_§.§-____--_-_§(this);
var _loc7_:Vec2 = this.§-____-_--_---§(param1).mulBy(param1.z);
if(_loc5_ == _loc6_)
{
_loc4_ = _loc2_.getSplitPosByRatio(1 - _loc3_);
return _loc4_.sub(_loc7_);
}
_loc4_ = _loc2_.getSplitPosByRatio(_loc3_);
return _loc4_.add(_loc7_);
}

override public function §-__-__-_----§(param1:Vec2) : MY_VEC4
{
var _loc2_:MY_VEC4 = new MY_VEC4();
var _loc3_:MyCurve = this.getCurveFromController();
var _loc4_:Number = _loc3_.length;
var _loc5_:Circle = _loc3_.createCircle_canvas();
var _loc6_:Number = _loc5_.getCenterIntersectAngle(param1);
var _loc7_:Number = _loc3_.getAngleRatio(_loc6_);
var _loc8_:Number = _loc3_.enlarge_xx(_loc7_);
_loc2_.x = _loc8_;
var _loc9_:Boolean = §-__--___---_§.§---__-__-_-_-§(this);
var _loc10_:Boolean = §-__--___---_§.§-____--_-_§(this);
if(_loc9_ == _loc10_)
{
_loc2_.x = _loc4_ - _loc2_.x;
_loc2_.z = _loc3_.distancePointToCurve(param1);
}
else
{
_loc2_.z = -_loc3_.distancePointToCurve(param1);
}
return _loc2_;
}

override public function §-____-_--_---§(param1:MY_VEC4) : Vec2
{
var _loc2_:MyCurve = this.getCurveFromController();
var _loc3_:Boolean = §-__--___---_§.§---__-__-_-_-§(this);
var _loc4_:Boolean = §-__--___---_§.§-____--_-_§(this);
var _loc5_:Number = _loc2_.§--______----§(param1.x);
if(_loc3_ != _loc4_)
{
_loc5_ = 1 - _loc5_;
}
var _loc6_:Number = _loc2_.curveAngleByRatio(_loc5_);
var _loc7_:Vec2 = new Vec2(Math.cos(_loc6_),Math.sin(_loc6_));
if(_loc4_)
{
_loc7_.negtive();
}
return _loc7_;
}
*/
CurveController.prototype.getCenter = function()
{
    return this.getCurveFromController().getSplitPosByRatio(0.5);
}

CurveController.prototype.getClosestPoint = function(param1)
{
    return this.getCurveFromController().getClosestPoint(param1);
}

CurveController.prototype.switchOrder = function(param1)
{
    if (param1 == null || param1 == undefined) {
        param1 = false;
    }

    //param1 = param1 || false;
    if(!param1)
    {
        return this.getCurveFromController().tessallation_NotUnderstand();
    }
    return this.getCurveFromController().tessallation_NotUnderstand().reverse();
}

CurveController.prototype.decideSide = function(param1)
{
    var _loc2_ = this.getCurveFromController().decideSide(param1);
    if(_loc2_ == ArcCurvePointSide.ON_RIGHT)
    {
        return DecoCurvePointSide.ON_LEFT;
    }
    if(_loc2_ == ArcCurvePointSide.ON_CURVE)
    {
        return DecoCurvePointSide.ON_CURVE;
    }
    return DecoCurvePointSide.ON_RIGHT;
}


/*
public function §-_---_--_----§() : Number
{
return this.getInnerIntersectionPoint_XX().distance(start);
}

public function §-----__-_---§() : Number
{
return this.getCurveFromController().startAngle;
}

public function §---_-_----__-§() : Number
{
return this.getCurveFromController().endAngle;
}
*/


/*
public function §--___-___-_--§(param1:Number) : void
{
var _loc2_:Number = this.get1_4_Of_arc();
var _loc3_:MyEdge = getTheStartEndEdge();
var _loc4_:Vec2 = this.getCenter();
var _loc5_:Vec2 = _loc3_.getCenter();
var _loc6_:Vec2 = _loc4_.sub(_loc5_);
var _loc7_:Number = _loc3_.length / 2;
if(param1 <= _loc7_)
{
param1 = _loc7_ + TOLERANCE;
}
var _loc8_:Number = Math.sqrt(param1 * param1 - _loc7_ * _loc7_);
if(Math.abs(_loc2_) > 1)
{
this.mCurvePoint = _loc5_.addBySplitAngle(param1 + _loc8_,_loc6_.angle);
}
else
{
this.mCurvePoint = _loc5_.addBySplitAngle(param1 - _loc8_,_loc6_.angle);
}
this.mCurvePoint = this.getCurveFromController().getSplitPosByRatio(CONST_0_3333333);
invalidateDisplay();
}

public function §-_-----__-_-_§(param1:Number) : void
{
var _loc2_:int = my_math.sign(this.getCurveFromController().funcGetCurveAngle);
var _loc3_:Number = Math.abs(param1);
var _loc4_:Number = Math.tan(_loc2_ * _loc3_ / 4);
this.§-___-__---_--§(_loc4_);
invalidateDisplay();
}
*/
CurveController.prototype.getLength = function()
{
    return this.getCurveFromController().getLength();
}
/*
public function get1_4_Of_arc() : Number
{
return this.getCurveFromController().get1_4_Of_arc();
}

public function get oneThirdPoint() : Vec2
{
return this.mCurvePoint.clone();
}

public function set oneThirdPoint(param1:Vec2) : void
{
if(param1 != null)
{
this.mCurvePoint.copy(param1);
invalidate();
}
}
*/
