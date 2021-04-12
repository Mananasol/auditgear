import React from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { Controlled as CodeMirror } from 'react-codemirror2'

import { ProBadge, DocsLink } from 'src/reusable'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/theme/twilight.css'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars.js'
// import 'codemirror/mode/markdown/markdown'
// import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/xml/xml'

import sampleCode from './_examples'

const CodeEditors = () => {
  const darkMode = useSelector(state => state.darkMode)
  const [content, setContent] = React.useState(sampleCode.xml)

  const options = {
    lineNumbers: true,
    mode: 'xml',
    theme: darkMode ? 'twilight' : 'eclipse',
    autofocus: true,
    scrollbarStyle: 'simple'
  }

  return (
    <CCard>
      <CCardHeader>
        Code Editor - CodeMirror{' '}
        <ProBadge>CoreUI Pro integration</ProBadge>
        <DocsLink href="https://github.com/scniro/react-codemirror2"/>
      </CCardHeader>
      <CCardBody>
        <CodeMirror
          value={content}
          options={options}
          onBeforeChange={(editor, data, value) => setContent(value)}
        />
      </CCardBody>
    </CCard>
  )
}

export default CodeEditors
