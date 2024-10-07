import Spinner from 'react-bootstrap/Spinner';

function Loading() {
  return (
    <>
      <Spinner animation="border" variant="primary" />
    </>
  );
}

export default Loading;

// 이걸 로딩페이지 컴포넌트 자체로 쓰고, 모달창 로딩은 다르게 해야할듯.