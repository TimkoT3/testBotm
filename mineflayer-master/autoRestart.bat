@CD C:\Users\Tim\mineflayer-master
@echo on
@set ex=C:\Users\Tim\mineflayer-master\start.bat
@set process=node.exe

:loop
node index.js
@timeout /t 5 /nobreak >nul
goto loop