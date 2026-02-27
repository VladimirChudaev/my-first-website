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
  Bold, Italic, List, ListOrdered, 
  Link as LinkIcon, Underline as UnderlineIcon,
  Heading1, Heading2,
  AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { Extension } from '@tiptap/core';

// Расширение для размера шрифта
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
    } as any;
  },
});

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  // Функция для установки ссылки
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
    `p-2 rounded transition-colors ${active ? 'bg-black text-white' : 'hover:bg-gray-200 text-gray-600'}`;

  const selectClass = "text-[10px] font-bold uppercase border border-gray-300 rounded bg-white px-1 py-1 focus:ring-1 ring-black outline-none cursor-pointer min-w-[70px]";

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 rounded-t-2xl items-center">
      {/* ВЫБОР ШРИФТА */}
      <select 
        className={selectClass}
        onChange={e => editor.chain().focus().setFontFamily(e.target.value).run()}
        value={editor.getAttributes('textStyle').fontFamily || ''}
      >
        <option value="">Шрифт</option>
        <option value="Inter, sans-serif">Sans</option>
        <option value="Times New Roman, serif">Serif</option>
        <option value="monospace">Mono</option>
      </select>

      {/* РАЗМЕР ШРИФТА */}
      <select 
        className={selectClass}
        onChange={e => editor.chain().focus().setFontSize(e.target.value).run()}
      >
        <option value="">Размер</option>
        <option value="12px">12px</option>
        <option value="16px">16px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="32px">32px</option>
      </select>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* КНОПКИ СТИЛЯ */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}><Bold size={16}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}><Italic size={16}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))}><UnderlineIcon size={16}/></button>
      
      {/* КНОПКА ССЫЛКИ — ВЕРНУЛАСЬ */}
      <button type="button" onClick={setLink} className={btnClass(editor.isActive('link'))}><LinkIcon size={16}/></button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      {/* ВЫРАВНИВАНИЕ */}
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))}><AlignLeft size={16}/></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))}><AlignCenter size={16}/></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))}><AlignRight size={16}/></button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      {/* СПИСКИ И ЗАГОЛОВКИ */}
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))}><Heading1 size={16}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}><Heading2 size={16}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}><List size={16}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}><ListOrdered size={16}/></button>
    </div>
  );
};

export default function Editor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ 
        dropcursor: {},
        paragraph: false,
      }),
      Paragraph.configure({
        HTMLAttributes: { class: 'min-h-[1rem]' },
      }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ 
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none p-6 min-h-[250px] focus:outline-none rounded-b-2xl bg-white prose-p:my-4 empty:prose-p:after:content-["\\00a0"]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!isMounted) return <div className="border rounded-2xl bg-gray-50 min-h-[230px] animate-pulse" />;

  return (
    <div className="border rounded-2xl bg-white shadow-sm overflow-hidden border-gray-200 focus-within:ring-2 ring-black transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}