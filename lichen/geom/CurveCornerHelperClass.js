function curveCornerHelperClass(param1) {
    this.mMap1 = null;
    this.mMap2 = new MyMap();
    
    for (var i = 0; i < param1.length; i++)
    {
        this.addONE_PART(param1[i]);
    }
         
}
curveCornerHelperClass.CONST_STRING_ARROW = ">>";

curveCornerHelperClass.prototype.checkDupAdd = function(param1)
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

curveCornerHelperClass.prototype.addONE_PART = function(param1)
{
    var _loc2_ = param1.mStart;
    var _loc3_ = param1.mEnd;
    this.checkDupAdd(_loc2_);
    this.checkDupAdd(_loc3_);
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
    //for each(object in ordered)
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
    //while(_loc2_.hasNext())
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
    param3.addONE_PART(param2);
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
    var _loc2_ = [];//Vector.<m_pathOrMyPathClass> = new Vector.<m_pathOrMyPathClass>();

    var _loc3_ = this.mMap2.keysToArray();

    for (var i = 0; i < _loc3_.length; i++)
    //while(_loc3_.hasNext())
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

/*
package §-____------_-_§
{
   import §-_-___---__§.my_math;
   import com.qunhe.commons.lang.ArrayHelperClass;
   import com.qunhe.commons.math.geom.Vec2;
   import com.qunhe.instdeco.model.decoration.curveBasicClass;
   import com.qunhe.instdeco.model.decoration.cornerBasicClass;
   import org.as3commons.collections.Map;
   import org.as3commons.collections.framework.IIterator;
   import org.as3commons.logging.api.ILogger;
   import org.as3commons.logging.api.getLogger;
   
   public class curveCornerHelperClass
   {
      
      private static const LOG:ILogger = getLogger(curveCornerHelperClass);
      
      private static const CONST_STRING_ARROW:String = ">>";
       
      
      private var m_map_1:Map;
      
      private var m_map_2:Map;
      
      public function curveCornerHelperClass(param1:Vector.<curveBasicClass>)
      {
         var _loc2_:curveBasicClass = null;
         super();
         this.m_map_2 = new Map();
         for each(_loc2_ in param1)
         {
            this.addONE_PART(_loc2_);
         }
      }
      
      public function getPaths_eh() : Vector.<m_pathOrMyPathClass>
      {
         var _loc4_:Vector.<curveBasicClass> = null;
         var _loc5_:curveBasicClass = null;
         var _loc6_:m_pathOrMyPathClass = null;
         this.getRightOrder();
         var _loc1_:cornerBasicClass = null;
         var _loc2_:Vector.<m_pathOrMyPathClass> = new Vector.<m_pathOrMyPathClass>();
         var _loc3_:IIterator = this.m_map_2.keyIterator();
         while(_loc3_.hasNext())
         {
            _loc1_ = _loc3_.next();
            _loc4_ = this.getCurvesByCorner(_loc1_);
            for each(_loc5_ in _loc4_)
            {
               _loc6_ = new m_pathOrMyPathClass();
               _loc6_.mStart = _loc1_;
               this.getPathByCornerCurve(_loc1_,_loc5_,_loc6_);
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
      
      public function getPathesFromCurve(param1:curveBasicClass) : Vector.<m_pathOrMyPathClass>
      {
         var _loc4_:cornerBasicClass = null;
         var _loc5_:m_pathOrMyPathClass = null;
         this.getRightOrder();
         var _loc2_:Vector.<m_pathOrMyPathClass> = new Vector.<m_pathOrMyPathClass>();
         var _loc3_:Vector.<cornerBasicClass> = param1.cloneCurve();
         for each(_loc4_ in _loc3_)
         {
            _loc5_ = new m_pathOrMyPathClass();
            _loc5_.mStart = _loc4_;
            this.getPathByCornerCurve(_loc4_,param1,_loc5_);
            if(_loc5_.getSize() > 1)
            {
               _loc5_.buildCurveAndCorner();
               _loc2_.push(_loc5_);
            }
         }
         this.clearMap_1();
         return _loc2_;
      }
      
      private function getRightOrder() : void
      {
         var _loc1_:cornerBasicClass = null;
         var _loc2_:IIterator = this.m_map_2.keyIterator();
         while(_loc2_.hasNext())
         {
            _loc1_ = _loc2_.next();
            this.orderCurves(_loc1_);
         }
         this.m_map_1 = new Map();
      }
      
      private function clearMap_1() : void
      {
         this.m_map_1 = null;
      }
      
      private function getPathByCornerCurve(param1:cornerBasicClass, param2:curveBasicClass, param3:m_pathOrMyPathClass) : void
      {
         if(this.containsCurve1AndCurve2(param1,param2))
         {
            return;
         }
         param3.addONE_PART(param2);
         this.addOne_to_map(param1,param2);
         var _loc4_:cornerBasicClass = param2.getStartOrEndOrNull(param1);
         var _loc5_:Vector.<curveBasicClass> = this.getCurvesByCorner(_loc4_);
         var _loc6_:int = _loc5_.indexOf(param2);
         var _loc7_:int = (_loc6_ + 1) % _loc5_.length;
         var _loc8_:curveBasicClass = _loc5_[_loc7_];
         this.getPathByCornerCurve(_loc4_,_loc8_,param3);
      }
      
      private function addOne_to_map(param1:cornerBasicClass, param2:curveBasicClass) : void
      {
         var _loc3_:String = param1.mId + CONST_STRING_ARROW + param2.mId;
         this.m_map_1.add(_loc3_,true);
      }
      
      private function containsCurve1AndCurve2(param1:cornerBasicClass, param2:curveBasicClass) : Boolean
      {
         var _loc3_:String = param1.mId + CONST_STRING_ARROW + param2.mId;
         return this.m_map_1.hasKey(_loc3_);
      }
      
      private function addONE_PART(param1:curveBasicClass) : void
      {
         var _loc2_:cornerBasicClass = param1.mStart;
         var _loc3_:cornerBasicClass = param1.mEnd;
         this.checkDupAdd(_loc2_);
         this.checkDupAdd(_loc3_);
         ArrayHelperClass.ifHasAndSave(this.getCurvesByCorner(_loc2_),param1);
         ArrayHelperClass.ifHasAndSave(this.getCurvesByCorner(_loc3_),param1);
      }
      
      private function checkDupAdd(param1:cornerBasicClass) : void
      {
         if(!this.m_map_2.hasKey(param1))
         {
            this.m_map_2.add(param1,new Vector.<curveBasicClass>());
         }
      }
      
      private function getCurvesByCorner(param1:cornerBasicClass) : Vector.<curveBasicClass>
      {
         return this.m_map_2.itemFor(param1);
      }
      
      private function orderCurves(param1:cornerBasicClass) : void
      {
         var curve:curveBasicClass = null;
         var object:Object = null;
         var reverse:Boolean = false;
         var approxPoints:Vector.<Vec2> = null;
         var angle:Number = NaN;
         var corner:cornerBasicClass = param1;
         var connections:Vector.<curveBasicClass> = this.getCurvesByCorner(corner);
         var ordered:Array = [];
         for each(curve in connections)
         {
            reverse = curve.mStart != corner;
            approxPoints = curve.switchOrder(reverse);
            if(approxPoints.length < 2 || approxPoints[0] == null || approxPoints[1] == null)
            {
               LOG.error("Curve approxPoints illegal. curve mId:{0}",[curve.mId]);
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
         ordered.sort(function(param1:Object, param2:Object):int
         {
            return my_math.sign(param2.angle - param1.angle);
         });
         connections.length = 0;
         for each(object in ordered)
         {
            connections.push(object.curve);
         }
      }
   }
}
*/
