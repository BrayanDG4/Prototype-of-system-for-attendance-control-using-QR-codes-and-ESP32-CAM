import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const statisticsService = {
  async getAdminStatistics() {
    try {
      const response = await axios.get(`${API_URL}/statistics/admin`);
      return response.data;
    } catch (error) {
      console.error("Error fetching admin statistics:", error);
      throw error;
    }
  },
  async getTeacherStatistics(teacherId: string) {
    try {
      const response = await axios.get(
        `${API_URL}/statistics/teacher/${teacherId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching teacher statistics:", error);
      throw error;
    }
  },
  async getStudentStatistics(studentId: string) {
    try {
      const response = await axios.get(
        `${API_URL}/statistics/student/${studentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching student statistics:", error);
      throw error;
    }
  },
};
