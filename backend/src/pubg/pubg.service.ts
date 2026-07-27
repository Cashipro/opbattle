import { Injectable } from '@nestjs/common';

@Injectable()
export class PubgService {
  // ✅ HARDCODED API KEY (Temporary fix)
  private readonly apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkZWM2MjU4MC02Yjk1LTAxM2YtZjRkMS01MmUzZDQzMTI2MTAiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNzg1MTIxNDk2LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im9wYmF0dGxlIn0.18NDDV70YNsRHkk75zPYGgrGvUjAxVXYuOxpsiR0LS8';
  private readonly baseUrl = 'https://api.pubg.com';

  async searchPlayer(playerName: string) {
    const url = `${this.baseUrl}/shards/steam/players?filter[playerNames]=${encodeURIComponent(playerName.trim())}`;
    
    console.log('🔍 Fetching:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/vnd.api+json',
      },
    });

    console.log('📡 Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error:', response.status, errorText);
      throw new Error(`PUBG API Error: ${response.status}`);
    }

    return response.json();
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

  async getPlayerById(playerId: string) {
    const response = await fetch(
      `${this.baseUrl}/shards/steam/players/${playerId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/vnd.api+json',
        },
      }
    );
    return response.json();
  }

  async getMatch(matchId: string) {
    const response = await fetch(
      `${this.baseUrl}/shards/steam/matches/${matchId}`,
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
