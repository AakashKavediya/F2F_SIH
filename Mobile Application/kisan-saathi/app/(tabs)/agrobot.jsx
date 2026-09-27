// app/(tabs)/agrobot.jsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  RefreshControl,
  Dimensions,
} from "react-native";
import { typography } from "../../src/theme";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

// ── Task Types ──────────────────────────────────────────────────────
const TASK_TYPES = [
  {
    id: 'water_plants',
    title: "Water Plants",
    icon: "water-outline",
    gradient: ['#4ECDC4', '#44B3A8'],
    description: "Irrigate designated crop areas"
  },
  {
    id: 'disease_detection',
    title: "Disease Detection",
    icon: "bug-outline",
    gradient: ['#FF6B6B', '#EE5A5A'],
    description: "AI-powered disease scanning"
  },
  {
    id: 'checkup_mode',
    title: "Health Checkup",
    icon: "medkit-outline",
    gradient: ['#FFB347', '#F59A2E'],
    description: "Comprehensive plant health analysis"
  },
  {
    id: 'sensor_reading',
    title: "Sensor Scan",
    icon: "speedometer-outline",
    gradient: ['#4A90D9', '#357ABD'],
    description: "Real-time sensor data collection"
  },
];

// ── Animation helper ───────────────────────────────────────────────────
function useFadeIn() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const play = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const reset = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.95);
  };

  return { fadeAnim, scaleAnim, play, reset };
}

// ── Main Component ─────────────────────────────────────────────────────
export default function AgrobotPage() {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;
  const fadeIn = useFadeIn();

  // ── State ────────────────────────────────────────────────────────────
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [bots, setBots] = useState([]);
  const [expandedBot, setExpandedBot] = useState(null);
  const [taskHistory, setTaskHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [taskProgress, setTaskProgress] = useState(0);
  const [taskTimer, setTaskTimer] = useState(null);
  const [selectedBotId, setSelectedBotId] = useState('1');

  // Animation refs
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  // ── Load Data ──────────────────────────────────────────────────────
  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadBots();
      loadHistory();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTask) {
      fadeIn.play();
    }
  }, [activeTask]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        checkConnection(),
        loadBots(),
        loadHistory(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      setIsConnected(response.ok);
    } catch {
      setIsConnected(false);
    }
  };

  const loadBots = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agrobot/bots`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.bots) {
          setBots(data.bots);
        }
      }
    } catch (error) {
      console.error('Error loading bots:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agrobot/tasks/history?limit=20`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.history) {
          setTaskHistory(data.history);
        }
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // ── Task Selection ──────────────────────────────────────────────────
  const toggleTask = (taskId) => {
    if (activeTask) {
      Alert.alert("Task in Progress", "Please wait for the current task to complete.");
      return;
    }

    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  // ── Reset Task ──────────────────────────────────────────────────────
  const resetTask = () => {
    if (activeTask) {
      Alert.alert(
        "Reset Task",
        "Are you sure you want to reset the current task?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Reset", 
            style: "destructive",
            onPress: () => {
              if (taskTimer) {
                clearInterval(taskTimer);
                setTaskTimer(null);
              }
              setActiveTask(null);
              setTaskProgress(0);
              progressWidth.setValue(0);
              loadBots();
              loadHistory();
              Alert.alert("Task Reset", "The task has been reset successfully.");
            }
          }
        ]
      );
    }
  };

  // ── Assign Task ──────────────────────────────────────────────────────
  const handleAssignTask = async () => {
    if (selectedTasks.length === 0) return;

    setIsAssigning(true);

    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.92,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    try {
      const taskId = selectedTasks[0];
      const taskType = TASK_TYPES.find(t => t.id === taskId);
      
      if (!taskType) throw new Error('Task type not found');

      const response = await fetch(`${API_BASE_URL}/api/agrobot/tasks/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bot_id: selectedBotId,
          task_type: taskId,
          parameters: { duration: 120, assigned_by: 'user' }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to assign task');
      }

      const data = await response.json();

      setActiveTask({
        id: data.task._id,
        type: taskId,
        title: taskType.title,
        gradient: taskType.gradient,
        icon: taskType.icon,
        status: 'in_progress',
        started_at: new Date(),
      });

      // Animate progress
      Animated.timing(progressWidth, {
        toValue: 100,
        duration: 120000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      let progress = 0;
      const timer = setInterval(() => {
        progress += 1;
        setTaskProgress(progress);
        if (progress >= 100) {
          clearInterval(timer);
          setTaskTimer(null);
          setTaskProgress(100);
          setActiveTask(prev => ({ ...prev, status: 'completed' }));
          
          Alert.alert(
            "✅ Task Complete",
            `${taskType.title} completed successfully!`,
            [{ text: "Great", style: "default" }]
          );
          
          // Clear active task and refresh data
          setTimeout(() => {
            setActiveTask(null);
            setTaskProgress(0);
            progressWidth.setValue(0);
            loadBots();
            loadHistory();
          }, 2000);
        }
      }, 1200);

      setTaskTimer(timer);

      Alert.alert(
        "🚀 Task Started",
        `${taskType.title} assigned to AgroBot ${selectedBotId}`,
        [{ text: "Track Progress", style: "default" }]
      );
      
      setSelectedTasks([]);
      
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to assign task");
    } finally {
      setIsAssigning(false);
      rotateAnim.setValue(0);
    }
  };

  // ── Toggle Bot Expand ──────────────────────────────────────────────
  const toggleBotExpand = (botId) => {
    setExpandedBot(expandedBot === botId ? null : botId);
  };

  // ── Get Status Color ────────────────────────────────────────────────
  const getStatusColor = (status) => {
    const colors = {
      'Active': '#34C759',
      'Idle': '#8E8E93',
      'Busy': '#FF9500',
      'Offline': '#FF3B30',
      'completed': '#34C759',
      'in_progress': '#FF9500',
      'pending': '#FFB347',
      'failed': '#FF3B30',
      'timeout': '#FF2D55',
    };
    return colors[status] || '#8E8E93';
  };

  const getBatteryColor = (level) => {
    if (level >= 70) return "#34C759";
    if (level >= 40) return "#FF9500";
    return "#FF3B30";
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // ── Render ───────────────────────────────────────────────────────────
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressWidthInterpolated = progressWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isLarge && styles.scrollContentLarge,
        ]}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#2C5F2D"
            colors={['#2C5F2D']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconContainer}>
              <LinearGradient
                colors={['#2C5F2D', '#4A7A4B']}
                style={styles.headerIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="hardware-chip-outline" size={24} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <View>
              <Text style={styles.headerTitle}>AgroBot</Text>
              <Text style={styles.headerSubtitle}>Control Center</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.statusBadge, isConnected ? styles.online : styles.offline]}>
              <View style={[styles.statusDot, isConnected ? styles.dotOnline : styles.dotOffline]} />
              <Text style={styles.statusText}>
                {isConnected ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2C5F2D" />
            <Text style={styles.loadingText}>Connecting to AgroBot...</Text>
          </View>
        ) : (
          <>
            {/* Active Task */}
            {activeTask && (
              <Animated.View 
                style={[
                  styles.activeTaskCard,
                  {
                    opacity: fadeIn.fadeAnim,
                    transform: [{ scale: fadeIn.scaleAnim }],
                  }
                ]}
              >
                <LinearGradient
                  colors={activeTask.gradient || ['#2C5F2D', '#4A7A4B']}
                  style={styles.activeTaskGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.activeTaskHeader}>
                    <View style={styles.activeTaskIcon}>
                      <Ionicons name={activeTask.icon || 'play-circle'} size={28} color="#FFFFFF" />
                    </View>
                    <View style={styles.activeTaskInfo}>
                      <Text style={styles.activeTaskLabel}>Current Task</Text>
                      <Text style={styles.activeTaskTitle}>{activeTask.title}</Text>
                    </View>
                    <View style={styles.activeTaskStatusBadge}>
                      <Text style={styles.activeTaskStatusText}>
                        {activeTask.status === 'completed' ? '✅ Done' : '⏳ Running'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.progressWrapper}>
                    <View style={styles.progressTrack}>
                      <Animated.View 
                        style={[
                          styles.progressFill,
                          { width: progressWidthInterpolated }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>{taskProgress}%</Text>
                  </View>
                  <View style={styles.activeTaskFooter}>
                    <Text style={styles.activeTaskTime}>
                      {activeTask.status === 'completed' ? '✅ Task completed successfully' : '⏳ Task in progress...'}
                    </Text>
                    {activeTask.status === 'completed' && (
                      <TouchableOpacity 
                        style={styles.resetTaskButton}
                        onPress={resetTask}
                      >
                        <Text style={styles.resetTaskButtonText}>Clear</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </LinearGradient>
              </Animated.View>
            )}

            {/* Bot Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Robot</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.botScroll}
                contentContainerStyle={styles.botScrollContent}
              >
                {bots.length > 0 ? bots.map((bot) => {
                  const isSelected = selectedBotId === bot.bot_id;
                  return (
                    <TouchableOpacity
                      key={bot.bot_id}
                      style={[
                        styles.botSelector,
                        isSelected && styles.botSelectorActive,
                      ]}
                      onPress={() => setSelectedBotId(bot.bot_id)}
                      activeOpacity={0.7}
                      disabled={!!activeTask}
                    >
                      <View style={[styles.botSelectorAvatar, isSelected && styles.botSelectorAvatarActive]}>
                        <Ionicons 
                          name="hardware-chip-outline" 
                          size={22} 
                          color={isSelected ? '#2C5F2D' : '#8E8E93'} 
                        />
                      </View>
                      <Text style={[
                        styles.botSelectorName,
                        isSelected && styles.botSelectorNameActive,
                      ]}>
                        {bot.name || `Bot ${bot.bot_id}`}
                      </Text>
                      <View style={[
                        styles.botSelectorDot,
                        { backgroundColor: getStatusColor(bot.status) }
                      ]} />
                    </TouchableOpacity>
                  );
                }) : (
                  <View style={styles.botSelectorEmpty}>
                    <Text style={styles.botSelectorEmptyText}>No bots connected</Text>
                  </View>
                )}
              </ScrollView>
            </View>

            {/* Task Types */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Tasks</Text>
                <Text style={styles.sectionCount}>{selectedTasks.length} selected</Text>
              </View>

              <View style={styles.taskGrid}>
                {TASK_TYPES.map((task) => {
                  const isSelected = selectedTasks.includes(task.id);
                  const isDisabled = !!activeTask;
                  return (
                    <TouchableOpacity
                      key={task.id}
                      style={[
                        styles.taskCard,
                        isSelected && styles.taskCardSelected,
                        isDisabled && styles.taskDisabled,
                      ]}
                      onPress={() => toggleTask(task.id)}
                      activeOpacity={0.7}
                      disabled={isDisabled}
                    >
                      <LinearGradient
                        colors={isSelected ? task.gradient : ['#FFFFFF', '#FFFFFF']}
                        style={styles.taskGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <View style={[styles.taskIconWrapper, isSelected && styles.taskIconWrapperSelected]}>
                          <Ionicons 
                            name={task.icon} 
                            size={24} 
                            color={isSelected ? '#FFFFFF' : task.gradient[0]} 
                          />
                        </View>
                        <Text style={[
                          styles.taskTitle,
                          isSelected && styles.taskTitleSelected,
                          isDisabled && styles.taskDisabledText,
                        ]}>
                          {task.title}
                        </Text>
                        <Text style={[
                          styles.taskDescription,
                          isSelected && styles.taskDescriptionSelected,
                          isDisabled && styles.taskDisabledText,
                        ]}>
                          {task.description}
                        </Text>
                        {isSelected && (
                          <View style={styles.taskCheckmark}>
                            <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                          </View>
                        )}
                        {isDisabled && !isSelected && (
                          <View style={styles.taskDisabledOverlay}>
                            <Ionicons name="lock-closed" size={20} color="#8E8E93" />
                          </View>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {selectedTasks.length > 0 && !activeTask && (
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <TouchableOpacity
                    style={styles.assignButton}
                    onPress={handleAssignTask}
                    activeOpacity={0.8}
                    disabled={isAssigning}
                  >
                    <LinearGradient
                      colors={['#2C5F2D', '#4A7A4B']}
                      style={styles.assignButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Animated.View style={{ transform: [{ rotate }] }}>
                        <Ionicons
                          name={isAssigning ? "sync-outline" : "play-outline"}
                          size={20}
                          color="#FFFFFF"
                        />
                      </Animated.View>
                      <Text style={styles.assignButtonText}>
                        {isAssigning ? "Starting..." : `Start Task`}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>

            {/* Bot Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Robots</Text>
              {bots.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="hardware-chip-outline" size={48} color="#D1D5DB" />
                  <Text style={styles.emptyStateText}>No robots available</Text>
                </View>
              ) : (
                bots.map((bot) => {
                  const isExpanded = expandedBot === bot.bot_id;
                  const batteryColor = getBatteryColor(bot.battery || 0);
                  const statusColor = getStatusColor(bot.status);

                  return (
                    <TouchableOpacity
                      key={bot.bot_id}
                      style={[styles.botCard, isExpanded && styles.botCardExpanded]}
                      onPress={() => toggleBotExpand(bot.bot_id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.botCardHeader}>
                        <View style={styles.botCardLeft}>
                          <LinearGradient
                            colors={['#2C5F2D', '#4A7A4B']}
                            style={styles.botAvatar}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                          >
                            <Ionicons name="hardware-chip-outline" size={20} color="#FFFFFF" />
                          </LinearGradient>
                          <View>
                            <Text style={styles.botName}>{bot.name || `AgroBot ${bot.bot_id}`}</Text>
                            <View style={styles.botStatusRow}>
                              <View style={[styles.botStatusDot, { backgroundColor: statusColor }]} />
                              <Text style={[styles.botStatusText, { color: statusColor }]}>
                                {bot.status || 'Idle'}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.botCardRight}>
                          <View style={styles.batteryIndicator}>
                            <Ionicons name="battery-half-outline" size={14} color={batteryColor} />
                            <Text style={[styles.batteryText, { color: batteryColor }]}>
                              {bot.battery || 0}%
                            </Text>
                          </View>
                          <Ionicons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#C7C7CC"
                          />
                        </View>
                      </View>

                      <View style={styles.botStats}>
                        <View style={styles.botStat}>
                          <Text style={styles.botStatLabel}>Task</Text>
                          <Text style={styles.botStatValue}>{bot.task || 'Standby'}</Text>
                        </View>
                        <View style={styles.botStatDivider} />
                        <View style={styles.botStat}>
                          <Text style={styles.botStatLabel}>Location</Text>
                          <Text style={styles.botStatValue}>{bot.location || 'Field A'}</Text>
                        </View>
                      </View>

                      {isExpanded && (
                        <View style={styles.botExpanded}>
                          <View style={styles.botExpandedRow}>
                            <View style={styles.botExpandedItem}>
                              <Ionicons name="wifi-outline" size={14} color="#8E8E93" />
                              <Text style={styles.botExpandedLabel}>Connectivity</Text>
                            </View>
                            <Text style={styles.botExpandedValue}>{bot.connectivity || 'Good'}</Text>
                          </View>
                          <View style={styles.botExpandedRow}>
                            <View style={styles.botExpandedItem}>
                              <Ionicons name="heart-outline" size={14} color="#8E8E93" />
                              <Text style={styles.botExpandedLabel}>Sensor Health</Text>
                            </View>
                            <Text style={styles.botExpandedValue}>{bot.sensor_health || 'Excellent'}</Text>
                          </View>
                          <View style={styles.botExpandedRow}>
                            <View style={styles.botExpandedItem}>
                              <Ionicons name="speedometer-outline" size={14} color="#8E8E93" />
                              <Text style={styles.botExpandedLabel}>Speed</Text>
                            </View>
                            <Text style={styles.botExpandedValue}>{bot.speed || '1.2 m/s'}</Text>
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })
              )}
            </View>

            {/* History */}
            <View style={styles.section}>
              <View style={styles.historyHeader}>
                <View style={styles.historyHeaderLeft}>
                  <Ionicons name="time-outline" size={20} color="#1A1A1A" />
                  <Text style={styles.sectionTitle}>History</Text>
                  <View style={styles.historyCount}>
                    <Text style={styles.historyCountText}>{taskHistory.length}</Text>
                  </View>
                </View>
                <View style={styles.historyHeaderRight}>
                  <TouchableOpacity 
                    onPress={loadHistory} 
                    style={styles.historyRefresh}
                  >
                    <Ionicons name="refresh-outline" size={18} color="#8E8E93" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
                    <Ionicons
                      name={showHistory ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#8E8E93"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {showHistory && (
                <View style={styles.historyContainer}>
                  {taskHistory.length === 0 ? (
                    <View style={styles.emptyHistory}>
                      <Ionicons name="time-outline" size={32} color="#D1D5DB" />
                      <Text style={styles.emptyHistoryText}>No tasks yet</Text>
                    </View>
                  ) : (
                    taskHistory.map((task, index) => {
                      const statusColor = getStatusColor(task.status);
                      const taskType = TASK_TYPES.find(t => t.id === task.task_type);
                      
                      return (
                        <View key={task._id || index} style={styles.historyItem}>
                          <View style={styles.historyItemLeft}>
                            <View style={[styles.historyIcon, { backgroundColor: taskType?.gradient?.[0] + '15' || '#E5E5EA' }]}>
                              <Ionicons
                                name={taskType?.icon || 'checkbox-outline'}
                                size={16}
                                color={taskType?.gradient?.[0] || '#8E8E93'}
                              />
                            </View>
                            <View>
                              <Text style={styles.historyTitle}>
                                {taskType?.title || task.task_type || 'Unknown'}
                              </Text>
                              <Text style={styles.historyMeta}>
                                Bot {task.bot_id} • {formatTime(task.assigned_at)}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.historyStatus}>
                            <View style={[styles.historyDot, { backgroundColor: statusColor }]} />
                            <Text style={[styles.historyStatusText, { color: statusColor }]}>
                              {task.status?.toUpperCase() || 'UNKNOWN'}
                            </Text>
                          </View>
                        </View>
                      );
                    })
                  )}
                </View>
              )}
            </View>

            <View style={styles.bottomSpacing} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  scrollContentLarge: {
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 20,
    paddingBottom: 16,
    backgroundColor: '#F2F2F7',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    marginRight: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  online: {
    backgroundColor: '#E8F5E9',
  },
  offline: {
    backgroundColor: '#FFEBEE',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotOnline: {
    backgroundColor: '#34C759',
  },
  dotOffline: {
    backgroundColor: '#FF3B30',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1A1A1A',
  },

  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#8E8E93',
  },

  // Active Task
  activeTaskCard: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  activeTaskGradient: {
    padding: 18,
  },
  activeTaskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTaskIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeTaskInfo: {
    flex: 1,
  },
  activeTaskLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeTaskTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 1,
  },
  activeTaskStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  activeTaskStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    minWidth: 36,
    textAlign: 'right',
  },
  activeTaskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  activeTaskTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  resetTaskButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
  },
  resetTaskButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.3,
  },
  sectionCount: {
    fontSize: 13,
    color: '#8E8E93',
  },

  // Bot Selector
  botScroll: {
    marginHorizontal: -20,
  },
  botScrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  botSelector: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    minWidth: 70,
  },
  botSelectorActive: {
    borderColor: '#2C5F2D',
    backgroundColor: '#F0F7F0',
  },
  botSelectorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  botSelectorAvatarActive: {
    backgroundColor: '#E8F5E9',
  },
  botSelectorName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8E8E93',
  },
  botSelectorNameActive: {
    color: '#2C5F2D',
  },
  botSelectorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 3,
  },
  botSelectorEmpty: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  botSelectorEmptyText: {
    fontSize: 14,
    color: '#8E8E93',
  },

  // Task Grid
  taskGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  taskCard: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  taskDisabled: {
    opacity: 0.6,
  },
  taskDisabledText: {
    color: '#B0B0B0',
  },
  taskGradient: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    minHeight: 110,
  },
  taskCardSelected: {
    borderColor: 'transparent',
  },
  taskIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  taskIconWrapperSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 1,
  },
  taskTitleSelected: {
    color: '#FFFFFF',
  },
  taskDescription: {
    fontSize: 11,
    color: '#8E8E93',
    lineHeight: 14,
  },
  taskDescriptionSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  taskCheckmark: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  taskDisabledOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  // Assign Button
  assignButton: {
    marginTop: 8,
    borderRadius: 14,
    overflow: 'hidden',
  },
  assignButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  assignButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Bot Cards
  botCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  botCardExpanded: {
    borderColor: '#2C5F2D',
    borderWidth: 1.5,
  },
  botCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  botName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  botStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  botStatusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 5,
  },
  botStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  botCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  batteryIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  batteryText: {
    fontSize: 12,
    fontWeight: '600',
  },

  botStats: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
  },
  botStat: {
    flex: 1,
  },
  botStatLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 1,
  },
  botStatValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  botStatDivider: {
    width: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 12,
  },

  botExpanded: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
  },
  botExpandedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  botExpandedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  botExpandedLabel: {
    fontSize: 13,
    color: '#8E8E93',
  },
  botExpandedValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
  },

  // History
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyCount: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  historyCountText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
  },
  historyRefresh: {
    padding: 4,
  },
  historyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  historyIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  historyMeta: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 1,
  },
  historyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
  historyDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  historyStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },

  // Empty States
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 6,
  },
  emptyHistory: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 6,
  },
  emptyHistoryText: {
    fontSize: 14,
    color: '#8E8E93',
  },

  bottomSpacing: {
    height: 20,
  },
});