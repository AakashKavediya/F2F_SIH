import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
    Animated,
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
    useWindowDimensions,
} from "react-native";
import { typography } from "../../src/theme";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AppAccordionList = ({ data = [] }) => {
  const [expandedId, setExpandedId] = useState(null);
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  const toggleAccordion = useCallback(
    (id) => {
      // Animate layout change
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          200,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity,
        ),
      );
      setExpandedId(expandedId === id ? null : id);
    },
    [expandedId],
  );

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { width: isLarge ? 500 : "100%" }]}>
        <Text style={styles.emptyText}>No activities to show</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: isLarge ? 500 : "100%" }]}>
      {data.map((item, index) => {
        const isExpanded = expandedId === item.id;
        const isFirst = index === 0;
        const isLast = index === data.length - 1;

        return (
          <View
            key={item.id}
            style={[
              styles.card,
              isFirst && styles.cardFirst,
              isLast && styles.cardLast,
              isExpanded && styles.cardExpanded,
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.row}
              onPress={() => toggleAccordion(item.id)}
            >
              {/* Left Section */}
              <View style={styles.leftSection}>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: item.iconBackgroundColor || "#E8F5E9",
                    },
                  ]}
                >
                  {item.icon}
                </View>

                <View style={styles.textSection}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.subtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>

              {/* Arrow */}
              <View style={styles.arrowContainer}>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#8E8E93"
                />
              </View>
            </TouchableOpacity>

            {/* Dropdown Content */}
            {isExpanded && (
              <Animated.View style={styles.dropdown}>
                {item.dropdownContent}
              </Animated.View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default AppAccordionList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    alignSelf: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: "#8E8E93",
    textAlign: "center",
    paddingVertical: 30,
  },
  card: {
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  cardFirst: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  cardExpanded: {
    backgroundColor: "#FAFAFA",
  },
  row: {
    minHeight: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  textSection: {
    marginLeft: 14,
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
    color: "#1A1A1A",
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    color: "#8E8E93",
    fontFamily: typography.fontFamily.medium,
    letterSpacing: 0.2,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  dropdown: {
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
});
