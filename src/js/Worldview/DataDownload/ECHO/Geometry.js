/*
 * NASA Worldview
 * 
 * This code was originally developed at NASA/Goddard Space Flight Center for
 * the Earth Science Data and Information System (ESDIS) project. 
 *
 * Copyright (C) 2013 United States Government as represented by the 
 * Administrator of the National Aeronautics and Space Administration.
 * All Rights Reserved.
 */

/**
 * @module Worldview.DataDownload
 */
Worldview.namespace("DataDownload");

Worldview.DataDownload.ECHO.Geometry = function(result) {
    
    var self = {};
    self.polygons = [];
        
    var init = function() {
        if ( result.polygons ) {
            initFromPolygons(result.polygons);
        } else if ( result.boxes ) {
            initFromBoxes(result.boxes);
        } else {
            throw new Error("Unable to find spatial field");
        }
    };
    
    self.toOpenLayers = function(sourceProjection, targetProjection) {
        olPolygons = [];
        $.each(self.polygons, function(index, polygon) {
            var olRings = [];
            $.each(polygon, function(index, ring) {
                var olPoints = [];
                $.each(ring, function(index, point) {
                    var p = createPoint(point, sourceProjection, 
                            targetProjection);
                    olPoints.push(p);    
                });
                olRings.push(new OpenLayers.Geometry.LinearRing(olPoints));
            });
            olPolygons.push(new OpenLayers.Geometry.Polygon(olRings));
        });
        return olPolygons[0];    
    };
    
    var createPoint = function(point, sourceProjection, targetProjection) {
        var p = new OpenLayers.Geometry.Point(point.x, point.y);
        if ( sourceProjection ) {
            if ( sourceProjection !== targetProjection ) {
                p = p.transform(sourceProjection, targetProjection);
            }
        }
        return p;    
    };
    
    var initFromPolygons = function(echoPolygons) {
        $.each(echoPolygons, function(index, echoPolygon) {
            var rings = [];
            $.each(echoPolygon, function(index, echoRing) {
                var ring = [];
                var parts = echoRing.split(" ");
                for ( var i = 0; i < parts.length; i+= 2 ) {
                    var y = parseFloat(parts[i]);
                    var x = parseFloat(parts[i + 1]);
                    ring.push({x: x, y: y});
                }
                rings.push(ring);    
            });
            self.polygons.push(rings);
        });
    };
    
    var initFromBoxes = function(echoBoxes) {
        $.each(echoBoxes, function(index, echoBox) {
            var ring = [];
            var fields = echoBox.split(" ");
            var ymin = parseFloat(fields[0]);
            var xmin = parseFloat(fields[1]);
            var ymax = parseFloat(fields[2]);
            var xmax = parseFloat(fields[3]);
            ring.push({x: xmin, y: ymin});
            ring.push({x: xmax, y: ymin});
            ring.push({x: xmax, y: ymax});
            ring.push({x: xmin, y: ymax});
            ring.push({x: xmin, y: ymin});
           
            self.polygons.push([ring]);
        });    
    };
    
    init();
    return self;
}
