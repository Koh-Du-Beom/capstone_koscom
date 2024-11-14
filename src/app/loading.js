import Spinner from 'react-bootstrap/Spinner';

// app/loading.js
export default function Loading() {
  return (
    <div style={styles.loadingContainer}>
      <Spinner animation="border" variant="success" />
      <p style={styles.loadingText}>페이지 로딩 중...</p>
    </div>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '18px',
    color: '#007bff',
  },
};

