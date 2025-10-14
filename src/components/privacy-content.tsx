"use client";

export function PrivacyContent() {
    return (
        <div className="prose prose-sm dark:prose-invert text-muted-foreground">
            <ul className="space-y-3">
                <li>
                    <strong>Local Storage:</strong> All data you create in this application (including your notes, categories, and settings) is stored exclusively in your browser's <strong>localStorage</strong>. It never leaves your computer.
                </li>
                <li>
                    <strong>No Cloud Sync:</strong> Your data is not uploaded to any server or cloud service. This ensures maximum privacy but also means your data does not automatically sync between devices. Use the <strong>Export/Import</strong> feature in Settings to move your data.
                </li>
                <li>
                    <strong>Password Security:</strong> When you set a password for a note, it is stored locally with the note. We have no way to access or recover your password. <strong>If you forget a password, you will lose access to that note permanently.</strong> Please store your passwords securely.
                </li>
                <li>
                    <strong>AI Features:</strong> The "Summarize" feature sends your note's content to a third-party AI service (like Google's Gemini) to generate a summary. This is the only time your note content leaves your browser, and it is not stored by the AI service after the summary is generated.
                </li>
                 <li>
                    <strong>Data Backup:</strong> Since your data is stored locally, we strongly recommend you use the "Export Data" feature in Settings regularly to create backups of your notes.
                </li>
            </ul>
        </div>
    )
}
