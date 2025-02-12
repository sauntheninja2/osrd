import type { ElectrificationRangeV2 } from 'applications/operationalStudies/types';
import type {
  EffortCurves,
  RangedValue,
  RollingStock,
  SimulationPowerRestrictionRange,
  TrainScheduleBase,
} from 'common/api/osrdEditoastApi';

/**
 * Ranges on the path Lille Flandres - Perpignan with a 2N2
 */
export const pathElectrificationRanges: RangedValue[] = [
  {
    begin: 0,
    end: 636293,
    value: '25000V',
  },
  {
    begin: 636293,
    end: 826794,
    value: '1500V',
  },
  {
    begin: 826794,
    end: 890963,
    value: '25000V',
  },
  {
    begin: 890963,
    end: 1115651,
    value: '1500V',
  },
];

export const validPowerRestrictionRanges: RangedValue[] = [
  {
    begin: 0,
    end: 636293,
    value: 'M1US',
  },
  {
    begin: 636293,
    end: 826794,
    value: 'C1US',
  },
  {
    begin: 826794,
    end: 890963,
    value: 'M3US',
  },
  {
    begin: 890963,
    end: 1115651,
    value: 'C2US',
  },
];

export const powerRestrictionRangesOnlyNoCode: RangedValue[] = [
  {
    begin: 0,
    end: 636293,
    value: 'NO_POWER_RESTRICTION',
  },
  {
    begin: 636293,
    end: 826794,
    value: 'NO_POWER_RESTRICTION',
  },
  {
    begin: 826794,
    end: 890963,
    value: 'NO_POWER_RESTRICTION',
  },
  {
    begin: 890963,
    end: 1115651,
    value: 'NO_POWER_RESTRICTION',
  },
];

export const powerRestrictionRangesMixedIn2Keys: RangedValue[] = [
  {
    begin: 0,
    end: 636293,
    value: 'C3US',
  },
  {
    begin: 636293,
    end: 826794,
    value: 'NO_POWER_RESTRICTION',
  },
  {
    begin: 826794,
    end: 890963,
    value: 'C3US',
  },
  {
    begin: 890963,
    end: 1115651,
    value: 'NO_POWER_RESTRICTION',
  },
];

export const powerRestrictionRangesWithValidRanges: RangedValue[] = [
  {
    begin: 0,
    end: 636293,
    value: 'M3US',
  },
  {
    begin: 636293,
    end: 826794,
    value: 'M1US',
  },
  {
    begin: 826794,
    end: 890963,
    value: 'C1US',
  },
  {
    begin: 890963,
    end: 1115651,
    value: 'C2US',
  },
];

/**
 * Extraction from 2N2 US
 */
export const rollingStockModes: RollingStock['effort_curves']['modes'] = {
  '1500V': {
    curves: [
      {
        cond: {
          comfort: 'STANDARD',
          electrical_profile_level: 'O',
          power_restriction_code: 'C1US',
        },
        curve: {
          speeds: [
            0, 2.7777777777777777, 5.555555555555555, 8.333333333333334, 11.11111111111111,
            13.88888888888889, 16.666666666666668, 19.444444444444443, 22.22222222222222, 25,
            27.77777777777778, 30.555555555555554, 33.333333333333336, 36.11111111111111,
            38.888888888888886, 41.666666666666664, 44.44444444444444, 47.22222222222222, 50,
            52.77777777777778, 55.55555555555556, 58.33333333333333, 61.11111111111111,
            63.888888888888886, 66.66666666666667, 69.44444444444444,
          ],
          max_efforts: [
            222640, 220440, 218230, 216030, 213820, 211620, 208550, 189250, 165600, 147200, 132480,
            120430, 110400, 101900, 94620, 88320, 82800, 77920, 73600, 69720, 66240, 63080, 60210,
            57600, 55200, 52990,
          ],
        },
      },
      {
        cond: {
          comfort: 'STANDARD',
          electrical_profile_level: 'O',
          power_restriction_code: 'C2US',
        },
        curve: {
          speeds: [
            0, 2.7777777777777777, 5.555555555555555, 8.333333333333334, 11.11111111111111,
            13.47222222222222, 15, 16.38888888888889, 18.13888888888889, 21.63888888888889,
            25.13888888888889, 26.88888888888889, 34.166666666666664, 41.02777777777777,
            46.72222222222222, 53.13888888888889, 58.833333333333336, 65.66666666666667,
          ],
          max_efforts: [
            222640, 220440, 218230, 216030, 213820, 204000, 190000, 174500, 160000, 134000, 115000,
            108000, 89500, 76000, 66500, 58500, 52500, 47000,
          ],
        },
      },
      {
        cond: {
          comfort: 'STANDARD',
          electrical_profile_level: 'O',
          power_restriction_code: 'C3US',
        },
        curve: {
          speeds: [
            0, 2.7777777777777777, 5.555555555555555, 8.333333333333334, 8.86111111111111,
            10.02777777777778, 11.194444444444445, 12.666666666666666, 15, 17.63888888888889,
            18.666666666666668, 22.61111111111111, 27, 31.11111111111111, 36.083333333333336,
            39.888888888888886, 47.80555555555555, 49.86111111111111, 54.833333333333336,
            59.52777777777778, 68.75,
          ],
          max_efforts: [
            222640, 220440, 218230, 216030, 204000, 190000, 174500, 160000, 134000, 115000, 108000,
            89500, 76000, 66500, 58500, 52500, 47000, 42500, 38000, 36000, 31000,
          ],
        },
      },
      {
        cond: {
          comfort: 'STANDARD',
          electrical_profile_level: 'O',
          power_restriction_code: 'C4US',
        },
        curve: {
          speeds: [
            0, 0.888888888888889, 2.972222222222222, 5.944444444444444, 6.527777777777778, 8,
            9.472222222222223, 11.805555555555555, 14.138888888888888, 15.305555555555555,
            18.833333333333332, 22.055555555555557, 25.583333333333332, 29.11111111111111,
            32.333333333333336, 36.44444444444444, 40.25, 45.55555555555556, 47.88888888888889,
            55.80555555555556, 65.80555555555556,
          ],
          max_efforts: [
            222640, 211000, 211000, 204000, 190000, 174500, 160000, 134000, 115000, 108000, 89500,
            76000, 66500, 58500, 52500, 47000, 42500, 38000, 36000, 31000, 26000,
          ],
        },
      },
      {
        cond: {
          comfort: 'STANDARD',
          electrical_profile_level: 'O',
          power_restriction_code: null,
        },
        curve: {
          speeds: [
            0, 2.7777777777777777, 5.555555555555555, 8.333333333333334, 11.11111111111111,
            13.88888888888889, 16.666666666666668, 19.444444444444443, 22.22222222222222, 25,
            27.77777777777778, 30.555555555555554, 33.333333333333336, 36.11111111111111,
            38.888888888888886, 41.666666666666664, 44.44444444444444, 47.22222222222222, 50,
            52.77777777777778, 55.55555555555556, 58.33333333333333, 61.11111111111111,
            63.888888888888886, 66.66666666666667, 69.44444444444444,
          ],
          max_efforts: [
            222640, 220440, 218230, 216030, 213820, 211620, 208550, 189250, 165600, 147200, 132480,
            120430, 110400, 101900, 94620, 88320, 82800, 77920, 73600, 69720, 66240, 63080, 60210,
            57600, 55200, 52990,
          ],
        },
      },
    ],
    default_curve: {
      speeds: [
        0, 2.7777777777777777, 5.555555555555555, 8.333333333333334, 11.11111111111111,
        13.88888888888889, 16.666666666666668, 19.444444444444443, 22.22222222222222, 25,
        27.77777777777778, 30.555555555555554, 33.333333333333336, 36.11111111111111,
        38.888888888888886, 41.666666666666664, 44.44444444444444, 47.22222222222222, 50,
        52.77777777777778, 55.55555555555556, 58.33333333333333, 61.11111111111111,
        63.888888888888886, 66.66666666666667, 69.44444444444444,
      ],
      max_efforts: [
        222640, 220440, 218230, 216030, 213820, 211620, 208550, 189250, 165600, 147200, 132480,
        120430, 110400, 101900, 94620, 88320, 82800, 77920, 73600, 69720, 66240, 63080, 60210,
        57600, 55200, 52990,
      ],
    },
    is_electric: true,
  },
  '25000V': {
    curves: [
      {
        cond: {
          comfort: 'STANDARD',
          electrical_profile_level: '25000V',
          power_restriction_code: 'M1US',
        },
        curve: {
          speeds: [
            0, 2.7777777777777777, 5.555555555555555, 8.333333333333334, 11.11111111111111,
            13.88888888888889, 16.666666666666668, 19.444444444444443, 22.22222222222222, 25,
            27.77777777777778, 30.555555555555554, 33.333333333333336, 36.11111111111111,
            38.888888888888886, 41.666666666666664, 44.44444444444444, 47.22222222222222, 50,
            50.83333333333333, 52.77777777777778, 55.55555555555556, 58.33333333333333,
            61.11111111111111, 63.888888888888886, 66.66666666666667, 69.44444444444444,
            72.22222222222221, 75, 77.77777777777777, 80.55555555555556, 83.33333333333333,
            86.11111111111111, 88.88888888888889,
          ],
          max_efforts: [
            222640, 220470, 218290, 216120, 213950, 211780, 209600, 207430, 205260, 203090, 200910,
            198740, 196570, 194400, 192220, 190050, 187880, 185700, 183530, 182870, 175830, 167040,
            159090, 151850, 145250, 139200, 133630, 128490, 123730, 119310, 115200, 111360, 107770,
            104400,
          ],
        },
      },
      {
        cond: {
          comfort: 'STANDARD',
          electrical_profile_level: '25000V',
          power_restriction_code: 'M2US',
        },
        curve: {
          speeds: [
            0, 2.7777777777777777, 5.555555555555555, 8.333333333333334, 11.11111111111111,
            13.88888888888889, 16.666666666666668, 19.444444444444443, 22.22222222222222, 25,
            27.77777777777778, 30.555555555555554, 33.333333333333336, 36.11111111111111,
            38.888888888888886, 41.666666666666664, 44.44444444444444, 47.22222222222222, 50,
            52.77777777777778, 55.55555555555556, 58.33333333333333, 61.11111111111111,
            63.888888888888886, 66.66666666666667, 69.44444444444444, 72.22222222222221, 75,
            77.77777777777777, 80.55555555555556, 83.33333333333333, 88.88888888888889,
          ],
          max_efforts: [
            222640, 220470, 218290, 216120, 213950, 211780, 209600, 207430, 205260, 203090, 200910,
            198740, 190800, 176120, 163540, 152640, 143100, 134680, 127200, 120510, 114480, 109030,
            104070, 99550, 95400, 91580, 88060, 84800, 81770, 78950, 76320, 71550,
          ],
        },
      },
      {
        cond: {
          comfort: 'STANDARD',
          electrical_profile_level: '25000V',
          power_restriction_code: 'M3US',
        },
        curve: {
          speeds: [
            0, 2.7777777777777777, 5.555555555555555, 8.333333333333334, 11.11111111111111,
            13.88888888888889, 16.666666666666668, 19.444444444444443, 22.22222222222222, 25,
            27.77777777777778, 30.555555555555554, 33.333333333333336, 36.11111111111111,
            38.888888888888886, 41.666666666666664, 44.44444444444444, 47.22222222222222, 50,
            52.77777777777778, 55.55555555555556, 58.33333333333333, 61.11111111111111,
            63.888888888888886, 66.66666666666667, 69.44444444444444, 72.22222222222221, 75,
            77.77777777777777, 80.55555555555556, 83.33333333333333, 86.11111111111111,
            88.88888888888889,
          ],
          max_efforts: [
            222640, 220470, 218290, 216120, 213950, 211780, 209600, 207430, 205260, 188000, 169200,
            153820, 141000, 130150, 120860, 112800, 105750, 99530, 94000, 89050, 84600, 80570,
            76910, 73560, 70500, 67680, 65080, 62670, 60430, 58340, 56400, 54580, 52870,
          ],
        },
      },
      {
        cond: {
          comfort: 'STANDARD',
          electrical_profile_level: '25000V',
          power_restriction_code: 'M4US',
        },
        curve: {
          speeds: [
            0, 2.7777777777777777, 5.555555555555555, 8.333333333333334, 11.11111111111111,
            13.88888888888889, 16.666666666666668, 19.444444444444443, 22.22222222222222, 25,
            27.77777777777778, 30.555555555555554, 33.333333333333336, 36.11111111111111,
            38.888888888888886, 41.666666666666664, 44.44444444444444, 47.22222222222222, 50,
            52.77777777777778, 55.55555555555556, 58.33333333333333, 61.11111111111111,
            63.888888888888886, 66.66666666666667, 69.44444444444444, 72.22222222222221, 75,
            77.77777777777777, 80.55555555555556, 83.33333333333333, 86.11111111111111,
            88.88888888888889,
          ],
          max_efforts: [
            222640, 220470, 218290, 216120, 213950, 211780, 182400, 156340, 136800, 121600, 109440,
            99490, 91200, 84180, 78170, 72960, 68400, 64370, 60800, 57600, 54720, 52110, 49740,
            47580, 45600, 43770, 42090, 40530, 39080, 37730, 36480, 35300, 34200,
          ],
        },
      },
      {
        cond: {
          comfort: 'STANDARD',
          electrical_profile_level: '25000V',
          power_restriction_code: null,
        },
        curve: {
          speeds: [
            0, 2.7777777777777777, 5.555555555555555, 8.333333333333334, 11.11111111111111,
            13.88888888888889, 16.666666666666668, 19.444444444444443, 22.22222222222222, 25,
            27.77777777777778, 30.555555555555554, 33.333333333333336, 36.11111111111111,
            38.888888888888886, 41.666666666666664, 44.44444444444444, 47.22222222222222, 50,
            50.83333333333333, 52.77777777777778, 55.55555555555556, 58.33333333333333,
            61.11111111111111, 63.888888888888886, 66.66666666666667, 69.44444444444444,
            72.22222222222221, 75, 77.77777777777777, 80.55555555555556, 83.33333333333333,
            86.11111111111111, 88.88888888888889,
          ],
          max_efforts: [
            222640, 220470, 218290, 216120, 213950, 211780, 209600, 207430, 205260, 203090, 200910,
            198740, 196570, 194400, 192220, 190050, 187880, 185700, 183530, 182870, 175830, 167040,
            159090, 151850, 145250, 139200, 133630, 128490, 123730, 119310, 115200, 111360, 107770,
            104400,
          ],
        },
      },
    ],
    default_curve: {
      speeds: [
        0, 2.7777777777777777, 5.555555555555555, 8.333333333333334, 11.11111111111111,
        13.88888888888889, 16.666666666666668, 19.444444444444443, 22.22222222222222, 25,
        27.77777777777778, 30.555555555555554, 33.333333333333336, 36.11111111111111,
        38.888888888888886, 41.666666666666664, 44.44444444444444, 47.22222222222222, 50,
        50.83333333333333, 52.77777777777778, 55.55555555555556, 58.33333333333333,
        61.11111111111111, 63.888888888888886, 66.66666666666667, 69.44444444444444,
        72.22222222222221, 75, 77.77777777777777, 80.55555555555556, 83.33333333333333,
        86.11111111111111, 88.88888888888889,
      ],
      max_efforts: [
        222640, 220470, 218290, 216120, 213950, 211780, 209600, 207430, 205260, 203090, 200910,
        198740, 196570, 194400, 192220, 190050, 187880, 185700, 183530, 182870, 175830, 167040,
        159090, 151850, 145250, 139200, 133630, 128490, 123730, 119310, 115200, 111360, 107770,
        104400,
      ],
    },
    is_electric: true,
  },
};

/**
 * Data for formatPowerRestrictionRanges
 */

export const powerRestriction: NonNullable<TrainScheduleBase['power_restrictions']> = [
  {
    from: 'step1',
    to: 'step2',
    value: 'code1',
  },
  {
    from: 'step3',
    to: 'step4',
    value: 'code2',
  },
];

export const stepPath: TrainScheduleBase['path'] = [
  {
    uic: 12345,
    id: 'step1',
  },
  {
    uic: 45686,
    id: 'step2',
  },
  {
    uic: 93405,
    id: 'step3',
  },
  {
    uic: 93405,
    id: 'step4',
  },
];

export const stepPathPositions = [0, 1000, 2000, 3000];

export const formattedPowerRestrictionRanges: Omit<SimulationPowerRestrictionRange, 'handled'>[] = [
  {
    start: 0,
    stop: 1,
    code: 'code1',
  },
  {
    start: 2,
    stop: 3,
    code: 'code2',
  },
];

/**
 * Data for addHandledToPowerRestrictions
 */

export const powerRestrictionRanges: Omit<SimulationPowerRestrictionRange, 'handled'>[] = [
  {
    start: 0,
    stop: 1,
    code: 'code1',
  },
  {
    start: 2,
    stop: 3,
    code: 'code2',
  },
  {
    start: 3,
    stop: 4,
    code: 'code1',
  },
];

export const electrificationRangesForPowerRestrictions: ElectrificationRangeV2[] = [
  {
    start: 0,
    stop: 2,
    electrificationUsage: {
      type: 'electrification',
      voltage: '1500V',
      electrical_profile_type: 'profile',
      profile: 'O',
      handled: true,
    },
  },
  {
    start: 2,
    stop: 3,
    electrificationUsage: {
      lower_pantograph: true,
      type: 'neutral_section',
      electrical_profile_type: 'no_profile',
    },
  },
  {
    start: 3,
    stop: 4,
    electrificationUsage: {
      type: 'electrification',
      voltage: '25000V',
      electrical_profile_type: 'profile',
      profile: '25000V',
      handled: true,
    },
  },
];

export const effortCurves: EffortCurves['modes'] = {
  '1500V': {
    curves: [
      {
        cond: {
          comfort: 'STANDARD',
          electrical_profile_level: 'level1',
          power_restriction_code: 'code1',
        },
        curve: {
          max_efforts: [100, 200, 300],
          speeds: [50, 100, 150],
        },
      },
      {
        cond: {
          comfort: 'STANDARD',
          electrical_profile_level: 'level1',
          power_restriction_code: 'code2',
        },
        curve: {
          max_efforts: [100, 200, 300],
          speeds: [50, 100, 150],
        },
      },
      {
        cond: {
          comfort: 'AC',
          electrical_profile_level: 'level1',
          power_restriction_code: 'code2',
        },
        curve: {
          max_efforts: [100, 200, 300],
          speeds: [50, 100, 150],
        },
      },
    ],
    default_curve: {
      max_efforts: [100, 200, 300],
      speeds: [50, 100, 150],
    },
    is_electric: true,
  },
  '25000V': {
    curves: [
      {
        cond: {
          comfort: 'AC',
          electrical_profile_level: 'level2',
          power_restriction_code: 'code3',
        },
        curve: {
          max_efforts: [400, 500, 600],
          speeds: [200, 250, 300],
        },
      },
      {
        cond: {
          comfort: 'AC',
          electrical_profile_level: 'level2',
          power_restriction_code: 'code4',
        },
        curve: {
          max_efforts: [400, 500, 600],
          speeds: [200, 250, 300],
        },
      },
    ],

    default_curve: {
      max_efforts: [400, 500, 600],
      speeds: [200, 250, 300],
    },
    is_electric: false,
  },
};

/**
 * Data for addHandledToPowerRestrictions and getRollingStockPowerRestrictionsByMode
 */
export const powerRestrictionRangesWithHandled: SimulationPowerRestrictionRange[] = [
  {
    start: 0,
    stop: 1,
    code: 'code1',
    handled: true,
  },
  {
    start: 2,
    stop: 3,
    code: 'code2',
    handled: false,
  },
  {
    start: 3,
    stop: 4,
    code: 'code1',
    handled: false,
  },
];
