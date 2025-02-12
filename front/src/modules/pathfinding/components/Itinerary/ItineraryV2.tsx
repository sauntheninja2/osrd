import React, { useEffect, useState } from 'react';

import { ArrowSwitch, Plus, Rocket, Trash } from '@osrd-project/ui-icons';
import bbox from '@turf/bbox';
import type { Position } from 'geojson';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import type { ManageTrainSchedulePathProperties } from 'applications/operationalStudies/types';
import { useModal } from 'common/BootstrapSNCF/ModalSNCF';
import { computeBBoxViewport } from 'common/Map/WarpedMap/core/helpers';
import { useOsrdConfActions, useOsrdConfSelectors } from 'common/osrdContext';
import Tipped from 'common/Tipped';
import PathfindingV2 from 'modules/pathfinding/components/Pathfinding/PathfindingV2';
import TypeAndPathV2 from 'modules/pathfinding/components/Pathfinding/TypeAndPathV2';
import type { Viewport } from 'reducers/map';
import { updateViewport } from 'reducers/map';
import { getMap } from 'reducers/map/selectors';
import { useAppDispatch } from 'store';

import DestinationV2 from './DisplayItinerary/v2/DestinationV2';
import OriginV2 from './DisplayItinerary/v2/OriginV2';
import ViasV2 from './DisplayItinerary/v2/ViasV2';
import ModalSuggestedVias from './ModalSuggestedVias';

type ItineraryV2Props = {
  pathProperties?: ManageTrainSchedulePathProperties;
  setPathProperties: (pathProperties?: ManageTrainSchedulePathProperties) => void;
  shouldManageStopDuration?: boolean;
};

const ItineraryV2 = ({
  pathProperties,
  setPathProperties,
  shouldManageStopDuration,
}: ItineraryV2Props) => {
  const { getPathSteps, getOriginV2, getDestinationV2 } = useOsrdConfSelectors();
  const { updatePathSteps } = useOsrdConfActions();
  const origin = useSelector(getOriginV2);
  const destination = useSelector(getDestinationV2);
  const pathSteps = useSelector(getPathSteps);

  const [extViewport, setExtViewport] = useState<Viewport>();
  const [displayTypeAndPath, setDisplayTypeAndPath] = useState(false);
  const dispatch = useAppDispatch();
  const map = useSelector(getMap);
  const { t } = useTranslation('operationalStudies/manageTrainSchedule');
  const { openModal } = useModal();

  const zoomToFeaturePoint = (lngLat?: Position) => {
    if (lngLat) {
      const newViewport = {
        ...map.viewport,
        longitude: lngLat[0],
        latitude: lngLat[1],
        zoom: 16,
      };
      setExtViewport(newViewport);
    }
  };

  const inverseOD = () => {
    const revertedPathSteps = [...pathSteps].reverse();
    dispatch(updatePathSteps(revertedPathSteps));
  };

  const resetPathfinding = () => {
    setPathProperties(undefined);
    dispatch(updatePathSteps([null, null]));
  };

  useEffect(() => {
    if (extViewport !== undefined) {
      dispatch(
        updateViewport({
          ...extViewport,
        })
      );
    }
  }, [extViewport]);

  useEffect(() => {
    if (pathProperties) {
      const newViewport = computeBBoxViewport(bbox(pathProperties.geometry), map.viewport);
      setExtViewport(newViewport);
    }
  }, [pathProperties]);

  return (
    <div className="osrd-config-item">
      <div className="mb-2 d-flex">
        <PathfindingV2 pathProperties={pathProperties} setPathProperties={setPathProperties} />
        <button
          type="button"
          className="btn btn-sm btn-only-icon btn-white px-3 ml-2"
          aria-label={t('toggleTrigramSearch')}
          title={t('toggleTrigramSearch')}
          onClick={() => setDisplayTypeAndPath(!displayTypeAndPath)}
          data-testid="rocket-button"
        >
          <Rocket />
        </button>
      </div>
      {displayTypeAndPath && (
        <div className="mb-2">
          <TypeAndPathV2 setPathProperties={setPathProperties} />
        </div>
      )}
      {origin && destination && (
        <div className="d-flex flex-row flex-wrap">
          {pathProperties && pathProperties.suggestedOperationalPoints && (
            <button
              className="col my-1 text-white btn bg-info btn-sm"
              type="button"
              onClick={() =>
                openModal(<ModalSuggestedVias suggestedVias={pathProperties.allWaypoints} />)
              }
            >
              <span className="mr-1">{t('addVias')}</span>
              <Plus />
            </button>
          )}
          <button className="col ml-1 my-1 btn bg-warning btn-sm" type="button" onClick={inverseOD}>
            <span className="mr-1">{t('inverseOD')}</span>
            <ArrowSwitch />
          </button>
          <Tipped mode="right">
            <button
              type="button"
              className="ml-1 mt-1 btn-danger btn btn-sm"
              aria-label={t('deleteRoute')}
              onClick={resetPathfinding}
            >
              <Trash />
            </button>
            <span>{t('deleteRoute')}</span>
          </Tipped>
        </div>
      )}
      <div className="osrd-config-item-container pathfinding-details" data-testid="itinerary">
        <div data-testid="display-itinerary">
          <OriginV2 zoomToFeaturePoint={zoomToFeaturePoint} />
          <div className="vias-list mb-2" data-testid="itinerary-vias">
            {pathSteps.length > 2 ? (
              <ViasV2
                zoomToFeaturePoint={zoomToFeaturePoint}
                shouldManageStopDuration={shouldManageStopDuration}
              />
            ) : (
              <small className="ml-4">{t('noPlaceChosen')}</small>
            )}
          </div>
          <DestinationV2 zoomToFeaturePoint={zoomToFeaturePoint} />
        </div>
      </div>
    </div>
  );
};

export default ItineraryV2;
