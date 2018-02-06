function MyArea(param1) {
    if (param1 == null || param1 == undefined) {
        param1 = null;
    }

    this.mAreaNotUnderstand;//整块的大属性？
    //this.m_Decorations:Vector.<MyBasicArea>;//里面好多块的属性？
    this.mCurves;
    this.mFloor = param1;
    
    this.mPath; 
      
    this.initialize();
    this.mId = ID.assignUniqueId();
}

MyArea.outputStructure = function(param1) {
    var res = {
        edges : []
    };
    
    if (param1 instanceof MyArea) {
        for (var i = 0; i < param1.mCurves.length; i++) {
            if (param1.mCurves[i] instanceof Arc) {
                var curve = param1.mCurves[i].getCurveFromController();
                res.edges.push(curve);
            } else if (param1.mCurves[i] instanceof Segment) {
                var edge = param1.mCurves[i].getTheStartEndEdge();
                res.edges.push(edge);
            }
        }
    } else if (param1 instanceof Array) {
        for (var i = 0; i < param1.length; i++) {
            if (param1[i] instanceof Arc) {
                var curve = param1[i].getCurveFromController();
                res.edges.push(curve);
            }
            if (param1[i] instanceof Segment) {
                var edge = param1[i].getTheStartEndEdge();
                res.edges.push(edge);
            }
        }
    }
    
    return res;
    
}

function MyOutput (outline) {
    this.mOutline = outline;
    this.mHoles = [];
}

MyArea.outputStructures = function(param1, param2) {
    var outline = MyArea.outputStructure(param1);
    
    res = new MyOutput(outline);

    if (param2.length == 0) {
        return res;
    } else if (param2.length == 1){
        res.mHoles.push(MyArea.outputStructure(param2[0]));
        return res;
    } else {
        //TODO: 排除重复，然后继续取边界
        var curves = [];
        
        for (var i = 0; i < param2.length; i++) {
            for (var j = 0; j < param2[i].mCurves.length; j++) {
                var curve = param2[i].mCurves[j];
                var index = curves.indexOf(curve);
                if (index != -1) {
                    curves.splice(index, 1);
                } else {
                    curves.push(curve)
                }
            }
        }
        var helper = new curveCornerHelperClass(curves);
        var paths = helper.getPaths_eh();
        
        var clockwisePaths = Path.getClockWisePaths(paths);
        
        for (var i = 0; i < clockwisePaths.length; i++) {
            res.mHoles.push(MyArea.outputStructure(clockwisePaths[i].mCurves));
        }
        
        return res;
    }
    
}

MyArea.outputStructures2 = function(param1, param2) {
    var outline = param1.getPathPolygon();
    
    res = new Polytree(outline);
    res.mHoles = [];
    if (param2.length == 0) {
        return res;
    } else {
        
        for (var i = 0; i < param2.length; i++) {
            res.mHoles.push(param2[i].getPathPolygon());
        }
        return res;
    }
    
}

MyArea.outputStructures3 = function(param1, param2) {
    var res = [];
    res = res.concat(param1.mCurves);

    if (param2.length == 0) {
        return res;
    } else {
        res.mHoles = [];
        for (var i = 0; i < param2.length; i++) {
            res = res.concat(param2[i].mCurves);
        }
        return res;
    }
    
}


MyArea.prototype.initialize = function()
{
    this.mCurves = [];

    this.mOffset = 0;

    this.mMap = new Map();
    this.IsNotGetPolygonOnce = true;
    this.mPatternOffset = new Vec2();
}

MyArea.prototype.getPolygon = function()
{
    if(this.mPath == null)
    {
        return null;
    }
    return this.mPath.getPolygon();
}

MyArea.prototype.tryCalculatePolygon = function()
{
    if(this.IsNotGetPolygonOnce == true)
    {
        this.GetPolygonFromSelf();
        this.IsNotGetPolygonOnce = false;
    }
}

MyArea.prototype.addSection = function(param1)
{
    return ArrayHelperClass.ifHasAndSave(this.mCurves,param1);
}
      
MyArea.prototype.dispose = function()
{
    var _loc1_ = null;
    for (var i = 0; i < this.mCurves.length; i++)
    //for each(_loc1_ in this.m_curves)
    {
        this.mCurves[i].wallDleleteSame(this);
    }
    if(this.mFloor)
    {
        this.mFloor.wallDleleteSame(this);
    }
}
MyArea.prototype.getPolygonFunc_EH = function()
{
    this.tryCalculatePolygon();
    return this.mPolygon;
}

//get holes
MyArea.prototype.clonePolygons = function()
{
    return [];
}
      
MyArea.prototype.generateElementDiscribeUnit = function()
{
    return new Polytree(this.getPolygonFunc_EH(),this.clonePolygons());
}

MyArea.prototype.generatePolyTree = function()
{
    return new Polytree(this.getPolygon(),this.clonePolygons());
}


MyArea.prototype.isIncludedArea = function(param1)
{
    if(!this.getPathPolygon().isIncludedPolygon(param1.getPathPolygon()))
    {
        return false;
    }
    return true;
}

MyArea.prototype.containsPoint = function(param1)
{
    if(!this.getPathPolygon().containsInclusive(param1))
    {
        return false;
    }
    return true;
}


MyArea.prototype.isIncludedPolygon = function(param1)
{

    if(!this.getPathPolygon().isIncludedPolygon(param1))
    {
        return false;
    }
    
    return true;
}

MyArea.prototype.getPathPolygon = function()
{
    if(this.mPath == null)
    {
        return null;
    }
    return this.mPath.mPolygon;
}


MyArea.prototype.GetPolygonFromSelf = function()
{
    this.mPolygon = GeoHelpSomeClass.getPolygonFromAreaPath(this);
}

MyArea.prototype.getAbsArea = function()
{
    return Math.abs(this.getPolygon().getSignedArea());
}

MyArea.prototype.removeSection = function(param1)
{
    return ArrayHelperClass.removeItem(this.mCurves, param1);
}
