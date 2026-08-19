/**
 * Màn quản lý MỘT danh mục tuyển dụng (mỗi danh mục 1 màn riêng, chọn từ sidebar).
 * - Bảng liệt kê: Tên / Mã / Độ ưu tiên.
 * - Thêm mới / Sửa qua popup nhập Tên, Mã, Độ ưu tiên.
 * Dữ liệu lấy từ CatalogContext dùng chung → chỉnh ở đây cập nhật ngay các select
 * ở màn chi tiết ứng viên.
 */
import React, { useMemo, useState } from 'react';
import { Database, Plus, Pencil, Trash2, Check, X, Search, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCatalog, CatalogKey, CatalogItem, suggestCode } from '../catalog/CatalogContext';

interface EditorState {
  mode: 'add' | 'edit';
  index: number;         // -1 khi thêm mới
  name: string;
  code: string;
  priority: string;      // giữ string để nhập liệu, ép số khi lưu
  codeTouched: boolean;  // đã sửa mã thủ công chưa (để auto-gợi ý mã theo tên)
}

export const CatalogPage: React.FC<{ catalogKey: CatalogKey }> = ({ catalogKey }) => {
  const { catalogs, getDef, addItem, updateItem, removeItem } = useCatalog();
  const def = getDef(catalogKey);
  const items = catalogs[catalogKey];

  const [search, setSearch] = useState('');
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [formError, setFormError] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const flash = (type: 'success' | 'error', text: string) => {
    setMsg({ type, text });
    window.setTimeout(() => setMsg(null), 2500);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items
      .map((it, i) => ({ it, i }))
      .filter(({ it }) => !q || it.name.toLowerCase().includes(q) || it.code.toLowerCase().includes(q));
  }, [items, search]);

  const openAdd = () => {
    const nextPriority = items.length ? Math.max(...items.map((it) => it.priority)) + 1 : 1;
    setFormError('');
    setEditor({ mode: 'add', index: -1, name: '', code: '', priority: String(nextPriority), codeTouched: false });
  };

  const openEdit = (index: number, it: CatalogItem) => {
    setFormError('');
    setEditor({ mode: 'edit', index, name: it.name, code: it.code, priority: String(it.priority), codeTouched: true });
  };

  const submit = () => {
    if (!editor) return;
    const item: CatalogItem = {
      name: editor.name.trim(),
      code: editor.code.trim(),
      priority: Number(editor.priority) || 0,
    };
    const err = editor.mode === 'add' ? addItem(catalogKey, item) : updateItem(catalogKey, editor.index, item);
    if (err) {
      setFormError(err);
      return;
    }
    flash('success', editor.mode === 'add' ? `Đã thêm "${item.name}"` : 'Đã cập nhật');
    setEditor(null);
  };

  return (
    <div className="p-6 h-full">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0fa57c]/10 flex items-center justify-center">
            <Database size={22} className="text-[#0fa57c]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">{def.label}</h1>
            <p className="text-xs text-slate-400 font-medium">{def.description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="px-4 py-2.5 bg-[#0fa57c] text-white rounded-xl text-xs font-bold hover:bg-[#0fa57c]/90 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer active:scale-95"
        >
          <Plus size={15} /> Thêm mới
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Thanh tìm kiếm */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between gap-3 flex-wrap">
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc mã..."
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c] transition-all"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            Tổng số: <span className="text-slate-800">{items.length}</span> {def.itemLabel}
          </span>
        </div>

        {/* Thông báo */}
        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mx-5 mt-3 text-[11px] font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 ${
                msg.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              {msg.type === 'success' ? <Check size={13} /> : <X size={13} />}
              {msg.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bảng */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="pl-5 pr-2 py-3.5 w-12">#</th>
                <th className="px-4 py-3.5 font-bold">Tên</th>
                <th className="px-4 py-3.5 font-bold">Mã</th>
                <th className="px-4 py-3.5 font-bold w-32">Độ ưu tiên</th>
                <th className="px-4 py-3.5 font-bold w-24 text-right pr-5">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-slate-300">
                    {search ? 'Không tìm thấy kết quả phù hợp.' : 'Danh mục trống — hãy thêm phần tử mới.'}
                  </td>
                </tr>
              ) : (
                filtered.map(({ it, i }, rowIdx) => (
                  <tr key={i} className="group hover:bg-slate-50/70 transition-colors">
                    <td className="pl-5 pr-2 py-3 text-[11px] font-bold text-slate-300">{rowIdx + 1}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700 break-words">{it.name}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">{it.code}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono">{it.priority}</td>
                    <td className="px-4 py-3 pr-5">
                      <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openEdit(i, it)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#0fa57c] cursor-pointer"
                          title="Sửa"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Xoá "${it.name}" khỏi danh mục "${def.label}"?`)) {
                              removeItem(catalogKey, i);
                              flash('success', `Đã xoá "${it.name}"`);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-500 cursor-pointer"
                          title="Xoá"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Popup thêm / sửa ===== */}
      <AnimatePresence>
        {editor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            onClick={() => setEditor(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {editor.mode === 'add' ? `Thêm ${def.itemLabel} mới` : `Sửa ${def.itemLabel}`}
                  </h3>
                  <p className="text-[11px] text-slate-400">Danh mục: {def.label}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditor(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-500 mb-1.5">
                    Tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    autoFocus
                    value={editor.name}
                    onChange={(e) =>
                      setEditor((s) =>
                        s
                          ? {
                              ...s,
                              name: e.target.value,
                              // Tự gợi ý mã theo tên nếu người dùng chưa sửa mã thủ công
                              code: s.codeTouched ? s.code : suggestCode(e.target.value),
                            }
                          : s,
                      )
                    }
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                    placeholder="VD: LinkedIn"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-500 mb-1.5">
                    Mã <span className="text-rose-500">*</span>
                  </label>
                  <input
                    value={editor.code}
                    onChange={(e) => setEditor((s) => (s ? { ...s, code: e.target.value, codeTouched: true } : s))}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                    placeholder="VD: LINKEDIN"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono outline-none focus:border-[#0fa57c]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-500 mb-1.5">Độ ưu tiên</label>
                  <input
                    type="number"
                    value={editor.priority}
                    onChange={(e) => setEditor((s) => (s ? { ...s, priority: e.target.value } : s))}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                    placeholder="1"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Số nhỏ hiển thị trước trong danh sách chọn.</p>
                </div>

                {formError && (
                  <div className="text-[11px] font-bold px-3 py-2 rounded-lg bg-rose-50 text-rose-600 flex items-center gap-1.5">
                    <AlertCircle size={13} /> {formError}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/40">
                <button
                  type="button"
                  onClick={() => setEditor(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  onClick={submit}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0fa57c] hover:bg-[#0c8a68] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={15} /> {editor.mode === 'add' ? 'Thêm' : 'Lưu'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
