function Area(param1) {
    if (param1 == null || param1 == undefined) {
        param1 = null;
    }

    this.mElements;
    this.mFloor = param1;
    
    this.mPath; 

    this.initialize();
    this.mId = ID.assignUniqueId();
}

Area.outputStructure = function(param1) {
    var res = {
        edges : []
    };
    
    if (param1 instanceof Area) {
        for (var i = 0; i < param1.mElements.length; i++) {
            if (param1.mElements[i] instanceof Arc) {
                var curve = param1.mElements[i].getCurve();
                res.edges.push(curve);
            } else if (param1.mElements[i] instanceof Segment) {
                var edge = param1.mElements[i].getTheStartEndEdge();
                res.edges.push(edge);
            }
        }
    } else if (param1 instanceof Array) {
        for (var i = 0; i < param1.length; i++) {
            if (param1[i] instanceof Arc) {
                var curve = param1[i].getCurve();
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

MyOutput.prototype.clone = function() {
    var ret = new MyOutput();
    ret.mOutline = {
        edges : []
    };
    
    for (var i = 0; i < this.mOutline.edges.length; i++) {
        ret.mOutline.edges.push(this.mOutline.edges[i].clone());
    }
    
    
    for (var i = 0; i < this.mHoles.length; i++) {
        ret.mHoles[i] = {
            edges : []
        };
        
        for (var j = 0; j < this.mHoles[i].edges.length; j++) {
            ret.mHoles[i].edges.push(this.mHoles[i].edges[j].clone());
        }
    }
    
    
    
    return ret;
}

Area.outputStructures = function(param1, param2) {
    var outline = Area.outputStructure(param1);
    
    res = new MyOutput(outline);

    if (param2.length == 0) {
        return res;
    } else if (param2.length == 1){
        res.mHoles.push(Area.outputStructure(param2[0]));
        return res;
    } else {
        var curves = [];
        
        for (var i = 0; i < param2.length; i++) {
            for (var j = 0; j < param2[i].mElements.length; j++) {
                var curve = param2[i].mElements[j];
                var index = curves.indexOf(curve);
                if (index != -1) {
                    curves.splice(index, 1);
                } else {
                    curves.push(curve)
                }
            }
        }
        var helper = new AuxiliarySort(curves);
        var paths = helper.getPaths();
        
        var clockwisePaths = Path.getClockWisePaths(paths);
        
        for (var i = 0; i < clockwisePaths.length; i++) {
            res.mHoles.push(Area.outputStructure(clockwisePaths[i].mElements));
        }
        
        return res;
    }
    
}

Area.outputStructures2 = function(param1, param2) {
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

Area.outputStructures3 = function(param1, param2) {
    var res = [];
    res = res.concat(param1.mElements);

    if (param2.length == 0) {
        return res;
    } else {
        res.mHoles = [];
        for (var i = 0; i < param2.length; i++) {
            res = res.concat(param2[i].mElements);
        }
        return res;
    }
    
}


Area.prototype.initialize = function()
{
    this.mElements = [];

    this.mOffset = 0;

    this.mMap = new Map();
    this.IsNotGetPolygonOnce = true;
    this.mPatternOffset = new Vec2();
}

Area.prototype.getPolygon = function()
{
    if(this.mPath == null)
    {
        return null;
    }
    return this.mPath.getPolygon();
}

Area.prototype.tryCalculatePolygon = function()
{
    if(this.IsNotGetPolygonOnce == true)
    {
        this.GetPolygonFromSelf();
        this.IsNotGetPolygonOnce = false;
    }
}

Area.prototype.addElement = function(param1)
{
    return MyArray.ifHasAndSave(this.mElements,param1);
}
      
Area.prototype.dispose = function()
{
    var _loc1_ = null;
    for (var i = 0; i < this.mElements.length; i++)
    {
        this.mElements[i].wallDleleteSame(this);
    }
    if(this.mFloor)
    {
        this.mFloor.wallDleleteSame(this);
    }
}
Area.prototype.getPolygonFunc_EH = function()
{
    this.tryCalculatePolygon();
    return this.mPolygon;
}

//get holes
Area.prototype.clonePolygons = function()
{
    return [];
}
      
Area.prototype.generateElementDiscribeUnit = function()
{
    return new Polytree(this.getPolygonFunc_EH(),this.clonePolygons());
}

Area.prototype.generatePolyTree = function()
{
    return new Polytree(this.getPolygon(),this.clonePolygons());
}


Area.prototype.isIncludedArea = function(param1)
{
    if(!this.getPathPolygon().isIncludedPolygon(param1.getPathPolygon()))
    {
        return false;
    }
    return true;
}

Area.prototype.containsPoint = function(param1)
{
    if(!this.getPathPolygon().containsInclusive(param1))
    {
        return false;
    }
    return true;
}


Area.prototype.isIncludedPolygon = function(param1)
{

    if(!this.getPathPolygon().isIncludedPolygon(param1))
    {
        return false;
    }
    
    return true;
}

Area.prototype.getPathPolygon = function()
{
    if(this.mPath == null)
    {
        return null;
    }
    return this.mPath.mPolygon;
}


Area.prototype.GetPolygonFromSelf = function()
{
    this.mPolygon = Auxiliary.getPolygonFromAreaPath(this);
}

Area.prototype.getAbsArea = function()
{
    return Math.abs(this.getPolygon().getSignedArea());
}

Area.prototype.removeElement = function(param1)
{
    return MyArray.removeItem(this.mElements, param1);
}
