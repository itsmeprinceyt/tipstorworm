"use client";
import { useState, useEffect, useMemo } from "react";
import PageWrapper from "../../PageWrapper";
import { LoaderProps } from "../../../../types/Loader.type";
import Planet from "../SVG/Planet";

export default function CustomLoader({
  size = 20,
  text,
  random_text = false,
  fullscreen = false,
  color = "text-white",
}: LoaderProps) {
  const [randomText, setRandomText] = useState("");

  const randomTexts = useMemo(
    () => [
      "Thinking...",
      "Thinking hard...",
      "You make me think too much, ok wait...",
      "Loading content...",
      "Almost there...",
      "Let me cook...",
      "Just a moment...",
      "Working on it...",
      "Getting things ready...",
      "Hang tight...",
    ],
    []
  );

  useEffect(() => {
    if (random_text) {
      setRandomText(
        randomTexts[Math.floor(Math.random() * randomTexts.length)]
      );
      const interval = setInterval(() => {
        setRandomText(
          randomTexts[Math.floor(Math.random() * randomTexts.length)]
        );
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [randomTexts, random_text]);

  const spinnerElement = (
    <Planet
      className={`text-white motion-rotate-loop-[1turn]/reset motion-duration-2000 w-${size} h-${size}`}
    />
  );

  const displayText = random_text ? randomText : text;

  if (fullscreen || text || random_text) {
    return (
      <PageWrapper>
        <div className="z-10 min-h-screen motion-opacity-in-0 motion-blur-in-md inset-0 absolute  flex items-center justify-center">
          <div className="text-center flex items-center justify-center gap-2 -motion-translate-y-loop-50 motion-duration-[2s] motion-ease-spring-smooth bg-black border border-stone-950 px-4 py-2 rounded-full hover:scale-110 duration-1000 transition-all ease-in-out">
            {spinnerElement}
            {(text || random_text) && (
              <p className={`font-semibold ${color}`}>{displayText}</p>
            )}
          </div>
        </div>
      </PageWrapper>
    );
  }

  return spinnerElement;
}
