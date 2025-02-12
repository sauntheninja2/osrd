package fr.sncf.osrd.api.api_v2.pathfinding

import fr.sncf.osrd.api.FullInfra
import fr.sncf.osrd.api.pathfinding.makePathProps
import java.io.File

/**
 * Export the track and waypoint geometry for a given path. Generate two csv files that can be
 * imported in QGIS for debugging purposes. Can be modified to include routes and blocks.
 */
fun exportPathGeo(infra: FullInfra, res: PathfindingBlockSuccess) {
    val name = res.hashCode()
    File("$name-tracks.csv").printWriter().use { out ->
        out.println("index;linestring;id")
        for ((i, track) in res.trackSectionRanges.withIndex()) {
            val geo = makePathProps(infra.rawInfra, listOf(track)).getGeo()
            out.println("$i;$geo;${track.trackSection}")
        }
    }
    val fullPath = makePathProps(infra.rawInfra, res.trackSectionRanges)
    val lineString = fullPath.getGeo()
    File("$name-points.csv").printWriter().use { out ->
        out.println("index;x;y")
        for ((i, item) in res.pathItemPositions.withIndex()) {
            val geo = lineString.interpolateNormalized(item.distance / fullPath.getLength())
            out.println("$i;${geo.x};${geo.y}")
        }
    }
}
