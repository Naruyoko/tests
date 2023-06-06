package com.github.naruyoko.exhaustionmonitor;

import java.util.List;

import net.minecraft.command.CommandBase;
import net.minecraft.command.CommandException;
import net.minecraft.command.ICommandSender;
import net.minecraft.entity.player.EntityPlayer;
import net.minecraft.server.MinecraftServer;
import net.minecraft.util.math.BlockPos;
import net.minecraft.util.text.TextComponentString;
import net.minecraft.util.text.TextFormatting;

public class CommandHandler extends CommandBase {
    @Override
    public void execute(MinecraftServer server,ICommandSender sender,String[] args) throws CommandException {
        if (!(sender instanceof EntityPlayer)) return;
        if (args==null||args.length==0) {
            sender.addChatMessage(new TextComponentString(TextFormatting.RED+"Too few arguments."));
        } else if (args[0].equals("reset")) {
            ExhaustionMonitorMod.foodExhaustionLevelTotal=0;
        } else if (args[0].equals("toggle")) {
            if (args.length==1) sender.addChatMessage(new TextComponentString(TextFormatting.RED+"Too few arguments."));
            else if (args[1].equals("all")) {
                FoodDisplay.showFoodLevel=!FoodDisplay.showFoodLevel;
                FoodDisplay.showFoodExhaustionLevel=!FoodDisplay.showFoodExhaustionLevel;
                FoodDisplay.showFoodExhaustionLevelTotal=!FoodDisplay.showFoodExhaustionLevelTotal;
            } else if (args[1].equals("foodlevel")) FoodDisplay.showFoodLevel=!FoodDisplay.showFoodLevel;
            else if (args[1].equals("exhaustionlevel")) FoodDisplay.showFoodExhaustionLevel=!FoodDisplay.showFoodExhaustionLevel;
            else if (args[1].equals("exhaustionleveltotal")) FoodDisplay.showFoodExhaustionLevelTotal=!FoodDisplay.showFoodExhaustionLevelTotal;
            else sender.addChatMessage(new TextComponentString(TextFormatting.RED+"Unknown toggle."));
        } else if (args[0].equals("outputtolog")) {
            FoodDisplay.outputToLog=!FoodDisplay.outputToLog;
            sender.addChatMessage(new TextComponentString(FoodDisplay.outputToLog+""));
        } else {
            sender.addChatMessage(new TextComponentString(TextFormatting.RED+"Unknown command."));
        }
    }
    @Override
    public List<String> getTabCompletionOptions(MinecraftServer server, ICommandSender sender, String[] args,
            BlockPos pos) {
        if (args.length<=1) return getListOfStringsMatchingLastWord(args,"reset","toggle","outputtolog");
        if (args.length==2&&args[0].equals("toggle")) return getListOfStringsMatchingLastWord(args,"foodlevel","exhaustionlevel","exhaustionleveltotal","all");
        return null;
    }
    @Override
    public String getCommandName() {
        return ExhaustionMonitorMod.MODID;
    }
    @Override
    public String getCommandUsage(ICommandSender sender) {
        return "command."+ExhaustionMonitorMod.MODID+".usage";
    }
}
