import React, { useState, useEffect, useRef } from "react";

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onClose: () => void;
  disableClickOutside?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  onClose,
  disableClickOutside = false,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateState, setSelectedDateState] = useState(
    selectedDate ? new Date(selectedDate) : null
  );
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disableClickOutside) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const calendarElement = calendarRef.current;

      if (calendarElement && !target.closest(`[data-calendar="true"]`)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, disableClickOutside]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDateState(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    onDateSelect(formattedDate);
    onClose();
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDateState) return false;
    return (
      date.getDate() === selectedDateState.getDate() &&
      date.getMonth() === selectedDateState.getMonth() &&
      date.getFullYear() === selectedDateState.getFullYear()
    );
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    "Ιανουάριος",
    "Φεβρουάριος",
    "Μάρτιος",
    "Απρίλιος",
    "Μάιος",
    "Ιούνιος",
    "Ιούλιος",
    "Αύγουστος",
    "Σεπτέμβριος",
    "Οκτώβριος",
    "Νοέμβριος",
    "Δεκέμβριος",
  ];
  const dayNames = ["Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"];

  return (
    <div
      ref={calendarRef}
      data-calendar="true"
      style={{
        position: "absolute",
        top: "100%",
        left: "0",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        border: "1px solid #e2e8f0",
        padding: "25px",
        zIndex: 1000,
        minWidth: "350px",
        maxWidth: "450px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPreviousMonth();
          }}
          style={{
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            color: "#64748b",
            padding: "8px",
            borderRadius: "6px",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#f1f5f9";
            e.target.style.color = "#1a202c";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#64748b";
          }}
        >
          ‹
        </button>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select
            value={currentMonth.getMonth()}
            onChange={(e) => {
              e.stopPropagation();
              const newMonth = new Date(
                currentMonth.getFullYear(),
                parseInt(e.target.value),
                1
              );
              setCurrentMonth(newMonth);
            }}
            style={{
              padding: "4px 8px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#1a202c",
              backgroundColor: "white",
              cursor: "pointer",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
            }}
          >
            {monthNames.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={currentMonth.getFullYear()}
            onChange={(e) => {
              e.stopPropagation();
              const newMonth = new Date(
                parseInt(e.target.value),
                currentMonth.getMonth(),
                1
              );
              setCurrentMonth(newMonth);
            }}
            style={{
              padding: "4px 8px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#1a202c",
              backgroundColor: "white",
              cursor: "pointer",
              outline: "none",
              width: "80px",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
            }}
          >
            {Array.from({ length: 100 }, (_, i) => {
              const year = new Date().getFullYear() - 50 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goToNextMonth();
          }}
          style={{
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            color: "#64748b",
            padding: "8px",
            borderRadius: "6px",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#f1f5f9";
            e.target.style.color = "#1a202c";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#64748b";
          }}
        >
          ›
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
          marginBottom: "10px",
        }}
      >
        {dayNames.map((day) => (
          <div
            key={day}
            style={{
              textAlign: "center",
              fontSize: "12px",
              fontWeight: "600",
              color: "#64748b",
              padding: "8px 4px",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
        }}
      >
        {days.map((day, index) => (
          <div
            key={index}
            style={{
              textAlign: "center",
              padding: "8px 4px",
              fontSize: "14px",
              cursor: day ? "pointer" : "default",
              borderRadius: "6px",
              transition: "all 0.3s ease",
              backgroundColor: day ? "transparent" : "transparent",
              color: day ? "#1a202c" : "transparent",
              fontWeight: isToday(day) ? "600" : "400",
              border: isToday(day) ? "2px solid #3b82f6" : "none",
              opacity: 1,
              ...(day &&
                isSelected(day) && {
                  backgroundColor: "#3b82f6",
                  color: "white",
                  fontWeight: "600",
                }),
            }}
            onClick={(e) => {
              e.stopPropagation();
              day && handleDateSelect(day);
            }}
            onMouseOver={(e) => {
              if (day && !isSelected(day)) {
                e.target.style.backgroundColor = "#f1f5f9";
              }
            }}
            onMouseOut={(e) => {
              if (day && !isSelected(day)) {
                e.target.style.backgroundColor = "transparent";
              }
            }}
          >
            {day ? day.getDate() : ""}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const today = new Date();
            setSelectedDateState(today);
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");
            const formattedDate = `${year}-${month}-${day}`;
            onDateSelect(formattedDate);
            onClose();
          }}
          style={{
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#2563eb";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#3b82f6";
          }}
        >
          Σήμερα
        </button>
      </div>
    </div>
  );
};

export default Calendar;
