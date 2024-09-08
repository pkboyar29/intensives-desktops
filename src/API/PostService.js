import axios from 'axios';
import authHeader from '../utils/getHeaders';

export default class PostService {
  static async getStudenRoles() {
    const response = axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/roles_on_intensives/`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async getCommandsOnIntensive(id) {
    const response = axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/commands_on_intensives/?intensive=${id}`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async getTeachersOnIntensive(id) {
    const response = axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/teachers_on_intensives/?intensive=${id}`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async getAuditorii() {
    const response = axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/auditories/`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async getStage() {
    const response = axios.get(`${process.env.REACT_APP_BACKEND_URL}/stages/`, {
      headers: await authHeader(),
    });
    return response;
  }

  static async getTeachers() {
    const response = axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/teachers/`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async createIntensive(name, description, open_dt, close_dt) {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/intensives/`,
      {
        university: 1,
        name,
        description,
        is_open: true,
        open_dt,
        close_dt,
        roles: [],
        flow: [],
        teachers_command: [],
        files: [],
        stages: [],
      },
      { headers: await authHeader() }
    );
    return response;
  }
  static async updateIntensive(id, name, description, open_dt, close_dt) {
    const response = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/intensives/${id}/`,
      {
        name,
        description,
        is_open: true,
        open_dt,
        close_dt,
        roles: [],
        flow: [],
        teachers_command: [],
        files: [],
        stages: [],
      },
      { headers: await authHeader() }
    );
    return response;
  }

  static async createEvent(
    name,
    description,
    startDate,
    endDate,
    teachers,
    commands,
    stage,
    auditory
  ) {
    const idInt = localStorage.getItem('id');
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/events/`,
      {
        name: name,
        description: description,
        start_dt: startDate,
        finish_dt: endDate,
        stage: stage,
        auditory: auditory,
        mark_strategy: 1,
        result_type: 1,
        intensiv: idInt,
        commands: commands || [],
        teachers_command: teachers || [],
      },
      { headers: await authHeader() }
    );
    return response;
  }

  static async patchEvent(
    name,
    description,
    startDate,
    endDate,
    teachers,
    commands,
    stage,
    auditory,
    typeScore,
    typeResult
  ) {
    const idInt = localStorage.getItem('id');
    const idEvent = localStorage.getItem('idEvent');
    const response = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/events/${idEvent}/`,
      {
        name: name,
        description: description,
        start_dt: startDate,
        finish_dt: endDate,
        stage: stage,
        auditory: auditory,
        mark_strategy: typeScore || 1,
        result_type: typeResult || 1,
        intensiv: idInt,
        commands: commands || [],
        teachers_command: teachers || [],
      },
      { headers: await authHeader() }
    );
    return response;
  }

  static async postStudentsRole(name) {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/roles_on_intensives/`,
      { name: name },
      { headers: await authHeader() }
    );
    return response;
  }

  static async deleteStudentsRole(id) {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/roles_on_intensives/${id}/`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async getIntensiv(id) {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/intensives/${id}`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async deleteIntensive(id) {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/intensives/${id}`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async getIntensives() {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/intensives/`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async getEvents(id) {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/events/?intensiv=${id}`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async getEvent(id) {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/events/${id}/`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async getProfiles() {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/profiles/`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async postProfiles(name) {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/profiles/`,
      { name: name },
      { headers: await authHeader() }
    );
    return response;
  }

  static async deleteProfiles(id) {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/profiles/${id}/`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async getFlows() {
    const response = axios.get(`${process.env.REACT_APP_BACKEND_URL}/flows/`, {
      headers: await authHeader(),
    });
    return response;
  }

  //Страница редактирования профилей

  static async postProfiles(name) {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/profiles/`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async deleteProfiles(id) {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/profiles/${id}/`,
      { headers: await authHeader() }
    );
    return response;
  }

  //Страница статистики

  static async getStatisticsIntensiv(id) {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/statistics/intensiv/${id}`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async getStatisticsCommand(id) {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/statistics/command/${id}`,
      { headers: await authHeader() }
    );
    return response;
  }
}
