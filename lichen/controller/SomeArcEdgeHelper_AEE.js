function someArcEdgeHelper_AEE() {

}
someArcEdgeHelper_AEE.getCurveIntersectionPoints = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 1.0E-6;
    }
    var _loc6_ = null;
    var _loc4_ = circleEdgeHelper.getCircleIntersectionPoints(param1.createCircle_canvas(),param2.createCircle_canvas());
    var _loc5_ = _loc4_.length - 1;
    while(_loc5_ >= 0)
    {
        _loc6_ = _loc4_[_loc5_];
        if(!param1.isInsideArcFan(_loc6_,param3) || !param2.isInsideArcFan(_loc6_,param3))
        {
            ArrayHelperClass.removeItemAt(_loc4_,_loc5_);
        }
        _loc5_--;
    }
    return _loc4_;
}

someArcEdgeHelper_AEE.getValidIntersectionPointBetweenArcAndEdge = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 1.0E-6;
    }
    var _loc4_ = circleEdgeHelper.getLiteIntersetionPoints(param1.createCircle_canvas(),param2,param3);
    var _loc5_ = _loc4_.length - 1;
    while(_loc5_ >= 0)
    {
        if(!param1.isInsideArcFan(_loc4_[_loc5_]))
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
   import com.qunhe.commons.math.geom.myCurveClass;
   import com.qunhe.commons.math.geom.Vec2;
   import com.qunhe.commons.math.types.ArcCurveAngle;
   import com.qunhe.commons.math.types.ArcCurveEndType;
   
   public class someArcEdgeHelper_AEE
   {
      
      private static const TOLERANCE:Number = 1.0E-6;
       
      
      public function someArcEdgeHelper_AEE()
      {
         super();
         throw new my_error_logger();
      }
      
      public static function §-_-______--__§(param1:myCurveClass, param2:my2D_Edge, param3:Number = 1.0E-6) : Vector.<Vec2>
      {
         var _loc4_:Vector.<Vec2> = circleEdgeHelper.getEdgeCircleIntersectionPoints(param1.createCircle_canvas(),param2);
         var _loc5_:int = _loc4_.length - 1;
         while(_loc5_ >= 0)
         {
            if(!param1.isInsideArcFan(_loc4_[_loc5_]))
            {
               someArrayHelper_AHH.removeItemAt(_loc4_,_loc5_);
            }
            _loc5_--;
         }
         return _loc4_;
      }
      
      public static function getValidIntersectionPointBetweenArcAndEdge(param1:myCurveClass, param2:my2D_Edge, param3:Number = 1.0E-6) : Vector.<Vec2>
      {
         var _loc4_:Vector.<Vec2> = circleEdgeHelper.getLiteIntersetionPoints(param1.createCircle_canvas(),param2,param3);
         var _loc5_:int = _loc4_.length - 1;
         while(_loc5_ >= 0)
         {
            if(!param1.isInsideArcFan(_loc4_[_loc5_]))
            {
               someArrayHelper_AHH.removeItemAt(_loc4_,_loc5_);
            }
            _loc5_--;
         }
         return _loc4_;
      }
      
      public static function getCurveIntersectionPoints(param1:myCurveClass, param2:myCurveClass, param3:Number = 1.0E-6) : Vector.<Vec2>
      {
         var _loc6_:Vec2 = null;
         var _loc4_:Vector.<Vec2> = circleEdgeHelper.getCircleIntersectionPoints(param1.createCircle_canvas(),param2.createCircle_canvas());
         var _loc5_:int = _loc4_.length - 1;
         while(_loc5_ >= 0)
         {
            _loc6_ = _loc4_[_loc5_];
            if(!param1.isInsideArcFan(_loc6_,param3) || !param2.isInsideArcFan(_loc6_,param3))
            {
               someArrayHelper_AHH.removeItemAt(_loc4_,_loc5_);
            }
            _loc5_--;
         }
         return _loc4_;
      }
      
      public static function §-__-_-_-__§(param1:myCurveClass, param2:myCurveClass, param3:Number = 1.0E-6) : Boolean
      {
         var point:Vec2 = null;
         var minAngle:ArcCurveAngle = null;
         var maxAngle:ArcCurveAngle = null;
         var startAngle:Number = NaN;
         var endAngle:Number = NaN;
         var angle:ArcCurveAngle = null;
         var angle2:ArcCurveAngle = null;
         var fullArcCurve:myCurveClass = null;
         var shortCurveStartAngle:Number = NaN;
         var shortCurveEndAngle:Number = NaN;
         var arcA:myCurveClass = param1;
         var arcB:myCurveClass = param2;
         var tolerance:Number = param3;
         var startA:ArcCurveAngle = new ArcCurveAngle(arcA.startAngle,ArcCurveEndType.START,arcA);
         var endA:ArcCurveAngle = new ArcCurveAngle(arcA.endAngle,ArcCurveEndType.END,arcA);
         var startB:ArcCurveAngle = new ArcCurveAngle(arcB.startAngle,ArcCurveEndType.START,arcB);
         var endB:ArcCurveAngle = new ArcCurveAngle(arcB.endAngle,ArcCurveEndType.END,arcB);
         var angles:Vector.<ArcCurveAngle> = new <ArcCurveAngle>[startA,endA,startB,endB];
         var shortCheckArcCurve:myCurveClass = null;
         var longCheckArcCurve:myCurveClass = null;
         var checkPoints:Vector.<Vec2> = new Vector.<Vec2>();
         var passCount:int = 0;
         angles.sort(function(param1:ArcCurveAngle, param2:ArcCurveAngle):Number
         {
            return param1.angle - param2.angle;
         });
         if(angles[0].arcCurve == angles[1].arcCurve)
         {
            minAngle = angles[0];
            maxAngle = angles[3];
            startAngle = 0;
            endAngle = 0;
            if(maxAngle.angle - Angle.CONST_2_PI > minAngle.angle)
            {
               longCheckArcCurve = maxAngle.arcCurve;
               if(minAngle.endType == ArcCurveEndType.START)
               {
                  startAngle = minAngle.angle;
                  endAngle = maxAngle.angle - Angle.CONST_2_PI;
               }
               else
               {
                  startAngle = maxAngle.angle - Angle.CONST_2_PI;
                  endAngle = minAngle.angle;
               }
               shortCheckArcCurve = new myCurveClass(minAngle.arcCurve.center,minAngle.arcCurve.radius,startAngle,endAngle - startAngle);
            }
            else
            {
               return false;
            }
         }
         else if(angles[1].arcCurve == angles[2].arcCurve)
         {
            shortCheckArcCurve = angles[1].arcCurve.clone();
            longCheckArcCurve = angles[0].arcCurve.clone();
         }
         else
         {
            angle = angles[1];
            angle2 = angles[2];
            fullArcCurve = angle.arcCurve;
            shortCurveStartAngle = 0;
            shortCurveEndAngle = 0;
            longCheckArcCurve = angle2.arcCurve.clone();
            if(angle.endType == ArcCurveEndType.START)
            {
               shortCurveStartAngle = angle.angle;
               shortCurveEndAngle = fullArcCurve.getCenterIntersectAngle(longCheckArcCurve.curvePosByRatio(angle2.angle));
            }
            else
            {
               shortCurveEndAngle = angle.angle;
               shortCurveStartAngle = fullArcCurve.getCenterIntersectAngle(longCheckArcCurve.curvePosByRatio(angle2.angle));
            }
            shortCheckArcCurve = new myCurveClass(fullArcCurve.center,fullArcCurve.radius,shortCurveStartAngle,shortCurveEndAngle - shortCurveStartAngle);
         }
         if(!my_number.isEqual(shortCheckArcCurve.length,0))
         {
            checkPoints.push(shortCheckArcCurve.getSplitPosByRatio(1 / 5),shortCheckArcCurve.getSplitPosByRatio(2 / 5),shortCheckArcCurve.getSplitPosByRatio(3 / 5),shortCheckArcCurve.getSplitPosByRatio(4 / 5));
         }
         for each(point in checkPoints)
         {
            if(longCheckArcCurve.isInsideArcFan(point,tolerance))
            {
               passCount++;
            }
         }
         return passCount >= 3;
      }
   }
}
*/