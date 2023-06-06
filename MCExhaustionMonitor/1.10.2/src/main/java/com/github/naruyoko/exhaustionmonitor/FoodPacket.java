package com.github.naruyoko.exhaustionmonitor;

import io.netty.buffer.ByteBuf;
import net.minecraftforge.fml.common.network.simpleimpl.IMessage;

public class FoodPacket implements IMessage {
    private int foodLevel;
    private float foodSaturationLevel;
    private float foodExhaustionLevel;
    public FoodPacket(int foodLevel,float foodSaturationLevel,float foodExhaustionLevel) {
        super();
        this.foodLevel=foodLevel;
        this.foodSaturationLevel=foodSaturationLevel;
        this.foodExhaustionLevel=foodExhaustionLevel;
    }
    public FoodPacket() {
        this(0,0,0);
    }
    @Override
    public void fromBytes(ByteBuf buf) {
        foodLevel=buf.readInt();
        foodSaturationLevel=buf.readFloat();
        foodExhaustionLevel=buf.readFloat();
    }
    @Override
    public void toBytes(ByteBuf buf) {
        buf.writeInt(foodLevel);
        buf.writeFloat(foodSaturationLevel);
        buf.writeFloat(foodExhaustionLevel);
    }
    public int getFoodLevel() {
        return this.foodLevel;
    }
    public float getFoodSaturationLevel() {
        return this.foodSaturationLevel;
    }
    public float getFoodExhaustionLevel() {
        return this.foodExhaustionLevel;
    }
}
