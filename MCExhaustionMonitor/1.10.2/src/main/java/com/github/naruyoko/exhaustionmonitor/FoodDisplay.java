package com.github.naruyoko.exhaustionmonitor;

import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiScreen;

public class FoodDisplay extends GuiScreen {
    Minecraft mc;
    static final int LINEH=10;
    private int drawX;
    private int drawY;
    public static boolean showFoodLevel;
    public static boolean showFoodExhaustionLevel;
    public static boolean showFoodExhaustionLevelTotal;
    public static boolean outputToLog;
    public FoodDisplay() {
        this.mc = Minecraft.getMinecraft();
    }
    public void setDrawCoord(int x,int y) {
        drawX=x;
        drawY=y;
    }
    public void drawLine(String text,int color) {
        drawString(mc.fontRendererObj,text,drawX,drawY,color);
        drawY+=LINEH;
    }
    public void draw() {
        setDrawCoord(2,2);
        int foodLevel = ExhaustionMonitorMod.foodLevel;
        float foodSaturationLevel = ExhaustionMonitorMod.foodSaturationLevel;
        float foodExhaustionLevel = ExhaustionMonitorMod.foodExhaustionLevel;
        float foodExhaustionLevelServer = ExhaustionMonitorMod.foodExhaustionLevel;
        drawLine(showFoodLevel?String.format("%d %f",foodLevel,foodSaturationLevel):"",0xffffff);
        drawLine(showFoodExhaustionLevel?String.format("%f %f",foodExhaustionLevel,foodExhaustionLevelServer):"",0xffffff);
        float foodExhaustionLevelTotal = ExhaustionMonitorMod.foodExhaustionLevelTotal;
        drawLine(showFoodExhaustionLevelTotal?String.format("%f",foodExhaustionLevelTotal):"",0xffffff);
        if (outputToLog) System.out.println(String.format("%d %d %f %f %f %f",mc.theWorld.getWorldTime(),foodLevel,foodSaturationLevel,foodExhaustionLevel,foodExhaustionLevelServer,foodExhaustionLevelTotal));
    }
}
