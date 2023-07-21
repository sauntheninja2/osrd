import React, { useState, useRef, useMemo, useEffect } from 'react';
import { isNil, max } from 'lodash';

import {
  LinearMetadataItem,
  createEmptySegmentAt,
  fixLinearMetadataItems,
  getZoomedViewBox,
  removeSegment,
  resizeSegment,
  splitAt,
  transalteViewBox,
} from 'common/IntervalsDataViz/data';
import { LinearMetadataDataviz } from 'common/IntervalsDataViz/dataviz';
import { notEmpty, tooltipPosition } from 'common/IntervalsDataViz/utils';

import IntervalsEditorTootlip from './IntervalsEditorTooltip';
import IntervalsEditorCommonForm from './IntervalsEditorCommonForm';
import {
  INTERVALS_EDITOR_TOOLS,
  INTERVAL_TYPES,
  IntervalItem,
  IntervalsEditorTool,
  IntervalsEditorToolsConfig,
} from './types';
import ZoomButtons from './ZoomButtons';
import ToolButtons from './IntervalsEditorToolButtons';
import IntervalsEditorMarginForm from './IntervalsEditorMarginForm';
import IntervalsEditorSelectForm from './IntervalsEditorSelectForm';

type IntervalsEditorProps = {
  defaultValue: number | string;
  setData: (newData: IntervalItem[]) => void;
  showValues?: boolean;
  title?: string;
  toolsConfig?: IntervalsEditorToolsConfig;
  totalLength: number;
} & (
  | {
      intervalType: INTERVAL_TYPES.NUMBER_WITH_UNIT;
      data: LinearMetadataItem<{ value: number | string; unit: string }>[];
      defaultUnit?: string;
      fieldLabel: string;
      units: string[];
    }
  | {
      intervalType: INTERVAL_TYPES.SELECT;
      data: LinearMetadataItem<{ value: number | string }>[];
      selectOptions: string[];
    }
);

/**
 * A tool to quickly set intervals on a linear range
 *
 * version 0.1
 */
export const IntervalsEditor: React.FC<IntervalsEditorProps> = (props) => {
  const {
    data = [],
    defaultValue,
    intervalType,
    setData,
    showValues = false,
    title,
    totalLength,
    toolsConfig = {
      cutTool: false,
      deleteTool: false,
      translateTool: false,
      addTool: false,
    },
  } = props;

  // Which segment areas are visible
  const [viewBox, setViewBox] = useState<[number, number] | null>(null);
  // Ref for the tooltip
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  // Which segment is hovered
  const [hovered, setHovered] = useState<{ index: number; point: number } | null>(null);
  // Mode of the dataviz
  const [mode, setMode] = useState<'dragging' | 'resizing' | null>(null);

  // Data to display
  const [resizingData, setResizingData] = useState<IntervalItem[]>(data);
  useEffect(() => setResizingData(data), [data]);

  // Which segment is selected
  const [selected, setSelected] = useState<number | null>(null);

  // For mouse click / doubleClick
  const [clickTimeout, setClickTimeout] = useState<number | null>(null);
  const [clickPrevent, setClickPrevent] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<IntervalsEditorTool | null>(null);

  const toggleSelectedTool = (tool: IntervalsEditorTool) => {
    setSelectedTool(selectedTool === tool ? null : tool);
  };

  const dataVizParams = useMemo(
    () => ({
      ticks: true,
      stringValues: intervalType !== INTERVAL_TYPES.NUMBER_WITH_UNIT,
      showValues,
    }),
    [showValues]
  );

  let formContent;
  if (selected !== null && data[selected]) {
    if (intervalType === INTERVAL_TYPES.NUMBER_WITH_UNIT) {
      const { fieldLabel, units } = props;
      formContent = (
        <IntervalsEditorMarginForm
          data={data}
          fieldLabel={fieldLabel}
          interval={data[selected]}
          selectedIntervalIndex={selected}
          setData={setData}
          units={units}
        />
      );
    } else {
      const { selectOptions } = props;
      formContent = (
        <IntervalsEditorSelectForm
          data={data}
          interval={data[selected]}
          selectedIntervalIndex={selected}
          setData={setData}
          selectOptions={selectOptions}
        />
      );
    }
  }

  return (
    <div className="linear-metadata">
      <div className="header">
        <h4 className="control-label m-0">{title}</h4>
        <ZoomButtons data={data} setViewBox={setViewBox} viewBox={viewBox} />
      </div>
      <div className="content">
        <div className="dataviz">
          <LinearMetadataDataviz
            creating={selectedTool === INTERVALS_EDITOR_TOOLS.ADD_TOOL}
            data={resizingData}
            viewBox={viewBox}
            highlighted={[hovered ? hovered.index : -1, selected ?? -1].filter((e) => e > -1)}
            onMouseEnter={(_e, _item, index, point) => {
              if (mode === null) setHovered({ index, point });
            }}
            onMouseLeave={() => {
              setHovered(null);
            }}
            onMouseMove={(e, _item, _index, point) => {
              if (tooltipRef.current) {
                tooltipPosition([e.nativeEvent.x, e.nativeEvent.y], tooltipRef.current);
                setHovered((old) => (old ? { ...old, point } : null));
              }
            }}
            onClick={(_e, _item, index, point) => {
              if (mode === null) {
                const timer = window.setTimeout(() => {
                  if (!clickPrevent) {
                    // case when you click on the already selected item => reset
                    // you can't select a blank interval
                    setSelected((old) => ((old ?? -1) === index ? null : index));
                    setHovered(null);
                  }
                  setClickPrevent(false);
                }, 50) as number;
                setClickTimeout(timer);
              }
              if (selectedTool === INTERVALS_EDITOR_TOOLS.CUT_TOOL) {
                if (clickTimeout) clearTimeout(clickTimeout);
                setClickPrevent(true);
                const newData = splitAt(data, point);
                setData(newData);
              }
              if (selectedTool === INTERVALS_EDITOR_TOOLS.DELETE_TOOL) {
                const newData = removeSegment(data, index, totalLength);
                setClickPrevent(false);
                setData(newData);
                setSelected(null);
                toggleSelectedTool(INTERVALS_EDITOR_TOOLS.DELETE_TOOL);
              }
            }}
            onWheel={(e, _item, _index, point) => {
              setViewBox(getZoomedViewBox(data, viewBox, e.deltaY > 0 ? 'OUT' : 'IN', point));
            }}
            onDragX={(gap, finalize) => {
              setMode(!finalize ? 'dragging' : null);

              setViewBox((vb) => transalteViewBox(data, vb, gap));
            }}
            onResize={(index, gap, finalized) => {
              setMode(!finalized ? 'resizing' : null);
              try {
                const { result, newIndexMapping } = resizeSegment(data, index, gap, 'end', false);
                const fixedResults = fixLinearMetadataItems(result?.filter(notEmpty), totalLength, {
                  fieldName: 'value',
                  defaultValue,
                });

                if (finalized) {
                  setData(fixedResults);
                } else {
                  setResizingData(fixedResults);

                  // if index has changed, we need to impact the index modification
                  if (hovered && newIndexMapping[hovered.index] === null) {
                    setHovered({ ...hovered, index: max([0, hovered.index - 1]) || 0 });
                  }
                  if (selected && newIndexMapping[selected] === null) {
                    setSelected(null);
                  }
                }
              } catch (e) {
                // TODO: should we display it ?
                console.warn(e);
              }
            }}
            onCreate={(point) => {
              const newData = createEmptySegmentAt(data, point, 'value', defaultValue);
              setData(newData);
            }}
            params={dataVizParams}
          />
          <ToolButtons
            selectedTool={selectedTool}
            toolsConfig={toolsConfig}
            toggleSelectedTool={toggleSelectedTool}
          />
        </div>

        {/* Data visualisation tooltip when item is hovered */}
        {mode !== 'dragging' && hovered !== null && data[hovered.index] && (
          <div className="tooltip" ref={tooltipRef}>
            <IntervalsEditorTootlip item={data[hovered.index]} point={hovered.point} />
          </div>
        )}

        {/* Basic interval form */}
        {!isNil(selected) && data[selected] && (
          <div className="flexValuesEdition">
            <div className="flexValues">
              <IntervalsEditorCommonForm
                data={data}
                interval={data[selected]}
                selectedIntervalIndex={selected}
                setData={setData}
                setSelectedIntervalIndex={setSelected}
                totalLength={totalLength}
              />
              {formContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntervalsEditor;
