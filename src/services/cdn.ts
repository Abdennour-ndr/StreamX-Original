import axios from 'axios';

const BUNNY_API_KEY = process.env.NEXT_PUBLIC_BUNNY_API_KEY;
const BUNNY_STORAGE_API_URL = 'https://storage.bunnycdn.com';
const BUNNY_STREAM_API_URL = 'https://video.bunnycdn.com';

export interface StorageFile {
  Guid: string;
  StorageZoneName: string;
  Path: string;
  ObjectName: string;
  Length: number;
  LastChanged: string;
  ServerId: number;
  ArrayNumber: number;
  IsDirectory: boolean;
  UserId: string;
  ContentType: string;
  DateCreated: string;
  StorageZoneId: number;
  Checksum: string;
  ReplicatedZones: string;
}

class CDNService {
  private storageClient = axios.create({
    baseURL: BUNNY_STORAGE_API_URL,
    headers: {
      'AccessKey': BUNNY_API_KEY,
    },
  });

  private streamClient = axios.create({
    baseURL: BUNNY_STREAM_API_URL,
    headers: {
      'AccessKey': BUNNY_API_KEY,
    },
  });

  async uploadFile(file: File, path: string): Promise<StorageFile> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await this.storageClient.post(`/${path}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      await this.storageClient.delete(`/${path}`);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async listFiles(path: string): Promise<StorageFile[]> {
    try {
      const response = await this.storageClient.get(`/${path}`);
      return response.data;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  async createStream(title: string): Promise<any> {
    try {
      const response = await this.streamClient.post('/library', {
        name: title,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating stream:', error);
      throw error;
    }
  }

  async uploadVideo(streamId: string, file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await this.streamClient.post(`/library/${streamId}/videos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }
}

export const cdnService = new CDNService(); 