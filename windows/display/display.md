# display setup

## PowerToys
https://learn.microsoft.com/en-us/windows/powertoys/install

### FancyZones
Activation key: Window + Shift + `
Zone behavior: Hold shift key to activate zones while dragging a window

### Explorer Patcher
https://github.com/valinet/ExplorerPatcher/tree/master

## Wallpaper Engine
From Steam

## SignalRGB
https://signalrgb.com/
https://trello.com/c/Zq66AJ6w/12-backup-restore

### To backup
Run the .bat file. This will generate 4 files with .reg extension in the same folder you ran the bat file from. 

### To restore

Close SignalRGB
Run those .reg files you previously backed up by double-clicking them individually or just run SignalRGB_ALL_Backup.reg and accept the prompts

## NZXT CAM
https://nzxt.com/software/cam

Use Task Scheduler to delay NZXT CAM as this application will conflict with SignalRGB

Triggers: At log on, Any user, Delat task for 2 minutes
Action: Start a program, "\..\..\NZXT CAM.exe"
Add arguments (optional): "/min"