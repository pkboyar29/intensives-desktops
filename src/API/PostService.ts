import axios, { AxiosResponse } from 'axios';
import authHeader from '../helpers/getHeaders';

export default class PostService {
  static async getCommandsOnIntensive(
    intensiveId: string | number
  ): Promise<AxiosResponse<any>> {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/commands_on_intensives/?intensive=${intensiveId}`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async getTeachersOnIntensive(
    intensiveId: string | number
  ): Promise<AxiosResponse<any>> {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/teachers_on_intensives/?intensive=${intensiveId}`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async createEvent(
    intensiveId: string | number,
    name: string,
    description: string,
    startDate: string,
    endDate: string,
    stage: string | number,
    auditory: string | number,
    teachers: Array<any>,
    commands: Array<any>
  ): Promise<AxiosResponse<any>> {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/events/`,
      {
        name,
        description,
        start_dt: startDate,
        finish_dt: endDate,
        stage,
        auditory,
        mark_strategy: 1,
        result_type: 1,
        intensiv: intensiveId,
        commands: commands || [],
        teachers_command: teachers || [],
      },
      { headers: await authHeader() }
    );
    return response;
  }

  static async patchEvent(
    intensiveId: string | number,
    eventId: string | number,
    name: string,
    description: string,
    startDate: string,
    endDate: string,
    stage: string | number,
    auditory: string | number,
    teachers: Array<any>,
    commands: Array<any>,
    typeScore?: number,
    typeResult?: number
  ): Promise<AxiosResponse<any>> {
    const response = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}/`,
      {
        name,
        description,
        start_dt: startDate,
        finish_dt: endDate,
        stage,
        auditory,
        mark_strategy: typeScore || 1,
        result_type: typeResult || 1,
        intensiv: intensiveId,
        commands: commands || [],
        teachers_command: teachers || [],
      },
      { headers: await authHeader() }
    );
    return response;
  }

  static async getEvents(intensiveId: string | number): Promise<any> {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/events/?intensiv=${intensiveId}`,
      { headers: await authHeader() }
    );
    return response.data;
  }

  static async getEvent(eventId: string | number): Promise<AxiosResponse<any>> {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}`,
      { headers: await authHeader() }
    );
    return response;
  }

  static async getStatisticsIntensiv(
    intensiveId: string | number
  ): Promise<AxiosResponse<any>> {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/statistics/intensiv/${intensiveId}`,
      { headers: await authHeader() }
    );
    return response;
  }
}
