'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Paragraph from '@tiptap/extension-paragraph';
import { useState, useEffect, useCallback } from 'react';
import { 
  Bold, Italic, List, 
  Link as LinkIcon, Underline as UnderlineIcon,
  Heading2, AlignLeft, AlignCenter, AlignRight, Quote
} from 'lucide-react';
import { Extension } from '@tiptap/core';

const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() { return { types: ['textStyle'] }; },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          parseHTML: element => element.style.fontSize,
          renderHTML: attributes => {
            if (!attributes.fontSize) return {};
            return { style: `font-size: ${attributes.fontSize}` };
          },
        },
      },
    }];
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }: any) => {
        return chain().setAttributes('textStyle', { fontSize: null }).run();
      },
    } as any;
  },
});

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Введите URL ссылки:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const btnClass = (active: boolean) => 
    `p-2 rounded-lg transition-all ${active ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`;

  const selectClass = "text-[11px] font-bold uppercase border border-slate-200 rounded-lg bg-white px-2 py-1.5 outline-none cursor-pointer text-slate-700";

  return (
    <div className="flex flex-wrap gap-2 p-3 border-b border-slate-100 bg-white items-center">
      <select className={selectClass} onChange={e => editor.chain().focus().setFontFamily(e.target.value).run()} value={editor.getAttributes('textStyle').fontFamily || ''}>
        <option value="">ШРИФТ</option>
        <option value="Inter, sans-serif">Sans (Inter)</option>
        <option value="Times New Roman, serif">Serif (Times)</option>
      </select>

      <select className={selectClass} value={editor.getAttributes('textStyle').fontSize || ''} onChange={e => e.target.value === '' ? editor.chain().focus().unsetFontSize().run() : editor.chain().focus().setFontSize(e.target.value).run()}>
        <option value="">РАЗМЕР</option>
        {[12, 14, 16, 18, 20, 24, 30].map(size => <option key={size} value={`${size}px`}>{size}px</option>)}
      </select>

      <div className="w-px h-6 bg-slate-200 mx-1" />

      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}><Bold size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}><Italic size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))}><UnderlineIcon size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}><Quote size={18}/></button>
      <button type="button" onClick={setLink} className={btnClass(editor.isActive('link'))}><LinkIcon size={18}/></button>
      
      <div className="w-px h-6 bg-slate-200 mx-1" />
      
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))}><AlignLeft size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))}><AlignCenter size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))}><AlignRight size={18}/></button>
      
      <div className="w-px h-6 bg-slate-200 mx-1" />
      
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}><Heading2 size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}><List size={18}/></button>
    </div>
  );
};

export default function Editor({ content, onChange, minHeight = '300px' }: { content: string, onChange: (html: string) => void, minHeight?: string }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ paragraph: false }),
      Paragraph.configure({ HTMLAttributes: { class: 'min-h-[1.5rem]' } }),
      Underline, TextStyle, FontFamily, FontSize,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `prose prose-slate max-w-none p-8 focus:outline-none rounded-b-2xl bg-white text-slate-900`,
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!isMounted) return <div className="border border-slate-200 rounded-2xl bg-white animate-pulse" style={{ minHeight }} />;

  return (
    <div className="border rounded-2xl bg-white shadow-sm overflow-hidden border-slate-200">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}