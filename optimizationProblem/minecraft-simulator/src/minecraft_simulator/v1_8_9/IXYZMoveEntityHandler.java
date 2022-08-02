package minecraft_simulator.v1_8_9;

public interface IXYZMoveEntityHandler<T extends AbstractXYZPlayer> {
  public SimulationFlagsOut moveEntity(T player,double x,double y,double z,SimulationFlagsIn flagsIn,SimulationFlagsOut flagsOut);
}
