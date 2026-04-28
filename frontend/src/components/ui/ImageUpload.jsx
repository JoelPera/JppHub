import { useRef, useState } from 'react'
import { Upload, Loader2, X, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../../lib/api'
import { cn } from '../../lib/cn'

export default function ImageUpload({ value, onChange, className, label = 'Imagen', aspect = 'video', testid = 'image-upload' }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const pick = () => inputRef.current?.click()
  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Solo imágenes')
    if (file.size > 5 * 1024 * 1024) return toast.error('Máximo 5 MB')
    setUploading(true)
    try {
      const res = await api.uploadFile(file)
      onChange?.(res.url)
      toast.success('Imagen subida')
    } catch (err) {
      toast.error(err.message || 'Error al subir')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }
  const clear = () => onChange?.('')

  const aspectCls = aspect === 'square' ? 'aspect-square' : 'aspect-video'

  return (
    <div className={cn('w-full', className)}>
      {label && <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2 block">{label}</label>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFile}
        className="hidden"
        data-testid={`${testid}-file-input`}
      />
      {value ? (
        <div className={cn('relative rounded-xl overflow-hidden border border-ink-200 dark:border-ink-800 group', aspectCls)}>
          <img src={value} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={pick} className="btn-secondary" data-testid={`${testid}-change-btn`}>
              <Upload size={14}/> Cambiar
            </button>
            <button type="button" onClick={clear} className="btn bg-rose-500 hover:bg-rose-600 text-white" data-testid={`${testid}-clear-btn`}>
              <X size={14}/> Quitar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={pick}
          disabled={uploading}
          className={cn(
            aspectCls,
            'w-full rounded-xl border-2 border-dashed border-ink-200 dark:border-ink-700 hover:border-ink-900 dark:hover:border-white hover:bg-ink-50 dark:hover:bg-ink-900 transition-colors flex flex-col items-center justify-center gap-2 text-ink-500 disabled:opacity-60'
          )}
          data-testid={`${testid}-upload-btn`}
        >
          {uploading ? (
            <><Loader2 size={22} className="animate-spin"/><span className="text-sm font-medium">Subiendo…</span></>
          ) : (
            <><ImageIcon size={22}/><span className="text-sm font-medium">Click para subir imagen</span><span className="text-xs text-ink-400">JPG, PNG, WEBP · Máx 5 MB</span></>
          )}
        </button>
      )}
    </div>
  )
}
