import json
import uuid
import time
from typing import Callable, Dict, Any, Optional
import paho.mqtt.client as mqtt
from app.config.settings import MQTT_CONFIG
from app.config.logging_config import logger

class MQTTService:
    def __init__(self):
        self.client: Optional[mqtt.Client] = None
        self.connected: bool = False
        self.message_callbacks: Dict[str, Callable] = {}
        self.pending_responses: Dict[str, Optional[Dict[str, Any]]] = {}
        
        # Create MQTT client
        self.client = mqtt.Client(
            client_id=MQTT_CONFIG["client_id"],
            protocol=mqtt.MQTTv311
        )
        
        # Set credentials
        if MQTT_CONFIG["username"] and MQTT_CONFIG["password"]:
            if self.client is not None:
                self.client.username_pw_set(
                    MQTT_CONFIG["username"],
                    MQTT_CONFIG["password"]
                )
        
        # Set callbacks
        if self.client is not None:
            self.client.on_connect = self._on_connect
            self.client.on_message = self._on_message
            self.client.on_disconnect = self._on_disconnect
        
        self.connect()
    
    def connect(self) -> None:
        """Connect to MQTT broker"""
        try:
            if self.client is not None:
                self.client.connect(
                    MQTT_CONFIG["broker"],
                    MQTT_CONFIG["port"],
                    MQTT_CONFIG["keepalive"]
                )
                self.client.loop_start()
                logger.info(f"Connecting to MQTT broker: {MQTT_CONFIG['broker']}:{MQTT_CONFIG['port']}")
            else:
                logger.error("MQTT client not initialized")
        except Exception as e:
            logger.error(f"Failed to connect to MQTT broker: {str(e)}")
    
    def _on_connect(self, client: mqtt.Client, userdata: Any, flags: Dict[str, Any], rc: int) -> None:
        """Callback when connected to broker"""
        if rc == 0:
            self.connected = True
            logger.info("Connected to MQTT broker successfully")
            
            # Subscribe to response topics
            topics = [
                MQTT_CONFIG["topics"]["response"],
                MQTT_CONFIG["topics"]["status"],
                MQTT_CONFIG["topics"]["task_update"]
            ]
            if self.client is not None:
                for topic in topics:
                    self.client.subscribe(topic)
                    logger.info(f"Subscribed to: {topic}")
        else:
            self.connected = False
            logger.error(f"Failed to connect to MQTT broker with code: {rc}")
    
    def _on_disconnect(self, client: mqtt.Client, userdata: Any, rc: int) -> None:
        """Callback when disconnected from broker"""
        self.connected = False
        logger.warning("Disconnected from MQTT broker")
    
    def _on_message(self, client: mqtt.Client, userdata: Any, msg: mqtt.MQTTMessage) -> None:
        """Callback when message is received"""
        try:
            payload = json.loads(msg.payload.decode())
            logger.info(f"Received MQTT message on {msg.topic}: {payload}")
            
            # Check if this is a response to a pending request
            message_id = payload.get("message_id")
            if message_id and message_id in self.pending_responses:
                self.pending_responses[message_id] = payload
                logger.info(f"Received response for message_id: {message_id}")
            
            # Call registered callbacks
            if msg.topic in self.message_callbacks:
                self.message_callbacks[msg.topic](payload)
                
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse MQTT message: {str(e)}")
        except Exception as e:
            logger.error(f"Error processing MQTT message: {str(e)}")
    
    def publish_command(self, command: Dict[str, Any], wait_for_response: bool = True, timeout: int = 10) -> Optional[Dict[str, Any]]:
        """Publish a command to MQTT and optionally wait for response"""
        try:
            if not self.connected:
                logger.warning("MQTT not connected, attempting to reconnect...")
                self.connect()
                time.sleep(1)
                if not self.connected:
                    raise Exception("MQTT broker not connected")
            
            if self.client is None:
                raise Exception("MQTT client not initialized")
            
            # Generate unique message ID
            message_id = str(uuid.uuid4())
            command["message_id"] = message_id
            command["timestamp"] = time.time()
            
            # Store for response tracking
            if wait_for_response:
                self.pending_responses[message_id] = None
            
            # Publish command
            topic = MQTT_CONFIG["topics"]["commands"]
            payload = json.dumps(command)
            result = self.client.publish(topic, payload, qos=1)
            
            if result.rc != mqtt.MQTT_ERR_SUCCESS:
                logger.error(f"Failed to publish MQTT message: {result.rc}")
                if wait_for_response:
                    self.pending_responses.pop(message_id, None)
                return None
            
            logger.info(f"Published command to {topic}: {command}")
            
            # Wait for response if requested
            if wait_for_response:
                start_time = time.time()
                while time.time() - start_time < timeout:
                    if message_id in self.pending_responses and self.pending_responses[message_id] is not None:
                        response = self.pending_responses.pop(message_id)
                        return response
                    time.sleep(0.1)
                
                # Timeout
                self.pending_responses.pop(message_id, None)
                logger.warning(f"Timeout waiting for response to message_id: {message_id}")
                return None
            
            return {"message_id": message_id, "status": "sent"}
            
        except Exception as e:
            logger.error(f"Error publishing MQTT command: {str(e)}")
            return None
    
    def register_callback(self, topic: str, callback: Callable) -> None:
        """Register a callback for a specific topic"""
        self.message_callbacks[topic] = callback
        logger.info(f"Registered callback for topic: {topic}")
    
    def disconnect(self) -> None:
        """Disconnect from MQTT broker"""
        if self.client is not None:
            self.client.loop_stop()
            self.client.disconnect()
            self.connected = False
            logger.info("Disconnected from MQTT broker")

# Singleton instance
mqtt_service = MQTTService()