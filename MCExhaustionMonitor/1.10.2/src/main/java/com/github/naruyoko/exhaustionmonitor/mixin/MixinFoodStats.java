package com.github.naruyoko.exhaustionmonitor.mixin;

import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

import com.github.naruyoko.exhaustionmonitor.ExhaustionMonitorMod;
import com.github.naruyoko.exhaustionmonitor.FoodPacket;

import net.minecraft.entity.player.EntityPlayer;
import net.minecraft.entity.player.EntityPlayerMP;
import net.minecraft.util.FoodStats;

@Mixin(FoodStats.class)
public abstract class MixinFoodStats {
    @Shadow
    private int foodLevel;
    @Shadow
    private float foodSaturationLevel;
    @Shadow
    private float foodExhaustionLevel;
    @Inject(method="addExhaustion",at=@At("HEAD"))
    public void tallyExhaustion(float exhaustion,CallbackInfo ci) {
        final float newFoodExhaustionLevel = Math.min(this.foodExhaustionLevel + exhaustion, 40.0F);
        ExhaustionMonitorMod.foodExhaustionLevelTotal+=newFoodExhaustionLevel-this.foodExhaustionLevel;
    }
    @Inject(method="onUpdate",at=@At("RETURN"))
    public void sendFoodLevels(EntityPlayer player,CallbackInfo ci) {
        ExhaustionMonitorMod.NETWORK.sendTo(new FoodPacket(this.foodLevel,this.foodSaturationLevel,this.foodExhaustionLevel), (EntityPlayerMP) player);
    }
}
