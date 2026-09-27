import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import LeafletFarmMap from "../../components/maps/LeafletFarmMap";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    KeyboardAvoidingView,
    Modal,
    PanResponder,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
    Alert,
    RefreshControl,
    ActivityIndicator,
} from "react-native";

// Theme
import { typography } from "../../src/theme";

const MIN_DRAWER_RATIO = 0.25;
const MAX_DRAWER_RATIO = 0.7;

const TASK_OPTIONS = [
    "Washing of field",
    "Planting of the plant",
    "Soil scan",
    "Irrigation",
    "Fertilizer application",
    "Pest control",
];

const TIME_OPTIONS = [
    "6:00am",
    "8:00am",
    "10:00am",
    "12:00pm",
    "2:00pm",
    "4:00pm",
    "6:00pm",
    "8:00pm",
];

// ── API Configuration ────────────────────────────────────────────────
const YOUR_COMPUTER_IP = '192.168.0.225';

const getApiUrl = () => {
    if (Platform.OS === 'android') {
        return `http://${YOUR_COMPUTER_IP}:8000`;
    }
    if (Platform.OS === 'ios') {
        return 'http://localhost:8000';
    }
    return 'http://localhost:8000';
};

const API_BASE_URL = getApiUrl();

// ── Demo Data with Proper Task Structure ────────────────────────────
const DEMO_TASKS = [
    { 
        id: 'demo1', 
        title: "Planting of the plant", 
        time: "10:00am", 
        status: "pending",
        description: "Planting of the plant scheduled at 10:00am"
    },
    { 
        id: 'demo2', 
        title: "Washing of field", 
        time: "8:00am", 
        status: "pending",
        description: "Washing of field scheduled at 8:00am"
    },
];

const DEMO_ALERTS = [
    { 
        id: 'alert1', 
        title: "Heavy rain expected Thursday — delay irrigation", 
        time: "2h ago", 
        type: "weather",
        is_read: false 
    },
    { 
        id: 'alert2', 
        title: "New buyer inquiry for 50kg tomatoes", 
        time: "4h ago", 
        type: "buyer",
        is_read: false 
    },
    { 
        id: 'alert3', 
        title: "Disease scan: Your rice crop is healthy", 
        time: "6h ago", 
        type: "disease",
        is_read: true 
    },
];

const DEMO_BOTS = [
    {
        bot_id: '1',
        name: "AgroBot 1",
        status: "Active",
        battery: 85,
        speed: "1.2 m/s",
        plot: "Plot A",
        process: "Watering",
        location: { latitude: 19.076, longitude: 72.8777 }
    },
    {
        bot_id: '2',
        name: "AgroBot 2",
        status: "Idle",
        battery: 72,
        speed: "0.8 m/s",
        plot: "Plot B",
        process: "Standby",
        location: { latitude: 19.078, longitude: 72.88 }
    },
];

const DEMO_PLOTS = [
    { id: 'plot1', title: "Plot A", latitude: 19.076, longitude: 72.8777 },
    { id: 'plot2', title: "Plot B", latitude: 19.078, longitude: 72.88 },
    { id: 'plot3', title: "Plot C", latitude: 19.074, longitude: 72.875 },
];

export default function MapPage() {
    const { height } = useWindowDimensions();

    // ── State ────────────────────────────────────────────────────────────
    const [drawerRatio, setDrawerRatio] = useState(0.35);
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [selectedTask, setSelectedTask] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [taskList, setTaskList] = useState(DEMO_TASKS);
    const [alerts, setAlerts] = useState(DEMO_ALERTS);
    const [bots, setBots] = useState(DEMO_BOTS);
    const [plots, setPlots] = useState(DEMO_PLOTS);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [creatingTask, setCreatingTask] = useState(false);
    const [backendConnected, setBackendConnected] = useState(false);
    const [botLocation, setBotLocation] = useState({
        latitude: 19.076,
        longitude: 72.8777,
    });

    // Drawer height animation
    const drawerHeightAnim = useRef(
        new Animated.Value(height * drawerRatio),
    ).current;
    const dragStartHeight = useRef(height * drawerRatio);

    const clampHeight = (value) =>
        Math.max(
            height * MIN_DRAWER_RATIO,
            Math.min(height * MAX_DRAWER_RATIO, value),
        );

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
            onPanResponderGrant: () => {
                dragStartHeight.current = clampHeight(height * drawerRatio);
            },
            onPanResponderMove: (_, gestureState) => {
                const next = clampHeight(dragStartHeight.current - gestureState.dy);
                drawerHeightAnim.setValue(next);
            },
            onPanResponderRelease: (_, gestureState) => {
                const next = clampHeight(dragStartHeight.current - gestureState.dy);
                setDrawerRatio(next / height);
                Animated.spring(drawerHeightAnim, {
                    toValue: next,
                    useNativeDriver: false,
                    friction: 9,
                    tension: 50,
                }).start();
            },
        }),
    ).current;

    // Bot marker pulse animation
    const pulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 1600,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        );
        loop.start();
        return () => loop.stop();
    }, [pulseAnim]);

    const pulseScale = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.8],
    });

    const pulseOpacity = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.35, 0],
    });

    // ── Load Data ──────────────────────────────────────────────────────
    useEffect(() => {
        loadMapData();
        const interval = setInterval(() => {
            loadMapData(false);
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    const loadMapData = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const healthResponse = await fetch(`${API_BASE_URL}/health`);
            if (healthResponse.ok) {
                setBackendConnected(true);
                const response = await fetch(`${API_BASE_URL}/api/map/map-data`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        // Only set tasks if there are valid tasks with title
                        const validTasks = (data.tasks || []).filter(task => task.title && task.title.trim() !== '');
                        setTaskList(validTasks.length > 0 ? validTasks : DEMO_TASKS);
                        setAlerts(data.alerts?.length > 0 ? data.alerts : DEMO_ALERTS);
                        setBots(data.bots?.length > 0 ? data.bots : DEMO_BOTS);
                        setPlots(data.plots?.length > 0 ? data.plots : DEMO_PLOTS);
                        
                        if (data.bots && data.bots.length > 0) {
                            const bot = data.bots[0];
                            if (bot.location) {
                                setBotLocation({
                                    latitude: bot.location.latitude || 19.076,
                                    longitude: bot.location.longitude || 72.8777,
                                });
                            }
                        }
                    }
                }
            } else {
                setBackendConnected(false);
                setTaskList(DEMO_TASKS);
                setAlerts(DEMO_ALERTS);
                setBots(DEMO_BOTS);
                setPlots(DEMO_PLOTS);
            }
        } catch (error) {
            console.error('Error loading map data:', error);
            setBackendConnected(false);
            setTaskList(DEMO_TASKS);
            setAlerts(DEMO_ALERTS);
            setBots(DEMO_BOTS);
            setPlots(DEMO_PLOTS);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadMapData(false);
        setRefreshing(false);
    };

    // ── Create Task ──────────────────────────────────────────────────────
    const closeCreateTask = () => {
        setShowCreateTask(false);
        setSelectedTask("");
        setSelectedTime("");
    };

    const handleCreateTask = async () => {
        if (!selectedTask || !selectedTime) return;

        setCreatingTask(true);
        try {
            if (backendConnected) {
                const response = await fetch(`${API_BASE_URL}/api/map/tasks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: selectedTask,
                        time: selectedTime,
                        description: `${selectedTask} scheduled at ${selectedTime}`,
                        priority: 'medium',
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        await loadMapData(false);
                        showSuccessAlert(selectedTask, selectedTime);
                        closeCreateTask();
                    }
                } else {
                    addLocalTask();
                }
            } else {
                addLocalTask();
            }
        } catch (error) {
            console.error('Error creating task:', error);
            addLocalTask();
        } finally {
            setCreatingTask(false);
        }
    };

    const addLocalTask = () => {
        const newTask = {
            id: `local_${Date.now()}`,
            title: selectedTask,
            time: selectedTime,
            status: "pending",
            description: `${selectedTask} scheduled at ${selectedTime}`
        };
        setTaskList([...taskList, newTask]);
        showSuccessAlert(selectedTask, selectedTime);
        closeCreateTask();
    };

    const showSuccessAlert = (task, time) => {
        Alert.alert(
            "✅ Task Created",
            `${task} scheduled for ${time}`,
            [{ text: "Great", style: "default" }]
        );
    };

    // ── Get Status Color ──────────────────────────────────────────────
    const getStatusColor = (status) => {
        const colors = {
            'Active': '#34C759',
            'Idle': '#8E8E93',
            'Busy': '#FF9500',
            'Offline': '#FF3B30',
            'pending': '#FFB347',
            'in_progress': '#FF9500',
            'completed': '#34C759',
            'cancelled': '#8E8E93',
        };
        return colors[status] || '#8E8E93';
    };

    const getStatusLabel = (status) => {
        const labels = {
            'pending': 'Pending',
            'in_progress': 'In Progress',
            'completed': 'Done',
            'cancelled': 'Cancelled',
            'Active': 'Active',
            'Idle': 'Idle',
            'Busy': 'Busy',
            'Offline': 'Offline',
        };
        return labels[status] || status || 'Unknown';
    };

    // ── Format Time ──────────────────────────────────────────────────
    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    // ── Get Alert Color ──────────────────────────────────────────────
    const getAlertColor = (type) => {
        const colors = {
            'weather': '#E8F5E9',
            'disease': '#E3F2FD',
            'buyer': '#FFF8E1',
            'general': '#F5F5F5',
            'system': '#FBE9E7',
        };
        return colors[type] || '#F5F5F5';
    };

    const getAlertIcon = (type) => {
        const icons = {
            'weather': 'cloudy-outline',
            'disease': 'medkit-outline',
            'buyer': 'people-outline',
            'general': 'notifications-outline',
            'system': 'settings-outline',
        };
        return icons[type] || 'notifications-outline';
    };

    // ── Render ───────────────────────────────────────────────────────────
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2C5F2D" />
                <Text style={styles.loadingText}>Loading map data...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />

            {/* Leaflet map with farm and restricted-area overlays */}
            <LeafletFarmMap plots={plots} botLocation={botLocation} />

            {/* Top Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Map</Text>
                <View style={styles.headerRight}>
                    <View style={[
                        styles.connectionBadge,
                        backendConnected ? styles.connected : styles.disconnected
                    ]}>
                        <View style={[
                            styles.connectionDot,
                            backendConnected ? styles.dotOnline : styles.dotOffline
                        ]} />
                        <Text style={styles.connectionText}>
                            {backendConnected ? 'Online' : 'Offline'}
                        </Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.headerButton} 
                        activeOpacity={0.8}
                        onPress={onRefresh}
                    >
                        <Ionicons name="refresh-outline" size={20} color="#1A1A1A" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bottom Drawer */}
            <Animated.View style={[styles.drawer, { height: drawerHeightAnim }]}>
                <View
                    {...panResponder.panHandlers}
                    style={styles.drawerHandle}
                    hitSlop={{ top: 10, bottom: 10, left: 40, right: 40 }}
                >
                    <View style={styles.drawerHandleBar} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.drawerContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#2C5F2D"
                            colors={['#2C5F2D']}
                        />
                    }
                >
                    {/* Bot Status */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Bot Status</Text>
                            <View style={styles.statusBadge}>
                                <View style={[
                                    styles.statusDot,
                                    { backgroundColor: bots.length > 0 && bots[0].status === 'Active' ? '#34C759' : '#8E8E93' }
                                ]} />
                                <Text style={styles.statusText}>
                                    {bots.length > 0 ? bots[0].status || 'Active' : 'Offline'}
                                </Text>
                            </View>
                        </View>
                        {bots.map((bot) => (
                            <View key={bot.bot_id || bot._id} style={styles.botStatusCard}>
                                <View style={styles.botStatusHeader}>
                                    <View style={styles.botStatusName}>
                                        <View style={styles.botStatusAvatar}>
                                            <Ionicons name="hardware-chip-outline" size={16} color="#FFFFFF" />
                                        </View>
                                        <Text style={styles.botStatusNameText}>
                                            {bot.name || `AgroBot ${bot.bot_id}`}
                                        </Text>
                                    </View>
                                    <View style={styles.botStatusBattery}>
                                        <Ionicons 
                                            name="battery-half-outline"
                                            size={14} 
                                            color={bot.battery > 70 ? '#34C759' : bot.battery > 40 ? '#FF9500' : '#FF3B30'} 
                                        />
                                        <Text style={[
                                            styles.botStatusBatteryText,
                                            { color: bot.battery > 70 ? '#34C759' : bot.battery > 40 ? '#FF9500' : '#FF3B30' }
                                        ]}>
                                            {bot.battery || 0}%
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.botStatusDetails}>
                                    <View style={styles.botStatusDetail}>
                                        <Text style={styles.botStatusDetailLabel}>Speed</Text>
                                        <Text style={styles.botStatusDetailValue}>{bot.speed || '1.2 m/s'}</Text>
                                    </View>
                                    <View style={styles.botStatusDetail}>
                                        <Text style={styles.botStatusDetailLabel}>Plot</Text>
                                        <Text style={styles.botStatusDetailValue}>{bot.plot || 'Plot A'}</Text>
                                    </View>
                                    <View style={styles.botStatusDetail}>
                                        <Text style={styles.botStatusDetailLabel}>Process</Text>
                                        <Text style={styles.botStatusDetailValue}>{bot.process || 'Standby'}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* To Do List - Only shows valid tasks with title */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>To Do List</Text>
                            <Text style={styles.taskCount}>
                                {taskList.length} {taskList.length === 1 ? "task" : "tasks"}
                            </Text>
                        </View>

                        {taskList.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons
                                    name="checkmark-done-outline"
                                    size={24}
                                    color="#D1D5DB"
                                />
                                <Text style={styles.emptyStateText}>
                                    No tasks scheduled yet
                                </Text>
                            </View>
                        ) : (
                            taskList
                                .filter(task => task.title && task.title.trim() !== '')
                                .slice(0, 5)
                                .map((task) => (
                                    <View key={task.id || task._id} style={styles.taskItem}>
                                        <View style={styles.taskLeft}>
                                            <View style={[
                                                styles.taskDot,
                                                { backgroundColor: getStatusColor(task.status) }
                                            ]} />
                                            <View style={styles.taskContent}>
                                                <Text style={styles.taskText}>{task.title}</Text>
                                                {task.description && (
                                                    <Text style={styles.taskDescription} numberOfLines={1}>
                                                        {task.description}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        <View style={styles.taskRight}>
                                            <Text style={styles.taskTime}>{task.time}</Text>
                                            <View style={[
                                                styles.taskStatusBadge,
                                                { 
                                                    backgroundColor: task.status === 'completed' ? '#E8F5E9' : 
                                                                   task.status === 'in_progress' ? '#FFF3E0' : '#F5F5F5'
                                                }
                                            ]}>
                                                <Text style={[
                                                    styles.taskStatusText,
                                                    { 
                                                        color: task.status === 'completed' ? '#2C5F2D' : 
                                                               task.status === 'in_progress' ? '#FF9500' : '#8E8E93'
                                                    }
                                                ]}>
                                                    {getStatusLabel(task.status)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))
                        )}
                    </View>

                    {/* Create Task Button */}
                    <TouchableOpacity
                        style={styles.createTaskButton}
                        onPress={() => setShowCreateTask(true)}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={["#2C5F2D", "#4A7A4B"]}
                            style={styles.createTaskGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Ionicons name="add-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.createTaskText}>Create Task</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Alerts */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Alerts</Text>
                            <Text style={styles.alertCount}>
                                {alerts.filter(a => !a.is_read).length} new
                            </Text>
                        </View>

                        {alerts.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons
                                    name="notifications-outline"
                                    size={24}
                                    color="#D1D5DB"
                                />
                                <Text style={styles.emptyStateText}>You're all caught up</Text>
                            </View>
                        ) : (
                            alerts.slice(0, 5).map((alert) => (
                                <View 
                                    key={alert.id || alert._id} 
                                    style={[
                                        styles.alertItem,
                                        { backgroundColor: getAlertColor(alert.type) }
                                    ]}
                                >
                                    <View style={styles.alertIconContainer}>
                                        <Ionicons 
                                            name={getAlertIcon(alert.type)} 
                                            size={18} 
                                            color="#2C5F2D" 
                                        />
                                    </View>
                                    <View style={styles.alertContent}>
                                        <Text style={styles.alertTitle}>{alert.title}</Text>
                                        <Text style={styles.alertTime}>{alert.time || formatTime(alert.created_at)}</Text>
                                    </View>
                                    {!alert.is_read && (
                                        <View style={styles.alertUnreadDot} />
                                    )}
                                </View>
                            ))
                        )}
                    </View>

                    <View style={styles.bottomSpacing} />
                </ScrollView>
            </Animated.View>

            {/* Create Task Modal */}
            <Modal
                transparent
                visible={showCreateTask}
                animationType="fade"
                onRequestClose={closeCreateTask}
            >
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <TouchableOpacity
                        style={styles.modalOverlayTouchable}
                        activeOpacity={1}
                        onPress={closeCreateTask}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Create Task</Text>
                                <TouchableOpacity
                                    onPress={closeCreateTask}
                                    style={styles.modalClose}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <Ionicons name="close" size={22} color="#8E8E93" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalBody}>
                                <View>
                                    <Text style={styles.pickerLabel}>Task</Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.chipRow}
                                    >
                                        {TASK_OPTIONS.map((option) => {
                                            const active = selectedTask === option;
                                            return (
                                                <TouchableOpacity
                                                    key={option}
                                                    onPress={() => setSelectedTask(option)}
                                                    style={[styles.chip, active && styles.chipActive]}
                                                    activeOpacity={0.8}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.chipText,
                                                            active && styles.chipTextActive,
                                                        ]}
                                                    >
                                                        {option}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>
                                </View>

                                <View>
                                    <Text style={styles.pickerLabel}>Time</Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.chipRow}
                                    >
                                        {TIME_OPTIONS.map((option) => {
                                            const active = selectedTime === option;
                                            return (
                                                <TouchableOpacity
                                                    key={option}
                                                    onPress={() => setSelectedTime(option)}
                                                    style={[styles.chip, active && styles.chipActive]}
                                                    activeOpacity={0.8}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.chipText,
                                                            active && styles.chipTextActive,
                                                        ]}
                                                    >
                                                        {option}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.createButton,
                                        (!selectedTask || !selectedTime || creatingTask) &&
                                        styles.createButtonDisabled,
                                    ]}
                                    onPress={handleCreateTask}
                                    activeOpacity={0.8}
                                    disabled={!selectedTask || !selectedTime || creatingTask}
                                >
                                    <LinearGradient
                                        colors={["#2C5F2D", "#4A7A4B"]}
                                        style={styles.createButtonGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        {creatingTask ? (
                                            <ActivityIndicator size="small" color="#FFFFFF" />
                                        ) : (
                                            <Text style={styles.createButtonText}>Create</Text>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F7",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        fontFamily: typography.fontFamily.medium,
        color: '#8E8E93',
    },

    header: {
        position: "absolute",
        top: Platform.OS === "ios" ? 50 : 20,
        left: 16,
        right: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: typography.fontFamily.semiBold,
        color: "#1A1A1A",
        letterSpacing: 0.3,
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    connectionBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    connected: {
        backgroundColor: "#E8F5E9",
    },
    disconnected: {
        backgroundColor: "#FFEBEE",
    },
    connectionDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    dotOnline: {
        backgroundColor: "#34C759",
    },
    dotOffline: {
        backgroundColor: "#FF3B30",
    },
    connectionText: {
        fontSize: 10,
        fontFamily: typography.fontFamily.medium,
        color: "#1A1A1A",
    },
    headerButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "rgba(255,255,255,0.95)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E5EA",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },

    drawer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: -6 },
        elevation: 12,
    },
    drawerHandle: {
        alignItems: "center",
        paddingVertical: 10,
    },
    drawerHandleBar: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#D1D5DB",
    },
    drawerContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },

    section: {
        marginTop: 12,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: typography.fontFamily.semiBold,
        color: "#1A1A1A",
        letterSpacing: 0.3,
    },

    botStatusCard: {
        backgroundColor: "#F8FAF8",
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#E5E5EA",
    },
    botStatusHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    botStatusName: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    botStatusAvatar: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: "#2C5F2D",
        justifyContent: "center",
        alignItems: "center",
    },
    botStatusNameText: {
        fontSize: 14,
        fontFamily: typography.fontFamily.semiBold,
        color: "#1A1A1A",
    },
    botStatusBattery: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    botStatusBatteryText: {
        fontSize: 12,
        fontFamily: typography.fontFamily.semiBold,
    },
    botStatusDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    botStatusDetail: {
        flex: 1,
    },
    botStatusDetailLabel: {
        fontSize: 11,
        fontFamily: typography.fontFamily.regular,
        color: "#8E8E93",
    },
    botStatusDetailValue: {
        fontSize: 13,
        fontFamily: typography.fontFamily.semiBold,
        color: "#1A1A1A",
        marginTop: 1,
    },

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E8F5E9",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontFamily: typography.fontFamily.medium,
        color: "#2C5F2D",
    },

    taskCount: {
        fontSize: 12,
        fontFamily: typography.fontFamily.medium,
        color: "#8E8E93",
    },
    taskItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: "#E5E5EA",
    },
    taskLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    taskDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 12,
        flexShrink: 0,
    },
    taskContent: {
        flex: 1,
    },
    taskText: {
        fontSize: 14,
        fontFamily: typography.fontFamily.medium,
        color: "#1A1A1A",
    },
    taskDescription: {
        fontSize: 11,
        fontFamily: typography.fontFamily.regular,
        color: "#8E8E93",
        marginTop: 1,
    },
    taskRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flexShrink: 0,
        marginLeft: 8,
    },
    taskTime: {
        fontSize: 13,
        fontFamily: typography.fontFamily.medium,
        color: "#8E8E93",
    },
    taskStatusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    taskStatusText: {
        fontSize: 10,
        fontFamily: typography.fontFamily.semiBold,
        textTransform: "capitalize",
    },

    emptyState: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 18,
        gap: 8,
    },
    emptyStateText: {
        fontSize: 13,
        fontFamily: typography.fontFamily.medium,
        color: "#B0B0B0",
    },

    createTaskButton: {
        marginTop: 12,
        borderRadius: 12,
        overflow: "hidden",
    },
    createTaskGradient: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
        gap: 8,
    },
    createTaskText: {
        fontSize: 15,
        fontFamily: typography.fontFamily.semiBold,
        color: "#FFFFFF",
        letterSpacing: 0.3,
    },

    alertCount: {
        fontSize: 12,
        fontFamily: typography.fontFamily.medium,
        color: "#8E8E93",
    },
    alertItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
        gap: 10,
    },
    alertIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: "rgba(44, 95, 45, 0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    alertContent: {
        flex: 1,
    },
    alertTitle: {
        fontSize: 13,
        fontFamily: typography.fontFamily.medium,
        color: "#1A1A1A",
    },
    alertTime: {
        fontSize: 11,
        fontFamily: typography.fontFamily.regular,
        color: "#8E8E93",
        marginTop: 2,
    },
    alertUnreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#2C5F2D",
        marginLeft: 4,
    },

    plotMarker: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
    },
    plotMarkerText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontFamily: typography.fontFamily.semiBold,
        letterSpacing: 0.5,
    },
    botMarkerContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    botMarker: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#2C5F2D",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    botMarkerPulse: {
        position: "absolute",
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "rgba(44, 95, 45, 0.5)",
    },

    modalOverlay: {
        flex: 1,
    },
    modalOverlayTouchable: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "90%",
        maxWidth: 400,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 30,
        shadowOffset: { width: 0, height: 10 },
        elevation: 15,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: typography.fontFamily.semiBold,
        color: "#1A1A1A",
    },
    modalClose: {
        padding: 4,
    },
    modalBody: {
        gap: 16,
    },
    pickerLabel: {
        fontSize: 13,
        fontFamily: typography.fontFamily.semiBold,
        color: "#1A1A1A",
        marginBottom: 8,
    },
    chipRow: {
        gap: 8,
        paddingRight: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 20,
        backgroundColor: "#F2F2F2",
        borderWidth: 1,
        borderColor: "#EFEFEF",
    },
    chipActive: {
        backgroundColor: "#E8F5E9",
        borderColor: "#2C5F2D",
    },
    chipText: {
        fontSize: 13,
        fontFamily: typography.fontFamily.medium,
        color: "#5A5A5A",
    },
    chipTextActive: {
        color: "#2C5F2D",
        fontFamily: typography.fontFamily.semiBold,
    },
    createButton: {
        borderRadius: 12,
        overflow: "hidden",
        marginTop: 4,
    },
    createButtonDisabled: {
        opacity: 0.5,
    },
    createButtonGradient: {
        paddingVertical: 12,
        alignItems: "center",
    },
    createButtonText: {
        fontSize: 15,
        fontFamily: typography.fontFamily.semiBold,
        color: "#FFFFFF",
        letterSpacing: 0.3,
    },
    bottomSpacing: {
        height: 30,
    },
});