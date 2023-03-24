package fr.sncf.osrd.sim_infra.impl

import fr.sncf.osrd.sim_infra.api.*
import fr.sncf.osrd.utils.indexing.*

class BlockDescriptor(
    val startAtBufferStop: Boolean,
    val stopsAtBufferStop: Boolean,
    val path: StaticIdxList<ZonePath>,
    val signals: StaticIdxList<LogicalSignal>,
    val signalsPositions: DistanceList,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as BlockDescriptor
        if (startAtBufferStop != other.startAtBufferStop) return false
        if (stopsAtBufferStop != other.stopsAtBufferStop) return false
        if (path != other.path) return false
        if (signals != other.signals) return false
        return true
    }

    override fun hashCode(): Int {
        var result = startAtBufferStop.hashCode()
        result = 31 * result + stopsAtBufferStop.hashCode()
        result = 31 * result + path.hashCode()
        result = 31 * result + signals.hashCode()
        return result
    }
}

class BlockInfraImpl(
    private val blockPool: StaticPool<Block, BlockDescriptor>,
    private val loadedSignalInfra: LoadedSignalInfra,
    rawInfra: RawInfra,
) : BlockInfra {
    private val blockEntryDetectorMap = IdxMap<DirDetectorId, MutableStaticIdxList<Block>>()
    private val blockEntrySignalMap = IdxMap<LogicalSignalId, MutableStaticIdxList<Block>>()

    init {
        for (blockId in blockPool.space()) {
            val block = blockPool[blockId]
            val entryZonePath = block.path[0]

            // update blockEntryDetectorMap
            val entryDirDet = rawInfra.getZonePathEntry(entryZonePath)
            val detList = blockEntryDetectorMap.getOrPut(entryDirDet) { mutableStaticIdxArrayListOf() }
            detList.add(blockId)

            // update blockEntrySignalMap
            if (!block.startAtBufferStop) {
                val entrySig = block.signals[0]
                val sigList = blockEntrySignalMap.getOrPut(entrySig) { mutableStaticIdxArrayListOf() }
                sigList.add(blockId)
            }
        }
    }

    override val blocks: StaticIdxSpace<Block>
        get() = blockPool.space()

    override fun getBlockPath(block: BlockId): StaticIdxList<ZonePath> {
        return blockPool[block].path
    }

    override fun getBlockSignals(block: BlockId): StaticIdxList<LogicalSignal> {
        return blockPool[block].signals
    }

    override fun blockStartAtBufferStop(block: BlockId): Boolean {
        return blockPool[block].startAtBufferStop
    }

    override fun blockStopAtBufferStop(block: BlockId): Boolean {
        return blockPool[block].stopsAtBufferStop
    }

    override fun getBlockSignalingSystem(block: BlockId): SignalingSystemId {
        return loadedSignalInfra.getSignalingSystem(blockPool[block].signals[0])
    }

    override fun getBlocksAtDetector(detector: DirDetectorId): StaticIdxList<Block> {
        return blockEntryDetectorMap[detector] ?: mutableStaticIdxArrayListOf()
    }

    override fun getBlocksAtSignal(signal: LogicalSignalId): StaticIdxList<Block> {
        return blockEntrySignalMap[signal] ?: mutableStaticIdxArrayListOf()
    }

    override fun getSignalsPositions(block: BlockId): DistanceList {
        return blockPool[block].signalsPositions
    }
}
