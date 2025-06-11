import { BrowserRouter as Router, Routes, Route } from 'react-router'
import { CssBaseline, Container, Button } from '@mui/material'
import UploadPage from './pages/UploadPage'
import RecognitionResults from './pages/RecognitionResults'
import { useAuth } from 'react-oidc-context'
import { PageContainer } from './components/Layout/PageContainer'
import { Loading } from './components/Loading'

function App() {
  const auth = useAuth();
  if (auth.isLoading) {
    return <div className='h-full w-full flex items-center justify-center'>
      <Loading />
    </div>
  }
  if (auth.error) {
    return <div>Error: {auth.error.message}</div>
  }
  if(auth.isAuthenticated) {
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
  } else {
    auth.signinRedirect();
  }
  return (
    <></>
  )
  
}

export default App