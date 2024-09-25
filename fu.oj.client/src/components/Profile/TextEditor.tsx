'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Button } from "@/components/ui/button"

interface TextEditorProps {
    content: string
    onChange: (content: string) => void
}

export function TextEditor({ content, onChange }: TextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="border rounded-md p-2">
            <div className="flex space-x-2 mb-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    Bold
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    Italic
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    H2
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        const url = window.prompt('Enter the image URL')
                        if (url) {
                            editor.chain().focus().setImage({ src: url }).run()
                        }
                    }}
                >
                    Image
                </Button>
            </div>
            <EditorContent editor={editor} className="prose max-w-none" />
        </div>
    )
}