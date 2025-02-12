import {
  effortCurves,
  electrificationRangesForPowerRestrictions,
  formattedPowerRestrictionRanges,
  powerRestriction,
  powerRestrictionRanges,
  powerRestrictionRangesWithHandled,
  stepPath,
  stepPathPositions,
} from './sampleData';
import {
  addHandledToPowerRestrictions,
  formatPowerRestrictionRanges,
} from '../formatPowerRestrictionRangesWithHandled';

describe('formatPowerRestrictionRanges', () => {
  it('should properly format power restrictions ranges', () => {
    const result = formatPowerRestrictionRanges(powerRestriction, stepPath, stepPathPositions);

    expect(result).toEqual(formattedPowerRestrictionRanges);
  });
});

describe('addHandledToPowerRestrictions', () => {
  it('should properly format power restrictions ranges with handled property', () => {
    const result = addHandledToPowerRestrictions(
      powerRestrictionRanges,
      electrificationRangesForPowerRestrictions,
      effortCurves
    );

    expect(result).toEqual(powerRestrictionRangesWithHandled);
  });
});
