# script

Click [here](https://github.com/tu-nguyen/dotfiles/blob/main/setup/registry/registry_script.ps1)

# Restore the old Context Menu in Windows 11

1. Right-click the Start button and choose Terminal(Admin).

2. Copy the command from below, paste it into Windows Terminal Window, and press enter.

    reg.exe add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /f /ve

3. Restart File Explorer or your computer for the changes to take effect.

# Disable Game DVR

reg.exe add "HKEY_CURRENT_USER\System\GameConfigStore" /v "GameDVR_Enabled" /t REG_DWORD /d 0 /f

reg.exe add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\PolicyManager\default\ApplicationManagement\AllowGameDVR" /v "value" /t REG_DWORD /d 0 /f

# Disable Nagle's Algorithm for reduced network latency

reg.exe add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v "TcpNoDelay" /t REG_DWORD /d 1 /f
