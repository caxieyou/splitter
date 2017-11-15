function curveAreaRelationshipHelper() {
    
}

//public static function isHole(param1:wallAreas_Class) : Boolean
curveAreaRelationshipHelper.isHole = function(param1)
{
    var _loc2_ = null;
    var _loc3_ = null;
    var _loc4_ = null;
    if(param1.mWall.mHoles != null)
    {
        _loc3_ = param1.generateElementDiscribeUnit().getValidGravityCenter();
        //for each(_loc4_ in mWall.mHoles)
        for (var i = 0; i < param1.mWall.mHoles.length; i++)
        {
            if(param1.mWall.mHoles[i].mPolygon.contains(_loc3_))
            {
                return true;
            }
        }
        return false;
    }
    
    //if(param1.getDectorationFunc.length != 0)
    //{
    //    return false;
    //}
    
    for (var i = 0; i < param1.mCurves.length; i++)
    //for each(_loc2_ in param1.curves)
    {
        if(param1.mCurves[i].type == WallCurveType.DEFAULT_LINE)
        {
            return false;
        }
    }
    return true;
}

curveAreaRelationshipHelper.getHoleParts = function(param1) 
{
    var _loc3_ = null;
    var _loc2_ = [];//Vector.<wallAreas_Class> = new Vector.<wallAreas_Class>();
    if(param1.length >= 2)
    {
        for (var i = 0; i < param1.length; i++)
        //for each(_loc3_ in param1)
        {
            if(curveAreaRelationshipHelper.isHole(param1[i]))
            {
                _loc2_.push(param1[i]);
            }
        }
    }
    return _loc2_;
}
/*
package §-_-_-___--_--§
{
   import §-___--____-_--§.my_error_logger;
   import com.qunhe.commons.math.geom.my_Rect;
   import com.qunhe.commons.math.geom.Vec2;
   import com.qunhe.instdeco.model.wall.wallAreas_Class;
   import com.qunhe.instdeco.model.wall.wallCurve;
   import com.qunhe.instdeco.model.wall.enum.WallCurveType;
   
   public final class curveAreaRelationshipHelper
   {
       
      
      public function curveAreaRelationshipHelper()
      {
         super();
         throw new my_error_logger();
      }
      
      public static function isHole(param1:wallAreas_Class) : Boolean
      {
         var _loc2_:wallCurve = null;
         var _loc3_:Vec2 = null;
         var _loc4_:wallAreas_Class = null;
         if(param1.wall.holes != null)
         {
            _loc3_ = param1.generateElementDiscribeUnit().getValidGravityCenter();
            for each(_loc4_ in param1.wall.holes)
            {
               if(_loc4_.polygon_Get_Or_Parameter.contains(_loc3_))
               {
                  return true;
               }
            }
            return false;
         }
         if(param1.getDectorationFunc.length != 0)
         {
            return false;
         }
         for each(_loc2_ in param1.curves)
         {
            if(_loc2_.type == WallCurveType.DEFAULT_LINE)
            {
               return false;
            }
         }
         return true;
      }
      
      public static function containsPointByAreas(param1:Vec2, param2:Vector.<wallAreas_Class>) : wallAreas_Class
      {
         var _loc3_:wallAreas_Class = null;
         for each(_loc3_ in param2)
         {
            if(_loc3_.containsPoint(param1,true))
            {
               return _loc3_;
            }
         }
         return null;
      }
      
      public static function §-____-_-__-__-§(param1:wallAreas_Class) : Vec2
      {
         var _loc2_:my_Rect = param1.getBoundingBox();
         return new Vec2(_loc2_.min.x,_loc2_.min.y);
      }
      
      public static function §------_---§(param1:wallAreas_Class) : Vec2
      {
         var _loc2_:my_Rect = param1.getBoundingBox();
         return new Vec2(_loc2_.getCenter().x,_loc2_.min.y);
      }
      
      public static function §--___--_--__-§(param1:wallAreas_Class) : Vec2
      {
         var _loc2_:my_Rect = param1.getBoundingBox();
         return new Vec2(_loc2_.max.x,_loc2_.min.y);
      }
      
      public static function §------__-__--§(param1:wallAreas_Class) : Vec2
      {
         var _loc2_:my_Rect = param1.getBoundingBox();
         return new Vec2(_loc2_.min.x,_loc2_.getCenter().y);
      }
      
      public static function §--_-_____--_§(param1:wallAreas_Class) : Vec2
      {
         var _loc2_:my_Rect = param1.getBoundingBox();
         return new Vec2(_loc2_.getCenter().x,_loc2_.getCenter().y);
      }
      
      public static function §-_____-__-_-__§(param1:wallAreas_Class) : Vec2
      {
         var _loc2_:my_Rect = param1.getBoundingBox();
         return new Vec2(_loc2_.max.x,_loc2_.getCenter().y);
      }
      
      public static function §-__---------_§(param1:wallAreas_Class) : Vec2
      {
         var _loc2_:my_Rect = param1.getBoundingBox();
         return new Vec2(_loc2_.min.x,_loc2_.max.y);
      }
      
      public static function §-__-_-___--__§(param1:wallAreas_Class) : Vec2
      {
         var _loc2_:my_Rect = param1.getBoundingBox();
         return new Vec2(_loc2_.getCenter().x,_loc2_.max.y);
      }
      
      public static function §--__-__--§(param1:wallAreas_Class) : Vec2
      {
         var _loc2_:my_Rect = param1.getBoundingBox();
         return new Vec2(_loc2_.max.x,_loc2_.max.y);
      }
      
      public static function §--__-_-__§(param1:String, param2:Vector.<wallAreas_Class>) : wallAreas_Class
      {
         var _loc3_:wallAreas_Class = null;
         for each(_loc3_ in param2)
         {
            if(_loc3_.id == param1)
            {
               return _loc3_;
            }
         }
         return null;
      }
      
      public static function getHoleParts(param1:Vector.<wallAreas_Class>) : Vector.<wallAreas_Class>
      {
         var _loc3_:wallAreas_Class = null;
         var _loc2_:Vector.<wallAreas_Class> = new Vector.<wallAreas_Class>();
         if(param1.length >= 2)
         {
            for each(_loc3_ in param1)
            {
               if(isHole(_loc3_))
               {
                  _loc2_.push(_loc3_);
               }
            }
         }
         return _loc2_;
      }
   }
}
*/