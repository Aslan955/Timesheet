---
name: export
description: Dùng khi cần xuất gói tài liệu BA của 1 feature cho stakeholder — định dạng PDF (in/email), DOCX (Word editable), hoặc HTML (self-contained xem browser). `/export <feature>` rồi nói định dạng, hoặc `/export <feature> pdf|docx|html`.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
user-invocable: true
disable-model-invocation: true
argument-hint: "<feature> [pdf | docx | html]"
---
<!-- Licensed to nguyennam162nvn@gmail.com — Order ZQ6DTFZBW -->

# /export — Stakeholder Export Package (PDF / DOCX / HTML)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Goal‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Gom toàn bộ tài liệu BA của 1 feature (URD/BRD/PRD/spec/erd/flows/states/UCs/screens/API test evidence/BPMN/D2 diagrams/UI test checklist+cases/user guide link) thành **1 gói tài liệu** cho stakeholder, theo định dạng user chọn:

| Định dạng | Dùng khi | Mermaid | Tool cần |
|---|---|---|---|
| **PDF** | In giấy, email attachment, archive offline | pre-render PNG scale ×3 (nét cao) embed inline | `mmdc` + `pandoc` + Chrome |
| **DOCX** | Stakeholder edit/comment/track-changes trong Word/Google Docs | pre-render PNG scale ×3 embed inline | `mmdc` + `pandoc` |
| **HTML** | Xem nhanh trên browser (double-click), share qua email/Slack | **SVG inline render sẵn lúc build — self-contained THẬT, mở offline được** + sidebar TOC + zoom modal | `mmdc` + `markdown-it-py` |

**Trang bìa (cover page):** cả 3 định dạng mở đầu bằng trang bìa (tên feature, ngày xuất, phạm vi) — PDF/HTML căn giữa sang trang riêng, DOCX giữ nội dung bìa ở đầu.

> Cả 3 định dạng chạy chung 1 helper `_scripts/build-export.py --format {fmt}` — skill này chỉ chọn format + tool-check + report. KHÔNG LLM-compose file.

## Constraints‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Hard rules — never violate‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- **Chọn định dạng bằng lời** (flag-diet) — user nói "xuất PDF cho payment" / "xuất Word" / "bản HTML"; hoặc positional `/export payment pdf`. Không rõ định dạng → hỏi 1 câu ("PDF, Word hay HTML?"), KHÔNG mặc định im lặng.
- **L1 approval** trước Write — show output path + định dạng + size estimate.
- **Feature/SRS chưa tồn tại → REFUSE + route `/srs`** (per `feature-bootstrap.md` nhóm B). Feature không khớp folder nào HOẶC không có `srs/{feature}-spec.md` → refuse tường minh + liệt kê feature hợp lệ + route. KHÔNG tự tạo feature (export cần SRS thật làm nguồn).
- **Hard-gate tools theo định dạng đã chọn** — thiếu tool → in lệnh install + abort, KHÔNG silent fallback:
  - PDF: `mmdc` + `pandoc` + Chrome (auto từ `~/.puppeteer-cache` do mmdc install). KHÔNG cần LaTeX/xelatex.
  - DOCX: `mmdc` + `pandoc`.
  - HTML: `mmdc` (render mermaid → SVG inline) + `markdown-it-py` (render MD → HTML lúc build). KHÔNG dùng CDN → file mở offline được.
- **Helper script driven** — gọi `_scripts/build-export.py --format {fmt}`, KHÔNG compose tay.
- **Output** cố định:
  - PDF: `docs/exports/{date}-feature-{slug}-package.pdf` + `docs/exports/assets/{date}-feature-{slug}/diagram-NNN.png`
  - DOCX: `docs/exports/{date}-feature-{slug}-package.docx` + assets PNG như trên
  - HTML: `docs/exports/{date}-feature-{slug}-package.html` (**self-contained THẬT — mermaid SVG + markdown render sẵn inline lúc build, KHÔNG CDN, mở offline được**)
- **Export safety** (per `delivery-readiness.md`) — ghi file local không cần confirm; **upload/gửi ra ngoài** phải hỏi trước. Skill chỉ ghi local.
- **Vietnamese-first** — PDF font `DejaVu Sans`/`DejaVu Sans Mono`; DOCX pandoc Unicode OK; HTML `lang="vi"`.

### Pitfalls — easy to get wrong‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- **mmdc render fail 1 diagram** — script giữ code block fallback + CONTINUE. Warn count trong report.
- **Verify HTML không phân biệt console.log/warn/error** — Chrome `--enable-logging` ghi mọi console message cùng marker `INFO:CONSOLE` qua stderr (giới hạn thật, cần CDP/Playwright mới tách level được, không có trên máy này). Verify coi MỌI console message là đáng nghi — export HTML là văn bản tĩnh, không nên chạy JS log gì cả, nên báo cả `console.log` bình thường cũng hợp lý.
- **Verify PDF đếm trang qua `/Count` field** (không dùng `pdfinfo`/poppler — không cài trên máy này) — đây là field chuẩn PDF, Chrome print-to-pdf luôn ghi đúng.
- **Verify chỉ tối thiểu** — không phát hiện lỗi trình bày tinh vi (layout lệch, chữ tràn bảng, màu sai). Chỉ bắt file rỗng/hỏng/vỡ rõ ràng.
- **Vietnamese font (PDF)** — thiếu font Việt → box chars. Cần font DejaVu (mmdc/pandoc default OK).
- **HTML export offline THẬT** — mermaid render → SVG inline + markdown render → HTML tĩnh NGAY LÚC BUILD bằng Python (`markdown-it-py` + `mmdc -e svg`). File không nạp CDN nào → stakeholder mở qua email/không mạng vẫn đủ nội dung. Zoom modal degrade nhẹ offline (không svg-pan-zoom lib → click vẫn phóng to full diagram, chỉ mất pan/zoom mượt). Khác `/preview` (vẫn online CDN, regen tại chỗ khi dev).
- **`build_viewer_html` dùng CHUNG `/preview`** — tham số `offline=True` chỉ `/export html` truyền. Sửa hàm này phải test CẢ 2: `/export html` (offline, SVG inline) + `/preview` (online CDN). Đã verify: preview giữ `OFFLINE=false` + 3 CDN như cũ.
- **Mermaid PNG scale ×3 cho PDF/DOCX** (`mmdc -s 3`) — nét cao khi in giấy/zoom Word, đổi lại file lớn hơn (PDF ~6MB/11 diagram). Chấp nhận được cho email.
- **Header/footer động số-trang PDF: KHÔNG có** — Chrome CLI `--print-to-pdf` không nhận custom header/footer template (chỉ Puppeteer/paged.js làm được, đã quyết KHÔNG thêm — over-engineering cho 1 BA). Danh tính tài liệu nằm ở TRANG BÌA thay thế. Giữ `--no-pdf-header-footer` (tránh URL `file://` xấu).
- **Large package** — feature 10+ diagram + full UC → PDF/DOCX 5-20MB. OK cho email.
- **Mermaid syntax invalid** — diagram đó fail; debug paste vào mermaid.live.
- **Existing file** — overwrite không hỏi (timestamp trong filename mỗi ngày mới).
- **Đổi định dạng** — chạy lại `/export {feature} {fmt-khác}`; mỗi định dạng ra file riêng, không đè nhau.
- **D2 diagrams dùng PNG có sẵn** (`docs/{feature}/d2*/**.png`, sinh bởi `render.sh` — xem `d2-activity/SKILL.md`) — export KHÔNG tự re-render D2. Nếu `.d2` sửa mà `.png` chưa regen, package sẽ nhúng ảnh cũ; chạy lại `render.sh {file}.d2 --png` trước khi export nếu cần cập nhật.
- **User guide chỉ link, không nhúng full nội dung** — cẩm nang vận hành (`docs/userguide/*.md`) có thể dài (nhiều trang), nhúng hết sẽ làm package phình to; package chỉ liệt kê link tới file gốc.
- **BPMN chỉ link .bpmn, không nhúng XML** — file `.bpmn` là XML chuẩn OMG, không có ý nghĩa đọc trực tiếp trong PDF/DOCX; package hướng dẫn import Camunda/Bizagi/draw.io hoặc mở `{feature}-bpmn-editor.html`.

## Inputs

```
/export <feature>              # hỏi định dạng nếu chưa rõ
/export <feature> pdf          # PDF luôn
/export <feature> docx         # DOCX
/export <feature> html         # HTML
```

Nói bằng lời cũng được: "xuất PDF cho payment", "bản Word của user-login", "xuất HTML feature checkout".‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Context (dynamic)

Today: !`date +%Y-%m-%d`
Features có SRS: !`for d in docs/*/srs/*-spec.md; do [ -f "$d" ] && dirname "$d" | xargs dirname | xargs basename; done | head -20`
Tool check:
  mmdc:    !`which mmdc 2>/dev/null || echo "MISSING — npm i -g @mermaid-js/mermaid-cli"`
  pandoc:  !`which pandoc 2>/dev/null || echo "MISSING — brew install pandoc (hoặc ~/bin)"`
  Chrome:  !`ls ~/.puppeteer-cache 2>/dev/null >/dev/null && echo "OK (từ mmdc)" || echo "cần cho PDF — mmdc tự cài lần đầu"`

## Approach

### Phase A — Resolve feature + format

1) **Resolve feature (nhóm B — refuse+route trước tool-check).** No-arg → interactive picker (CHỈ list feature có `srs/{feature}-spec.md`).
   - **Feature không khớp folder nào HOẶC không có `srs/{feature}-spec.md`** → **REFUSE tường minh + liệt kê feature hợp lệ + route**:
     ```
     Chưa thể chạy /export cho `{feature}` — thiếu srs/{feature}-spec.md.
     Feature có SRS: {list features có srs/{feature}-spec.md}.
     → Chạy /srs {feature} trước để tạo SRS, rồi quay lại /export {feature}.
     ```
   - **Picker RỖNG** (chưa feature nào có SRS) → friendly: "Chưa có feature nào sẵn sàng để export (chưa có srs/{feature}-spec.md). Chạy /srs <feature> trước."
2) **Resolve định dạng** — từ positional arg (`pdf`/`docx`/`html`) hoặc lời user. Không rõ → hỏi "Xuất định dạng nào — PDF (in/email), Word (edit), hay HTML (xem browser)?". Wait.

### Phase B — Tool check (theo định dạng)

3) **Hard-gate tools** cho định dạng đã chọn:
   - PDF → [mmdc, pandoc, Chrome], DOCX → [mmdc, pandoc], HTML → [python3].
   - Bất kỳ tool nào missing → in install command + abort. KHÔNG silent fallback.

### Phase C — L1 approval

4) **L1 preview:**
   ```
   [/export] Sẽ tạo {ĐỊNH DẠNG} package:
     Path:    docs/exports/{date}-feature-{feature}-package.{ext}
     Assets:  docs/exports/assets/{date}-feature-{feature}/   (chỉ PDF/DOCX — mermaid PNG)
     Engine:  {pandoc+Chrome | pandoc | _viewer_wrapper}
     Mermaid: {pre-render PNG | client-side CDN}
   Apply? (Y/n)
   ```

### Phase D — Run script

5) **Chạy:**
   ```bash
   python3 _scripts/build-export.py {feature} --format {pdf|docx|html}
   ```
   Script tự lo: compose 13-section MD (URD/BRD/PRD/SRS spec/US+AC/UC/diagrams+wireframes/OQ/traceability/**API test evidence/BPMN/D2 diagrams/UI test checklist+cases/user guide link**, mỗi mục chỉ xuất hiện nếu feature có artifact đó — không có thì ghi rõ "chưa chạy `/skill-tương-ứng`") → (PDF/DOCX) extract mermaid → `mmdc -w 1400 -b white` → PNG (D2 dùng PNG có sẵn từ `render.sh`, không render lại) → pandoc convert; (HTML) wrap `_viewer_wrapper` mermaid CDN. Cleanup intermediate.
6) **Render-verify (BẮT BUỘC, tự động, không cần skill gọi riêng)** — script tự chạy verify tối thiểu ngay sau khi tạo file, in cảnh báo nếu có:
   - **PDF**: đếm trang qua `/Count` trong Pages tree + check tỉ lệ KB/trang bất thường (nghi ngờ nhiều trang trắng).
   - **DOCX**: validate ZIP hợp lệ + `word/document.xml` có nội dung thật (đếm text run).
   - **HTML**: mở qua Chrome headless (`--dump-dom`), check DOM không rỗng + không có console message nào (page tĩnh không nên chạy JS log/warn/error).
   - Đây là mức tối thiểu (không phải visual-regression đầy đủ) — bắt file rỗng/hỏng/vỡ rõ ràng, không phát hiện lỗi trình bày tinh vi (layout lệch, màu sai...).
7) **DỪNG.**

### Phase E — Report

8) **Output:**
   ```
   ✅ {ĐỊNH DẠNG} package: docs/exports/{date}-feature-{feature}-package.{ext} ({X} KB)
      Assets:   docs/exports/assets/{date}-feature-{feature}/ ({N} mermaid PNG)   [PDF/DOCX]
      Mermaid:  {OK} renders OK, {FAIL} failed (fallback code block)
      Verify:   {✓ OK | ⚠ N cảnh báo — liệt kê}

   Share: {gửi 1 file, PNG đã embed | mở browser double-click}.
   ```

## Output

| Format | File |
|---|---|
| PDF | `docs/exports/{date}-feature-{slug}-package.pdf` + `docs/exports/assets/{date}-feature-{slug}/diagram-NNN.png` |
| DOCX | `docs/exports/{date}-feature-{slug}-package.docx` + assets PNG như trên |
| HTML | `docs/exports/{date}-feature-{slug}-package.html` — self-contained THẬT (mermaid SVG inline, 0 CDN), không cần assets rời |

Mermaid + ảnh **pre-render thành PNG** trước khi nhúng PDF/DOCX (2 định dạng này không render mermaid).

Chỉ ghi file local — KHÔNG tự upload đi đâu.

## References

- @../../rules/approval-gate.md
- @../../rules/naming-conventions.md
- @../../rules/feature-bootstrap.md
- @../../rules/delivery-readiness.md
- @../../../_scripts/build-export.py
- @../preview/SKILL.md (viewer nội bộ regen tại chỗ — KHÁC /export: preview không đóng dấu ngày, không cho stakeholder)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
