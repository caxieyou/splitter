//绘制线条逻辑

var STATUS = {
    NOT_STARTED   : -1,
    SET_START     :  0,
    DRAWING       :  1,
    LINE_START    :  2,
    LINE_DRAWING  :  3
}


function _LineOp() {
    this._linePoints          = [];
    this._lineEdges           = [];
    this._linePoint           = new Vec2();
    this._curentLine0         = null;
    this._curentLine1         = null;
    
    this._lineIntersect = {
        isStartIntersect : [],
        isSelfIntersect: [],
        isStartEndSame : [],
        isEndIntersect : []
    };
}

_LineOp.prototype.getDrawableLines = function() {
    var edges = [];
    for (var i = 0; i < this._lineEdges.length; i++) {
        for (var j = 0; j < this._lineEdges[i].length; j++) {
            edges.push(this._lineEdges[i][j]);
        }
    }
    return edges;
}

function _RectOp() {
    
}

_RectOp.prototype.create = function(pnt0, pnt1, curves) {
    var rect = new MyRect(pnt0, pnt1);
    var polyEdges = rect.toMyPolygon().getEdges();
    for (var i = 0; i < polyEdges.length; i++) {
        for (var j = 0; j < curves.length; j++) {
            var curve = curves[j];
            if (curve instanceof CurveController) {
                continue;
            }
            curve = curve.getTheStartEndEdge();
            
            if (polyEdges[i] instanceof Array) {
                var total = [];
                for (var m = 0; m < polyEdges[i].length; m++) {
                    
                    var result = MyEdge.getDiff(polyEdges[i][m], curve);

                    if (result == null) {
                        // do nothing
                    } else if (result instanceof Array) {
                        total.push(result[0]);
                        total.push(result[1]);
                    } else {
                        total.push(result);
                    }
                }
                polyEdges[i] = total;
            } else if (polyEdges[i] != null){
                polyEdges[i] = MyEdge.getDiff(polyEdges[i], curve);
            }
        }
    }
    
    var res = [];
    for (var i = 0; i < polyEdges.length; i++) {
        if (polyEdges[i] == null) {
        } else if (polyEdges[i] instanceof Array && polyEdges[i].length > 0) {
            for (var j = 0; j < polyEdges[i].length; j++) {
                res.push(polyEdges[i][j]);
            }
        } else {
            res.push(polyEdges[i]);
        }
    }
    return res;
}

function _CircleOp() {
    
}

_CircleOp.prototype.create = function(edge) {
    return new MyCircle(edge.mStart.clone(), edge.getLength());
}

function ElementOperation(floor) {
    this.mFloor = floor;
    this.mStatus = STATUS.NOT_STARTED;
    this.mLine = new _LineOp();
    this.mRect = new _RectOp();
    this.mCircle = new _CircleOp();
}

ElementOperation.prototype.split = function (polygon) {
    var splitter = new Splitter(polygon, this.mFloor, this.mFloor.generatePolyTree());
    splitter.execute();
    this.mFloor.Analysis();
}

ElementOperation.prototype.isStart = function() {
    if (this.mStatus == STATUS.NOT_STARTED || this.mStatus == STATUS.LINE_START) {
        return true;
    } else {
        return false;
    }
}

ElementOperation.prototype.creatRect = function(pt0, pt1) {
    var res = this.mRect.create(pt0, pt1, this.mFloor.mCurves);
    this.split(res);
}

ElementOperation.prototype.isDrawable = function() {
    if (this.mStatus == STATUS.DRAWING || 
        this.mStatus == STATUS.LINE_START || 
        this.mStatus == STATUS.LINE_DRAWING) {
        return true;
    } else {
        return false;
    }
}

ElementOperation.prototype.getDrawableLines = function() {
    var edges =  this.mLine.getDrawableLines();
    var errorLine = null;
    if (this.mStatus == STATUS.LINE_DRAWING) {
        if (this.mLine._curentLine0) {
            edges.push(this.mLine._curentLine0);
        }
        if (this.mLine._curentLine1) {
            errorLine = this.mLine._curentLine1;
        }
    }
    return [edges, errorLine];
}
ElementOperation.prototype.createCircle = function(edge) {
    var res = this.mCircle.create(edge);
    this.split(res);
}

ElementOperation.prototype.setStatus = function(status) {
    this.mStatus = status;
}

ElementOperation.prototype.lineOperationStart = function(point) {
    var curves = this.mFloor.mCurves;
    if (this.mStatus == STATUS.LINE_START) {
        var list = [];
        list.push(point.clone());
        this.mLine._linePoints.push(list);
        this.mLine._lineEdges.push([]);
        this.mLine._linePoint.copy(point);
        this.mStatus = STATUS.LINE_DRAWING;
        this.mLine._curentLine0 = null;
        this.mLine._lineIntersect.isStartIntersect.push(false);
        this.mLine._lineIntersect.isSelfIntersect.push(false);
        this.mLine._lineIntersect.isStartEndSame.push(false);
        this.mLine._lineIntersect.isEndIntersect.push(false);
        
        for (var i = 0; i < curves.length; i++) {
            if (curves[i].containsPoint(this.mLine._linePoint)) {
                this.mLine._lineIntersect.isStartIntersect[this.mLine._lineIntersect.isStartIntersect.length - 1] = true;
                break;
            }
        }

    } else if (this.mStatus == STATUS.LINE_DRAWING) {
        
        var l = this.mLine._linePoints[this.mLine._linePoints.length-1];
        var p = l[l.length - 1];
        if (p.equals(point.clone())) {
            return;
        }
        
        this.mLine._linePoints[this.mLine._linePoints.length-1].push(point.clone());
        this.mLine._lineEdges[this.mLine._lineEdges.length-1].push(this.mLine._curentLine0.clone());

        if (this.mLine._curentLine1) {
            this.mLine._linePoints[this.mLine._linePoints.length-1][this.mLine._linePoints[this.mLine._linePoints.length-1].length - 1].mX = this.mLine._curentLine0.mEnd.mX;
            this.mLine._linePoints[this.mLine._linePoints.length-1][this.mLine._linePoints[this.mLine._linePoints.length-1].length - 1].mY = this.mLine._curentLine0.mEnd.mY;
            this.mStatus = STATUS.LINE_START;
            
            var intersectWithCurve = false;
            for (var i = 0; i < curves.length; i++) {
                if (curves[i].containsPoint(this.mLine._curentLine0.mEnd)) {
                    intersectWithCurve = true;
                    break;
                }
            }
            
            if (!intersectWithCurve)
            {
                this.mLine._lineIntersect.isSelfIntersect[this.mLine._lineIntersect.isSelfIntersect.length - 1] = true;
            } else {
                this.mLine._lineIntersect.isEndIntersect[this.mLine._lineIntersect.isEndIntersect.length - 1] = true;
            }
            
            this.mLine._curentLine0 = null;
            this.mLine._curentLine1 = null;
        }
        
    } else if (this.mStatus == STATUS.NOT_STARTED) {
        this.mStatus = STATUS.SET_START;
        return true;
    }
}

ElementOperation.prototype.lineOperationEnd = function(point, hintPoints) {
    var curves = this.mFloor.mCurves;
    if (this.mStatus ==  STATUS.NOT_STARTED || this.mStatus ==  STATUS.LINE_START) {
        return false;
    }
    if (this.mStatus == STATUS.LINE_DRAWING) {
        this.mLine._linePoint.copy(point);
        
        var lastPointArray = this.mLine._linePoints[this.mLine._linePoints.length - 1];
        var lastPoint = lastPointArray[lastPointArray.length - 1];
        var edge = new MyEdge(lastPoint, this.mLine._linePoint);
        
        var intersects = [];
        for (var i = 0; i < curves.length; i++) {
            if (curves[i].containsPoint(this.mLine._linePoint)) {
                intersects.push(this.mLine._linePoint.clone());
            }
        }
        
        for (var i = 0; i < curves.length; i++) {
            var curve = curves[i];
            curve.isIntersectWithGeometry(edge, intersects);
            
        }
        for (var i = 0; i < this.mLine._lineEdges.length; i++) {
            for (var j = 0; j < this.mLine._lineEdges[i].length; j++) {
                SegmentController.intersectSub(edge, this.mLine._lineEdges[i][j], intersects);
            }
            
        }
        
        var minDis = Number.MAX_VALUE;
        var idx = 0;
        if (intersects.length > 0) {
            for (var i = 0; i < intersects.length; i++) {
                var dis = Vec2.distance(intersects[i], lastPoint);
                if (minDis > dis) {
                    minDis = dis;
                    idx = i;
                }
            }
            
            this.mLine._curentLine0 = new MyEdge(lastPoint, intersects[idx]);
            hintPoints.push(intersects[idx].clone());
            this.mLine._curentLine1 = new MyEdge(intersects[idx], this.mLine._linePoint);
        } else {
            
            this.mLine._curentLine0 = edge;
            this.mLine._curentLine1 = null;
        }
        
        return false;
    }
    this.mStatus = STATUS.DRAWING;
    return true;
}

ElementOperation.prototype.reset = function() {
    var curves = this.mFloor.mCurves;
    if (this.mStatus  == STATUS.LINE_DRAWING) {
        this.mStatus = STATUS.LINE_START;
        var lastPointArray = this.mLine._linePoints[this.mLine._linePoints.length - 1];
        
        if (lastPointArray.length < 2 || Vec2.isEqual(lastPointArray[0], lastPointArray[lastPointArray.length - 1])) {
            this.mLine._lineIntersect.isStartEndSame[this.mLine._lineIntersect.isStartEndSame.length - 1] = true;
        } else {
            var firstPoint = lastPointArray[0];
            var lastPoint = lastPointArray[lastPointArray.length - 1];
            var edge = new MyEdge(lastPointArray[lastPointArray.length - 1], lastPointArray[0]);
            var intersects = [];
            for (var i = 0; i < curves.length; i++) {
                var curve = curves[i];
                curve.isIntersectWithGeometry(edge, intersects);
            }
            
            for (var i = 0; i < this.mLine._lineEdges.length; i++) {
                for (var j = 0; j < this.mLine._lineEdges[i].length; j++) {
                    SegmentController.intersectSub(edge, this.mLine._lineEdges[i][j], intersects);
                }
            }
            
            var minDis = Number.MAX_VALUE;
            var idx = 0;
            if (intersects.length > 0) {
                for (var i = 0; i < intersects.length; i++) {
                    var dis = Vec2.distance(intersects[i], lastPoint);
                    if (minDis > dis) {
                        minDis = dis;
                        idx = i;
                    }
                }
                
                lastPointArray.push(intersects[idx]);
                this.mLine._lineEdges[this.mLine._lineEdges.length - 1].push(new MyEdge(lastPoint, intersects[idx]));
                this.mLine._lineIntersect.isStartEndSame[this.mLine._lineIntersect.isStartEndSame.length - 1] = true;
                //证明有问题，不封闭的
                
            } else if (lastPointArray.length == 2){
                 return this.reset();
            } else {
                this.mLine._lineEdges[this.mLine._lineEdges.length - 1].push(new MyEdge(lastPoint, firstPoint));
                //证明没有问题，封闭的
                this.mLine._lineIntersect.isStartEndSame[this.mLine._lineIntersect.isStartEndSame.length - 1] = true;
            }
        }
        
        console.log("right 0");
    } else if (this.mStatus  == STATUS.LINE_START) {
        this.mStatus = STATUS.NOT_STARTED;
        
        //this.setType(null);
        
        var lines = [];
        
        for (var i = 0; i < this.mLine._lineEdges.length; i++) {
            if (this.mLine._lineIntersect.isStartEndSame[i]){
                for (var j = 0; j < this.mLine._lineEdges[i].length; j++) {
                    lines.push(this.mLine._lineEdges[i][j]);
                }
            } else {
                if (this.mLine._lineIntersect.isStartIntersect[i] && this.mLine._lineIntersect.isEndIntersect[i]) {
                    //首尾都相交
                    //那这些边都要
                    for (var j = 0; j < this.mLine._lineEdges[i].length; j++) {
                        lines.push(this.mLine._lineEdges[i][j]);
                    }
                }
                if (!this.mLine._lineIntersect.isSelfIntersect[i]) {
                    //首尾不同点，且没有自交，直接过滤
                    continue;
                } else if (this.mLine._lineIntersect.isStartIntersect[i]) {
                    //首尾不同点，但是自交了，并且第一个点和已存部分有交集
                    //那这些边都要
                    for (var j = 0; j < this.mLine._lineEdges[i].length; j++) {
                        lines.push(this.mLine._lineEdges[i][j]);
                    }
                } else {
                    //首尾不同点，但是自交了，并且第一个点和已存部分没有交集
                    //去掉首部相交的
                    var idx =  -1;
                    var lastPoint = this.mLine._linePoints[i][this.mLine._linePoints[i].length - 1];
                    for (var j = 0; j < this.mLine._lineEdges[i].length - 1; j++) {
                        if (this.mLine._lineEdges[i][j].pointInEdgeOrOnEdge(lastPoint)) {
                            idx = j;
                            break;
                        }
                    }
                    this.mLine._lineEdges[i].splice(0, idx);
                    this.mLine._lineEdges[i][0].mStart.copy(lastPoint)
                    for (var j = 0; j < this.mLine._lineEdges[i].length; j++) {
                        lines.push(this.mLine._lineEdges[i][j]);
                    }
                }
            }
        }
        this.split(lines);
        this.mLine._linePoints = [];
        this.mLine._lineEdges = [];
        this.mLine._lineIntersect.isStartIntersect = [];
        this.mLine._lineIntersect.isSelfIntersect = [];
        this.mLine._lineIntersect.isStartEndSame = [];
        this.mLine._lineIntersect.isEndIntersect = [];
        
        console.log("right 1");
        return true;
    } else {
        this.mStatus = STATUS.NOT_STARTED;
        return true;
    }
}

ElementOperation.prototype.checkStatus = function() {
    if (this.mStatus == STATUS.SET_START) {
        return false;
    } else if (this.mStatus == STATUS.DRAWING){
        this.mStatus = STATUS.NOT_STARTED;
        return true;
    } else if (this.mStatus == STATUS.LINE_START){
        return true;
    } else if (this.mStatus == STATUS.LINE_DRAWING){
        return true;
    }
}













