import React, { useRef, useEffect } from 'react';

import { Button } from '@osrd-project/ui-core';
import { Alert } from '@osrd-project/ui-icons';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import type { ManageTrainSchedulePathProperties } from 'applications/operationalStudies/types';
import { STDCM_REQUEST_STATUS } from 'applications/stdcm/consts';
import useStdcm from 'applications/stdcm/hooks/useStdcm';
import { useOsrdConfActions } from 'common/osrdContext';
import { usePathfindingV2 } from 'modules/pathfinding/hook/usePathfinding';
import { Map } from 'modules/trainschedule/components/ManageTrainSchedule';
import type { StdcmConfSliceActions } from 'reducers/osrdconf/stdcmConf';
import { useAppDispatch } from 'store';

import StdcmConsist from './StdcmConsist';
import StdcmDestination from './StdcmDestination';
import StdcmLoader from './StdcmLoader';
import StdcmOrigin from './StdcmOrigin';
import StdcmVias from './StdcmVias';
import type { StdcmSimulationResult } from '../types';

type StdcmConfigProps = {
  currentSimulationInputs: StdcmSimulationResult['input'] | undefined;
  pathProperties?: ManageTrainSchedulePathProperties;
  setPathProperties: (pathProperties?: ManageTrainSchedulePathProperties) => void;
  setCurrentSimulationInputs: React.Dispatch<
    React.SetStateAction<StdcmSimulationResult['input'] | undefined>
  >;
};

const StdcmConfig = ({
  currentSimulationInputs,
  pathProperties,
  setPathProperties,
  setCurrentSimulationInputs,
}: StdcmConfigProps) => {
  const { t } = useTranslation('stdcm');
  const loaderRef = useRef<HTMLDivElement>(null);

  const { launchStdcmRequest, cancelStdcmRequest, currentStdcmRequestStatus } = useStdcm();
  const isPending = currentStdcmRequestStatus === STDCM_REQUEST_STATUS.pending;

  const dispatch = useAppDispatch();
  const { updateGridMarginAfter, updateGridMarginBefore, updateStdcmStandardAllowance } =
    useOsrdConfActions() as StdcmConfSliceActions;

  const { pathfindingState } = usePathfindingV2(setPathProperties, pathProperties);

  useEffect(() => {
    if (isPending) {
      loaderRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isPending]);

  // TODO: DROP STDCMV1: set those values by default in the store when <StdcmAllowances/> is not used anymore.
  useEffect(() => {
    dispatch(updateGridMarginAfter(35));
    dispatch(updateGridMarginBefore(35));
    dispatch(updateStdcmStandardAllowance({ type: 'time_per_distance', value: 4.5 }));
  }, []);

  return (
    <div className="stdcm-v2__body">
      <div className="stdcm-v2-simulation-settings">
        <div className="stdcm-v2-consist-container">
          <StdcmConsist
            disabled={isPending}
            setCurrentSimulationInputs={setCurrentSimulationInputs}
          />
        </div>
        <div className="stdcm-v2__separator" />
        <div className="stdcm-v2-simulation-itinerary">
          {/* //TODO: use them when we implement this feature #403 */}
          {/* <StdcmDefaultCard text="Indiquer le sillon antérieur" Icon={<ArrowUp size="lg" />} /> */}
          <StdcmOrigin
            disabled={isPending}
            setCurrentSimulationInputs={setCurrentSimulationInputs}
          />
          <StdcmVias disabled={isPending} setCurrentSimulationInputs={setCurrentSimulationInputs} />
          <StdcmDestination
            disabled={isPending}
            setCurrentSimulationInputs={setCurrentSimulationInputs}
          />
          {/* <StdcmDefaultCard text="Indiquer le sillon postérieur" Icon={<ArrowDown size="lg" />} /> */}
          {/* //TODO: replace .wizz-effect once we have the definitive one */}
          <div
            className={cx('stdcm-v2-launch-request', {
              'wizz-effect': !pathfindingState.done,
              'pb-5': !pathfindingState.error,
            })}
          >
            {currentSimulationInputs && (
              <Button
                label={t('simulation.getSimulation')}
                onClick={() => {
                  if (pathfindingState.done) {
                    launchStdcmRequest();
                    setCurrentSimulationInputs(undefined);
                  }
                }}
              />
            )}
            {pathfindingState.error && (
              <div className="warning-box">
                <span>
                  <Alert variant="fill" />
                </span>
                <p className="mb-0">{t('pathfindingFailed')}</p>
              </div>
            )}
          </div>
          {isPending && <StdcmLoader cancelStdcmRequest={cancelStdcmRequest} ref={loaderRef} />}
        </div>
      </div>
      <div className="osrd-config-item-container osrd-config-item-container-map stdcm-v2-map">
        <Map hideAttribution />
      </div>
      <div />
    </div>
  );
};

export default StdcmConfig;
