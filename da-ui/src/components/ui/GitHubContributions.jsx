import { motion } from 'framer-motion';
import { useState } from 'react';
import { createPortal } from 'react-dom';

const GitHubContributions = ({ activities = [], stats = null }) => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleDayHover = (day, event) => {
    if (day) {
      const rect = event.currentTarget.getBoundingClientRect();
      const tooltipWidth = 200;
      const tooltipHeight = 60;
      const padding = 10;

      let x = rect.left + rect.width / 2;
      let y = rect.top - 8;

      if (x - tooltipWidth / 2 < padding) {
        x = tooltipWidth / 2 + padding;
      } else if (x + tooltipWidth / 2 > window.innerWidth - padding) {
        x = window.innerWidth - tooltipWidth / 2 - padding;
      }

      if (y - tooltipHeight < padding) {
        y = rect.bottom + 8;
      }

      setHoveredDay(day);
      setTooltipPos({ x, y });
    }
  };

  const handleDayLeave = () => {
    setHoveredDay(null);
  };

  const levelColors = {
    0: '#161b22',
    1: '#0e4429',
    2: '#006d32',
    3: '#26a641',
    4: '#39d353',
  };

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const organizeIntoWeeks = () => {
    if (!activities || activities.length === 0) return [];

    const weeks = [];
    let currentWeek = [];

    const firstDate = new Date(activities[0].date);
    const firstDayOfWeek = firstDate.getDay();

    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    activities.forEach((day) => {
      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    const maxWeeks = 26;
    if (weeks.length > maxWeeks) {
      return weeks.slice(-maxWeeks);
    }

    return weeks;
  };

  const weeks = organizeIntoWeeks();

  const getMonthLabels = () => {
    if (!activities || activities.length === 0) return [];

    const labels = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstValidDay = week.find(day => day !== null);
      if (firstValidDay) {
        const date = new Date(firstValidDay.date);
        const month = date.getMonth();

        if (month !== lastMonth) {
          labels.push({
            month: months[month],
            weekIndex,
          });
          lastMonth = month;
        }
      }
    });

    return labels;
  };

  const monthLabels = getMonthLabels();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
        <div className="text-center">
          <div className="animate-pulse">Carregando contribuições do GitHub...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Contribuições do GitHub</h3>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="text-2xl font-bold text-green-400">{stats.total}</div>
              <div className="text-xs text-gray-400 mt-1">Contribuições</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="text-2xl font-bold text-blue-400">{stats.daysWithActivity}</div>
              <div className="text-xs text-gray-400 mt-1">Dias Ativos</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="text-2xl font-bold text-purple-400">{stats.currentStreak}</div>
              <div className="text-xs text-gray-400 mt-1">Sequência Atual</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="text-2xl font-bold text-orange-400">{stats.longestStreak}</div>
              <div className="text-xs text-gray-400 mt-1">Maior Sequência</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50 w-full">
        <div className="flex items-start gap-3">
          <div className="flex flex-col justify-between text-[10px] text-gray-500 shrink-0" style={{ height: '105px', paddingTop: '15px' }}>
            <div>Dom</div>
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div>Sáb</div>
          </div>

          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="relative mb-1 text-[10px] text-gray-500 font-medium" style={{ height: '15px' }}>
              {monthLabels.map((label, idx) => (
                <div
                  key={idx}
                  className="absolute"
                  style={{
                    left: `${(label.weekIndex / weeks.length) * 100}%`,
                  }}
                >
                  {label.month}
                </div>
              ))}
            </div>

            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${weeks.length}, minmax(11px, 1fr))`,
                gap: '3px',
                maxHeight: '105px'
              }}
            >
              {weeks.map((week, weekIdx) => (
                <div
                  key={weekIdx}
                  className="grid"
                  style={{
                    gridTemplateRows: 'repeat(7, 11px)',
                    gap: '3px'
                  }}
                >
                  {week.map((day, dayIdx) => (
                    <motion.div
                      key={`${weekIdx}-${dayIdx}`}
                      className="w-full h-full rounded-sm relative"
                      style={{
                        backgroundColor: day ? levelColors[day.level] : '#161b22',
                        cursor: day ? 'pointer' : 'default',
                        border: '1px solid rgba(27, 31, 35, 0.06)',
                      }}
                      whileHover={day ? { scale: 1.1, zIndex: 10, boxShadow: '0 0 0 1px rgba(255,255,255,0.2)' } : {}}
                      transition={{ duration: 0.05 }}
                      onMouseEnter={(e) => handleDayHover(day, e)}
                      onMouseLeave={handleDayLeave}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 mt-3 text-[11px] text-gray-500">
              <span>Menos</span>
              <div className="flex gap-[3px]">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="w-[11px] h-[11px] rounded-sm"
                    style={{
                      backgroundColor: levelColors[level],
                      border: '1px solid rgba(27, 31, 35, 0.06)'
                    }}
                  />
                ))}
              </div>
              <span>Mais</span>
            </div>
          </div>
        </div>
      </div>

      {hoveredDay && createPortal(
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-[9999] bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl border border-gray-700 pointer-events-none"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: 'translate(-50%, -100%)',
            maxWidth: 'calc(100vw - 20px)',
            whiteSpace: 'nowrap',
          }}
        >
          <div className="font-semibold text-green-400">
            {hoveredDay.count} {hoveredDay.count === 1 ? 'contribuição' : 'contribuições'}
          </div>
          <div className="text-gray-300 mt-0.5 text-[10px]">
            {formatDate(hoveredDay.date)}
          </div>
        </motion.div>,
        document.body
      )}
    </div>
  );
};

export default GitHubContributions;

