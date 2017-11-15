function edgePointHelperClass() {
    
}

edgePointHelperClass.getCenter = function(param1)
{
    var _loc2_ = new Vec2(0,0);
    for(var i = 0; i < param1.length; i++)
    {
        _loc2_.add(param1[i]);
    }
    return _loc2_.mulBy(1 / param1.length);
}

edgePointHelperClass.removeItemAt = function(param1, param2)
{
    if(isNotEmpty(param1) && param2 < param1.length)
    {
        param1.splice(param2,1);
    }
}
//edgePointHelperClass.removeDuplicatePointsInHelper(param1:Vector.<Vec2>, param2:Number = 1.0E-6) : void
edgePointHelperClass.removeDuplicatePointsInHelper = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-5;
    }
    //param2 = param2 || 1.0E-6;
    var _loc4_ = 0;
    var _loc3_ = 0;
    while(_loc3_ < param1.length - 1)
    {
        _loc4_ = _loc3_ + 1;
        while(_loc4_ < param1.length)
        {
            if(Vec2.isEqual(param1[_loc3_],param1[_loc4_],param2))
            {
                param1.splice(_loc4_,1);
            }
            else
            {
                _loc4_++;
            }
        }
        _loc3_++;
    }
}

edgePointHelperClass.removeSame = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6
    }
    var _loc4_ = 0;
    var _loc3_ = 0;
    while(_loc3_ < param1.length - 1)
    {
        _loc4_ = _loc3_ + 1;
        while(_loc4_ < param1.length)
        {
            if(Vec2.isEqual(param1[_loc3_],param1[_loc4_],param2))
            {
              param1.splice(_loc4_,1);
              continue;
            }
            break;
        }
        _loc3_++;
    }
}

//public static function removeSamePoint(param1:Vector.<Vec2>, param2:Number = 1.0E-6) : void
edgePointHelperClass.removeSamePoint = function(param1, param2)
{
    if (param2 == null || param2 == undefined) {
        param2 = 1.0E-6
    }
    edgePointHelperClass.removeSame(param1,param2);
    var _loc3_ = param1.length;
    if(_loc3_ > 1 && Vec2.isEqual(param1[0],param1[_loc3_ - 1],param2))
    {
        param1.splice(_loc3_ - 1,1);
    }
}
/*
package §-_-___---__§
{
   import §-___--____-_--§.my_error_logger;
   import com.qunhe.commons.math.geom.my2D_Edge;
   import com.qunhe.commons.math.geom.Vec2;
   import flash.geom.Point;
   
   public class edgePointHelperClass
   {
      
      private static const THRESHOLD:Number = 1.0E-6;
      
      private static const DISTANCE_TOLERANCE:Number = 20;
       
      
      public function edgePointHelperClass()
      {
         super();
         throw new my_error_logger();
      }
      
      public static function transform(param1:Vector.<Vec2>, param2:Vec2, param3:Number, param4:Vec2) : Vector.<Vec2>
      {
         var _loc6_:Vec2 = null;
         var _loc5_:Vector.<Vec2> = new Vector.<Vec2>();
         for each(_loc6_ in param1)
         {
            _loc5_.push(_loc6_.transform(param2,param3,param4));
         }
         return _loc5_;
      }
      
      public static function translate(param1:Vector.<Vec2>, param2:Vec2) : Vector.<Vec2>
      {
         var _loc4_:Vec2 = null;
         var _loc3_:Vector.<Vec2> = new Vector.<Vec2>();
         for each(_loc4_ in param1)
         {
            _loc3_.push(Vec2.add(_loc4_,param2));
         }
         return _loc3_;
      }
      
      public static function rotate(param1:Vector.<Vec2>, param2:Number, param3:Vec2 = null) : Vector.<Vec2>
      {
         var _loc5_:Vec2 = null;
         var _loc4_:Vector.<Vec2> = new Vector.<Vec2>();
         for each(_loc5_ in param1)
         {
            _loc4_.push(_loc5_.rotate(param2,param3));
         }
         return _loc4_;
      }
      
      public static function scale(param1:Vector.<Vec2>, param2:Number) : Vector.<Vec2>
      {
         var _loc4_:Vec2 = null;
         var _loc3_:Vector.<Vec2> = new Vector.<Vec2>();
         for each(_loc4_ in param1)
         {
            _loc3_.push(_loc4_.mul(param2));
         }
         return _loc3_;
      }
      
      public static function getCenter(param1:Vector.<Vec2>) : Vec2
      {
         var _loc3_:Vec2 = null;
         var _loc2_:Vec2 = new Vec2(0,0);
         for each(_loc3_ in param1)
         {
            _loc2_.add(_loc3_);
         }
         return _loc2_.mulBy(1 / param1.length);
      }
      
      public static function clone(param1:Vector.<Vec2>) : Vector.<Vec2>
      {
         var _loc3_:Vec2 = null;
         var _loc2_:Vector.<Vec2> = new Vector.<Vec2>();
         for each(_loc3_ in param1)
         {
            _loc2_.push(_loc3_.clone());
         }
         return _loc2_;
      }
      
      public static function §-__---_---__§(param1:Vector.<Vec2>, param2:Vec2) : int
      {
         var _loc3_:int = param1.length;
         var _loc4_:int = 0;
         while(_loc4_ < _loc3_)
         {
            if(param1[_loc4_].isClose(param2,THRESHOLD))
            {
               return _loc4_;
            }
            _loc4_++;
         }
         return -1;
      }
      
      public static function removeDuplicatePointsInHelper(param1:Vector.<Vec2>, param2:Number = 1.0E-6) : void
      {
         var _loc4_:int = 0;
         var _loc3_:int = 0;
         while(_loc3_ < param1.length - 1)
         {
            _loc4_ = _loc3_ + 1;
            while(_loc4_ < param1.length)
            {
               if(Vec2.isEqual(param1[_loc3_],param1[_loc4_],param2))
               {
                  param1.splice(_loc4_,1);
               }
               else
               {
                  _loc4_++;
               }
            }
            _loc3_++;
         }
      }
      
      public static function removeSame(param1:Vector.<Vec2>, param2:Number = 1.0E-6) : void
      {
         var _loc4_:int = 0;
         var _loc3_:int = 0;
         while(_loc3_ < param1.length - 1)
         {
            _loc4_ = _loc3_ + 1;
            while(_loc4_ < param1.length)
            {
               if(Vec2.isEqual(param1[_loc3_],param1[_loc4_],param2))
               {
                  param1.splice(_loc4_,1);
                  continue;
               }
               break;
            }
            _loc3_++;
         }
      }
      
      public static function removeSamePoint(param1:Vector.<Vec2>, param2:Number = 1.0E-6) : void
      {
         removeSame(param1,param2);
         var _loc3_:int = param1.length;
         if(_loc3_ > 1 && Vec2.isEqual(param1[0],param1[_loc3_ - 1],param2))
         {
            param1.splice(_loc3_ - 1,1);
         }
      }
      
      public static function §-_-_-_-___---§(param1:Vector.<Vec2>, param2:Number = 1.0E-6) : void
      {
         var _loc3_:Vec2 = param1[param1.length - 1];
         removeSame(param1,param2);
         if(param1[param1.length - 1] !== _loc3_)
         {
            param1[param1.length - 1] = _loc3_;
         }
      }
      
      public static function §--_-_--_-_--_§(param1:Array) : Vector.<Vec2>
      {
         var _loc2_:Vector.<Vec2> = new Vector.<Vec2>();
         var _loc3_:int = param1.length;
         var _loc4_:int = 0;
         while(_loc4_ < _loc3_)
         {
            _loc2_.push(new Vec2(param1[_loc4_],param1[_loc4_ + 1]));
            _loc4_ = _loc4_ + 2;
         }
         return _loc2_;
      }
      
      public static function §-_------_-___§(param1:Vector.<Vec2>) : Array
      {
         var _loc3_:Vec2 = null;
         var _loc2_:Array = [];
         for each(_loc3_ in param1)
         {
            _loc2_.push(_loc3_.x,_loc3_.y);
         }
         return _loc2_;
      }
      
      public static function §-__-__-__---__§(param1:Vector.<Vec2>, param2:int) : Array
      {
         var _loc4_:Vec2 = null;
         var _loc3_:Array = [];
         for each(_loc4_ in param1)
         {
            _loc3_.push(_loc4_.§---___--__--§(param2));
         }
         return _loc3_;
      }
      
      public static function include_into_my_range(param1:Vector.<Point>) : Vector.<Vec2>
      {
         var _loc3_:Point = null;
         var _loc2_:Vector.<Vec2> = new Vector.<Vec2>();
         for each(_loc3_ in param1)
         {
            _loc2_.push(new Vec2(_loc3_.x,_loc3_.y));
         }
         return _loc2_;
      }
      
      public static function §-____--_----__§(param1:Vector.<Vec2>, param2:Number = 1, param3:Boolean = false) : Vector.<Vec2>
      {
         if(param3)
         {
            return §-____-__-_----§(param1,param2);
         }
         return §-__--_-__----§(param1,param2);
      }
      
      private static function §-__--_-__----§(param1:Vector.<Vec2>, param2:Number) : Vector.<Vec2>
      {
         var _loc6_:Vec2 = null;
         var _loc3_:Vector.<Vec2> = Vector.<Vec2>([param1[0]]);
         var _loc4_:int = param1.length;
         var _loc5_:Number = param2 * param2;
         var _loc7_:Vec2 = param1[0];
         var _loc8_:int = 1;
         while(_loc8_ < _loc4_)
         {
            _loc6_ = param1[_loc8_];
            if(_loc6_.distanceSquare(_loc7_) > _loc5_)
            {
               _loc3_.push(_loc6_);
               _loc7_ = _loc6_;
            }
            _loc8_++;
         }
         if(_loc7_ !== _loc6_)
         {
            _loc3_.push(_loc6_);
         }
         return _loc3_;
      }
      
      private static function §-____-__-_----§(param1:Vector.<Vec2>, param2:Number) : Vector.<Vec2>
      {
         var _loc9_:int = 0;
         var _loc10_:int = 0;
         var _loc11_:int = 0;
         var _loc15_:int = 0;
         var _loc3_:Vector.<Vec2> = new Vector.<Vec2>();
         var _loc4_:int = param1.length;
         var _loc5_:Number = param2 * param2;
         var _loc6_:Vector.<int> = new Vector.<int>();
         var _loc7_:Vector.<int> = new Vector.<int>();
         var _loc8_:Vector.<int> = new Vector.<int>(_loc4_);
         var _loc12_:int = 0;
         var _loc13_:int = _loc4_ - 1;
         _loc8_[_loc12_] = _loc8_[_loc13_] = 1;
         while(_loc13_ > 0)
         {
            _loc11_ = 0;
            _loc15_ = _loc12_ + 1;
            while(_loc15_ < _loc13_)
            {
               _loc10_ = new my2D_Edge(param1[_loc12_],param1[_loc13_]).verticalDistanceSquare(param1[_loc15_]);
               if(_loc10_ > _loc11_)
               {
                  _loc9_ = _loc15_;
                  _loc11_ = _loc10_;
               }
               _loc15_++;
            }
            if(_loc11_ > _loc5_)
            {
               _loc8_[_loc9_] = 1;
               _loc6_.push(_loc12_,_loc9_);
               _loc7_.push(_loc9_,_loc13_);
            }
            _loc12_ = _loc6_.pop();
            _loc13_ = _loc7_.pop();
         }
         var _loc14_:int = 0;
         while(_loc14_ < _loc4_)
         {
            if(_loc8_[_loc14_] == 1)
            {
               _loc3_.push(param1[_loc14_]);
            }
            _loc14_++;
         }
         return _loc3_;
      }
      
      public static function §--------_--__§(param1:Vec2, param2:Vector.<Vec2>) : Boolean
      {
         var _loc3_:Vec2 = null;
         for each(_loc3_ in param2)
         {
            if(param1.equals(_loc3_))
            {
               return true;
            }
         }
         return false;
      }
      
      public static function §-____--_-----_§(param1:Vector.<Vec2>, param2:Vec2, param3:Number = 20) : Vec2
      {
         var _loc5_:Vec2 = null;
         var _loc6_:Vec2 = null;
         var _loc7_:Number = NaN;
         var _loc4_:Number = Number.MAX_VALUE;
         for each(_loc6_ in param1)
         {
            _loc7_ = _loc6_.distanceSquare(param2);
            if(_loc7_ < _loc4_)
            {
               _loc4_ = _loc7_;
               _loc5_ = _loc6_;
            }
         }
         if(_loc4_ > param3 * param3)
         {
            return null;
         }
         return _loc5_;
      }
      
      public static function §-____--____-_-§(param1:Vector.<Vec2>, param2:Vec2, param3:Number = 20) : Vec2
      {
         var _loc5_:Vec2 = null;
         var _loc6_:Vec2 = null;
         var _loc7_:Number = NaN;
         var _loc4_:Number = Number.MAX_VALUE;
         for each(_loc6_ in param1)
         {
            _loc7_ = Math.abs(_loc6_.x - param2.x);
            if(_loc7_ < _loc4_)
            {
               _loc4_ = _loc7_;
               _loc5_ = _loc6_;
            }
         }
         if(_loc4_ > param3)
         {
            return null;
         }
         return _loc5_;
      }
      
      public static function §-_-_____-___§(param1:Vector.<Vec2>, param2:Vec2, param3:Number = 20) : Vec2
      {
         var _loc5_:Vec2 = null;
         var _loc6_:Vec2 = null;
         var _loc7_:Number = NaN;
         var _loc4_:Number = Number.MAX_VALUE;
         for each(_loc6_ in param1)
         {
            _loc7_ = Math.abs(_loc6_.y - param2.y);
            if(_loc7_ < _loc4_)
            {
               _loc4_ = _loc7_;
               _loc5_ = _loc6_;
            }
         }
         if(_loc4_ > param3)
         {
            return null;
         }
         return _loc5_;
      }
      
      public static function §---_--__-§(param1:Vector.<Vec2>) : Vec2
      {
         var _loc4_:Vec2 = null;
         var _loc2_:Number = param1[0].x;
         var _loc3_:Vec2 = param1[0].clone();
         for each(_loc4_ in param1)
         {
            if(_loc4_.x > _loc2_)
            {
               _loc2_ = _loc4_.x;
               _loc3_ = _loc4_.clone();
            }
         }
         return _loc3_;
      }
      
      public static function §-_--_-__--_§(param1:Vector.<Vec2>) : Vec2
      {
         var _loc4_:Vec2 = null;
         var _loc2_:Number = param1[0].y;
         var _loc3_:Vec2 = param1[0].clone();
         for each(_loc4_ in param1)
         {
            if(_loc4_.y > _loc2_)
            {
               _loc2_ = _loc4_.y;
               _loc3_ = _loc4_.clone();
            }
         }
         return _loc3_;
      }
   }
}

*/