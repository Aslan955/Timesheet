#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
long_tieng.py — Lồng giọng đọc tiếng Việt vào video hướng dẫn từ file phụ đề SRT.

Cách dùng (Windows, trong thư mục chứa video + srt):
    python long_tieng.py HDSD_Bao_cao_hieu_qua_du_an.mp4
    python long_tieng.py HDSD_Man_hinh_Du_an.mp4 --voice vi-VN-NamMinhNeural

Tuỳ chọn:
    --srt FILE        file phụ đề (mặc định: cùng tên với video, đuôi .srt)
    --out FILE        video đầu ra (mặc định: <tên video>_co_tieng.mp4)
    --voice NAME      giọng Edge TTS: vi-VN-HoaiMyNeural (nữ, mặc định) hoặc vi-VN-NamMinhNeural (nam)
    --rate +0%        tốc độ đọc cơ bản, ví dụ "+10%" nhanh hơn, "-10%" chậm hơn
    --engine edge     edge (mặc định, cần Internet) hoặc espeak (giọng máy, chạy offline)
    --keep            giữ lại thư mục tạm chứa từng đoạn âm thanh

Yêu cầu: Python 3.8+, ffmpeg + ffprobe có trong PATH, và gói edge-tts (pip install edge-tts).
Mỗi câu phụ đề được đọc đúng tại mốc thời gian của nó. Nếu giọng đọc dài hơn khoảng thời gian
câu đó hiển thị, script tự tăng tốc độ đọc riêng cho câu đó (tối đa +45%) để vẫn khớp hình.
"""
import argparse, asyncio, json, os, re, shutil, subprocess, sys, tempfile

# ---------- đọc SRT ----------
def parse_srt(path):
    txt = open(path, encoding='utf-8-sig').read().replace('\r\n', '\n')
    cues = []
    for block in re.split(r'\n\s*\n', txt.strip()):
        lines = [l for l in block.split('\n') if l.strip()]
        if len(lines) < 3: continue
        m = re.match(r'(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)', lines[1])
        if not m: continue
        g = [int(x) for x in m.groups()]
        start = g[0]*3600 + g[1]*60 + g[2] + g[3]/1000
        end = g[4]*3600 + g[5]*60 + g[6] + g[7]/1000
        text_lines = [l for l in lines[2:] if not re.match(r'^\[.*\]$', l.strip())]  # bỏ dòng [Bước …]
        text = ' '.join(text_lines).strip()
        if text: cues.append({'start': start, 'end': end, 'text': text})
    return cues

# ---------- chuẩn hoá chữ để máy đọc tự nhiên hơn ----------
REPL = [
    ('→', ' rồi chọn '), ('≥', ' lớn hơn hoặc bằng '), ('≤', ' nhỏ hơn hoặc bằng '),
    ('−', ' trừ '), (' · ', ', '), ('·', ', '), ('/', ' hoặc '), ('&', ' và '),
    ('(VNĐ)', ''), ('VNĐ', 'đồng'), ('ĐVT', 'đơn vị tính'),
    ('GĐKD', 'Giám đốc kinh doanh'), ('GĐK', 'Giám đốc khối'), ('CFO', 'Kế toán'),
    ('PAKD', 'phương án kinh doanh'), ('SM', 'Giám đốc kinh doanh'), ('AM', 'A Em'),
    ('KPI', 'K P I'), ('XLSX', 'Excel'), ('PM', 'P M'), ('SP', 'S P'),
    ('Luỹ kế KH', 'Luỹ kế kế hoạch'), ('Luỹ kế TT', 'Luỹ kế thực tế'), ('Tổng KH', 'Tổng kế hoạch'),
    ('% KH', ' phần trăm kế hoạch'), (' KH ', ' kế hoạch '), (' KH.', ' kế hoạch.'), (' KH,', ' kế hoạch,'), (' KH)', ' kế hoạch)'),
    ('DT − CP', 'doanh thu trừ chi phí'), ('(DT', '(doanh thu'), (' CP ', ' chi phí '), (' TT ', ' thực tế '),
    ('".1"', 'chấm một'), ('".2"', 'chấm hai'), ('".3"', 'chấm ba'), ('".4"', 'chấm bốn'),
    ('mm/dd/yyyy', 'tháng, ngày, năm'), ('Từ – Đến', 'Từ, Đến'), ('–', ','), ('—', ','),
    ('+/-', 'cộng trừ'), ('%', ' phần trăm'), ('*', ''), ('…', '.'),
]
def normalize(text):
    for a, b in REPL: text = text.replace(a, b)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# ---------- tiện ích ffmpeg ----------
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    if r.returncode != 0:
        print(r.stderr); raise SystemExit('Lỗi khi chạy: ' + ' '.join(cmd[:3]) + ' …')
    return r.stdout

def duration(path):
    out = run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path])
    return float(out.strip())

# ---------- tạo giọng ----------
def tts_edge(text, voice, rate, out_mp3):
    import edge_tts
    async def go():
        c = edge_tts.Communicate(text, voice, rate=rate)
        await c.save(out_mp3)
    asyncio.run(go())

def tts_espeak(text, rate, out_wav):
    pct = int(rate.replace('%', '').replace('+', '') or 0)
    speed = int(160 * (1 + pct / 100))
    run(['espeak-ng', '-v', 'vi', '-s', str(speed), '-w', out_wav, text])

def synth(text, engine, voice, rate, out):
    if engine == 'edge': tts_edge(text, voice, rate, out)
    else: tts_espeak(text, rate, out)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('video'); ap.add_argument('--srt'); ap.add_argument('--out')
    ap.add_argument('--voice', default='vi-VN-HoaiMyNeural'); ap.add_argument('--rate', default='+0%')
    ap.add_argument('--engine', default='edge', choices=['edge', 'espeak']); ap.add_argument('--keep', action='store_true')
    a = ap.parse_args()

    for tool in ('ffmpeg', 'ffprobe'):
        if not shutil.which(tool): raise SystemExit(f'Không tìm thấy {tool} trong PATH. Cài ffmpeg rồi chạy lại.')
    if a.engine == 'edge':
        try: import edge_tts  # noqa
        except ImportError: raise SystemExit('Thiếu gói edge-tts. Chạy: pip install edge-tts')

    video = a.video
    srt = a.srt or os.path.splitext(video)[0] + '.srt'
    out = a.out or os.path.splitext(video)[0] + '_co_tieng.mp4'
    if not os.path.exists(srt): raise SystemExit('Không thấy file phụ đề: ' + srt)
    cues = parse_srt(srt)
    vdur = duration(video)
    print(f'Video {video}: {vdur:.1f}s — {len(cues)} câu phụ đề — giọng {a.voice if a.engine=="edge" else "espeak-ng"}')

    tmp = tempfile.mkdtemp(prefix='longtieng_')
    ext = 'mp3' if a.engine == 'edge' else 'wav'
    base_pct = int(a.rate.replace('%', '').replace('+', '') or 0)
    clips = []
    for i, c in enumerate(cues, 1):
        text = normalize(c['text'])
        window = (cues[i]['start'] if i < len(cues) else vdur) - c['start'] - 0.25  # đọc xong trước câu kế tiếp
        pct = base_pct
        for attempt in range(4):
            f = os.path.join(tmp, f'{i:03d}.{ext}')
            synth(text, a.engine, a.voice, f'{pct:+d}%', f)
            d = duration(f)
            if d <= window or attempt == 3: break
            need = int((d / window - 1) * 100) + 4
            pct = min(base_pct + 45, pct + max(need, 4))
        flag = '' if d <= window else '  (!) vẫn dài hơn khung, sẽ lấn sang câu sau'
        print(f'  [{i:02d}] {c["start"]:7.1f}s  đọc {d:4.1f}s / khung {window:4.1f}s  tốc độ {pct:+d}%{flag}')
        clips.append((c['start'], f))

    # ghép các đoạn vào đúng mốc thời gian → 1 track tiếng
    voice_track = os.path.join(tmp, 'voice.m4a')
    cmd = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error']
    for _, f in clips: cmd += ['-i', f]
    parts = ''.join(f'[{k}]aresample=48000,aformat=channel_layouts=mono,adelay={int(st*1000)}|{int(st*1000)}[a{k}];' for k, (st, _) in enumerate(clips))
    mix = ''.join(f'[a{k}]' for k in range(len(clips))) + f'amix=inputs={len(clips)}:normalize=0:dropout_transition=0,apad=whole_dur={vdur:.3f}[out]'
    cmd += ['-filter_complex', parts + mix, '-map', '[out]', '-c:a', 'aac', '-b:a', '128k', voice_track]
    run(cmd)

    # trộn vào video (giữ nguyên hình, không mã hoá lại)
    run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', video, '-i', voice_track,
         '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', out])
    print('Xong:', out)
    if a.keep: print('Các đoạn âm thanh để ở:', tmp)
    else: shutil.rmtree(tmp, ignore_errors=True)

if __name__ == '__main__':
    main()
