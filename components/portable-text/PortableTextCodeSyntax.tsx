'use client'

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import diff from 'react-syntax-highlighter/dist/esm/languages/prism/diff'
import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker'
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go'
import ini from 'react-syntax-highlighter/dist/esm/languages/prism/ini'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown'
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup'
import nginx from 'react-syntax-highlighter/dist/esm/languages/prism/nginx'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss'
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql'
import toml from 'react-syntax-highlighter/dist/esm/languages/prism/toml'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'

const languages: Record<string, unknown> = {
  bash,
  css,
  diff,
  docker,
  go,
  ini,
  javascript,
  json,
  jsx,
  markdown,
  markup,
  nginx,
  python,
  scss,
  sql,
  toml,
  tsx,
  typescript,
  yaml,
}
const aliases: Record<string, string> = {
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  console: 'bash',
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  yml: 'yaml',
  dockerfile: 'docker',
  html: 'markup',
  xml: 'markup',
  md: 'markdown',
}

for (const [name, language] of Object.entries(languages)) {
  SyntaxHighlighter.registerLanguage(name, language)
}
for (const [alias, target] of Object.entries(aliases)) {
  if (languages[target]) SyntaxHighlighter.registerLanguage(alias, languages[target])
}

export default function PortableTextCodeSyntax({
  language,
  code,
}: {
  language: string
  code: string
}) {
  return (
    <SyntaxHighlighter
      language={language}
      showLineNumbers
      useInlineStyles={false}
      customStyle={{
        margin: 0,
        borderRadius: 0,
        background: 'transparent',
        maxWidth: '100%',
      }}
      codeTagProps={{ style: {}, className: `language-${language}` }}
      lineNumberStyle={{ minWidth: '2.25em', paddingRight: '1em', opacity: 0.35 }}
    >
      {code}
    </SyntaxHighlighter>
  )
}
