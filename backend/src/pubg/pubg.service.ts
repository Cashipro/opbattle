import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PubgService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.pubg.com';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('PUBG_API_KEY');
  }

  async searchPlayer(playerName: string) {
    const response = await fetch(
      `${this.baseUrl}/shards/steam/players?filter[playerNames]=${encodeURIComponent(playerName)}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/vnd.api+json'
        }
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
          'Accept': 'application/vnd.api+json'
        }
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
          'Accept': 'application/vnd.api+json'
        }
      }
    );
    return response.json();
  }

  async getPlayerStats(playerId: string) {
    const response = await fetch(
      `${this.baseUrl}/shards/steam/players/${playerId}/seasons/lifetime`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/vnd.api+json'
        }
      }
    );
    return response.json();
  }
}
