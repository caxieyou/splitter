var Line2DIntersectionStatus = {
    OVERLAPPING         : 0,
    COLLINEAR           : 1,
    LINES_INTERSECT     : 2,
    SEGMENTS_INTERSECT  : 3,
    A_BISECTS_B         : 4,
    B_BISECTS_A         : 5,
    PARALLEL            : 6
}

function LineRelationHelper() {
    
}

LineRelationHelper.isInterSectHarsh = function(param1, param2, param3, param4)
{
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    if (param4 == null || param4 == undefined) {
        param4 = 0.01;
    }
    
    var _loc5_ = LineRelationHelper.createEdgeCollider(param1,param2,param4);
    if(_loc5_.status == Line2DIntersectionStatus.SEGMENTS_INTERSECT)
    {
        return param3 || !(MyNumber.isZeroOrOrigin(_loc5_.mRatio1.mX) || MyNumber.isZeroOrOrigin(_loc5_.mRatio2.mX));
    }
    return false;
}

LineRelationHelper.isInterSectAndGetPoint = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 0.01;
    }
    var _loc4_ = LineRelationHelper.createEdgeCollider(param1,param2,param3);
    if(_loc4_.status == Line2DIntersectionStatus.SEGMENTS_INTERSECT)
    {
        return _loc4_.mPoint;
    }
    return null;
}

LineRelationHelper.createEdgeCollider = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 0.01;
    }
    var _loc14_ = NaN;
    var _loc15_ = NaN;
    var _loc16_ = NaN;
    var _loc17_ = NaN;
    var _loc18_ = NaN;
    var _loc19_ = NaN;
    var _loc20_ = NaN;
    var _loc21_ = NaN;
    var _loc22_ = NaN;
    var _loc23_ = NaN;
    var _loc24_ = null;
    var _loc25_ = null;
    var _loc26_ = NaN;
    var _loc27_ = NaN;
    var _loc4_ = param1.mStart;
    var _loc5_ = param2.mStart;
    var _loc6_ = param1.mEnd;
    var _loc7_ = param2.mEnd;
    var _loc8_ = Vec2.sub(_loc6_,_loc4_);
    var _loc9_ = Vec2.sub(_loc7_,_loc5_);
    var _loc10_ = Vec2.cross(_loc8_,_loc9_);
    var _loc11_ = Vec2.cross(Vec2.sub(_loc5_,_loc4_),_loc8_);
    var _loc12_ = Vec2.cross(Vec2.sub(_loc5_,_loc4_),_loc9_);
    var _loc13_ = new MyEdgeCollide();
    
    if(MyNumber.isZeroOrOrigin(_loc10_,param3))
    {
        if(MyNumber.isZeroOrOrigin(_loc12_,param3) && MyNumber.isZeroOrOrigin(_loc11_,param3))
        {
           _loc14_ = Vec2.dot(Vec2.sub(_loc5_,_loc4_),_loc8_);
           _loc15_ = Vec2.dot(Vec2.sub(_loc7_,_loc4_),_loc8_);
           _loc16_ = Vec2.dot(Vec2.sub(_loc4_,_loc5_),_loc9_);
           _loc17_ = Vec2.dot(Vec2.sub(_loc6_,_loc5_),_loc9_);
           _loc18_ = Vec2.dot(_loc8_,_loc8_);
           _loc19_ = Vec2.dot(_loc9_,_loc9_);
           _loc20_ = _loc14_ / _loc18_;
           _loc21_ = _loc15_ / _loc18_;
           _loc22_ = _loc16_ / _loc19_;
           _loc23_ = _loc17_ / _loc19_;
           _loc24_ = new Vec2(0,0);
           _loc24_.mX = Math.min(_loc20_,_loc21_);
           _loc24_.mY = Math.max(_loc20_,_loc21_);
           _loc25_ = new Vec2(0,0);
           _loc25_.mX = Math.min(_loc22_,_loc23_);
           _loc25_.mY = Math.max(_loc22_,_loc23_);
           _loc13_.mRatio1 = _loc24_;
           _loc13_.mRatio2 = _loc25_;
           if(_loc14_ >= 0 && _loc14_ <= _loc18_ || _loc15_ >= 0 && _loc15_ <= _loc18_ || _loc16_ >= 0 && _loc16_ <= _loc19_ || _loc17_ >= 0 && _loc17_ <= _loc19_)
           {
              _loc24_.mX = MyMath.clamp_0_1(_loc24_.mX);
              _loc24_.mY = MyMath.clamp_0_1(_loc24_.mY);
              _loc25_.mX = MyMath.clamp_0_1(_loc25_.mX);
              _loc25_.mY = MyMath.clamp_0_1(_loc25_.mY);
              _loc13_.status = Line2DIntersectionStatus.OVERLAPPING;
           }
           else
           {
              _loc13_.status = Line2DIntersectionStatus.COLLINEAR;
           }
        }
        else
        {
           _loc13_.status = Line2DIntersectionStatus.PARALLEL;
        }
    }
    else
    {
        _loc26_ = MyNumber.getYourSelf(_loc12_ / _loc10_);
        _loc27_ = MyNumber.getYourSelf(_loc11_ / _loc10_);
        _loc13_.mRatio1 = new Vec2(_loc26_,_loc26_);
        _loc13_.mRatio2 = new Vec2(_loc27_,_loc27_);
        _loc13_.mPoint  = param1.interpolate(_loc26_);
        if(_loc26_ >= 0 && _loc26_ <= 1 && _loc27_ >= 0 && _loc27_ <= 1)
        {
           _loc13_.status = Line2DIntersectionStatus.SEGMENTS_INTERSECT;
        }
        else if(_loc27_ >= 0 && _loc27_ <= 1)
        {
           _loc13_.status = Line2DIntersectionStatus.A_BISECTS_B;
        }
        else if(_loc26_ >= 0 && _loc26_ <= 1)
        {
           _loc13_.status = Line2DIntersectionStatus.B_BISECTS_A;
        }
        else
        {
           _loc13_.status = Line2DIntersectionStatus.LINES_INTERSECT;
        }
    }
    return _loc13_;
}

LineRelationHelper.isInterSect = function(param1, param2, param3, param4)
{
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }
    
    if (param4 == null || param4 == undefined) {
        param4 = 0.01;
    }
    
    var _loc5_ = LineRelationHelper.createEdgeCollider(param1,param2,param4);
    switch(_loc5_.status)
    {
        case Line2DIntersectionStatus.SEGMENTS_INTERSECT:
            if (_loc5_.mRatio1.mX == 1 && _loc5_.mRatio2.mX == 1) {
                return false;
            }
            if (_loc5_.mRatio1.mX == 1 && _loc5_.mRatio2.mX == 0) {
                return false;
            }
            if (_loc5_.mRatio1.mX == 0 && _loc5_.mRatio2.mX == 1) {
                return false;
            }
            return !(MyNumber.isZeroOrOrigin(_loc5_.mRatio1.mX) || MyNumber.isZeroOrOrigin(_loc5_.mRatio2.mX));
        case Line2DIntersectionStatus.OVERLAPPING:
            if (_loc5_.mRatio1.mX == 1 && _loc5_.mRatio1.mY == 1) {
                return false;
            }
            return param3 || !MyNumber.isEqual(_loc5_.mRatio1.mX,_loc5_.mRatio1.mY) || !MyNumber.isZeroOrOrigin(_loc5_.mRatio1.mX);
        default:
            return false;
    }
}

LineRelationHelper.isOverLapping = function(param1, param2, param3, param4)
{
    if (param3 == null || param3 == undefined) {
        param3 = false;
    }

    if (param4 == null || param4 == undefined) {
        param4 = 0.01;
    }
    var _loc5_ = LineRelationHelper.createEdgeCollider(param1,param2,param4);
    if(_loc5_.status == Line2DIntersectionStatus.OVERLAPPING)
    {
        if (MyNumber.isEqual(_loc5_.mRatio1.mX, 1) && MyNumber.isEqual(_loc5_.mRatio1.mY, 1) 
            && MyNumber.isEqual(_loc5_.mRatio2.mX, 0) && MyNumber.isEqual(_loc5_.mRatio2.mY, 0)) {
                return false;
            }
        if (MyNumber.isEqual(_loc5_.mRatio1.mX, 0) && MyNumber.isEqual(_loc5_.mRatio1.mY, 0) 
            && MyNumber.isEqual(_loc5_.mRatio2.mX, 1) && MyNumber.isEqual(_loc5_.mRatio2.mY, 1)) {
                return false;
            }
        return param3 || !MyNumber.isEqual(_loc5_.mRatio1.mX,_loc5_.mRatio1.mY,0.01) || !MyNumber.isZeroOrOrigin(_loc5_.mRatio1.mX,0.01);
    }
    return false;
}
//my_edge_collide_class --> MyEdgeCollide

function MyEdgeCollide() {
    this.mPoint;
    this.mRatio1;
    this.mRatio2;
}
