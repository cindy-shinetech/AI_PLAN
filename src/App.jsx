import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CssBaseline, Container } from '@mui/material'
import UploadPage from './pages/UploadPage'
import RecognitionResults from './pages/RecognitionResults'

function App() {
  return (
    <Router>
      <CssBaseline />
      {/* <Container maxWidth="lg"> */}
        <Routes> 
          <Route path="/" element={<UploadPage />} />
          <Route path="/results" element={<RecognitionResults />} /> 
        </Routes>
      {/* </Container> */}
    </Router>
  )
}

export default App