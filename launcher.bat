rem /////////////////////////////////////
rem ////   Assistant Bot Launcher    ////
rem ////   By: Front         V1.0    ////
rem /////////////////////////////////////

@echo off
cls
title Windows - Assistant Bot
node advlaunch.js
:go
echo Restarting
node launch.js
goto go