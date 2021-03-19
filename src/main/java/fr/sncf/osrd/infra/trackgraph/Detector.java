package fr.sncf.osrd.infra.trackgraph;

import fr.sncf.osrd.simulation.Simulation;
import fr.sncf.osrd.train.Train;
import fr.sncf.osrd.train.TrainInteractionType;
import fr.sncf.osrd.train.phases.SignalNavigatePhase;

public class Detector extends Waypoint {

    public Detector(int index, String id) {
        super(index, id);
    }

    @Override
    public TrainInteractionType getInteractionType() {
        return TrainInteractionType.BOTH;
    }

    @Override
    public double getInteractionDistance() {
        return 0;
    }

    @Override
    public void interact(Simulation sim, Train train, SignalNavigatePhase.InteractionType interactionType) {
        train.interact(sim, this, interactionType);
    }
}
