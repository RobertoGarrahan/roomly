import React, { useEffect, useState } from "react";
import "@/css/style.css";

type TxtProps = {
  texto: string;
};

const Txt: React.FC<TxtProps> = ({ texto }) => {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const typeText = async () => {
      let result = "";
      for (let i = 0; i < texto.length; i++) {
        if (isCancelled) break;
        result += texto[i];
        setTypedText(result);
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    };

    setTypedText(""); // reset
    typeText();

    return () => {
      isCancelled = true;
    };
  }, [texto]);

  return (
    <div className="typed-container">
      {typedText}
      <span className="blinking-cursor">|</span>
    </div>
  );
};

export default Txt;
