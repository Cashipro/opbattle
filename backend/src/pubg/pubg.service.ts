import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PubgService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.pubg.com';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('PUBG_API_KEY');
    console.log('🔑 API Key loaded:', this.apiKey ? '✅ Yes' : '❌ No');
  }

  async searchPlayer(playerName: string) {
    try {
      const encodedName = encodeURIComponent(playerName.trim());
      const url = `${this.baseUrl}/shards/steam/players?filter[playerNames]=${encodedName}`;
      
      console.log('🔍 Fetching:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/vnd.api+json',
        },
      });

      console.log('📡 Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error:', response.status, errorText);
        throw new Error(`PUBG API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Response received');
      return data;
      
    } catch (error) {
      console.error('❌ Fetch error:', error);
      throw error;
    }
  }

  async getPlayerStats(playerId: string) {
    const response = await fetch(
      `${this.baseUrl}/shards/steam/players/${playerId}/seasons/lifetime`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/vnd.api+json',
        },
      }
    );
    return response.json();
  }
}
