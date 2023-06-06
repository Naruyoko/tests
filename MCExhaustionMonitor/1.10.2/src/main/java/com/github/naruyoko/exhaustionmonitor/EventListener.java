package com.github.naruyoko.exhaustionmonitor;

import net.minecraft.client.Minecraft;
import net.minecraftforge.client.event.RenderGameOverlayEvent;
import net.minecraftforge.client.event.RenderGameOverlayEvent.ElementType;
import net.minecraftforge.fml.common.eventhandler.SubscribeEvent;
import net.minecraftforge.fml.common.gameevent.PlayerEvent.PlayerRespawnEvent;

public class EventListener {
    Minecraft mc;
    public EventListener(Minecraft mc) {
        this.mc=mc;
    }
    @SubscribeEvent
    public void onDraw(RenderGameOverlayEvent.Post e) {
        if (e.getType()!=ElementType.TEXT) return;
        ExhaustionMonitorMod.display.draw();
    }
    @SubscribeEvent
    public void onRespawn(PlayerRespawnEvent e) {
        ExhaustionMonitorMod.foodExhaustionLevelTotal=0;
    }
}
