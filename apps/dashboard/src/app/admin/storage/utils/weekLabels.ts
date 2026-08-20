/**
 * Week Labels - Provides week labels and mappings for the current year
 */

export interface WeekInfo {
  weekNumber: number;
  weekLabel: string;
  startDate: Date;
  endDate: Date;
  month: number;
  year: number;
}

export class WeekLabels {
  private static readonly currentYear = new Date().getFullYear();
  
  /**
   * Get all 52 weeks of the current year with proper labels
   */
  static getAllWeeks(): WeekInfo[] {
    const weeks: WeekInfo[] = [];
    
    for (let weekNumber = 1; weekNumber <= 52; weekNumber++) {
      const weekInfo = this.getWeekInfo(weekNumber);
      weeks.push(weekInfo);
    }
    
    return weeks;
  }
  
  /**
   * Get specific week information
   */
  static getWeekInfo(weekNumber: number): WeekInfo {
    const firstDayOfYear = new Date(this.currentYear, 0, 1);
    const daysToAdd = (weekNumber - 1) * 7;
    const startDate = new Date(firstDayOfYear.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    
    return {
      weekNumber,
      weekLabel: `W${String(weekNumber).padStart(2, '0')}`,
      startDate,
      endDate,
      month: startDate.getMonth(),
      year: this.currentYear
    };
  }
  
  /**
   * Get weeks for a specific month (6 weeks total: current + surrounding)
   */
  static getWeeksForMonth(month: number): WeekInfo[] {
    const allWeeks = this.getAllWeeks();
    const monthWeeks = allWeeks.filter(week => week.month === month);
    
    if (monthWeeks.length === 0) return [];
    
    // Get the first and last week of the month
    const firstWeekIndex = allWeeks.findIndex(w => w.weekNumber === monthWeeks[0].weekNumber);
    const lastWeekIndex = allWeeks.findIndex(w => w.weekNumber === monthWeeks[monthWeeks.length - 1].weekNumber);
    
    // Get 6 weeks: 2 before, the month weeks, and 2 after (if available)
    const startIndex = Math.max(0, firstWeekIndex - 2);
    const endIndex = Math.min(allWeeks.length - 1, lastWeekIndex + 2);
    const weekCount = endIndex - startIndex + 1;
    
    // If we have more than 6 weeks, take the middle 6
    if (weekCount > 6) {
      const middleIndex = startIndex + Math.floor((endIndex - startIndex) / 2);
      const adjustedStart = Math.max(0, middleIndex - 2);
      const adjustedEnd = Math.min(allWeeks.length - 1, adjustedStart + 5);
      return allWeeks.slice(adjustedStart, adjustedEnd + 1);
    }
    
    return allWeeks.slice(startIndex, endIndex + 1);
  }
  
  /**
   * Get current month weeks (6 weeks total)
   */
  static getCurrentMonthWeeks(): WeekInfo[] {
    const currentMonth = new Date().getMonth();
    return this.getWeeksForMonth(currentMonth);
  }
  
  /**
   * Get 5 consecutive weeks starting from a specific week
   */
  static getFiveWeeks(startWeek: number = 1): WeekInfo[] {
    const allWeeks = this.getAllWeeks();
    const startIndex = Math.max(0, Math.min(startWeek - 1, allWeeks.length - 5));
    return allWeeks.slice(startIndex, startIndex + 5);
  }
  
  /**
   * Find week number by date string
   */
  static findWeekByDateString(dateString: string): WeekInfo | null {
    const allWeeks = this.getAllWeeks();
    
    // Handle YYYY-W## format
    if (dateString.includes('-W')) {
      const match = dateString.match(/W(\d+)/);
      if (match) {
        const weekNumber = parseInt(match[1]);
        return allWeeks.find(w => w.weekNumber === weekNumber) || null;
      }
    }
    
    return null;
  }
}
