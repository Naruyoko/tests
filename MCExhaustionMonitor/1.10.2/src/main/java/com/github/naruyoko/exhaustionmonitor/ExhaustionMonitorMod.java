package com.github.naruyoko.exhaustionmonitor;

import net.minecraft.client.Minecraft;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.common.Mod.EventHandler;
import net.minecraftforge.fml.common.event.FMLInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPreInitializationEvent;
import net.minecraftforge.fml.common.event.FMLServerStartingEvent;
import net.minecraftforge.fml.common.network.NetworkRegistry;
import net.minecraftforge.fml.common.network.simpleimpl.SimpleNetworkWrapper;
import net.minecraftforge.fml.relauncher.Side;

@Mod(modid = ExhaustionMonitorMod.MODID, name = ExhaustionMonitorMod.NAME, version = ExhaustionMonitorMod.VERSION)
public class ExhaustionMonitorMod
{
    public static final String MODID = "exhaustionmonitor";
    public static final String NAME="Exhaustion Monitor";
    public static final String VERSION="${version}";
    public static final String MCVERSION="${mcversion}";
    Minecraft mc;
    public static SimpleNetworkWrapper NETWORK;
    public static EventListener eventListener;
    public static FoodDisplay display;
    public static int foodLevel;
    public static float foodSaturationLevel;
    public static float foodExhaustionLevel;
    public static float foodExhaustionLevelTotal;

    @EventHandler
    public void preInit(FMLPreInitializationEvent event)
    {
        NETWORK=NetworkRegistry.INSTANCE.newSimpleChannel(MODID);
        NETWORK.registerMessage(FoodHandler.class,FoodPacket.class,0,Side.CLIENT);
    }
    @EventHandler
    public void init(FMLInitializationEvent event)
    {
        mc=Minecraft.getMinecraft();
        display=new FoodDisplay();
        MinecraftForge.EVENT_BUS.register(eventListener=new EventListener(mc));
    }
    @EventHandler
    public void serverInit(FMLServerStartingEvent event)
    {
        foodExhaustionLevelTotal=0;
        event.registerServerCommand(new CommandHandler());
    }
}
