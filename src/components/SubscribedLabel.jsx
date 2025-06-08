import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function SubscribedLabel() {
  return (
    <div className="subscribed-label" style={{ color: '#FFD700', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
      <FontAwesomeIcon icon={faCheckCircle} className="icon" style={{ marginRight: '8px' }} />
      <span>Subscribed</span>
    </div>
  );
}

export default SubscribedLabel;
