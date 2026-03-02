import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DealTimer.css";

const DealTimer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 31,
    hours: 29,
    minutes: 57,
    seconds: 11,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        const { days, hours, minutes, seconds } = prevTimeLeft;
        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(timer);
          return prevTimeLeft;
        }
        let newSeconds = seconds - 1;
        let newMinutes = minutes;
        let newHours = hours;
        let newDays = days;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }
        if (newHours < 0) {
          newHours = 23;
          newDays -= 1;
        }

        return {
          days: newDays,
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value) => {
    return value.toString().padStart(2, "0");
  };

  return (
    <section className="dealTimerSection">
      <div className="dealTimerBgImage" style={{ backgroundImage: `url('/deal-bg.jpg')` }}></div>
      <div className="dealTimerOverlay"></div>

      <div className="dealTimerContent">
        <div className="dealTimerLabel">Deal of the Week</div>
        <h2>
          Spring <strong>Collection</strong>
        </h2>
        <p>
          Discover our exclusive spring collection with premium materials and timeless designs. Limited time offer.
        </p>

        <div className="countdownTimer">
          <div className="timerUnit">
            <div className="timerDigit">{formatTime(timeLeft.days)}</div>
            <div className="timerLabel">Days</div>
          </div>
          <div className="timerSep">:</div>
          <div className="timerUnit">
            <div className="timerDigit">{formatTime(timeLeft.hours)}</div>
            <div className="timerLabel">Hours</div>
          </div>
          <div className="timerSep">:</div>
          <div className="timerUnit">
            <div className="timerDigit">{formatTime(timeLeft.minutes)}</div>
            <div className="timerLabel">Minutes</div>
          </div>
          <div className="timerSep">:</div>
          <div className="timerUnit">
            <div className="timerDigit">{formatTime(timeLeft.seconds)}</div>
            <div className="timerLabel">Seconds</div>
          </div>
        </div>

        <div className="dealTimerCTA">
          <Link to="/shop" className="primaryCTA" onClick={scrollToTop}>
            Shop Now
          </Link>
          <Link to="/about" className="secondaryCTA" onClick={scrollToTop}>
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DealTimer;
