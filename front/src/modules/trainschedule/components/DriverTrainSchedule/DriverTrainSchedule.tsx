import React, { useEffect, useState } from 'react';

import type { LightRollingStock } from 'common/api/osrdEditoastApi';
import type { Train } from 'reducers/osrdsimulation/types';

import { BaseOrEco, type BaseOrEcoType } from './consts';
import DriverTrainScheduleHeader from './DriverTrainScheduleHeader';
import DriverTrainScheduleStopList from './DriverTrainScheduleStopList';

export default function DriverTrainSchedule({
  train,
  rollingStock,
}: {
  train: Train;
  rollingStock: LightRollingStock;
}) {
  const [baseOrEco, setBaseOrEco] = useState<BaseOrEcoType>(
    train.eco ? BaseOrEco.eco : BaseOrEco.base
  );

  useEffect(() => {
    setBaseOrEco(train.eco ? BaseOrEco.eco : BaseOrEco.base);
  }, [train.id]);

  return (
    <div className="simulation-driver-train-schedule">
      <DriverTrainScheduleHeader
        train={train}
        rollingStock={rollingStock}
        baseOrEco={baseOrEco}
        setBaseOrEco={setBaseOrEco}
      />
      <DriverTrainScheduleStopList train={train} baseOrEco={baseOrEco} />
    </div>
  );
}
