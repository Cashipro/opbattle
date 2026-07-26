import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LiveStream } from './livestream.entity';
import { TournamentsService } from '../tournaments/tournaments.service';

@Injectable()
export class LiveStreamService {
  constructor(
    @InjectRepository(LiveStream)
    private liveStreamRepository: Repository<LiveStream>,
    private tournamentsService: TournamentsService,
  ) {}

  async create(userId: string, data: any): Promise<LiveStream> {
    if (data.tournament_id) {
      const tournament = await this.tournamentsService.findById(data.tournament_id, userId);
      if (!tournament) {
        throw new NotFoundException('Tournament not found');
      }
    }

    let youtubeEmbedUrl = data.youtube_url;
    if (youtubeEmbedUrl) {
      youtubeEmbedUrl = this.getYouTubeEmbedUrl(youtubeEmbedUrl);
    }

    const stream = this.liveStreamRepository.create({
      ...data,
      youtube_embed_url: youtubeEmbedUrl,
      created_by: userId,
      status: 'SCHEDULED',
    });

    return await this.liveStreamRepository.save(stream);
  }

  async findAll(query: any): Promise<{ streams: LiveStream[]; total: number }> {
    const { page = 1, limit = 20, game, country, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (game) where.game_id = game;
    if (country) where.country_id = country;
    if (status) where.status = status;

    const [streams, total] = await this.liveStreamRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { scheduled_at: 'DESC', created_at: 'DESC' },
    });

    return { streams, total };
  }

  async findById(id: string): Promise<LiveStream> {
    const stream = await this.liveStreamRepository.findOne({
      where: { id },
    });

    if (!stream) {
      throw new NotFoundException('Live stream not found');
    }

    return stream;
  }

  async update(id: string, userId: string, data: any): Promise<LiveStream> {
    const stream = await this.findById(id);

    if (stream.created_by !== userId) {
      throw new ForbiddenException('Only stream creator can update');
    }

    if (data.youtube_url) {
      data.youtube_embed_url = this.getYouTubeEmbedUrl(data.youtube_url);
    }

    Object.assign(stream, data);
    return await this.liveStreamRepository.save(stream);
  }

  async delete(id: string, userId: string): Promise<void> {
    const stream = await this.findById(id);

    if (stream.created_by !== userId) {
      throw new ForbiddenException('Only stream creator can delete');
    }

    await this.liveStreamRepository.remove(stream);
  }

  async startStream(id: string, userId: string): Promise<LiveStream> {
    const stream = await this.findById(id);

    if (stream.created_by !== userId) {
      throw new ForbiddenException('Only stream creator can start');
    }

    if (stream.status === 'LIVE') {
      throw new BadRequestException('Stream is already live');
    }

    if (stream.status === 'FINISHED') {
      throw new BadRequestException('Stream has already finished');
    }

    stream.status = 'LIVE';
    stream.started_at = new Date();

    return await this.liveStreamRepository.save(stream);
  }

  async endStream(id: string, userId: string): Promise<LiveStream> {
    const stream = await this.findById(id);

    if (stream.created_by !== userId) {
      throw new ForbiddenException('Only stream creator can end');
    }

    if (stream.status !== 'LIVE') {
      throw new BadRequestException('Stream is not live');
    }

    stream.status = 'FINISHED';
    stream.ended_at = new Date();

    return await this.liveStreamRepository.save(stream);
  }

  async toggleFeature(id: string, userId: string): Promise<LiveStream> {
    const stream = await this.findById(id);

    if (stream.created_by !== userId) {
      throw new ForbiddenException('Only stream creator can toggle feature');
    }

    stream.is_featured = !stream.is_featured;
    return await this.liveStreamRepository.save(stream);
  }

  async getLiveStreams(): Promise<LiveStream[]> {
    return await this.liveStreamRepository.find({
      where: { status: 'LIVE' },
      order: { started_at: 'DESC' },
      take: 10,
    });
  }

  async getUpcomingStreams(): Promise<LiveStream[]> {
    return await this.liveStreamRepository.find({
      where: { status: 'SCHEDULED' },
      order: { scheduled_at: 'ASC' },
      take: 10,
    });
  }

  async getFeaturedStreams(): Promise<LiveStream[]> {
    return await this.liveStreamRepository.find({
      where: { is_featured: true },
      order: { created_at: 'DESC' },
      take: 5,
    });
  }

  async findByTournament(tournamentId: string): Promise<LiveStream[]> {
    return await this.liveStreamRepository.find({
      where: { tournament_id: tournamentId },
      order: { created_at: 'DESC' },
    });
  }

  async findByGame(gameId: string): Promise<LiveStream[]> {
    return await this.liveStreamRepository.find({
      where: { game_id: gameId },
      order: { created_at: 'DESC' },
    });
  }

  async incrementViews(id: string): Promise<{ viewer_count: number }> {
    const stream = await this.findById(id);
    stream.viewer_count += 1;
    await this.liveStreamRepository.save(stream);
    return { viewer_count: stream.viewer_count };
  }

  private getYouTubeEmbedUrl(url: string): string {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/,
      /youtube\.com\/embed\/([^?]+)/,
      /youtube\.com\/live\/([^?]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }

    if (url.includes('youtube.com/embed')) {
      return url;
    }

    return url;
  }

  async getStreamStats(): Promise<any> {
    const total = await this.liveStreamRepository.count();
    const live = await this.liveStreamRepository.count({ where: { status: 'LIVE' } });
    const scheduled = await this.liveStreamRepository.count({ where: { status: 'SCHEDULED' } });
    const finished = await this.liveStreamRepository.count({ where: { status: 'FINISHED' } });
    const featured = await this.liveStreamRepository.count({ where: { is_featured: true } });

    return { total, live, scheduled, finished, featured };
  }
}
