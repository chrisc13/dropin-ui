// Attribution.tsx
import React from "react";

export const Attribution = () => {
  return (
    <footer style={styles.footer}>
      <p>
        Icons and images by{" "}
        <a href="https://www.flaticon.com/free-icons/basketball" title="basketball icons">Basketball icons created by Pause08 - Flaticon</a>
        ,{" "}
        <a href="https://www.flaticon.com/free-icons/up-arrow" title="up arrow icons">Up/down arrow icons created by Ihdizein - Flaticon</a>
        ,{" "}
        <a href="https://www.flaticon.com/free-icons/sport-team" title="sport team icons">Sport team icons created by Freepik - Flaticon</a>
        , and{" "}
        <a href="https://www.flaticon.com/free-icons/reminder" title="reminder icons">Reminder icons created by Gajah Mada - Flaticon</a>
        . All used under free licenses.
        <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Freepik - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/home-button" title="home button icons">Home button icons created by Freepik - Flaticon</a>
      <a href="https://www.flaticon.com/free-icons/message" title="message icons">Message icons created by mattbadal - Flaticon</a>
      </p>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    padding: "12px 20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#888",
    borderTop: "1px solid #eaeaea",
    marginTop: "40px",
  },
};
