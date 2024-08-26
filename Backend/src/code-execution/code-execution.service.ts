import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CodeExecutionService {

  private readonly pistonAPI = axios.create({
    baseURL: "https://emkc.org/api/v2/piston",
  });

  async executeCode(code: string, language: string, version: string): Promise<{ output: string }> {
    try {
      // Submit the code
      const response = await this.pistonAPI.post("/execute", {
        language,
        version,
        files: [
          {
            content: code,
          }
        ]
      });
      
      console.log(response.data)
      return response.data;

    } catch (error) {
      console.error('Error executing code:', error);
      throw new Error(error);
    }
  }
}
