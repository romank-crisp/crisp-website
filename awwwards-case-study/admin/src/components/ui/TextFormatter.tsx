import React, { Fragment } from 'react';

interface TextFormatterProps {
    text: string;
}

export type TextToken = {
    content: string;
    type: 'dark-gradient' | 'light-gradient' | 'italic' | 'text';
};

/**
 * Tokenizes text into chunks of formatting types without applying React nodes.
 * Used for detailed character/word span-level animations like in GSAP.
 */
export function tokenizeText(text: string): TextToken[] {
    if (!text) return [];

    // Split by ***text***, **text**, or *text* keeping the matched tokens
    // We match *** first, then **, then *
    // We ALSO keep the old _text_ logic for backwards compatibility if needed
    // Using [\s\S]*? instead of .*? to match across newlines \n
    const tokens = text.split(/(\*\*\*[\s\S]*?\*\*\*|\*\*[\s\S]*?\*\*|\*[\s\S]*?\*|_[\s\S]*?_)/g);

    return tokens.filter(t => t.length > 0).map((token) => {
        if (token.startsWith('***') && token.endsWith('***') && token.length > 6) {
            // Dark to red animated gradient
            return { type: 'dark-gradient', content: token.slice(3, -3) };
        } else if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
            // White to red animated gradient
            return { type: 'light-gradient', content: token.slice(2, -2) };
        } else if (
            ((token.startsWith('*') && token.endsWith('*')) ||
                (token.startsWith('_') && token.endsWith('_'))) &&
            token.length > 2
        ) {
            // Default: color--text italic
            // We use standard italic font-serif text-text 
            return { type: 'italic', content: token.slice(1, -1) };
        } else {
            return { type: 'text', content: token };
        }
    });
}

/**
 * TextFormatter safely parses lightweight Markdown-like formatting 
 * (*italic*, **bold**, _italic_) without requiring dangerouslySetInnerHTML.
 */
export const TextFormatter = ({ text }: TextFormatterProps) => {
    if (!text) return null;

    // Tokenize the whole string FIRST, so that multiline tokens aren't broken by 
    // premature \n splitting.
    const tokens = tokenizeText(text);

    return (
        <>
            {tokens.map((token, tokenIndex) => {
                // Now, safely render line breaks INSIDE the token content 
                // regardless of what type of token it is.
                // We handle real \n, literal \n, and <br/> tags.
                const processedContent = token.content
                    .replace(/\\n/g, '\n')
                    .replace(/<br\s*\/?>/gi, '\n');

                const lines = processedContent.split('\n');

                const renderLines = (className: string) => (
                    <em key={tokenIndex} className={className}>
                        {lines.map((line, lineIndex) => (
                            <Fragment key={lineIndex}>
                                {line}
                                {lineIndex < lines.length - 1 && <br />}
                            </Fragment>
                        ))}
                    </em>
                );

                if (token.type === 'dark-gradient') {
                    // Using inline instead of inline-block to allow natural line breaking.
                    // box-decoration-break: clone in CSS will handle the styling fragments.
                    return renderLines("inline italic font-serif animate-gradient-text-dark px-1");
                } else if (token.type === 'light-gradient') {
                    return renderLines("inline italic font-serif animate-gradient-text px-1");
                } else if (token.type === 'italic') {
                    return renderLines("italic font-serif text-text px-1");
                } else {
                    return (
                        <Fragment key={tokenIndex}>
                            {lines.map((line, lineIndex) => (
                                <Fragment key={lineIndex}>
                                    {line}
                                    {lineIndex < lines.length - 1 && <br />}
                                </Fragment>
                            ))}
                        </Fragment>
                    );
                }
            })}
        </>
    );
};
