function MyFloor() {
    this.mAreas;
    this.mCurves;
    this.mCorners;
    this.mHoles;
    this.mProfile;
    this.initialize();
    /*
    private var mAreas:Vector.<wallAreas_Class>;
      
    private var m_curves:Vector.<wallCurve>;

    private var mModels:Vector.<§-_--_-_-----§>;

    private var mBoundaries:Vector.<§-----_-__----§>;

    private var mCorners:Vector.<cornerSonClass>;

    private var mHoles:Vector.<wallAreas_Class>;

    private var mDesignDataId:String;

    private var mPosition:Vec2;

    private var mDisplayInfoDataId:String;

    private var mAttachedObjectId:String;

    private var mAttachedObjectIds:Object;

    private var mAttachedObjectType:int;

    private var mLine:my2D_Edge;
    */
}

MyFloor.prototype.initialize = function() {
    //this.mPosition = new Vec2();
    this.mAreas = [];//new Vector.<wallAreas_Class>();
    this.mCurves = [];//new Vector.<wallCurve>();
    //this.mModels = new Vector.<§-_--_-_-----§>();
    //this.mBoundaries = new Vector.<§-----_-__----§>();
    this.mCorners = [];//new Vector.<cornerSonClass>();
    this.mHoles = [];
    this.mProfile = null;
}

MyFloor.prototype.setProfile = function(rect) {
    this.mProfile = new MyPolytree();
    this.mProfile.mOutLines = rect;
    this.mProfile.mHoles = [];
}

MyFloor.prototype.generatePolyTree = function()
{
    
    //var _loc4_ = null;
    //var _loc5_ = null;
    //var _loc1_ = this.getTheBiggestAreaPath();
    
    //var _loc2_ = _loc1_ != null?_loc1_.polygon : new MyPolygon();
    //var _loc3_ = []; //new Vector.<my_polygon>();
    //for (var i = 0; i < this.mHoles.length; i++)
    //{
    //    _loc3_.push(this.mHoles[i].getPolygon());
    //}
    //_loc5_ = new MyPolytree(_loc2_,_loc3_);
    //return _loc5_;
    return this.mProfile;
}


MyFloor.prototype.getTheBiggestAreaPath = function()
{
    var pathFinder = new curveCornerHelperClass(this.mCurves);
    var paths = pathFinder.getPaths_eh();
    var counterClockPaths = MyPath.getCountClockWisePath(paths);
    //从大到小排序
    counterClockPaths.sort(function(param1, param2)
    {
        return MyMath.sign(Math.abs(param2.getArea()) - Math.abs(param1.getArea()));
    });
    if(counterClockPaths.length > 0)
    {
        return counterClockPaths[0];
    }
    
    return null;
}
   
MyFloor.prototype.correctAreas = function()
{
    var _loc2_ = null;
    var _loc3_ = null;
    var _loc1_ = CurveAreaRelationshipHelper.getHoleParts(this.mAreas);
    this.mHoles = [];//new Vector.<wallAreas_Class>();
    
    for (var i = 0; i < _loc1_.length; i++)
    //for each(_loc2_ in _loc1_)
    {
        this.mHoles.push(_loc1_[i]);
        
        for (var j = 0; j < _loc1_[i].mCurves.length; j++)
        //for each(_loc3_ in _loc1_[i].curves)
        {
            _loc3_ = _loc1_[i].mCurves[j];
            _loc3_.wallDleleteSame(_loc1_[i]);
        }
    }
    ArrayHelperClass.deleteSameValues(this.mAreas,_loc1_);
}

MyFloor.prototype.addONE_PART = function(param1)
{
    var _loc2_ = ArrayHelperClass.ifHasAndSave(this.mCurves,param1);
    if(_loc2_)
    {
        param1.mWall = this;
    }
    return _loc2_;
}

MyFloor.prototype.checkDupAdd = function(param1)
{
    if(param1 == null)
    {
        return false;
    }
    var _loc2_ = ArrayHelperClass.ifHasAndSave(this.mCorners,param1);
    if(_loc2_)
    {
        param1.mWall = this;
    }
    return _loc2_;
}

MyFloor.prototype.removeCorner = function(param1)
{
    return ArrayHelperClass.removeItem(this.mCorners,param1);
}

MyFloor.prototype.removeSpecificCurve_AH = function(param1)
{
    return ArrayHelperClass.removeItem(this.mCurves, param1);
}
/*
package com.qunhe.instdeco.model.wall
{
   import §--_-__-_§.resourceGetSetInterface;
   import §-_-_-___--_--§.CurveAreaRelationshipHelper;
   import §-_-___---__§.my_math;
   import §-____------_-_§.curveCornerHelperClass;
   import §-____------_-_§.m_pathOrMyPathClass;
   import com.qunhe.commons.lang.ArrayHelperClass;
   import com.qunhe.commons.lang.ObjectIndex;
   import com.qunhe.commons.math.geom.my_polygon;
   import com.qunhe.commons.math.geom.my_Rect;
   import com.qunhe.commons.math.geom.my_PolyTree;
   import com.qunhe.commons.math.geom.my2D_Edge;
   import com.qunhe.commons.math.geom.Vec2;
   import com.qunhe.instdeco.model.decoration.resource.DecoModelAsset;
   import com.qunhe.instdeco.model.decoration.resource.DecoResourceSet;
   import com.qunhe.instdeco.model.wall.data.WallDesignData;
   import com.qunhe.instdeco.model.wall.resource.ResourceSet;
   
   public class my_xx_wall extends ObjectIndex implements resourceGetSetInterface
   {
       
      
      private var mAreas:Vector.<wallAreas_Class>;
      
      private var m_curves:Vector.<wallCurve>;
      
      private var mModels:Vector.<§-_--_-_-----§>;
      
      private var mBoundaries:Vector.<§-----_-__----§>;
      
      private var mCorners:Vector.<cornerSonClass>;
      
      private var mHoles:Vector.<wallAreas_Class>;
      
      private var mDesignDataId:String;
      
      private var mPosition:Vec2;
      
      private var mDisplayInfoDataId:String;
      
      private var mAttachedObjectId:String;
      
      private var mAttachedObjectIds:Object;
      
      private var mAttachedObjectType:int;
      
      private var mLine:my2D_Edge;
      
      public function my_xx_wall()
      {
         super();
         this.initialize();
      }
      
      override protected function initialize() : void
      {
         this.mPosition = new Vec2();
         this.mAreas = new Vector.<wallAreas_Class>();
         this.m_curves = new Vector.<wallCurve>();
         this.mModels = new Vector.<§-_--_-_-----§>();
         this.mBoundaries = new Vector.<§-----_-__----§>();
         this.mCorners = new Vector.<cornerSonClass>();
      }
      
      public function deepClone() : my_xx_wall
      {
         var _loc1_:ResourceSet = this.getResources() as ResourceSet;
         var _loc2_:WallDesignData = new WallDesignData(this);
         var _loc3_:my_xx_wall = _loc2_.toObject() as my_xx_wall;
         _loc3_.setResources(_loc1_);
         return _loc3_;
      }
      
      public function isHasAndSaveOnCurve(param1:wallAreas_Class) : Boolean
      {
         var _loc2_:Boolean = ArrayHelperClass.ifHasAndSave(this.mAreas,param1);
         if(_loc2_)
         {
            param1.wall = this;
         }
         return _loc2_;
      }
      
      public function wallDleleteSame(param1:wallAreas_Class) : Boolean
      {
         return ArrayHelperClass.removeItem(this.mAreas,param1);
      }
      
      public function addONE_PART(param1:wallCurve) : Boolean
      {
         var _loc2_:Boolean = ArrayHelperClass.ifHasAndSave(this.m_curves,param1);
         if(_loc2_)
         {
            param1.wall = this;
         }
         return _loc2_;
      }
      
      public function removeSpecificCurve_AH(param1:wallCurve) : Boolean
      {
         return ArrayHelperClass.removeItem(this.m_curves,param1);
      }
      
      public function checkDupAdd(param1:cornerSonClass) : Boolean
      {
         if(param1 == null)
         {
            return false;
         }
         var _loc2_:Boolean = ArrayHelperClass.ifHasAndSave(this.mCorners,param1);
         if(_loc2_)
         {
            param1.wall = this;
         }
         return _loc2_;
      }
      
      public function removeCorner(param1:cornerSonClass) : Boolean
      {
         return ArrayHelperClass.removeItem(this.mCorners,param1);
      }
      
      public function addModel(param1:§-_--_-_-----§) : Boolean
      {
         var _loc2_:Boolean = ArrayHelperClass.ifHasAndSave(this.mModels,param1);
         if(_loc2_)
         {
            param1.wall = this;
         }
         return _loc2_;
      }
      
      public function §--_-_-_---_--§(param1:§-_--_-_-----§) : Boolean
      {
         return ArrayHelperClass.removeItem(this.mModels,param1);
      }
      
      public function §--_----___---§(param1:Vector.<§-----_-__----§>) : void
      {
         var _loc2_:§-----_-__----§ = null;
         for each(_loc2_ in param1)
         {
            this.addBoundary(_loc2_);
         }
      }
      
      public function addBoundary(param1:§-----_-__----§) : void
      {
         ArrayHelperClass.ifHasAndSave(this.mBoundaries,param1);
      }
      
      public function §-__-___--___-_§(param1:§-----_-__----§) : void
      {
         ArrayHelperClass.removeItem(this.mBoundaries,param1);
      }
      
      public function getBoundingBox() : my_Rect
      {
         var _loc2_:wallAreas_Class = null;
         var _loc1_:my_Rect = new my_Rect();
         for each(_loc2_ in this.mAreas)
         {
            _loc1_.§-__-___---_-__§(_loc2_.getBoundingBox());
         }
         return _loc1_;
      }
      
      public function getResources() : DecoResourceSet
      {
         var _loc1_:ResourceSet = null;
         var _loc3_:wallAreas_Class = null;
         var _loc4_:§-----_-__----§ = null;
         var _loc5_:wallCurve = null;
         var _loc6_:§-_--_-_-----§ = null;
         var _loc2_:ResourceSet = new ResourceSet();
         for each(_loc3_ in this.mAreas)
         {
            _loc1_ = _loc3_.getResources() as ResourceSet;
            _loc2_.union(_loc1_);
         }
         for each(_loc4_ in this.mBoundaries)
         {
            _loc2_.union(_loc4_.getResources());
         }
         for each(_loc5_ in this.m_curves)
         {
            _loc1_ = _loc5_.getResources() as ResourceSet;
            _loc2_.union(_loc1_);
         }
         for each(_loc6_ in this.mModels)
         {
            _loc2_.addModelAsset(_loc6_.asset);
         }
         return _loc2_;
      }
      
      public function setResources(param1:DecoResourceSet) : void
      {
         var _loc2_:§-_--_-_-----§ = null;
         var _loc3_:wallAreas_Class = null;
         var _loc4_:§-----_-__----§ = null;
         var _loc5_:wallCurve = null;
         var _loc6_:DecoModelAsset = null;
         for each(_loc2_ in this.mModels)
         {
            if(_loc2_.brandGoodId != null && _loc2_.brandGoodId != "0")
            {
               _loc6_ = param1.getModelAsset(_loc2_.brandGoodId);
            }
            if(_loc6_ == null)
            {
               _loc2_.wall.§--_-_-_---_--§(_loc2_);
            }
            else
            {
               _loc2_.asset = _loc6_;
            }
         }
         for each(_loc3_ in this.mAreas)
         {
            _loc3_.setResources(param1);
         }
         for each(_loc4_ in this.mBoundaries)
         {
            _loc4_.setResources(param1);
         }
         for each(_loc5_ in this.m_curves)
         {
            _loc5_.setResources(param1);
         }
      }
      
      public function getTheBiggestAreaPath() : m_pathOrMyPathClass
      {
         var pathFinder:curveCornerHelperClass = new curveCornerHelperClass(wallCurve.cloneAreas(this.m_curves));
         var paths:Vector.<m_pathOrMyPathClass> = pathFinder.getPaths_eh();
         var counterClockPaths:Vector.<m_pathOrMyPathClass> = m_pathOrMyPathClass.getCountClockWisePath(paths);
         //从大到小排序
         counterClockPaths.sort(function(param1:m_pathOrMyPathClass, param2:m_pathOrMyPathClass):int
         {
            return my_math.sign(Math.abs(param2.funcAreaGetSet) - Math.abs(param1.funcAreaGetSet));
         });
         if(counterClockPaths.length > 0)
         {
            return counterClockPaths[0];
         }
         return null;
      }
      
      public function generatePolyTree() : my_PolyTree
      {
         var _loc4_:wallAreas_Class = null;
         var _loc5_:my_PolyTree = null;
         var _loc1_:m_pathOrMyPathClass = this.getTheBiggestAreaPath();
         var _loc2_:my_polygon = _loc1_ != null?_loc1_.polygon:new my_polygon();
         var _loc3_:Vector.<my_polygon> = new Vector.<my_polygon>();
         for each(_loc4_ in this.mHoles)
         {
            _loc3_.push(_loc4_.polygon_Get_Or_Parameter);
         }
         _loc5_ = new my_PolyTree(_loc2_,_loc3_);
         return _loc5_;
      }
      
      public function correctAreas() : void
      {
         var _loc2_:wallAreas_Class = null;
         var _loc3_:wallCurve = null;
         var _loc1_:Vector.<wallAreas_Class> = CurveAreaRelationshipHelper.getHoleParts(this.mAreas);
         this.mHoles = new Vector.<wallAreas_Class>();
         for each(_loc2_ in _loc1_)
         {
            this.mHoles.push(_loc2_);
            for each(_loc3_ in _loc2_.curves)
            {
               _loc3_.wallDleleteSame(_loc2_);
            }
         }
         ArrayHelperClass.deleteSameValues(this.mAreas,_loc1_);
      }
      
      public function get areas() : Vector.<wallAreas_Class>
      {
         return this.mAreas;
      }
      
      public function set areas(param1:Vector.<wallAreas_Class>) : void
      {
         this.mAreas = param1;
      }
      
      public function get curves() : Vector.<wallCurve>
      {
         return this.m_curves;
      }
      
      public function set curves(param1:Vector.<wallCurve>) : void
      {
         this.m_curves = param1;
      }
      
      public function get corners() : Vector.<cornerSonClass>
      {
         return this.mCorners;
      }
      
      public function set corners(param1:Vector.<cornerSonClass>) : void
      {
         this.mCorners = param1;
      }
      
      public function get models() : Vector.<§-_--_-_-----§>
      {
         return this.mModels;
      }
      
      public function set models(param1:Vector.<§-_--_-_-----§>) : void
      {
         this.mModels = param1;
      }
      
      public function get designDataId() : String
      {
         return this.mDesignDataId;
      }
      
      public function set designDataId(param1:String) : void
      {
         this.mDesignDataId = param1;
      }
      
      public function get position() : Vec2
      {
         return this.mPosition.clone();
      }
      
      public function set position(param1:Vec2) : void
      {
         this.mPosition.copy(param1);
      }
      
      public function set displayInfoDataId(param1:String) : void
      {
         this.mDisplayInfoDataId = param1;
      }
      
      public function get displayInfoDataId() : String
      {
         return this.mDisplayInfoDataId;
      }
      
      public function get attachedObjectId() : String
      {
         return this.mAttachedObjectId;
      }
      
      public function set attachedObjectId(param1:String) : void
      {
         this.mAttachedObjectId = param1;
      }
      
      public function get attachedObjectIds() : Object
      {
         return this.mAttachedObjectIds;
      }
      
      public function set attachedObjectIds(param1:Object) : void
      {
         this.mAttachedObjectIds = param1;
      }
      
      public function get attachedObjectType() : int
      {
         return this.mAttachedObjectType;
      }
      
      public function set attachedObjectType(param1:int) : void
      {
         this.mAttachedObjectType = param1;
      }
      
      public function get line() : my2D_Edge
      {
         return this.mLine;
      }
      
      public function set line(param1:my2D_Edge) : void
      {
         this.mLine = param1;
      }
      
      public function get boundaries() : Vector.<§-----_-__----§>
      {
         return this.mBoundaries;
      }
      
      public function set boundaries(param1:Vector.<§-----_-__----§>) : void
      {
         this.mBoundaries = param1;
      }
      
      public function get holes() : Vector.<wallAreas_Class>
      {
         return this.mHoles;
      }
      
      public function set holes(param1:Vector.<wallAreas_Class>) : void
      {
         this.mHoles = param1;
      }
   }
}
*/