copy ..\ffmpeg.exe
ffmpeg.exe -f image2 -framerate 60 -pattern_type sequence -start_number 0 -r 60 -i ./drum02/drum02-%%9d.jpg -s 1920x1080 -c:v libx264 -preset slow -crf 15 -map 0:v:0 02min.mp4
ffmpeg.exe -f image2 -framerate 60 -pattern_type sequence -start_number 0 -r 60 -i ./drum03/drum03-%%9d.jpg -s 1920x1080 -c:v libx264 -preset slow -crf 15 -map 0:v:0 03min.mp4
ffmpeg.exe -f image2 -framerate 60 -pattern_type sequence -start_number 0 -r 60 -i ./drum11/drum11-%%9d.jpg -s 1920x1080 -c:v libx264 -preset slow -crf 15 -map 0:v:0 11min.mp4
rmdir short2 /s /q
rmdir short3 /s /q
rmdir long /s /q
del ffmpeg.exe
