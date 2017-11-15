function circleEdgeHelper() {
    
}

circleEdgeHelper.getEdgeCircleIntersectionPoints = function(param1, param2)
{
    var _loc7_ = NaN;
    var _loc8_ = null;
    var _loc9_ = NaN;
    var _loc3_ = [];//:Vector.<Vec2> = new Vector.<Vec2>();
    if(MyNumber.isZeroOrOrigin(param2.length))
    {
        return _loc3_;
    }
    var _loc4_ = param1.mCenter;
    var _loc5_ = param1.mRadius;
    var _loc6_ = param2.getDistance(_loc4_,false);
    if(_loc6_ > _loc5_)
    {
        return _loc3_;
    }
    if(_loc6_ == _loc5_)
    {
        _loc3_.push(param2.project(_loc4_));
    }
    else
    {
        _loc7_ = param2.getAngle();
        _loc8_ = param2.project(_loc4_,false);
        _loc9_ = Math.sqrt(_loc5_ * _loc5_ - _loc6_ * _loc6_);

        _loc3_.push(_loc8_.addBySplitAngle(_loc9_,_loc7_));

        //这里loc9前面有个负号
        _loc3_.push(_loc8_.addBySplitAngle(-_loc9_,_loc7_));
    }
    return _loc3_;
}

circleEdgeHelper.getCircleIntersectionPoints = function(param1, param2)
{
    var _loc10_ = null;
    var _loc11_ = NaN;
    var _loc12_ = NaN;
    var _loc13_ = null;
    var _loc14_ = NaN;
    var _loc3_ = [];
    var _loc4_ = param1.mCenter;
    var _loc5_ = param2.mCenter;
    var _loc6_ = param1.mRadius;
    var _loc7_ = param2.mRadius;
    var _loc8_ = _loc4_.distance(_loc5_);
    var _loc9_ = new MyEdge(_loc4_,_loc5_);
    if(_loc8_ > _loc6_ + _loc7_)
    {
        return _loc3_;
    }
    if(_loc8_ == _loc6_ + _loc7_)
    {
        _loc3_.push(_loc9_.getCenter());
    }
    else
    {
        _loc10_ = new MyEdge(_loc4_,_loc5_).getCenter();
        _loc11_ = _loc8_ / 2 + (_loc6_ * _loc6_ - _loc7_ * _loc7_) / (2 * _loc8_);
        _loc12_ = Math.sqrt(_loc6_ * _loc6_ - _loc11_ * _loc11_);
        _loc13_ = _loc9_.getPointByDistanceOnEdge(_loc11_);
        _loc14_ = _loc9_.getAngle() + Angle.HALF_PI;
        _loc3_.push(_loc13_.addBySplitAngle(_loc12_,_loc14_));
        _loc3_.push(_loc13_.addBySplitAngle(-_loc12_,_loc14_));
    }
    return _loc3_;
}



circleEdgeHelper.getLiteIntersetionPoints = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 1.0E-6;
    }
    var _loc4_ = circleEdgeHelper.getEdgeCircleIntersectionPoints(param1,param2);
    var _loc5_ = _loc4_.length - 1;
    while(_loc5_ >= 0)
    {
        if(!param2.distanceSmallThan(_loc4_[_loc5_],param3))
        {
            ArrayHelperClass.removeItemAt(_loc4_,_loc5_);
        }
        _loc5_--;
    }
    return _loc4_;
}
/*
package §-_-___---__§
{
   import §-___--____-_--§.my_error_logger;
   import com.qunhe.commons.lang.someArrayHelper_AHH;
   import com.qunhe.commons.math.geom.my2D_Edge;
   import com.qunhe.commons.math.geom.Circle;
   import com.qunhe.commons.math.geom.Vec2;
   
   public class circleEdgeHelper
   {
      
      private static const TOLERANCE:Number = 1.0E-6;
       
      
      public function circleEdgeHelper()
      {
         super();
         throw new my_error_logger();
      }
      
      public static function getLiteIntersetionPoints(param1:Circle, param2:my2D_Edge, param3:Number = 1.0E-6) : Vector.<Vec2>
      {
         var _loc4_:Vector.<Vec2> = getEdgeCircleIntersectionPoints(param1,param2);
         var _loc5_:int = _loc4_.length - 1;
         while(_loc5_ >= 0)
         {
            if(!param2.distanceSmallThan(_loc4_[_loc5_],param3))
            {
               someArrayHelper_AHH.removeItemAt(_loc4_,_loc5_);
            }
            _loc5_--;
         }
         return _loc4_;
      }
      
      public static function getEdgeCircleIntersectionPoints(param1:Circle, param2:my2D_Edge) : Vector.<Vec2>
      {
         var _loc7_:Number = NaN;
         var _loc8_:Vec2 = null;
         var _loc9_:Number = NaN;
         var _loc3_:Vector.<Vec2> = new Vector.<Vec2>();
         if(my_number.isZeroOrOrigin(param2.length))
         {
            return _loc3_;
         }
         var _loc4_:Vec2 = param1.center;
         var _loc5_:Number = param1.radius;
         var _loc6_:Number = param2.getDistance(_loc4_,false);
         if(_loc6_ > _loc5_)
         {
            return _loc3_;
         }
         if(_loc6_ == _loc5_)
         {
            _loc3_.push(param2.project(_loc4_));
         }
         else
         {
            _loc7_ = param2.angle;
            _loc8_ = param2.project(_loc4_,false);
            _loc9_ = Math.sqrt(_loc5_ * _loc5_ - _loc6_ * _loc6_);

            _loc3_.push(_loc8_.addBySplitAngle(_loc9_,_loc7_));
            
            //这里loc9前面有个负号
            _loc3_.push(_loc8_.addBySplitAngle(-_loc9_,_loc7_));
         }
         return _loc3_;
      }
      
      public static function getCircleIntersectionPoints(param1:Circle, param2:Circle) : Vector.<Vec2>
      {
         var _loc10_:Vec2 = null;
         var _loc11_:Number = NaN;
         var _loc12_:Number = NaN;
         var _loc13_:Vec2 = null;
         var _loc14_:Number = NaN;
         var _loc3_:Vector.<Vec2> = new Vector.<Vec2>();
         var _loc4_:Vec2 = param1.center;
         var _loc5_:Vec2 = param2.center;
         var _loc6_:Number = param1.radius;
         var _loc7_:Number = param2.radius;
         var _loc8_:Number = _loc4_.distance(_loc5_);
         var _loc9_:my2D_Edge = new my2D_Edge(_loc4_,_loc5_);
         if(_loc8_ > _loc6_ + _loc7_)
         {
            return _loc3_;
         }
         if(_loc8_ == _loc6_ + _loc7_)
         {
            _loc3_.push(_loc9_.getCenter());
         }
         else
         {
            _loc10_ = new my2D_Edge(_loc4_,_loc5_).getCenter();
            _loc11_ = _loc8_ / 2 + (_loc6_ * _loc6_ - _loc7_ * _loc7_) / (2 * _loc8_);
            _loc12_ = Math.sqrt(_loc6_ * _loc6_ - _loc11_ * _loc11_);
            _loc13_ = _loc9_.§--_----___--§(_loc11_);
            _loc14_ = _loc9_.angle + Angle.HALF_PI;
            _loc3_.push(_loc13_.addBySplitAngle(_loc12_,_loc14_));
            _loc3_.push(_loc13_.addBySplitAngle(-_loc12_,_loc14_));
         }
         return _loc3_;
      }
   }
}
*/