import React from "react";
import styles from "./styles/content.module.css";

interface ContentProps {
  contentheading: string;
  para: string;
}

const Content: React.FC<ContentProps> = ({ contentheading, para }) => {
  return (
    <div className={styles.heroText}>
      <h1>{contentheading}</h1>
      <p>{para}</p>
    </div>
  );
};

export default Content;
