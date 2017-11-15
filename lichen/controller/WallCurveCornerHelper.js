function wallCurveCornerHelper() {

}

wallCurveCornerHelper.getSamePositionButNotSamePointerCorner = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 0.001
    }
    
    //var _loc4_ = null;
    var _loc5_ = NaN;
    for (var i = 0; i < param2.length; i++)
    //for each(_loc4_ in param2)
    {
        if(param2[i] != param1)
        {
            _loc5_ = Vec2.distance(param1.mPosition,param2[i].mPosition);
            if(_loc5_ < param3)
            {
                return param2[i];
            }
        }
    }
    return null;
}

wallCurveCornerHelper.getCornerByPos_XX = function(param1, param2, param3)
{
    if (param3 == null || param3 == undefined) {
        param3 = 0.001;
    }
    var _loc4_ = null;
    var _loc5_ = NaN;
    for (var i = 0; i < param2.length; i++)
    //for each(_loc4_ in param2)
    {
        _loc5_ = Vec2.distance(param1,param2[i].mPosition);
        if(_loc5_ < param3)
        {
            return param2[i];
        }
    }
    return null;
}


/*
package §-_-_-___--_--§
{
   import §-___--____-_--§.my_error_logger;
   import com.qunhe.commons.math.geom.Vec2;
   import com.qunhe.instdeco.model.wall.cornerSonClass;
   import com.qunhe.instdeco.model.wall.wallCurve;
   import com.qunhe.instdeco.model.wall.enum.WallCurveType;
   
   public class wallCurveCornerHelper_AX
   {
      
      private static const TOLERANCE:Number = 0.001;
      
      private static const §-_-__---__-_-§:Number = 1.0;
       
      
      public function wallCurveCornerHelper_AX()
      {
         super();
         throw new my_error_logger();
      }
      
      public static function getSamePositionButNotSamePointerCorner(param1:cornerSonClass, param2:Vector.<cornerSonClass>, param3:Number = 0.001) : cornerSonClass
      {
         var _loc4_:cornerSonClass = null;
         var _loc5_:Number = NaN;
         for each(_loc4_ in param2)
         {
            if(_loc4_ != param1)
            {
               _loc5_ = Vec2.distance(param1.position,_loc4_.position);
               if(_loc5_ < param3)
               {
                  return _loc4_;
               }
            }
         }
         return null;
      }
      
      public static function §----_______-§(param1:cornerSonClass) : Vector.<wallCurve>
      {
         var _loc4_:wallCurve = null;
         var _loc2_:Vector.<wallCurve> = wallCurve.cloneParameter(param1.curves);
         var _loc3_:Vector.<wallCurve> = new Vector.<wallCurve>();
         for each(_loc4_ in _loc2_)
         {
            if(_loc4_.type == WallCurveType.BORDER_LINE)
            {
               _loc3_.push(_loc4_);
            }
         }
         return _loc3_;
      }
      
      public static function getCornerByPos_XX(param1:Vec2, param2:Vector.<cornerSonClass>, param3:Number = 0.001) : cornerSonClass
      {
         var _loc4_:cornerSonClass = null;
         var _loc5_:Number = NaN;
         for each(_loc4_ in param2)
         {
            _loc5_ = Vec2.distance(param1,_loc4_.position);
            if(_loc5_ < param3)
            {
               return _loc4_;
            }
         }
         return null;
      }
   }
}
*/