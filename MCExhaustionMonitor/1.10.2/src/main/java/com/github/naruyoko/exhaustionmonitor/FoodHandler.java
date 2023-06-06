package com.github.naruyoko.exhaustionmonitor;

import net.minecraftforge.fml.common.network.simpleimpl.IMessage;
import net.minecraftforge.fml.common.network.simpleimpl.IMessageHandler;
import net.minecraftforge.fml.common.network.simpleimpl.MessageContext;
import net.minecraftforge.fml.relauncher.Side;

public class FoodHandler implements IMessageHandler<FoodPacket, IMessage> {
    @Override
    public IMessage onMessage(FoodPacket message,MessageContext ctx) {
        if (ctx.side==Side.CLIENT) {
            ExhaustionMonitorMod.foodLevel=message.getFoodLevel();
            ExhaustionMonitorMod.foodSaturationLevel=message.getFoodSaturationLevel();
            ExhaustionMonitorMod.foodExhaustionLevel=message.getFoodExhaustionLevel();
        }
        return null;
    }
}