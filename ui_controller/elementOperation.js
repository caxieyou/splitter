//绘制线条逻辑

var STATUS = {
    NOT_STARTED   : -1,
    SET_START     :  0,
    DRAWING       :  1,
    LINE_START    :  2,
    LINE_DRAWING  :  3
}

function LineRecord() {
    this._lineEdges = [];
}

function _LineOp() {
    this._currentLine;
    this._curentLineValidPart;
    this._curentLineInvalidPart;
    this._lineRecords;
    this.reset();
}

_LineOp.prototype.creatRecord = function() {
    this._lineRecords.push(new LineRecord());
}

_LineOp.prototype.addEdge = function(edge) {
    var currentRecord = this._lineRecords[this._lineRecords.length - 1];
    
    if (edge) {
        currentRecord._lineEdges.push(new MyEdge(edge.mStart.clone(), edge.mEnd.clone()));
    } else {
        currentRecord._lineEdges.push(new MyEdge(this._curentLineValidPart.mStart.clone(), this._curentLineValidPart.mEnd.clone()));
    }
    
}

_LineOp.prototype.clear = function() {
    this._curentLineValidPart = null;
    this._curentLineInvalidPart = null;
}

_LineOp.prototype.intersect = function(intersects) {
    for (var i = 0; i < this._lineRecords.length; i++) {
        var edges = this._lineRecords[i]._lineEdges;
        for (var j = 0; j < edges.length; j++) {
            SegmentController.intersectSub(edges[j], this._currentLine, intersects);
        }
    }
    
    if (MyNumber.isEqual(this._currentLine.getLength(), 0)) {
        return;
    }
    for (var i = 0; i < this._lineRecords.length; i++) {
        var edges = this._lineRecords[i]._lineEdges;
        for (var j = 0; j < edges.length; j++) {
            if (this._currentLine.mEnd.equals(edges[j].mStart)) {
                intersects.push(edges[j].mStart.clone());
                return;
            }
            
            if(this._currentLine.mEnd.equals(edges[j].mEnd)) {
                intersects.push(edges[j].mEnd.clone());
                return;
            }
        }
    }
}

_LineOp.prototype.getDrawableLines = function() {
    var edges = [];
    for (var i = 0; i < this._lineRecords.length; i++) {
        edges = edges.concat(this._lineRecords[i]._lineEdges);
    }
    return edges;
}

_LineOp.prototype.getLastEdge = function() {
    var edges = this._lineRecords[this._lineRecords.length - 1]._lineEdges;
    if (edges.length <= 1) {
        return null;
    }
    
    return new MyEdge(edges[edges.length-1].mEnd.clone(), edges[0].mStart.clone());
}

_LineOp.prototype.reset = function() {
    this._currentLine             = new MyEdge(new Vec2(), new Vec2());
    this._curentLineValidPart     = null;
    this._curentLineInvalidPart   = null;
    this._lineRecords = [];
}

_LineOp.prototype._removeSingle = function(lines, curves) {
    var recordStart = new Array(lines.length);
    var recordEnd   = new Array(lines.length);
    
    for (var i = 0; i < lines.length; i++) {
        recordStart[i] = false;
        recordEnd[i] = false;
    }
    
    for (var i = 0; i < lines.length; i++) {
        for (var j = 0; j < lines.length; j++) {
            if (i == j) {
                continue;
            }
            if (lines[j].pointInEdge(lines[i].mStart)) {
                recordStart[i] = true;
            }
            if (lines[j].pointInEdge(lines[i].mEnd)) {
                recordEnd[i] = true;
            }
        }
    }
    
    for (var i = 0; i < lines.length; i++) {
        if (!recordStart[i]) {
            for (var j = 0; j < curves.length; j++) {
                if (curves[j].containsPoint(lines[i].mStart)) {
                    recordStart[i] = true;
                    break;
                }
            }
        }
        
        if (!recordEnd[i]) {
            for (var j = 0; j < curves.length; j++) {
                if (curves[j].containsPoint(lines[i].mEnd)) {
                    recordEnd[i] = true;
                    break;
                }
            }
        }
    }
    
    var ret = [];
    for (var i = 0; i < lines.length; i++) {
        if (recordStart[i] && recordEnd[i]) {
            ret.push(lines[i]);
        }
    }
    
    if (ret.length != lines.length) {
        return this._removeSingle(ret, curves);
    } else {
        return ret;
    }
    
}

_LineOp.prototype.extractValidLines = function(curves) {
    var lines = this.getDrawableLines();
    var record = [];
    //1. find splitted edges
    for (var i = 0; i < lines.length; i++) {
        var tmp = [];
        for (var j = 0; j < lines.length; j++) {
            if (i == j) {
                continue;
            }
            if (lines[i].pointInEdgeOrOnEdge(lines[j].mStart)) {
                tmp.push(lines[j].mStart.clone());
            }
            if (lines[i].pointInEdgeOrOnEdge(lines[j].mEnd)) {
                tmp.push(lines[j].mEnd.clone());
            }
        }
        record.push(tmp);
    }
    
    var linesSplit = [];
    for (var i = 0; i < record.length; i++) {
        record[i].sort(function(a, b) {
            return Vec2.distance(a, lines[i].mStart) - Vec2.distance(b, lines[i].mStart);
        });
        
        if (record[i].length == 0) {
            linesSplit.push(lines[i]);
        } else {
            linesSplit.push(new MyEdge(lines[i].mStart.clone(), record[i][0].clone()));
            for (var j = 0; j < record[i].length - 1; j++) {
                linesSplit.push(new MyEdge(record[i][j].clone(), record[i][j+1].clone()));
            }
            linesSplit.push(new MyEdge(record[i][record[i].length - 1].clone(), lines[i].mEnd.clone()));
        }
    }
    
    return this._removeSingle(linesSplit, curves);
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
        if (this.mLine._curentLineValidPart) {
            edges.push(this.mLine._curentLineValidPart);
        }
        if (this.mLine._curentLineInvalidPart) {
            errorLine = this.mLine._curentLineInvalidPart;
        }
    }
    return [edges, errorLine];
}

ElementOperation.prototype.getSnapLines = function() {
    return this.mLine.getDrawableLines();
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
        this.mLine._currentLine.mStart.copy(point);
        this.mLine.creatRecord();
        this.mLine.clear();
        this.mStatus = STATUS.LINE_DRAWING;
        
    } else if (this.mStatus == STATUS.LINE_DRAWING) {
        if (this.mLine._currentLine.mStart.equals(point.clone())) {
            return;
        }
        
        for (var i = 0; i < curves.length; i++) {
            if (curves[i] instanceof SegmentController) {
                var edge = curves[i].getTheStartEndEdge();
                if (LineRelationHelper.isOverLapping(edge, this.mLine._currentLine)) {
                    return;
                }
            }
        }
        
        if (this.mLine._curentLineInvalidPart) {
            this.mStatus = STATUS.LINE_START;
            this.mLine.addEdge();
            this.mLine.clear();
        } else if (this.mLine._curentLineValidPart){
            this.mLine.addEdge();
            this.mLine.clear();
            this.mLine._currentLine.mStart.copy(point);
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
        //1. set edge
        this.mLine._currentLine.mEnd.copy(point);
        var intersects = [];
        for (var i = 0; i < curves.length; i++) {
            if (curves[i].containsPoint(point)) {
                intersects.push(point.clone());
            }
        }
        
        for (var i = 0; i < curves.length; i++) {
            var curve = curves[i];
            curve.isIntersectWithGeometry(this.mLine._currentLine, intersects);
            
        }
        
        this.mLine.intersect(intersects);
        var minDis = Number.MAX_VALUE;
        var idx = 0;
        if (intersects.length > 0) {
            for (var i = 0; i < intersects.length; i++) {
                var dis = Vec2.distance(intersects[i], this.mLine._currentLine.mStart.clone());
                if (minDis > dis) {
                    minDis = dis;
                    idx = i;
                }
            }
            
            this.mLine._curentLineValidPart = new MyEdge(this.mLine._currentLine.mStart.clone(), intersects[idx]);
            hintPoints.push(intersects[idx].clone());
            this.mLine._curentLineInvalidPart = new MyEdge(intersects[idx], this.mLine._currentLine.mEnd.clone());
        } else {
            this.mLine._curentLineValidPart = this.mLine._currentLine;
            this.mLine._curentLineInvalidPart = null;
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
        var e = this.mLine.getLastEdge();
        if (!e) {
            return;
        }
        var intersects = [];
        for (var i = 0; i < curves.length; i++) {
            var curve = curves[i];
            curve.isIntersectWithGeometry(e, intersects);
        }
        
        this.mLine.intersect(intersects);
        
        var minDis = Number.MAX_VALUE;
        var idx = 0;
        if (intersects.length > 0) {
            for (var i = 0; i < intersects.length; i++) {
                var dis = Vec2.distance(intersects[i], e.mStart);
                if (minDis > dis) {
                    minDis = dis;
                    idx = i;
                }
            }
            
            e.mEnd.copy(intersects[idx]);
            this.mLine.addEdge(e);
        } else {
            this.mLine.addEdge(e);
        }
        
        console.log("right 0");
    } else if (this.mStatus  == STATUS.LINE_START) {
        this.mStatus = STATUS.NOT_STARTED;
        var lines = this.mLine.extractValidLines(curves);
        this.split(lines);
        this.mLine.reset();
        
        console.log("right 1");
        return true;
    } else {
        this.mStatus = STATUS.NOT_STARTED;
        return true;
    }
}

ElementOperation.prototype.finish = function() {
    this.reset();
    this.reset();
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













