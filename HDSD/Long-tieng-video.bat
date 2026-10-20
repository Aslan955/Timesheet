@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === Long tieng doc vao video huong dan (Edge TTS, giong Hoai My) ===
echo.

where python >nul 2>nul || (echo [LOI] Chua cai Python. Tai tai https://www.python.org/downloads/ ^(nho tick "Add python.exe to PATH"^). & pause & exit /b 1)
where ffmpeg >nul 2>nul || (echo [LOI] Chua co ffmpeg trong PATH. Tai ban "release essentials" tai https://www.gyan.dev/ffmpeg/builds/ , giai nen va them thu muc bin vao PATH. & pause & exit /b 1)

python -c "import edge_tts" 2>nul || (echo Dang cai goi edge-tts... & python -m pip install -q edge-tts || (echo [LOI] Khong cai duoc edge-tts. & pause & exit /b 1))

for %%F in (HDSD_Bao_cao_hieu_qua_du_an.mp4 HDSD_Man_hinh_Du_an.mp4) do (
  if exist "%%F" (
    echo.
    echo ---- %%F ----
    python long_tieng.py "%%F" --voice vi-VN-HoaiMyNeural
  ) else (
    echo [BO QUA] Khong thay %%F trong thu muc nay.
  )
)

echo.
echo Xong. Video co tieng la cac file *_co_tieng.mp4 trong thu muc nay.
echo Muon doi giong nam: mo file .bat nay, thay vi-VN-HoaiMyNeural bang vi-VN-NamMinhNeural.
pause
