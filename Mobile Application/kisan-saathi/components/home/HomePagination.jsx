import { StyleSheet, View } from "react-native";

const HomePagination = ({ currentPage = 0, totalPages = 3 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalPages }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentPage ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  dot: {
    height: 6,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 18,
    backgroundColor: "#555",
  },
  inactiveDot: {
    width: 6,
    backgroundColor: "#C8C8C8",
  },
});

export default HomePagination;
