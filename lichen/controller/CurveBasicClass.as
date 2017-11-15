package com.qunhe.instdeco.model.decoration
{
   import §--_-__-_§.AssetShowHideControlInterface;
   import §-___--____-_--§.SomeError;
   import §-___--____-_--§.IllegalArgumentError;
   import §-____------_-_§.m_pathOrMyPathClass;
   import com.qunhe.commons.lang.ArrayHelperClass;
   import com.qunhe.commons.lang.§-_____-_-_--_§;
   import com.qunhe.commons.lang.ObjectIndex;
   import com.qunhe.commons.math.geom.polyLine_Class;
   import com.qunhe.commons.math.geom.my2D_Edge;
   import com.qunhe.commons.math.geom.myCurveClass;
   import com.qunhe.commons.math.geom.Vec2;
   import com.qunhe.instdeco.model.decoration.enum.DecoCornerType;
   import com.qunhe.instdeco.model.decoration.enum.DecoCurvePointSide;
   import com.qunhe.instdeco.model.decoration.enum.DecoMoldingPlacement;
   import com.qunhe.instdeco.model.decoration.enum.DecoSideType;
   
   public class curveBasicClass extends ObjectIndex implements AssetShowHideControlInterface
   {
      
      public static const WIRED_THRESHOLD:Number = 1.01376;
      
      protected static const TOLERANCE:Number = 1.0E-6;
       
      
      protected var mm_start:cornerBasicClass;
      
      protected var mm_end:cornerBasicClass;
      //仅指左右两边的区域
      protected var mAreas:Vector.<AreaFatherClass>;
      
      private var m_isValidShowOrNotFlag:Boolean = true;
      
      public function curveBasicClass()
      {
         super();
      }
      
      override protected function initialize() : void
      {
         this.mAreas = new Vector.<AreaFatherClass>();
      }
      
      override public function dispose() : void
      {
         var _loc2_:cornerBasicClass = null;
         var _loc3_:AreaFatherClass = null;
         super.dispose();
         var _loc1_:Vector.<cornerBasicClass> = this.cloneCurve();
         for each(_loc2_ in _loc1_)
         {
            if(_loc2_ != null)
            {
               _loc2_.removeSpecificCurve_AH(this);
               if(_loc2_.curves.length == 0)
               {
                  _loc2_.dispose();
               }
            }
         }
         for each(_loc3_ in this.mAreas)
         {
            _loc3_.removeSpecificCurve_AH(this);
         }
      }
      
      public function isHasAndSaveOnCurve(param1:AreaFatherClass) : Boolean
      {
         var _loc2_:Boolean = ArrayHelperClass.ifHasAndSave(this.mAreas,param1);
         return _loc2_;
      }
      
      public function wallDleleteSame(param1:AreaFatherClass) : Boolean
      {
         return ArrayHelperClass.removeItem(this.mAreas,param1);
      }
      
      public function initialCurveAreas() : void
      {
         this.mAreas = new Vector.<AreaFatherClass>();
      }
      
      public function setCornerStartAndEndButHasToBeSame(param1:cornerBasicClass, param2:cornerBasicClass) : void
      {
         if(param1 == this.mm_start)
         {
            this.m_Start = param2;
         }
         if(param1 == this.mm_end)
         {
            this.m_End = param2;
         }
      }
      
      public function §-----_-_____§(param1:cornerBasicClass) : Boolean
      {
         return param1 == this.mm_start || param1 == this.mm_end;
      }
      
      public function validateDisplay() : void
      {
         this.m_isValidShowOrNotFlag = false;
      }
      
      public function invalidateDisplay() : void
      {
         this.m_isValidShowOrNotFlag = true;
      }
      
      public function isDisplayStateValid() : Boolean
      {
         return this.m_isValidShowOrNotFlag == false;
      }
      
      public function invalidate() : void
      {
         this.invalidateDisplay();
      }
      
      public function invalidateStructure() : void
      {
      }
      
      public function isInsideMyArea(param1:Vec2, param2:Boolean = false, param3:Number = 1.0E-6) : Boolean
      {
         throw new SomeError();
      }
      
      public function getTheCurveStartEndEdgeToPointDistance(param1:Vec2, param2:Boolean = true) : Number
      {
         throw new SomeError();
      }
      
      public function §-_-_-_-____-_§(param1:curveBasicClass, param2:Vector.<Vec2> = null, param3:Boolean = false, param4:Number = 1.0E-6) : Boolean
      {
         throw new SomeError();
      }
      
      public function §-___________--§(param1:my2D_Edge, param2:Vector.<Vec2> = null, param3:Boolean = false, param4:Number = 1.0E-6) : Boolean
      {
         throw new SomeError();
      }
      
      public function isCurveIntersectByAreaAndGetIntersectPoint(param1:myCurveClass, param2:Vector.<Vec2> = null, param3:Boolean = false, param4:Number = 1.0E-6) : Boolean
      {
         throw new SomeError();
      }
      
      public function isStart(param1:cornerBasicClass) : Boolean
      {
         return §-_____-_-_--_§.isEqual(this.mm_start,param1);
      }
      
      public function isEnd(param1:cornerBasicClass) : Boolean
      {
         return §-_____-_-_--_§.isEqual(this.mm_end,param1);
      }
      
      public function getClosestPoint(param1:Vec2) : Vec2
      {
         throw new SomeError();
      }
      
      public function getCenter() : Vec2
      {
         throw new SomeError();
      }
      
      public function switchOrder(param1:Boolean = false) : Vector.<Vec2>
      {
         throw new SomeError();
      }
      
      public function getTheStartEndEdge() : my2D_Edge
      {
         return new my2D_Edge(this.start,this.end);
      }
      
      public function cloneCurve() : Vector.<cornerBasicClass>
      {
         return new <cornerBasicClass>[this.m_Start,this.m_End];
      }
      
      public function getStartOrEndOrNull(param1:cornerBasicClass) : cornerBasicClass
      {
         if(param1 == this.mm_start)
         {
            return this.mm_end;
         }
         if(param1 == this.mm_end)
         {
            return this.mm_start;
         }
         return null;
      }
      
      public function §---___--_-___§() : polyLine_Class
      {
         return new polyLine_Class(this.switchOrder());
      }
      
      public function §--_-__-_-_§(param1:cornerBasicClass) : Number
      {
         if(!this.§-----_-_____§(param1))
         {
            throw new IllegalArgumentError("Corner is not contained in curve.");
         }
         var _loc2_:* = this.mm_start != param1;
         var _loc3_:Vector.<Vec2> = this.switchOrder(_loc2_);
         if(_loc3_.length < 2 || _loc3_[0] == null || _loc3_[1] == null)
         {
            throw new IllegalArgumentError("Length of approximate points less than 2.");
         }
         return Vec2.getAngleByTan(_loc3_[0],_loc3_[1]);
      }
      
      public function §-__--___-_-_-§(param1:cornerBasicClass) : DecoCornerType
      {
         if(§-_____-_-_--_§.isEqual(param1,this.mm_start))
         {
            return DecoCornerType.START;
         }
         if(§-_____-_-_--_§.isEqual(param1,this.mm_end))
         {
            return DecoCornerType.END;
         }
         return DecoCornerType.NONE;
      }
      
      public function §-___---__-_-__§(param1:DecoCornerType) : cornerBasicClass
      {
         switch(param1)
         {
            case DecoCornerType.START:
               return this.m_Start;
            case DecoCornerType.END:
               return this.m_End;
            default:
               return null;
         }
      }
      
      public function §-_-__-___-§(param1:DecoSideType) : §--__-_----__-§
      {
         if(param1 == DecoSideType.LEFT)
         {
            return this.§-__-____---_--§;
         }
         if(param1 == DecoSideType.RIGHT)
         {
            return this.§---____-__--§;
         }
         return null;
      }
      
      public function §-_---__-_-_-_§(param1:DecoSideType) : AreaFatherClass
      {
         if(this.mAreas.length < 1)
         {
            return null;
         }
         var _loc2_:m_pathOrMyPathClass = this.mAreas[0].path;
         if(param1 == DecoSideType.RIGHT && _loc2_.isCurveInPath_not_sure(this) || param1 == DecoSideType.LEFT && !_loc2_.isCurveInPath_not_sure(this))
         {
            return this.mAreas[0];
         }
         return this.§---_-_-----__§(this.mAreas[0]);
      }
      
      public function §-__-_-__---_-§(param1:AreaFatherClass) : DecoSideType
      {
         if(this.mAreas.indexOf(param1) == -1)
         {
            return DecoSideType.NONE;
         }
         var _loc2_:m_pathOrMyPathClass = param1.path;
         var _loc3_:Number = _loc2_.curves.indexOf(this);
         if(_loc3_ != -1 || this.mAreas.length == 1)
         {
            if(_loc2_.isCurveInPath_not_sure(this))
            {
               return DecoSideType.RIGHT;
            }
            return DecoSideType.LEFT;
         }
         _loc2_ = this.§---_-_-----__§(param1).path;
         if(_loc2_.isCurveInPath_not_sure(this))
         {
            return DecoSideType.LEFT;
         }
         return DecoSideType.RIGHT;
      }
      
      public function §---_-_-----__§(param1:AreaFatherClass) : AreaFatherClass
      {
         if(this.mAreas.length != 2)
         {
            return null;
         }
         if(param1 == this.mAreas[0])
         {
            return this.mAreas[1];
         }
         if(param1 == this.mAreas[1])
         {
            return this.mAreas[0];
         }
         return null;
      }
      
      public function §-_-__-_---_§() : AreaFatherClass
      {
         var _loc1_:AreaFatherClass = null;
         var _loc2_:AreaFatherClass = null;
         if(this.mAreas.length == 1)
         {
            return this.mAreas[0];
         }
         if(this.mAreas.length == 2)
         {
            _loc1_ = this.mAreas[0];
            _loc2_ = this.mAreas[1];
            if(_loc1_.funcGetAreaNotUnderStand == _loc2_)
            {
               return _loc1_;
            }
            if(_loc2_.funcGetAreaNotUnderStand == _loc1_)
            {
               return _loc2_;
            }
         }
         return null;
      }
      
      public function §-_________-_--§() : AreaFatherClass
      {
         var _loc1_:AreaFatherClass = null;
         var _loc2_:AreaFatherClass = null;
         if(this.mAreas.length == 1)
         {
            return this.mAreas[0];
         }
         if(this.mAreas.length == 2)
         {
            _loc1_ = this.mAreas[0];
            _loc2_ = this.mAreas[1];
            if(_loc1_.funcGetAreaNotUnderStand == _loc2_)
            {
               return _loc2_;
            }
            if(_loc2_.funcGetAreaNotUnderStand == _loc1_)
            {
               return _loc1_;
            }
         }
         return null;
      }
      
      public function decideSide(param1:Vec2) : DecoCurvePointSide
      {
         throw new SomeError();
      }
      
      public function getMoldingByPlacement(param1:DecoMoldingPlacement) : §---___-_---_-§
      {
         throw new SomeError();
      }
      
      public function getMoldingPlacement(param1:§---___-_---_-§) : DecoMoldingPlacement
      {
         throw new SomeError();
      }
      
      public function get length() : Number
      {
         throw new SomeError();
      }
      
      public function get start() : Vec2
      {
         return this.m_Start != null?this.m_Start.position:null;
      }
      
      public function set start(param1:Vec2) : void
      {
         this.mm_start.position = param1;
      }
      
      public function get end() : Vec2
      {
         return this.m_End != null?this.m_End.position:null;
      }
      
      public function set end(param1:Vec2) : void
      {
         this.mm_end.position = param1;
      }
      
      public function get m_Start() : cornerBasicClass
      {
         return this.mm_start;
      }
      
      public function set m_Start(param1:cornerBasicClass) : void
      {
         if(this.mm_start != null)
         {
            this.mm_start.removeSpecificCurve_AH(this);
         }
         this.mm_start = param1;
         if(this.mm_start != null)
         {
            this.mm_start.addONE_PART(this);
         }
      }
      
      public function get m_End() : cornerBasicClass
      {
         return this.mm_end;
      }
      
      public function set m_End(param1:cornerBasicClass) : void
      {
         if(this.mm_end != null)
         {
            this.mm_end.removeSpecificCurve_AH(this);
         }
         this.mm_end = param1;
         if(this.mm_end != null)
         {
            this.mm_end.addONE_PART(this);
         }
      }
      
      public function get areas() : Vector.<AreaFatherClass>
      {
         return this.mAreas;
      }
      
      public function set areas(param1:Vector.<AreaFatherClass>) : void
      {
         this.mAreas = param1;
      }
      
      public function get §-__-____---_--§() : §--__-_----__-§
      {
         return null;
      }
      
      public function get §---____-__--§() : §--__-_----__-§
      {
         return null;
      }
   }
}
