import warnings
import logging
import sys
import codecs

# Suppress sklearn version warnings
warnings.filterwarnings('ignore', category=UserWarning)

def setup_logging():
    # Configure logging with UTF-8 encoding for Windows console
    if sys.platform == 'win32':
        try:
            # For Windows, try to use UTF-8 encoding
            sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
            sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')
        except AttributeError:
            # If buffer is not available, fall back to default
            pass
    
    # Create formatter without emojis for Windows compatibility
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    
    # File handler with UTF-8 encoding
    try:
        file_handler = logging.FileHandler('agrobot.log', encoding='utf-8')
        file_handler.setFormatter(formatter)
    except Exception:
        file_handler = None
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    root_logger.addHandler(console_handler)
    if file_handler:
        root_logger.addHandler(file_handler)
    
    # Set higher logging level for some noisy libraries
    logging.getLogger('pymongo').setLevel(logging.WARNING)
    logging.getLogger('urllib3').setLevel(logging.WARNING)
    
    return logging.getLogger(__name__)

logger = setup_logging()