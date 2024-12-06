import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from './recommend-modal.module.css';

export default function RecommendModal({ portfolio_name, toggleModal }) {
  return (
    <Modal show={true} onHide={toggleModal} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title className={styles.modalTitle}>
          포트폴리오 상세정보
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className={styles.modalBody}>
          <strong className={styles.portfolioName}>"{portfolio_name}"</strong> 포트폴리오 조회는 
          <span className={styles.paidText}>유료</span>입니다.
        </p>
        <p className={styles.additionalText}>구매창으로 이동할까요?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={toggleModal}>
          닫기
        </Button>
        <Button variant="success" onClick={toggleModal}>
          구매하기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
